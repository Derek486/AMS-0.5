namespace Worker_Ams.Entities;

public sealed class Dato
{
    public int Id { get; set; }
    public int MotorId { get; set; }
    public decimal Value { get; set; }
    public string Axis { get; set; } = string.Empty;
    public string Medicion { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
}
