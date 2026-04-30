using Microsoft.EntityFrameworkCore;

namespace MyJobs.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ProjectEntity> Projects => Set<ProjectEntity>();
    public DbSet<PricingTierEntity> PricingTiers => Set<PricingTierEntity>();
    public DbSet<PricingFaqEntity> PricingFaqs => Set<PricingFaqEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProjectEntity>().HasKey(x => x.DbId);
        modelBuilder.Entity<ProjectStackEntity>().HasKey(x => x.DbId);
        modelBuilder.Entity<ProjectGalleryEntity>().HasKey(x => x.DbId);
        modelBuilder.Entity<ProjectApproachEntity>().HasKey(x => x.DbId);
        modelBuilder.Entity<ProjectOutcomeEntity>().HasKey(x => x.DbId);
        modelBuilder.Entity<ProjectReferenceEntity>().HasKey(x => x.DbId);
        modelBuilder.Entity<PricingTierEntity>().HasKey(x => x.DbId);
        modelBuilder.Entity<PricingTierBulletEntity>().HasKey(x => x.DbId);
        modelBuilder.Entity<PricingFaqEntity>().HasKey(x => x.DbId);

        modelBuilder.Entity<ProjectEntity>()
            .HasIndex(x => new { x.Locale, x.Slug })
            .IsUnique();

        modelBuilder.Entity<ProjectEntity>()
            .HasIndex(x => new { x.Locale, x.Id })
            .IsUnique();

        modelBuilder.Entity<ProjectEntity>()
            .HasMany(x => x.Stack)
            .WithOne(x => x.Project)
            .HasForeignKey(x => x.ProjectEntityDbId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectEntity>()
            .HasMany(x => x.Gallery)
            .WithOne(x => x.Project)
            .HasForeignKey(x => x.ProjectEntityDbId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectEntity>()
            .HasMany(x => x.Approach)
            .WithOne(x => x.Project)
            .HasForeignKey(x => x.ProjectEntityDbId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectEntity>()
            .HasMany(x => x.Outcome)
            .WithOne(x => x.Project)
            .HasForeignKey(x => x.ProjectEntityDbId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectEntity>()
            .HasMany(x => x.References)
            .WithOne(x => x.Project)
            .HasForeignKey(x => x.ProjectEntityDbId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PricingTierEntity>()
            .HasIndex(x => new { x.Locale, x.Key })
            .IsUnique();

        modelBuilder.Entity<PricingTierEntity>()
            .HasMany(x => x.Bullets)
            .WithOne(x => x.PricingTier)
            .HasForeignKey(x => x.PricingTierEntityDbId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
