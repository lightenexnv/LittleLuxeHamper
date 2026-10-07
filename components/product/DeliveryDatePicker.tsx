"use client";

import React from "react";
import { Calendar } from "lucide-react";

export function DeliveryDatePicker({
  selectedDate,
  onChange,
}: {
  selectedDate: string;
  onChange: (val: string) => void;
}) {
  // Earliest selectable date is tomorrow (or +2 days for artisanal prep)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Up to 60 days ahead
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 60);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-wine uppercase tracking-wider flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-gold" />
        <span>Preferred Target Delivery Date</span>
      </label>

      <input
        type="date"
        min={minDate}
        max={maxDate}
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-wine"
      />
      <p className="text-[11px] text-muted">
        We schedule courier dispatch so your hamper arrives right on or before your chosen date.
      </p>
    </div>
  );
}
