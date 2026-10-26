"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { STORE_CONTACT, VERIFIED_LOCATIONS } from "@/data/locations";

export function Footer() {
  const pathname = usePathname();

  // Do not render public customer footer in the admin dashboard section
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      {/* 1. Essential Shopping Guarantees Strip */}
      <div className="border-b border-slate-100 py-6 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Free Express Delivery</p>
              <p className="text-[11px] text-slate-500">On all orders above ₹499</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Genuine 3M Vinyl</p>
              <p className="text-[11px] text-slate-500">100% Residue-free removal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900">7-Day Replacement</p>
              <p className="text-[11px] text-slate-500">Guaranteed fit or replacement</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900">3 Physical Hubs</p>
              <p className="text-[11px] text-slate-500">Coimbatore • Annur • Pulampatti</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Minimal Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white border border-slate-200 flex-shrink-0 shadow-2xs">
                <Image
                  src="/images/phonex-badge.png"
                  alt="PHONEX"
                  fill
                  sizes="36px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-slate-900 leading-none">PHONEX</span>
                <span className="text-[9px] tracking-widest uppercase block text-blue-600 font-bold mt-0.5">
                  Sales • Services • Gadgets
                </span>
              </div>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              Precision 3M mobile skins, ₹99 unbreakable tempered glass, and genuine smartphone accessories engineered for 500+ phone models.
            </p>
          </div>

          {/* Col 2: Essential Shopping Links */}
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Shop Categories
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/shop?category=custom-skins" className="hover:text-blue-600 transition-colors">
                  Custom Mobile Skins (3M Vinyl)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tempered-glass" className="hover:text-blue-600 transition-colors">
                  Unbreakable Tempered Glass (₹99)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=photo-skins" className="hover:text-blue-600 transition-colors">
                  Personalised Photo Skins
                </Link>
              </li>
              <li>
                <Link href="/shop?category=anime-skins" className="hover:text-blue-600 transition-colors">
                  Anime & Manga Skins
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-blue-600 transition-colors">
                  Fast Chargers & 100W Cables
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Customer Care
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/account" className="hover:text-blue-600 transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/custom-studio" className="hover:text-blue-600 transition-colors">
                  Custom Skin Studio
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600 transition-colors">
                  Store Locations & Repairs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About PHONEX Brand
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-600 transition-colors font-medium">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact */}
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Store Support
            </p>
            <div className="space-y-2 text-slate-600">
              <a
                href={`tel:${STORE_CONTACT.phone}`}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="font-semibold">{STORE_CONTACT.phone}</span>
              </a>
              <a
                href={`mailto:${STORE_CONTACT.email}`}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>{STORE_CONTACT.email}</span>
              </a>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>{STORE_CONTACT.operatingHours}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Physical Hubs: Gandhipuram, Coimbatore • Annur Main Rd • P. Puliam patti
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© 2026 PHONEX — Sales | Services | Gadgets. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Free Shipping above ₹499</span>
            <span>•</span>
            <span>3M Automotive Cast Vinyl</span>
            <span>•</span>
            <span>Tamil Nadu, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
