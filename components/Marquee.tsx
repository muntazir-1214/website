"use client";

import { useCallback, useState } from "react";

function MarqueeWord({
  word,
  index,
  totalWords,
}: {
  word: string;
  index: number;
  totalWords: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(word);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = useCallback(async () => {
    if (draft === word) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content");
      const content = await res.json();
      // words are stored as comma-separated string
      const wordsArr = (content.marqueeWords || "").split(",");
      // Update the word at the original index (not the doubled index)
      const originalIndex = index % totalWords;
      wordsArr[originalIndex] = draft;
      content.marqueeWords = wordsArr.join(",");

      const saveRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (saveRes.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }, [draft, word, index, totalWords]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      setDraft(word);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <span className="relative inline-flex items-center">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          autoFocus
          className="inline-block bg-transparent border-b-2 border-lime-400 outline-none font-display text-2xl tracking-widest"
          style={{ width: `${Math.max(draft.length, 3)}ch` }}
        />
        <span className="absolute -top-5 left-0 text-[9px] text-lime-400 whitespace-nowrap">
          {saving ? "Saving…" : "Enter save · Esc cancel"}
        </span>
      </span>
    );
  }

  return (
    <span
      onClick={() => {
        setDraft(word);
        setEditing(true);
      }}
      className="cursor-pointer transition-all hover:outline hover:outline-1 hover:outline-dashed hover:outline-lime-400/50 relative group"
      title="Click to edit"
    >
      {word}
      <span className="absolute -top-5 left-0 text-[9px] text-lime-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        ✎ edit
      </span>
      {saved && (
        <span className="absolute -top-5 left-0 text-[9px] text-green-400 animate-fade-in whitespace-nowrap">
          ✓ saved
        </span>
      )}
    </span>
  );
}

export default function Marquee({ words }: { words: string[] }) {
  const doubled = [...words, ...words];

  return (
    <div className="overflow-hidden border-y border-zinc-800 bg-zinc-900/50 py-4">
      <div className="marquee-track flex w-max gap-10">
        {doubled.map((w, i) => (
          <span
            key={i}
            className={`flex items-center gap-10 whitespace-nowrap font-display text-2xl tracking-widest ${
              i % 2 === 0 ? "text-zinc-300" : "text-lime-400"
            }`}
          >
            <MarqueeWord
              word={w}
              index={i}
              totalWords={words.length}
            />
            <span className="text-zinc-700">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
