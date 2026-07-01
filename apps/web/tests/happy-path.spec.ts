import { expect, test } from "@playwright/test";

test("business and engineering modes render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "PolicyClaim AI Platform" })).toBeVisible();
  await page.getByRole("link", { name: /Open Business Mode/i }).click();
  await expect(page.getByRole("heading", { name: "Claims Dashboard" })).toBeVisible();
  await page.getByRole("link", { name: "Engineering" }).click();
  await expect(page.getByRole("heading", { name: "Engineering Mode" })).toBeVisible();
  await expect(page.getByText("RAG Pipeline Replay")).toBeVisible();
});
