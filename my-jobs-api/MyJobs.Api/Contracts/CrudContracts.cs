namespace MyJobs.Api.Contracts;

public sealed record ProjectReferenceInputDto(string Name, string Role, string Quote);

public sealed record UpsertProjectDto(
    string Locale,
    string Id,
    string Slug,
    string Title,
    string Client,
    string Year,
    string Category,
    string Summary,
    IReadOnlyList<string> Stack,
    string? Metric,
    string Cover,
    IReadOnlyList<string> Gallery,
    string Problem,
    IReadOnlyList<string> Approach,
    IReadOnlyList<string> Outcome,
    IReadOnlyList<ProjectReferenceInputDto> References);

public sealed record UpsertPricingTierDto(
    string Locale,
    string Key,
    string Name,
    string Price,
    string Duration,
    string Description,
    IReadOnlyList<string> Bullets,
    string Cta);

public sealed record UpsertPricingFaqDto(
    string Locale,
    string Question,
    string Answer);
