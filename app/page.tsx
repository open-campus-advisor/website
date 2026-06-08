import Link from "next/link";
import Image from "next/image";

const TOOLS = [
  // Per-school
  { name: "list_departments", description: "All departments and programs with subject codes", group: "Per-school" },
  { name: "search_courses", description: "Keyword + department search — sections, instructors, schedules", group: "Per-school" },
  { name: "get_course_details", description: "Prerequisites, gen-ed requirements, live enrollment per section", group: "Per-school" },
  { name: "list_first_year_seminars", description: "All first-year seminars grouped by department", group: "Per-school" },
  { name: "list_courses_for_freshmen", description: "Courses appropriate for first-year students in a department", group: "Per-school" },
  { name: "list_gen_ed_courses", description: "Courses fulfilling distribution requirements", group: "Per-school" },
  { name: "search_by_instructor", description: "All courses by an instructor — accepts names, not just IDs", group: "Per-school" },
  { name: "search_faculty_research", description: "Find faculty by research keyword within a department", group: "Per-school" },
  { name: "get_faculty_profile", description: "Full profile: bio, research, publications, and active NIH grants", group: "Per-school" },
  // Cross-school
  { name: "search_all_schools", description: "Search courses across all schools simultaneously — ranked by relevance", group: "Cross-school" },
  { name: "search_faculty_all_schools", description: "Find researchers by topic across all schools at once", group: "Cross-school" },
  // Navigation
  { name: "explore_academic_path", description: "Full path for a goal: schools ranked + majors + courses + faculty + grants", group: "Navigation" },
  { name: "get_major_requirements", description: "Degree requirements for a specific major at a specific school", group: "Navigation" },
  { name: "get_career_outcomes", description: "Career details: salary ranges, job outlook, skills, typical employers", group: "Navigation" },
  { name: "get_career_paths", description: "Reverse path: start from a career, find which majors and schools lead there", group: "Navigation" },
];

const EXAMPLES = [
  // Academics
  "What CS courses can I take as a freshman this fall?",
  "What are the prerequisites for CPSC 365 at Yale?",
  "Which courses at Stanford count toward WAYS requirements?",
  "Show me all first-year seminars related to climate or the environment.",
  // Research
  "Which CS professors at MIT do machine learning research?",
  "Who at Stanford is doing research on large language models?",
  "I'm interested in neuroscience — which professors at Columbia should I approach?",
  "Which BIOL faculty have active NIH grants right now?",
  // Path
  "I want to work in climate policy — which school is strongest for that path?",
  "What would my academic path look like if I want to become an ML engineer?",
  "What does a climate policy analyst actually earn, and which majors lead there?",
  "Compare neuroscience research across MIT, Yale, and Columbia.",
  "I'm choosing between Stanford and MIT for CS — what are the differences in curriculum and faculty?",
];

const TOOL_GROUPS = ["Per-school", "Cross-school", "Navigation"] as const;

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-24">

      {/* Header */}
      <header className="flex items-center justify-end">
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="https://api.opencampusadvisor.org/health" target="_blank" className="hover:text-gray-900 transition-colors">API status</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="space-y-6">
        <div className="flex items-center gap-5">
          <Image src="/logo-mark.png" alt="Open Campus Advisor" width={120} height={120} className="rounded-2xl"/>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Open Campus Advisor
          </h1>
        </div>
        <p className="text-2xl text-gray-400 font-light leading-snug">
          Academic navigation for students.
        </p>
        <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
          From career goal to course sequence — across five universities — through natural conversation with Claude or ChatGPT.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Wesleyan</span>
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Columbia</span>
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">MIT</span>
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Stanford</span>
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Yale</span>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <Link
            href="https://chatgpt.com/g/g-6a2583a8a7cc819198378184eaf9b15f-wesleyan-academic-advisor"
            target="_blank"
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Try with ChatGPT →
          </Link>
        </div>
      </section>

      {/* The graph */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">The academic graph</h2>
        <p className="text-gray-500 max-w-xl">
          Every academic decision connects to others. Open Campus Advisor maps those connections so students can navigate them — in any direction, across any school.
        </p>
        <div className="border border-gray-100 rounded-xl p-6 bg-gray-50 font-mono text-sm text-gray-600 space-y-1 leading-relaxed">
          <p>Career Goal</p>
          <p className="text-gray-300 pl-4">↕ bidirectional</p>
          <p className="pl-4">Matched Careers <span className="text-gray-400 font-sans text-xs">— salary, skills, outlook, employers</span></p>
          <p className="text-gray-300 pl-8">↕</p>
          <p className="pl-8">Matched Majors <span className="text-gray-400 font-sans text-xs">— degree requirements, course sequences</span></p>
          <p className="text-gray-300 pl-12">↕</p>
          <p className="pl-12">Live Courses <span className="text-gray-400 font-sans text-xs">— enrollment, schedules, instructors</span></p>
          <p className="text-gray-300 pl-16">↕</p>
          <p className="pl-16">Key Faculty <span className="text-gray-400 font-sans text-xs">— research profiles, publications</span></p>
          <p className="text-gray-300 pl-20">↕</p>
          <p className="pl-20">Active Grants <span className="text-gray-400 font-sans text-xs">— NIH funding, research areas</span></p>
        </div>
      </section>

      {/* Example prompts */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">What students ask</h2>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Academics</p>
            <div className="grid gap-2">
              {EXAMPLES.slice(0, 4).map((example) => (
                <div key={example} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-300 mt-0.5">›</span>
                  <span className="text-gray-700 italic">&ldquo;{example}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Research</p>
            <div className="grid gap-2">
              {EXAMPLES.slice(4, 8).map((example) => (
                <div key={example} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-300 mt-0.5">›</span>
                  <span className="text-gray-700 italic">&ldquo;{example}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Path & career</p>
            <div className="grid gap-2">
              {EXAMPLES.slice(8).map((example) => (
                <div key={example} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-300 mt-0.5">›</span>
                  <span className="text-gray-700 italic">&ldquo;{example}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">Install</h2>

        <div className="space-y-4">
          <h3 className="font-medium">Claude Desktop</h3>
          <p className="text-sm text-gray-500">
            Edit{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              ~/Library/Application Support/Claude/claude_desktop_config.json
            </code>
          </p>
          <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl text-sm overflow-x-auto leading-relaxed">{`{
  "mcpServers": {
    "open-campus-advisor": {
      "command": "npx",
      "args": ["open-campus-advisor"],
      "env": { "SCHOOL": "wesleyan" }
    }
  }
}`}</pre>
          <p className="text-sm text-gray-500">
            Change <code className="bg-gray-100 px-1 rounded text-xs">SCHOOL</code> to{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">wesleyan</code>,{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">columbia</code>,{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">mit</code>,{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">stanford</code>, or{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">yale</code>.
            Quit and relaunch Claude Desktop.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Claude Code</h3>
          <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl text-sm overflow-x-auto">{`claude mcp add open-campus-advisor -- npx open-campus-advisor`}</pre>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">ChatGPT</h3>
          <p className="text-sm text-gray-500">
            Use the{" "}
            <Link
              href="https://chatgpt.com/g/g-6a2583a8a7cc819198378184eaf9b15f-wesleyan-academic-advisor"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Wesleyan Academic Advisor GPT
            </Link>
            {" "}— works on ChatGPT mobile and desktop.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">15 tools, one interface</h2>
          <p className="text-gray-500 mt-2 text-sm">Per-school lookups, cross-school comparisons, and full academic path navigation.</p>
        </div>

        {TOOL_GROUPS.map(group => (
          <div key={group} className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{group}</p>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {TOOLS.filter(t => t.group === group).map((tool) => (
                <div key={tool.name} className="flex items-start gap-4 px-5 py-4 bg-white hover:bg-gray-50 transition-colors">
                  <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono whitespace-nowrap mt-0.5">
                    {tool.name}
                  </code>
                  <span className="text-sm text-gray-500">{tool.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Add your school */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Add your school</h2>
        <p className="text-gray-500">
          Any university with a public course catalog can be connected. Each school gets all 15 tools — course search, faculty research, cross-school comparisons, degree requirements, and career path navigation.
        </p>
        <p className="text-gray-500">
          Want your school on Open Campus Advisor?{" "}
          <Link
            href="mailto:tolga@breaklinedigital.com"
            className="text-gray-900 underline hover:no-underline"
          >
            Get in touch →
          </Link>
        </p>
      </section>

      {/* Coming soon: dashboard */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Campus insights dashboard</h2>
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Coming soon</span>
        </div>
        <p className="text-gray-500">
          Every query through Open Campus Advisor is logged anonymously. That data becomes a public dashboard — showing what students at each campus are actually exploring.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-gray-100 rounded-xl p-5 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Trending this week</p>
            <div className="space-y-2 pt-1">
              {["machine learning", "climate change", "neuroscience", "algorithms"].map((t) => (
                <div key={t} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t}</span>
                  <div className="h-1.5 rounded-full bg-gray-100 w-20 overflow-hidden">
                    <div className="h-full bg-gray-300 rounded-full" style={{width: t === "machine learning" ? "90%" : t === "climate change" ? "70%" : t === "neuroscience" ? "50%" : "35%"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-5 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Top career paths</p>
            <div className="space-y-2 pt-1">
              {["ML Engineer", "Climate Policy", "Data Scientist", "CS Research"].map((d) => (
                <div key={d} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{d}</span>
                  <div className="h-1.5 rounded-full bg-gray-100 w-20 overflow-hidden">
                    <div className="h-full bg-gray-300 rounded-full" style={{width: d === "ML Engineer" ? "85%" : d === "Climate Policy" ? "65%" : d === "Data Scientist" ? "55%" : "40%"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-5 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Most explored</p>
            <div className="space-y-2.5 pt-1">
              {[
                { label: "Academic paths", pct: "42%" },
                { label: "Faculty research", pct: "35%" },
                { label: "Course search", pct: "23%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Data is anonymized — no personal information is collected. <Link href="/privacy" className="underline hover:text-gray-600">Privacy policy →</Link>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 pt-8 flex items-center justify-between text-sm text-gray-400">
        <span>© 2026 Open Campus Advisor</span>
        <div className="flex gap-6">
          <Link href="https://api.opencampusadvisor.org/health" target="_blank" className="hover:text-gray-600 transition-colors">API status</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
        </div>
      </footer>

    </main>
  );
}
