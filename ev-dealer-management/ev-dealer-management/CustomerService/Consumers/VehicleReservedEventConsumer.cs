using CustomerService.DTOs;
using CustomerService.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace CustomerService.Consumers
{
    public class VehicleReservedEventConsumer : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<VehicleReservedEventConsumer> _logger;
        private IConnection? _connection;
        private IModel? _channel;

        public VehicleReservedEventConsumer(
            IServiceScopeFactory scopeFactory,
            ILogger<VehicleReservedEventConsumer> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                // Setup RabbitMQ connection
                var factory = new ConnectionFactory() 
                { 
                    HostName = "localhost",
                    UserName = "guest",
                    Password = "guest"
                };

                _connection = factory.CreateConnection();
                _channel = _connection.CreateModel();

                // Declare exchange and queue
                _channel.ExchangeDeclare(exchange: "vehicle_events", type: "topic", durable: true);
                _channel.QueueDeclare(queue: "customer_vehicle_reserved", durable: true, exclusive: false, autoDelete: false);
                _channel.QueueBind(queue: "customer_vehicle_reserved", exchange: "vehicle_events", routingKey: "vehicle.reserved");

                // Setup consumer
                var consumer = new EventingBasicConsumer(_channel);
                consumer.Received += async (sender, ea) =>
                {
                    try
                    {
                        var body = ea.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);
                        
                        _logger.LogInformation("Received VehicleReservedEvent: {Message}", message);

                        var reservationEvent = JsonSerializer.Deserialize<VehicleReservedEvent>(message);
                        if (reservationEvent != null)
                        {
                            using var scope = _scopeFactory.CreateScope();
                            var customerService = scope.ServiceProvider.GetRequiredService<ICustomerService>();
                            
                            var customer = await customerService.CreateOrUpdateCustomerFromReservationAsync(reservationEvent);
                            _logger.LogInformation("Customer created/updated: {CustomerName} (ID: {CustomerId})", 
                                customer.Name, customer.Id);

                            // Acknowledge message
                            _channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing VehicleReservedEvent");
                        // Reject message and requeue
                        _channel.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: true);
                    }
                };

                _channel.BasicConsume(queue: "customer_vehicle_reserved", autoAck: false, consumer: consumer);

                _logger.LogInformation("VehicleReservedEventConsumer started and waiting for messages...");

                // Keep running until cancelled
                while (!stoppingToken.IsCancellationRequested)
                {
                    await Task.Delay(1000, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in VehicleReservedEventConsumer");
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Stopping VehicleReservedEventConsumer...");
            
            if (_channel != null)
            {
                _channel.Close();
                _channel.Dispose();
            }

            if (_connection != null)
            {
                _connection.Close();
                _connection.Dispose();
            }

            await base.StopAsync(cancellationToken);
        }
    }
}