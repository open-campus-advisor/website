# Open Campus Advisor — Website

`opencampusadvisor.org` — Next.js 16 + Tailwind CSS, deployed on Vercel.

Pure static marketing site. No auth, no database, no API routes.
All backend logic lives in the main API repo at `api.opencampusadvisor.org`.

## Pages

| Route | Description |
|---|---|
| `/` | Main landing page |
| `/integrate` | B2B integration page for platform partners |
| `/profile` | Student profile — client-side JWT, calls API |
| `/privacy` | Privacy policy |
| `/terms` | Terms of Service |

## File structure

```
app/
  page.tsx          ← Landing page
  layout.tsx        ← Root layout, metadata, OG tags
  integrate/page.tsx  ← B2B page
  profile/page.tsx    ← Client-side profile (reads JWT from URL/localStorage)
  privacy/page.tsx
  terms/page.tsx
public/
  logo-rectangle.png  ← Full horizontal logo (1774×887)
  logo-mark.png       ← Square mark (favicon)
  og-image.png
```

## Profile page

`/profile` is a pure client component. No server code.

Students sign in at `https://api.opencampusadvisor.org/api/v1/auth/login` →
Google OAuth → API issues JWT → redirects to `/profile?token=JWT` →
page stores JWT in localStorage → calls API to fetch/update profile.

## Dependencies

```json
"next", "react", "react-dom"
```

No auth libraries. No database clients. No env vars required.

## Development

```bash
npm install
npm run dev   # → http://localhost:3000
```

## Deploy

Auto-deploys to Vercel on push to `main`.

## Related

- **API repo:** `github.com/open-campus-advisor/open-campus-advisor` (private)
- **REST API:** `https://api.opencampusadvisor.org`
- **npm package:** `open-campus-advisor`
