# damiengranet.com

A personal biography and professional profile website for Damien Granet, built with
[Astro](https://astro.build) and deployed to GitHub Pages at
**https://damiengranet.com**.

All of the site's content lives in **one file**: [`src/data/profile.json`](src/data/profile.json).
Damien never needs to touch code — see [`CONTENT-EDITING-GUIDE.md`](CONTENT-EDITING-GUIDE.md)
for his plain-English instructions, including the browser-based editor at `/edit/`.

## Quick start (local development)

Requirements: [Node.js](https://nodejs.org) 20 or newer (22 recommended).

```bash
npm install        # first time only
npm run dev        # start the dev server at http://localhost:4321
```

The site reloads automatically as you edit. The content editor is at
http://localhost:4321/edit/.

Other scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with live reload |
| `npm run build` | Validate content, then build the static site into `dist/` |
| `npm run preview` | Serve the built `dist/` folder locally |
| `npm run validate-content` | Check `profile.json` against the expected schema |
| `npm run lint` | Run Astro's checker (non-blocking) |

## First-time deployment setup

1. **Create the repository.** Create a GitHub repo (any name works, e.g.
   `damiengranet.com`), then push this project to its `main` branch.
2. **Enable GitHub Pages.** In the repo: *Settings → Pages → Build and deployment →
   Source → GitHub Actions*.
3. **Set the custom domain.** Still in *Settings → Pages*, enter `damiengranet.com`
   under *Custom domain* and save. The repo already contains `public/CNAME`, so the
   setting survives redeploys.
4. **Configure DNS.** Follow [`DNS-SETUP.md`](DNS-SETUP.md) at the domain registrar
   (apex `A`/`AAAA` records plus a `www` CNAME).
5. **Enable HTTPS.** Once GitHub shows the DNS check as successful (can take up to a
   day), tick *Enforce HTTPS* in *Settings → Pages*.
6. **Fill in the placeholders.** Search `profile.json` for `REPLACE-ME` (LinkedIn URL
   and the GitHub repo name) and replace the placeholder profile photo — see the
   editing guide.

After that, every push to `main` automatically validates the content, builds the site,
runs basic quality checks, and deploys — see
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). The
workflow can also be run manually from the *Actions* tab.

## How the site is put together

```
/
├── public/                      # copied to the site verbatim
│   ├── images/                  #   profile photo, og-image, project images
│   ├── favicon.svg
│   ├── robots.txt
│   ├── site.webmanifest
│   └── CNAME                    #   custom-domain marker for GitHub Pages
├── src/
│   ├── components/              # one Astro component per section
│   ├── data/
│   │   └── profile.json         # ★ ALL editable content lives here
│   ├── layouts/
│   │   └── Base.astro           # <head>, SEO/OG/JSON-LD, nav, footer
│   ├── pages/
│   │   ├── index.astro          # the single-page site
│   │   ├── 404.astro            # custom not-found page
│   │   ├── edit/index.astro     # browser-based content editor
│   │   └── profile-data.json.js # exposes profile.json for the editor
│   └── styles/global.css        # design tokens + all styling
├── scripts/validate-content.mjs # schema validation (runs before every build)
├── .github/workflows/deploy-pages.yml
├── CONTENT-EDITING-GUIDE.md     # written for Damien
├── DNS-SETUP.md
└── README.md
```

Design decisions worth knowing:

- **Data-driven sections.** Every section reads only from `profile.json`. Empty lists
  or a `false` flag in `sections` make a section disappear entirely — no code edits.
- **No client-side framework.** Astro ships zero JavaScript for the public pages; the
  only scripted page is `/edit/`. The whole site works with JavaScript disabled.
- **No secrets, ever.** GitHub Pages is public static hosting, so the editor
  deliberately has no tokens and cannot commit by itself. Publishing goes through
  GitHub's own signed-in web interface (see the editing guide). If one-click
  publishing is ever wanted, add an external auth backend (e.g. Decap CMS with a
  small OAuth service, or a GitHub App behind a serverless function) — never a
  personal access token in frontend code.
- **Contact form is opt-in.** The form renders only when
  `contact.formEndpoint` is set (e.g. a [Formspree](https://formspree.io) endpoint),
  so the site never shows a form that silently discards messages. A honeypot field
  provides basic spam resistance.
- **Privacy by default.** No analytics, no cookies, no personal contact details.
  The validator warns if the data appears to contain a phone number or a personal
  email address.
- **Accessibility.** Semantic landmarks, skip link, visible focus states, alt text
  driven by the data file, reduced-motion support, 44px touch targets.

## Validation and quality checks

`npm run validate-content` (also run by `npm run build` and by CI) checks:

- the JSON parses;
- required fields are present and the right shape;
- links look like links;
- images have alt text;
- nothing that resembles a phone number or personal email is being published (warning).

The deploy workflow additionally verifies the built output contains `CNAME`,
`404.html`, `robots.txt` and the sitemap before anything ships.

## Changing the domain later

1. Update `public/CNAME`.
2. Update `site` in `astro.config.mjs` and `meta.siteUrl` in `profile.json`.
3. Update `Sitemap:` in `public/robots.txt`.
4. Update the custom domain in *Settings → Pages* and the DNS records
   (see `DNS-SETUP.md`).
