/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Search, Menu, X, Shirt, Coffee, ShoppingBag, BookOpen, Sparkles, Image, Heart, Gift, Users, Lightbulb, MapPin, Palette, Gamepad2, BadgeCheck } from "lucide-react";
import ppLogo from "../assets/images/pp_logo.png";

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
  onSelectLoveCategory?: (categoryId: string | null) => void;
  selectedLoveCategory?: string | null;
}

// Love categories matching What Pakka Patriot Loves
const LOVE_CATEGORIES = [
  { id: "PEOPLE", label: "PEOPLE", icon: Users },
  { id: "IDEAS", label: "IDEAS", icon: Lightbulb },
  { id: "PLACES", label: "PLACES", icon: MapPin },
  { id: "CULTURE", label: "CULTURE", icon: Palette },
  { id: "CREATE", label: "CREATE", icon: Sparkles },
  { id: "PLAY", label: "PLAY", icon: Gamepad2 },
  { id: "MADE_IN_INDIA", label: "MADE IN INDIA", icon: BadgeCheck },
];

export default function Header({
  onSearch,
  onFilterMerchCategory,
  selectedMerchCategory,
  onJoinJourneyClick,
  onTabChange,
  activeTab,
  onSelectLoveCategory,
  selectedLoveCategory
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
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

  const handleLoveCategoryClick = (catId: string) => {
    if (catId === "MADE_IN_INDIA") {
      navigate("/made-in-india");
      return;
    }
    if (selectedLoveCategory === catId) {
      onSelectLoveCategory?.(null);
    } else {
      onSelectLoveCategory?.(catId);
      // Scroll to What Pakka Loves section
      if (!isHome) {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById("what-pakka-loves");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      } else {
        const el = document.getElementById("what-pakka-loves");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleMobileLoveClick = (catId: string) => {
    setMobileMenuOpen(false);
    if (catId === "MADE_IN_INDIA") {
      navigate("/made-in-india");
      return;
    }
    onSelectLoveCategory?.(catId);
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("what-pakka-loves");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else {
      const el = document.getElementById("what-pakka-loves");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FCFAF5]/95 backdrop-blur-md border-b border-[#F0EBE0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - image only */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <img src={ppLogo} alt="Pakka Patriot" className="w-16 h-16 object-contain" />
          </Link>

          {/* Desktop Love Categories (replaces old nav links) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {LOVE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedLoveCategory === cat.id;
              const isMadeInIndia = cat.id === "MADE_IN_INDIA";
              return (
                <button
                  key={cat.id}
                  onClick={() => handleLoveCategoryClick(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 relative ${
                    isSelected
                      ? "text-[#F6B828]"
                      : isMadeInIndia
                        ? "text-[#F6B828] hover:bg-[#F8F4EA]"
                        : "text-[#0A2240] hover:text-[#F6B828] hover:bg-[#F8F4EA]"
                  }`}
                >
                  <Icon size={16} className={isSelected ? "text-[#F6B828]" : isMadeInIndia ? "text-orange-500" : "text-[#8A9EB4]"} />
                  {cat.label}
                  {isSelected && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#F6B828] rounded-full" />}
                </button>
              );
            })}
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
                className={`transition-all duration-300 ease-in-out text-sm text-[#0A2240] bg-[#FAF6EC] border border-[#E4DCB9] rounded-full focus:outline-none focus:border-[#F6B828] focus:ring-1 focus:ring-[#F6B828] ${
                  searchOpen ? "w-44 sm:w-60 px-4 py-1.5 opacity-100" : "w-0 px-0 py-0 opacity-0 pointer-events-none"
                }`}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#0A2240] hover:text-[#F6B828] transition-colors rounded-full hover:bg-[#FAF6EC]"
                title="Search"
              >
                {searchOpen ? <X size={20} /> : <Search size={22} />}
              </button>
            </form>

            <button
              onClick={onJoinJourneyClick}
              className="hidden sm:block bg-[#F6B828] hover:bg-[#DAA520] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Join the Journey
            </button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#0A2240] hover:text-[#F6B828] transition-colors"
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
                    ? "bg-[#F6B828] text-white shadow-md scale-105"
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
          {LOVE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedLoveCategory === cat.id;
            const isMadeInIndia = cat.id === "MADE_IN_INDIA";
            return (
              <button
                key={cat.id}
                onClick={() => handleMobileLoveClick(cat.id)}
                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
                  isSelected
                    ? "bg-[#FEF5E0] text-[#F6B828]"
                    : "text-[#0A2240] hover:bg-[#FAF6EC]"
                }`}
              >
                <Icon size={18} className={isSelected ? "text-[#F6B828]" : isMadeInIndia ? "text-orange-500" : "text-[#8A9EB4]"} />
                {cat.label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-[#E4DCB9]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onJoinJourneyClick();
              }}
              className="w-full text-center bg-[#F6B828] text-white py-3 rounded-xl font-bold hover:bg-[#DAA520] transition-all"
            >
              Join the Journey
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
