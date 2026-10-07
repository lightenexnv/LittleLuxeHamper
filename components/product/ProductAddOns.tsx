"use client";

import React from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/money";

export interface AddOnItem {
  id: string;
  name: string;
  pricePaise: number;
  imageUrl: string;
}

export function ProductAddOns({
  addOns,
  selectedAddOnIds,
  onChange,
}: {
  addOns: AddOnItem[];
  selectedAddOnIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) => {
    if (selectedAddOnIds.includes(id)) {
      onChange(selectedAddOnIds.filter((item) => item !== id));
    } else {
      onChange([...selectedAddOnIds, id]);
    }
  };

  if (!addOns || addOns.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-wine uppercase tracking-wider">
          Complete The Gift (Add-ons)
        </label>
        <span className="text-[11px] text-muted">Optional</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {addOns.map((addon) => {
          const isSelected = selectedAddOnIds.includes(addon.id);
          return (
            <div
              key={addon.id}
              onClick={() => toggle(addon.id)}
              className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                isSelected
                  ? "bg-blush/30 border-wine shadow-sm"
                  : "bg-white border-blush hover:border-gold"
              }`}
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-cream">
                <Image
                  src={addon.imageUrl}
                  alt={addon.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink line-clamp-1">{addon.name}</p>
                <p className="text-xs text-wine font-bold">+{formatPrice(addon.pricePaise)}</p>
              </div>

              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="rounded accent-wine w-4 h-4 mr-1 cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
