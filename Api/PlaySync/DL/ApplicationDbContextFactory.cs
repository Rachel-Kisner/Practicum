using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace DL
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

  
            var connectionString = "server=bpgvshmkcxeyex9a3bc6-mysql.services.clever-cloud.com;port=3306;database=bpgvshmkcxeyex9a3bc6;user=uumbluw6xfvugoe8;password=h2Vlntjmk7SLSo3dV2KC;";

            //optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 0));
            optionsBuilder.UseMySql(connectionString, serverVersion, options =>
            {
                options.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(10),
                    errorNumbersToAdd: null);
            });

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}