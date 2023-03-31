using api.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class BuggyController: BaseApiController
    {
        private readonly StoreContext _context;
        public BuggyController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("not-found")]
        public ActionResult GetNotFoundRequest()
        {
            var thing = _context.Products.Find(999);

            if (thing == null)
            {
                return NotFound(new ApiResponse(404));
            }
            
            return Ok();
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            var thing = _context.Products.Find(999);
            thing.ToString(); // Server Error

            if (thing == null)
            {
                return NotFound();
            }
            
            return Ok();
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            var thing = _context.Products.Find(999);
            
            return BadRequest(new ApiResponse(400));
        }

        [HttpGet("bad-request/{id}")]
        public ActionResult GetBadRequest(int id)
        {
            var thing = _context.Products.Find(999);
            
            return BadRequest();
        }


    }
}