using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Core.Entities;

namespace api.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string PictureUrl { get; set; }

        public string ProductType { get; set; }

        public string ProductBrand { get; set; }

        public decimal Price { get; set; }

        public static readonly Func<Product, ProductDto>
            Projector =
                (product) =>
                    new ProductDto {
                        Id = product.Id,
                        Name = product.Name,
                        Description = product.Description,
                        PictureUrl = product.PictureUrl,
                        Price = product.Price,
                        ProductBrand = product.ProductBrand.Name,
                        ProductType = product.ProductType.Name
                    };
        // public readonly Func<Product, ProductDto>
        //     Projector2 = (product) => _mapper.Map<Product, ProductDto>(product);
    }
}
