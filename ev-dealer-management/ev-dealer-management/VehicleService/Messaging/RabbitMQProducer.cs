using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace VehicleService.Messaging
{
    public class RabbitMQProducer : IMessageProducer, IDisposable
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private const string ExchangeName = "reservation_events";

        public RabbitMQProducer()
        {
            var factory = new ConnectionFactory { HostName = "localhost" };
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            _channel.ExchangeDeclare(exchange: ExchangeName, type: ExchangeType.Topic, durable: true);
        }

        public void SendMessage<T>(T message, string routingKey)
        {
            var jsonString = JsonSerializer.Serialize(message);
            var body = Encoding.UTF8.GetBytes(jsonString);

            var properties = _channel.CreateBasicProperties();
            properties.Persistent = true;

            _channel.BasicPublish(exchange: ExchangeName,
                                  routingKey: routingKey,
                                  basicProperties: properties,
                                  body: body);

            Console.WriteLine($"🚀 Vehicle Service: Sent event [{routingKey}]");
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
        }
    }
}

