using Microsoft.EntityFrameworkCore;
using MyJobs.Api.Contracts;
using MyJobs.Api.Services;

namespace MyJobs.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var content = scope.ServiceProvider.GetRequiredService<ILocalizedContentService>();

        await db.Database.EnsureCreatedAsync(cancellationToken);

        if (await db.Projects.AnyAsync(cancellationToken) || await db.PricingTiers.AnyAsync(cancellationToken))
        {
            return;
        }

        var seedProjects = new[]
        {
            new UpsertProjectDto(
                "en","p01","helix-analytics-console","Helix - analytics console","Series-A SaaS","2025","Web",
                "Rebuilt a slow Rails admin into a typed React console with real-time dashboards.",
                ["React","TanStack","Postgres","WebSockets"],"12x faster TTI","https://picsum.photos/seed/helix-cover/1600/900",
                ["https://picsum.photos/seed/helix-1/1600/900","https://picsum.photos/seed/helix-2/1600/900","https://picsum.photos/seed/helix-3/1600/900"],
                "The legacy admin took 8+ seconds and failed under concurrent load.",
                ["Replaced N+1 hotspots with materialized views.","Moved to TanStack Router + Query with strict typing.","Added real-time metrics through a WebSocket gateway."],
                ["Median dashboard TTI improved from 8.4s to 0.7s.","Operator throughput increased by about 3x.","No P1 incidents in the first 90 days."],
                [new ProjectReferenceInputDto("M. Larsen","VP Engineering","Shipped what our team postponed for two years.")]),
            new UpsertProjectDto(
                "en","p02","lex-rag-legal-assistant","Lex - RAG legal assistant","EU law firm","2025","AI",
                "Document-grounded legal chat with citations and audit trails.",
                ["OpenAI","pgvector","Next.js"],"70% faster legal review","https://picsum.photos/seed/lex-cover/1600/900",
                ["https://picsum.photos/seed/lex-1/1600/900","https://picsum.photos/seed/lex-2/1600/900","https://picsum.photos/seed/lex-3/1600/900"],
                "Associates spent hours locating specific clauses across large archives.",
                ["Built chunking and embedding pipeline tuned for legal text.","Implemented deterministic citation spans for each answer.","Added full answer audit logs for compliance."],
                ["Clause lookup dropped from hours to minutes.","Compliance approved usage because answers were reproducible.","Rolled out firm-wide within one quarter."],
                [new ProjectReferenceInputDto("C. Dubois","Partner","First AI tool our compliance team trusted.")]),
            new UpsertProjectDto(
                "en","p03","forge-payments-microservices","Forge - payments microservices","Fintech scale-up","2024","API",
                "Split a monolith into services with gateway, tracing, and clean local dev.",
                ["C#",".NET 8","Docker","RabbitMQ"],"99.98% uptime","https://picsum.photos/seed/forge-cover/1600/900",
                ["https://picsum.photos/seed/forge-1/1600/900","https://picsum.photos/seed/forge-2/1600/900","https://picsum.photos/seed/forge-3/1600/900"],
                "Monolithic releases were slow and risky, blocking roadmap delivery.",
                ["Split into bounded services around payment lifecycle.","Introduced API gateway with auth, limits, and tracing.","Added one-command Docker Compose local setup."],
                ["Uptime reached 99.98%.","Deployment duration dropped below 4 minutes.","Engineer onboarding reduced to one day."],
                [new ProjectReferenceInputDto("S. Aydin","Head of Platform","Gateway and tracing paid off immediately.")])
        };

        foreach (var project in seedProjects)
        {
            await content.CreateProjectAsync(project, cancellationToken);
        }

        await content.CreatePricingTierAsync(
            new UpsertPricingTierDto("en", "sprint", "Focused Sprint", "$4,000-$7,000", "1-2 weeks",
                "Ideal for one clear problem that needs fast implementation.",
                ["Architecture review", "Implementation", "Handover notes"], "Start sprint"),
            cancellationToken);
        await content.CreatePricingTierAsync(
            new UpsertPricingTierDto("en", "project", "End-to-end Project", "$12,000+", "4-12 weeks",
                "For complete product slices: frontend + backend + launch readiness.",
                ["Scope and milestones", "Delivery in iterations", "Documentation"], "Plan project"),
            cancellationToken);
        await content.CreatePricingTierAsync(
            new UpsertPricingTierDto("en", "retainer", "Engineering Retainer", "$3,000+/month", "Monthly",
                "Ongoing product and platform support with predictable throughput.",
                ["Prioritized backlog", "Weekly delivery rhythm", "Technical advisory"], "Book retainer"),
            cancellationToken);

        await content.CreatePricingFaqAsync(new UpsertPricingFaqDto("en", "Do you work with existing codebases?", "Yes. Most engagements start in an existing app."), cancellationToken);
        await content.CreatePricingFaqAsync(new UpsertPricingFaqDto("en", "Can you join short-term?", "Yes. Sprint format is built for short focused delivery."), cancellationToken);
        await content.CreatePricingFaqAsync(new UpsertPricingFaqDto("en", "Do you support C# backends?", "Yes. API design, refactoring, tests and performance work are core."), cancellationToken);
    }
}
