using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using AutoMapper;
using Core.Entities;
using api.Dtos;

namespace api.Helpers
{
    public class
    ProductUrlResolver
    : IValueResolver<Product, ProductDto, string>
    {
        private readonly IConfiguration _config;


        public ProductUrlResolver(
            IConfiguration config
        )
        {
            _config = config;
        }

        public string
        Resolve(
            Product source,
            ProductDto destination,
            string destMember,
            ResolutionContext context
        )
        {
            if (!string.IsNullOrEmpty(source.PictureUrl))
            {
                return _config["ApiUrl"] + source.PictureUrl;
            
            }
            return null;
        }
    }
}
