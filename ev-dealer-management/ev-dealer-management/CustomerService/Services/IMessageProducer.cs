namespace CustomerService.Services
{
    public interface IMessageProducer
    {
        void PublishMessage<T>(T message, string routingKey = "");
    }
}