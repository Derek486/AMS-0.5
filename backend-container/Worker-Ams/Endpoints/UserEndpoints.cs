using Worker.Contracts.Users;
using BC = BCrypt.Net.BCrypt;
using Worker_Ams.Repositories.Users;
using Worker_Ams.Services.Jwt;
using Worker_Ams.Entities;

namespace Worker_Ams.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {

        app.MapPost("api/login", async (
            LoginRequest request,
            IUserRepository userRepository,
            IJwtTokenGenerator jwtTokenGenerator) =>
        {
            var userExist = await userRepository.GetByEmailAsync(request.Email);

            if (userExist is null)
            {
                return Results.NotFound();
            }

            if (BC.Verify(request.Password, hash: userExist.Password))
            {
                var token = jwtTokenGenerator.GenerateToken(userExist);
                return Results.Ok(token);

            }

            return Results.BadRequest("El usuario y/o contrasena es incorrecto.");

        }).WithTags(Tags.Users);

        app.MapGet("api/auth", () =>
        {
            return Results.Ok();
        })
        .RequireAuthorization();

        app.MapPost("api/register", async (
            RegisterRequest request,
            IUserRepository userRepository,
            CancellationToken cancellationToken) =>
        {
            var userExist = await userRepository.GetByEmailAsync(request.Email);

            if (userExist is not null)
            {
                return Results.Conflict("Ya existe una cuenta con este correo");
            }

            var password = BC.HashPassword(request.Password);

            var usuario = new User
            {
                Nombre = request.Nombre,
                Apellido = request.Apellido,
                Email = request.Email,
                Password = password,
            };

            await userRepository.SaveAsync(usuario, cancellationToken);

            return Results.Ok("El usuario se creo exitosamente Juan");

        }).WithTags(Tags.Users);
    }
}
