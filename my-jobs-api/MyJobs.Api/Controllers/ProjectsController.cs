using Microsoft.AspNetCore.Mvc;
using MyJobs.Api.Contracts;
using MyJobs.Api.Services;

namespace MyJobs.Api.Controllers;

[ApiController]
[Route("api/content/projects")]
public sealed class ProjectsController(ILocalizedContentService contentService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<LocaleResponseDto<IReadOnlyList<ProjectListItemDto>>>> GetProjects(
        [FromQuery] string? locale,
        CancellationToken cancellationToken)
    {
        var resolved = contentService.ResolveLocale(locale);
        var data = await contentService.GetProjectsAsync(resolved, cancellationToken);
        return Ok(new LocaleResponseDto<IReadOnlyList<ProjectListItemDto>>(resolved, data));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<LocaleResponseDto<ProjectDetailDto>>> GetBySlug(
        [FromRoute] string slug,
        [FromQuery] string? locale,
        CancellationToken cancellationToken)
    {
        var resolved = contentService.ResolveLocale(locale);
        var data = await contentService.GetProjectBySlugAsync(slug, resolved, cancellationToken);
        if (data is null)
        {
            return NotFound();
        }

        return Ok(new LocaleResponseDto<ProjectDetailDto>(resolved, data));
    }

    [HttpPost]
    public async Task<ActionResult<LocaleResponseDto<ProjectDetailDto>>> Create(
        [FromBody] UpsertProjectDto dto,
        CancellationToken cancellationToken)
    {
        var resolved = contentService.ResolveLocale(dto.Locale);
        var project = await contentService.CreateProjectAsync(dto, cancellationToken);
        return CreatedAtAction(
            nameof(GetBySlug),
            new { slug = project.Slug, locale = resolved },
            new LocaleResponseDto<ProjectDetailDto>(resolved, project));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<LocaleResponseDto<ProjectDetailDto>>> Update(
        [FromRoute] string id,
        [FromQuery] string? locale,
        [FromBody] UpsertProjectDto dto,
        CancellationToken cancellationToken)
    {
        var resolved = contentService.ResolveLocale(locale ?? dto.Locale);
        var project = await contentService.UpdateProjectAsync(id, resolved, dto, cancellationToken);
        if (project is null)
        {
            return NotFound();
        }

        return Ok(new LocaleResponseDto<ProjectDetailDto>(resolved, project));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(
        [FromRoute] string id,
        [FromQuery] string? locale,
        CancellationToken cancellationToken)
    {
        var deleted = await contentService.DeleteProjectAsync(id, locale, cancellationToken);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
