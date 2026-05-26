using System.Net;
using System.Text.Json;

namespace FishingLog.Api.Middleware;

public class ExceptionHandling
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandling> _logger;

    public ExceptionHandling(
        RequestDelegate next,
        ILogger<ExceptionHandling> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ett oväntat fel inträffade vid {Path}", context.Request.Path);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new
            {
                message = "Ett oväntat fel inträffade. Försök igen senare."
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}