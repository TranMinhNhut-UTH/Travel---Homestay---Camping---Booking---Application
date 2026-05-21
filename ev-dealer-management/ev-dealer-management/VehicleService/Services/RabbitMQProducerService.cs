using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace VehicleService.Services
{
    public class RabbitMQProducerService : IMessageProducer
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RabbitMQProducerService> _logger;
        private IConnection? _connection;
        private IModel? _channel;

        public RabbitMQProducerService(IConfiguration configuration, ILogger<RabbitMQProducerService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            InitializeRabbitMQ();
        }

        private void InitializeRabbitMQ()
        {
            try
            {
                var factory = new ConnectionFactory()
                {
                    HostName = _configuration["RabbitMQ:HostName"],
                    Port = int.Parse(_configuration["RabbitMQ:Port"] ?? "5672"),
                    UserName = _configuration["RabbitMQ:UserName"],
                    Password = _configuration["RabbitMQ:Password"]
                };

                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();

                _logger.LogInformation("RabbitMQ producer connection and channel initialized successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not connect to RabbitMQ for publishing. Check connection settings.");
            }
        }

        public void PublishMessage<T>(T message, string routingKey = "")
        {
            if (_channel == null || !_channel.IsOpen)
            {
                _logger.LogWarning("RabbitMQ channel is not open. Attempting to re-initialize for publishing.");
                InitializeRabbitMQ();
                if (_channel == null || !_channel.IsOpen)
                {
                    _logger.LogError("Failed to publish message: RabbitMQ channel is still not open.");
                    return;
                }
            }

            try
            {
                var messageString = JsonSerializer.Serialize(message);
                var body = Encoding.UTF8.GetBytes(messageString);

                // Determine queue name based on routing key or message type
                var queueName = routingKey;
                if (string.IsNullOrEmpty(queueName))
                {
                    queueName = typeof(T).Name switch
                    {
                        "VehicleCreatedEvent" => "vehicle.created",
                        "VehicleUpdatedEvent" => "vehicle.updated", 
                        "VehicleDeletedEvent" => "vehicle.deleted",
                        "VehicleReservedEvent" => "vehicle.reserved",
                        _ => "vehicle.events"
                    };
                }

                // Declare queue if not exists (idempotent)
                _channel.QueueDeclare(
                    queue: queueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null
                );

                // Publish directly to queue (empty exchange = default exchange)
                _channel.BasicPublish(
                    exchange: "",
                    routingKey: queueName,
                    basicProperties: null,
                    body: body
                );

                _logger.LogInformation("Published message of type {MessageType} to queue '{QueueName}'", 
                    typeof(T).Name, queueName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing message of type {MessageType}", typeof(T).Name);
            }
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
            _logger.LogInformation("RabbitMQ producer connection closed.");
        }
    }
}
