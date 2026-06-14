# Atsumi Labs — atsumilabs.com

Static marketing site for **Atsumi Labs LLC**, the umbrella for a small collection
of consumer apps (Skyfield, AliasNest, Tadka Play, …).

No build step — plain HTML/CSS.

```
index.html            landing page (hero + product catalog + about + contact)
styles.css            site styles  (washi-paper / ink / vermillion theme)
skyfield.html         Skyfield product page (phone frame + features + legal footer)
skyfield.css          extra styles for the Skyfield page
skyfield-privacy.html Skyfield-specific privacy policy (for app-store listing)
skyfield-terms.html   Skyfield-specific terms of service
privacy.html          entity-level privacy policy
terms.html            entity-level terms of service
legal.css             shared styles for all legal pages
assets/               images (skyfield-screen.png = phone-frame poster)
```

Products in the catalog: **Skyfield** (weather), **AliasNest** (email aliases),
**Tadka Play** (party games), **ComEd PricePulse** (electricity prices).

## Preview locally
```bash
npm start            # zero-dep Node static server → http://localhost:8124
# PORT=3000 npm start to change the port
```

## Deploy (GCP + pm2 + nginx)
Served by `server.js` (zero dependencies) under **pm2** on the GCP box, behind nginx.

- Port **8124** (8080 + 8123/tadkaplay are taken) — nginx proxies `atsumilabs.com` here.
- `ecosystem.config.cjs` defines the `atsumilabs` pm2 process.
- Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) rsyncs to the box
  and runs `pm2 reload`. Requires repo secrets: `SSH_KEY`, `SSH_HOST`, `SSH_USER`,
  `SSH_PORT` (optional), `DEPLOY_PATH` (e.g. `~/atsumilabs`).

First-time on the box:
```bash
cd ~/atsumilabs
pm2 start ecosystem.config.cjs
pm2 save
```

## Design
Theme: warm washi paper, sumi ink, single vermillion (朱) accent. The 集 ("atsumi"
= *to gather*) seal is the brand mark. Fraunces (display) · Hanken Grotesk (body) ·
Spline Sans Mono (labels). Fonts load from Google Fonts; everything else is local.

## Adding a product
Copy a `<li class="card">…</li>` block in `index.html`, bump the `No.` number, set a
status badge (`status-live` / `status-beta` / `status-soon`), pick a kanji mark, and
update the link.

## Contact
contact@atsumilabs.com
