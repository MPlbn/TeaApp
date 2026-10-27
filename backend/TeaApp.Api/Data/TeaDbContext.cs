using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Models;

namespace TeaApp.Api.Data;

public class TeaDbContext : DbContext
{
    public TeaDbContext(DbContextOptions<TeaDbContext> options) : base(options) {}

    public DbSet<Tea> TeaDbSet {get;set;}
    public DbSet<TeaReview> TeaReviewDbSet {get;set;}
    public DbSet<BrewingMethod> BrewingMethodDbSet {get;set;}
    public DbSet<Flavor> FlavorSet {get;set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tea>().ToTable("TeaTable");
        modelBuilder.Entity<Tea>().HasKey(tea => tea.Id);

        modelBuilder.Entity<TeaReview>().ToTable("TeaReviewTable");
        modelBuilder.Entity<TeaReview>().HasKey(teaReview => teaReview.Id);
        modelBuilder.Entity<TeaReview>()
        .HasOne(teaReview => teaReview.Tea)
        .WithMany(tea => tea.Reviews)
        .HasForeignKey(teaReview => teaReview.TeaId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BrewingMethod>().ToTable("BrewingMethodTable");
        modelBuilder.Entity<BrewingMethod>().HasKey(brewingMethod => brewingMethod.Id);
        modelBuilder.Entity<BrewingMethod>()
        .HasOne(brewingMethod => brewingMethod.Tea)
        .WithMany(tea => tea.BrewingMethods)
        .HasForeignKey(brewingMethod => brewingMethod.TeaId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BrewingMethod>()
        .Property(brewingMethod => brewingMethod.BrewingTimes)
        .HasColumnType("jsonb");

        modelBuilder.Entity<Flavor>().ToTable("FlavorTable");
        modelBuilder.Entity<Flavor>().HasKey(flavor => flavor.Id);
        modelBuilder.Entity<Flavor>()
        .HasOne(flavor => flavor.Tea)
        .WithMany(tea => tea.Flavors)
        .HasForeignKey(flavor => flavor.TeaId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}