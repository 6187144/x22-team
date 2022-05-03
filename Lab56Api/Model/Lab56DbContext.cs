using Microsoft.EntityFrameworkCore;

namespace Lab56Api.Model;

public class Lab56DbContext : DbContext
{
    public Lab56DbContext(DbContextOptions<Lab56DbContext> options) : base(options)
    {
    }
    public DbSet<Lab56Item>? Lab56Items { get; set; }
}