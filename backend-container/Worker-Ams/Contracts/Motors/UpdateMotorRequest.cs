namespace Worker_Ams.Contracts.Motors;

public sealed record UpdateMotorRequest(
    int MotorId,
    string Nombre,
    string Descripcion,
    string Tipo
);
