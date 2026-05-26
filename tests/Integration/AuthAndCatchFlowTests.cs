using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FishingLog.Api.DTOs.Auth;
using FishingLog.Api.DTOs.Catches;
using FishingLog.Api.Models;

namespace FishingLog.Tests.Integration;

public class AuthAndCatchFlowTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthAndCatchFlowTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task FullFlow_RegisterLoginAndCreateCatch_Works()
    {
        var registerRequest = new RegisterRequest
        {
            Email = $"test-{Guid.NewGuid()}@example.com",
            Name = "Test User",
            Password = "password123"
        };

        var registerResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        var registerData = await registerResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(registerData);
        Assert.NotEmpty(registerData!.Token);

        var loginRequest = new LoginRequest
        {
            Email = registerRequest.Email,
            Password = registerRequest.Password
        };

        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        var loginData = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(loginData);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", loginData!.Token);

        var speciesResponse = await _client.GetAsync("/api/species");
        Assert.Equal(HttpStatusCode.OK, speciesResponse.StatusCode);
        var species = await speciesResponse.Content.ReadFromJsonAsync<List<Species>>();
        Assert.NotNull(species);
        Assert.NotEmpty(species!);

        var catchRequest = new CatchEntryRequest
        {
            SpeciesId = species![0].Id,
            CaughtAt = DateTime.UtcNow,
            Weight = 1.5m,
            Length = 35.0m,
            Released = true,
            Notes = "Integration test catch"
        };

        var createResponse = await _client.PostAsJsonAsync("/api/catchentries", catchRequest);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var catchesResponse = await _client.GetAsync("/api/catchentries");
        Assert.Equal(HttpStatusCode.OK, catchesResponse.StatusCode);

        var catches = await catchesResponse.Content.ReadFromJsonAsync<List<CatchEntryDto>>();
        Assert.NotNull(catches);
        Assert.Contains(catches!, c => c.Notes == "Integration test catch");
    }

    [Fact]
    public async Task GetCatches_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync("/api/catchentries");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}