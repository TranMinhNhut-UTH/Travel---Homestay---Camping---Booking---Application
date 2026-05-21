namespace SalesService.Services;

/// <summary>
/// Interface for publishing messages to RabbitMQ
/// </summary>
public interface IMessagePublisher
{
    /// <summary>
    /// Publishes a message to a RabbitMQ queue
    /// </summary>
    /// <typeparam name="T">Type of the message object</typeparam>
    /// <param name="queueName">Name of the queue</param>
    /// <param name="message">Message object to publish</param>
    void PublishMessage<T>(string queueName, T message);
    
    /// <summary>
    /// Publishes a message to a RabbitMQ queue asynchronously
    /// </summary>
    /// <typeparam name="T">Type of the message object</typeparam>
    /// <param name="queueName">Name of the queue</param>
    /// <param name="message">Message object to publish</param>
    Task PublishMessageAsync<T>(string queueName, T message);
}

