/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import learnsImg from "../assets/images/pakka_learns_1784465119731.jpg";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[#FAF4E4] rounded-3xl p-8 sm:p-12 border border-[#EBE3CC] relative overflow-hidden shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        
        {/* Background Decorative Paper Planes */}
        <div className="absolute top-4 right-10 opacity-10 pointer-events-none select-none">
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10,80 L80,20 L50,50 L10,80 Z" />
            <path d="M80,20 L50,50" />
            <path d="M50,50 L40,90 L60,65" />
          </svg>
        </div>

        {/* Left Side: Character and Plane Illustrations */}
        <div className="flex items-center gap-6 select-none max-w-sm">
          {/* Circular Character Sticker */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md overflow-hidden flex-shrink-0 relative">
            <img
              src={learnsImg}
              alt="Pakka Patriot reading"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="text-left">
            {/* SVG Flight paths */}
            <svg className="w-16 h-8 text-[#EB5A12]" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10,20 Q40,5 60,15 T90,10" strokeDasharray="3 3" />
              <polygon points="90,10 82,6 85,12" fill="currentColor" />
            </svg>
            <h3 className="font-brush text-3xl sm:text-4xl text-[#0A2240] tracking-wide leading-none mt-2">
              LET'S STAY <br />
              <span className="text-[#EB5A12]">IN TOUCH!</span>
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#4E637A] font-semibold mt-1">
              Get stories, fun facts and updates straight to your inbox.
            </p>
          </div>
        </div>

        {/* Right Side: Subscription Form Container */}
        <div className="w-full flex-grow max-w-lg lg:max-w-none">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-green-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500 flex-shrink-0 animate-bounce" />
              <div>
                <p className="font-display font-bold text-[#0A2240] text-lg">Thank you for subscribing!</p>
                <p className="text-sm text-[#587760]">You've joined the loop. Standby for wonderful updates about India!</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-grow relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full bg-white border border-[#DCD3B5] text-[#0A2240] px-6 py-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#EB5A12] placeholder-gray-400 shadow-inner"
                  />
                  {error && (
                    <span className="absolute -bottom-6 left-2 text-xs font-bold text-red-500">
                      {error}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-[#EB5A12] hover:bg-[#D04D0E] text-white font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer select-none"
                >
                  <Send size={16} />
                  SUBSCRIBE
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
