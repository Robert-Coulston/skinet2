using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Views
{
    public class ProductLookup
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Brand { get; set; }

        public string Type { get; set; }

        public static readonly Expression<Func<Product, ProductLookup>>
            ProjectorExpression =
                (product) =>
                    new ProductLookup {
                        Id = product.Id,
                        Name = product.Name,
                        Brand = product.ProductBrand.Name,
                        Type = product.ProductType.Name
                    };
    }
}
