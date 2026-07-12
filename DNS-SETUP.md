# DNS setup for damiengranet.com

Kept separate from the site code because GitHub's requirements can change.
Authoritative reference: GitHub Docs → "Managing a custom domain for your GitHub
Pages site". Verify the IP addresses there before use.

## Records to create at the domain registrar

**Apex domain (`damiengranet.com`)** — four `A` records:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Optionally, IPv6 `AAAA` records: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
`2606:50c0:8002::153`, `2606:50c0:8003::153`.

**www subdomain** — one `CNAME` record:

| Type | Host | Value |
|---|---|---|
| CNAME | www | `<github-username>.github.io.` |

GitHub Pages will then redirect `www.damiengranet.com` to the apex domain
automatically once the custom domain is set in the repo settings.

## In the GitHub repository

1. *Settings → Pages → Custom domain* → enter `damiengranet.com` → Save.
2. Wait for the DNS check to pass (minutes to ~24 hours depending on the registrar).
3. Tick **Enforce HTTPS** once it becomes available.

Recommended: *Settings → Pages → verify your custom domain* (adds a TXT record) to
protect the domain from takeover if the repo is ever deleted.

## Checking DNS from a terminal

```bash
dig damiengranet.com +noall +answer      # should list the four A records
dig www.damiengranet.com +noall +answer  # should show the CNAME
```
