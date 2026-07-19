/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Menu, X, Shirt, Coffee, ShoppingBag, BookOpen, Sparkles, Image, Heart, Gift, Compass } from "lucide-react";

// Sub-navbar categories
const MERCH_CATEGORIES = [
  { id: "T-Shirts", label: "T-Shirts", icon: Shirt },
  { id: "Hoodies", label: "Hoodies", icon: Shirt }, // Shirt used with different styling for Hoodie
  { id: "Mugs", label: "Mugs", icon: Coffee },
  { id: "Tote Bags", label: "Tote Bags", icon: ShoppingBag },
  { id: "Notebooks", label: "Notebooks", icon: BookOpen },
  { id: "Stickers", label: "Stickers", icon: Sparkles },
  { id: "Posters", label: "Posters", icon: Image },
  { id: "Accessories", label: "Accessories", icon: Heart },
  { id: "Gift Cards", label: "Gift Cards", icon: Gift },
];

interface HeaderProps {
  onSearch: (query: string) => void;
  onFilterMerchCategory: (category: string | null) => void;
  selectedMerchCategory: string | null;
  onJoinJourneyClick: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export default function Header({
  onSearch,
  onFilterMerchCategory,
  selectedMerchCategory,
  onJoinJourneyClick,
  onTabChange,
  activeTab
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleMerchClick = (catId: string) => {
    if (selectedMerchCategory === catId) {
      onFilterMerchCategory(null); // Clear filter
    } else {
      onFilterMerchCategory(catId);
      // Smooth scroll to WooCommerce Section
      const shopSec = document.getElementById("woocommerce-shop");
      if (shopSec) {
        shopSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Stories", id: "stories" },
    { label: "Explore", id: "explore" },
    { label: "Traditions", id: "traditions" },
    { label: "People", id: "people" },
    { label: "Fun Zone", id: "funzone" },
    { label: "About Us", id: "about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FCFAF5]/95 backdrop-blur-md border-b border-[#F0EBE0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo with clean SVG */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onTabChange("home")}>
            <div className="flex items-center gap-2">
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Handcrafted beautiful interconnected Orange & Blue "PP" monogram */}
                <circle cx="50" cy="50" r="46" fill="white" stroke="#0A2240" strokeWidth="4" />
                <path d="M32 30 H55 C65 30 68 38 62 43 C56 48 50 48 50 48 M32 30 V72" stroke="#0A2240" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M42 40 H65 C75 40 78 48 72 53 C66 58 60 58 60 58 M42 40 V82" stroke="#EB5A12" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col select-none">
                <span className="font-display font-extrabold text-xl tracking-wider text-[#0A2240] leading-none flex items-center">
                  PAKKA<span className="text-[#EB5A12] ml-1">PATRIOT</span>
                </span>
                <span className="text-[10px] font-bold text-[#EB5A12] tracking-[0.18em] uppercase mt-0.5 font-sans">
                  Know India. <span className="text-[#0A2240]">Be India.</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 xl:space-x-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onTabChange(link.id);
                  if (link.id === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 relative ${
                  activeTab === link.id
                    ? "text-[#EB5A12]"
                    : "text-[#0A2240] hover:text-[#EB5A12] hover:bg-[#F8F4EA]"
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#EB5A12] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Actions: Search, Join Journey, Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search stories & merch..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={`transition-all duration-300 ease-in-out text-sm text-[#0A2240] bg-[#FAF6EC] border border-[#E4DCB9] rounded-full focus:outline-none focus:border-[#EB5A12] focus:ring-1 focus:ring-[#EB5A12] ${
                  searchOpen ? "w-44 sm:w-60 px-4 py-1.5 opacity-100" : "w-0 px-0 py-0 opacity-0 pointer-events-none"
                }`}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#0A2240] hover:text-[#EB5A12] transition-colors rounded-full hover:bg-[#FAF6EC]"
                title="Search"
              >
                {searchOpen ? <X size={20} /> : <Search size={22} />}
              </button>
            </form>

            <button
              onClick={onJoinJourneyClick}
              className="hidden sm:block bg-[#EB5A12] hover:bg-[#D04D0E] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Join the Journey
            </button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#0A2240] hover:text-[#EB5A12] transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </div>

      {/* Sub-navbar for merchandise categories */}
      <div className="bg-[#122A44] text-white py-2 sm:py-3 px-4 shadow-inner overflow-x-auto scrollbar-none border-t border-[#1F3D5E]">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-4 sm:gap-8 min-w-max">
          {MERCH_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedMerchCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleMerchClick(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#EB5A12] text-white shadow-md scale-105"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-white animate-pulse" : "text-gray-400"} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCFAF5] border-t border-[#F0EBE0] px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                setMobileMenuOpen(false);
                setTimeout(() => {
                  if (link.id === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }, 150);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
                activeTab === link.id
                  ? "bg-[#FBECE6] text-[#EB5A12]"
                  : "text-[#0A2240] hover:bg-[#FAF6EC]"
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-[#E4DCB9]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onJoinJourneyClick();
              }}
              className="w-full text-center bg-[#EB5A12] text-white py-3 rounded-xl font-bold hover:bg-[#D04D0E] transition-all"
            >
              Join the Journey
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
