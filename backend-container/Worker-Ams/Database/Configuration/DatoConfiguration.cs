using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Worker_Ams.Entities;

namespace Worker_Ams.Database.Configuration;

public class DatoConfiguration : IEntityTypeConfiguration<Dato>
{
    public void Configure(EntityTypeBuilder<Dato> builder)
    {
        builder.HasKey(u => u.Id);

        builder.HasOne<Motor>()
            .WithMany(p => p.Datos)
            .HasForeignKey(o => o.MotorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(u => u.Value)
           .HasColumnType("decimal(18,16)")
           .IsRequired();

        builder.Property(u => u.Axis).HasMaxLength(200);

        builder.Property(u => u.Medicion).HasMaxLength(300);

    }
}
