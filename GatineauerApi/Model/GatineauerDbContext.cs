using Microsoft.EntityFrameworkCore;

namespace GatineauerApi.Model;

public class GatineauerDbContext : DbContext
{
    public GatineauerDbContext(DbContextOptions<GatineauerDbContext> options) : base(options)
    {
    }
    public DbSet<GatineauerItem>? GatineauerItems { get; set; }
}