import type { Metadata } from "next";
import Link from "next/link";
import { SCHOOLS } from "../../lib/schools";
import { COMPARE_PAIRS, pairId } from "../../lib/compare-pairs";

export const metadata: Metadata = {
  title: "Compare Colleges — Academic Programs & Career Paths",
  description:
    "Side-by-side academic comparisons of US colleges and universities: programs, career pathways, and first-year experience — based on live course and faculty data. Not a rankings comparison.",
  alternates: { canonical: "https://opencampusadvisor.org/compare" },
};

const BASE = "https://opencampusadvisor.org";

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "College comparison guides — Open Campus Advisor",
  description: "Curated academic comparisons of US colleges and universities based on live course catalogs, faculty research, and degree program data.",
  numberOfItems: COMPARE_PAIRS.length,
  itemListElement: COMPARE_PAIRS.map((p, i) => {
    const m1 = SCHOOLS[p.slug1];
    const m2 = SCHOOLS[p.slug2];
    return {
      "@type": "ListItem",
      position: i + 1,
      name: `${m1?.name ?? p.slug1} vs ${m2?.name ?? p.slug2}`,
      url: `${BASE}/compare/${pairId(p.slug1, p.slug2)}`,
    };
  }),
};

// Group pairs by category for the index
const byCategory: Record<string, typeof COMPARE_PAIRS> = {};
for (const pair of COMPARE_PAIRS) {
  if (!byCategory[pair.category]) byCategory[pair.category] = [];
  byCategory[pair.category].push(pair);
}

const CATEGORY_ORDER = [
  "Research Universities",
  "Liberal Arts Colleges",
  "Claremont Consortium",
  "Engineering & STEM",
  "HBCUs",
  "Jesuit & Catholic Universities",
  "Mid-Atlantic & Southeast",
];

const orderedCategories = [
  ...CATEGORY_ORDER.filter(c => byCategory[c]),
  ...Object.keys(byCategory).filter(c => !CATEGORY_ORDER.includes(c)),
];

export default function ComparePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* Nav */}
      <div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← Open Campus Advisor
        </Link>
      </div>

      {/* Hero */}
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">School Comparisons</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          Compare colleges.<br />
          <span className="text-gray-400 font-light">Academically, not by ranking.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
          Side-by-side academic comparisons based on live course catalogs, faculty research, and degree programs — not prestige scores or admissions statistics.
        </p>
        <p className="text-sm text-gray-400 max-w-2xl">
          Each comparison covers academic strengths, signature programs, career pathways, and first-year experience. Ask follow-up questions through ChatGPT or Claude.
        </p>
      </section>

      {/* Comparison groups */}
      {orderedCategories.map(category => (
        <section key={category} className="space-y-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
            <span className="text-xs text-gray-400">{byCategory[category].length} comparisons</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {byCategory[category].map(p => {
              const m1 = SCHOOLS[p.slug1];
              const m2 = SCHOOLS[p.slug2];
              if (!m1 || !m2) return null;
              const id = pairId(p.slug1, p.slug2);
              return (
                <Link
                  key={id}
                  href={`/compare/${id}`}
                  className="group border border-gray-100 rounded-xl p-4 hover:border-gray-300 hover:bg-gray-50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900 text-sm group-hover:text-gray-700 leading-snug">
                      {m1.shortName} vs {m2.shortName}
                    </p>
                    <span className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-0.5">›</span>
                  </div>
                  <p className="text-xs text-gray-400">{m1.location} · {m2.location}</p>
                  {m1.strengths && m2.strengths && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {m1.strengths[0]} vs {m2.strengths[0]}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border border-gray-100 rounded-2xl p-8 space-y-4">
        <h2 className="text-xl font-semibold">Compare any two schools through ChatGPT</h2>
        <p className="text-gray-500 leading-relaxed text-sm max-w-xl">
          These pages cover the curated pairs with the richest comparison data. For any other combination — ask directly through the Open Campus Advisor GPT or connect Claude to the MCP server.
        </p>
        <div className="space-y-2">
          {[
            "Compare Vassar vs Bryn Mawr for pre-medical sciences",
            "Which has stronger CS faculty: Rose-Hulman or Harvey Mudd?",
            "What does the first year look like at Colorado College vs Cornell College?",
          ].map(q => (
            <div key={q} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
              <span className="text-gray-300 mt-0.5 shrink-0">›</span>
              <span className="text-xs text-gray-600 italic">&ldquo;{q}&rdquo;</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-wrap pt-1">
          <a
            href="https://chatgpt.com/g/g-6a2583a8a7cc819198378184eaf9b15f-open-campus-advisor"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Ask ChatGPT →
          </a>
          <Link href="/mcp" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">
            Connect to Claude →
          </Link>
          <Link href="/schools" className="text-gray-400 text-sm hover:text-gray-700 transition-colors">
            Browse all schools →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 pt-8 flex items-center justify-between text-sm text-gray-400">
        <span>© 2026 Open Campus Advisor</span>
        <div className="flex gap-6">
          <Link href="mailto:hello@opencampusadvisor.org" className="hover:text-gray-600 transition-colors">Contact</Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
        </div>
      </footer>

    </main>
  );
}
