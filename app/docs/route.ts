import { NextResponse } from "next/server";

// Serves the Scalar API reference UI at /docs
// Uses CDN — no extra npm dependencies required.
// Spec source: https://api.opencampusadvisor.org/openapi.json

export function GET() {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <title>API Reference — Open Campus Advisor</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Open Campus Advisor REST API reference — 37 colleges, course catalogs, faculty research, degree requirements, career outcomes." />
    <style>
      body { margin: 0; }
      .custom-header {
        background: #111;
        color: #fff;
        padding: 12px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        border-bottom: 1px solid #222;
      }
      .custom-header a { color: #999; text-decoration: none; }
      .custom-header a:hover { color: #fff; }
      .custom-header .sep { color: #444; }
    </style>
  </head>
  <body>
    <div class="custom-header">
      <a href="/">← Open Campus Advisor</a>
      <span class="sep">|</span>
      <span>API Reference</span>
      <span class="sep">|</span>
      <a href="https://api.opencampusadvisor.org/openapi.yaml" target="_blank">Download YAML</a>
      <a href="https://api.opencampusadvisor.org/openapi.json" target="_blank">Download JSON</a>
    </div>
    <script
      id="api-reference"
      data-url="https://api.opencampusadvisor.org/openapi.json"
      data-configuration='{"theme":"purple","layout":"modern","defaultHttpClient":{"targetKey":"javascript","clientKey":"fetch"}}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
