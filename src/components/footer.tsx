"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { STORE_CONTACT, VERIFIED_LOCATIONS } from "@/data/locations";

export function Footer() {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Do not render public customer footer in the admin dashboard section
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
      {/* Top Banner: Store Trust Pillars */}
      <div className="border-b border-slate-900 bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Genuine 3M & PMMA Materials</p>
              <p className="text-xs text-slate-400">Authentic materials with residue-free peel guarantee.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">3 Verified Physical Stores</p>
              <p className="text-xs text-slate-400">Visit us in Coimbatore, Annur & P. Puliam patti.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Same-Day Laser Cutting</p>
              <p className="text-xs text-slate-400">Walk-in instant cut and heat fit in under 5 mins.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Locations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 flex items-center justify-center border border-slate-700 shadow-xs">
                <Image
                  src="/images/phonex-badge.png"
                  alt="PHONEX"
                  fill
                  sizes="48px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-black text-xl tracking-wider text-white">PHONEX</span>
                <span className="text-[10px] tracking-widest uppercase block text-blue-400 font-bold">
                  Sales • Services • Gadgets
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Your premier destination for precision custom mobile skins, ₹99 unbreakable tempered glass, and high-performance smartphone accessories across Tamil Nadu.
            </p>

            {/* Direct Contact Info */}
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <a
                href={`tel:${STORE_CONTACT.phone}`}
                className="flex items-center gap-2.5 hover:text-blue-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{STORE_CONTACT.phone} ({STORE_CONTACT.phoneInternational})</span>
              </a>
              <a
                href={`mailto:${STORE_CONTACT.email}`}
                className="flex items-center gap-2.5 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{STORE_CONTACT.email}</span>
              </a>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{STORE_CONTACT.operatingHours}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">
              {/* Instagram */}
              <a
                href={STORE_CONTACT.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center text-slate-400 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={STORE_CONTACT.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center text-slate-400 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.57 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href={STORE_CONTACT.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500 hover:text-blue-400 flex items-center justify-center text-slate-400 transition-all"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <p className="font-bold text-xs uppercase tracking-widest text-slate-200 mb-4">
              Catalog
            </p>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/shop?category=custom-skins" className="hover:text-white transition-colors">
                  Custom Mobile Skins
                </Link>
              </li>
              <li>
                <Link href="/shop?category=photo-skins" className="hover:text-white transition-colors">
                  Personalised Photo Skins
                </Link>
              </li>
              <li>
                <Link href="/shop?category=anime-skins" className="hover:text-white transition-colors">
                  Anime & Manga Skins
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tempered-glass" className="hover:text-white transition-colors">
                  Unbreakable Glass (₹99)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-white transition-colors">
                  GaN Chargers & Cables
                </Link>
              </li>
              <li>
                <Link href="/custom-studio" className="hover:text-white transition-colors text-blue-400 font-semibold">
                  Custom Skin Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Verified Store Branches */}
          <div>
            <p className="font-bold text-xs uppercase tracking-widest text-slate-200 mb-4">
              Store Locations
            </p>
            <div className="space-y-4 text-xs">
              {VERIFIED_LOCATIONS.map((loc) => (
                <div key={loc.id} className="border-l-2 border-blue-600 pl-3">
                  <p className="font-bold text-slate-200">{loc.name.split("—")[1] || loc.name}</p>
                  <p className="text-slate-400 mt-0.5">{loc.address}</p>
                  <p className="text-slate-500 text-[11px]">{loc.city}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Newsletter & Policies */}
          <div>
            <p className="font-bold text-xs uppercase tracking-widest text-slate-200 mb-4">
              Stay Connected
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Subscribe for new phone model skin drops and exclusive store offers.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {newsletterSubmitted && (
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Subscribed successfully!
                </p>
              )}
            </form>

            <div className="pt-6 space-y-2 text-xs text-slate-400">
              <Link href="/about" className="block hover:text-white transition-colors">
                About PHONEX Brand
              </Link>
              <Link href="/services" className="block hover:text-white transition-colors">
                Gadget Repair Services
              </Link>
              <Link href="/account" className="block hover:text-white transition-colors">
                Track Order Status
              </Link>
              <Link href="/admin" className="block hover:text-blue-400 font-medium transition-colors">
                Admin Management Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Legal Disclaimers */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 PHONEX — Sales | Services | Gadgets. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Verified Phone: 088075 74880</span>
            <span>•</span>
            <span>Tamil Nadu, India</span>
            <span>•</span>
            <span className="text-slate-400">Option B Clean Premium E-Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
