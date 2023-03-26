using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Core.Views;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IGenericRepository<Product> _prodRepository;
        private readonly IGenericRepository<ProductBrand> _prodBrandRepository;
        private readonly IGenericRepository<ProductType> _prodTypeRepository;

        public ProductsController(
            IProductRepository productRepository, 
            IGenericRepository<Product> prodRepository,
            IGenericRepository<ProductBrand> prodBrandRepository,
            IGenericRepository<ProductType> prodTypeRepository
        )
        {
            _prodRepository = prodRepository;
            _prodBrandRepository = prodBrandRepository;
            _prodTypeRepository = prodTypeRepository;
            _productRepository = productRepository;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            // var product = await _productRepository.GetProductByIdAsync(id);
            var product = await _prodRepository.GetByIdAsync(id);
            return Ok(product);
        }

        [HttpGet("{id}/eager")]
        public async Task<ActionResult<Product>> GetProductEager(int id)
        {
            // var product = await _productRepository.GetProductByIdEagerAsync(id);
            var spec = new ProductsEagerSpecification(id);
            var product = await _prodRepository.GetEntityWithSpec(spec);
            return Ok(product);
        }

        [HttpGet("lookup")]
        public async Task<ActionResult<IReadOnlyList<ProductLookup>>>
        GetProductsLookup()
        {
            var products = await _productRepository.GetProductsLookupAsync();
            return Ok(products);
        }

        [HttpGet()] 
        public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts()
        {
            var products = await _productRepository.GetProductsAsync();
            return Ok(products);
        }

        [HttpGet("eager")]
        public async Task<ActionResult<IReadOnlyList<Product>>> GetProductsEager()
        {
            // var products = await _productRepository.GetProductsEagerAsync();
            var spec = new ProductsEagerSpecification();
            var products = await _prodRepository.ListAsync(spec);
            return Ok(products);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>>
        GetProductBrands()
        {
            // var productBrands =
            //     await _productRepository.GetProductBrandsAsync();
            var productBrands =
                await _prodBrandRepository.ListAllAsync();
            return Ok(productBrands);
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>>
        GetProductTypes()
        {
            // var productTypes = await _productRepository.GetProductTypesAsync();
            var productTypes = await _prodTypeRepository.ListAllAsync();
            return Ok(productTypes);
        }
    }
}
