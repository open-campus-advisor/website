"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://api.opencampusadvisor.org";
const TOKEN_KEY = "oca_token";

interface StudentContext {
  completed_courses?: string[];
  major?: string;
  year?: "freshman" | "sophomore" | "junior" | "senior";
  gpa?: number;
  career_targets?: string[];
  interests?: string[];
  constraints?: string[];
  transfer_credits?: string[];
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export default function ProfilePage() {
  const [token, setToken]     = useState<string | null>(null);
  const [email, setEmail]     = useState<string | null>(null);
  const [ctx, setCtx]         = useState<StudentContext>({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: grab token from URL or localStorage, then fetch profile
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    const activeToken = urlToken ?? getToken();
    if (!activeToken) {
      setLoading(false);
      return;
    }

    if (urlToken) {
      localStorage.setItem(TOKEN_KEY, urlToken);
      // Clean token out of URL without a reload
      window.history.replaceState({}, "", "/profile");
    }

    setToken(activeToken);

    fetch(`${API}/api/v1/profile`, {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        setCtx(data.student_context ?? {});
        setEmail(data.email ?? null);
      })
      .catch(() => setError("Could not load profile. Your session may have expired."))
      .finally(() => setLoading(false));
  }, []);

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/";
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v1/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ctx),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setCtx(data.student_context ?? {});
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function setList(field: keyof StudentContext, raw: string) {
    const items = raw.split(",").map(s => s.trim()).filter(Boolean);
    setCtx(c => ({ ...c, [field]: items }));
  }

  // ── Not signed in ────────────────────────────────────────────────────────────
  if (!loading && !token) {
    return (
      <main className="max-w-md mx-auto px-6 py-16 space-y-6">
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <p className="text-gray-500">
          Sign in with Google to save your academic profile. Once saved, every course
          search and faculty recommendation will be personalized to where you are and
          where you&apos;re going.
        </p>
        <a
          href={`${API}/api/v1/auth/login`}
          className="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Sign in with Google →
        </a>
        <p className="text-xs text-gray-400">
          We store only your email and academic preferences. No grades, no PII beyond
          that. See our{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-6 py-16 text-gray-400 text-sm">
        Loading your profile…
      </main>
    );
  }

  // ── Signed in ────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 space-y-10">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your profile</h1>
          {email && <p className="text-sm text-gray-400 mt-1">{email}</p>}
        </div>
        <button
          onClick={signOut}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          Sign out
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
      )}

      <div className="space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Year</label>
            <select
              value={ctx.year ?? ""}
              onChange={e => setCtx(c => ({ ...c, year: (e.target.value || undefined) as StudentContext["year"] }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select year</option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Major</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={ctx.major ?? ""}
              onChange={e => setCtx(c => ({ ...c, major: e.target.value || undefined }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Career goals</label>
          <p className="text-xs text-gray-400">Comma-separated — e.g. machine learning engineer, climate policy analyst</p>
          <input
            type="text"
            value={(ctx.career_targets ?? []).join(", ")}
            onChange={e => setList("career_targets", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interests</label>
          <p className="text-xs text-gray-400">Comma-separated — e.g. machine learning, environmental policy, neuroscience</p>
          <input
            type="text"
            value={(ctx.interests ?? []).join(", ")}
            onChange={e => setList("interests", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Constraints</label>
          <p className="text-xs text-gray-400">Comma-separated — e.g. NYC-based jobs only, May 2027 graduation, part-time</p>
          <input
            type="text"
            value={(ctx.constraints ?? []).join(", ")}
            onChange={e => setList("constraints", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed courses</label>
          <p className="text-xs text-gray-400">Comma-separated course codes — e.g. ENV200, PLSC301, CS101</p>
          <input
            type="text"
            value={(ctx.completed_courses ?? []).join(", ")}
            onChange={e => setList("completed_courses", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="pt-2 flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
        </div>

      </div>

      <p className="text-xs text-gray-400 border-t border-gray-100 pt-6">
        Your profile is used automatically when you chat with Open Campus Advisor
        via Claude or ChatGPT — no need to describe yourself every time. To delete
        all your data, email{" "}
        <a href="mailto:hello@opencampusadvisor.org" className="underline">
          hello@opencampusadvisor.org
        </a>.
      </p>

    </main>
  );
}
