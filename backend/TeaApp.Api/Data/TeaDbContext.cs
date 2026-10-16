using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Models;

namespace TeaApp.Api.Data;

public class TeaDbContext : DbContext
{
    public TeaDbContext(DbContextOptions<TeaDbContext> uOptions) : base(uOptions) {}

    public DbSet<Tea> TeaDbSet {get;set;}
    public DbSet<TeaReview> TeaReviewDbSet {get;set;}
    public DbSet<BrewingMethod> BrewingMethodDbSet {get;set;}

    protected override void OnModelCreating(ModelBuilder uModelBuilder)
    {
        uModelBuilder.Entity<Tea>().ToTable("TeaTable");
        uModelBuilder.Entity<Tea>().HasKey(xTea => xTea.id);

        uModelBuilder.Entity<TeaReview>().ToTable("TeaReviewTable");
        uModelBuilder.Entity<TeaReview>().HasKey(xTeaReview => xTeaReview.id);
        uModelBuilder.Entity<TeaReview>()
        .HasOne(xTeaReview => xTeaReview.tea)
        .WithMany(xTea => xTea.reviews)
        .HasForeignKey(xTeaReview => xTeaReview.teaId)
        .OnDelete(DeleteBehavior.Cascade);

        uModelBuilder.Entity<BrewingMethod>().ToTable("BrewingMethodTable");
        uModelBuilder.Entity<BrewingMethod>().HasKey(xBrewingMethod => xBrewingMethod.id);
        uModelBuilder.Entity<BrewingMethod>()
        .HasOne(xBrewingMethod => xBrewingMethod.tea)
        .WithMany(xTea => xTea.brewingMethods)
        .HasForeignKey(xBrewingMethod => xBrewingMethod.teaId)
        .OnDelete(DeleteBehavior.Cascade);

        uModelBuilder.Entity<BrewingMethod>()
        .Property(xBrewingMethod => xBrewingMethod.brewingTimes)
        .HasColumnType("jsonb");
    }
}