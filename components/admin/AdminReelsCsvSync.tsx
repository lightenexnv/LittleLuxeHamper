"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Check, Loader2, AlertCircle } from "lucide-react";

export function AdminReelsCsvSync() {
  const router = useRouter();
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ updatedCount: number; createdCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/admin/reels/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: csvText }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ updatedCount: data.updatedCount, createdCount: data.createdCount });
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || "Failed to import CSV");
      }
    } catch {
      setError("Network error occurred during CSV import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-bold text-wine text-xl flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            <span>Bulk CSV Reel Import & Sync</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Sync reel URLs in bulk from <code>content/reel-links.csv</code>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(!showModal)}
          className="px-4 py-2 bg-cream text-wine border border-blush font-bold text-xs rounded-pill hover:bg-blush/30 transition-colors w-fit"
        >
          {showModal ? "Hide CSV Importer" : "Open CSV Importer"}
        </button>
      </div>

      {showModal && (
        <div className="pt-4 border-t border-blush/40 space-y-4 animate-fade-in text-xs">
          <div>
            <label className="block font-bold text-ink mb-1.5">
              Select CSV File or Paste Raw CSV (mediaId, thumbnailPath, instagramUrl)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-xs text-muted file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-wine file:text-white hover:file:bg-wine-light cursor-pointer mb-2"
            />
            <textarea
              rows={5}
              placeholder={`mediaId,thumbnailPath,instagramUrl\n"3944067240609796323","/media/images/...","https://www.instagram.com/reel/Da8JEI-zVDj/"`}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-3 font-mono text-[11px] rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-error font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="flex items-center gap-1.5 text-success font-medium">
              <Check className="w-4 h-4 shrink-0" />
              <span>
                Synced successfully! Updated {result.updatedCount} reels, created {result.createdCount} new reels.
              </span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleImport}
              disabled={loading || !csvText.trim()}
              className="px-6 py-2.5 rounded-pill bg-wine text-white font-bold hover:bg-wine-light transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <Upload className="w-3.5 h-3.5" />
              <span>Run CSV Sync</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
