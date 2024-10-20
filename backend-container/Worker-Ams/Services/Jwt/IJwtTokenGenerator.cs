using Worker_Ams.Entities;

namespace Worker_Ams.Services.Jwt;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
