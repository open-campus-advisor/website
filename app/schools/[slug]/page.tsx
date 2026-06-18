import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SCHOOLS, ALL_SLUGS } from "../../../lib/schools";

export function generateStaticParams() {
  return ALL_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const school = SCHOOLS[slug];
  if (!school) return {};
  return {
    title: `${school.name} — Courses, Faculty & Majors`,
    description: `Live course catalog, faculty research, and degree requirements for ${school.name}. ${school.highlight}`,
    alternates: { canonical: `https://opencampusadvisor.org/schools/${slug}` },
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = SCHOOLS[slug];
  if (!school) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">

      {/* Nav */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">Open Campus Advisor</Link>
        <span>›</span>
        <Link href="/schools" className="hover:text-gray-700 transition-colors">Schools</Link>
        <span>›</span>
        <span className="text-gray-700">{school.shortName}</span>
      </div>

      {/* Hero */}
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{school.type} · {school.location}</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight">{school.name}</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">{school.highlight}</p>
        <p className="text-sm text-gray-400">{school.enrollment}</p>
      </section>

      {/* What you can ask */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">What to ask about {school.shortName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Courses", examples: [`What CS courses can I take as a freshman at ${school.shortName}?`, `Which ${school.shortName} courses fulfill the writing requirement?`] },
            { label: "Faculty & Research", examples: [`Which ${school.shortName} professors study climate science?`, `Who at ${school.shortName} has active NIH grants in neuroscience?`] },
            { label: "Degree Requirements", examples: [`What are the requirements for a CS major at ${school.shortName}?`, `How many credits does ${school.shortName}&apos;s Economics major require?`] },
            { label: "Career Paths", examples: [`What careers do ${school.shortName} Biology majors go into?`, `What does a ${school.shortName} CS graduate typically earn?`] },
          ].map(cat => (
            <div key={cat.label} className="border border-gray-100 rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{cat.label}</p>
              <div className="space-y-2">
                {cat.examples.map(ex => (
                  <p key={ex} className="text-sm text-gray-600 italic">&ldquo;{ex}&rdquo;</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 rounded-2xl px-6 py-8 space-y-4">
        <p className="font-semibold text-gray-900">Ask about {school.name} now</p>
        <p className="text-sm text-gray-500">Connect through Claude or ChatGPT — no account required.</p>
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="https://chatgpt.com/g/g-6a2583a8a7cc819198378184eaf9b15f-wesleyan-academic-advisor"
            target="_blank"
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Open in ChatGPT →
          </Link>
          <Link href="/mcp" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">
            Connect via Claude →
          </Link>
        </div>
      </section>

      {/* Footer nav */}
      <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-100 pt-8">
        <Link href="/schools" className="hover:text-gray-700 transition-colors">← All schools</Link>
        <Link href="/" className="hover:text-gray-700 transition-colors">Open Campus Advisor →</Link>
      </div>

    </main>
  );
}
