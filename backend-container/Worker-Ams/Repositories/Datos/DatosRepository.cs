using EFCore.BulkExtensions;
using Worker_Ams.Database;
using Worker_Ams.Entities;

namespace Worker_Ams.Repositories.Datos;

public class DatosRepository(ApplicationDbContext dbContext) : IDatosRepository
{
    public async Task BulkInsertDatosAsync(List<Dato> datos, CancellationToken cancellationToken)
    {
        await dbContext.BulkInsertAsync(datos, cancellationToken: cancellationToken);
    }
}
