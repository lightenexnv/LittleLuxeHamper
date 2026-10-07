"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  city: string;
  occasion: string;
  text: string;
  rating: number;
}

const sampleReviews: Testimonial[] = [
  {
    name: "Pooja Singhania",
    city: "Mumbai",
    occasion: "Anniversary Surprise",
    text: "Ordered the Royal Velvet hamper for my husband on our 5th anniversary. The ribbon quality and the wax seal card made it look like a Parisian boutique purchase! He loved the dark Belgian chocolates.",
    rating: 5,
  },
  {
    name: "Dr. Rohit Mathur",
    city: "Bengaluru",
    occasion: "Diwali Client Gifts",
    text: "We ordered 40 custom festive boxes for our firm's advisory board. Every single recipient texted to compliment the brass diya and the saffron brittle. Flawless on-time dispatch.",
    rating: 5,
  },
  {
    name: "Simran Kaur",
    city: "New Delhi",
    occasion: "Sister's Birthday",
    text: "I was sending this from London to my sister in Gurugram. The tracking updates and the WhatsApp coordination gave me complete peace of mind. Truly five-star service.",
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((c) => (c === 0 ? sampleReviews.length - 1 : c - 1));
  };

  const next = () => {
    setCurrent((c) => (c === sampleReviews.length - 1 ? 0 : c + 1));
  };

  const item = sampleReviews[current];

  return (
    <section className="py-16 bg-cream border-t border-blush/60">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="bg-gold/90 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              SAMPLE TESTIMONIALS
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine">
            Words From Our Gifters
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1.5">
            Real customer joy once authentic reviews are imported. The quotes below represent illustrative customer experiences.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-luxe border border-blush/80 relative text-center">
          <Quote className="w-10 h-10 text-rose/30 mx-auto mb-4" />

          {/* Star Rating */}
          <div className="flex justify-center gap-1 text-gold mb-5">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gold text-gold" />
            ))}
          </div>

          <p className="font-serif text-lg sm:text-xl text-ink italic leading-relaxed mb-6 font-medium">
            &ldquo;{item.text}&rdquo;
          </p>

          <div className="border-t border-blush/60 pt-4">
            <h4 className="font-serif font-bold text-wine text-base">{item.name}</h4>
            <p className="text-xs text-muted">
              {item.city} &bull; <span className="text-rose-dark">{item.occasion}</span>
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex justify-between items-center absolute inset-y-0 -inset-x-5 sm:-inset-x-6 pointer-events-none">
            <button
              onClick={prev}
              className="pointer-events-auto p-2.5 rounded-full bg-white shadow-md text-wine hover:bg-wine hover:text-white border border-blush transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="pointer-events-auto p-2.5 rounded-full bg-white shadow-md text-wine hover:bg-wine hover:text-white border border-blush transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
