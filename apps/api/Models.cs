namespace PolicyClaim.Api.Services;

public sealed record Claim(
    string Id,
    string PolicyId,
    string Claimant,
    string LossType,
    string State,
    decimal Amount,
    string Status,
    string Risk,
    string Coverage,
    IReadOnlyList<string> MissingDocuments,
    string PaymentStatus,
    DateOnly OpenedAt);

public sealed record Policy(
    string Id,
    string Holder,
    string State,
    DateOnly EffectiveDate,
    IReadOnlyList<string> Coverage,
    IReadOnlyList<string> Exclusions,
    decimal Deductible);

public sealed record Payment(string ClaimId, string PaymentId, decimal Amount, string Status, DateOnly UpdatedAt);

public sealed record ReviewerTask(string Id, string ClaimId, string Reason, string Status, DateTimeOffset CreatedAt);

public sealed record AuditEvent(string EntityId, string EventType, string Details, string Actor, DateTimeOffset CreatedAt);

public sealed record CreateClaimRequest(string PolicyId, string LossType, string State, decimal Amount);

public sealed record CreateReviewerTaskRequest(string ClaimId, string Reason);

public sealed record CreateAuditEventRequest(string EntityId, string EventType, string Details);

public sealed record AiAskRequest(string Question, string? ClaimId, string? PolicyId, Dictionary<string, string>? Filters);

public sealed record Citation(string DocumentId, string SectionTitle, double Score, string Snippet);

public sealed record TraceStep(string Name, int LatencyMs, string Status);

public sealed record AiAskResponse(string Answer, IReadOnlyList<Citation> Citations, string TraceId, IReadOnlyList<TraceStep> Trace, string Mode)
{
    public static AiAskResponse Fallback(string reason) =>
        new(
            $"Fallback mode: AI service could not be reached ({reason}). Synthetic policy evidence indicates the claim should be reviewed with cited coverage and payment records.",
            new[]
            {
                new Citation("POL-AZ-7721", "Collision Coverage", 0.91, "Synthetic collision losses are covered subject to deductible and exclusions.")
            },
            $"fallback-{Guid.NewGuid():N}",
            new[] { new TraceStep("api-fallback", 1, "completed") },
            "fallback");
}
