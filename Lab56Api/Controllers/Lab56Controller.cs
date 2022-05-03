#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab56Api.Model;

namespace Lab56Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Lab56Controller : ControllerBase
    {
        private readonly Lab56DbContext _context;

        public Lab56Controller(Lab56DbContext context)
        {
            _context = context;
        }

        // GET: api/Lab56
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lab56Item>>> GetLab56Items()
        {
            return await _context.Lab56Items.ToListAsync();
        }

        // GET: api/Lab56/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lab56Item>> GetLab56Item(uint id)
        {
            var Lab56Item = await _context.Lab56Items.FindAsync(id);

            if (Lab56Item == null)
            {
                return NotFound();
            }

            return Lab56Item;
        }

        // PUT: api/Lab56/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLab56Item(uint id, Lab56Item Lab56Item)
        {
            if (id != Lab56Item.Lab56ItemId)
            {
                return BadRequest();
            }

            _context.Entry(Lab56Item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Lab56ItemExists(id))
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

        // POST: api/Lab56
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Lab56Item>> PostLab56Item(Lab56Item Lab56Item)
        {
            _context.Lab56Items.Add(Lab56Item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLab56Item), new { id = Lab56Item.Lab56ItemId }, Lab56Item);
        }
     

        private bool Lab56ItemExists(uint id)
        {
            return _context.Lab56Items.Any(e => e.Lab56ItemId == id);
        }
    }
}
