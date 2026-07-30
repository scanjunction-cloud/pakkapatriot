/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import {
  Heart,
  BookOpen,
  Compass,
  Users,
  Lightbulb,
  Target,
  Award,
  Sparkles,
  Star,
  ArrowRight,
  Shield,
  Smile,
  Globe,
} from "lucide-react";

const PATRIOT_QUALITIES = [
  {
    icon: <Heart className="w-6 h-6 text-[#F6B828]" />,
    title: "Loves India",
    description: "A deep, genuine affection for the country — its people, its land, and its stories."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-brand-sage" />,
    title: "Stays Curious",
    description: "Always learning about India's rich heritage, diverse cultures, and incredible innovations."
  },
  {
    icon: <Compass className="w-6 h-6 text-brand-blue" />,
    title: "Explores Fearlessly",
    description: "Steps off the beaten path to discover the real India — from hidden villages to forgotten histories."
  },
  {
    icon: <Shield className="w-6 h-6 text-[#F6B828]" />,
    title: "Takes Responsibility",
    description: "Understands that citizenship is not passive — every action shapes the nation's future."
  },
  {
    icon: <Globe className="w-6 h-6 text-emerald-500" />,
    title: "Celebrates Diversity",
    description: "Embraces India's pluralism as its greatest strength — many cultures, one nation."
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
    title: "Creates Change",
    description: "Believes in the power of ideas to build a better tomorrow for all Indians."
  }
];

const PILLARS = [
  {
    id: "learns",
    icon: <BookOpen className="w-8 h-8 text-white" />,
    title: "PAKKA LEARNS",
    subtitle: "Timeless wisdom from India's past and present — history, science, art, and philosophy.",
    bgColor: "bg-brand-sage",
    borderColor: "border-brand-yellow"
  },
  {
    id: "explores",
    icon: <Compass className="w-8 h-8 text-white" />,
    title: "PAKKA EXPLORES",
    subtitle: "Incredible places, hidden gems, and the breathtaking diversity of Indian landscapes.",
    bgColor: "bg-brand-blue",
    borderColor: "border-brand-orange"
  },
  {
    id: "celebrates",
    icon: <Award className="w-8 h-8 text-white" />,
    title: "PAKKA CELEBRATES",
    subtitle: "Festivals, traditions, art forms, and the joyful spirit that defines Indian culture.",
    bgColor: "bg-[#F6B828]",
    borderColor: "border-brand-yellow"
  },
  {
    id: "creates",
    icon: <Lightbulb className="w-8 h-8 text-white" />,
    title: "PAKKA CREATES",
    subtitle: "Innovation, entrepreneurship, and ideas that shape a brighter future for the nation.",
    bgColor: "bg-[#E8A817]",
    borderColor: "border-brand-orange"
  }
];

interface AboutUsProps {
  onJoinJourneyClick: () => void;
}

export default function AboutUs({ onJoinJourneyClick }: AboutUsProps) {
  return (
    <section id="about" className="bg-brand-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#FBECE6]/40 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-10 w-48 h-48 bg-[#F6B828]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-64 h-64 bg-[#F6B828]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        
        {/* ============ HERO SECTION ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          {/* Decorative top ornament */}
          <div className="flex items-center justify-center gap-3 mb-6 select-none">
            <div className="w-8 h-px bg-[#F6B828]" />
            <Star className="w-5 h-5 text-[#F6B828]" fill="#F6B828" />
            <div className="w-8 h-px bg-[#F6B828]" />
          </div>

          <h1 className="font-brush text-5xl sm:text-6xl lg:text-7xl text-brand-blue tracking-wide leading-tight mb-4">
            We are <span className="text-[#F6B828]">Pakka Patriot</span>
          </h1>
          <p className="font-sans text-lg sm:text-xl text-[#4E637A] font-medium leading-relaxed max-w-2xl mx-auto">
            A movement to rekindle the spirit of active citizenship — where every Indian discovers 
            the power they hold in shaping the nation's story.
          </p>
          {/* Tagline highlight */}
          <div className="mt-6 inline-block bg-white rounded-full px-6 py-2 border border-[#F0EBE0] shadow-sm">
            <span className="font-display font-black text-sm tracking-widest text-brand-blue">
              KNOW INDIA. <span className="text-[#F6B828]">BE INDIA.</span>
            </span>
          </div>
        </motion.div>

        {/* ============ OUR MISSION ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-blue/5 rounded-full px-4 py-1.5">
              <Target className="w-4 h-4 text-[#F6B828]" />
              <span className="text-xs font-black tracking-widest text-brand-blue uppercase">Our Mission</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-blue leading-tight">
              Turning <span className="text-[#F6B828]">indifference</span> into <span className="text-brand-sage">action</span>
            </h2>
            <div className="space-y-4 text-[#4E637A] leading-relaxed">
              <p className="font-semibold">
                Pakka Patriot exists to inspire everyday Indian citizens to transition from being 
                indifferent observers into responsible, active participants in India's democracy.
              </p>
              <p className="font-medium">
                We believe that real patriotism isn't about grand gestures — it's the daily commitment 
                to unity, harmony, and peace. It's about recognizing that each of us holds the power 
                to shape our nation's future through our choices, our voice, and our actions.
              </p>
              <p className="font-medium">
                Through stories, resources, and a growing community of like-minded citizens, we guide 
                fellow Indians on a journey of self-realization — creating a society where shared 
                responsibility and democratic values aren't just ideals, but a way of life.
              </p>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative circle behind */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#F6B828]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#F6B828]/10 rounded-full blur-xl pointer-events-none" />

              {/* Mission card stack */}
              <div className="bg-white rounded-3xl border border-[#F0EBE0] shadow-xl p-8 space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-[#F0EBE0]">
                  <div className="w-14 h-14 rounded-2xl bg-[#FBECE6] flex items-center justify-center">
                    <Heart className="w-7 h-7 text-[#F6B828]" fill="#F6B828" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-brand-blue">Our Promise</h3>
                    <p className="text-sm text-[#8A9EB4] font-semibold">To every curious Indian</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: <Smile className="w-5 h-5 text-brand-sage" />, text: "Free access to 80+ eBooks on India's freedom fighters, poets, scientists, and saints" },
                    { icon: <Sparkles className="w-5 h-5 text-[#F6B828]" />, text: "Inspiring stories of integrity, diversity, and local heroes from across India" },
                    { icon: <Star className="w-5 h-5 text-[#F6B828]" />, text: "A growing community of Pakka Patriots who believe in building a better India" },
                    { icon: <Globe className="w-5 h-5 text-brand-blue" />, text: "Resources that celebrate Made in India products and homegrown innovation" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                      <p className="text-sm font-semibold text-[#2F445A]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============ OUR PILLARS ============ */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-brand-blue/5 rounded-full px-4 py-1.5 mb-4">
              <Compass className="w-4 h-4 text-[#F6B828]" />
              <span className="text-xs font-black tracking-widest text-brand-blue uppercase">What We Do</span>
            </div>
            <h2 className="font-brush text-4xl sm:text-5xl text-brand-blue tracking-wide">
              The <span className="text-[#F6B828]">Pakka Patriot</span> Way
            </h2>
            <p className="text-[#4E637A] font-semibold mt-3 max-w-xl mx-auto">
              Four pillars that guide everything we create — from stories to products to experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`${pillar.bgColor} rounded-3xl p-6 sm:p-8 ${pillar.borderColor} border-b-4 shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5">
                  {pillar.icon}
                </div>
                <h3 className="font-display font-black text-lg text-white mb-2 tracking-wider">
                  {pillar.title}
                </h3>
                <p className="text-sm text-white/80 font-medium leading-relaxed">
                  {pillar.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============ WHAT MAKES A PAKKA PATRIOT ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="bg-white rounded-3xl border border-[#F0EBE0] shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blue to-[#1A3A5C] p-8 sm:p-10 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <Award className="w-4 h-4 text-[#F6B828]" />
                <span className="text-xs font-black tracking-widest text-white uppercase">Our Philosophy</span>
              </div>
              <h2 className="font-brush text-4xl sm:text-5xl text-white tracking-wide">
                What Makes a <span className="text-[#F6B828]">Pakka Patriot</span>?
              </h2>
              <p className="text-[#B5CADF] font-semibold mt-3 max-w-2xl mx-auto">
                Being a Pakka Patriot isn't about where you were born — it's about the choices you make 
                every single day. Here's what sets a true patriot apart.
              </p>
            </div>

            {/* Qualities Grid */}
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PATRIOT_QUALITIES.map((quality, index) => (
                  <motion.div
                    key={quality.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="flex gap-4 p-5 rounded-2xl bg-brand-cream border border-[#F0EBE0] hover:border-[#F6B828]/30 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      {quality.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-brand-blue text-sm">{quality.title}</h3>
                      <p className="text-xs text-[#4E637A] font-medium leading-relaxed">{quality.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============ OUR STORY ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24"
        >
          <div className="order-2 lg:order-1 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F6B828]/10 rounded-full blur-xl pointer-events-none" />
              
              {/* Timeline-style story card */}
              <div className="bg-white rounded-3xl border border-[#F0EBE0] shadow-xl p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FBECE6] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#F6B828]" />
                  </div>
                  <span className="text-xs font-black tracking-widest text-brand-sage uppercase">The Beginning</span>
                </div>

                <div className="space-y-4 pl-2 border-l-2 border-[#F0EBE0]">
                  <div className="relative pl-6">
                    <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-brand-blue border-2 border-white shadow-sm" />
                    <p className="text-sm font-bold text-brand-blue">2024 — The Idea</p>
                    <p className="text-xs text-[#4E637A] font-medium mt-1">
                      Born from a simple question: How can we make India's incredible stories, heritage, 
                      and wisdom accessible to every curious young mind?
                    </p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-[#F6B828] border-2 border-white shadow-sm" />
                    <p className="text-sm font-bold text-brand-blue">2025 — Building the Movement</p>
                    <p className="text-xs text-[#4E637A] font-medium mt-1">
                      What started as a collection of stories grew into a full-fledged platform — with 
                      curated content, merchandise celebrating Indian culture, and a growing community.
                    </p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-[#F6B828] border-2 border-white shadow-sm" />
                    <p className="text-sm font-bold text-brand-blue">2026 — A Nation of Patriots</p>
                    <p className="text-xs text-[#4E637A] font-medium mt-1">
                      Today, Pakka Patriot is a thriving ecosystem of stories, products, and experiences — 
                      empowering thousands of young Indians to know India and be India.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0EBE0]">
                  <p className="text-xs text-[#8A9EB4] font-semibold italic">
                    "The journey is just beginning. And we want you to be part of it."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-brand-blue/5 rounded-full px-4 py-1.5">
              <Star className="w-4 h-4 text-[#F6B828]" />
              <span className="text-xs font-black tracking-widest text-brand-blue uppercase">Our Story</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-blue leading-tight">
              From a <span className="text-[#F6B828]">spark</span> to a <span className="text-brand-sage">movement</span>
            </h2>
            <div className="space-y-4 text-[#4E637A] leading-relaxed">
              <p className="font-semibold">
                Pakka Patriot was created with a singular vision — to help every Indian child and young adult 
                discover the richness of their own country. In a world of global content, we wanted to create 
                a space that celebrates what makes India truly special.
              </p>
              <p className="font-medium">
                We started by asking young people what they knew about India beyond the textbooks. The answers 
                inspired us — and also showed us how much more there was to explore. From the unsung heroes of 
                the freedom struggle to the hidden villages practicing centuries-old crafts, India's story is 
                endless, and we're just getting started telling it.
              </p>
              <p className="font-medium">
                Today, we're a community of learners, explorers, and dreamers who believe that when you truly 
                know India, you naturally want to be India — in every thought, every action, every day.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ============ JOIN THE MOVEMENT ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-brand-blue to-[#1A3A5C] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F6B828]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#F6B828]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F6B828] flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="font-brush text-4xl sm:text-5xl text-white tracking-wide">
                Join the <span className="text-[#F6B828]">Movement</span>
              </h2>
              
              <p className="text-[#B5CADF] font-semibold text-lg max-w-xl mx-auto">
                Every great journey begins with a single step. Take yours today and become a Pakka Patriot.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={onJoinJourneyClick}
                  className="bg-[#F6B828] hover:bg-[#DAA520] text-white px-8 py-4 rounded-xl text-md font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  BECOME A BUDDY
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => {
                    const shopSec = document.getElementById("woocommerce-shop");
                    if (shopSec) shopSec.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-md font-bold transition-all duration-200 cursor-pointer"
                >
                  EXPLORE MERCH
                </button>
              </div>

              <div className="pt-6 flex items-center justify-center gap-6 text-xs text-[#8EA6C0] font-semibold">
                <span>🇮🇳 Free Resources</span>
                <span className="w-1 h-1 rounded-full bg-[#8EA6C0]" />
                <span>📚 80+ eBooks</span>
                <span className="w-1 h-1 rounded-full bg-[#8EA6C0]" />
                <span>🎯 Community</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
