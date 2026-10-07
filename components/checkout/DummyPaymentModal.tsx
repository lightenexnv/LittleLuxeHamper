"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Clock, ShieldAlert, CreditCard, Smartphone, Building } from "lucide-react";
import { formatPrice } from "@/lib/money";

export interface DummyPaymentModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: string;
  amountPaise: number;
  onSuccess: (paymentId: string) => void;
  onFailure: (errorMsg: string) => void;
  onPending: () => void;
  onClose: () => void;
}

export function DummyPaymentModal({
  isOpen,
  orderId,
  orderNumber,
  amountPaise,
  onSuccess,
  onFailure,
  onPending,
  onClose,
}: DummyPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulate = async (status: "SUCCESS" | "FAILED" | "PENDING") => {
    setProcessing(true);

    try {
      const dummyPaymentId = `dummy_pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status,
          paymentId: dummyPaymentId,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await res.json();

      if (status === "SUCCESS") {
        if (data.ok) {
          onSuccess(dummyPaymentId);
        } else {
          onFailure(data.error || "Payment verification failed");
        }
      } else if (status === "FAILED") {
        onFailure("Simulated payment rejection by dummy gateway");
      } else {
        onPending();
      }
    } catch {
      onFailure("Network communication failure with payment provider");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-gold/40">
        {/* Test Mode Banner */}
        <div className="bg-amber-500 text-ink py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>TEST MODE — Dummy Gateway (No Real Money Debited)</span>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
              Order #{orderNumber}
            </span>
            <h3 className="font-serif text-3xl font-bold text-wine">
              {formatPrice(amountPaise)}
            </h3>
            <p className="text-xs text-muted">
              Simulating Little Luxe Hamper Secure Payment Gateway
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink uppercase tracking-wider block">
              Simulated Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod("UPI")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === "UPI"
                    ? "border-wine bg-blush/30 text-wine font-bold"
                    : "border-blush text-ink hover:bg-cream"
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("CARD")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === "CARD"
                    ? "border-wine bg-blush/30 text-wine font-bold"
                    : "border-blush text-ink hover:bg-cream"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("NETBANKING")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === "NETBANKING"
                    ? "border-wine bg-blush/30 text-wine font-bold"
                    : "border-blush text-ink hover:bg-cream"
                }`}
              >
                <Building className="w-5 h-5" />
                <span className="text-xs">Netbanking</span>
              </button>
            </div>
          </div>

          {/* Simulation Outcome Buttons */}
          <div className="space-y-2.5 pt-2 border-t border-blush/60">
            <p className="text-xs font-bold text-ink">Choose Simulation Outcome:</p>

            {/* 1. Success Button */}
            <button
              type="button"
              disabled={processing}
              onClick={() => handleSimulate("SUCCESS")}
              className="w-full py-3 px-4 rounded-xl bg-success hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulate Payment SUCCESS</span>
            </button>

            {/* 2. Failure Button */}
            <button
              type="button"
              disabled={processing}
              onClick={() => handleSimulate("FAILED")}
              className="w-full py-3 px-4 rounded-xl bg-error hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Simulate Payment FAILURE</span>
            </button>

            {/* 3. Pending Button */}
            <button
              type="button"
              disabled={processing}
              onClick={() => handleSimulate("PENDING")}
              className="w-full py-2.5 px-4 rounded-xl border border-amber-500 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              <span>Simulate Payment PENDING / Webhook Delay</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="text-xs text-muted hover:text-ink underline"
            >
              Cancel and return to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
