/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { WCProduct } from "../types";

const MAX_CAROUSEL_PRODUCTS = 8;
const SLIDES_PER_VIEW = 4;

interface WooCommerceShopProps {
  products: WCProduct[];
  loading: boolean;
  selectedCategory: string | null;
  onProductClick: (product: WCProduct) => void;
  onClearCategory: () => void;
  onViewAll: () => void;
}

export default function WooCommerceShop({
  products,
  loading,
  selectedCategory,
  onProductClick,
  onClearCategory,
  onViewAll
}: WooCommerceShopProps) {

  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter products by selected merch category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()))
    : products;

  // Products shown in carousel (max 10)
  const carouselProducts = filteredProducts.slice(0, MAX_CAROUSEL_PRODUCTS);
  const totalPages = Math.max(1, Math.ceil(carouselProducts.length / SLIDES_PER_VIEW));

  const goTo = useCallback((page: number) => {
    setCurrentPage((prev) => {
      if (page < 0) return totalPages - 1;
      if (page >= totalPages) return 0;
      return page;
    });
  }, [totalPages]);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused || carouselProducts.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      goTo(currentPage + 1);
    }, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPage, isPaused, goTo, carouselProducts.length]);

  // Reset page when products change
  useEffect(() => {
    setCurrentPage(0);
  }, [products.length, selectedCategory]);

  const visibleProducts = carouselProducts.slice(
    currentPage * SLIDES_PER_VIEW,
    currentPage * SLIDES_PER_VIEW + SLIDES_PER_VIEW
  );

  // Loading Skeletons
  if (loading) {
    return (
      <section id="woocommerce-shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#F0EBE0]/60 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="text-left">
            <div className="h-4 w-48 bg-[#E4DCB9]/40 rounded-full animate-pulse" />
            <div className="h-10 w-72 bg-[#E4DCB9]/30 rounded-lg mt-3 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-[#F0EBE0] shadow-sm animate-pulse">
              <div className="h-64 bg-[#E4DCB9]/30" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-20 bg-[#E4DCB9]/30 rounded" />
                <div className="h-6 w-full bg-[#E4DCB9]/30 rounded" />
                <div className="h-5 w-24 bg-[#E4DCB9]/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <section id="woocommerce-shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#F0EBE0]/60 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="text-left select-none">
            <span className="text-xs font-black tracking-widest text-[#F6B828] uppercase font-sans">OFFICIAL MERCHANDISE</span>
            <h2 className="font-brush text-4xl sm:text-5xl text-[#0A2240] tracking-wide mt-1">PAKKA PATRIOT <span className="text-[#F6B828]">STORE</span></h2>
          </div>
        </div>
        <div className="bg-[#FAF6EC] border border-[#E4DCB9] rounded-2xl p-12 text-center max-w-md mx-auto">
          <ShoppingBag size={40} className="mx-auto mb-3 text-[#E4DCB9]" />
          <p className="font-display font-bold text-lg text-[#0A2240] mb-2">No Products in Category</p>
          <p className="text-sm text-[#2F445A] mb-4">We don't have catalog items in "{selectedCategory}" at the moment.</p>
          <button onClick={onClearCategory} className="bg-[#F6B828] hover:bg-[#DAA520] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow cursor-pointer">
            Show All Products
          </button>
        </div>
      </section>
    );
  }

  // Render a single product card
  const renderProductCard = (product: WCProduct) => (
    <div
      key={product.id}
      onClick={() => onProductClick(product)}
      className="group bg-white rounded-3xl overflow-hidden border border-[#F0EBE0] hover:border-[#F6B828]/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Sale Tag */}
      {product.onSale && (
        <div className="absolute top-4 left-4 z-10 bg-[#F6B828] text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md select-none">
          <Tag size={10} fill="white" />
          SALE
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-52 sm:h-64 overflow-hidden bg-[#FAF6EC]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col items-start text-left">
        <span className="text-[10px] font-black tracking-widest text-[#587760] uppercase mb-1 font-sans">
          {product.category}
        </span>
        <h3 className="font-display font-bold text-md text-[#0A2240] tracking-tight leading-snug mb-3 group-hover:text-[#F6B828] transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="w-full mt-auto pt-3 border-t border-[#F0EBE0]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 font-sans">
            <span className="font-display font-extrabold text-lg text-[#0A2240]">₹{product.price}</span>
            {product.onSale && (
              <span className="text-xs text-[#8A9EB4] line-through font-semibold">₹{product.regularPrice}</span>
            )}
          </div>
          <span className="w-9 h-9 bg-[#FCFAF5] border border-[#E4DCB9] group-hover:bg-[#F6B828] group-hover:border-[#F6B828] text-[#0A2240] group-hover:text-white rounded-full flex items-center justify-center transition-colors">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="woocommerce-shop"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#F0EBE0]/60 scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div className="text-left select-none">
          <span className="text-xs font-black tracking-widest text-[#F6B828] uppercase font-sans flex items-center gap-1.5">
            <ShoppingBag size={14} className="text-green-600" />
            OFFICIAL MERCHANDISE
          </span>
          <h2 className="font-brush text-4xl sm:text-5xl text-[#0A2240] tracking-wide mt-1">
            PAKKA PATRIOT <span className="text-[#F6B828]">STORE</span>
          </h2>
          {selectedCategory && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs sm:text-sm font-semibold text-[#587760]">
                Showing: <span className="text-[#F6B828] uppercase font-bold">{selectedCategory}</span>
              </p>
              <button onClick={onClearCategory} className="text-xs font-bold text-gray-400 hover:text-[#F6B828] underline cursor-pointer">
                Clear filter
              </button>
            </div>
          )}
          {carouselProducts.length < filteredProducts.length && (
            <p className="text-xs font-semibold text-[#8A9EB4] mt-1">
              Showing {carouselProducts.length} of {filteredProducts.length} products
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* "View All" button linking to Made in India page */}
          {filteredProducts.length > SLIDES_PER_VIEW && (
            <button
              onClick={onViewAll}
              className="bg-[#0A2240] hover:bg-[#1A3A5E] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
            >
              <ShoppingBag size={16} />
              VIEW ALL ({filteredProducts.length})
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {/* Carousel arrows */}
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => goTo(currentPage - 1)}
                className="w-11 h-11 rounded-full bg-white border border-[#E4DCB9] hover:bg-[#F6B828] hover:border-[#F6B828] hover:text-white text-[#0A2240] flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => goTo(currentPage + 1)}
                className="w-11 h-11 rounded-full bg-white border border-[#E4DCB9] hover:bg-[#F6B828] hover:border-[#F6B828] hover:text-white text-[#0A2240] flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden rounded-3xl">
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
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {renderProductCard(product)}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentPage ? "w-8 bg-[#F6B828]" : "w-2 bg-[#E4DCB9] hover:bg-[#F6B828]/50"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <p className="text-center text-[10px] font-semibold text-[#8A9EB4] mt-4 uppercase tracking-widest select-none">
            {isPaused ? "⏸ PAUSED" : "▶ AUTO-SCROLLING"}
            <span className="mx-2">·</span>
            {currentPage + 1} / {totalPages}
            <span className="mx-2">·</span>
            {carouselProducts.length} products
          </p>
        )}

        {/* Bottom "View All" link for mobile */}
        {filteredProducts.length > SLIDES_PER_VIEW && (
          <div className="mt-6 text-center md:hidden">
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-2 bg-[#0A2240] hover:bg-[#1A3A5E] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              VIEW ALL {filteredProducts.length} PRODUCTS
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
