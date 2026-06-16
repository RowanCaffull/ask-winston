"use client";

import { useState } from "react";
import { PEOPLE } from "@/lib/people";

export default function Home() {
  const [personId, setPersonId] = useState(PEOPLE[0].id);
  const [situation, setSituation] = useState("");
  const [response, setResponse] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPerson = PEOPLE.find((p) => p.id === personId)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!situation.trim() || loading) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId, situation }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResponse(data.response);
        setRespondentName(data.person);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Top nav bar */}
      <header className="border-b border-stone-100 px-8 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-stone-900">
          Ask Winston
        </span>
        <span className="text-xs text-stone-400 uppercase tracking-widest">
          Wisdom across time
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-14">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 mb-3">
            What would they say?
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Describe a situation or problem. Choose a voice from history. Get a
            response in their own style.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Person selector */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Choose a voice
            </label>
            <div className="relative">
              <select
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent appearance-none cursor-pointer pr-10 transition"
              >
                {PEOPLE.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.era}
                  </option>
                ))}
              </select>
              {/* chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="mt-1.5 text-stone-400 text-sm">
              {selectedPerson.description}
            </p>
          </div>

          {/* Situation input */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Your situation or question
            </label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe what you're facing…"
              rows={5}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent resize-none transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !situation.trim()}
            className="w-full bg-stone-900 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-150 tracking-wide text-sm"
          >
            {loading
              ? "Consulting the archives…"
              : `Ask ${selectedPerson.name.split(" ")[0]}`}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-widest">
                {respondentName}
              </span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-7">
              <p className="text-stone-800 leading-relaxed whitespace-pre-wrap text-[1.05rem]">
                {response}
              </p>
            </div>
          </div>
        )}

        <footer className="mt-14 text-center text-stone-300 text-xs">
          Responses are AI-generated in the style of historical figures — not their actual words.
        </footer>
      </div>
    </main>
  );
}
