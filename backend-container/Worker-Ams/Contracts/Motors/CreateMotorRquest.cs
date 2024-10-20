namespace Worker_Ams.Contracts.Motors;

public sealed record CreateMotorRquest(
    int UserId,
    string Nombre,
    string Descripcion,
    string Tipo
);