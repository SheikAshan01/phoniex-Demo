"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Scissors,
  ShieldCheck,
  Smartphone,
  PhoneCall,
  CheckCircle,
  Clock,
  MapPin,
  Flame,
  ArrowRight,
} from "lucide-react";
import { VERIFIED_LOCATIONS, STORE_CONTACT } from "@/data/locations";

export default function ServicesPage() {
  const services = [
    {
      id: "skin-application",
      title: "Precision Laser Skin Cutting & Heat Application",
      price: "From ₹49",
      time: "5 - 10 Minutes",
      desc: "Instant laser cut for any of 500+ phone models using Japanese Plotter technology. Heat-activated corner mold prevents edge peeling.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      features: [
        "0.01mm precise laser cutting",
        "Heat gun curved edge wrapping",
        "Zero air bubbles guarantee",
        "100% clean residue-free removal",
      ],
    },
    {
      id: "glass-fitting",
      title: "Unbreakable 9H Tempered Glass Installation",
      price: "Verified Promo ₹99",
      time: "3 Minutes",
      desc: "Dust-free screen clean and professional alignment of unbreakable flexible hybrid PMMA tempered shield.",
      image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
      features: [
        "Special ₹99 promotional price",
        "Never shatters or chips at the borders",
        "Full adhesive with zero rainbow distortion",
        "Touch sensitivity & fingerprint unlock tested",
      ],
    },
    {
      id: "screen-oca",
      title: "Broken Screen Glass & OCA Vacuum Lamination",
      price: "Consultation / ₹999",
      time: "Same Day / 24h",
      desc: "Restore broken outer glass while preserving your genuine original factory AMOLED or LCD display, saving up to 60%.",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      features: [
        "Preserves 100% genuine factory display panel",
        "Industrial cleanroom vacuum debubbler",
        "3-month service warranty included",
        "Available at Coimbatore and Annur stores",
      ],
    },
    {
      id: "battery-tuneup",
      title: "OEM Battery Health Replacement & Device Service",
      price: "From ₹799",
      time: "30 - 45 Minutes",
      desc: "Revive drained battery life with high-capacity OEM safety-tested cells. Includes full device port cleaning.",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
      features: [
        "Grade-A Li-Polymer battery cells",
        "Speaker and charge port sonic cleaning",
        "Multi-point power cycle diagnostic check",
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Expert Mobile Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            PHONEX Store Services
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Professional mobile wraps, unbreakable screen protectors, and certified screen restoration across Coimbatore, Annur, and P. Puliam patti.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-6">
                  <Image src={srv.image} alt={srv.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 500px" />
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
                    {srv.price}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Duration: {srv.time}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2">{srv.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {srv.desc}
                </p>

                <div className="space-y-2 mb-6">
                  {srv.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${STORE_CONTACT.phone}`}
                  className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call to Book ({STORE_CONTACT.phone})</span>
                </a>
                <span className="text-xs text-slate-400 font-medium">Walk-ins Welcome</span>
              </div>
            </div>
          ))}
        </div>

        {/* Store Hubs Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs">
          <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
            Service Locations & Workstations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERIFIED_LOCATIONS.map((loc) => (
              <div key={loc.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <MapPin className="w-5 h-5 text-blue-600 mb-2" />
                <h4 className="font-extrabold text-slate-900 text-sm">{loc.name}</h4>
                <p className="text-xs text-slate-600 mt-1">{loc.address}</p>
                <p className="text-xs text-slate-500">{loc.city}</p>
                <p className="text-xs font-bold text-blue-600 mt-3">Phone: {loc.phone}</p>
                <p className="text-[11px] text-slate-400 mt-1">Hours: {loc.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
