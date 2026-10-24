"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Sparkles, MapPin } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 relative z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>Stores: Coimbatore • Annur • P. Puliam patti</span>
        </div>

        <div className="flex-1 text-center font-medium flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase border border-blue-400/30">
            <Sparkles className="w-3 h-3" /> Verified Promo
          </span>
          <span className="text-slate-200">
            Unbreakable Tempered Glass from <strong>₹99</strong> • Custom Skins from <strong>₹149</strong>
          </span>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center text-blue-400 hover:text-white underline underline-offset-2 font-semibold ml-2 text-[11px]"
          >
            Shop Offers &rarr;
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement"
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
