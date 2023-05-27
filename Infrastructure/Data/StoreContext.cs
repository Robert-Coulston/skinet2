using System.Reflection;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                foreach(var entity in modelBuilder.Model.GetEntityTypes()) {
                    var properties = entity.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));
                    var dateAndTimeProperties = entity.ClrType.GetProperties().Where(t => t.PropertyType == typeof(DateTimeOffset));
                    foreach(var property in properties) {
                        modelBuilder.Entity(entity.Name).Property(property.Name).HasConversion<double>();
                    }
                    foreach(var property in dateAndTimeProperties) {
                        modelBuilder.Entity(entity.Name).Property(property.Name).HasConversion(new DateTimeOffsetToBinaryConverter());
                    }
                }
            }
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
    }
}