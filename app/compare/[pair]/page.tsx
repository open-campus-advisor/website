import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SCHOOLS } from "../../../lib/schools";
import type { SchoolMeta } from "../../../lib/schools";
import { COMPARE_PAIRS, parsePairId, pairId, comparePairsForSchool } from "../../../lib/compare-pairs";

const BASE = "https://opencampusadvisor.org";
const CHATGPT_URL = "https://chatgpt.com/g/g-6a2583a8a7cc819198378184eaf9b15f-open-campus-advisor";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARE_PAIRS
    .filter(p => {
      const m1 = SCHOOLS[p.slug1];
      const m2 = SCHOOLS[p.slug2];
      return (
        m1 && m2 &&
        (m1.strengths?.length || m1.signatureMajors?.length) &&
        (m2.strengths?.length || m2.signatureMajors?.length)
      );
    })
    .map(p => ({ pair: pairId(p.slug1, p.slug2) }));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function hasRichData(m: SchoolMeta): boolean {
  return !!(m.strengths?.length || m.signatureMajors?.length);
}

function buildSchoolProfile(meta: SchoolMeta): string {
  const strengths = meta.strengths?.slice(0, 2).join(" and ") ?? "broad academic programs";
  const careers = meta.careerStrengths?.slice(0, 2).join(" and ") ?? "various fields";
  const programs = meta.signatureMajors?.slice(0, 2).join(" and ") ?? "programs across departments";
  return `${meta.shortName} is known for ${strengths}. Commonly explored programs include ${programs}, with graduates frequently entering careers in ${careers}.`;
}

function buildCompareChips(m1: SchoolMeta, m2: SchoolMeta): string[] {
  const career = m1.careerStrengths?.[0] ?? "research";
  const strength = m1.strengths?.[0] ?? "science";
  const major = m1.signatureMajors?.[0] ?? "computer science";
  return [
    `Compare ${m1.shortName} vs ${m2.shortName} for ${career}`,
    `Which ${m1.shortName} or ${m2.shortName} faculty research ${strength}?`,
    `What are the ${major} requirements at ${m1.shortName} vs ${m2.shortName}?`,
  ];
}

function buildFaqs(m1: SchoolMeta, m2: SchoolMeta) {
  const s1 = m1.shortName;
  const s2 = m2.shortName;
  const careers = m1.careerStrengths?.[0] ?? "your field";
  const strength1 = m1.strengths?.slice(0, 2).join(" and ") ?? "broad programs";
  const strength2 = m2.strengths?.slice(0, 2).join(" and ") ?? "broad programs";
  const programs1 = m1.signatureMajors?.join(", ") ?? "various programs";
  const programs2 = m2.signatureMajors?.join(", ") ?? "various programs";

  return [
    {
      q: `What are the main academic differences between ${m1.name} and ${m2.name}?`,
      a: `${s1} is known for ${strength1}. ${s2} is known for ${strength2}. Both have live course catalogs on Open Campus Advisor, updated every 60 minutes — you can search specific departments and programs at each school directly.`,
    },
    {
      q: `Which programs can I compare between ${s1} and ${s2}?`,
      a: `Notable programs at ${s1} include ${programs1}. Notable programs at ${s2} include ${programs2}. Open Campus Advisor indexes both schools' full catalogs with real-time enrollment data.`,
    },
    {
      q: `How can I ask ChatGPT to compare ${s1} and ${s2}?`,
      a: `Open the Open Campus Advisor ChatGPT GPT and ask — for example, "Compare ${s1} vs ${s2} for ${careers}." The GPT searches live catalog and faculty data from both schools simultaneously and can answer follow-up questions.`,
    },
  ];
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePairId(pair);
  if (!parsed) return {};
  const m1 = SCHOOLS[parsed.slug1];
  const m2 = SCHOOLS[parsed.slug2];
  if (!m1 || !m2) return {};

  const title = `${m1.name} vs ${m2.name} — Academic Programs, Career Paths & Programs`;
  const s1 = m1.strengths?.slice(0, 2).join(", ") ?? "broad programs";
  const s2 = m2.strengths?.slice(0, 2).join(", ") ?? "broad programs";
  const description = `Academic comparison of ${m1.shortName} and ${m2.shortName}: ${m1.shortName} is known for ${s1}; ${m2.shortName} for ${s2}. Compare programs, career paths, and first-year experience — based on live course and faculty data.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/compare/${pair}` },
    openGraph: { title, description, url: `${BASE}/compare/${pair}` },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ComparePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePairId(pair);
  if (!parsed) notFound();

  const { slug1, slug2 } = parsed;
  const meta1 = SCHOOLS[slug1];
  const meta2 = SCHOOLS[slug2];

  if (!meta1 || !meta2) notFound();
  if (!hasRichData(meta1) || !hasRichData(meta2)) notFound();

  const chips = buildCompareChips(meta1, meta2);
  const faqs = buildFaqs(meta1, meta2);
  const profile1 = buildSchoolProfile(meta1);
  const profile2 = buildSchoolProfile(meta2);

  // Related pairs for this comparison (pairs involving either school, excluding self)
  const related1 = comparePairsForSchool(slug1).filter(p => pairId(p.slug1, p.slug2) !== pair);
  const related2 = comparePairsForSchool(slug2).filter(p => pairId(p.slug1, p.slug2) !== pair);
  const relatedSeen = new Set<string>();
  const relatedPairs = [...related1, ...related2].filter(p => {
    const id = pairId(p.slug1, p.slug2);
    if (relatedSeen.has(id)) return false;
    relatedSeen.add(id);
    return true;
  }).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${BASE}/compare/${pair}#page`,
        name: `${meta1.name} vs ${meta2.name} — Academic Comparison`,
        url: `${BASE}/compare/${pair}`,
        description: `Academic comparison of ${meta1.name} and ${meta2.name} based on live course and faculty data.`,
        about: [
          { "@type": "CollegeOrUniversity", name: meta1.name, url: `${BASE}/schools/${slug1}` },
          { "@type": "CollegeOrUniversity", name: meta2.name, url: `${BASE}/schools/${slug2}` },
        ],
        breadcrumb: { "@id": `${BASE}/compare/${pair}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE}/compare/${pair}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Open Campus Advisor", item: BASE },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${BASE}/compare` },
          { "@type": "ListItem", position: 3, name: `${meta1.shortName} vs ${meta2.shortName}`, item: `${BASE}/compare/${pair}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-gray-700 transition-colors">Open Campus Advisor</Link>
        <span>›</span>
        <Link href="/compare" className="hover:text-gray-700 transition-colors">Compare</Link>
        <span>›</span>
        <span className="text-gray-600">{meta1.shortName} vs {meta2.shortName}</span>
      </div>

      {/* Hero */}
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Academic Comparison</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          {meta1.name}<br />
          <span className="text-gray-400 font-light">vs {meta2.name}</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
          Programs, career paths, and first-year experience — based on live course and faculty data.
        </p>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-2.5 max-w-2xl">
          This is an academic data comparison. It covers curriculum, programs, and faculty. It is not a rankings comparison, prestige analysis, or admissions likelihood estimate.
        </p>
      </section>

      {/* Quick facts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">At a glance</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { slug: slug1, meta: meta1 },
            { slug: slug2, meta: meta2 },
          ].map(({ slug, meta }) => (
            <div key={slug} className="border border-gray-100 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-gray-900 text-base">{meta.name}</p>
              <div className="space-y-1.5 text-xs text-gray-500">
                <p><span className="font-medium text-gray-700">Location</span> · {meta.location}</p>
                <p><span className="font-medium text-gray-700">Type</span> · {meta.type}</p>
                <p><span className="font-medium text-gray-700">Enrollment</span> · {meta.enrollment}</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{meta.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Academic strengths */}
      {(meta1.strengths || meta2.strengths) && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Academic strengths</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { slug: slug1, meta: meta1 },
              { slug: slug2, meta: meta2 },
            ].map(({ slug, meta }) => (
              <div key={slug} className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{meta.shortName}</p>
                <div className="flex flex-wrap gap-1.5">
                  {meta.strengths?.map(s => (
                    <span key={s} className="bg-slate-50 border border-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">{s}</span>
                  )) ?? <span className="text-xs text-gray-400">—</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Signature programs */}
      {(meta1.signatureMajors || meta2.signatureMajors) && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Notable programs</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { slug: slug1, meta: meta1 },
              { slug: slug2, meta: meta2 },
            ].map(({ slug, meta }) => (
              <div key={slug} className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{meta.shortName}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {meta.signatureMajors?.join(" · ") ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Career pathways */}
      {(meta1.careerStrengths || meta2.careerStrengths) && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Career pathways</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { slug: slug1, meta: meta1 },
              { slug: slug2, meta: meta2 },
            ].map(({ slug, meta }) => (
              <div key={slug} className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{meta.shortName}</p>
                <ul className="space-y-1">
                  {meta.careerStrengths?.map(c => (
                    <li key={c} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-300">›</span>{c}
                    </li>
                  )) ?? <span className="text-xs text-gray-400">—</span>}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* First-year experience */}
      {(meta1.freshmanNote || meta2.freshmanNote) && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">First-year experience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { slug: slug1, meta: meta1 },
              { slug: slug2, meta: meta2 },
            ].map(({ slug, meta }) => meta.freshmanNote ? (
              <div key={slug} className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-widest text-blue-400">{meta.shortName} · First year</p>
                <p className="text-sm text-blue-900 leading-relaxed">{meta.freshmanNote}</p>
              </div>
            ) : (
              <div key={slug} className="border border-gray-100 rounded-xl px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1.5">{meta.shortName} · First year</p>
                <p className="text-sm text-gray-400">Search {meta.shortName}&apos;s first-year seminars and introductory courses in the live catalog.</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic profile */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Academic profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-gray-100 rounded-xl p-5 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{meta1.shortName}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{profile1}</p>
            <Link href={`/schools/${slug1}`} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              Full {meta1.shortName} profile →
            </Link>
          </div>
          <div className="border border-gray-100 rounded-xl p-5 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{meta2.shortName}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{profile2}</p>
            <Link href={`/schools/${slug2}`} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              Full {meta2.shortName} profile →
            </Link>
          </div>
        </div>
      </section>

      {/* ChatGPT CTA */}
      <section className="border border-gray-100 rounded-2xl p-8 space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Ask ChatGPT to compare {meta1.shortName} and {meta2.shortName}</h2>
          <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
            Search live course catalogs, find faculty, and navigate degree requirements at both schools through natural conversation.
          </p>
        </div>
        <div className="space-y-2">
          {chips.map(q => (
            <div key={q} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
              <span className="text-gray-300 mt-0.5 shrink-0">›</span>
              <span className="text-xs text-gray-600 italic">&ldquo;{q}&rdquo;</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-wrap pt-1">
          <a
            href={CHATGPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Ask ChatGPT →
          </a>
          <Link href="/mcp" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">
            Connect to Claude →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold">Frequently asked</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border border-gray-100 rounded-xl p-5 space-y-2">
              <p className="text-sm font-medium text-gray-900">{q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Individual school links */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Explore each school</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[{ slug: slug1, meta: meta1 }, { slug: slug2, meta: meta2 }].map(({ slug, meta }) => (
            <Link
              key={slug}
              href={`/schools/${slug}`}
              className="group border border-gray-100 rounded-xl p-4 hover:border-gray-300 hover:bg-gray-50 transition-all space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-gray-900 text-sm group-hover:text-gray-700">{meta.name}</p>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-0.5">›</span>
              </div>
              <p className="text-xs text-gray-400">{meta.location} · {meta.enrollment}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Related comparisons */}
      {relatedPairs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Related comparisons</h2>
          <div className="flex flex-wrap gap-2">
            {relatedPairs.map(p => {
              const id = pairId(p.slug1, p.slug2);
              const m1 = SCHOOLS[p.slug1];
              const m2 = SCHOOLS[p.slug2];
              if (!m1 || !m2) return null;
              return (
                <Link
                  key={id}
                  href={`/compare/${id}`}
                  className="text-sm border border-gray-100 rounded-lg px-3 py-1.5 hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-600"
                >
                  {m1.shortName} vs {m2.shortName}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 pt-8 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex gap-4">
            <Link href="/" className="hover:text-gray-600 transition-colors">Open Campus Advisor</Link>
            <span>·</span>
            <Link href="/compare" className="hover:text-gray-600 transition-colors">All comparisons</Link>
            <span>·</span>
            <Link href="/schools" className="hover:text-gray-600 transition-colors">School directory</Link>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
          </div>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Open Campus Advisor is an independent educational platform and is not affiliated with, endorsed by, or sponsored by any college, university, or institution unless explicitly stated.
        </p>
      </footer>

    </main>
  );
}
