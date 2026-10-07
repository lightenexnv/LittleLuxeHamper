"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

export function WhatsAppFloat() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
  const defaultText = encodeURIComponent(
    "Hello Little Luxe Hamper! I am visiting your website and would love assistance choosing a luxury hamper."
  );

  const handleClick = () => {
    trackWhatsAppClick("floating_concierge");
  };

  return (
    <aside aria-label="WhatsApp Concierge" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30">
      <a
        href={`https://wa.me/${phone}?text=${defaultText}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
        aria-label="Chat with Concierge on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          Chat with Concierge
        </span>
      </a>
    </aside>
  );
}
