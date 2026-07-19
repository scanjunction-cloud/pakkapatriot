/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Play, ArrowRight } from "lucide-react";
import heroImg from "../assets/images/pakka_hero_character_1784465102215.jpg";

interface HeroProps {
  onExploreStories: () => void;
  onWatchVideo: () => void;
}

export default function Hero({ onExploreStories, onWatchVideo }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pb-24 lg:pt-20 lg:pb-24">
      {/* Dynamic graphic particles in background */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-[#F6B828]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-36 h-36 bg-[#EB5A12]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left column: Text Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="font-brush text-5xl sm:text-7xl lg:text-8xl leading-none tracking-wide text-[#0A2240] select-none">
                KNOW INDIA. <br />
                <span className="text-[#EB5A12]">BE INDIA.</span>
              </h1>

              <p className="font-sans text-lg sm:text-xl text-[#2F445A] font-medium leading-relaxed max-w-lg">
                Pakka Patriot is your buddy on a journey to explore the real India – its stories, traditions, people and so much more!
              </p>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={onExploreStories}
                  className="bg-[#EB5A12] hover:bg-[#D04D0E] text-white px-8 py-4 rounded-xl text-md font-bold shadow-md hover:shadow-lg transition-all duration-250 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  EXPLORE STORIES
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={onWatchVideo}
                  className="border-2 border-[#0A2240] hover:bg-[#FAF6EC] text-[#0A2240] px-8 py-4 rounded-xl text-md font-bold transition-all duration-250 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Play size={18} fill="#0A2240" className="transition-transform group-hover:scale-110" />
                  WATCH VIDEO
                </button>
              </div>

              {/* Organic "Curious minds" callout graphic */}
              <div className="relative pt-6 flex items-start gap-4 select-none ml-2">
                {/* Handdrawn sketch arrow in SVG */}
                <svg className="w-16 h-16 text-[#0A2240] animate-bounce-horizontal" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20,20 C40,40 60,30 80,70" strokeDasharray="4 4" />
                  <path d="M70,68 L80,70 L78,60" />
                </svg>
                <div className="pt-2">
                  <p className="font-brush text-2xl text-[#2F445A] rotate-[-4deg] tracking-wide">
                    Curious minds <br />
                    <span className="text-[#EB5A12]">change the country!</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column: Beautifully structured graphic */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-md sm:max-w-lg lg:max-w-none"
            >
              {/* Backing Sun disk */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#FBECE6] rounded-full pointer-events-none -z-10" />
              
              {/* Main character image */}
              <img
                src={heroImg}
                alt="Pakka Patriot Character and India Gate"
                className="w-full h-auto rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              
              {/* Quick info badge floating */}
              <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white border border-[#E4DCB9] px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 select-none">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-xs font-bold text-[#0A2240] font-sans uppercase tracking-wider">
                  Live from PakkaPatriot.com
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
