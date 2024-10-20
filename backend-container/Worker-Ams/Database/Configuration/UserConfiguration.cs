using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Worker_Ams.Entities;

namespace Worker_Ams.Database.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Nombre).HasMaxLength(200);

        builder.Property(u => u.Apellido).HasMaxLength(200);

        builder.Property(u => u.Email).HasMaxLength(300);

        builder.HasIndex(u => u.Email).IsUnique();
    }
}
