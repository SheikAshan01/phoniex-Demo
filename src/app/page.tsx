"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Sparkles,
  Smartphone,
  ChevronRight,
  CheckCircle,
  Truck,
  RotateCcw,
  Sliders,
  Layers,
  MapPin,
  ExternalLink,
  PhoneCall,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/context/store-context";
import { ProductCard } from "@/components/product-card";
import { DecryptedText } from "@/components/react-bits/DecryptedText";
import { ShinyText } from "@/components/react-bits/ShinyText";
import { CountUp } from "@/components/react-bits/CountUp";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { HeroStorySequence } from "@/components/gsap/HeroStorySequence";
import { POPULAR_PHONE_MODELS, SKIN_FINISHES } from "@/data/products";
import { VERIFIED_LOCATIONS, STORE_CONTACT } from "@/data/locations";
import { SkinFinish } from "@/types";

export default function HomePage() {
  const { products, addToCart } = useStore();

  // Mini configurator state for the Customisation Showcase
  const [configModel, setConfigModel] = useState<string>("Apple iPhone 16 Pro");
  const [configFinish, setConfigFinish] = useState<SkinFinish>("Matte Soft-Touch");
  const [configPreset, setConfigPreset] = useState<number>(0);
  const [isConfigAdding, setIsConfigAdding] = useState<boolean>(false);

  const skinPresets = [
    {
      name: "Cyber Carbon Matrix",
      image: "/images/hero-skin-showcase.jpg",
      accent: "#2563eb",
      price: 149,
    },
    {
      name: "Forged Carbon Fiber",
      image: "/images/carbon-skin-design.jpg",
      accent: "#0f172a",
      price: 149,
    },
    {
      name: "Straw Hat Anime Manga",
      image: "/images/anime-skin-design.jpg",
      accent: "#e11d48",
      price: 149,
    },
    {
      name: "Personalised Photo Wrap",
      image: "/images/photo-skin-design.jpg",
      accent: "#059669",
      price: 199,
    },
  ];

  const handleConfiguratorAddToCart = () => {
    const targetProduct =
      products.find((p) => p.slug === "customised-mobile-skin") || products[0];

    setIsConfigAdding(true);
    addToCart(targetProduct, {
      selectedModel: configModel,
      selectedFinish: configFinish,
      customText: skinPresets[configPreset].name,
      quantity: 1,
    });
    setTimeout(() => setIsConfigAdding(false), 800);
  };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const categories = [
    {
      id: "custom-skins",
      title: "Custom Mobile Skins",
      subtitle: "Laser-cut 3M Vinyl for 500+ Models",
      priceTag: "From ₹149",
      image: "/images/hero-skin-showcase.jpg",
      href: "/shop?category=custom-skins",
    },
    {
      id: "photo-skins",
      title: "Personalised Photo Skins",
      subtitle: "High-Res 1200 DPI Custom Memories",
      priceTag: "From ₹199",
      image: "/images/photo-skin-design.jpg",
      href: "/shop?category=photo-skins",
    },
    {
      id: "anime-skins",
      title: "Anime & Graphic Skins",
      subtitle: "Straw Hat, Shinobi & Cyberpunk",
      priceTag: "From ₹149",
      image: "/images/anime-skin-design.jpg",
      href: "/shop?category=anime-skins",
    },
    {
      id: "tempered-glass",
      title: "Tempered Glass & Protectors",
      subtitle: "Unbreakable 9H Hybrid Ceramic Shield",
      priceTag: "Verified Deal ₹99",
      image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
      href: "/shop?category=tempered-glass",
      highlight: true,
    },
    {
      id: "accessories",
      title: "Chargers & Audio",
      subtitle: "65W GaN Fast Adapters & Cables",
      priceTag: "From ₹249",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      href: "/shop?category=accessories",
    },
    {
      id: "services",
      title: "Store Repairs & Services",
      subtitle: "OCA Screen Glass & Laser Fitting",
      priceTag: "From ₹49",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      href: "/services",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION — Clean Premium Editorial */}
      <section className="relative bg-white pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
              {/* Verified Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/80 mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900">PHONEX Genuine Store</span>
                <span className="text-slate-400">•</span>
                <ShinyText text="Unbreakable Glass ₹99 • Mobile Skins ₹149" speed={3.5} className="font-semibold" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
                Make Your Phone{" "}
                <span className="text-blue-600 block mt-1">
                  <DecryptedText text="Unmistakably Yours." speed={50} maxIterations={12} />
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
                Explore custom mobile skins, personalised designs, and everyday mobile essentials.
                Engineered with 3M automotive vinyl and ultra-thin 0.15mm precision for over 500+ smartphones.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm px-7 py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/custom-studio"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm px-6 py-4 rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Create Your Custom Skin</span>
                </Link>
              </div>

              {/* Trust Metrics with CountUp */}
              <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-3 gap-6 sm:gap-10 w-full max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    <CountUp to={500} suffix="+" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Phone Models</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600">
                    ₹<CountUp to={99} />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Unbreakable Glass</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    <CountUp to={3} /> Stores
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">TN Physical Hubs</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              {/* Ambient backdrop glow */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-100/60 blur-3xl -z-10" />

              {/* Editorial Phone Mockup with Luxury 3D Skin Showcase */}
              <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group">
                <Image
                  src="/images/hero-skin-showcase.jpg"
                  alt="PHONEX Precision Custom Mobile Skin"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 90vw, 450px"
                />
                {/* Subtle glass reflection highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-white/10 pointer-events-none" />

                {/* Floating Verified Offer Tag */}
                <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Custom Fit Laser Wrap</p>
                      <p className="text-[11px] text-slate-500">Bubble-Free 3M Cast Vinyl</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    From ₹149
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TILES SECTION */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Browse By Category
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Explore The Catalog
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 group transition-colors"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {cat.priceTag}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-600">
                  <span>Explore items</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Handcrafted Selection
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                Featured Essentials
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 group transition-colors"
            >
              <span>See Full Range ({products.length} Items)</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED PROMOTIONAL SHOWCASE (Instagram Verified Deal: ₹99 Unbreakable Glass) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Offer Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <ShinyText text="Verified Instagram Promo Deal" speed={3} className="text-blue-700 font-bold" />
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                    Unbreakable 9H Hybrid Glass Protection
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xl">
                    Engineered with flexible PMMA composite that absorbs high drops without chipping or shattering. 99.9% optical transparency with full-glue bubble-free alignment.
                  </p>
                </div>

                {/* Price Callout */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-baseline gap-4 w-fit">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-blue-600">₹99</span>
                    <span className="text-base text-slate-400 line-through font-semibold">MRP ₹249</span>
                  </div>
                  <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-2xs">
                    Save 60%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Inclusive of all taxes</span>
                </div>

                {/* Key Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Free In-Store Fit at Coimbatore / Annur</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Guaranteed Zero Edge Chipping</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>500+ Phone Models Supported</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Oleophobic Anti-Smudge Coating</span>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/product/unbreakable-9h-tempered-glass"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-7 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 group"
                  >
                    <span>Claim ₹99 Glass Deal</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/shop?category=tempered-glass"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3.5 px-6 rounded-xl transition-colors border border-slate-200/80"
                  >
                    Explore All Protectors
                  </Link>
                </div>
              </div>

              {/* Right Column: Editorial Product Imagery */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl group">
                  <Image
                    src="/images/tempered-glass-promo.jpg"
                    alt="PHONEX Unbreakable 9H Hybrid Glass Laser Alignment"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900">Laser Guide Installation</p>
                      <p className="text-[11px] text-slate-500">Zero Dust • Zero Air Bubbles</p>
                    </div>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Special ₹99
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE CUSTOMISATION SHOWCASE */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Interactive Design Studio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Configure Your Custom Wrap
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select your smartphone model, pick a design preset, choose your tactile texture, and add directly to your bag.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
            {/* Visual Live Phone Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-3xl bg-slate-900 p-2 shadow-2xl border border-slate-300 ring-4 ring-slate-200/50 overflow-hidden">
                {/* Phone screen/back wrap */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src={skinPresets[configPreset].image}
                    alt={skinPresets[configPreset].name}
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="300px"
                  />

                  {/* Dynamic badge on preview */}
                  <div className="absolute bottom-4 inset-x-4 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl text-white text-center border border-white/10 shadow-lg">
                    <p className="text-[11px] font-bold truncate">{configModel}</p>
                    <p className="text-[10px] text-blue-400 font-medium">{configFinish}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Configurator Controls */}
            <div className="lg:col-span-6 space-y-6">
              {/* Step 1: Select Model */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  1. Choose Phone Model
                </label>
                <select
                  value={configModel}
                  onChange={(e) => setConfigModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                >
                  {POPULAR_PHONE_MODELS.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Choose Design Preset */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  2. Choose Design
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {skinPresets.map((preset, idx) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setConfigPreset(idx)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        configPreset === idx
                          ? "bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-xs"
                          : "bg-white/80 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 mb-2">
                        <Image src={preset.image} alt={preset.name} fill className="object-cover" sizes="120px" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">{preset.name}</p>
                      <p className="text-[11px] text-blue-600 font-semibold">₹{preset.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Choose Texture / Finish */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  3. Select Tactile Finish
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKIN_FINISHES.map((finish) => (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setConfigFinish(finish)}
                      className={`text-xs px-3.5 py-2 rounded-xl font-bold border transition-all ${
                        configFinish === finish
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary & Add to Cart Action */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Configured Total:</span>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{skinPresets[configPreset].price}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleConfiguratorAddToCart}
                    disabled={isConfigAdding}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isConfigAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>Add Configured Skin</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/custom-studio"
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600 underline underline-offset-4"
                  >
                    Open Studio &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GSAP SCROLLTRIGGER STORYTELLING SEQUENCE */}
      <HeroStorySequence />

      {/* 7. VERIFIED STORE LOCATIONS & WALK-IN SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Visit Us Locally
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Store Locations in Tamil Nadu
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Walk into any of our genuine physical outlets for instant skin application, ₹99 screen protectors, and phone care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERIFIED_LOCATIONS.map((loc) => (
              <SpotlightCard key={loc.id} className="flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{loc.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold mb-3">{loc.tagline}</p>

                  <p className="text-sm text-slate-700 font-medium leading-relaxed mb-1">
                    {loc.address}
                  </p>
                  <p className="text-xs text-slate-500 mb-4">{loc.city}</p>

                  <div className="pt-4 border-t border-slate-100 space-y-1.5 mb-6">
                    <p className="text-xs font-bold text-slate-900 mb-2">Available In-Store:</p>
                    {loc.servicesOffered.map((srv, idx) => (
                      <p key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                        <span>{srv}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${loc.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Store</span>
                  </a>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Open Today
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
