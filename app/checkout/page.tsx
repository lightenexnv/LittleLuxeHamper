"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Gift,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/money";
import { DummyPaymentModal } from "@/components/checkout/DummyPaymentModal";
import { trackEvent } from "@/lib/analytics";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    couponCode,
    giftMessage,
    deliveryDate,
    clearCart,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [targetDate, setTargetDate] = useState(deliveryDate || "");
  const [noteMessage, setNoteMessage] = useState(giftMessage || "");
  const [gstin, setGstin] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "COD">("UPI");

  // Server-computed pricing & checkout status
  const [pricing, setPricing] = useState<{
    subtotalPaise: number;
    addOnsTotalPaise: number;
    discountPaise: number;
    shippingPaise: number;
    codFeePaise: number;
    totalPaise: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dummy Payment Modal State
  const [dummyModalOpen, setDummyModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    id: string;
    number: string;
    totalPaise: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute pricing
  useEffect(() => {
    if (!mounted || items.length === 0) return;

    async function loadPricing() {
      try {
        const res = await fetch("/api/cart/price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.productId,
              qty: i.qty,
              addOnIds: i.addOns.map((a) => a.id),
            })),
            couponCode,
            isCod: paymentMethod === "COD",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setPricing(data);
        }
      } catch {
        // Fallback
      }
    }
    loadPricing();
  }, [mounted, items, couponCode, paymentMethod]);

  // Auto-fill City/State when 6-digit PIN is entered
  const handlePincodeChange = async (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    setPincode(cleaned);
    if (cleaned.length === 6) {
      try {
        const res = await fetch(`/api/pincode?pin=${cleaned}`);
        if (res.ok) {
          const data = await res.json();
          if (data.serviceable) {
            setCity(data.city);
            setState(data.state);
          }
        }
      } catch {
        // Ignore
      }
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!customerName.trim() || customerName.length < 2) {
      setErrorMsg("Please enter your full name");
      return false;
    }
    if (!customerEmail.includes("@") || !customerEmail.includes(".")) {
      setErrorMsg("Please enter a valid email address for order updates");
      return false;
    }
    const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit Indian phone number");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!addressLine1.trim() || addressLine1.length < 5) {
      setErrorMsg("Please provide your delivery street address");
      return false;
    }
    if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      setErrorMsg("Please provide a valid 6-digit Indian PIN code");
      return false;
    }
    if (!city.trim() || !state.trim()) {
      setErrorMsg("City and State are required");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
        trackEvent("begin_checkout");
      }
    }
  };

  // Submit Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.replace(/\D/g, "").slice(-10),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        landmark: landmark.trim() || undefined,
        pincode: pincode.trim(),
        city: city.trim(),
        state: state.trim(),
        recipientName: isGift ? recipientName.trim() : undefined,
        recipientPhone: isGift ? recipientPhone.replace(/\D/g, "").slice(-10) : undefined,
        deliveryDate: targetDate || undefined,
        giftMessage: noteMessage.trim() || undefined,
        gstin: gstin.trim() || undefined,
        paymentMethod,
        couponCode: couponCode || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          addOnIds: i.addOns.map((a) => a.id),
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to process checkout");
        setLoading(false);
        return;
      }

      // If COD, confirmed immediately
      if (data.isCod) {
        clearCart();
        router.push(`/order/${data.orderId}/confirmation`);
        return;
      }

      // If Prepaid (Dummy or Razorpay)
      setPendingOrder({
        id: data.orderId,
        number: data.orderNumber,
        totalPaise: pricing?.totalPaise || 0,
      });

      setDummyModalOpen(true);
    } catch {
      setErrorMsg("Network error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-[70vh] bg-cream" />;

  if (items.length === 0 && !pendingOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-cream">
        <h2 className="font-serif text-2xl font-bold text-wine">Your gift basket is empty</h2>
        <Link href="/shop" className="mt-4 px-6 py-2.5 rounded-pill bg-wine text-white text-xs font-semibold">
          Explore Hampers
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-8 sm:py-14">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        {/* Title & Progress Stepper */}
        <div className="mb-10 text-center max-w-lg mx-auto">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Express Pan-India Checkout
          </span>
          <h1 className="font-serif text-3xl font-bold text-wine mt-1">
            Complete Your Gift Order
          </h1>

          {/* Stepper Tabs */}
          <div className="flex items-center justify-between mt-6 max-w-sm mx-auto text-xs font-bold">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 pb-1 border-b-2 ${
                currentStep >= 1 ? "border-wine text-wine" : "border-transparent text-muted"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-wine text-white text-[10px] flex items-center justify-center">1</span>
              <span>Contact</span>
            </button>
            <span className="text-muted">&bull;&bull;&bull;</span>
            <button
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className={`flex items-center gap-1.5 pb-1 border-b-2 ${
                currentStep >= 2 ? "border-wine text-wine" : "border-transparent text-muted"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
                currentStep >= 2 ? "bg-wine text-white" : "bg-blush text-wine"
              }`}>2</span>
              <span>Shipping</span>
            </button>
            <span className="text-muted">&bull;&bull;&bull;</span>
            <button
              onClick={() => {
                if (validateStep1() && validateStep2()) setCurrentStep(3);
              }}
              className={`flex items-center gap-1.5 pb-1 border-b-2 ${
                currentStep === 3 ? "border-wine text-wine" : "border-transparent text-muted"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
                currentStep === 3 ? "bg-wine text-white" : "bg-blush text-wine"
              }`}>3</span>
              <span>Payment</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 max-w-3xl mx-auto p-4 rounded-xl bg-error/10 border border-error/30 text-error text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Checkout Form Area */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm">
            {/* STEP 1: Contact & Gifting */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-serif font-bold text-wine text-xl pb-2 border-b border-blush/50">
                  1. Contact Information
                </h3>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="E.g. Siddharth Verma"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine font-mono"
                    />
                  </div>
                </div>

                {/* Gift Recipient Checkbox */}
                <div className="p-4 rounded-2xl bg-blush/30 border border-blush/60 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-wine cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="rounded accent-wine w-4 h-4"
                    />
                    <span>This is a gift being sent directly to someone else</span>
                  </label>

                  {isGift && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-ink mb-1">Recipient Name</label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Recipient's Name"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-blush bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-ink mb-1">Recipient Phone</label>
                        <input
                          type="tel"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          placeholder="Recipient's Contact"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-blush bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3.5 rounded-pill bg-wine text-cream font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-wine-light transition-all shadow-md mt-4"
                >
                  <span>Continue to Shipping Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Address & Schedule */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-blush/50">
                  <h3 className="font-serif font-bold text-wine text-xl">
                    2. Delivery Address & Date
                  </h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-rose-dark hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                    Street Address / Flat / Floor / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / Flat No., Apartment Name, Street"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      Locality / Colony / Area
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Area or Colony"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      Prominent Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Near Metro / Landmark"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="6-digit PIN"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-wine uppercase tracking-wider mb-1">
                      Target Delivery Date
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      GSTIN (Optional B2B Invoice)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="29AAAAA0000A1Z5"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white font-mono uppercase"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3.5 rounded-pill bg-wine text-cream font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-wine-light transition-all shadow-md mt-4"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 3: Payment Selection & Review */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-blush/50">
                  <h3 className="font-serif font-bold text-wine text-xl">
                    3. Select Payment Method
                  </h3>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-rose-dark hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* UPI */}
                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === "UPI"
                        ? "border-wine bg-blush/30 shadow-sm"
                        : "border-blush bg-white hover:bg-cream"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                        className="accent-wine w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold text-ink flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-wine" />
                          <span>Instant UPI (GPay, PhonePe, Paytm, QR)</span>
                        </p>
                        <p className="text-[11px] text-muted">0% convenience fee &bull; Fastest dispatch</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-success">Recommended</span>
                  </label>

                  {/* Cards */}
                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === "CARD"
                        ? "border-wine bg-blush/30 shadow-sm"
                        : "border-blush bg-white hover:bg-cream"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "CARD"}
                        onChange={() => setPaymentMethod("CARD")}
                        className="accent-wine w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold text-ink flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-wine" />
                          <span>Debit / Credit Cards</span>
                        </p>
                        <p className="text-[11px] text-muted">Visa, Mastercard, RuPay, Amex</p>
                      </div>
                    </div>
                  </label>

                  {/* Netbanking */}
                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === "NETBANKING"
                        ? "border-wine bg-blush/30 shadow-sm"
                        : "border-blush bg-white hover:bg-cream"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "NETBANKING"}
                        onChange={() => setPaymentMethod("NETBANKING")}
                        className="accent-wine w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold text-ink">Netbanking</p>
                        <p className="text-[11px] text-muted">HDFC, ICICI, SBI, Axis & 50+ banks</p>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "border-wine bg-blush/30 shadow-sm"
                        : "border-blush bg-white hover:bg-cream"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="accent-wine w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold text-ink flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-wine" />
                          <span>Cash on Delivery (COD)</span>
                        </p>
                        <p className="text-[11px] text-muted">₹49 COD handling fee &bull; Verified via WhatsApp</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handlePlaceOrder}
                    className="w-full py-4 rounded-pill bg-wine text-cream hover:bg-wine-light font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-luxe transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Initializing Secure Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {paymentMethod === "COD"
                            ? "Confirm Cash On Delivery Order"
                            : `Pay ${formatPrice(pricing?.totalPaise || 0)} Securely`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Box */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-blush/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-wine text-lg pb-2 border-b border-blush/40">
                Order Items ({items.length})
              </h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={i.productId} className="flex gap-3 text-xs items-center">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-cream">
                      <Image
                        src={i.imageUrl}
                        alt={i.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-semibold text-ink truncate">{i.name}</p>
                      <p className="text-[11px] text-muted">Qty: {i.qty}</p>
                    </div>
                    <span className="font-semibold text-wine">
                      {formatPrice(i.pricePaise * i.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-blush/60 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-ink font-semibold">
                    {formatPrice(pricing?.subtotalPaise || 0)}
                  </span>
                </div>

                {pricing && pricing.addOnsTotalPaise > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Add-ons</span>
                    <span className="text-ink font-semibold">
                      {formatPrice(pricing.addOnsTotalPaise)}
                    </span>
                  </div>
                )}

                {pricing && pricing.discountPaise > 0 && (
                  <div className="flex justify-between text-success font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(pricing.discountPaise)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className="text-ink font-semibold">
                    {pricing?.shippingPaise === 0 ? (
                      <span className="text-success font-bold">FREE</span>
                    ) : (
                      formatPrice(pricing?.shippingPaise || 9900)
                    )}
                  </span>
                </div>

                {paymentMethod === "COD" && (
                  <div className="flex justify-between text-muted">
                    <span>COD Fee</span>
                    <span className="text-ink font-semibold">
                      {formatPrice(pricing?.codFeePaise || 4900)}
                    </span>
                  </div>
                )}

                <div className="border-t border-blush pt-2 flex justify-between items-baseline font-serif font-bold text-wine text-lg">
                  <span>Total (GST incl.)</span>
                  <span>{formatPrice(pricing?.totalPaise || 0)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-blush/60 text-[11px] text-muted space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>Complimentary gold wax seal calligraphy note included</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-wine shrink-0" />
                <span>Express courier tracking dispatched via SMS & Email</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dummy Payment Modal */}
      {dummyModalOpen && pendingOrder && (
        <DummyPaymentModal
          isOpen={dummyModalOpen}
          orderId={pendingOrder.id}
          orderNumber={pendingOrder.number}
          amountPaise={pendingOrder.totalPaise}
          onSuccess={(paymentId) => {
            clearCart();
            setDummyModalOpen(false);
            trackEvent("purchase", {
              transaction_id: pendingOrder.number,
              value: pendingOrder.totalPaise / 100,
            });
            router.push(`/order/${pendingOrder.id}/confirmation`);
          }}
          onFailure={(error) => {
            setDummyModalOpen(false);
            setErrorMsg(error || "Payment was rejected. Your cart remains intact.");
          }}
          onPending={() => {
            setDummyModalOpen(false);
            setErrorMsg("Payment confirmation is pending. We will notify you once received.");
          }}
          onClose={() => setDummyModalOpen(false)}
        />
      )}
    </div>
  );
}
