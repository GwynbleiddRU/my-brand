using Microsoft.AspNetCore.Mvc;
using MyJobs.Api.Contracts;
using MyJobs.Api.Services;

namespace MyJobs.Api.Controllers;

[ApiController]
[Route("api/content/pricing")]
public sealed class PricingController(ILocalizedContentService contentService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<LocaleResponseDto<PricingContentDto>>> GetPricing(
        [FromQuery] string? locale,
        CancellationToken cancellationToken)
    {
        var resolved = contentService.ResolveLocale(locale);
        var data = await contentService.GetPricingAsync(resolved, cancellationToken);
        return Ok(new LocaleResponseDto<PricingContentDto>(resolved, data));
    }

    [HttpPost("tiers")]
    public async Task<ActionResult<PricingTierDto>> CreateTier(
        [FromBody] UpsertPricingTierDto dto,
        CancellationToken cancellationToken)
    {
        var tier = await contentService.CreatePricingTierAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetPricing), new { locale = dto.Locale }, tier);
    }

    [HttpPut("tiers/{key}")]
    public async Task<ActionResult<PricingTierDto>> UpdateTier(
        [FromRoute] string key,
        [FromQuery] string? locale,
        [FromBody] UpsertPricingTierDto dto,
        CancellationToken cancellationToken)
    {
        var tier = await contentService.UpdatePricingTierAsync(key, locale, dto, cancellationToken);
        return tier is null ? NotFound() : Ok(tier);
    }

    [HttpDelete("tiers/{key}")]
    public async Task<IActionResult> DeleteTier(
        [FromRoute] string key,
        [FromQuery] string? locale,
        CancellationToken cancellationToken)
    {
        var deleted = await contentService.DeletePricingTierAsync(key, locale, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("faqs")]
    public async Task<ActionResult<PricingFaqDto>> CreateFaq(
        [FromBody] UpsertPricingFaqDto dto,
        CancellationToken cancellationToken)
    {
        var faq = await contentService.CreatePricingFaqAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetPricing), new { locale = dto.Locale }, faq);
    }

    [HttpPut("faqs/{id:int}")]
    public async Task<ActionResult<PricingFaqDto>> UpdateFaq(
        [FromRoute] int id,
        [FromQuery] string? locale,
        [FromBody] UpsertPricingFaqDto dto,
        CancellationToken cancellationToken)
    {
        var faq = await contentService.UpdatePricingFaqAsync(id, locale, dto, cancellationToken);
        return faq is null ? NotFound() : Ok(faq);
    }

    [HttpDelete("faqs/{id:int}")]
    public async Task<IActionResult> DeleteFaq(
        [FromRoute] int id,
        [FromQuery] string? locale,
        CancellationToken cancellationToken)
    {
        var deleted = await contentService.DeletePricingFaqAsync(id, locale, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
