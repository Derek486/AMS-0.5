using Microsoft.EntityFrameworkCore;
using Worker_Ams.Database;
using Worker_Ams.Entities;

namespace Worker_Ams.Repositories.Users;

public class UserRepository(ApplicationDbContext dbContext) : IUserRepository
{
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await dbContext.Users
            .Where(u => u.Email == email)
            .FirstOrDefaultAsync();
    }

    public async Task<User?> GetById(int userId)
    {
        return await dbContext.Users.SingleOrDefaultAsync(a => a.Id == userId);
    }

    public async Task SaveAsync(User user, CancellationToken cancellationToken)
    {
        dbContext.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
