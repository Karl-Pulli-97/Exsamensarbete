using FishingLog.Api.DTOs.Catches;
using FishingLog.Api.Models;

namespace FishingLog.Api.Services;

public interface ICatchQueryService
{
    IQueryable<CatchEntry> GetFilteredCatches(Guid userId, CatchFilterRequest filter);
}