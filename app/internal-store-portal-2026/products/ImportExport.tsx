"use client";

import { useCallback, useRef, useState } from "react";

export default function ImportExport({ productCount }: { productCount: number }) {
  const [showImport, setShowImport] = useState(false);
  const [importFormat, setImportFormat] = useState<"json" | "csv">("json");
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [importContent, setImportContent] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Export ───────────────────────────────────────────────────────

  const handleExport = useCallback((format: "json" | "csv") => {
    window.open(`/api/admin/products/export?format=${format}`, "_blank");
  }, []);

  // ─── Import ───────────────────────────────────────────────────────

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Auto-detect format
      if (file.name.endsWith(".csv")) {
        setImportFormat("csv");
      } else if (file.name.endsWith(".json")) {
        setImportFormat("json");
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        setImportContent(ev.target?.result as string);
      };
      reader.readAsText(file);
      // Reset so the same file can be selected again
      e.target.value = "";
    },
    []
  );

  const handleImport = async () => {
    if (!importContent.trim()) {
      setImportError("No file content loaded.");
      return;
    }

    setImporting(true);
    setImportError(null);
    setImportResult(null);

    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: importContent,
          format: importFormat,
          mode: importMode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setImportResult(
          `✓ Successfully imported ${data.imported} products (${data.mode} mode). Total: ${data.total} products.`
        );
        setImportContent("");
        // Reload after a brief delay so the user can see the success message
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportError(data.error || "Import failed.");
      }
    } catch {
      setImportError("Network error during import.");
    } finally {
      setImporting(false);
    }
  };

  const closeImport = () => {
    setShowImport(false);
    setImportContent("");
    setImportResult(null);
    setImportError(null);
  };

  return (
    <>
      {/* Buttons */}
      <div className="flex items-center gap-2">
        {/* Export dropdown */}
        <div className="relative group">
          <button className="btn btn-ghost text-sm">↓ Export</button>
          <div className="invisible group-hover:visible absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-zinc-700 bg-zinc-900 py-1 shadow-xl">
            <button
              onClick={() => handleExport("json")}
              className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-lime-300 transition-colors"
            >
              Export as JSON
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-lime-300 transition-colors"
            >
              Export as CSV
            </button>
          </div>
        </div>

        {/* Import button */}
        <button
          onClick={() => setShowImport(true)}
          className="btn btn-ghost text-sm"
        >
          ↑ Import
        </button>
      </div>

      {/* Import modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={closeImport}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl tracking-wide text-zinc-50">
                IMPORT PRODUCTS
              </h3>
              <button
                onClick={closeImport}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all hover:border-lime-400/60 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            {/* Format & mode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">File Format</label>
                <div className="flex gap-2">
                  {(["json", "csv"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setImportFormat(f)}
                      className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all ${
                        importFormat === f
                          ? "border-lime-400/60 bg-lime-400/10 text-lime-300"
                          : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Import Mode</label>
                <div className="flex gap-2">
                  {(
                    [
                      { value: "merge", label: "Merge", desc: "Add new, update existing" },
                      { value: "replace", label: "Replace", desc: "Overwrite all products" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setImportMode(m.value)}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        importMode === m.value
                          ? "border-lime-400/60 bg-lime-400/10 text-lime-300"
                          : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      <span className="block text-sm font-semibold">{m.label}</span>
                      <span className="block text-[10px] text-zinc-500">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* File picker */}
            <div>
              <label className="label">Upload File</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/40 p-6 transition-all hover:border-zinc-600"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-zinc-500">
                  <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 3L17 8H7L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-zinc-400">
                  <span className="font-semibold text-lime-400">Click to browse</span> or drag a file
                </p>
                <p className="text-xs text-zinc-600">Accepts .json or .csv files</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Preview / content textarea */}
            {importContent && (
              <div>
                <label className="label">
                  File Content Preview
                  <span className="ml-2 text-zinc-600 normal-case">
                    ({importContent.length.toLocaleString()} chars)
                  </span>
                </label>
                <textarea
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  rows={8}
                  className="input resize-none font-mono text-xs"
                  placeholder="Paste JSON or CSV content here…"
                />
                <p className="mt-1 text-[10px] text-zinc-600">
                  You can also paste content directly into the text area above.
                </p>
              </div>
            )}

            {/* Results */}
            {importResult && (
              <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-3 text-sm text-lime-300 animate-fade-in">
                {importResult}
              </div>
            )}
            {importError && (
              <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400 animate-fade-in whitespace-pre-wrap">
                {importError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-zinc-500">
                {productCount} products currently in store
              </p>
              <div className="flex gap-3">
                <button onClick={closeImport} className="btn btn-ghost text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing || !importContent.trim()}
                  className="btn btn-primary text-sm"
                >
                  {importing ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <path d="M14 8A6 6 0 0 0 8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Importing…
                    </span>
                  ) : (
                    "Import Products →"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
