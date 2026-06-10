# Security

## Reporting a Vulnerability

Email **hello@opencampusadvisor.org** with details. We aim to respond within 48 hours.

---

## Known Issues

### nodemailer SMTP Command Injection (Moderate)

| | |
|---|---|
| **CVEs** | GHSA-c7w3-x93f-qmm8, GHSA-vvjj-xcjg-gr5g |
| **Package** | `nodemailer ≤8.0.4` (via `next-auth → @auth/core → nodemailer`) |
| **Upstream fix** | Not yet available |
| **Discovered** | 2026-06-10 |

**What it is:** SMTP command injection through an unsanitized `envelope.size` parameter or CRLF in the transport name option. Affects email-based sign-in flows.

**Practical impact here:** The `/auth` sign-in page passes a user-supplied email address into next-auth. Without mitigation, a crafted email string could inject SMTP commands.

**Mitigation applied:** Server-side email validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) runs before any email reaches the email provider, blocking the injection vector.

**What we're watching:** [nodemailer releases](https://github.com/nodemailer/nodemailer/releases) and [@auth/core releases](https://github.com/nextauthjs/next-auth/releases). We will upgrade as soon as a patched version ships.

---

### PostCSS XSS via Unescaped `</style>` (Moderate)

| | |
|---|---|
| **CVE** | GHSA-qx2v-qp2m-jg93 |
| **Package** | `postcss <8.5.10` (bundled inside Next.js 9.3.4-canary.0 – 16.3.0-canary.5) |
| **Current Next.js** | 16.2.9 (latest stable — still in vulnerable range) |
| **Fix available** | Next.js ≥16.3.0 (currently in canary as of 2026-06-10) |
| **Discovered** | 2026-06-10 |

**What it is:** PostCSS's CSS stringify output can include unescaped `</style>` sequences, which could lead to XSS if that output is injected into an HTML document.

**Practical impact here:** This is a **build-time** tool. It would only be exploitable if user-controlled input reached PostCSS during the build step. This site has no user-generated CSS — the attack surface does not exist in practice.

**What we're watching:** Next.js 16.3.0 stable release. We will upgrade immediately when it ships.

---

## Dependency Audit

Run `npm audit` in this repo to see the current vulnerability state. As of 2026-06-10:

- **2 low** — transitive, no practical impact
- **4 moderate** — the two issues above (each counted twice in the dependency chain)
- **0 high / critical**
