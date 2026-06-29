import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSchoolMeta, SCHOOLS, ALL_SLUGS } from "../../../lib/schools";
import type { SchoolMeta } from "../../../lib/schools";
import { comparePairsForSchool, pairId } from "../../../lib/compare-pairs";

const API = "https://api.opencampusadvisor.org/api/v1";
const CHATGPT_URL = "https://chatgpt.com/g/g-6a2583a8a7cc819198378184eaf9b15f-open-campus-advisor";
const REVALIDATE = 3600;

interface Department { name: string; code: string }
interface CourseSection { instructor?: string; schedule?: string; seatsAvailable?: number | null }
interface Course { courseId: string; courseNumber: string; title: string; department: string; sections?: CourseSection[] }
interface FacultyMember { facultyId: string; name: string; titles?: string[]; researchSummary?: string; email?: string }

async function fetchDepartments(slug: string): Promise<Department[]> {
  try {
    const res = await fetch(`${API}/${slug}/departments`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function fetchCourses(slug: string, query: string, department?: string): Promise<Course[]> {
  try {
    const params = new URLSearchParams({ query });
    if (department) params.set("department", department);
    const res = await fetch(`${API}/${slug}/courses?${params}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.courses ?? [];
  } catch { return []; }
}

async function fetchFaculty(slug: string, query: string, department: string): Promise<FacultyMember[]> {
  try {
    const res = await fetch(`${API}/${slug}/faculty/search?query=${encodeURIComponent(query)}&department=${encodeURIComponent(department)}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

function buildPromptChips(meta: SchoolMeta, peerName: string | null): string[] {
  const { shortName, strengths, careerStrengths, signatureMajors } = meta;
  const firstCareer = careerStrengths?.[0];
  const firstStrength = strengths?.[0];
  const firstMajor = signatureMajors?.[0] ?? "computer science";

  const chip1 = firstCareer
    ? `What should I study at ${shortName} if I want to work in ${firstCareer}?`
    : `What courses should I take first year at ${shortName}?`;

  const chip2 = firstStrength
    ? `Which ${shortName} faculty research ${firstStrength}?`
    : `Which ${shortName} faculty have active research grants?`;

  const chip3 = peerName
    ? `Compare ${shortName} vs ${peerName} for ${firstMajor}`
    : `What does the ${firstMajor} major require at ${shortName}?`;

  return [chip1, chip2, chip3];
}

function buildFaqs(meta: SchoolMeta, peerName: string | null): Array<{ q: string; a: string }> {
  const { shortName, name, strengths, signatureMajors, careerStrengths } = meta;
  const featuredPrograms = signatureMajors?.slice(0, 2).join(" and ") ?? "programs across all departments";
  const featuredStrength = strengths?.[0] ?? "research";
  const featuredCareer = careerStrengths?.[0] ?? "your field";
  const firstMajor = signatureMajors?.[0] ?? "computer science";
  const compareTo = peerName ?? "other schools";

  return [
    {
      q: `What can I explore about ${name} on Open Campus Advisor?`,
      a: `You can search ${shortName}'s live course catalog updated every 60 minutes, find faculty research profiles with NIH grant data, and navigate degree requirements for 344+ curated majors — including ${featuredPrograms}.`,
    },
    {
      q: `How do I ask questions about ${shortName} through ChatGPT?`,
      a: `Open the Open Campus Advisor GPT and type any question in plain English — for example, "What should I study at ${shortName} to work in ${featuredCareer}?" or "Which ${shortName} faculty research ${featuredStrength}?" The GPT searches live ${shortName} data to answer.`,
    },
    {
      q: `Can I compare ${shortName} to other schools?`,
      a: `Yes — ask any comparison through ChatGPT or Claude. For example, "${shortName} vs ${compareTo} for ${firstMajor}." Open Campus Advisor searches live catalog and faculty data from 125+ schools.`,
    },
  ];
}

export function generateStaticParams() {
  return ALL_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = getSchoolMeta(slug);
  const title = `${meta.name} — Live Courses, Faculty & Degree Requirements`;

  const programs = meta.signatureMajors?.slice(0, 2).join(", ");
  const knownFor = meta.strengths?.slice(0, 2).join(" and ");

  let description: string;
  if (programs && knownFor) {
    description = `Search ${meta.name}'s live course catalog, explore ${programs} programs, and find faculty working in ${knownFor} — updated every 60 minutes. Ask anything through ChatGPT.`;
  } else if (programs) {
    description = `Search live ${meta.shortName} course catalogs, explore ${programs} programs and more — faculty research profiles with NIH grant data, updated every 60 minutes from the registrar.`;
  } else {
    description = `Search live ${meta.shortName} course catalogs, find faculty with active NIH grants, and navigate degree requirements — updated every 60 minutes from the registrar.`;
  }

  return {
    title,
    description,
    alternates: { canonical: `https://opencampusadvisor.org/schools/${slug}` },
    openGraph: { title, description, url: `https://opencampusadvisor.org/schools/${slug}` },
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getSchoolMeta(slug);

  if (!ALL_SLUGS.includes(slug)) notFound();

  const peerMeta = meta.peerSlug ? SCHOOLS[meta.peerSlug] : null;
  const peerName = peerMeta?.shortName ?? null;
  const promptChips = buildPromptChips(meta, peerName);
  const faqs = buildFaqs(meta, peerName);

  const hasSnapshot = !!(meta.strengths || meta.signatureMajors || meta.freshmanNote);

  const relatedMetas = (meta.relatedSlugs ?? [])
    .filter(s => SCHOOLS[s])
    .map(s => ({ slug: s, meta: SCHOOLS[s] }))
    .slice(0, 4);

  const comparePairs = comparePairsForSchool(slug).map(p => {
    const otherSlug = p.slug1 === slug ? p.slug2 : p.slug1;
    return { href: `/compare/${pairId(p.slug1, p.slug2)}`, otherName: SCHOOLS[otherSlug]?.shortName ?? otherSlug };
  }).slice(0, 3);

  // Fetch departments first, then use them for targeted course + faculty queries
  const departments = await fetchDepartments(slug);
  const firstDept = departments[0]?.code ?? "";

  const [csCourses, envCourses] = await Promise.all([
    fetchCourses(slug, "research", firstDept || undefined),
    fetchCourses(slug, "data science"),
  ]);
  const faculty = firstDept ? await fetchFaculty(slug, "research", firstDept) : [];

  const sampleCourses = [...csCourses, ...envCourses]
    .filter((c, i, arr) => arr.findIndex(x => x.courseId === c.courseId) === i)
    .slice(0, 6);

  const sampleFaculty = faculty.slice(0, 4);
  const deptGroups = [...departments].sort((a, b) => a.name.localeCompare(b.name));

  // Schema.org structured data — CollegeOrUniversity + BreadcrumbList + FAQPage
  const schoolEntity: Record<string, unknown> = {
    "@type": "CollegeOrUniversity",
    "@id": `https://opencampusadvisor.org/schools/${slug}#school`,
    name: meta.name,
    additionalType: meta.type,
    address: {
      "@type": "PostalAddress",
      addressLocality: meta.location.split(",")[0],
      addressRegion: meta.location.split(",")[1]?.trim(),
    },
    description: meta.highlight,
    url: `https://opencampusadvisor.org/schools/${slug}`,
  };

  if (meta.strengths) {
    schoolEntity.knowsAbout = meta.strengths;
  }
  if (meta.signatureMajors) {
    schoolEntity.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: `${meta.shortName} Academic Programs`,
      itemListElement: meta.signatureMajors.map(program => ({
        "@type": "Course",
        name: program,
        provider: { "@id": `https://opencampusadvisor.org/schools/${slug}#school` },
      })),
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      schoolEntity,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Open Campus Advisor", item: "https://opencampusadvisor.org" },
          { "@type": "ListItem", position: 2, name: "Schools", item: "https://opencampusadvisor.org/schools" },
          { "@type": "ListItem", position: 3, name: meta.name, item: `https://opencampusadvisor.org/schools/${slug}` },
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
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">Open Campus Advisor</Link>
        <span>›</span>
        <Link href="/schools" className="hover:text-gray-700 transition-colors">Schools</Link>
        <span>›</span>
        <span className="text-gray-600">{meta.shortName}</span>
      </div>

      {/* Hero */}
      <section className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{meta.type} · {meta.location}</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight">{meta.name}</h1>
          <p className="text-lg text-gray-500">{meta.enrollment}</p>
        </div>
        <div className="bg-slate-50 rounded-xl px-5 py-4">
          <p className="text-sm text-gray-600 leading-relaxed">{meta.highlight}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: String(departments.length || "—"), label: "Departments" },
            { value: "60 min", label: "Refresh cycle" },
            { value: sampleFaculty.length > 0 ? `${sampleFaculty.length}+` : "Live", label: "Faculty indexed" },
          ].map(s => (
            <div key={s.label} className="border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Thin-page context note — shown when rich editorial metadata is not yet available */}
      {!hasSnapshot && (
        <section className="bg-slate-50 rounded-xl px-5 py-4 space-y-1">
          <p className="text-sm text-gray-600 leading-relaxed">
            {meta.type === "Liberal Arts College" && "A small liberal arts college offering programs across humanities, social sciences, and natural sciences. Search the live catalog below to explore available courses and departments."}
            {meta.type === "Research University" && "A research university with undergraduate and graduate programs across multiple schools and colleges. Search the live catalog below to explore departments and courses."}
            {meta.type === "Engineering College" && "A specialized engineering and STEM-focused institution. Search the live catalog below to explore programs by discipline."}
            {meta.type === "Public University" && "A public university offering a broad range of undergraduate programs. Search the live catalog below to explore available courses and departments."}
            {!["Liberal Arts College","Research University","Engineering College","Public University"].includes(meta.type) && "Search the live catalog below to explore courses, departments, and faculty research."}
          </p>
        </section>
      )}

      {/* Academic snapshot — only shown when school has rich data */}
      {hasSnapshot && (
        <section className="space-y-5">
          <h2 className="text-xl font-semibold">Academic snapshot</h2>

          {meta.strengths && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Known for</p>
              <div className="flex flex-wrap gap-2">
                {meta.strengths.map(s => (
                  <span key={s} className="bg-slate-50 border border-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {meta.signatureMajors && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Notable programs</p>
              <p className="text-sm text-gray-600">{meta.signatureMajors.join(" · ")}</p>
            </div>
          )}

          {meta.careerStrengths && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Career tracks</p>
              <p className="text-sm text-gray-600">{meta.careerStrengths.join(" · ")}</p>
            </div>
          )}

          {meta.freshmanNote && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-widest text-blue-400 mb-1.5">First year</p>
              <p className="text-sm text-blue-900 leading-relaxed">{meta.freshmanNote}</p>
            </div>
          )}
        </section>
      )}

      {/* Departments — only show when count suggests real data (>20 means school-specific) */}
      {deptGroups.length > 20 && (
        <section className="space-y-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-semibold">Course subjects</h2>
            <span className="text-xs text-gray-400">{departments.length} subject areas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {deptGroups.map(dept => (
              <span key={dept.code} className="inline-flex items-center gap-1.5 border border-gray-100 rounded-full px-3 py-1 text-xs hover:border-gray-300 transition-colors">
                <span className="font-mono text-gray-400">{dept.code}</span>
                <span className="text-gray-600">{dept.name}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Sample courses */}
      {sampleCourses.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Sample live courses</h2>
            <p className="text-sm text-gray-400 mt-1">From the current term — updated every 60 minutes.</p>
          </div>
          <div className="space-y-2">
            {sampleCourses.map(course => {
              const section = course.sections?.[0];
              const seats = section?.seatsAvailable;
              return (
                <div key={course.courseId} className="border border-gray-100 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono text-gray-400 mr-2">{course.courseNumber}</span>
                      <span className="text-sm font-medium text-gray-900">{course.title}</span>
                    </div>
                    {seats != null && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${seats > 0 ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {seats > 0 ? `${seats} seats` : "Full"}
                      </span>
                    )}
                  </div>
                  {section?.instructor && (
                    <p className="text-xs text-gray-400">{section.instructor}{section.schedule ? ` · ${section.schedule}` : ""}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Faculty */}
      {sampleFaculty.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Faculty research</h2>
            <p className="text-sm text-gray-400 mt-1">Research profiles with active NIH grant data where available.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleFaculty.map(f => (
              <div key={f.facultyId} className="border border-gray-100 rounded-xl p-4 space-y-1.5">
                <p className="font-medium text-gray-900 text-sm">{f.name}</p>
                {f.titles?.[0] && <p className="text-xs text-gray-400">{f.titles[0]}</p>}
                {f.researchSummary && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{f.researchSummary}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA — ChatGPT-first */}
      <section className="border border-gray-100 rounded-2xl p-8 space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Ask ChatGPT about {meta.shortName}</h2>
          <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
            Search courses, find faculty, navigate degree requirements, and map your academic path — all in natural conversation.
          </p>
        </div>

        {/* Prompt chips */}
        <div className="space-y-2">
          {promptChips.map(q => (
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
          {peerMeta && meta.peerSlug && (
            <Link
              href={`/schools/${meta.peerSlug}`}
              className="text-gray-400 text-sm hover:text-gray-700 transition-colors"
            >
              Compare: {peerName} →
            </Link>
          )}
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

      {/* Compare links */}
      {comparePairs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-700">Compare {meta.shortName} with</h2>
          <div className="flex flex-wrap gap-2">
            {comparePairs.map(p => (
              <Link
                key={p.href}
                href={p.href}
                className="text-sm border border-gray-100 rounded-lg px-3 py-1.5 hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-600"
              >
                vs {p.otherName} →
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related schools */}
      {relatedMetas.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Similar schools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedMetas.map(({ slug: relSlug, meta: relMeta }) => (
              <Link
                key={relSlug}
                href={`/schools/${relSlug}`}
                className="group border border-gray-100 rounded-xl p-4 hover:border-gray-300 hover:bg-gray-50 transition-all space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-900 text-sm group-hover:text-gray-700 leading-snug">{relMeta.name}</p>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 mt-0.5">›</span>
                </div>
                <p className="text-xs text-gray-400">{relMeta.location} · {relMeta.type}</p>
                {relMeta.strengths && (
                  <p className="text-xs text-gray-500 line-clamp-1">{relMeta.strengths.slice(0, 2).join(" · ")}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 pt-8 space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 Open Campus Advisor</span>
          <div className="flex gap-6">
            <Link href="mailto:hello@opencampusadvisor.org" className="hover:text-gray-600 transition-colors">Contact</Link>
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
