namespace MyJobs.Api.Contracts;

public sealed record PricingTierDto(
    string Key,
    string Name,
    string Price,
    string Duration,
    string Description,
    IReadOnlyList<string> Bullets,
    string Cta);

public sealed record PricingFaqDto(string Question, string Answer);

public sealed record PricingContentDto(
    IReadOnlyList<PricingTierDto> Tiers,
    IReadOnlyList<PricingFaqDto> Faqs);
