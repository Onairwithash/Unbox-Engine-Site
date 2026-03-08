# Unbox Engine Quick Launch Guide (GitHub Pages + GoDaddy DNS)

This guide publishes this folder as a static site on GitHub Pages with `https://unboxengine.com` as the canonical domain.

## 1) Prerequisites

- You have a GitHub account.
- You will use a new public repository.
- DNS for `unboxengine.com` is managed in GoDaddy.
- This project folder contains `index.html`, `products.html`, `styles.css`, and `script.js`.

## 2) Create and Push a New Public GitHub Repo

In GitHub, create a new public repo (example: `unboxengine-site`), then run from this folder:

```powershell
git init
git add .
git commit -m "Initial Unbox Engine landing page"
git branch -M main
git remote add origin https://github.com/<github-username>/unboxengine-site.git
git push -u origin main
```

Replace `<github-username>` with your GitHub username.

For quotes or sales requests, use `unboxengine@gmail.com`.

## 3) Enable GitHub Pages

In GitHub repo settings:

1. Open `Settings` -> `Pages`.
2. Under `Build and deployment`, set:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
3. Save.

## 4) Configure Custom Domain in GitHub

Still in `Settings` -> `Pages`:

1. Set `Custom domain` to `unboxengine.com`.
2. Save and wait for domain checks to pass.
3. Enable `Enforce HTTPS` after certificate is ready.

Note: a root `CNAME` file in this project is already set to `unboxengine.com`.

## 5) Add GoDaddy DNS Records for GitHub Pages

In GoDaddy DNS Management for `unboxengine.com`, set exactly:

- `A` record, host `@`, value `185.199.108.153`, TTL `600`
- `A` record, host `@`, value `185.199.109.153`, TTL `600`
- `A` record, host `@`, value `185.199.110.153`, TTL `600`
- `A` record, host `@`, value `185.199.111.153`, TTL `600`
- `CNAME` record, host `www`, value `<github-username>.github.io`, TTL `600`

If `www` conflicts with another record, delete the existing `www` record first, then add the `CNAME`.

## 6) Expected DNS and SSL Timing

- DNS propagation: typically 5 to 30 minutes, sometimes up to 24 hours.
- GitHub Pages HTTPS provisioning: usually a few minutes after DNS resolves correctly.

## 7) Verify Deployment

Run:

```powershell
nslookup unboxengine.com
nslookup www.unboxengine.com
curl -I https://unboxengine.com
curl -I https://www.unboxengine.com
```

Expected:

- `unboxengine.com` resolves to GitHub Pages IPs (`185.199.108.153` to `185.199.111.153`).
- `www.unboxengine.com` resolves via CNAME to `<github-username>.github.io`.
- `https://unboxengine.com` returns `200`.
- `https://www.unboxengine.com` lands on the canonical apex domain after GitHub custom-domain setup is complete.

## 8) Troubleshooting

- Pages not live: confirm branch is `main` and folder is `/ (root)` in GitHub Pages settings.
- Domain not verifying: make sure all 4 apex `A` records are present and exact.
- `www` conflict in GoDaddy: remove existing `www` `A`/`CNAME`/forward rule, then add only one `CNAME`.
- HTTPS not enabled yet: wait for DNS propagation, then re-check `Enforce HTTPS`.

## 9) Repository Privacy Note (March 8, 2026)

Repository commit metadata was rewritten to remove personal identity data.

If you cloned this repo before this date, re-sync with one of these options:

```powershell
# Recommended: fresh clone
git clone https://github.com/<github-username>/unboxengine-site.git
```

```powershell
# Existing clone: hard reset to rewritten history
git fetch origin
git checkout main
git reset --hard origin/main
```
