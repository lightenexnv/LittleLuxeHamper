"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, MessageSquarePlus } from "lucide-react";

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  body: string;
  isSample: boolean;
  createdAt: Date | string;
}

export function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: ReviewItem[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) {
      setError("Please fill in your name and review message");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, body }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName("");
        setBody("");
        setError(null);
      } else {
        setError("Unable to submit review at this moment");
      }
    } catch {
      setError("Network error while submitting review");
    }
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 5;

  return (
    <section className="mt-16 pt-12 border-t border-blush/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-wine">
            Customer Reviews
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(avgRating)
                      ? "fill-gold text-gold"
                      : "text-blush fill-blush"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-ink">
              {avgRating.toFixed(1)} out of 5 &bull; {reviews.length} reviews
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-wine text-wine text-xs font-semibold hover:bg-blush/30 transition-colors w-fit"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Submission Form Modal / Drawer */}
      {showForm && (
        <div className="mb-8 p-6 rounded-2xl bg-white border border-blush/80 shadow-sm max-w-xl">
          {submitted ? (
            <div className="p-4 bg-success/10 text-success rounded-xl flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you! Your review has been submitted for moderation.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-serif font-bold text-wine text-base">Share Your Unboxing Experience</h4>
              
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Tanvi K."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Rating</label>
                <div className="flex gap-1 text-gold">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? "fill-gold text-gold" : "text-blush"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Review Details</label>
                <textarea
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Tell others what you loved about the packaging, treats, or scent..."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine resize-none"
                />
              </div>

              {error && <p className="text-xs text-error">{error}</p>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-full border border-blush text-muted text-xs hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-wine text-white text-xs font-semibold hover:bg-wine-light transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-blush/60 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-wine text-sm sm:text-base">
                  {rev.name}
                </span>
                {rev.isSample && (
                  <span className="bg-gold/20 text-gold-dark text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    SAMPLE
                  </span>
                )}
              </div>
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating ? "fill-gold text-gold" : "text-blush fill-blush"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans">
              {rev.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
