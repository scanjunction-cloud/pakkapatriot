/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Calendar, User, Clock, ArrowRight, ExternalLink, ShoppingBag, Check } from "lucide-react";
import { WPPost, WCProduct } from "../types";
import { getCategoryBadgeClasses } from "./LatestStories";
import React, { useState } from "react";

interface DetailModalProps {
  post: WPPost | null;
  product: WCProduct | null;
  onClose: () => void;
  onAddToCart: (product: WCProduct) => void;
}

export default function DetailModal({ post, product, onClose, onAddToCart }: DetailModalProps) {
  const [addedToCart, setAddedToCart] = useState(false);

  if (!post && !product) return null;

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      onAddToCart(product);
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-brand-cream max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border border-[#F0EBE0] max-h-[90vh] flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all duration-200 cursor-pointer"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-grow">
          
          {/* VIEWING A WORDPRESS STORY */}
          {post && (
            <div>
              {/* Cover Image */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-100">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Category Badge */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase select-none ${getCategoryBadgeClasses(post.category).bg} ${getCategoryBadgeClasses(post.category).text}`}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Story Details */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-3 text-left">
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#0A2240] tracking-tight leading-tight">
                    {post.title}
                  </h2>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-[#8A9EB4] uppercase tracking-wider font-sans border-b border-[#F0EBE0] pb-4">
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      <span>{post.authorName || "Pakka Patriot"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{post.readTime || "4 min read"}</span>
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-md font-semibold text-[#2F445A] leading-relaxed italic border-l-4 border-[#EB5A12] pl-4 text-left">
                  {post.excerpt}
                </p>

                {/* Article Body */}
                <div className="text-sm sm:text-md text-[#2F445A] leading-relaxed font-sans text-left space-y-4">
                  {/* Clean paragraphs for readability */}
                  {post.content ? (
                    <div
                      className="space-y-4 wp-article-content"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  ) : (
                    <p>This article is a deep-dive story exploring India's rich history, traditions, and culture. Read the full post on pakkapatriot.com using the link below.</p>
                  )}
                </div>

                {/* Read External CTA */}
                <div className="pt-6 border-t border-[#F0EBE0] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-xs font-bold text-[#8A9EB4] uppercase tracking-wide">
                    Source: Official PakkaPatriot.com
                  </span>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#EB5A12] hover:bg-[#D04D0E] text-white px-6 py-3 rounded-xl text-sm font-bold shadow hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    Read original post
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* VIEWING A WOOCOMMERCE PRODUCT */}
          {product && (
            <div className="flex flex-col md:flex-row">
              {/* Product Left Column: Image */}
              <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-[450px] relative overflow-hidden bg-[#FAF6EC]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {product.onSale && (
                  <div className="absolute top-4 left-4 bg-[#EB5A12] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md select-none">
                    SALE ACTIVE
                  </div>
                )}
              </div>

              {/* Product Right Column: Info */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col text-left space-y-5 justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#587760] uppercase mb-1 block">
                    {product.category}
                  </span>
                  
                  <h2 className="font-display font-black text-xl sm:text-2xl text-[#0A2240] tracking-tight leading-tight">
                    {product.name}
                  </h2>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mt-3 font-sans border-b border-[#F0EBE0] pb-4">
                    <span className="font-display font-black text-2xl text-[#EB5A12]">
                      ₹{product.price}
                    </span>
                    {product.onSale && (
                      <span className="text-sm text-[#8A9EB4] line-through font-bold">
                        ₹{product.regularPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 flex-grow py-3">
                  <h4 className="text-xs font-black tracking-wider text-[#0A2240] uppercase">
                    Description
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4E637A] font-medium leading-relaxed font-sans">
                    {product.description || product.shortDescription || "Premium quality handcrafted merchandise designed to instill a proud patriot vibe. Perfect for daily wear, gifting, or study spaces."}
                  </p>
                </div>

                {/* Checkout CTA row */}
                <div className="space-y-3 pt-4 border-t border-[#F0EBE0]">
                  <div className="flex gap-2 w-full">
                    {/* Simulator Add-to-cart */}
                    <button
                      onClick={handleAddToCartClick}
                      className={`flex-grow py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 select-none cursor-pointer border ${
                        addedToCart
                          ? "bg-green-500 border-green-500 text-white shadow-md animate-pulse"
                          : "bg-white hover:bg-[#FAF6EC] border-[#DCD3B5] text-[#0A2240]"
                      }`}
                    >
                      {addedToCart ? (
                        <>
                          <Check size={16} />
                          ADDED!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          ADD TO BAG
                        </>
                      )}
                    </button>

                    {/* Real WP store checkout redirect */}
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#EB5A12] hover:bg-[#D04D0E] text-white px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 select-none cursor-pointer flex-shrink-0"
                    >
                      BUY NOW
                      <ArrowRight size={16} />
                    </a>
                  </div>
                  
                  <span className="text-[10px] text-center block text-[#8A9EB4] font-bold uppercase tracking-wider font-sans">
                    Stock status: {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
