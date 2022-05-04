#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GatineauerApi.Model;

namespace GatineauerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GatineauerController : ControllerBase
    {
        private readonly GatineauerDbContext _context;

        public GatineauerController(GatineauerDbContext context)
        {
            _context = context;
        }

        // GET: api/Gatineauer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GatineauerItem>>> GetGatineauerItems()
        {
            return await _context.GatineauerItems.ToListAsync();
        }

        // GET: api/Gatineauer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GatineauerItem>> GetGatineauerItem(uint id)
        {
            var GatineauerItem = await _context.GatineauerItems.FindAsync(id);

            if (GatineauerItem == null)
            {
                return NotFound();
            }

            return GatineauerItem;
        }

        // PUT: api/Gatineauer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGatineauerItem(uint id, GatineauerItem GatineauerItem)
        {
            if (id != GatineauerItem.GatineauerItemId)
            {
                return BadRequest();
            }

            _context.Entry(GatineauerItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GatineauerItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Gatineauer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GatineauerItem>> PostGatineauerItem(GatineauerItem GatineauerItem)
        {
            _context.GatineauerItems.Add(GatineauerItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGatineauerItem), new { id = GatineauerItem.GatineauerItemId }, GatineauerItem);
        }
        // DELETE: api/Gatineauer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGatineauerItem(uint id)
        {
            var GatineauerItem = await _context.GatineauerItems.FindAsync(id);
            if (GatineauerItem == null)
            {
                return NotFound();
            }

            _context.GatineauerItems.Remove(GatineauerItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GatineauerItemExists(uint id)
        {
            return _context.GatineauerItems.Any(e => e.GatineauerItemId == id);
        }
    }
}
