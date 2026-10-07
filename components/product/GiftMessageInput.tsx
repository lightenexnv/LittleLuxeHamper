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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-wine uppercase tracking-wider flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-gold" />
          <span>Complimentary Handwritten Note</span>
        </label>
        <span className="text-[11px] text-muted">
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
          className="w-full p-3 rounded-xl border border-blush bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-wine font-sans resize-none"
        />
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Sealed in parchment with our signature gold wax monogram</span>
        </div>
      </div>
    </div>
  );
}
