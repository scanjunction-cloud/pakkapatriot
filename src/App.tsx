/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GreenHighlights from "./components/GreenHighlights";
import WhatPakkaLoves from "./components/WhatPakkaLoves";
import LatestStories from "./components/LatestStories";
import WooCommerceShop from "./components/WooCommerceShop";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import DetailModal from "./components/DetailModal";
import { fetchWordPressPosts, fetchWooCommerceProducts } from "./services/api";
import { WPPost, WCProduct } from "./types";
import { X, Play, Heart, Award, Trophy, MapPin, Sparkles, ShoppingCart, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  // Data lists
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [products, setProducts] = useState<WCProduct[]>([]);
  
  // Loading states
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoveCategory, setSelectedLoveCategory] = useState<string | null>(null);
  const [selectedMerchCategory, setSelectedMerchCategory] = useState<string | null>(null);

  // Modal / Popup active states
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<WCProduct | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);

  // Cart simulator state
  const [cartItems, setCartItems] = useState<WCProduct[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Join Journey Form State
  const [journeyForm, setJourneyForm] = useState({
    name: "",
    email: "",
    age: "",
    city: "",
    interests: [] as string[]
  });
  const [journeySubmitted, setJourneySubmitted] = useState(false);

  // Fetch WordPress & WooCommerce data on mount
  useEffect(() => {
    async function loadData() {
      setLoadingPosts(true);
      setLoadingProducts(true);
      
      const fetchedPosts = await fetchWordPressPosts();
      setPosts(fetchedPosts);
      setLoadingPosts(false);

      const fetchedProducts = await fetchWooCommerceProducts();
      setProducts(fetchedProducts);
      setLoadingProducts(false);
    }
    loadData();
  }, []);

  // Filter results by search query
  const searchedPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  });

  const searchedProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  // Handle Cart Addition
  const handleAddToCart = (prod: WCProduct) => {
    setCartItems((prev) => [...prev, prod]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Join the journey form submission
  const handleJourneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journeyForm.name || !journeyForm.email) return;
    setJourneySubmitted(true);
    setTimeout(() => {
      setJourneySubmitted(false);
      setJourneyOpen(false);
      setJourneyForm({ name: "", email: "", age: "", city: "", interests: [] });
    }, 3000);
  };

  const handleInterestToggle = (interest: string) => {
    setJourneyForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-brand-cream relative flex flex-col font-sans">
      
      {/* HEADER SECTION */}
      <Header
        onSearch={setSearchQuery}
        onFilterMerchCategory={setSelectedMerchCategory}
        selectedMerchCategory={selectedMerchCategory}
        onJoinJourneyClick={() => setJourneyOpen(true)}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />

      {/* Floating Cart Badge / Drawer trigger */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setCartOpen(true)}
            className="bg-[#EB5A12] text-white p-4 rounded-full shadow-2xl hover:bg-[#D04D0E] transition-all duration-200 transform hover:scale-110 flex items-center gap-2 select-none font-bold"
          >
            <ShoppingCart size={22} className="animate-bounce" />
            <span className="bg-white text-[#EB5A12] px-2.5 py-0.5 rounded-full text-xs">
              {cartItems.length}
            </span>
          </button>
        </div>
      )}

      {/* MAIN CONTENT COMPOSITION */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <Hero
          onExploreStories={() => {
            const el = document.getElementById("latest-stories");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          onWatchVideo={() => setVideoOpen(true)}
        />

        {/* GREEN HIGH-LIGHTS STRIP */}
        <GreenHighlights
          onCardClick={(pillarId) => {
            // Broad search matching the clicked pillar
            if (pillarId === "learns") {
              setSelectedLoveCategory("HERITAGE");
            } else if (pillarId === "explores") {
              setSelectedLoveCategory("PLACES");
            } else if (pillarId === "celebrates") {
              setSelectedLoveCategory("TRADITIONS");
            } else if (pillarId === "creates") {
              setSelectedLoveCategory("INNOVATIONS");
            }
          }}
        />

        {/* WHAT PAKKA LOVES GRID */}
        <WhatPakkaLoves
          onSelectCategory={setSelectedLoveCategory}
          selectedCategory={selectedLoveCategory}
        />

        {/* LATEST STORIES (WORDPRESS SYNC) */}
        <LatestStories
          posts={searchedPosts}
          loading={loadingPosts}
          onPostClick={setSelectedPost}
          selectedCategory={selectedLoveCategory}
          onViewAllStories={() => {
            setSelectedLoveCategory(null);
            setSearchQuery("");
            const el = document.getElementById("latest-stories");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* WOOCOMMERCE PRODUCT STORE SHOWCASE */}
        <WooCommerceShop
          products={searchedProducts}
          loading={loadingProducts}
          selectedCategory={selectedMerchCategory}
          onProductClick={setSelectedProduct}
          onClearCategory={() => {
            setSelectedMerchCategory(null);
            setSearchQuery("");
          }}
        />

        {/* NEWSLETTER FORM */}
        <Newsletter />
      </main>

      {/* FOOTER SECTION */}
      <Footer
        onTabChange={setActiveTab}
        onJoinJourneyClick={() => setJourneyOpen(true)}
      />

      {/* DYNAMIC STORY / PRODUCT DEEP-DIVE MODAL */}
      {(selectedPost || selectedProduct) && (
        <DetailModal
          post={selectedPost}
          product={selectedProduct}
          onClose={() => {
            setSelectedPost(null);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* YOUTUBE WATCH VIDEO MODAL */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-black max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video flex flex-col">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all duration-200 cursor-pointer"
              title="Close Video"
            >
              <X size={18} />
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/S70tC0A6wVw?autoplay=1"
              title="Incredible India Journey Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* JOIN THE JOURNEY MODAL FORM */}
      {journeyOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-brand-cream max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border border-[#F0EBE0] p-6 sm:p-8 flex flex-col text-left">
            <button
              onClick={() => setJourneyOpen(false)}
              className="absolute top-4 right-4 bg-black/5 hover:bg-black/10 text-[#0A2240] p-2.5 rounded-full transition-all duration-200 cursor-pointer"
              title="Close Dialog"
            >
              <X size={16} />
            </button>

            {journeySubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
                  <Award size={32} />
                </div>
                <h3 className="font-display font-black text-2xl text-[#0A2240]">YOU'RE A PATRIOT BUDDY!</h3>
                <p className="text-sm text-[#587760] font-semibold">
                  Woohoo! Welcome on board {journeyForm.name}. Your official buddy passport and sticker card is flying to your email inbox!
                </p>
                <div className="pt-4 border-t border-gray-200 text-xs text-gray-400">
                  Closing passport generator...
                </div>
              </div>
            ) : (
              <form onSubmit={handleJourneySubmit} className="space-y-5">
                <div className="text-center sm:text-left select-none">
                  <span className="text-[10px] font-black tracking-widest text-[#EB5A12] uppercase font-sans">
                    EXPLORE REAL INDIA
                  </span>
                  <h3 className="font-brush text-3xl sm:text-4xl text-[#0A2240] tracking-wide mt-1">
                    BECOME A <span className="text-[#EB5A12]">BUDDY!</span>
                  </h3>
                  <p className="text-xs text-[#4E637A] font-semibold mt-1">
                    Get an official buddy identity card, free sticker packets, and local explorer puzzles sent to you!
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-black text-[#0A2240] uppercase tracking-wider block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={journeyForm.name}
                      onChange={(e) => setJourneyForm({ ...journeyForm, name: e.target.value })}
                      className="w-full bg-white border border-[#DCD3B5] px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#EB5A12] text-[#0A2240]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#0A2240] uppercase tracking-wider block mb-1">Parent's / Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav@gmail.com"
                      value={journeyForm.email}
                      onChange={(e) => setJourneyForm({ ...journeyForm, email: e.target.value })}
                      className="w-full bg-white border border-[#DCD3B5] px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#EB5A12] text-[#0A2240]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-[#0A2240] uppercase tracking-wider block mb-1">Age</label>
                      <input
                        type="number"
                        placeholder="e.g. 12"
                        value={journeyForm.age}
                        onChange={(e) => setJourneyForm({ ...journeyForm, age: e.target.value })}
                        className="w-full bg-white border border-[#DCD3B5] px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#EB5A12] text-[#0A2240]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-[#0A2240] uppercase tracking-wider block mb-1">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur"
                        value={journeyForm.city}
                        onChange={(e) => setJourneyForm({ ...journeyForm, city: e.target.value })}
                        className="w-full bg-white border border-[#DCD3B5] px-4 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#EB5A12] text-[#0A2240]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-[#0A2240] uppercase tracking-wider block">What excites you most?</label>
                    <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                      {["🎨 Local Art", "🕌 Historic Monuments", "⛰️ Mountains", "📚 Indian Freedom Fighters", "🧩 Fun Quizzes"].map((interest) => {
                        const active = journeyForm.interests.includes(interest);
                        return (
                          <button
                            type="button"
                            key={interest}
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                              active
                                ? "bg-[#EB5A12] border-[#EB5A12] text-white"
                                : "bg-white border-[#DCD3B5] text-[#0A2240] hover:bg-gray-50"
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EB5A12] hover:bg-[#D04D0E] text-white py-3.5 rounded-xl font-bold text-sm shadow hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                >
                  <Trophy size={16} />
                  CLAIM BUDDY PASSPORT
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SHOPPING BAG DRAWER MODAL */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-brand-cream max-w-md w-full h-full shadow-2xl flex flex-col animate-slide-left border-l border-[#F0EBE0] text-left">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#F0EBE0] flex justify-between items-center bg-white">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-[#EB5A12]" size={20} />
                <h3 className="font-display font-black text-lg text-[#0A2240]">YOUR SHOPPING BAG</h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-[#0A2240] p-1.5 hover:bg-gray-100 rounded-full cursor-pointer"
                title="Close Drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#F0EBE0] items-center relative group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF6EC] flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <span className="text-[10px] font-black text-[#587760] uppercase tracking-wide block">{item.category}</span>
                    <h4 className="font-display font-bold text-xs text-[#0A2240] line-clamp-1">{item.name}</h4>
                    <p className="font-sans font-black text-sm text-[#EB5A12]">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(index)}
                    className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Drawer Checkout Footer */}
            <div className="p-6 border-t border-[#F0EBE0] bg-white space-y-4">
              <div className="flex justify-between items-center text-md font-bold text-[#0A2240]">
                <span>TOTAL:</span>
                <span className="text-xl font-black text-[#EB5A12]">
                  ₹{cartItems.reduce((acc, curr) => acc + parseFloat(curr.price), 0)}
                </span>
              </div>
              
              <div className="space-y-2">
                {/* Redirecting directly to Pakka Patriot checkout */}
                <a
                  href="https://pakkapatriot.com/cart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#EB5A12] hover:bg-[#D04D0E] text-white py-3.5 rounded-xl font-bold text-sm shadow hover:shadow-lg transition-all flex items-center justify-center gap-1.5 select-none cursor-pointer"
                >
                  SECURE CHECKOUT ON PAKKAPATRIOT
                  <ArrowRight size={16} />
                </a>
                <button
                  onClick={() => setCartItems([])}
                  className="w-full text-center text-xs text-gray-400 hover:text-[#EB5A12] font-semibold py-2 cursor-pointer"
                >
                  Empty Bag
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
