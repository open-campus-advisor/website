import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Open Campus Advisor",
};

export default function Privacy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 space-y-10">

      <header>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← Open Campus Advisor
        </Link>
      </header>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Effective date: June 7, 2026</p>
      </div>

      <div className="space-y-8 text-gray-600 leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">What Open Campus Advisor does</h2>
          <p>
            Open Campus Advisor is an open source tool that provides AI-powered academic advising
            by fetching publicly available data from university course catalogs and faculty pages.
            It works through Claude (Anthropic) and ChatGPT (OpenAI) as a plugin or MCP server.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Data we collect</h2>
          <p>
            We do not create user accounts. We do not collect names, email addresses, or any
            personally identifiable information.
          </p>
          <p>
            When you use the REST API (via ChatGPT or direct requests), we log anonymized usage
            events — specifically: which school was queried, which tool was used, and what keyword
            was searched. These events contain no personal information and are used only to
            understand aggregate usage patterns (e.g. "machine learning was searched 10 times in
            the COMP department this week").
          </p>
          <p>
            Analytics are processed by <a href="https://posthog.com" target="_blank" className="text-blue-600 hover:underline">PostHog</a>.
            When using the MCP server locally (via Claude Desktop or Claude Code), no data is sent
            to our servers — all requests go directly from your machine to the university's public
            catalog.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">University data</h2>
          <p>
            All course catalog data, faculty profiles, and research information is fetched from
            publicly accessible university websites and APIs (WesMaps for Wesleyan University,
            NIH Reporter for grant data). We do not store this data permanently — it is fetched
            live and cached for up to 60 minutes to reduce load on university servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Third-party AI services</h2>
          <p>
            Open Campus Advisor is accessed through third-party AI platforms (Claude by Anthropic,
            ChatGPT by OpenAI). Your conversations with those AI assistants are governed by their
            respective privacy policies — not this one.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Cookies</h2>
          <p>
            This website (opencampusadvisor.org) does not use cookies. The REST API
            (api.opencampusadvisor.org) does not set cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Open source</h2>
          <p>
            The full source code is available at{" "}
            <a href="https://github.com/open-campus-advisor/open-campus-advisor" target="_blank" className="text-blue-600 hover:underline">
              github.com/open-campus-advisor
            </a>. You can inspect exactly what data is collected and how it is used.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <p>
            Questions about this privacy policy? Open an issue on{" "}
            <a href="https://github.com/open-campus-advisor/open-campus-advisor/issues" target="_blank" className="text-blue-600 hover:underline">
              GitHub
            </a>.
          </p>
        </section>

      </div>

      <footer className="border-t border-gray-100 pt-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600 transition-colors">← Back to Open Campus Advisor</Link>
      </footer>

    </main>
  );
}
