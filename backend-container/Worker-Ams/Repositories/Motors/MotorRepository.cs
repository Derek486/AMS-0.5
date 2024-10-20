using Microsoft.EntityFrameworkCore;
using Worker_Ams.Database;
using Worker_Ams.Entities;

namespace Worker_Ams.Repositories.Motors;

public class MotorRepository(ApplicationDbContext dbContext) : IMotorRepository
{
    public async Task DeleteAsync(Motor motor, CancellationToken cancellationToken)
    {
        dbContext.Motors.Remove(motor);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Dato>> GetAccelerationMotors(int motorId)
    {
        return await dbContext.Datos.Where(d => d.MotorId == motorId
            && d.Medicion == "acceleration")
            .ToListAsync();
    }

    public async Task<Motor?> GetById(int motorId)
    {
        return await dbContext.Motors.SingleOrDefaultAsync(a => a.Id == motorId);
    }

    public async Task<List<Motor>> GetMotors(int userId)
    {
        return await dbContext.Motors.Where(m => m.UserId == userId).ToListAsync();
    }

    public async Task<List<Dato>> GetTemperatureMotors(int motorId)
    {
        return await dbContext.Datos.Where(d => d.MotorId == motorId
            && d.Medicion == "temperature").ToListAsync();
    }

    public async Task<List<Dato>> GetVelocidadMotors(int motorId)
    {
        return await dbContext.Datos.Where(d => d.MotorId == motorId
            && d.Medicion == "velocity").ToListAsync();
    }

    public async Task SaveAsync(Motor motor, CancellationToken cancellationToken)
    {
        dbContext.Add(motor);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
