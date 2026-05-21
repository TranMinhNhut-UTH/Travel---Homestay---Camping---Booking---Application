using Microsoft.Extensions.Logging;

namespace CustomerService.Services
{
    /// <summary>
    /// A no-operation message producer that does nothing.
    /// This is used in development environments where RabbitMQ is not available.
    /// It implements the IMessageProducer interface so the application can run without errors.
    /// </summary>
    public class RabbitMQProducerService : IMessageProducer
    {
        private readonly ILogger<RabbitMQProducerService> _logger;

        public RabbitMQProducerService(ILogger<RabbitMQProducerService> logger)
        {
            _logger = logger;
            _logger.LogInformation("Using No-Op RabbitMQProducerService. Messages will not be published.");
        }

        public void PublishMessage<T>(T message, string routingKey = "")
        {
            // This is a no-op implementation. It does nothing.
            // We log the intent to publish for debugging purposes.
            _logger.LogInformation($"NO-OP: Would have published message of type {typeof(T).Name} with routing key '{routingKey}'.");
        }
    }
}
