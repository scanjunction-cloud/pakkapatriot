/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useNavigate } from "react-router-dom";
import { Instagram, Youtube, Facebook, ArrowUp } from "lucide-react";
import ppLogo from "../assets/images/pp_logo.png";

interface FooterProps {
  onTabChange: (tab: string) => void;
  onJoinJourneyClick: () => void;
}

export default function Footer({ onTabChange, onJoinJourneyClick }: FooterProps) {
  const navigate = useNavigate();
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabWithNav = (tab: string) => {
    if (tab === "stories") {
      navigate("/stories");
      return;
    }
    if (tab === "explore") {
      navigate("/explore");
      return;
    }
    onTabChange(tab);
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById(tab);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <footer className="bg-[#0A1A2E] text-[#B5CADF] border-t-4 border-[#F6B828] pt-16 pb-8 relative overflow-hidden select-none">
      
      {/* Decorative vector arches matching Indian monument architecture in BG */}
      <div className="absolute top-0 right-0 w-80 h-80 border-t border-r border-white/5 rounded-tr-full pointer-events-none -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 border-b border-l border-white/5 rounded-bl-full pointer-events-none translate-y-10 -translate-x-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 items-start mb-12">
          
          {/* Column 1: Brand Intro (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start text-left space-y-5">
            <div className="flex items-center cursor-pointer" onClick={handleScrollToTop}>
              <img src={ppLogo} alt="Pakka Patriot" className="w-16 h-16 object-contain" />
            </div>

            <p className="text-sm text-[#8EA6C0] font-medium leading-relaxed max-w-xs">
              Know India. Be India. A space for curious minds to learn, explore, and make a positive impact.
            </p>

            <button
              onClick={onJoinJourneyClick}
              className="bg-[#F6B828] hover:bg-[#DAA520] text-white font-bold text-xs px-6 py-3 rounded-full transition-all duration-200 shadow hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
            >
              Join the Journey
            </button>
          </div>

          {/* Column 2: Explore Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-start text-left space-y-4">
            <h4 className="text-white font-display font-extrabold text-sm tracking-widest uppercase">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <button onClick={() => handleTabWithNav("stories")} className="hover:text-white transition-colors cursor-pointer">
                  Stories
                </button>
              </li>
              <li>
                <button onClick={() => handleTabWithNav("explore")} className="hover:text-white transition-colors cursor-pointer">
                  Explore
                </button>
              </li>
              <li>
                <button onClick={() => handleTabWithNav("traditions")} className="hover:text-white transition-colors cursor-pointer">
                  Traditions
                </button>
              </li>
              <li>
                <button onClick={() => handleTabWithNav("people")} className="hover:text-white transition-colors cursor-pointer">
                  People
                </button>
              </li>
              <li>
                <button onClick={() => handleTabWithNav("funzone")} className="hover:text-white transition-colors cursor-pointer">
                  Fun Zone
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: About Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-start text-left space-y-4">
            <h4 className="text-white font-display font-extrabold text-sm tracking-widest uppercase">
              ABOUT
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <button onClick={onJoinJourneyClick} className="hover:text-white transition-colors cursor-pointer">
                  Join Us
                </button>
              </li>
              <li>
                <button onClick={() => alert("Please contact us at: support@pakkapatriot.com")} className="hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us & Sticky Note Widget (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end space-y-6 text-left lg:text-right">
            <div>
              <h4 className="text-white font-display font-extrabold text-sm tracking-widest uppercase mb-3">
                FOLLOW US
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/pakkapatriot/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-tr from-[#FFB800] via-[#FF007A] to-[#9E00FF] hover:opacity-90 text-white rounded-full flex items-center justify-center transition-all shadow-md"
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-full flex items-center justify-center transition-all shadow-md"
                  title="YouTube"
                >
                  <Youtube size={18} />
                </a>
                {/* X Logo using inline vector */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black hover:bg-neutral-800 text-white rounded-full flex items-center justify-center transition-all shadow-md"
                  title="X (Twitter)"
                >
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1877F2] hover:bg-[#165EBF] text-white rounded-full flex items-center justify-center transition-all shadow-md"
                  title="Facebook"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>

            {/* Sticky post-it note widget matching original screenshot */}
            <div className="bg-[#FAF4E4] border-2 border-[#E4DCB9] text-[#0A2240] p-4 rounded-xl shadow-lg rotate-[3deg] hover:rotate-0 transition-transform duration-300 max-w-xs relative text-left">
              <div className="absolute top-0 right-4 w-4 h-4 bg-[#D1C7A3] rounded-bl-full pointer-events-none" />
              <p className="font-brush text-xl tracking-wide select-none">
                Be Informed. <br />
                Be Inspired. <br />
                <span className="text-[#F6B828]">Be India. 🧡</span>
              </p>
            </div>
          </div>

        </div>

        {/* Divider and copyright */}
        <div className="border-t border-[#1F3D5E] pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-[#8EA6C0]">
          <p>© 2026 Pakka Patriot Website. Crafted with love for India.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <button
              onClick={handleScrollToTop}
              className="flex items-center gap-1.5 text-[#F6B828] hover:text-white transition-colors font-bold cursor-pointer"
            >
              Back to top
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
