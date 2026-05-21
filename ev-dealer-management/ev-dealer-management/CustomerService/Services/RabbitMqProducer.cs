using System.Text;
using System.Text.Json;

namespace CustomerService.Services;

// This is a dummy implementation for demonstration purposes.
// In a real application, this would connect to RabbitMQ.
public class RabbitMqProducer : IMessageProducer
{
    public void PublishMessage<T>(T message, string routingKey)
    {
        var messageString = JsonSerializer.Serialize(message);
        Console.WriteLine($"DUMMY RABBITMQ: Publishing message to routing key '{routingKey}': {messageString}");
        // In a real implementation, you would use the RabbitMQ client library
        // to connect to the broker and publish the message.
    }
}
