namespace MyJobs.Api.Contracts;

public sealed record ProjectReferenceDto(string Name, string Role, string Quote);

public sealed record ProjectListItemDto(
    string Id,
    string Slug,
    string Title,
    string Client,
    string Year,
    string Category,
    string Summary,
    IReadOnlyList<string> Stack,
    string? Metric,
    string Cover);

public sealed record ProjectDetailDto(
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
    IReadOnlyList<ProjectReferenceDto> References,
    IReadOnlyList<ProjectListItemDto> Related);
