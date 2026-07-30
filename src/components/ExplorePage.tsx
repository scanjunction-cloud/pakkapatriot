/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Search,
  Compass,
  X,
  ArrowRight,
  Calendar,
  User,
  Clock,
  BookOpen,
} from "lucide-react";
import { WPPost } from "../types";
import { getCategoryBadgeClasses } from "./LatestStories";

interface ExplorePageProps {
  posts: WPPost[];
  loading: boolean;
  onPostClick: (post: WPPost) => void;
}

export default function ExplorePage({ posts, loading, onPostClick }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => cats.add(p.category));
    return Array.from(cats).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.authorName && p.authorName.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [posts, selectedCategory, searchQuery]);

  return (
    <section className="bg-brand-cream min-h-screen relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-[#F6B828]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-64 h-64 bg-[#F6B828]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">

        {/* ─── HERO ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-brand-blue/5 rounded-full px-4 py-1.5 mb-4">
            <Compass className="w-4 h-4 text-[#F6B828]" />
            <span className="text-xs font-black tracking-widest text-brand-blue uppercase">Discover</span>
          </div>

          <h1 className="font-brush text-5xl sm:text-6xl lg:text-7xl text-brand-blue tracking-wide leading-tight mb-4">
            Explore <span className="text-[#F6B828]">India</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4E637A] font-medium max-w-2xl mx-auto">
            Dive into stories about India's rich heritage, incredible people, vibrant traditions, 
            and breathtaking places — all in one place.
          </p>

          {!loading && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white rounded-full px-4 py-2 border border-[#F0EBE0] shadow-sm text-sm font-semibold text-brand-blue">
                📖 {posts.length} Stories
              </div>
              <div className="bg-white rounded-full px-4 py-2 border border-[#F0EBE0] shadow-sm text-sm font-semibold text-brand-blue">
                🏷️ {categories.length} Categories
              </div>
            </div>
          )}
        </motion.div>

        {/* ─── SEARCH & FILTERS ─── */}
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
              placeholder="Search stories by title, category, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E4DCB9] rounded-full pl-12 pr-10 py-3 text-sm font-semibold text-brand-blue focus:outline-none focus:border-[#F6B828] focus:ring-2 focus:ring-[#F6B828]/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9EB4] hover:text-[#F6B828] transition-colors cursor-pointer"
              >
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
              ALL STORIES
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

        {/* ─── RESULTS ─── */}
        <div className="flex justify-between items-center mb-6 px-1">
          <p className="text-sm font-semibold text-[#8A9EB4]">
            {loading ? "Loading..." : `${filteredPosts.length} ${filteredPosts.length === 1 ? "story" : "stories"} found`}
            {selectedCategory && <span className="text-brand-blue"> in {selectedCategory}</span>}
          </p>
        </div>

        {/* ─── POSTS GRID ─── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <div className="text-center py-16 bg-white rounded-3xl border border-[#F0EBE0]">
            <BookOpen className="w-16 h-16 mx-auto text-[#E4DCB9] mb-4" />
            <h3 className="font-display font-bold text-xl text-brand-blue mb-2">No Stories Found</h3>
            <p className="text-sm text-[#4E637A] font-medium">
              {searchQuery ? "Try a different search term." : "Try a different category filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => {
              const badge = getCategoryBadgeClasses(post.category);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 9) * 0.05, duration: 0.4 }}
                  onClick={() => onPostClick(post)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#F0EBE0] hover:border-[#F6B828]/40 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                >
                  {/* Featured Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-[#FAF6EC]">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    {/* Category Badge overlay */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm ${badge.bg} ${badge.text}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-display font-extrabold text-lg text-brand-blue tracking-tight leading-snug mb-2 group-hover:text-[#F6B828] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#4E637A] font-medium leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE0]/80 text-[11px] font-bold text-[#8A9EB4] uppercase tracking-wide">
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {post.authorName || "PATRIOT"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime || "3 MIN"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ─── BOTTOM CTA ─── */}
        {!loading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-br from-brand-blue to-[#1A3A5C] rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F6B828]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <h2 className="font-brush text-3xl sm:text-4xl text-white tracking-wide">
                  Want to <span className="text-[#F6B828]">contribute</span>?
                </h2>
                <p className="text-[#B5CADF] font-semibold text-sm max-w-md mx-auto">
                  Have a story about India's heritage, people, or traditions? Share it with us and 
                  become a featured Pakka Patriot writer!
                </p>
                <button
                  onClick={() => alert("Please email us at: hello@pakkapatriot.com")}
                  className="inline-flex items-center gap-2 bg-[#F6B828] hover:bg-[#DAA520] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
                >
                  <BookOpen size={16} />
                  SUBMIT YOUR STORY
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
