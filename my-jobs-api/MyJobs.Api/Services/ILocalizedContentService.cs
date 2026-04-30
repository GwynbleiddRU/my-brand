using MyJobs.Api.Contracts;

namespace MyJobs.Api.Services;

public interface ILocalizedContentService
{
    string ResolveLocale(string? locale);
    Task<IReadOnlyList<ProjectListItemDto>> GetProjectsAsync(string? locale, CancellationToken cancellationToken = default);
    Task<ProjectDetailDto?> GetProjectBySlugAsync(string slug, string? locale, CancellationToken cancellationToken = default);
    Task<ProjectDetailDto> CreateProjectAsync(UpsertProjectDto dto, CancellationToken cancellationToken = default);
    Task<ProjectDetailDto?> UpdateProjectAsync(string id, string? locale, UpsertProjectDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteProjectAsync(string id, string? locale, CancellationToken cancellationToken = default);

    Task<PricingContentDto> GetPricingAsync(string? locale, CancellationToken cancellationToken = default);
    Task<PricingTierDto> CreatePricingTierAsync(UpsertPricingTierDto dto, CancellationToken cancellationToken = default);
    Task<PricingTierDto?> UpdatePricingTierAsync(
        string key,
        string? locale,
        UpsertPricingTierDto dto,
        CancellationToken cancellationToken = default);
    Task<bool> DeletePricingTierAsync(string key, string? locale, CancellationToken cancellationToken = default);

    Task<PricingFaqDto> CreatePricingFaqAsync(UpsertPricingFaqDto dto, CancellationToken cancellationToken = default);
    Task<PricingFaqDto?> UpdatePricingFaqAsync(
        int id,
        string? locale,
        UpsertPricingFaqDto dto,
        CancellationToken cancellationToken = default);
    Task<bool> DeletePricingFaqAsync(int id, string? locale, CancellationToken cancellationToken = default);
}
