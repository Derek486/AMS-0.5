using Microsoft.EntityFrameworkCore;
using Worker_Ams.Database.Configuration;
using Worker_Ams.Entities;

namespace Worker_Ams.Database;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{

    internal DbSet<User> Users { get; set; }
    internal DbSet<Motor> Motors { get; set; }
    internal DbSet<Dato> Datos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new MotorConfiguration());
        modelBuilder.ApplyConfiguration(new DatoConfiguration());
    }
}
