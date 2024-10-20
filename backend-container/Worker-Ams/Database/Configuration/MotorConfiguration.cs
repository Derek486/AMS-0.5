using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Worker_Ams.Entities;

namespace Worker_Ams.Database.Configuration;

public class MotorConfiguration : IEntityTypeConfiguration<Motor>
{
    public void Configure(EntityTypeBuilder<Motor> builder)
    {
        builder.HasKey(u => u.Id);

        builder.HasOne<User>()
            .WithMany(p => p.Motores)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(u => u.Nombre).HasMaxLength(200);

        builder.Property(u => u.Descripcion).HasMaxLength(200);

        builder.Property(u => u.Tipo).HasMaxLength(300);
    }
}
