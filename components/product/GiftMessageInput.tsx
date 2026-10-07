"use client";

import React from "react";
import { Edit3, Sparkles } from "lucide-react";
import { sanitizeText } from "@/lib/sanitize";

export function GiftMessageInput({
  message,
  onChange,
}: {
  message: string;
  onChange: (val: string) => void;
}) {
  const maxLength = 250;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    const sanitized = sanitizeText(raw, maxLength);
    onChange(sanitized);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-wine uppercase tracking-wider flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-gold" />
          <span>Complimentary Handwritten Note</span>
        </label>
        <span className="text-[11px] text-muted font-medium">
          {message.length} / {maxLength}
        </span>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={message}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder="E.g. Dearest Priya, Wishing you the happiest birthday filled with endless laughter! Love, Ananya"
          className="w-full p-3.5 rounded-2xl border border-blush bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-wine font-sans resize-none shadow-xs"
        />
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-muted">
          <Sparkles className="w-3 h-3 text-gold shrink-0" />
          <span>Handwritten on ivory parchment &amp; sealed with royal gold wax</span>
        </div>
      </div>

      {/* Live Stylised Gift Tag Preview */}
      {message.trim().length > 0 && (
        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE3] border border-gold/40 shadow-sm relative overflow-hidden">
          {/* Faux Ribbon Hole & Stamp */}
          <div className="flex items-center justify-between border-b border-gold/20 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border border-gold/60 bg-cream shadow-inner" />
              <span className="text-[10px] font-serif font-bold text-wine tracking-widest uppercase">
                Little Luxe Gift Tag Preview
              </span>
            </div>
            <div className="w-5 h-5 rounded-full bg-gold/30 border border-gold flex items-center justify-center text-[10px] font-serif text-wine font-bold">
              ✦
            </div>
          </div>

          <p className="font-serif italic text-sm text-ink/90 leading-relaxed font-normal min-h-[40px] whitespace-pre-wrap">
            &ldquo;{message}&rdquo;
          </p>

          <div className="mt-2 text-right">
            <span className="text-[9px] font-mono text-muted uppercase tracking-wider">
              — Sealed with Little Luxe wax seal
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
