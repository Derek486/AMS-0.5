namespace Worker_Ams.Entities;

public sealed class Motor
{
    public int UserId { get; set; }
    private readonly List<Dato> _datos = [];
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public IReadOnlyCollection<Dato> Datos => _datos.AsReadOnly();

    public void Update(
        string nombre,
        string descripcion,
        string tipo
    )
    {
        if (nombre == Nombre
        && descripcion == Descripcion
        && tipo == Tipo)
        {
            return;
        }

        Nombre = nombre;
        Descripcion = descripcion;
        Tipo = tipo;
    }
}
