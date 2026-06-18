# Open Campus Advisor — Website (opencampusadvisor.org)

## What this repo is

Pure static marketing site + student profile page. No server-side routes, no auth logic, no database — all of that lives in the main API repo (`api.opencampusadvisor.org`).

**Main API repo:** `github.com/open-campus-advisor/open-campus-advisor` (private)
**Website repo:** `github.com/open-campus-advisor/website` (this repo, public)

---

## Repo identity

| Thing | Value |
|---|---|
| GitHub | `github.com/open-campus-advisor/website` (public) |
| Deploy | Vercel → `opencampusadvisor.org` (auto-deploy on push to main) |
| Local path | `/tmp/oca-landing` |
| API | `https://api.opencampusadvisor.org` |

---

## Stack

- Next.js 16 (App Router) + Tailwind CSS
- No auth libraries — authentication is handled by the API
- No database — profile storage is Postgres on Railway (API side)
- No API routes — this is a pure frontend

---

## Pages

```
app/
  page.tsx          ← Main landing — hero, school badges, capabilities, examples
  layout.tsx        ← Root layout — fonts, metadata, OG tags, favicon
  integrate/
    page.tsx        ← B2B integration page (/integrate)
  profile/
    page.tsx        ← Student profile (/profile) — client-side JWT, calls API
  privacy/
    page.tsx        ← Privacy policy (/privacy)
  terms/
    page.tsx        ← Terms of Service (/terms)
public/
  logo-rectangle.png ← Full horizontal logo (1774×887) — used in hero
  logo-mark.png      ← Square mark — used for favicon + apple-touch-icon
  og-image.png       ← OpenGraph image for social sharing
```

---

## Profile page — how it works

`app/profile/page.tsx` is a pure client component. No server code.

**Auth flow:**
1. User visits `/api/v1/auth/login` on the API → Google consent → API issues JWT
2. API redirects to `https://opencampusadvisor.org/profile?token=JWT`
3. Profile page reads `?token=JWT` from URL, stores in `localStorage` as `oca_token`
4. Cleans token from URL (`window.history.replaceState`)
5. Fetches `GET https://api.opencampusadvisor.org/api/v1/profile` with Bearer JWT
6. Displays and allows editing of StudentContext fields
7. Saves via `POST https://api.opencampusadvisor.org/api/v1/profile`

**No server-side auth — the profile page has no access to the JWT on the server.** It's all client-side localStorage + fetch. This is intentional — the API handles all auth security.

**Sign in button:** Points to `https://api.opencampusadvisor.org/api/v1/auth/login` (API handles the full OAuth flow).

---

## What NOT to have in this repo

- `next-auth` or any auth library — auth is fully in the API
- Supabase client — database is in the API
- `lib/` directory — no shared backend utilities
- `app/api/` routes — no server-side API routes
- `middleware.ts` or `proxy.ts` — no route guards (auth state is client-side only)
- Any `NEXT_PUBLIC_SUPABASE_*` or `NEXTAUTH_*` env vars

---

## Env vars

None required for production. The profile page calls `api.opencampusadvisor.org` directly — no env vars needed on the Vercel side.

---

## Keeping in sync with main repo

When schools are added to the API:
1. Add badge to the array in `app/page.tsx` hero section
2. Update school count in `app/integrate/page.tsx` (3 places)
3. Update school count in `app/layout.tsx` metadata description
4. Re-import OpenAPI schema in the ChatGPT GPT editor

---

## Running locally

```bash
npm install
npm run dev   # → http://localhost:3000
```
