using System.Threading.Tasks;

namespace ev_dealer_reporting.Services
{
    public interface IDataSynchronizationService
    {
        Task SynchronizeSalesDataAsync();
        Task SynchronizeInventoryDataAsync();
        Task SynchronizeAllDataAsync();
    }
}
