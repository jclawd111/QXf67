import { test, expect, type Download } from "@playwright/test";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { decryptArchival, decryptDayKey } from "../../sdk/v3/kit";
import { parseCreationRequest, parseRecoveryFile } from "../../sdk/v3/requests";
import { DEVNET_GENESIS } from "../../lib/qsafe-config";

test("offline devnet key generation and recovery work without any network requests", async ({ page }, info) => {
  test.setTimeout(90000);
  const deployment = { program: "k7FaK87WHGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn" };
  const networkRequests: string[] = [], errors: string[] = [];
  page.on("request", r => { if (!r.url().startsWith("file:") && !r.url().startsWith("blob:")) networkRequests.push(r.url()); });
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(pathToFileURL(resolve("public/source/qsafe-recovery-tool.html")).href);
  const password = "devnet offline recovery test 2026", dayPassword = "devnet separate day password 2026";
  const saves = async (trigger: () => Promise<unknown>, count: number) => {
    const files: Record<string, string> = {};
    const done = new Promise<void>((finish, reject) => {
      const onDownload = async (download: Download) => {
        try {
          const name = download.suggestedFilename(), path = info.outputPath(`${Date.now()}-${name}`);
          await download.saveAs(path); files[name] = path;
          if (Object.keys(files).length === count) { page.off("download", onDownload); finish(); }
        } catch (error) { reject(error); }
      };
      page.on("download", onDownload);
    });
    await trigger(); await done;
    return (part: string) => {
      const name = Object.keys(files).find(n => n.includes(part));
      if (!name) throw new Error(`Missing ${part} download`);
      return files[name];
    };
  };
  await page.locator("#card").setInputFiles({ name: "network-card.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ version: 3, kind: "network", network: "devnet", genesis: DEVNET_GENESIS, program: deployment.program })) });
  await expect(page.locator("#card-echo")).toContainText(deployment.program);
  await page.locator("#card-ack").check();
  await page.locator("#password").fill(password); await page.locator("#repeat").fill(password);
  await page.locator("#day-password").fill(dayPassword); await page.locator("#day-repeat").fill(dayPassword);
  await page.locator("#kit-ack").check(); await page.locator("#policy-ack").check();
  const kit = (await saves(() => page.locator("#create").click(), 1))("RECOVERY-KIT");
  const files = await saves(() => page.locator("#verify").setInputFiles(kit), 3);
  await expect(page.locator("#build-status")).toContainText("Verified.");
  const archival = await decryptArchival(readFileSync(kit, "utf8"), password);
  const day = await decryptDayKey(readFileSync(files("day-key"), "utf8"), dayPassword);
  const creation = parseCreationRequest(readFileSync(files("creation-request"), "utf8"));
  const cancel = parseRecoveryFile(readFileSync(files("cancel-file"), "utf8"));
  expect(day.network).toBe("devnet"); expect(day.program).toBe(deployment.program);
  expect(day.vault).toBe(creation.vault); expect(archival.vault).toBe(day.vault); expect(cancel.vault).toBe(day.vault);
  expect(creation.delaySecs).toBe(86400);
  await page.locator("#tab-recover").click(); await page.locator("#kit").setInputFiles(kit);
  await page.locator("#kit-password").fill(password); await page.locator("#epoch").fill("0");
  await page.locator("#new-day-password").fill(dayPassword); await page.locator("#new-day-repeat").fill(dayPassword);
  const recovered = await saves(() => page.locator("#recover").click(), 3);
  const next = await decryptDayKey(readFileSync(recovered("day-key"), "utf8"), dayPassword);
  expect(next.epoch).toBe("1"); expect(next.vault).toBe(day.vault);
  expect(networkRequests).toEqual([]); expect(errors).toEqual([]);
});
