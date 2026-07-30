/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ShoppingBag, ArrowUpRight, Tag, ArrowLeft, BadgeCheck, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WCProduct } from "../types";

interface MadeInIndiaPageProps {
  products: WCProduct[];
  loading: boolean;
  onProductClick: (product: WCProduct) => void;
}

export default function MadeInIndiaPage({ products, loading, onProductClick }: MadeInIndiaPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Filter by search and category
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const renderProductCard = (product: WCProduct) => (
    <div
      key={product.id}
      onClick={() => onProductClick(product)}
      className="group bg-white rounded-3xl overflow-hidden border border-[#F0EBE0] hover:border-[#F6B828]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {product.onSale && (
        <div className="absolute top-4 left-4 z-10 bg-[#F6B828] text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md select-none">
          <Tag size={10} fill="white" />
          SALE
        </div>
      )}
      <div className="relative h-52 sm:h-64 overflow-hidden bg-[#FAF6EC]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
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
    <div className="min-h-screen bg-brand-cream relative">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#F0EBE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-[#0A2240] hover:text-[#F6B828] transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <span className="text-[10px] font-black tracking-widest text-[#8A9EB4] uppercase">
            {filteredProducts.length} products
          </span>
        </div>
      </div>

      {/* Background decor */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-[#F6B828]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-64 h-64 bg-[#F6B828]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-brand-blue/5 rounded-full px-4 py-1.5 mb-4">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            <span className="text-xs font-black tracking-widest text-brand-blue uppercase">Proudly Indian</span>
          </div>
          <h1 className="font-brush text-5xl sm:text-6xl lg:text-7xl text-brand-blue tracking-wide leading-tight mb-4">
            Made in <span className="text-[#F6B828]">India</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#4E637A] font-medium max-w-2xl mx-auto">
            Discover products crafted, designed, and made in India — from handloom traditions to modern merchandise.
          </p>
        </motion.div>

        {/* Search & Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A9EB4]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E4DCB9] rounded-full pl-12 pr-10 py-3 text-sm font-semibold text-brand-blue focus:outline-none focus:border-[#F6B828] focus:ring-2 focus:ring-[#F6B828]/10 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9EB4] hover:text-[#F6B828] transition-colors cursor-pointer">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                !selectedCategory
                  ? "bg-brand-blue text-white shadow-md"
                  : "bg-white border border-[#E4DCB9] text-[#4E637A] hover:border-brand-blue hover:text-brand-blue"
              }`}
            >
              ALL
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isActive ? null : cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-brand-blue text-white shadow-md"
                      : "bg-white border border-[#E4DCB9] text-[#4E637A] hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#F0EBE0] max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 mx-auto text-[#E4DCB9] mb-4" />
            <h3 className="font-display font-bold text-xl text-brand-blue mb-2">No Products Found</h3>
            <p className="text-sm text-[#4E637A] font-medium">
              {searchQuery ? "Try a different search term." : "Try a different category filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 8) * 0.05, duration: 0.4 }}
                whileHover={{ y: -6 }}
              >
                {renderProductCard(product)}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
