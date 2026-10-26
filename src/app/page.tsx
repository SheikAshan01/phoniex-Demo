"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Search,
  Check,
  Zap,
  Flame,
  ShoppingBag,
  Tag,
  PhoneCall,
  MapPin,
  Clock,
  Star,
  SlidersHorizontal,
  ChevronLeft,
  Filter,
  X,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { ProductCard } from "@/components/product-card";
import { ShinyText } from "@/components/react-bits/ShinyText";
import { POPULAR_PHONE_MODELS, SKIN_FINISHES } from "@/data/products";
import { SkinFinish, ProductCategory } from "@/types";

export default function HomePage() {
  const { products, addToCart, showToast } = useStore();

  // Active Catalog Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [priceFilter, setPriceFilter] = useState<"all" | "under-150" | "150-300" | "above-300">("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Flipkart Banner Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mini configurator state
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

  // Auto slide carousel every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
    showToast(`Added ${configModel} (${skinPresets[configPreset].name}) to Bag!`, "success", skinPresets[configPreset].image);
    setTimeout(() => setIsConfigAdding(false), 800);
  };

  // Instant Filtered Products for Live Shopping
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Price Filter
    if (priceFilter === "under-150") {
      result = result.filter((p) => p.price <= 149);
    } else if (priceFilter === "150-300") {
      result = result.filter((p) => p.price >= 150 && p.price <= 300);
    } else if (priceFilter === "above-300") {
      result = result.filter((p) => p.price > 300);
    }

    // Min Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // In Stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceFilter, minRating, inStockOnly, sortBy]);

  const flipkartCategories = [
    { id: "all", label: "All Mobiles & Skins", icon: Smartphone, count: products.length },
    { id: "tempered-glass", label: "9H Glass ₹99", icon: Shield, tag: "Deal" },
    { id: "custom-skins", label: "3M Custom Skins", icon: Sparkles, tag: "₹149" },
    { id: "photo-skins", label: "Photo Wraps", icon: Tag, tag: "Upload" },
    { id: "anime-skins", label: "Anime Manga", icon: Zap, tag: "Hot" },
    { id: "accessories", label: "Fast Chargers", icon: ShoppingBag, tag: "65W" },
    { id: "services", label: "Store Repairs", icon: CheckCircle, tag: "₹49" },
  ];

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceFilter("all");
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100/60 pb-16">
      {/* 1. FLIPKART-STYLE TOP CATEGORY NAVIGATION BAR */}
      <section className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-1">
            {flipkartCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center flex-shrink-0 group transition-all px-2 ${
                    isActive ? "scale-105" : "hover:scale-102"
                  }`}
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors mb-1.5 relative ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-slate-50 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 border border-slate-200/70"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    {cat.tag && (
                      <span className="absolute -top-1.5 -right-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-2xs">
                        {cat.tag}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold truncate max-w-[90px] text-center ${
                      isActive ? "text-blue-600" : "text-slate-700 group-hover:text-blue-600"
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. COMPACT FLIPKART PROMOTIONAL BANNER SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 w-full">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 text-white h-[230px] sm:h-[260px] md:h-[280px]">
          {/* Slide 1: Main Brand & Required Hero Texts for Test Compatibility */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out p-6 sm:p-10 flex flex-col justify-center ${
              currentSlide === 0 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-[11px] font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PHONEX Genuine Store • Unbreakable Tempered Glass from ₹99</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Make Your Phone{" "}
                <span className="text-blue-400 inline">Unmistakably Yours.</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl line-clamp-2">
                Explore custom mobile skins, personalised designs, and everyday mobile essentials.
                Engineered with 3M automotive vinyl for 500+ smartphones from ₹149.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/shop"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/custom-studio"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4 text-blue-300" />
                  <span>Create Your Custom Skin</span>
                </Link>
              </div>
            </div>

            {/* Right side floating phone preview */}
            <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <Image src="/images/hero-skin-showcase.jpg" alt="Hero Skin" fill className="object-cover" />
            </div>
          </div>

          {/* Slide 2: ₹99 Unbreakable Glass Special Deal */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out p-6 sm:p-10 flex flex-col justify-center bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 ${
              currentSlide === 1 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className="max-w-xl">
              <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider">
                Flipkart Mega Deal • 60% OFF
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
                Unbreakable 9H Hybrid Glass — ₹99
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Drop-tested PMMA flexible ceramic shield with full glue bubble-free installation for 500+ phones.
              </p>
              <div className="mt-4">
                <Link
                  href="/product/unbreakable-9h-tempered-glass"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Claim ₹99 Offer Now</span>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-52 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <Image src="/images/tempered-glass-promo.jpg" alt="₹99 Glass" fill className="object-cover" />
            </div>
          </div>

          {/* Slide 3: Personalised Photo Wraps */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out p-6 sm:p-10 flex flex-col justify-center bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 ${
              currentSlide === 2 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className="max-w-xl">
              <span className="bg-blue-500 text-white text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider">
                Personalised Studio
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
                Print Your Own Photos on 3M Vinyl
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Upload family portraits, couple photos, or custom anime artwork. 1200 DPI archival ink starting at ₹199.
              </p>
              <div className="mt-4">
                <Link
                  href="/product/personalised-photo-mobile-skin"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md inline-flex items-center gap-2"
                >
                  <span>Upload & Customise Skin</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <Image src="/images/photo-skin-design.jpg" alt="Photo Skin" fill className="object-cover" />
            </div>
          </div>

          {/* Slide Arrow Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs z-20"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs z-20"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? "w-6 bg-blue-500" : "w-1.5 bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLIPKART DEALS OF THE DAY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 w-full">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  Deals of the Day
                </h3>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded border border-rose-200">
                  Ends in 08h 24m
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Top rated mobile skins, unbreakable glass & 65W chargers at lowest prices
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory("tempered-glass");
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              ₹99 Glass Deal
            </button>
            <button
              onClick={() => {
                setSelectedCategory("custom-skins");
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              ₹149 Skins
            </button>
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              View All ({products.length})
            </button>
          </div>
        </div>
      </section>

      {/* 4. MAIN FLIPKART SHOPPING STOREFRONT (ALL PRODUCTS WITH FILTERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar Filter (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h2 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                  Filters
                </h2>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2.5">
                Categories
              </p>
              <div className="space-y-1.5 text-xs">
                {flipkartCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === c.id
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{c.label}</span>
                    {selectedCategory === c.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2.5">
                Price
              </p>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-150", label: "Under ₹150 (₹99 - ₹149)" },
                  { id: "150-300", label: "₹150 to ₹300" },
                  { id: "above-300", label: "Above ₹300" },
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceFilter === p.id}
                      onChange={() => setPriceFilter(p.id as any)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2.5">
                Customer Ratings
              </p>
              <div className="space-y-1.5 text-xs">
                {[4, 4.5, 0].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="text-blue-600"
                    />
                    <span>{rating === 0 ? "All Ratings" : `${rating}★ & above`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-9 space-y-4">
            {/* Search Bar & Sorting Header */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in all products (e.g. 65W, anime, photo, glass)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <span className="text-slate-500 font-semibold truncate">
                  {filteredProducts.length} Products
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label="Sort products"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="featured">Featured Deals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filter Chips Strip */}
            <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="font-bold text-slate-500 flex-shrink-0">Filters:</span>
              {flipkartCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full font-bold border transition-colors ${
                    selectedCategory === c.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Active Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">No products match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Try clearing your search query or reset category and price filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE WRAP STUDIO CONFIGURATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Interactive 3D Phone Customizer
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Customise Your Phone Skin Online
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select model, choose design, pick texture finish, and add directly to your bag.
              </p>
            </div>
            <Link
              href="/custom-studio"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Launch Full Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200">
            {/* Phone Visual Live Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-56 sm:w-64 aspect-[3/4] rounded-3xl bg-slate-900 p-2 shadow-xl border border-slate-300 overflow-hidden">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src={skinPresets[configPreset].image}
                    alt={skinPresets[configPreset].name}
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="260px"
                  />
                  <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl text-white text-center border border-white/10 shadow-lg">
                    <p className="text-[11px] font-bold truncate">{configModel}</p>
                    <p className="text-[10px] text-blue-400 font-medium">{configFinish}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Configurator Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                  1. Phone Model (500+ Supported)
                </label>
                <select
                  value={configModel}
                  onChange={(e) => setConfigModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
                >
                  {POPULAR_PHONE_MODELS.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                  2. Design Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 mb-1.5">
                        <Image src={preset.image} alt={preset.name} fill className="object-cover" sizes="100px" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">{preset.name}</p>
                      <p className="text-[11px] text-blue-600 font-bold">₹{preset.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                  3. Tactile Texture Finish
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SKIN_FINISHES.map((finish) => (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setConfigFinish(finish)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        configFinish === finish
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Configured Price:</span>
                  <div className="text-xl font-black text-slate-900">
                    ₹{skinPresets[configPreset].price}
                  </div>
                </div>

                <button
                  onClick={handleConfiguratorAddToCart}
                  disabled={isConfigAdding}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  {isConfigAdding ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Add Configured Skin to Bag</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FLIPKART E-COMMERCE ASSURANCE STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Free Express Delivery</p>
              <p className="text-[11px] text-slate-500">Orders above ₹499</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Genuine 3M Vinyl</p>
              <p className="text-[11px] text-slate-500">Zero sticky residue</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">7-Day Replacement</p>
              <p className="text-[11px] text-slate-500">Hassle-free guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">WhatsApp Helpdesk</p>
              <p className="text-[11px] text-slate-500">+91 88075 74880</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
