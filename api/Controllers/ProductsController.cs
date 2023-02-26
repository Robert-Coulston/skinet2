using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        public ProductsController()
        {
        }

        [HttpGet("{id}")]
        public string GetProduct(int id)
        {
            return "This will be a product";
        }
        
        [HttpGet()]
        public string GetProducts()
        {
            return "This will be a list of products";
        }
    }
}
