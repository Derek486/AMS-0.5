using System.Text.Json;
using Confluent.Kafka;
using Microsoft.Extensions.Options;
using Worker_Ams.Entities;
using Worker_Ams.Repositories.Datos;

namespace Worker_Ams.Services.Kafka;

public class Consumer : BackgroundService
{
    private readonly KafkaSettings _kafkaSettings;
    private readonly IServiceProvider _serviceProvider;
    private readonly int _batchSize = 5;
    private DateTime _lastMessageTime = DateTime.UtcNow;
    private readonly List<Dato> _datosList = new List<Dato>();
    private readonly IConsumer<Ignore, string> _consumer;

    public Consumer(IOptions<KafkaSettings> kafkaSettings, IServiceProvider serviceProvider)
    {
        _kafkaSettings = kafkaSettings.Value;
        _serviceProvider = serviceProvider;

        var consumerConfig = new ConsumerConfig
        {
            BootstrapServers = _kafkaSettings.BootstrapServers,
            GroupId = "test-bobis",
            AutoOffsetReset = AutoOffsetReset.Latest
        };

        _consumer = new ConsumerBuilder<Ignore, string>(consumerConfig).Build();
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.Run(() => StartConsumerLoop(stoppingToken), stoppingToken);
    }

    private async Task StartConsumerLoop(CancellationToken cancellationToken)
    {
        _consumer.Subscribe(_kafkaSettings.Topic);

        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    var consumeResult = _consumer.Consume(cancellationToken);
                    var dato = ParseMessage(consumeResult.Message.Value);
                    Console.WriteLine($"{dato.Value} {dato.Timestamp}");
                    _datosList.Add(dato);
                    _lastMessageTime = DateTime.UtcNow;

                    if (_datosList.Count >= _batchSize)
                    {
                        await InsertPendingMessagesAsync(cancellationToken);
                    }
                }
                catch (ConsumeException e)
                {
                    Console.WriteLine($"Error consumiendo mensaje: {e.Error.Reason}");
                }

                if (DateTime.UtcNow - _lastMessageTime > TimeSpan.FromSeconds(10))
                {
                    await InsertPendingMessagesAsync(cancellationToken);
                }
            }
        }
        catch (OperationCanceledException)
        {
            _consumer.Close();
        }
    }

    private async Task InsertPendingMessagesAsync(CancellationToken cancellationToken)
    {
        if (_datosList.Count > 0)
        {
            using var scope = _serviceProvider.CreateScope();
            var datosRepository = scope.ServiceProvider.GetRequiredService<IDatosRepository>();

            await datosRepository.BulkInsertDatosAsync(_datosList, cancellationToken);
            _datosList.Clear();
        }
    }

    private static Dato ParseMessage(string message)
    {
        return JsonSerializer.Deserialize<Dato>(message)!;
    }

    public override void Dispose()
    {
        _consumer.Close();
        _consumer.Dispose();
        base.Dispose();
    }
}
