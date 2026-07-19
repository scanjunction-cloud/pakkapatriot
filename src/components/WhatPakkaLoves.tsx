/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { BookOpen, Landmark, Mountain, Users, Lightbulb } from "lucide-react";

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
}

export default function WhatPakkaLoves({ onSelectCategory, selectedCategory }: WhatPakkaLovesProps) {
  
  const categories: LoveCategory[] = [
    {
      id: "HERITAGE",
      label: "Great Stories",
      color: "text-orange-500",
      bgColor: "bg-orange-50 border-orange-200",
      icon: <BookOpen className="w-8 h-8 text-[#EB5A12]" />,
    },
    {
      id: "OUR_HERITAGE",
      label: "Our Heritage",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      icon: <Landmark className="w-8 h-8 text-[#0A2240]" />,
    },
    {
      id: "PLACES",
      label: "Incredible Places",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
      icon: <Mountain className="w-8 h-8 text-emerald-600" />,
    },
    {
      id: "PEOPLE",
      label: "Good People",
      color: "text-teal-600",
      bgColor: "bg-teal-50 border-teal-200",
      icon: <Users className="w-8 h-8 text-teal-600" />,
    },
    {
      id: "INNOVATIONS",
      label: "Innovations",
      color: "text-amber-500",
      bgColor: "bg-amber-50 border-amber-200",
      icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
    },
    {
      id: "FUN_ADVENTURE",
      label: "Fun & Adventure",
      color: "text-[#EB5A12]",
      bgColor: "bg-orange-50 border-orange-200",
      icon: (
        // Custom SVG Kite Icon matching the image
        <svg className="w-8 h-8 text-[#EB5A12]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 L20 10 L12 18 L4 10 Z" fill="#FCECE6" />
          <path d="M12 2 V18" />
          <path d="M4 10 H20" />
          <path d="M12 18 C14 20, 10 22, 12 24" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M11 18 L13 18 L12 20 Z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  const handleCardClick = (catId: string) => {
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      
      {/* Decorative Title */}
      <div className="flex items-center justify-center gap-4 mb-10 select-none">
        <svg className="w-8 h-8 text-[#EB5A12]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12 L7 10 L7 14 Z M17 10 L21 12 L17 14 Z" />
        </svg>
        <h2 className="font-brush text-4xl sm:text-5xl text-[#0A2240] tracking-wide">
          WHAT <span className="text-[#EB5A12]">PAKKA LOVES</span>
        </h2>
        <svg className="w-8 h-8 text-[#EB5A12]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12 L7 10 L7 14 Z M17 10 L21 12 L17 14 Z" />
        </svg>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
                  ? "border-[#EB5A12] ring-4 ring-[#EB5A12]/10 scale-105 shadow-md"
                  : "border-[#F0EBE0] hover:border-[#EB5A12] hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {/* Icon Container with subtle background shape */}
              <div className={`p-4 rounded-xl mb-4 ${cat.bgColor} flex items-center justify-center transition-colors`}>
                {cat.icon}
              </div>

              {/* Category Label */}
              <span className="font-display font-bold text-sm text-[#0A2240] tracking-tight group-hover:text-[#EB5A12] transition-colors text-center">
                {cat.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
