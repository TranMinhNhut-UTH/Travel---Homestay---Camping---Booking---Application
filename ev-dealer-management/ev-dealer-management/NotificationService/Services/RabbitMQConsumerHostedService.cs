using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NotificationService.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace NotificationService.Services
{
    public class RabbitMQConsumerHostedService : IHostedService, IDisposable
    {
        private readonly IMessageConsumer _messageConsumer;
        private readonly ILogger<RabbitMQConsumerHostedService> _logger;

        public RabbitMQConsumerHostedService(IMessageConsumer messageConsumer, ILogger<RabbitMQConsumerHostedService> logger)
        {
            _messageConsumer = messageConsumer;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("RabbitMQ Consumer Hosted Service running.");
            _messageConsumer.StartConsuming();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("RabbitMQ Consumer Hosted Service is stopping.");
            _messageConsumer.StopConsuming();
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            // Dispose of managed resources if any
        }
    }
}
