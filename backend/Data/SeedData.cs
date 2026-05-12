using FishingLog.Api.Models;

namespace FishingLog.Api.Data;

public static class SeedData
{
    public static readonly Guid TestUserId =
        Guid.Parse("11111111-1111-1111-1111-111111111111");

    public static void Initialize(FishingLogDbContext context)
    {
        if (context.Users.Any()) return;

        // ── User ──
        var user = new User
        {
            Id = TestUserId,
            Email = "karl@test.com",
            Name = "Karl",
            Password = BCrypt.Net.BCrypt.HashPassword("test123")
        };
        context.Users.Add(user);

        // ── Species ──
        var abborre = new Species { Id = Guid.NewGuid(), Name = "Abborre" };
        var gadda = new Species { Id = Guid.NewGuid(), Name = "Gädda" };
        var gos = new Species { Id = Guid.NewGuid(), Name = "Gös" };
        var oring = new Species { Id = Guid.NewGuid(), Name = "Öring" };
        var regnbage = new Species { Id = Guid.NewGuid(), Name = "Regnbåge" };
        var mort = new Species { Id = Guid.NewGuid(), Name = "Mört" };

        var allSpecies = new[] { abborre, gadda, gos, oring, regnbage, mort };
        context.Species.AddRange(allSpecies);

        // ── Locations ──
        var vanern = new Location
        {
            Id = Guid.NewGuid(),
            Name = "Vänern",
            Latitude = 58.9,
            Longitude = 13.5,
            Description = "Sveriges största sjö"
        };
        var vattern = new Location
        {
            Id = Guid.NewGuid(),
            Name = "Vättern",
            Latitude = 58.4,
            Longitude = 14.6,
            Description = "Djup och klar sjö"
        };
        var hornborga = new Location
        {
            Id = Guid.NewGuid(),
            Name = "Hornborgasjön",
            Latitude = 58.3,
            Longitude = 13.5,
            Description = "Grund och fågelrik"
        };
        var unden = new Location
        {
            Id = Guid.NewGuid(),
            Name = "Unden",
            Latitude = 58.7,
            Longitude = 14.4,
            Description = "Djup sjö med öring"
        };
        var grosken = new Location
        {
            Id = Guid.NewGuid(),
            Name = "Grosken",
            Description = "Liten hemlig sjö"
        };

        var allLocations = new[] { vanern, vattern, hornborga, unden, grosken };
        context.Locations.AddRange(allLocations);

        // ── Lures ──
        var toby = new Lure { Id = Guid.NewGuid(), Name = "Abu Garcia Toby", Type = "Skeddrag", Color = "Silver", Brand = "Abu Garcia" };
        var rapala = new Lure { Id = Guid.NewGuid(), Name = "Rapala Original", Type = "Wobbler", Color = "Röd/vit", Brand = "Rapala" };
        var spinnare = new Lure { Id = Guid.NewGuid(), Name = "Savage Gear Rotex Spinner", Type = "Spinnare", Color = "Firetiger", Brand = "Savage Gear" };
        var jigg = new Lure { Id = Guid.NewGuid(), Name = "Kopito Shad", Type = "Jigg", Color = "Motoroil", Brand = "Westin" };
        var wobbler = new Lure { Id = Guid.NewGuid(), Name = "Salmo Hornet", Type = "Wobbler", Color = "Perch", Brand = "Salmo" };
        var fluga = new Lure { Id = Guid.NewGuid(), Name = "Woolly Bugger", Type = "Fluga", Color = "Svart", Brand = "Generisk" };
        var mask = new Lure { Id = Guid.NewGuid(), Name = "Daggmask", Type = "Naturligt bete", Color = "Brun" };

        var allLures = new[] { toby, rapala, spinnare, jigg, wobbler, fluga, mask };
        context.Lures.AddRange(allLures);

        // ── CatchEntries ──
        var random = new Random(42);
        var catches = new List<CatchEntry>();

        var techniques = new[] { "Spinnfiske", "Mete", "Flugfiske", "Trolling", "Pimpel" };
        var weatherOptions = new[] { "Soligt", "Mulet", "Regn", "Vind", "Klart" };

        // Genererar 40 fångster
        for (int i = 0; i < 40; i++)
        {
            var species = allSpecies[random.Next(allSpecies.Length)];
            var location = allLocations[random.Next(allLocations.Length)];
            var lure = allLures[random.Next(allLures.Length)];

            var daysAgo = random.Next(0, 180);
            var caughtAt = DateTime.UtcNow.AddDays(-daysAgo)
                .AddHours(random.Next(5, 22))
                .AddMinutes(random.Next(0, 60));

            decimal weight = species == gadda ? (decimal)(random.NextDouble() * 13 + 1) :
                            species == abborre ? (decimal)(random.NextDouble() * 2 + 0.3) :
                            species == gos ? (decimal)(random.NextDouble() * 6 + 0.2) :
                            species == oring || species == regnbage ? (decimal)(random.NextDouble() * 3 + 0.5) :
                            (decimal)(random.NextDouble() * 1.5 + 0.2);

            decimal length = species == gadda ? (decimal)(random.NextDouble() * 60 + 60) :
                            species == abborre ? (decimal)(random.NextDouble() * 25 + 25) :
                            species == gos ? (decimal)(random.NextDouble() * 40 + 40) :
                            species == oring || species == regnbage ? (decimal)(random.NextDouble() * 30 + 30) :
                            (decimal)(random.NextDouble() * 25 + 15);

            catches.Add(new CatchEntry
            {
                Id = Guid.NewGuid(),
                UserId = TestUserId,
                SpeciesId = species.Id,
                LocationId = location.Id,
                LureId = lure.Id,
                CaughtAt = caughtAt,
                Weight = Math.Round(weight, 2),
                Length = Math.Round(length, 1),
                Released = random.Next(0, 2) == 1,
                Technique = techniques[random.Next(techniques.Length)],
                Weather = weatherOptions[random.Next(weatherOptions.Length)],
                Notes = i % 3 == 0 ? "Fin dag på sjön!" : null
            });
        }

        context.CatchEntries.AddRange(catches);

        context.SaveChanges();
    }
}