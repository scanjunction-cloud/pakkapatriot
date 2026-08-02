/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, Users, Castle, Wifi, Monitor, ChevronRight, Sparkles, Shell, Swords, Bot, Shield, LayoutGrid, Skull, Zap } from "lucide-react";

interface GameCard {
  id: string;
  title: string;
  tagline: string;
  description: string;
  path: string;
  tags: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }[];
  accent: string;
  badge: string;
}

const GAMES: GameCard[] = [
  {
    id: "chaukabaara",
    title: "Chaukabaara",
    tagline: "The ancient Indian game of strategy & luck",
    description:
      "Race your cowrie-shell dice across a square board in this two-thousand-year-old game of ancient India. Play with 2, 3, or 4 players on a 5-house or 7-house board — against friends online or around the same screen.",
    path: "/play/chaukabaara",
    tags: [
      { icon: Users, label: "2–4 players" },
      { icon: Castle, label: "5 & 7 house boards" },
      { icon: Wifi, label: "Online rooms" },
      { icon: Monitor, label: "Hot-seat local" },
      { icon: Shell, label: "Cowrie shell dice" },
    ],
    accent: "from-[#0A2240] to-[#1F3D5E]",
    badge: "★ Ancient India",
  },
  {
    id: "aadupuliatam",
    title: "Aadu Puli Aatam",
    tagline: "Goats & Tigers — the classic hunt of Tamil Nadu",
    description:
      "Three tigers stalk fifteen goats on the temple triangle of Tamil Nadu. Place and move your goats to surround the tigers — or hunt them down, one leap at a time. Play hot-seat or challenge the computer.",
    path: "/play/aadu-puli-aatam",
    tags: [
      { icon: Swords, label: "3 tigers vs 15 goats" },
      { icon: Bot, label: "Vs computer" },
      { icon: Monitor, label: "Hot-seat local" },
      { icon: Users, label: "2 players" },
      { icon: Shield, label: "Pure strategy" },
    ],
    accent: "from-[#0C2419] to-[#1F4A33]",
    badge: "★ South India",
  },
  {
    id: "chaturvimshati",
    title: "Chaturvimshati Koṣṭaka",
    tagline: "Twenty-Four Squares — the game of Krīḍākauśalya",
    description:
      "From the ancient Sanskrit text Krīḍākauśalya: eight ivory soldiers against eight crimson across a 3×8 board of twenty-four squares. Step sideways or leap over the enemy — capture them all, or trap them with no move left. Play hot-seat, vs the computer, or online.",
    path: "/play/chaturvimshati",
    tags: [
      { icon: LayoutGrid, label: "3×8 board · 24 squares" },
      { icon: Users, label: "2 players" },
      { icon: Bot, label: "Vs computer" },
      { icon: Wifi, label: "Online rooms" },
      { icon: Shield, label: "Pure strategy" },
    ],
    accent: "from-[#1d1026] to-[#3a1f4a]",
    badge: "★ Krīḍākauśalya",
  },
  {
    id: "vishamrit",
    title: "Vish & Amrit",
    tagline: "Poison & Nectar — the ancient freeze-tag chase",
    description:
      "One player is Vish, the poison, hunting three fleeing runners across a 7×7 board. Touch a runner and they freeze into a Statue — but a runner who ends their move touching a statue cries “Amrit!” and frees them. Freeze all three, or survive 60 rounds. Play hot-seat, vs the computer, or online.",
    path: "/play/vish-amrit",
    tags: [
      { icon: Skull, label: "1 Vish vs 3 runners" },
      { icon: Zap, label: "Amrit release" },
      { icon: Bot, label: "Vs computer" },
      { icon: Wifi, label: "Online rooms" },
      { icon: Users, label: "2 players" },
    ],
    accent: "from-[#0F1912] to-[#2A4A32]",
    badge: "★ Poison & Nectar",
  },
];

export default function PlayPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-brand-cream min-h-screen">
      {/* HERO */}
      <section className="relative bg-[#0A2240] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none" aria-hidden="true">
          <div className="absolute top-8 left-8 w-40 h-40 border-t-4 border-r-4 border-white rounded-tr-full" />
          <div className="absolute bottom-6 right-10 w-56 h-56 border-b-4 border-l-4 border-white rounded-bl-full" />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-white rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-left">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-[#F6B828] mb-3">
            <Gamepad2 size={14} /> Play & Learn
          </span>
          <h1 className="font-brush text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-wide">
            Games from <span className="text-[#F6B828]">Bharat</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#B5CADF] font-medium leading-relaxed">
            Step into the playrooms of history. These games are reimagined from the courtyards, palaces,
            and village squares of ancient India — now playable with family and friends, online or in person.
          </p>
        </div>
      </section>

      {/* GAME CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#0A2240]">All Games</h2>
          <span className="text-xs font-bold text-[#587760] bg-[#EAF1EB] px-3 py-1 rounded-full">
            {GAMES.length} {GAMES.length === 1 ? "game" : "games"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {GAMES.map((game) => {
            const Icon = game.tags[0].icon;
            return (
              <button
                key={game.id}
                onClick={() => navigate(game.path)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-[#F0EBE0] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer flex flex-col"
              >
                {/* Banner art */}
                <div className={`relative h-44 bg-gradient-to-br ${game.accent} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 opacity-[0.08] pointer-events-none" aria-hidden="true">
                    <div className="absolute top-4 left-6 w-20 h-20 border-2 border-white rounded-tr-full" />
                    <div className="absolute bottom-4 right-6 w-24 h-24 border-2 border-white rounded-bl-full" />
                  </div>
                  <div className="relative w-24 h-24 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon size={44} className="text-[#F6B828]" />
                  </div>
                  <span className="absolute top-4 left-4 text-[10px] font-black tracking-widest uppercase bg-[#F6B828] text-[#0A2240] px-2.5 py-1 rounded-full shadow">
                    {game.badge}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display font-black text-2xl text-[#0A2240] flex items-center gap-2">
                    {game.title}
                    <Sparkles size={18} className="text-[#F6B828] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs font-bold text-[#587760] uppercase tracking-wider mt-0.5">{game.tagline}</p>
                  <p className="text-sm text-[#4E637A] font-medium leading-relaxed mt-3 flex-grow">{game.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {game.tags.map((t) => {
                      const TagIcon = t.icon;
                      return (
                        <span
                          key={t.label}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A2240] bg-[#FAF6EC] border border-[#E4DCB9] px-2.5 py-1 rounded-full"
                        >
                          <TagIcon size={12} className="text-[#F6B828]" />
                          {t.label}
                        </span>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F0EBE0] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#587760]">FREE TO PLAY</span>
                    <span className="inline-flex items-center gap-1 text-sm font-black text-[#0A2240] bg-[#F6B828] group-hover:bg-[#DAA520] px-5 py-2.5 rounded-full transition-colors">
                      Play Now <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Coming soon card */}
          <div className="rounded-3xl border-2 border-dashed border-[#E4DCB9] bg-white/50 flex flex-col items-center justify-center p-8 min-h-[280px] text-center">
            <div className="w-14 h-14 rounded-full bg-[#FAF6EC] border border-[#E4DCB9] flex items-center justify-center mb-3">
              <Gamepad2 size={22} className="text-[#C8C5B9]" />
            </div>
            <p className="font-display font-bold text-[#0A2240]">More games coming soon</p>
            <p className="text-xs text-[#8A9EB4] font-semibold mt-1">Pachisi, Chaupar & more from India's past</p>
          </div>
        </div>
      </section>

      {/* HOW TO PLAY STRIP */}
      <section className="bg-[#FEF5E0] border-y border-[#F0E6C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Pick your game", text: "Choose Chaukabaara from the playroom above." },
            { step: "2", title: "Play together", text: "Host an online room & share the 4-letter code, or pass the screen for hot-seat." },
            { step: "3", title: "Cast & conquer", text: "Throw the cowrie shells, race your pieces home, and be the first to finish." },
          ].map((s) => (
            <div key={s.step} className="flex gap-3 items-start text-left">
              <div className="w-9 h-9 rounded-full bg-[#0A2240] text-[#F6B828] font-black flex items-center justify-center flex-shrink-0 text-sm">
                {s.step}
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#0A2240]">{s.title}</h4>
                <p className="text-xs text-[#4E637A] font-medium mt-0.5 leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <Link
          to="/play/chaukabaara"
          className="inline-flex items-center gap-2 bg-[#F6B828] hover:bg-[#DAA520] text-white px-8 py-4 rounded-full font-black text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Shell size={18} /> Start Playing Chaukabaara
        </Link>
      </section>
    </div>
  );
}
