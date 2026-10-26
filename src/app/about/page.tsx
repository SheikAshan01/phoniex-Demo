"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
  Truck,
  RotateCcw,
} from "lucide-react";
import { VERIFIED_LOCATIONS, STORE_CONTACT } from "@/data/locations";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
              <span>About PHONEX</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Crafting The Perfect Second Skin For Your Smartphone.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              PHONEX — Sales | Services | Gadgets was established to give smartphone owners a clean, millimeter-exact aesthetic without compromising ergonomics or phone protection.
            </p>
          </div>

          {/* Genuine Assets Showcase */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">500+ Phone Chassis</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Every cutout is verified on actual phone hardware for zero camera, sensor, or logo misalignment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">3M Cast Vinyl Standards</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We use genuine automotive cast vinyl with air-release channels for 100% bubble-free fit and zero residue.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">₹99 Unbreakable Shield</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Our signature hybrid ceramic glass protector guarantees edge impact resistance at honest pricing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Store Hubs */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Our Retail & Service Outlets
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Visit us in person across Tamil Nadu for on-the-spot laser cuts and device tuning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERIFIED_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{loc.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold mb-2">{loc.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-1">{loc.address}</p>
                  <p className="text-xs text-slate-500">{loc.city}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={`tel:${loc.phone}`}
                    className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{loc.phone}</span>
                  </a>
                  <span className="text-slate-400">{loc.hours.split("(")[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Store Policies: Shipping, Returns & Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Shipping Policy */}
          <div id="shipping" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between scroll-mt-24">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-2">Shipping Policy</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Orders above <strong>₹499</strong> qualify for <strong>Free Delivery</strong>. A nominal ₹49 fee applies for orders under ₹499.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                <li>Dispatched within 24 hours from Tamil Nadu hubs</li>
                <li>2 to 4 business days across Tamil Nadu</li>
                <li>4 to 6 business days for rest of India</li>
                <li>Real-time tracking updates via SMS & Account</li>
              </ul>
            </div>
          </div>

          {/* 7-Day Replacement Guarantee */}
          <div id="returns" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between scroll-mt-24">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-2">7-Day Replacement Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                We stand behind our precision cuts. If your skin does not fit your model accurately or arrives damaged, we replace it free of charge.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                <li>Hassle-free replacement within 7 days of delivery</li>
                <li>Zero return shipping fees for defective items</li>
                <li>Instant walk-in replacement at our 3 store outlets</li>
              </ul>
            </div>
          </div>

          {/* Customer Privacy & Security */}
          <div id="privacy" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between scroll-mt-24">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-2">Privacy & Transparency</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Your personal information is strictly confidential. We never sell customer records or send unsolicited promotional marketing.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                <li>Contact details used solely for order fulfilment</li>
                <li>Uploaded custom photos auto-deleted after laser cutting</li>
                <li>Secure payment processing via standard Indian gateways</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <div id="contact" className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Have a Question or Custom Requirement?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2 mb-6">
            Call us directly at <strong>{STORE_CONTACT.phone}</strong> or email <strong>{STORE_CONTACT.email}</strong>. Our Coimbatore & Annur teams are ready to help.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${STORE_CONTACT.phone}`}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-colors shadow-md"
            >
              Call Store: {STORE_CONTACT.phone}
            </a>
            <Link
              href="/shop"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-colors border border-white/20"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
