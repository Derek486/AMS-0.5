namespace Worker.Contracts.Users;

public sealed record RegisterRequest(
    string Nombre,
    string Apellido,
    string Email,
    string Password
);
