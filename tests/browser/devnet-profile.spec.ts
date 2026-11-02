import { test, expect } from "@playwright/test";
test("development fork labels the network and serves a fail-closed config", async ({ page, request }) => {
  await page.goto("/vault");
  await expect(page.getByRole("status", { name: "Development network" })).toContainText("DEVNET");
  await expect(page.getByRole("status", { name: "Development network" })).toContainText("Test assets only");
  const config = await (await request.get("/api/config")).json();
  expect(config.network).toBe("devnet");
  expect(config.expectedGenesis).toBe("EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG");
  expect(config.network).not.toBe("mainnet-beta");
  await expect(page).toHaveTitle(/DEVNET/);
});
