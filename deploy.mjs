#!/usr/bin/env node
/**
 * ⚠️  DEPRECATED — prefer the Shopify CLI (`npm run push` in this folder).
 *
 * This script requires a custom-app Admin API token (`shpat_…`) with
 * `write_themes` scope. Since Shopify retired the legacy in-admin custom-app
 * flow on Jan 1, 2026, obtaining such a token now requires the Dev Dashboard
 * + custom distribution flow. The Shopify CLI authenticates via browser
 * login and needs no token, so it's the supported path.
 *
 * Kept here for reference / future CI use only. See README.md.
 *
 * Shopify theme deploy script.
 *
 * Reads every file in ./shopify-theme and uploads it to the connected
 * Shopify store as a *new unpublished theme* (default) or updates an
 * existing theme by ID.
 *
 * Required env vars (provided by Lovable's Shopify integration):
 *   SHOPIFY_STORE_PERMANENT_DOMAIN   e.g. blind-freddy-ebikes.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN       Admin API token with write_themes scope
 *
 * Usage:
 *   node shopify-theme/deploy.mjs
 *   node shopify-theme/deploy.mjs --theme-id=123456789
 *   node shopify-theme/deploy.mjs --name="EEB v2"
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const API_VERSION = "2024-10";

// Prefer the custom-app token (has write_themes scope). Fall back to the
// Lovable Shopify connection token (which lacks write_themes — kept only as
// a convenience for stores where the merchant has approved theme scopes).
const SHOP =
  process.env.SHOPIFY_STORE_PERMANENT_DOMAIN ||
  "blind-freddy-ebikes.myshopify.com";
const TOKEN =
  process.env.SHOPIFY_THEME_ADMIN_TOKEN ||
  process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
  process.env.SHOPIFY_ACCESS_TOKEN;

if (!SHOP || !TOKEN) {
  console.error("✗ Missing Shopify credentials.");
  console.error("  Required env vars (in order of preference):");
  console.error("    SHOPIFY_THEME_ADMIN_TOKEN  — custom-app token with write_themes scope (recommended)");
  console.error("    SHOPIFY_ADMIN_ACCESS_TOKEN — generic admin token");
  console.error("    SHOPIFY_STORE_PERMANENT_DOMAIN — e.g. your-store.myshopify.com");
  process.exit(1);
}

// CLI args
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);
const themeId = args["theme-id"];
const themeName = args.name || `EEB Theme — ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

const BASE = `https://${SHOP}/admin/api/${API_VERSION}`;
const HEADERS = {
  "X-Shopify-Access-Token": TOKEN,
  "Content-Type": "application/json",
  Accept: "application/json",
};

// --- Helpers ----------------------------------------------------------------

const TEXT_EXT = new Set([".liquid", ".json", ".css", ".js", ".svg", ".html", ".txt", ".md"]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function isThemeFile(absPath) {
  const rel = relative(ROOT, absPath).split(sep).join("/");
  if (rel === "deploy.mjs" || rel === "README.md") return false;
  // Shopify only accepts files in these top-level folders
  return /^(layout|templates|sections|snippets|assets|config|locales)\//.test(rel);
}

function readAsset(absPath) {
  const rel = relative(ROOT, absPath).split(sep).join("/");
  const ext = "." + rel.split(".").pop();
  if (TEXT_EXT.has(ext)) {
    return { key: rel, value: readFileSync(absPath, "utf8") };
  }
  return { key: rel, attachment: readFileSync(absPath).toString("base64") };
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

// --- Main -------------------------------------------------------------------

async function main() {
  console.log(`▸ Shop:  ${SHOP}`);
  console.log(`▸ Theme: ${themeId ? `updating #${themeId}` : `creating "${themeName}"`}`);

  let theme;
  if (themeId) {
    theme = (await api("GET", `/themes/${themeId}.json`)).theme;
  } else {
    const created = await api("POST", `/themes.json`, {
      theme: { name: themeName, role: "unpublished" },
    });
    theme = created.theme;
    console.log(`✓ Created theme #${theme.id} "${theme.name}"`);
  }

  const files = walk(ROOT).filter(isThemeFile);
  console.log(`▸ Uploading ${files.length} files…`);

  let ok = 0;
  let failed = 0;

  // Sequential upload to stay under Shopify's API rate limits
  for (const f of files) {
    const asset = readAsset(f);
    try {
      await api("PUT", `/themes/${theme.id}/assets.json`, { asset });
      ok++;
      process.stdout.write(`  ✓ ${asset.key}\n`);
    } catch (err) {
      failed++;
      process.stdout.write(`  ✗ ${asset.key}\n    ${err.message}\n`);
    }
    // Light throttle: Admin REST API allows 2 calls/sec on standard plans
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\n✓ Done. ${ok} uploaded, ${failed} failed.`);
  console.log(`▸ Preview: https://${SHOP}/?preview_theme_id=${theme.id}`);
  console.log(`▸ Edit:    https://${SHOP.replace(".myshopify.com", "")}.myshopify.com/admin/themes/${theme.id}/editor`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n✗ Deploy failed:", err.message);
  process.exit(1);
});
