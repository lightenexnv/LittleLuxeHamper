"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function PincodeChecker() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    serviceable: boolean;
    etaDays: number;
    estimatedDeliveryDate: string;
    city: string;
    state: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pin.trim())) {
      setError("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/pincode?pin=${encodeURIComponent(pin.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to check pincode");
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to check delivery serviceability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-blush/80 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-wine">
        <MapPin className="w-4 h-4 text-gold" />
        <span>Check Delivery & Estimated Arrival</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setError(null);
          }}
          placeholder="Enter 6-digit Indian PIN"
          className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine font-medium"
        />
        <button
          type="submit"
          disabled={loading || pin.length !== 6}
          className="px-4 py-2 rounded-lg bg-wine text-white text-xs font-semibold hover:bg-wine-light transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>Verify</span>
        </button>
      </form>

      {error && (
        <p className="text-xs text-error flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}

      {result && (
        <div className="text-xs space-y-1 pt-1 border-t border-blush/40">
          {result.serviceable ? (
            <>
              <p className="text-success font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Express Delivery Available to {result.city}, {result.state}</span>
              </p>
              <p className="text-muted ml-5">
                Estimated arrival by <strong className="text-ink">{result.estimatedDeliveryDate}</strong> ({result.etaDays} business days)
              </p>
            </>
          ) : (
            <p className="text-error font-medium flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Sorry, this pincode is currently outside our courier delivery network.</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
