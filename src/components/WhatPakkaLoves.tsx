/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Users, Lightbulb, MapPin, Palette, Sparkles, Gamepad2, BadgeCheck } from "lucide-react";

export interface LoveCategory {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

interface WhatPakkaLovesProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
  onMadeInIndiaClick?: () => void;
}

export default function WhatPakkaLoves({ onSelectCategory, selectedCategory, onMadeInIndiaClick }: WhatPakkaLovesProps) {
  
  const categories: LoveCategory[] = [
    {
      id: "PEOPLE",
      label: "PEOPLE",
      color: "text-rose-600",
      bgColor: "bg-rose-50 border-rose-200",
      icon: <Users className="w-8 h-8 text-rose-500" />,
    },
    {
      id: "IDEAS",
      label: "IDEAS",
      color: "text-amber-500",
      bgColor: "bg-amber-50 border-amber-200",
      icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
    },
    {
      id: "PLACES",
      label: "PLACES",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
      icon: <MapPin className="w-8 h-8 text-emerald-500" />,
    },
    {
      id: "CULTURE",
      label: "CULTURE",
      color: "text-violet-600",
      bgColor: "bg-violet-50 border-violet-200",
      icon: <Palette className="w-8 h-8 text-violet-500" />,
    },
    {
      id: "CREATE",
      label: "CREATE",
      color: "text-sky-600",
      bgColor: "bg-sky-50 border-sky-200",
      icon: <Sparkles className="w-8 h-8 text-sky-500" />,
    },
    {
      id: "PLAY",
      label: "PLAY",
      color: "text-[#F6B828]",
      bgColor: "bg-yellow-50 border-yellow-200",
      icon: <Gamepad2 className="w-8 h-8 text-[#F6B828]" />,
    },
    {
      id: "MADE_IN_INDIA",
      label: "MADE IN INDIA",
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
      icon: <BadgeCheck className="w-8 h-8 text-orange-500" />,
    },
  ];

  const handleCardClick = (catId: string) => {
    if (catId === "MADE_IN_INDIA" && onMadeInIndiaClick) {
      onMadeInIndiaClick();
      return;
    }
    if (selectedCategory === catId) {
      onSelectCategory(null); // Deselect
    } else {
      onSelectCategory(catId);
      // Smooth scroll down to Latest Stories
      const storiesSec = document.getElementById("latest-stories");
      if (storiesSec) {
        storiesSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="what-pakka-loves" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center scroll-mt-32">
      
      {/* Decorative Title */}
      <div className="flex items-center justify-center gap-4 mb-10 select-none">
        <svg className="w-8 h-8 text-[#F6B828]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12 L7 10 L7 14 Z M17 10 L21 12 L17 14 Z" />
        </svg>
        <h2 className="font-brush text-4xl sm:text-5xl text-[#0A2240] tracking-wide">
          WHAT <span className="text-[#F6B828]">PAKKA PATRIOT LOVES</span>
        </h2>
        <svg className="w-8 h-8 text-[#F6B828]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12 L7 10 L7 14 Z M17 10 L21 12 L17 14 Z" />
        </svg>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {categories.map((cat, index) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.div
              key={cat.id}
              onClick={() => handleCardClick(cat.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`flex flex-col items-center p-6 bg-white rounded-2xl border-2 cursor-pointer transition-all duration-300 transform select-none ${
                isSelected
                  ? "border-[#F6B828] ring-4 ring-[#F6B828]/10 scale-105 shadow-md"
                  : "border-[#F0EBE0] hover:border-[#F6B828] hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {/* Icon Container with subtle background shape */}
              <div className={`p-4 rounded-xl mb-4 ${cat.bgColor} flex items-center justify-center transition-colors`}>
                {cat.icon}
              </div>

              {/* Category Label */}
              <span className="font-display font-bold text-sm text-[#0A2240] tracking-tight group-hover:text-[#F6B828] transition-colors text-center">
                {cat.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
