namespace Worker_Ams.Entities;

public sealed class User
{
    private readonly List<Motor> _motor = [];

    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public IReadOnlyCollection<Motor> Motores => _motor.AsReadOnly();
}
