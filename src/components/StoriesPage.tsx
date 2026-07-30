/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";

interface StoriesPageProps {
  onJoinJourneyClick: () => void;
}
import { motion } from "motion/react";
import {
  BookOpen,
  Search,
  ChevronDown,
  Sparkles,
  Star,
  ArrowRight,
  Download,
  Filter,
  X,
} from "lucide-react";
import { EBOOKS, CATEGORIES, TOTAL_BOOKS, getBooksByCategory } from "../data/ebooks";

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  "Freedom Fighters": { icon: "🇮🇳", color: "text-brand-blue" },
  "Poets": { icon: "✍️", color: "text-purple-600" },
  "Scientists": { icon: "🔬", color: "text-emerald-600" },
  "Saints": { icon: "🕉️", color: "text-orange-500" },
};

export default function StoriesPage({ onJoinJourneyClick }: StoriesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(() => {
    let books = selectedCategory ? getBooksByCategory(selectedCategory) : EBOOKS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.era.toLowerCase().includes(q)
      );
    }
    return books;
  }, [selectedCategory, searchQuery]);

  return (
    <section className="bg-brand-cream min-h-screen relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F6B828]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-80 h-80 bg-[#F6B828]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        
        {/* ─── HERO HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-brand-blue/5 rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="w-4 h-4 text-[#F6B828]" />
            <span className="text-xs font-black tracking-widest text-brand-blue uppercase">Free Library</span>
          </div>

          <h1 className="font-brush text-5xl sm:text-6xl lg:text-7xl text-brand-blue tracking-wide leading-tight mb-4">
            Story Books & <span className="text-[#F6B828]">eBooks</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4E637A] font-medium max-w-2xl mx-auto">
            Discover, Learn, and Inspire through <strong className="text-brand-blue">{TOTAL_BOOKS}+ free eBooks</strong> celebrating 
            India's greatest freedom fighters, poets, scientists, and saints.
          </p>

          {/* Stats badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {CATEGORIES.map((cat) => {
              const count = getBooksByCategory(cat).length;
              const meta = CATEGORY_META[cat];
              return (
                <div
                  key={cat}
                  className="bg-white rounded-full px-4 py-2 border border-[#F0EBE0] shadow-sm flex items-center gap-2 text-sm"
                >
                  <span>{meta.icon}</span>
                  <span className="font-bold text-brand-blue">{cat}</span>
                  <span className="text-[#8A9EB4] font-semibold">· {count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ─── SEARCH & FILTERS ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A9EB4]" />
            <input
              type="text"
              placeholder="Search books by name, era, or description..."
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

          {/* Category filter chips */}
          <div className="flex flex-wrap justify-center gap-3 select-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                !selectedCategory
                  ? "bg-brand-blue text-white shadow-md"
                  : "bg-white border border-[#E4DCB9] text-[#4E637A] hover:border-brand-blue hover:text-brand-blue"
              }`}
            >
              <Filter size={12} className="inline mr-1.5" />
              ALL BOOKS
            </button>
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isActive ? null : cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-brand-blue text-white shadow-md"
                      : "bg-white border border-[#E4DCB9] text-[#4E637A] hover:border-brand-blue hover:text-brand-blue"
                  }`}
                >
                  <span>{meta.icon}</span>
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── RESULTS COUNT ─── */}
        <div className="flex justify-between items-center mb-6 px-1">
          <p className="text-sm font-semibold text-[#8A9EB4]">
            {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
            {selectedCategory && (
              <span className="text-brand-blue"> in {selectedCategory}</span>
            )}
          </p>
        </div>

        {/* ─── BOOKS GRID ─── */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#F0EBE0]">
            <BookOpen className="w-16 h-16 mx-auto text-[#E4DCB9] mb-4" />
            <h3 className="font-display font-bold text-xl text-brand-blue mb-2">No Books Found</h3>
            <p className="text-sm text-[#4E637A] font-medium">
              Try a different search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 12) * 0.04, duration: 0.4 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-[#F0EBE0] hover:border-[#F6B828]/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                  
                  {/* Book Cover with gradient background */}
                  <div className={`bg-gradient-to-br ${book.coverColor} p-5 sm:p-6 min-h-[160px] flex flex-col justify-between relative overflow-hidden`}>
                    {/* Decorative dot pattern */}
                    <div className="absolute top-2 right-2 opacity-10">
                      <div className="grid grid-cols-4 gap-1.5">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <span className="text-3xl sm:text-4xl">{book.coverEmoji}</span>
                    </div>
                    
                    <div className="relative z-10 mt-auto">
                      <span className="text-[10px] font-black tracking-widest text-white/70 uppercase">
                        {book.category}
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-white leading-tight mt-0.5">
                        {book.title}
                      </h3>
                      <p className="text-xs text-white/80 font-medium mt-0.5 line-clamp-1">
                        {book.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-4 sm:p-5 flex-grow flex flex-col">
                    <p className="text-xs text-[#8A9EB4] font-bold mb-1.5 font-mono">{book.era}</p>
                    <p className="text-xs text-[#4E637A] font-medium leading-relaxed flex-grow line-clamp-3">
                      {book.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-[#F0EBE0] flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-widest text-brand-sage uppercase flex items-center gap-1">
                        <Sparkles size={10} />
                        Free eBook
                      </span>
                      <button
                        onClick={onJoinJourneyClick}
                        className="flex items-center gap-1 text-xs font-bold text-[#F6B828] hover:text-[#DAA520] transition-colors cursor-pointer group/download"
                      >
                        <Download size={12} className="transition-transform group-hover/download:translate-y-0.5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── BOTTOM CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-brand-blue to-[#1A3A5C] rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F6B828]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#F6B828]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <Star className="w-10 h-10 text-[#F6B828] mx-auto" fill="#F6B828" />
              <h2 className="font-brush text-4xl sm:text-5xl text-white tracking-wide">
                Want More <span className="text-[#F6B828]">Stories</span>?
              </h2>
              <p className="text-[#B5CADF] font-semibold text-lg max-w-lg mx-auto">
                Get new eBooks, stories, and resources delivered to your inbox every week. 
                Join thousands of curious minds on the journey!
              </p>
              <button
                onClick={onJoinJourneyClick}
                className="inline-flex items-center gap-2 bg-[#F6B828] hover:bg-[#DAA520] text-white px-8 py-4 rounded-xl text-md font-bold shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
              >
                <BookOpen size={18} />
                GET FREE ACCESS
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
