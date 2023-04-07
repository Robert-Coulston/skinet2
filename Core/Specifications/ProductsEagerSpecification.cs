using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsEagerSpecification : BaseSpecification<Product>
    {
        public ProductsEagerSpecification(ProductSpecParams productParams) :
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
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
            AddOrderBy(x => x.Name);

            if (!string.IsNullOrEmpty(productParams.Sort))
            {
                switch (productParams.Sort)
                {
                    case "priceAsc":
                        {
                            AddOrderBy(p => p.Price);
                            break;
                        }
                    case "priceDesc":
                        {
                            AddOrderByDescending(p => p.Price);
                            break;
                        }
                    default:
                        {
                            AddOrderBy(x => x.Name);
                            break;
                        }
                }
            }
        }

        public ProductsEagerSpecification(int id) :
            base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }
    }
}
