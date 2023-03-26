using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Views;

namespace Core.Interfaces
{
    public interface IProductRepository 
    {
        Task<Product> GetProductByIdAsync(int id);
        Task<Product> GetProductByIdEagerAsync(int id);
        Task<IReadOnlyList<Product>> GetProductsAsync();
        Task<IReadOnlyList<ProductLookup>> GetProductsLookupAsync();
        Task<IReadOnlyList<Product>> GetProductsEagerAsync();
        Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync();
        Task<IReadOnlyList<ProductType>> GetProductTypesAsync();
    }
}