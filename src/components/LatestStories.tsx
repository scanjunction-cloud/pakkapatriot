/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { WPPost } from "../types";
import { motion } from "motion/react";

interface LatestStoriesProps {
  posts: WPPost[];
  loading: boolean;
  onPostClick: (post: WPPost) => void;
  selectedCategory: string | null;
  onViewAllStories: () => void;
}

// Map category to aesthetic CSS classes matching the screenshot perfectly
export function getCategoryBadgeClasses(cat: string): { bg: string; text: string } {
  const norm = cat.toUpperCase().trim();
  if (norm.includes("HERITAGE")) {
    return { bg: "bg-[#587760]", text: "text-white" };
  } else if (norm.includes("PLACE")) {
    return { bg: "bg-[#0A2240]", text: "text-white" };
  } else if (norm.includes("TRADITION")) {
    return { bg: "bg-[#D45012]", text: "text-white" };
  } else if (norm.includes("PEOPLE")) {
    return { bg: "bg-[#6D28D9]", text: "text-white" };
  } else {
    return { bg: "bg-[#EB5A12]", text: "text-white" };
  }
}

export default function LatestStories({
  posts,
  loading,
  onPostClick,
  selectedCategory,
  onViewAllStories
}: LatestStoriesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter posts based on selected love-category
  const filteredPosts = selectedCategory
    ? posts.filter((p) => {
        // Broad matches for our love-categories
        const cat = p.category.toUpperCase();
        if (selectedCategory === "HERITAGE") return cat.includes("HERITAGE") || cat.includes("STORY");
        if (selectedCategory === "OUR_HERITAGE") return cat.includes("HERITAGE") || cat.includes("HISTORY");
        if (selectedCategory === "PLACES") return cat.includes("PLACE") || cat.includes("VALLEY") || cat.includes("CULTURE");
        if (selectedCategory === "PEOPLE") return cat.includes("PEOPLE") || cat.includes("PERSON") || cat.includes("KALAM");
        if (selectedCategory === "INNOVATIONS") return cat.includes("INNOVATION") || cat.includes("IDEA");
        if (selectedCategory === "FUN_ADVENTURE") return cat.includes("FUN") || cat.includes("ADVENTURE") || cat.includes("KITE");
        return cat.includes(selectedCategory);
      })
    : posts;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      const target = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: target,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="latest-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#F0EBE0]/60">
      
      {/* Section Header */}
      <div className="flex justify-between items-end mb-8 select-none">
        <div className="text-left">
          <h2 className="font-brush text-4xl sm:text-5xl text-[#0A2240] tracking-wide">
            LATEST <span className="text-[#EB5A12]">STORIES</span>
          </h2>
          {selectedCategory && (
            <p className="text-sm font-semibold text-[#587760] mt-1 font-sans">
              Filtered by: <span className="text-[#EB5A12] uppercase">{selectedCategory.replace("_", " ")}</span>
            </p>
          )}
        </div>
        
        <button
          onClick={onViewAllStories}
          className="flex items-center gap-2 text-sm sm:text-md font-bold text-[#EB5A12] hover:text-[#D04D0E] transition-colors cursor-pointer group"
        >
          View all stories
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#F0EBE0] shadow-sm animate-pulse">
              <div className="h-48 bg-[#E4DCB9]/30" />
              <div className="p-6 space-y-3">
                <div className="h-6 w-20 bg-[#E4DCB9]/30 rounded-full" />
                <div className="h-5 w-full bg-[#E4DCB9]/30 rounded" />
                <div className="h-5 w-3/4 bg-[#E4DCB9]/30 rounded" />
                <div className="h-4 w-full bg-[#E4DCB9]/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-[#FAF6EC] border border-[#E4DCB9] rounded-2xl p-12 text-center max-w-md mx-auto">
          <p className="font-display font-bold text-lg text-[#0A2240] mb-2">No Stories Found</p>
          <p className="text-sm text-[#2F445A] mb-4">We couldn't find stories matching this filter. Tap below to reset.</p>
          <button
            onClick={onViewAllStories}
            className="bg-[#EB5A12] hover:bg-[#D04D0E] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow"
          >
            Show All Stories
          </button>
        </div>
      ) : (
        <div className="relative group/carousel">
          {/* Slider Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#E4DCB9] text-[#0A2240] hover:text-[#EB5A12] p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hidden sm:flex items-center justify-center cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
            title="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-[#EB5A12] hover:bg-[#D04D0E] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hidden sm:flex items-center justify-center cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
            title="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>

          {/* Carousel Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 px-1"
          >
            {filteredPosts.map((post) => {
              const badge = getCategoryBadgeClasses(post.category);
              return (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="h-full bg-white rounded-3xl overflow-hidden border border-[#F0EBE0] hover:border-[#EB5A12]/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group"
                  >
                    {/* Featured Image with loading/aspect optimization */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-[#FAF6EC]">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-grow flex flex-col items-start text-left">
                      {/* Category Badge */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase mb-3 select-none ${badge.bg} ${badge.text}`}>
                        {post.category}
                      </span>

                      {/* Title */}
                      <h3 className="font-display font-extrabold text-md sm:text-lg text-[#0A2240] tracking-tight leading-snug mb-2 group-hover:text-[#EB5A12] transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="font-sans text-xs sm:text-sm text-[#4E637A] font-medium leading-relaxed flex-grow">
                        {post.excerpt}
                      </p>

                      {/* Footer Info */}
                      <div className="w-full border-t border-[#F0EBE0]/80 pt-4 mt-4 flex justify-between items-center text-[11px] font-bold text-[#8A9EB4] uppercase tracking-wide font-sans">
                        <span>{post.authorName || "PATRIOT"}</span>
                        <span>{post.readTime || "3 MIN"}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
