namespace MyJobs.Api.Contracts;

public sealed record LocaleResponseDto<T>(string Locale, T Data);
