namespace PolicyClaim.Api.Services;

public sealed class SyntheticStore
{
    private readonly List<Claim> _claims =
    [
        new("CLM-10482", "POL-AZ-7721", "Synthetic Driver A", "Collision", "AZ", 18420m, "Needs Review", "Medium", "Covered with deductible", ["repair estimate supplement"], "Pending reconciliation", new DateOnly(2026, 6, 24)),
        new("CLM-10483", "POL-CA-1184", "Synthetic Driver B", "Comprehensive", "CA", 9200m, "Ready to Approve", "Low", "Covered", [], "Matched", new DateOnly(2026, 6, 25)),
        new("CLM-10484", "POL-NV-4420", "Synthetic Driver C", "Rental reimbursement", "NV", 3100m, "Escalated", "High", "Potential exclusion", ["rental agreement", "police report"], "Exception", new DateOnly(2026, 6, 26)),
        new("CLM-10485", "POL-TX-9033", "Synthetic Driver D", "Weather hail", "TX", 14250m, "Ready to Approve", "Low", "Covered", [], "Matched", new DateOnly(2026, 6, 27)),
        new("CLM-10486", "POL-FL-2290", "Synthetic Driver E", "Flood water intrusion", "FL", 26600m, "Escalated", "High", "Excluded flood peril", ["cause of loss statement", "water line photos"], "Exception", new DateOnly(2026, 6, 28)),
        new("CLM-10487", "POL-WA-6152", "Synthetic Driver F", "Glass repair", "WA", 840m, "Ready to Approve", "Low", "Covered with waiver", [], "Ready for disbursement", new DateOnly(2026, 6, 28)),
        new("CLM-10488", "POL-IL-3817", "Synthetic Driver G", "Bodily injury liability", "IL", 48500m, "Needs Review", "Medium", "Coverage pending liability review", ["medical bill summary", "liability statement"], "Hold", new DateOnly(2026, 6, 29))
    ];

    private readonly List<Policy> _policies =
    [
        new("POL-AZ-7721", "Synthetic Household 17", "AZ", new DateOnly(2026, 1, 1), ["Collision", "Comprehensive", "Rental reimbursement"], ["Commercial delivery use", "Intentional damage"], 750m),
        new("POL-CA-1184", "Synthetic Household 22", "CA", new DateOnly(2025, 11, 15), ["Collision", "Comprehensive", "Medical payments"], ["Unlisted rideshare period"], 500m),
        new("POL-NV-4420", "Synthetic Household 31", "NV", new DateOnly(2026, 3, 1), ["Liability", "Collision"], ["Rental reimbursement without endorsement"], 1000m),
        new("POL-TX-9033", "Synthetic Household 44", "TX", new DateOnly(2026, 2, 10), ["Comprehensive", "Weather hail", "Roadside assistance"], ["Pre-existing cosmetic damage"], 500m),
        new("POL-FL-2290", "Synthetic Household 58", "FL", new DateOnly(2026, 4, 20), ["Collision", "Comprehensive", "Liability"], ["Flood water intrusion", "Named storm waiting period"], 1250m),
        new("POL-WA-6152", "Synthetic Household 63", "WA", new DateOnly(2025, 12, 1), ["Glass repair", "Comprehensive", "Rental reimbursement"], ["Aftermarket racing parts"], 250m),
        new("POL-IL-3817", "Synthetic Household 70", "IL", new DateOnly(2026, 5, 5), ["Liability", "Medical payments", "Uninsured motorist"], ["Intentional acts", "Business livery use"], 1000m)
    ];

    private readonly List<Payment> _payments =
    [
        new("CLM-10482", "PAY-8841", 17670m, "Pending reconciliation", new DateOnly(2026, 6, 27)),
        new("CLM-10483", "PAY-8842", 8700m, "Matched", new DateOnly(2026, 6, 28)),
        new("CLM-10484", "PAY-8843", 0m, "Exception", new DateOnly(2026, 6, 29)),
        new("CLM-10485", "PAY-8844", 13750m, "Matched", new DateOnly(2026, 6, 29)),
        new("CLM-10486", "PAY-8845", 0m, "Exception", new DateOnly(2026, 6, 30)),
        new("CLM-10487", "PAY-8846", 840m, "Ready for disbursement", new DateOnly(2026, 6, 30)),
        new("CLM-10488", "PAY-8847", 0m, "Hold", new DateOnly(2026, 7, 1))
    ];

    private readonly List<ReviewerTask> _tasks = [];
    private readonly List<AuditEvent> _auditEvents =
    [
        new("CLM-10482", "RAG_TRACE_SAVED", "Coverage trace persisted", "AI review agent", DateTimeOffset.UtcNow.AddMinutes(-30)),
        new("CLM-10482", "COVERAGE_CHECK_COMPLETED", "Collision coverage matched deductible clause", "Coverage service", DateTimeOffset.UtcNow.AddMinutes(-25)),
        new("CLM-10484", "ESCALATION_CREATED", "Missing rental agreement and police report", "Reviewer queue", DateTimeOffset.UtcNow.AddMinutes(-18)),
        new("CLM-10485", "PAYMENT_MATCHED", "Hail estimate matched payment ledger", "Payment reconciliation", DateTimeOffset.UtcNow.AddMinutes(-15)),
        new("CLM-10486", "EXCLUSION_FLAGGED", "Flood water intrusion exclusion requires senior review", "Underwriting rules engine", DateTimeOffset.UtcNow.AddMinutes(-12)),
        new("CLM-10487", "GLASS_WAIVER_APPLIED", "Glass deductible waiver applied", "Coverage service", DateTimeOffset.UtcNow.AddMinutes(-8)),
        new("CLM-10488", "MEDICAL_REVIEW_OPENED", "Liability and medical bills require manual review", "Reviewer queue", DateTimeOffset.UtcNow.AddMinutes(-5))
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
