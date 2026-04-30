using Microsoft.EntityFrameworkCore;
using MyJobs.Api.Contracts;
using MyJobs.Api.Data;

namespace MyJobs.Api.Services;

public sealed class LocalizedContentService(AppDbContext db) : ILocalizedContentService
{
    private const string FallbackLocale = "en";
    private static readonly string[] SupportedLocales = ["en", "ru", "be"];

    public string ResolveLocale(string? locale)
    {
        if (string.IsNullOrWhiteSpace(locale))
        {
            return FallbackLocale;
        }

        var normalized = locale.Trim().ToLowerInvariant();
        var match = SupportedLocales.FirstOrDefault(x => normalized.StartsWith(x, StringComparison.Ordinal));
        return match ?? FallbackLocale;
    }

    public async Task<IReadOnlyList<ProjectListItemDto>> GetProjectsAsync(string? locale, CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale);
        var items = await db.Projects
            .AsNoTracking()
            .Where(x => x.Locale == resolved)
            .Include(x => x.Stack)
            .OrderBy(x => x.Id)
            .ToListAsync(cancellationToken);

        return items.Select(ToListItem).ToList();
    }

    public async Task<ProjectDetailDto?> GetProjectBySlugAsync(
        string slug,
        string? locale,
        CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale);
        var project = await QueryFullProjects(resolved)
            .FirstOrDefaultAsync(x => x.Slug == slug, cancellationToken);

        if (project is null)
        {
            return null;
        }

        var related = await db.Projects
            .AsNoTracking()
            .Where(x => x.Locale == resolved && x.Slug != slug && x.Category == project.Category)
            .Include(x => x.Stack)
            .Take(2)
            .ToListAsync(cancellationToken);

        return ToDetail(project, related.Select(ToListItem).ToList());
    }

    public async Task<ProjectDetailDto> CreateProjectAsync(UpsertProjectDto dto, CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(dto.Locale);
        var entity = MapProject(dto, resolved, null);
        db.Projects.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        return ToDetail(entity, []);
    }

    public async Task<ProjectDetailDto?> UpdateProjectAsync(
        string id,
        string? locale,
        UpsertProjectDto dto,
        CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale ?? dto.Locale);
        var entity = await QueryFullProjects(resolved).FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        MapProject(dto with { Locale = resolved }, resolved, entity);
        await db.SaveChangesAsync(cancellationToken);
        return ToDetail(entity, []);
    }

    public async Task<bool> DeleteProjectAsync(string id, string? locale, CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale);
        var entity = await db.Projects.FirstOrDefaultAsync(x => x.Locale == resolved && x.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        db.Projects.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<PricingContentDto> GetPricingAsync(string? locale, CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale);
        var tiers = await db.PricingTiers
            .AsNoTracking()
            .Where(x => x.Locale == resolved)
            .Include(x => x.Bullets)
            .OrderBy(x => x.Key)
            .ToListAsync(cancellationToken);
        var faqs = await db.PricingFaqs
            .AsNoTracking()
            .Where(x => x.Locale == resolved)
            .OrderBy(x => x.Order)
            .ToListAsync(cancellationToken);

        return new PricingContentDto(
            tiers.Select(MapTier).ToList(),
            faqs.Select(x => new PricingFaqDto(x.Question, x.Answer)).ToList());
    }

    public async Task<PricingTierDto> CreatePricingTierAsync(UpsertPricingTierDto dto, CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(dto.Locale);
        var entity = new PricingTierEntity { Locale = resolved };
        ApplyTier(dto with { Locale = resolved }, entity);
        db.PricingTiers.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        return MapTier(entity);
    }

    public async Task<PricingTierDto?> UpdatePricingTierAsync(
        string key,
        string? locale,
        UpsertPricingTierDto dto,
        CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale ?? dto.Locale);
        var entity = await db.PricingTiers
            .Include(x => x.Bullets)
            .FirstOrDefaultAsync(x => x.Locale == resolved && x.Key == key, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        ApplyTier(dto with { Locale = resolved }, entity);
        await db.SaveChangesAsync(cancellationToken);
        return MapTier(entity);
    }

    public async Task<bool> DeletePricingTierAsync(string key, string? locale, CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale);
        var entity = await db.PricingTiers.FirstOrDefaultAsync(x => x.Locale == resolved && x.Key == key, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        db.PricingTiers.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<PricingFaqDto> CreatePricingFaqAsync(UpsertPricingFaqDto dto, CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(dto.Locale);
        var nextOrder = await db.PricingFaqs.Where(x => x.Locale == resolved).CountAsync(cancellationToken);
        var entity = new PricingFaqEntity
        {
            Locale = resolved,
            Question = dto.Question,
            Answer = dto.Answer,
            Order = nextOrder
        };
        db.PricingFaqs.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        return new PricingFaqDto(entity.Question, entity.Answer);
    }

    public async Task<PricingFaqDto?> UpdatePricingFaqAsync(
        int id,
        string? locale,
        UpsertPricingFaqDto dto,
        CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale ?? dto.Locale);
        var entity = await db.PricingFaqs.FirstOrDefaultAsync(x => x.Locale == resolved && x.DbId == id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        entity.Question = dto.Question;
        entity.Answer = dto.Answer;
        await db.SaveChangesAsync(cancellationToken);
        return new PricingFaqDto(entity.Question, entity.Answer);
    }

    public async Task<bool> DeletePricingFaqAsync(int id, string? locale, CancellationToken cancellationToken = default)
    {
        var resolved = ResolveLocale(locale);
        var entity = await db.PricingFaqs.FirstOrDefaultAsync(x => x.Locale == resolved && x.DbId == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        db.PricingFaqs.Remove(entity);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private IQueryable<ProjectEntity> QueryFullProjects(string locale)
    {
        return db.Projects
            .Where(x => x.Locale == locale)
            .Include(x => x.Stack)
            .Include(x => x.Gallery)
            .Include(x => x.Approach)
            .Include(x => x.Outcome)
            .Include(x => x.References);
    }

    private static ProjectEntity MapProject(UpsertProjectDto dto, string locale, ProjectEntity? target)
    {
        var entity = target ?? new ProjectEntity();
        entity.Locale = locale;
        entity.Id = dto.Id;
        entity.Slug = dto.Slug;
        entity.Title = dto.Title;
        entity.Client = dto.Client;
        entity.Year = dto.Year;
        entity.Category = dto.Category;
        entity.Summary = dto.Summary;
        entity.Metric = dto.Metric;
        entity.Cover = dto.Cover;
        entity.Problem = dto.Problem;

        entity.Stack = dto.Stack.Select((x, i) => new ProjectStackEntity { Value = x, Order = i }).ToList();
        entity.Gallery = dto.Gallery.Select((x, i) => new ProjectGalleryEntity { Value = x, Order = i }).ToList();
        entity.Approach = dto.Approach.Select((x, i) => new ProjectApproachEntity { Value = x, Order = i }).ToList();
        entity.Outcome = dto.Outcome.Select((x, i) => new ProjectOutcomeEntity { Value = x, Order = i }).ToList();
        entity.References = dto.References.Select(x => new ProjectReferenceEntity
        {
            Name = x.Name,
            Role = x.Role,
            Quote = x.Quote
        }).ToList();

        return entity;
    }

    private static PricingTierDto MapTier(PricingTierEntity entity)
    {
        return new PricingTierDto(
            entity.Key,
            entity.Name,
            entity.Price,
            entity.Duration,
            entity.Description,
            entity.Bullets.OrderBy(x => x.Order).Select(x => x.Value).ToList(),
            entity.Cta);
    }

    private static void ApplyTier(UpsertPricingTierDto dto, PricingTierEntity entity)
    {
        entity.Locale = dto.Locale;
        entity.Key = dto.Key;
        entity.Name = dto.Name;
        entity.Price = dto.Price;
        entity.Duration = dto.Duration;
        entity.Description = dto.Description;
        entity.Cta = dto.Cta;
        entity.Bullets = dto.Bullets.Select((x, i) => new PricingTierBulletEntity { Value = x, Order = i }).ToList();
    }

    private static ProjectListItemDto ToListItem(ProjectEntity x)
    {
        return new ProjectListItemDto(
            x.Id,
            x.Slug,
            x.Title,
            x.Client,
            x.Year,
            x.Category,
            x.Summary,
            x.Stack.OrderBy(v => v.Order).Select(v => v.Value).ToList(),
            x.Metric,
            x.Cover);
    }

    private static ProjectDetailDto ToDetail(ProjectEntity x, IReadOnlyList<ProjectListItemDto> related)
    {
        return new ProjectDetailDto(
            x.Id,
            x.Slug,
            x.Title,
            x.Client,
            x.Year,
            x.Category,
            x.Summary,
            x.Stack.OrderBy(v => v.Order).Select(v => v.Value).ToList(),
            x.Metric,
            x.Cover,
            x.Gallery.OrderBy(v => v.Order).Select(v => v.Value).ToList(),
            x.Problem,
            x.Approach.OrderBy(v => v.Order).Select(v => v.Value).ToList(),
            x.Outcome.OrderBy(v => v.Order).Select(v => v.Value).ToList(),
            x.References.Select(r => new ProjectReferenceDto(r.Name, r.Role, r.Quote)).ToList(),
            related);
    }
}
