/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, ExternalLink, BookOpen } from "lucide-react";
import { getCategoryBadgeClasses } from "./LatestStories";
import type { WPPost } from "../types";

export default function StoryDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const post = (location.state as { post: WPPost } | null)?.post;

  if (!post) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 mx-auto text-[#E4DCB9] mb-4" />
          <h2 className="font-display font-bold text-2xl text-[#0A2240] mb-2">Story Not Found</h2>
          <p className="text-sm text-[#2F445A] mb-6">
            This story could not be loaded. It may have been removed or the link is invalid.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-[#F6B828] hover:bg-[#DAA520] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const badge = getCategoryBadgeClasses(post.category);

  return (
    <div className="min-h-screen bg-brand-cream relative">
      {/* Back button bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#F0EBE0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-[#0A2240] hover:text-[#F6B828] transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <span className="text-[10px] font-black tracking-widest text-[#8A9EB4] uppercase">
            PakkaPatriot Story
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-gray-100">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute bottom-6 left-4 sm:left-8">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase select-none shadow-lg ${badge.bg} ${badge.text}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <article className="space-y-8">
          {/* Title & Meta */}
          <div className="space-y-4 text-left">
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#0A2240] tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-[#8A9EB4] uppercase tracking-wider font-sans">
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{post.authorName || "Pakka Patriot"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{post.readTime || "4 min read"}</span>
              </div>
            </div>
          </div>

          {/* Excerpt highlight */}
          <div className="bg-[#FAF6EC] border-l-4 border-[#F6B828] rounded-r-xl p-5">
            <p className="text-sm sm:text-md font-semibold text-[#2F445A] leading-relaxed italic">
              {post.excerpt}
            </p>
          </div>

          {/* Full Content */}
          <div className="text-sm sm:text-md text-[#2F445A] leading-relaxed font-sans text-left space-y-5">
            {post.content ? (
              <div
                className="space-y-5 prose prose-sm sm:prose-base max-w-none prose-headings:text-[#0A2240] prose-headings:font-display prose-a:text-[#F6B828] prose-strong:text-[#0A2240]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="space-y-5">
                <p>
                  This article is a deep-dive story exploring India's rich history, traditions, and culture. 
                  Read the full post on pakkapatriot.com using the link below.
                </p>
                <div className="bg-[#FAF6EC] rounded-2xl p-6 border border-[#E4DCB9]">
                  <p className="text-sm font-semibold text-[#0A2240] mb-3">
                    📖 Full story available at PakkaPatriot.com
                  </p>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#F6B828] hover:bg-[#DAA520] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    Read original post
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="pt-8 border-t border-[#F0EBE0] flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-[#0A2240] hover:text-[#F6B828] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to stories
            </button>

            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#8A9EB4] hover:text-[#F6B828] transition-colors flex items-center gap-1"
            >
              <ExternalLink size={12} />
              View on PakkaPatriot.com
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
