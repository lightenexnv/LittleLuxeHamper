"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Check, ShoppingBag, ArrowRight, Package, Edit3, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/money";

interface BoxChoice {
  id: string;
  name: string;
  color: string;
  pricePaise: number;
  image: string;
  desc: string;
}

interface ItemChoice {
  id: string;
  name: string;
  category: string;
  pricePaise: number;
  image: string;
}

const boxes: BoxChoice[] = [
  {
    id: "box-burgundy",
    name: "Royal Velvet Keepsake Trunk (Wine)",
    color: "#6B2D3C",
    pricePaise: 89900,
    image: "/images/products/royal-velvet-anniversary-hamper-1.svg",
    desc: "Plush velvet lining with brass latch and 2-inch double satin ribbon",
  },
  {
    id: "box-blush",
    name: "Petite Pastel Keepsake Box (Blush Pink)",
    color: "#F3DDD6",
    pricePaise: 59900,
    image: "/images/products/blush-elegance-birthday-hamper-1.svg",
    desc: "Rigid 1200 GSM textured paper box with champagne ribbon",
  },
  {
    id: "box-ivory",
    name: "Classic Atelier Chest (Ivory & Gold)",
    color: "#FFF8E7",
    pricePaise: 74900,
    image: "/images/products/golden-festive-diwali-hamper-1.svg",
    desc: "Gold foil stamped lid with golden ribbon and wax seal",
  },
  {
    id: "box-noir",
    name: "Executive Matte Noir Chest (Black)",
    color: "#2A2024",
    pricePaise: 79900,
    image: "/images/products/executive-luxe-corporate-hamper-1.svg",
    desc: "Ultra-matte minimalist black exterior with silver trim",
  },
];

const availableItems: ItemChoice[] = [
  {
    id: "item-candle-rose",
    name: "Handmade Rose Petal Soy Candle (160g)",
    category: "Fragrance",
    pricePaise: 44900,
    image: "/images/addons/fragrant-rose-candle.svg",
  },
  {
    id: "item-truffles",
    name: "Belgian Dark Chocolate Rochers (Box of 6)",
    category: "Confectionery",
    pricePaise: 39900,
    image: "/images/addons/ferrero-rocher-pack.svg",
  },
  {
    id: "item-tea",
    name: "Kashmiri Saffron Kahwa Whole Leaves (100g)",
    category: "Beverage",
    pricePaise: 49900,
    image: "/images/products/artisan-tea-tranquility-box-1.svg",
  },
  {
    id: "item-scrunchie",
    name: "Pure Mulberry Silk Scrunchie (Blush)",
    category: "Accessories",
    pricePaise: 29900,
    image: "/images/addons/satin-hair-scrunchie.svg",
  },
  {
    id: "item-brittle",
    name: "Artisanal Caramel Almond Brittle (120g)",
    category: "Confectionery",
    pricePaise: 34900,
    image: "/images/products/golden-festive-diwali-hamper-2.svg",
  },
  {
    id: "item-mug",
    name: "Hand-glazed Ceramic Bistro Mug (Ivory)",
    category: "Lifestyle",
    pricePaise: 49900,
    image: "/images/products/midnight-truffle-indulgence-1.svg",
  },
];

export default function BuildYourHamperPage() {
  const router = useRouter();
  const { addItem, setGiftMessage } = useCartStore();

  const [selectedBox, setSelectedBox] = useState<BoxChoice>(boxes[0]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([
    availableItems[0].id,
    availableItems[1].id,
  ]);
  const [noteText, setNoteText] = useState("");
  const [added, setAdded] = useState(false);

  const toggleItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((i) => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const selectedItems = availableItems.filter((i) => selectedItemIds.includes(i.id));
  const itemsTotalPaise = selectedItems.reduce((acc, item) => acc + item.pricePaise, 0);
  const liveTotalPaise = selectedBox.pricePaise + itemsTotalPaise;

  const handleAddCustomBox = () => {
    // Generate custom hamper record for cart
    const customHamperId = `custom-hamper-${Date.now()}`;
    const customTitle = `Custom Hamper (${selectedBox.name.split("(")[0].trim()})`;

    addItem(
      {
        productId: customHamperId,
        slug: "build-your-hamper",
        name: customTitle,
        pricePaise: liveTotalPaise,
        mrpPaise: Math.round(liveTotalPaise * 1.2),
        imageUrl: selectedBox.image,
      },
      1,
      selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        pricePaise: item.pricePaise,
      }))
    );

    if (noteText.trim()) {
      setGiftMessage(noteText.trim());
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      router.push("/cart");
    }, 1000);
  };

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Banner */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Hamper Builder</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-1">
            Build Your Own Hamper
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Select your luxury box finish, curate your favorite artisanal treats, and customize your handwritten wax-sealed greeting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Builder Steps Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* STEP 1: Pick Box */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-blush/50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-wine text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h2 className="font-serif font-bold text-wine text-xl">Choose Your Keepsake Box</h2>
                </div>
                <span className="text-xs text-muted">Select 1 style</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {boxes.map((b) => {
                  const isSelected = selectedBox.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBox(b)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex gap-3.5 items-center ${
                        isSelected
                          ? "border-wine bg-blush/30 shadow-md ring-2 ring-wine/20"
                          : "border-blush bg-cream hover:border-gold"
                      }`}
                    >
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-white">
                        <Image src={b.image} alt={b.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-ink text-sm leading-tight">{b.name}</p>
                        <p className="text-[11px] text-muted line-clamp-2 mt-0.5">{b.desc}</p>
                        <p className="text-xs font-bold text-wine mt-1">{formatPrice(b.pricePaise)}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-wine text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STEP 2: Pick Items */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-blush/50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-wine text-white text-xs font-bold flex items-center justify-center">2</span>
                  <h2 className="font-serif font-bold text-wine text-xl">Select Artisanal Items & Delights</h2>
                </div>
                <span className="text-xs text-muted">Selected: {selectedItems.length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex gap-3.5 items-center ${
                        isSelected
                          ? "border-wine bg-blush/30 shadow-sm"
                          : "border-blush bg-white hover:border-gold"
                      }`}
                    >
                      <div className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0 bg-cream">
                        <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-gold tracking-wider">{item.category}</span>
                        <p className="font-serif font-bold text-ink text-xs line-clamp-1">{item.name}</p>
                        <p className="text-xs font-bold text-wine mt-0.5">+{formatPrice(item.pricePaise)}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded accent-wine w-4 h-4 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STEP 3: Handwritten Message */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-blush/50 pb-3">
                <span className="w-6 h-6 rounded-full bg-wine text-white text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="font-serif font-bold text-wine text-xl">Personalized Calligraphy Note</h2>
              </div>
              <p className="text-xs text-muted">
                Every custom box includes our wax-sealed gold foil greeting card at zero additional charge.
              </p>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value.slice(0, 250))}
                placeholder="Type your personal note here (up to 250 characters)..."
                className="w-full p-3 rounded-xl border border-blush bg-cream text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-wine resize-none font-sans"
              />
              <span className="text-[11px] text-muted">{noteText.length} / 250 characters</span>
            </section>
          </div>

          {/* Right Column: Live Price & Box Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-luxe space-y-5">
              <h3 className="font-serif font-bold text-wine text-xl pb-2 border-b border-blush/50">
                Bespoke Hamper Summary
              </h3>

              {/* Selected Box Preview */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-cream border border-blush/60 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gold tracking-widest">Base Box</span>
                  <p className="font-serif font-bold text-ink">{selectedBox.name}</p>
                  <p className="text-wine font-semibold">{formatPrice(selectedBox.pricePaise)}</p>
                </div>

                {/* Items in Box */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted tracking-widest block mb-1.5">
                    Included Items ({selectedItems.length})
                  </span>
                  {selectedItems.length === 0 ? (
                    <p className="text-muted italic text-[11px]">Select at least 1 item</p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-[11px]">
                          <span className="truncate max-w-[180px]">{item.name}</span>
                          <span className="font-semibold text-wine shrink-0">+{formatPrice(item.pricePaise)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-blush flex justify-between items-baseline">
                  <div>
                    <span className="font-serif font-bold text-wine text-xl">Total Price</span>
                    <p className="text-[10px] text-muted">GST Included</p>
                  </div>
                  <span className="font-serif font-bold text-wine text-2xl">
                    {formatPrice(liveTotalPaise)}
                  </span>
                </div>
              </div>

              {/* Add to Basket Action */}
              <button
                type="button"
                onClick={handleAddCustomBox}
                disabled={selectedItems.length === 0 || added}
                className={`w-full py-3.5 px-6 rounded-pill font-bold text-sm flex items-center justify-center gap-2 shadow-luxe transition-all ${
                  added
                    ? "bg-success text-white"
                    : "bg-wine text-cream hover:bg-wine-light disabled:opacity-50"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added & Redirecting...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Custom Box To Basket</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-muted flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Pan-India express tracked dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
