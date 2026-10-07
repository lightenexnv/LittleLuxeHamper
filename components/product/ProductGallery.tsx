"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Instagram } from "lucide-react";
import { buildInstagramEmbedUrl } from "@/lib/instagram";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface GalleryReel {
  id: string;
  shortcode: string;
  instagramUrl: string;
  posterUrl: string;
  videoUrl?: string | null;
  caption: string;
}

export function ProductGallery({
  images,
  reels = [],
}: {
  images: GalleryImage[];
  reels?: GalleryReel[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReelPlaying, setIsReelPlaying] = useState(false);

  // Combine image slides + reel slides
  // Index 0..(images.length - 1) are images
  // Index images.length..(total - 1) are reels
  const totalSlides = images.length + reels.length;
  const isCurrentSlideReel = currentIndex >= images.length;
  const activeReelIndex = currentIndex - images.length;
  const currentReel = isCurrentSlideReel ? reels[activeReelIndex] : null;

  const goToSlide = (index: number) => {
    // When navigating away, stop active reel iframe/playback
    if (index !== currentIndex) {
      setIsReelPlaying(false);
    }
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    goToSlide(currentIndex === 0 ? totalSlides - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    goToSlide(currentIndex === totalSlides - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Slide Stage (4:5 Aspect Ratio) */}
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-blush/20 border border-blush shadow-sm group">
        {!isCurrentSlideReel ? (
          /* Image Slide */
          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex]?.url || "/images/products/royal-velvet-anniversary-hamper-1.svg"}
              alt={images[currentIndex]?.alt || "Hamper image"}
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
            />
          </div>
        ) : (
          /* Reel Slide */
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {isReelPlaying && currentReel ? (
              /* Mounted Instagram Embed Iframe (or self-hosted video) */
              currentReel.videoUrl ? (
                <video
                  src={currentReel.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={buildInstagramEmbedUrl(currentReel.shortcode)}
                  className="w-full h-full border-0"
                  allowTransparency={true}
                  allow="encrypted-media"
                  title="Instagram Reel Slide"
                />
              )
            ) : (
              /* Facade: Poster + Play Button */
              <div
                onClick={() => setIsReelPlaying(true)}
                className="relative w-full h-full cursor-pointer group/reel"
              >
                {currentReel && (
                  <Image
                    src={currentReel.posterUrl}
                    alt={currentReel.caption || "Reel poster"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover/reel:bg-black/20 transition-colors" />

                {/* Reel Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-sm">
                  <Instagram className="w-3.5 h-3.5 text-rose-light" />
                  <span className="font-semibold">Instagram Reel</span>
                </div>

                {/* Big Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 text-wine flex items-center justify-center shadow-xl group-hover/reel:scale-110 group-hover/reel:bg-white transition-all">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>

                {/* Tap to play hint */}
                <div className="absolute bottom-6 inset-x-0 text-center">
                  <span className="bg-ink/80 text-cream text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    Tap to play video
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
            <button
              onClick={prevSlide}
              className="pointer-events-auto p-2 rounded-full bg-white/80 text-wine hover:bg-white hover:text-ink shadow-md transition-all opacity-80 hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="pointer-events-auto p-2 rounded-full bg-white/80 text-wine hover:bg-white hover:text-ink shadow-md transition-all opacity-80 hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Mobile Slide Dots */}
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 md:hidden">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? "w-6 bg-wine" : "w-2 bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Thumbnails Below Main Stage */}
      {totalSlides > 1 && (
        <div className="hidden md:flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => goToSlide(idx)}
              className={`relative w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                currentIndex === idx
                  ? "border-wine shadow-md ring-2 ring-wine/20"
                  : "border-blush/60 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}

          {/* Reel Thumbnails */}
          {reels.map((reel, rIdx) => {
            const slideIdx = images.length + rIdx;
            return (
              <button
                key={reel.id || rIdx}
                onClick={() => goToSlide(slideIdx)}
                className={`relative w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  currentIndex === slideIdx
                    ? "border-wine shadow-md ring-2 ring-wine/20"
                    : "border-blush/60 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={reel.posterUrl}
                  alt="Reel thumbnail"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
