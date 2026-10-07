import React from "react";
import { MessageSquare, Building2, Mail, Phone, Calendar } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminEnquiriesPage() {
  const enquiries = await db.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-wine">
          Customer & Corporate Enquiries
        </h1>
        <p className="text-xs text-muted mt-1">
          Review inbound leads, bulk gifting quote requests, and concierge contact messages.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-4">
        {enquiries.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <MessageSquare className="w-10 h-10 mx-auto text-rose/40 mb-2" />
            <p className="font-serif font-bold text-wine text-base">No enquiries received yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((e) => (
              <div
                key={e.id}
                className="p-5 rounded-2xl bg-cream border border-blush/70 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blush/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        e.type === "corporate"
                          ? "bg-wine text-white"
                          : "bg-blush text-wine"
                      }`}
                    >
                      {e.type}
                    </span>
                    <h3 className="font-serif font-bold text-ink text-base">
                      {e.name} {e.company && `(${e.company})`}
                    </h3>
                  </div>

                  <span className="text-[11px] text-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(e.createdAt).toLocaleDateString("en-IN")}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-muted">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-wine" />
                    <a href={`mailto:${e.email}`} className="text-ink hover:underline">
                      {e.email}
                    </a>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-wine" />
                    <a href={`tel:${e.phone}`} className="text-ink hover:underline font-mono">
                      {e.phone}
                    </a>
                  </span>

                  {e.quantity && (
                    <span className="font-bold text-wine">
                      Quantity: {e.quantity} hampers
                    </span>
                  )}
                </div>

                <p className="text-ink/85 leading-relaxed bg-white p-3 rounded-xl border border-blush/40">
                  {e.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
