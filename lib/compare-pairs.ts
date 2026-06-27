export interface ComparePair {
  slug1: string;
  slug2: string;
  category: string;
}

export const COMPARE_PAIRS: ComparePair[] = [
  // Research Universities
  { slug1: "yale",       slug2: "columbia",    category: "Research Universities" },
  { slug1: "mit",        slug2: "stanford",    category: "Research Universities" },
  { slug1: "brown",      slug2: "penn",        category: "Research Universities" },
  { slug1: "cornell",    slug2: "columbia",    category: "Research Universities" },
  { slug1: "dartmouth",  slug2: "brown",       category: "Research Universities" },
  // Liberal Arts Colleges
  { slug1: "williams",   slug2: "wesleyan",    category: "Liberal Arts Colleges" },
  { slug1: "swarthmore", slug2: "pomona",      category: "Liberal Arts Colleges" },
  { slug1: "middlebury", slug2: "bates",       category: "Liberal Arts Colleges" },
  { slug1: "oberlin",    slug2: "grinnell",    category: "Liberal Arts Colleges" },
  { slug1: "swarthmore", slug2: "brynmawr",    category: "Liberal Arts Colleges" },
  { slug1: "vassar",     slug2: "wesleyan",    category: "Liberal Arts Colleges" },
  { slug1: "coloradocollege", slug2: "cornellcollege", category: "Liberal Arts Colleges" },
  // Claremont Consortium
  { slug1: "pomona",     slug2: "cmc",         category: "Claremont Consortium" },
  { slug1: "harveymudd", slug2: "pomona",      category: "Claremont Consortium" },
  // Engineering & STEM
  { slug1: "mit",        slug2: "harveymudd",  category: "Engineering & STEM" },
  { slug1: "harveymudd", slug2: "rosehulman",  category: "Engineering & STEM" },
  { slug1: "lafayette",  slug2: "union",       category: "Engineering & STEM" },
  // HBCUs
  { slug1: "morehouse",  slug2: "xaviernola",  category: "HBCUs" },
  { slug1: "morehouse",  slug2: "ncat",        category: "HBCUs" },
  { slug1: "ncat",       slug2: "morganstate", category: "HBCUs" },
  // Jesuit & Catholic
  { slug1: "notredame",  slug2: "gonzaga",     category: "Jesuit & Catholic Universities" },
  { slug1: "gonzaga",    slug2: "usfca",       category: "Jesuit & Catholic Universities" },
  // Virginia & Mid-Atlantic publics
  { slug1: "wm",         slug2: "davidson",    category: "Mid-Atlantic & Southeast" },
  { slug1: "jmu",        slug2: "radford",     category: "Mid-Atlantic & Southeast" },
];

export function pairId(slug1: string, slug2: string): string {
  return `${slug1}-vs-${slug2}`;
}

export function parsePairId(pair: string): { slug1: string; slug2: string } | null {
  const vsIdx = pair.indexOf("-vs-");
  if (vsIdx === -1) return null;
  const s1 = pair.slice(0, vsIdx);
  const s2 = pair.slice(vsIdx + 4);
  if (!s1 || !s2) return null;
  return { slug1: s1, slug2: s2 };
}

export function comparePairsForSchool(slug: string): ComparePair[] {
  return COMPARE_PAIRS.filter(p => p.slug1 === slug || p.slug2 === slug);
}
