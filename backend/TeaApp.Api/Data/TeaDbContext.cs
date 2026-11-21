using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TeaApp.Api.Models;

namespace TeaApp.Api.Data;

public class TeaDbContext(DbContextOptions<TeaDbContext> options) : IdentityDbContext<ApplicationUser>(options) {
    public DbSet<Tea> TeaDbSet { get; set; }
    public DbSet<TeaReview> TeaReviewDbSet { get; set; }
    public DbSet<BrewingMethod> BrewingMethodDbSet { get; set; }
    public DbSet<Flavor> FlavorSet { get; set; }
    public DbSet<RefreshToken> RefreshTokenSet { get; set; }
    public DbSet<TeaWare> TeaWareSet { get; set; }
    public DbSet<Request> RequestSet { get; set; }
    public DbSet<PublishRequest> PublishRequestSet { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Tea>().ToTable("TeaTable");
        modelBuilder.Entity<Tea>().HasKey(tea => tea.Id);

        modelBuilder.Entity<TeaReview>().ToTable("TeaReviewTable");
        modelBuilder.Entity<TeaReview>().HasKey(teaReview => teaReview.Id);
        modelBuilder.Entity<TeaReview>()
        .HasOne(teaReview => teaReview.Tea)
        .WithMany(tea => tea.Reviews)
        .HasForeignKey(teaReview => teaReview.TeaId)
        .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TeaReview>()
        .HasOne(review => review.User)
        .WithMany()
        .HasForeignKey(review => review.UserId)
        .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TeaReview>()
        .HasIndex(review => new {
            review.TeaId,
            review.UserId
        })
        .IsUnique();

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

        modelBuilder.Entity<RefreshToken>().ToTable("RefreshTokenTable");
        modelBuilder.Entity<RefreshToken>().HasKey(token => token.Id);
        modelBuilder.Entity<RefreshToken>().HasIndex(token => token.TokenHash).IsUnique();
        modelBuilder.Entity<RefreshToken>().Property(token => token.TokenHash).IsRequired().HasMaxLength(64);
        modelBuilder.Entity<RefreshToken>().Property(token => token.ReplacedByTokenHash).HasMaxLength(64);
        modelBuilder.Entity<RefreshToken>()
        .HasOne(token => token.User)
        .WithMany()
        .HasForeignKey(token => token.UserId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TeaWare>().ToTable("TeaWareTable");
        modelBuilder.Entity<TeaWare>().HasKey(teaWare => teaWare.Id);
        modelBuilder.Entity<TeaWare>()
        .HasOne(teaWare => teaWare.User)
        .WithMany()
        .HasForeignKey(teaWare => teaWare.OwnerId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Request>()
        .HasOne(request => request.Owner)
        .WithMany()
        .HasForeignKey(request => request.OwnerId)
        .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Request>()
        .HasOne(request => request.ResolvingAdmin)
        .WithMany()
        .HasForeignKey(request => request.ResolvingAdminId)
        .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PublishRequest>().ToTable("PublishRequestTable");
        modelBuilder.Entity<PublishRequest>()
        .HasOne(publishRequest => publishRequest.Request)
        .WithOne()
        .HasForeignKey<PublishRequest>(publishRequest => publishRequest.Id)
        .OnDelete(DeleteBehavior.Cascade);



    }
}