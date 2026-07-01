using PolicyClaim.Api.Services;

namespace PolicyClaim.Api.Tests;

public sealed class SyntheticStoreTests
{
    [Fact]
    public void GetClaim_ReturnsSeededClaim()
    {
        var store = new SyntheticStore();

        var claim = store.GetClaim("CLM-10482");

        Assert.NotNull(claim);
        Assert.Equal("POL-AZ-7721", claim.PolicyId);
    }

    [Fact]
    public void CreateReviewerTask_WritesAuditEvent()
    {
        var store = new SyntheticStore();

        var task = store.CreateReviewerTask(new CreateReviewerTaskRequest("CLM-10482", "Needs supplement review"));
        var auditEvents = store.GetAuditEvents("CLM-10482");

        Assert.StartsWith("TASK-", task.Id);
        Assert.Contains(auditEvents, item => item.EventType == "REVIEWER_TASK_CREATED");
    }
}
