namespace Worker_Ams.Services.Kafka;

public class KafkaSettings
{
    public string BootstrapServers { get; set; } = null!;
    public string Topic { get; set; } = null!;
}
