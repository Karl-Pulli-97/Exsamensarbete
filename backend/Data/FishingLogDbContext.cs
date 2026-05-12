using FishingLog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FishingLog.Api.Data;

public class FishingLogDbContext : DbContext
{
    public FishingLogDbContext(DbContextOptions<FishingLogDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<CatchEntry> CatchEntries => Set<CatchEntry>();
    public DbSet<Species> Species => Set<Species>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Lure> Lures => Set<Lure>();
    public DbSet<FishingTrip> FishingTrips => Set<FishingTrip>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Email).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<Species>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(x => x.Name).IsUnique();
        });

        modelBuilder.Entity<Location>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(150);
        });

        modelBuilder.Entity<Lure>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Type).HasMaxLength(50);
            entity.Property(x => x.Color).HasMaxLength(50);
            entity.Property(x => x.Brand).HasMaxLength(100);
        });

        modelBuilder.Entity<FishingTrip>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasOne(x => x.User)
                .WithMany(x => x.FishingTrips)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(x => x.Location)
                .WithMany(x => x.FishingTrips)
                .HasForeignKey(x => x.LocationId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<CatchEntry>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Weight).HasPrecision(6, 2);
            entity.Property(x => x.Length).HasPrecision(6, 2);

            entity.HasOne(x => x.User)
                .WithMany(x => x.CatchEntries)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Species)
                .WithMany(x => x.CatchEntries)
                .HasForeignKey(x => x.SpeciesId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Location)
                .WithMany(x => x.CatchEntries)
                .HasForeignKey(x => x.LocationId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.Lure)
                .WithMany(x => x.CatchEntries)
                .HasForeignKey(x => x.LureId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.FishingTrip)
                .WithMany(x => x.CatchEntries)
                .HasForeignKey(x => x.FishingTripId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(x => x.UserId);
            entity.HasIndex(x => x.SpeciesId);
            entity.HasIndex(x => x.CaughtAt);
        });
    }
}
