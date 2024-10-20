using Worker_Ams.Entities;

namespace Worker_Ams.Repositories.Motors;

public interface IMotorRepository
{
    Task SaveAsync(Motor motor, CancellationToken cancellationToken);
    Task<Motor?> GetById(int motorId);
    Task DeleteAsync(Motor motor, CancellationToken cancellationToken);
    Task<List<Motor>> GetMotors(int userId);
    Task<List<Dato>> GetAccelerationMotors(int motorId);
    Task<List<Dato>> GetVelocidadMotors(int motorId);
    Task<List<Dato>> GetTemperatureMotors(int motorId);
}
