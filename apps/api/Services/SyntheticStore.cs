namespace PolicyClaim.Api.Services;

public sealed class SyntheticStore
{
    private readonly List<Claim> _claims =
    [
        new("CLM-10482", "POL-AZ-7721", "Synthetic Driver A", "Collision", "AZ", 18420m, "Needs Review", "Medium", "Covered with deductible", ["repair estimate supplement"], "Pending reconciliation", new DateOnly(2026, 6, 24)),
        new("CLM-10483", "POL-CA-1184", "Synthetic Driver B", "Comprehensive", "CA", 9200m, "Ready to Approve", "Low", "Covered", [], "Matched", new DateOnly(2026, 6, 25)),
        new("CLM-10484", "POL-NV-4420", "Synthetic Driver C", "Rental reimbursement", "NV", 3100m, "Escalated", "High", "Potential exclusion", ["rental agreement", "police report"], "Exception", new DateOnly(2026, 6, 26))
    ];

    private readonly List<Policy> _policies =
    [
        new("POL-AZ-7721", "Synthetic Household 17", "AZ", new DateOnly(2026, 1, 1), ["Collision", "Comprehensive", "Rental reimbursement"], ["Commercial delivery use", "Intentional damage"], 750m),
        new("POL-CA-1184", "Synthetic Household 22", "CA", new DateOnly(2025, 11, 15), ["Collision", "Comprehensive", "Medical payments"], ["Unlisted rideshare period"], 500m),
        new("POL-NV-4420", "Synthetic Household 31", "NV", new DateOnly(2026, 3, 1), ["Liability", "Collision"], ["Rental reimbursement without endorsement"], 1000m)
    ];

    private readonly List<Payment> _payments =
    [
        new("CLM-10482", "PAY-8841", 17670m, "Pending reconciliation", new DateOnly(2026, 6, 27)),
        new("CLM-10483", "PAY-8842", 8700m, "Matched", new DateOnly(2026, 6, 28)),
        new("CLM-10484", "PAY-8843", 0m, "Exception", new DateOnly(2026, 6, 29))
    ];

    private readonly List<ReviewerTask> _tasks = [];
    private readonly List<AuditEvent> _auditEvents =
    [
        new("CLM-10482", "RAG_TRACE_SAVED", "Coverage trace persisted", "AI review agent", DateTimeOffset.UtcNow.AddMinutes(-30)),
        new("CLM-10482", "COVERAGE_CHECK_COMPLETED", "Collision coverage matched deductible clause", "Coverage service", DateTimeOffset.UtcNow.AddMinutes(-25)),
        new("CLM-10484", "ESCALATION_CREATED", "Missing rental agreement and police report", "Reviewer queue", DateTimeOffset.UtcNow.AddMinutes(-18))
    ];

    public IReadOnlyList<Claim> GetClaims() => _claims;

    public Claim? GetClaim(string id) => _claims.FirstOrDefault(claim => claim.Id.Equals(id, StringComparison.OrdinalIgnoreCase));

    public Claim CreateClaim(CreateClaimRequest request)
    {
        var claim = new Claim($"CLM-{Random.Shared.Next(20000, 99999)}", request.PolicyId, "Synthetic Driver New", request.LossType, request.State, request.Amount, "Needs Review", "Medium", "Pending coverage check", [], "Pending reconciliation", DateOnly.FromDateTime(DateTime.UtcNow));
        _claims.Add(claim);
        WriteAuditEvent(claim.Id, "CLAIM_CREATED", "Synthetic claim created", "api");
        return claim;
    }

    public IReadOnlyList<Policy> GetPolicies() => _policies;

    public Payment? GetPayment(string claimId) => _payments.FirstOrDefault(payment => payment.ClaimId.Equals(claimId, StringComparison.OrdinalIgnoreCase));

    public ReviewerTask CreateReviewerTask(CreateReviewerTaskRequest request)
    {
        var task = new ReviewerTask($"TASK-{Random.Shared.Next(1000, 9999)}", request.ClaimId, request.Reason, "Open", DateTimeOffset.UtcNow);
        _tasks.Add(task);
        WriteAuditEvent(request.ClaimId, "REVIEWER_TASK_CREATED", request.Reason, "api");
        return task;
    }

    public AuditEvent WriteAuditEvent(string entityId, string eventType, string details, string actor)
    {
        var auditEvent = new AuditEvent(entityId, eventType, details, actor, DateTimeOffset.UtcNow);
        _auditEvents.Add(auditEvent);
        return auditEvent;
    }

    public IReadOnlyList<AuditEvent> GetAuditEvents(string entityId) =>
        _auditEvents.Where(item => item.EntityId.Equals(entityId, StringComparison.OrdinalIgnoreCase)).OrderByDescending(item => item.CreatedAt).ToList();
}
