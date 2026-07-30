/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BadgeCheck, ArrowRight, ChevronLeft, ChevronRight, Star, ShoppingBag, Tag } from "lucide-react";
import type { WCProduct } from "../types";

interface MadeInIndiaShowcaseProps {
  products: WCProduct[];
  loading: boolean;
  onViewAll: () => void;
  onProductClick: (product: WCProduct) => void;
}

export default function MadeInIndiaShowcase({ products, loading, onViewAll, onProductClick }: MadeInIndiaShowcaseProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter to only "MADE IN INDIA" category products
  const madeInIndiaProducts = products.filter(
    (p) => p.category.toLowerCase() === "made in india"
  );

  const slidesPerView = 4;
  const totalPages = Math.max(1, Math.ceil(madeInIndiaProducts.length / slidesPerView));

  const goTo = useCallback((page: number) => {
    setCurrentPage((prev) => {
      if (page < 0) return totalPages - 1;
      if (page >= totalPages) return 0;
      return page;
    });
  }, [totalPages]);

  // Auto-play
  useEffect(() => {
    if (isPaused || madeInIndiaProducts.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      goTo(currentPage + 1);
    }, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPage, isPaused, goTo, madeInIndiaProducts.length]);

  // Reset to first page when products change
  useEffect(() => {
    setCurrentPage(0);
  }, [products.length]);

  const visibleProducts = madeInIndiaProducts.slice(
    currentPage * slidesPerView,
    currentPage * slidesPerView + slidesPerView
  );

  // Loading skeletons
  if (loading) {
    return (
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="text-left">
            <div className="h-4 w-48 bg-[#E4DCB9]/40 rounded-full animate-pulse" />
            <div className="h-10 w-64 bg-[#E4DCB9]/30 rounded-lg mt-3 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#F0EBE0] animate-pulse">
              <div className="h-52 bg-[#E4DCB9]/30" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 bg-[#E4DCB9]/30 rounded" />
                <div className="h-3 w-full bg-[#E4DCB9]/30 rounded" />
                <div className="h-5 w-20 bg-[#E4DCB9]/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Empty state
  if (madeInIndiaProducts.length === 0) {
    return (
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <span className="text-xs font-black tracking-widest text-[#F6B828] uppercase font-sans">
            PROUDLY CRAFTED ACROSS INDIA
          </span>
          <h2 className="font-brush text-4xl sm:text-5xl text-[#0A2240] tracking-wide mt-1">
            MADE IN <span className="text-[#F6B828]">INDIA</span>
          </h2>
          <div className="mt-8 bg-[#FAF6EC] border border-[#E4DCB9] rounded-2xl p-10 max-w-md mx-auto">
            <ShoppingBag size={32} className="mx-auto mb-3 text-[#E4DCB9]" />
            <p className="font-semibold text-sm text-[#2F445A] mb-4">
              No Made in India products available yet. Check back soon!
            </p>
            <button
              onClick={onViewAll}
              className="bg-[#0A2240] hover:bg-[#1A3A5E] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
            >
              VISIT OUR STORE
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decorative element */}
      <div className="absolute top-6 right-12 w-20 h-20 bg-orange-100 rounded-full blur-xl pointer-events-none opacity-60" />
      <div className="absolute bottom-6 left-12 w-16 h-16 bg-amber-100 rounded-full blur-xl pointer-events-none opacity-60" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div className="text-left select-none">
          <span className="text-xs font-black tracking-widest text-[#F6B828] uppercase font-sans flex items-center gap-1.5">
            <BadgeCheck size={14} className="text-green-600" />
            PROUDLY CRAFTED ACROSS INDIA
          </span>
          <h2 className="font-brush text-4xl sm:text-5xl text-[#0A2240] tracking-wide mt-1">
            MADE IN <span className="text-[#F6B828]">INDIA</span>
          </h2>
          <p className="text-sm text-[#2F445A] font-medium mt-2 max-w-lg">
            Celebrating the hands, looms, and crafts that keep India's heritage alive — each product tells a story of tradition and skill.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View All button */}
          <button
            onClick={onViewAll}
            className="bg-[#0A2240] hover:bg-[#1A3A5E] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
          >
            <BadgeCheck size={16} />
            VIEW ALL MADE IN INDIA
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>

          {/* Carousel Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => goTo(currentPage - 1)}
              className="w-11 h-11 rounded-full bg-white border border-[#E4DCB9] hover:bg-[#F6B828] hover:border-[#F6B828] hover:text-white text-[#0A2240] flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
              aria-label="Previous"
              disabled={totalPages <= 1}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goTo(currentPage + 1)}
              className="w-11 h-11 rounded-full bg-white border border-[#E4DCB9] hover:bg-[#F6B828] hover:border-[#F6B828] hover:text-white text-[#0A2240] flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
              aria-label="Next"
              disabled={totalPages <= 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#F0EBE0] hover:border-[#F6B828]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer select-none"
              >
                {/* Product Image */}
                <div className="relative h-52 overflow-hidden bg-[#FAF6EC]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Sale tag */}
                  {product.onSale && (
                    <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Tag size={10} fill="white" />
                      SALE
                    </div>
                  )}

                  {/* Made in India badge */}
                  <div className="absolute bottom-3 right-3 bg-[#F6B828]/90 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Star size={10} fill="white" />
                    Made in India
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col items-start text-left">
                  <h3 className="font-display font-bold text-sm text-[#0A2240] leading-snug mb-2 group-hover:text-[#F6B828] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#2F445A] font-medium leading-relaxed mb-3 line-clamp-2 flex-grow">
                    {product.shortDescription || product.description}
                  </p>

                  {/* Price row */}
                  <div className="w-full pt-3 border-t border-[#F0EBE0]/60 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display font-extrabold text-lg text-[#0A2240]">
                        ₹{product.price}
                      </span>
                      {product.onSale && (
                        <span className="text-[10px] text-[#8A9EB4] line-through font-semibold">
                          ₹{product.regularPrice}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <BadgeCheck size={10} className="text-green-600" />
                      India
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentPage
                  ? "w-8 bg-[#F6B828]"
                  : "w-2 bg-[#E4DCB9] hover:bg-[#F6B828]/50"
              }`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      {totalPages > 1 && (
        <p className="text-center text-[10px] font-semibold text-[#8A9EB4] mt-4 uppercase tracking-widest select-none">
          {isPaused ? "⏸ PAUSED" : "▶ AUTO-SCROLLING"}
          <span className="mx-2">·</span>
          {currentPage + 1} / {totalPages}
          <span className="mx-2">·</span>
          {madeInIndiaProducts.length} products
        </p>
      )}
    </section>
  );
}
