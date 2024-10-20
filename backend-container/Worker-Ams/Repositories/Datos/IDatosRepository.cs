using Worker_Ams.Entities;

namespace Worker_Ams.Repositories.Datos;

public interface IDatosRepository
{
    Task BulkInsertDatosAsync(List<Dato> datos, CancellationToken cancellationToken);
}
