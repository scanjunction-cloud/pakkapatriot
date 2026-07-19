/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ShoppingBag, ArrowUpRight, Tag } from "lucide-react";
import { WCProduct } from "../types";

interface WooCommerceShopProps {
  products: WCProduct[];
  loading: boolean;
  selectedCategory: string | null;
  onProductClick: (product: WCProduct) => void;
  onClearCategory: () => void;
}

export default function WooCommerceShop({
  products,
  loading,
  selectedCategory,
  onProductClick,
  onClearCategory
}: WooCommerceShopProps) {

  // Filter products by selected merch category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()))
    : products;

  return (
    <section id="woocommerce-shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#F0EBE0]/60 scroll-mt-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div className="text-left select-none">
          <span className="text-xs font-black tracking-widest text-[#EB5A12] uppercase font-sans">
            OFFICIAL MERCHANDISE
          </span>
          <h2 className="font-brush text-4xl sm:text-5xl text-[#0A2240] tracking-wide mt-1">
            PAKKA PATRIOT <span className="text-[#EB5A12]">STORE</span>
          </h2>
          {selectedCategory && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs sm:text-sm font-semibold text-[#587760]">
                Showing: <span className="text-[#EB5A12] uppercase font-bold">{selectedCategory}</span>
              </p>
              <button
                onClick={onClearCategory}
                className="text-xs font-bold text-gray-400 hover:text-[#EB5A12] underline cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 select-none text-[11px] font-bold text-[#587760] bg-[#EFF6F0] px-4 py-2 rounded-full border border-green-200">
          <ShoppingBag size={14} className="text-green-600 animate-pulse" />
          <span>Real WooCommerce Sync</span>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
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
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#FAF6EC] border border-[#E4DCB9] rounded-2xl p-12 text-center max-w-md mx-auto">
          <p className="font-display font-bold text-lg text-[#0A2240] mb-2">No Products in Category</p>
          <p className="text-sm text-[#2F445A] mb-4">We don't have catalog items in "{selectedCategory}" at the moment.</p>
          <button
            onClick={onClearCategory}
            className="bg-[#EB5A12] hover:bg-[#D04D0E] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              onClick={() => onProductClick(product)}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl overflow-hidden border border-[#F0EBE0] hover:border-[#EB5A12]/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group relative"
            >
              {/* Sale Tag */}
              {product.onSale && (
                <div className="absolute top-4 left-4 z-10 bg-[#EB5A12] text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md select-none">
                  <Tag size={10} fill="white" />
                  SALE
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-[#FAF6EC]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 flex-grow flex flex-col items-start text-left">
                {/* Category name */}
                <span className="text-[10px] font-black tracking-widest text-[#587760] uppercase mb-1 font-sans">
                  {product.category}
                </span>

                {/* Name */}
                <h3 className="font-display font-bold text-md text-[#0A2240] tracking-tight leading-snug mb-3 group-hover:text-[#EB5A12] transition-colors line-clamp-2">
                  {product.name}
                </h3>

                {/* Price and Action row */}
                <div className="w-full mt-auto pt-3 border-t border-[#F0EBE0]/60 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5 font-sans">
                    <span className="font-display font-extrabold text-lg text-[#0A2240]">
                      ₹{product.price}
                    </span>
                    {product.onSale && (
                      <span className="text-xs text-[#8A9EB4] line-through font-semibold">
                        ₹{product.regularPrice}
                      </span>
                    )}
                  </div>

                  <span className="w-9 h-9 bg-[#FCFAF5] border border-[#E4DCB9] group-hover:bg-[#EB5A12] group-hover:border-[#EB5A12] text-[#0A2240] group-hover:text-white rounded-full flex items-center justify-center transition-colors">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
