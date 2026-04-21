# EEB Shopify Theme

A Shopify Online Store 2.0 theme that mirrors the EveryBody eBikes Lovable prototype.

---

## Two ways to deploy

### Recommended: Auto-sync via second GitHub repo (zero terminal commands after setup)

Shopify's native GitHub theme integration only reads from the **root** of a repo, and this project keeps the theme inside `shopify-theme/`. So we sync this folder to a second, theme-only repo that Shopify connects to.

```text
Lovable  →  Repo A (this project)  ──GitHub Action──▶  Repo B (theme at root)  →  Shopify
```

After ~15 min one-time setup, every Lovable edit flows through to Shopify automatically. **Full setup guide: [`docs/SHOPIFY-GITHUB-SETUP.md`](../docs/SHOPIFY-GITHUB-SETUP.md).**

### Fallback: Shopify CLI from your local machine

If you'd rather push manually instead of using the second repo, follow the CLI instructions below.

---

## One-time setup (~5 min)

### 1. Connect Lovable to GitHub
In the Lovable editor: **Connectors → GitHub → Connect project**. Authorize the Lovable GitHub App, pick your account/org, create the repo. Wait for the initial sync.

### 2. Get the files onto your machine
On the new GitHub repo: **Code → Download ZIP**. Unzip it. (Or `git clone <repo-url>` if you prefer.)

### 3. Install the Shopify CLI
```bash
npm install -g @shopify/cli @shopify/theme
```

That's the entire toolchain. No tokens, no app config.

---

## Pushing the theme

All commands run from inside the `shopify-theme/` directory of the unzipped/cloned project.

### First push — creates a new unpublished theme
```bash
npm run push
```
This runs `shopify theme push --unpublished --store=blind-freddy-ebikes`. A browser window opens, you log in once as the store owner, and the CLI uploads every file. When it finishes it prints:
- a **preview URL** (open it to QA the theme in Shopify)
- the new **theme ID** (a number like `108267175958`)

**Send me that theme ID** — I'll wire `npm run push:update` to it so future re-deploys overwrite the same unpublished theme and your preview link stays stable.

### Re-deploys — overwrite the same unpublished theme
```bash
THEME_ID=108267175958 npm run push:update
```
(or hardcode the ID into `package.json` once you know it).

### Local development with hot reload (optional)
```bash
npm run dev
```
Runs `shopify theme dev` — serves the theme locally against live store data with hot reload for `.liquid`/CSS edits.

### Theme linting (optional)
```bash
npm run check
```

---

## Update workflow (after the first push)

1. Edit in Lovable (or edit the React prototype, then port the change to the matching `.liquid` section).
2. GitHub auto-syncs. Pull/clone the latest, or re-download the ZIP.
3. From `shopify-theme/`: `npm run push:update`.
4. Open the preview URL → QA → publish in Shopify admin (**Online Store → Themes → Actions → Publish**) when you're ready.

The React app at `/` and `/products/trident` is the visual reference. The Liquid sections are deliberately structurally close so design changes port cleanly.

---

## Folder structure

```
shopify-theme/
├── layout/theme.liquid           # Master layout
├── config/
│   ├── settings_schema.json      # Theme editor settings (colours, fonts)
│   └── settings_data.json        # Default values
├── sections/                     # Reusable sections (homepage + product blocks)
├── snippets/                     # Small reusable bits (icons, etc.)
├── templates/                    # JSON templates wiring sections together
│   ├── index.json                # Homepage
│   ├── product.json              # Default product
│   ├── product.trident.json      # Editorial product template
│   ├── collection.json
│   ├── page.json
│   └── cart.json
├── assets/theme.css              # Compiled global styles
├── locales/en.default.json
├── package.json                  # npm scripts wrapping Shopify CLI
└── deploy.mjs                    # DEPRECATED — Admin API push (needs shpat_ token)
```

---

## Why not the Admin API (`deploy.mjs`)?

`deploy.mjs` uses the Shopify Admin REST API directly and requires a custom-app `shpat_…` token with `write_themes` scope. As of **Jan 1, 2026** Shopify retired the legacy in-admin custom-app flow that issued those tokens easily, so getting one now requires the Dev Dashboard + custom distribution dance. The CLI sidesteps all of that.

The script is left in the repo for reference / future CI use, but the CLI is the supported path.

---

## If you'd rather your client run the deploy

Forward the **One-time setup** and **Pushing the theme** sections above. The CLI login uses their own Shopify admin credentials — nothing to share, no tokens to rotate.
