"use client";

import { useCallback, useState } from "react";

export default function InlineEdit({
  value,
  field,
  className = "",
  tag: Tag = "span",
}: {
  value: string;
  field: string;
  className?: string;
  tag?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = useCallback(async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      // Fetch current content, update the field, save back
      const res = await fetch("/api/admin/content");
      const content = await res.json();
      content[field] = draft;

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
      // Silently fail — user can retry
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }, [draft, value, field]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      setDraft(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <span className="relative inline-block">
        {Tag === "span" || Tag === "h1" || Tag === "h2" || Tag === "h3" ? (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`inline-block bg-transparent border-b-2 border-lime-400 outline-none ${className}`}
            style={{ width: `${Math.max(draft.length, 4)}ch` }}
          />
        ) : (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={2}
            className={`inline-block bg-transparent border-b-2 border-lime-400 outline-none resize-none ${className}`}
          />
        )}
        <span className="absolute -top-5 right-0 text-[9px] text-lime-400 whitespace-nowrap">
          {saving ? "Saving…" : "Enter to save · Esc to cancel"}
        </span>
      </span>
    );
  }

  return (
    <Tag
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={`${className} cursor-pointer transition-all hover:outline hover:outline-1 hover:outline-dashed hover:outline-lime-400/50 relative group`}
      title="Click to edit"
    >
      {value}
      <span className="absolute -top-4 right-0 text-[9px] text-lime-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        ✎ click to edit
      </span>
      {saved && (
        <span className="absolute -top-4 right-0 text-[9px] text-green-400 animate-fade-in whitespace-nowrap">
          ✓ saved
        </span>
      )}
    </Tag>
  );
}
