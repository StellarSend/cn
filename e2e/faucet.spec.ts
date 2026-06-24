import { expect, test } from "@playwright/test"

test("faucet page is reachable", async ({ page }) => {
  await page.goto("/faucet")

  await expect(page.getByRole("heading", { name: "Testnet Faucet" })).toBeVisible()
  await expect(page.getByText("Claim test tokens to try trading on SO4.")).toBeVisible()
  await expect(page.getByRole("button", { name: /connect wallet/i })).toBeVisible()
})
