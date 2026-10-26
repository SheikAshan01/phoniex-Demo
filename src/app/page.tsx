"use client";

import React, { useState, useMemo } from "react";
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
  ShoppingBag,
  SlidersHorizontal,
  X,
  Filter,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/types";

export default function HomePage() {
  const { products } = useStore();

  // Active Catalog Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [priceFilter, setPriceFilter] = useState<"all" | "under-150" | "150-300" | "above-300">("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter out service items from physical store catalog
  const physicalProducts = useMemo(() => {
    return products.filter((p) => p.category !== "services");
  }, [products]);

  // Featured Products (Top 4 genuine physical items)
  const featuredProducts = useMemo(() => {
    return physicalProducts.filter((p) => p.isFeatured).slice(0, 4);
  }, [physicalProducts]);

  // All Products Filtered
  const filteredProducts = useMemo(() => {
    let result = [...physicalProducts];

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query
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

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [physicalProducts, selectedCategory, searchQuery, priceFilter, sortBy]);

  const categories = [
    {
      id: "custom-skins",
      name: "Custom Mobile Skins",
      count: "From ₹149",
      image: "/images/hero-skin-showcase.jpg",
      description: "0.15mm laser-cut 3M vinyl for 500+ phones",
    },
    {
      id: "tempered-glass",
      name: "Tempered Glass",
      count: "Offer ₹99",
      image: "/images/tempered-glass-promo.jpg",
      description: "Unbreakable 9H flexible hybrid glass",
    },
    {
      id: "photo-skins",
      name: "Personalised Photo Skins",
      count: "From ₹199",
      image: "/images/photo-skin-design.jpg",
      description: "1200 DPI archival custom memories",
    },
    {
      id: "anime-skins",
      name: "Anime & Graphic Skins",
      count: "From ₹149",
      image: "/images/anime-skin-design.jpg",
      description: "Straw Hat & Manga edition wraps",
    },
    {
      id: "accessories",
      name: "Fast Chargers & Cables",
      count: "From ₹249",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      description: "65W GaN power adapters & 100W cables",
    },
  ];

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceFilter("all");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/40 text-slate-900">
      {/* 1. COMPACT SHOPPING HERO */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Unbreakable Tempered Glass from ₹99 • Genuine 3M Vinyl</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Make Your Phone{" "}
                <span className="text-blue-600 block sm:inline">Unmistakably Yours.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Explore custom mobile skins, personalised designs, and everyday mobile essentials.
                Engineered with 3M automotive vinyl and ultra-thin 0.15mm precision for over 500+ smartphones.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/shop"
                  className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/custom-studio"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all border border-slate-200 flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Create Your Custom Skin</span>
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                <Image
                  src="/images/hero-skin-showcase.jpg"
                  alt="PHONEX Precision Custom Mobile Skin"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 360px"
                />
                <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">3M Cast Vinyl Skins</p>
                    <p className="text-[11px] text-slate-500">Zero residue removal</p>
                  </div>
                  <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    From ₹149
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY (Simple tiles with clear labels) */}
      <section className="py-12 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select a category to filter the store catalog
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  const el = document.getElementById("all-products");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                  selectedCategory === cat.id
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                }`}
              >
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="200px" />
                  <span className="absolute top-1.5 right-1.5 bg-slate-900/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (Clean product grid from actual catalog) */}
      <section className="py-12 border-b border-slate-200 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Top customer favorites ready for same-day dispatch
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All Products &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. ALL PRODUCTS (Complete catalog, search, filter, sort) */}
      <section id="all-products" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Controls: Search, Filter, Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                All Products
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredProducts.length} items ready to order
              </p>
            </div>

            {/* Search Input & Sort Options */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
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

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-300 text-slate-700 bg-slate-50 text-xs font-bold flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills (Desktop & Tablet) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex-shrink-0 border ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              All ({physicalProducts.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex-shrink-0 border ${
                  selectedCategory === c.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {c.name}
              </button>
            ))}

            {/* Clear filter chip */}
            {(selectedCategory !== "all" || searchQuery || priceFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 font-bold px-2.5 py-1 hover:underline flex-shrink-0"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Mobile Filter Dropdown Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden p-4 mb-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-xs text-slate-900 uppercase">Filters</span>
                <button onClick={clearFilters} className="text-xs text-blue-600 font-bold">
                  Clear All
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Price Filter</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-150", label: "Under ₹150" },
                    { id: "150-300", label: "₹150 to ₹300" },
                    { id: "above-300", label: "Above ₹300" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriceFilter(p.id as any)}
                      className={`p-2 rounded-lg border text-left font-semibold ${
                        priceFilter === p.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No products match your criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting your search query or category filter</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
