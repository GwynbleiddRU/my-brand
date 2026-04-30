namespace MyJobs.Api.Data;

public sealed class ProjectEntity
{
    public int DbId { get; set; }
    public string Locale { get; set; } = "en";
    public string Id { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Client { get; set; } = string.Empty;
    public string Year { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string? Metric { get; set; }
    public string Cover { get; set; } = string.Empty;
    public string Problem { get; set; } = string.Empty;
    public List<ProjectStackEntity> Stack { get; set; } = [];
    public List<ProjectGalleryEntity> Gallery { get; set; } = [];
    public List<ProjectApproachEntity> Approach { get; set; } = [];
    public List<ProjectOutcomeEntity> Outcome { get; set; } = [];
    public List<ProjectReferenceEntity> References { get; set; } = [];
}

public abstract class ProjectOrderedValueEntity
{
    public int DbId { get; set; }
    public int Order { get; set; }
    public string Value { get; set; } = string.Empty;
    public int ProjectEntityDbId { get; set; }
    public ProjectEntity Project { get; set; } = null!;
}

public sealed class ProjectStackEntity : ProjectOrderedValueEntity;
public sealed class ProjectGalleryEntity : ProjectOrderedValueEntity;
public sealed class ProjectApproachEntity : ProjectOrderedValueEntity;
public sealed class ProjectOutcomeEntity : ProjectOrderedValueEntity;

public sealed class ProjectReferenceEntity
{
    public int DbId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;
    public int ProjectEntityDbId { get; set; }
    public ProjectEntity Project { get; set; } = null!;
}

public sealed class PricingTierEntity
{
    public int DbId { get; set; }
    public string Locale { get; set; } = "en";
    public string Key { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Cta { get; set; } = string.Empty;
    public List<PricingTierBulletEntity> Bullets { get; set; } = [];
}

public sealed class PricingTierBulletEntity
{
    public int DbId { get; set; }
    public int Order { get; set; }
    public string Value { get; set; } = string.Empty;
    public int PricingTierEntityDbId { get; set; }
    public PricingTierEntity PricingTier { get; set; } = null!;
}

public sealed class PricingFaqEntity
{
    public int DbId { get; set; }
    public string Locale { get; set; } = "en";
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int Order { get; set; }
}
