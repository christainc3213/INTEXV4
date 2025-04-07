using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using INTEX_II.API.Data;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;
using Microsoft.AspNetCore.Authorization;

namespace INTEX_II.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize]
    public class MainDbController : ControllerBase
    {
        private MainDbController _mainDbContext;
        public MainDbController(MainDbController temp)
        {
            _mainDbContext = temp;
        }

        //[HttpGet]
        //public IActionResult Get()
        //{
        //}

        //[HttpPost]
        //public IActionResult Post()
        //{

        //}

        //[HttpPut]
        //public IActionResult Put()
        //{
        //}

        //[HttpDelete]
        //public IActionResult Delete()
        //{
        //}
    }
}
