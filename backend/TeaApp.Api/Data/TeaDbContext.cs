using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Models;
using EFC = Microsoft.EntityFrameworkCore;
using TModels = TeaApp.Api.Models;

namespace TeaApp.Api.Data;

public class TeaDbContext : EFC.DbContext
{
    public TeaDbContext(DbContextOptions<TeaDbContext> uOptions) : base(uOptions) {}

    public DbSet<Tea> TeaDbSet {get;set;}
    public DbSet<TeaReview> TeaReviewDbSet {get;set;}
    public DbSet<BrewingMethod> BrewingMethodDbSet {get;set;}

    protected override void OnModelCreating(ModelBuilder uModelBuilder)
    {
        uModelBuilder.Entity<Tea>().ToTable("TeaTable");
        uModelBuilder.Entity<Tea>().HasKey(xTea => xTea.ID);

        uModelBuilder.Entity<TeaReview>().ToTable("TeaReviewTable");
        uModelBuilder.Entity<TeaReview>().HasKey(xTeaReview => xTeaReview.ID);
        uModelBuilder.Entity<TeaReview>()
        .HasOne(xTeaReview => xTeaReview.Tea)
        .WithMany(xTea => xTea.Reviews)
        .HasForeignKey(xTeaReview => xTeaReview.TeaId);

        uModelBuilder.Entity<BrewingMethod>().ToTable("BrewingMethodTable");
        uModelBuilder.Entity<BrewingMethod>().HasKey(xBrewingMethod => xBrewingMethod.ID);
        uModelBuilder.Entity<BrewingMethod>()
        .HasOne(xBrewingMethod => xBrewingMethod.Tea)
        .WithMany(xTea => xTea.BrewingMethods)
        .HasForeignKey(xBrewingMethod => xBrewingMethod.TeaId);

        uModelBuilder.Entity<BrewingMethod>()
        .Property(xBrewingMethod => xBrewingMethod.BrewingTimes)
        .HasColumnType("jsonb");
    }
}