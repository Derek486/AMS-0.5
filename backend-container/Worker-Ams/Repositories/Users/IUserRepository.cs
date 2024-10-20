using Worker_Ams.Entities;

namespace Worker_Ams.Repositories.Users;

public interface IUserRepository
{
    Task SaveAsync(User user, CancellationToken cancellationToken);
    Task<User?> GetById(int userId);
    Task<User?> GetByEmailAsync(string email);
}
