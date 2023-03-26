using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Views;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly StoreContext _context;

        public ProductRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product> GetProductByIdEagerAsync(int id)
        {
            return await _context
                .Products
                .Include(x => x.ProductBrand)
                .Include(x => x.ProductType)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IReadOnlyList<Product>> GetProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<IReadOnlyList<Product>> GetProductsEagerAsync()
        {
            var result =
                await _context
                    .Products
                    .Include(x => x.ProductBrand)
                    .Include(x => x.ProductType)
                    .ToListAsync();
            return result;
        }

        public async Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync()
        {
            return await _context.ProductBrands.ToListAsync();
        }

        public async Task<IReadOnlyList<ProductType>> GetProductTypesAsync()
        {
            return await _context.ProductTypes.ToListAsync();
        }

        public async Task<IReadOnlyList<ProductLookup>> GetProductsLookupAsync()
        {
            var result =
                await _context
                    .Products
                    .Select(ProductLookup.Projector)
                    .ToListAsync();
            return result;
        }
    }
}
