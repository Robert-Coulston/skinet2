using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsEagerCountSpecification : BaseSpecification<Product>
    {
        public ProductsEagerCountSpecification(
            ProductSpecParams productParams
        ) :
            base(
                product =>
                    (
                    !productParams.BrandId.HasValue ||
                    product.ProductBrandId == productParams.BrandId
                    ) &&
                    (
                    !productParams.TypeId.HasValue ||
                    product.ProductTypeId == productParams.TypeId
                    ) &&
                    (
                    string.IsNullOrEmpty(productParams.Search) ||
                    product.Name.ToLower().Contains(productParams.Search)
                    )
            )
        {
        }
    }
}
