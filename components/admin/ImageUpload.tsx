"use client";

import { useCallback, useRef, useState } from "react";

type UploadResult = {
  path: string;
  filename: string;
};

export default function ImageUpload({
  value,
  onChange,
  label = "Product Image",
}: {
  value?: string;
  onChange: (path: string | undefined) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Upload failed");
          return;
        }

        const result: UploadResult = data;
        onChange(result.path);
      } catch {
        setError("Network error during upload");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      upload(file);
    } else {
      setError("Please drop an image file");
    }
  };

  const handleRemove = async () => {
    if (value) {
      // Delete from server
      const filename = value.split("/").pop();
      if (filename) {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename }),
        });
      }
    }
    onChange(undefined);
  };

  return (
    <div className="space-y-3">
      <label className="label">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800/50 aspect-square max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Product image"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
            title="Remove image"
          >
            ✕
          </button>
          <p className="mt-2 text-xs text-zinc-500 font-mono truncate">
            {value}
          </p>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all ${
          dragOver
            ? "border-lime-400/60 bg-lime-400/5"
            : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/40"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <>
            <svg className="animate-spin text-lime-400" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M22 12A10 10 0 0 0 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-zinc-400">Uploading…</p>
          </>
        ) : (
          <>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-zinc-500">
              <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3L17 8H7L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="text-center">
              <p className="text-sm text-zinc-300">
                <span className="font-semibold text-lime-400">Click to upload</span>{" "}
                or drag and drop
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                JPG, PNG, WebP, GIF or AVIF (max 5MB)
              </p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-400 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
