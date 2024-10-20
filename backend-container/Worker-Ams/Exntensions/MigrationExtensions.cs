using Microsoft.EntityFrameworkCore;
using Worker_Ams.Database;

namespace Worker_Ams.Exntensions;

public static class MigrationExtensions
{
    public static void ApplyMigrations(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();

        using var dbContext = scope.ServiceProvider.GetService<ApplicationDbContext>();

        dbContext?.Database.Migrate();
    }
}
