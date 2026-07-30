/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import learnsImg from "../assets/images/1sec.png";
import exploresImg from "../assets/images/2sec.png";
import celebratesImg from "../assets/images/3sec.png";
import createsImg from "../assets/images/4sec.png";

const HIGHLIGHT_CARDS = [
  {
    id: "learns",
    title: "LEARNS",
    subtitle: "about timeless wisdom.",
    image: learnsImg,
  },
  {
    id: "explores",
    title: "EXPLORES",
    subtitle: "incredible places and culture.",
    image: exploresImg,
  },
  {
    id: "celebrates",
    title: "CELEBRATES",
    subtitle: "our traditions and festivals.",
    image: celebratesImg,
  },
  {
    id: "creates",
    title: "CREATES",
    subtitle: "a better tomorrow with ideas.",
    image: createsImg,
  },
];

interface GreenHighlightsProps {
  onCardClick: (cardId: string) => void;
}

export default function GreenHighlights({ onCardClick }: GreenHighlightsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#688059] rounded-3xl shadow-lg text-white p-6 sm:p-8 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 lg:divide-x lg:divide-white/20">
          {HIGHLIGHT_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              onClick={() => onCardClick(card.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-4 px-2 sm:px-4 cursor-pointer group hover:bg-white/5 py-3 rounded-2xl transition-all duration-200"
            >
              {/* Image - No boundary, not cropped */}
              <div className="flex-shrink-0 transform group-hover:scale-105 transition-transform duration-200">
                <img
                  src={card.image}
                  alt={card.title}
                  className="max-w-[120px] sm:max-w-[160px] h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Wrapper */}
              <div className="flex flex-col text-left">
                <span className="font-display font-black text-lg tracking-wider text-white flex items-center gap-1 group-hover:text-brand-yellow transition-colors">
                  {card.title}
                </span>
                <span className="text-xs sm:text-sm text-brand-cream/80 font-medium leading-tight">
                  {card.subtitle}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
