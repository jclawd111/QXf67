#!/usr/bin/env node
/**
 * Multi-Core Solana Vanity Mint Keypair Grinder for J7 / Pump.fun Launches
 *
 * Usage:
 *   node tools/vanity-ca.mjs --prefix QSaFe
 *   node tools/vanity-ca.mjs --suffix SAFE
 *   node tools/vanity-ca.mjs --prefix QS --suffix pump
 *
 * Outputs both:
 *   1. Base58 Private Key (ready to paste into J7 "Import Mint Keypair")
 *   2. Solana CLI JSON array ([u8; 64]) saved to vanity-<pubkey>.json
 */
import { Keypair } from "@solana/web3.js";
import { writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function toBase58(bytes) {
  let n = 0n;
  for (const x of bytes) n = (n << 8n) | BigInt(x);
  let out = "";
  while (n > 0n) {
    out = ALPHABET[Number(n % 58n)] + out;
    n /= 58n;
  }
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) out = "1" + out;
  return out;
}

if (!isMainThread) {
  const { prefix, suffix, ignoreCase } = workerData;
  const p = ignoreCase ? prefix.toLowerCase() : prefix;
  const s = ignoreCase ? suffix.toLowerCase() : suffix;
  let count = 0;

  while (true) {
    const kp = Keypair.generate();
    const pub = kp.publicKey.toBase58();
    const cmp = ignoreCase ? pub.toLowerCase() : pub;
    count++;

    if ((!p || cmp.startsWith(p)) && (!s || cmp.endsWith(s))) {
      parentPort.postMessage({
        found: true,
        publicKey: pub,
        secretKeyBase58: toBase58(kp.secretKey),
        secretKeyArray: Array.from(kp.secretKey),
        count,
      });
      process.exit(0);
    }

    if (count % 5000 === 0) {
      parentPort.postMessage({ found: false, count: 5000 });
    }
  }
} else {
  const args = process.argv.slice(2);
  const getArg = (flag, fallback = "") => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
  };
  const prefix = getArg("--prefix", "");
  const suffix = getArg("--suffix", "SAFE");
  const ignoreCase = args.includes("--ignore-case");

  const numThreads = Math.max(1, cpus().length - 1);
  console.log(`\n◈ QUANTUM SAFE // J7 VANITY CA GRINDER`);
  console.log(`  Threads : ${numThreads} CPU cores`);
  console.log(`  Prefix  : "${prefix || "(any)"}"`);
  console.log(`  Suffix  : "${suffix || "(any)"}"`);
  console.log(`  Case    : ${ignoreCase ? "Case-Insensitive" : "Exact Case"}\n`);

  const start = Date.now();
  let totalChecked = 0;
  const workers = [];

  for (let i = 0; i < numThreads; i++) {
    const w = new Worker(new URL(import.meta.url), {
      workerData: { prefix, suffix, ignoreCase },
    });
    w.on("message", (msg) => {
      if (!msg.found) {
        totalChecked += msg.count;
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        process.stdout.write(
          `\r  Grinding... ${totalChecked.toLocaleString()} keypairs checked (${elapsed}s)`
        );
        return;
      }

      console.log(`\n\n✓ FOUND VANITY MINT CA: ${msg.publicKey}`);
      console.log(`  Base58 Secret Key (for J7 Import):`);
      console.log(`  ${msg.secretKeyBase58}\n`);

      const outPath = `vanity-${msg.publicKey}.json`;
      writeFileSync(outPath, JSON.stringify(msg.secretKeyArray));
      console.log(`  Saved Solana keypair JSON to: ${outPath}\n`);

      for (const other of workers) other.terminate();
      process.exit(0);
    });
    workers.push(w);
  }
}
