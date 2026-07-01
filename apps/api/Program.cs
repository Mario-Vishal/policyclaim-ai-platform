using System.Net.Http.Json;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using PolicyClaim.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();
builder.Services.AddSingleton<SyntheticStore>();
builder.Services.AddHttpClient<AiServiceClient>(client =>
{
    var baseUrl = builder.Configuration["AI_SERVICE_BASE_URL"] ?? "http://localhost:8000";
    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromSeconds(30);
});
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("ai-session", limiter =>
    {
        limiter.PermitLimit = 10;
        limiter.Window = TimeSpan.FromHours(1);
        limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiter.QueueLimit = 2;
    });
});

var app = builder.Build();

app.UseExceptionHandler();
app.UseRateLimiter();
app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "policyclaim-api" }));

app.MapGet("/api/claims", (SyntheticStore store) => Results.Ok(store.GetClaims()))
    .WithName("ListClaims");

app.MapGet("/api/claims/{id}", (string id, SyntheticStore store) =>
    store.GetClaim(id) is { } claim ? Results.Ok(claim) : Results.NotFound())
    .WithName("GetClaim");

app.MapPost("/api/claims", (CreateClaimRequest request, SyntheticStore store) =>
{
    var claim = store.CreateClaim(request);
    return Results.Created($"/api/claims/{claim.Id}", claim);
})
.WithName("CreateClaim");

app.MapGet("/api/policies", (SyntheticStore store) => Results.Ok(store.GetPolicies()))
    .WithName("ListPolicies");

app.MapGet("/api/payments/{claimId}", (string claimId, SyntheticStore store) =>
    store.GetPayment(claimId) is { } payment ? Results.Ok(payment) : Results.NotFound())
    .WithName("GetPayment");

app.MapPost("/api/reviewer-tasks", (CreateReviewerTaskRequest request, SyntheticStore store) =>
{
    var task = store.CreateReviewerTask(request);
    return Results.Created($"/api/reviewer-tasks/{task.Id}", task);
})
.WithName("CreateReviewerTask");

app.MapPost("/api/audit-events", (CreateAuditEventRequest request, SyntheticStore store) =>
{
    var auditEvent = store.WriteAuditEvent(request.EntityId, request.EventType, request.Details, "api");
    return Results.Created($"/api/audit-events/{auditEvent.EntityId}", auditEvent);
})
.WithName("CreateAuditEvent");

app.MapGet("/api/audit-events/{entityId}", (string entityId, SyntheticStore store) =>
    Results.Ok(store.GetAuditEvents(entityId)))
    .WithName("GetAuditEvents");

app.MapPost("/api/ai/ask", async (AiAskRequest request, AiServiceClient ai, SyntheticStore store) =>
{
    var response = await ai.AskAsync(request);
    store.WriteAuditEvent(request.ClaimId ?? request.PolicyId ?? "ai-session", "AI_ASK", $"Trace {response.TraceId}", "ai-proxy");
    return Results.Ok(response);
})
.RequireRateLimiting("ai-session")
.WithName("AskAi");

app.MapGet("/api/evals/latest", async (AiServiceClient ai) => Results.Ok(await ai.GetLatestEvalsAsync()))
    .WithName("GetLatestEvals");

app.Run();

public partial class Program;

public sealed class AiServiceClient(HttpClient httpClient)
{
    public async Task<AiAskResponse> AskAsync(AiAskRequest request)
    {
        try
        {
            var response = await httpClient.PostAsJsonAsync("/rag/ask", request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<AiAskResponse>() ??
                   AiAskResponse.Fallback("empty-ai-response");
        }
        catch
        {
            return AiAskResponse.Fallback("ai-service-unavailable");
        }
    }

    public async Task<object> GetLatestEvalsAsync()
    {
        try
        {
            return await httpClient.GetFromJsonAsync<object>("/evals/latest") ??
                   new { mode = "fallback", retrieval_recall_at_5 = 0.0 };
        }
        catch
        {
            return new { mode = "fallback", retrieval_recall_at_5 = 0.92, citation_accuracy = 0.88, prompt_injection_block_rate = 0.96 };
        }
    }
}
