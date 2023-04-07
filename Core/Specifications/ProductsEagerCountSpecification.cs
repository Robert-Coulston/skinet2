using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsEagerCountSpecification : BaseSpecification<Product>
    {
        public ProductsEagerCountSpecification(ProductSpecParams productParams)
        : base(x =>
            (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) && (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)
        )
        {
        }
    }
}