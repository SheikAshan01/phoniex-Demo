"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { ProductCard } from "@/components/product-card";
import { ProductCategory, Product } from "@/types";
import { POPULAR_PHONE_MODELS } from "@/data/products";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products } = useStore();

  const categoryParam = (searchParams.get("category") as ProductCategory) || "all";
  const searchParam = searchParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState<ProductCategory>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync category state if URL parameter changes
  React.useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  React.useEffect(() => {
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParam]);

  const categories: { id: ProductCategory; label: string; count: number }[] = [
    { id: "all", label: "All Items", count: products.length },
    {
      id: "custom-skins",
      label: "Custom Mobile Skins",
      count: products.filter((p) => p.category === "custom-skins").length,
    },
    {
      id: "photo-skins",
      label: "Personalised Photo Skins",
      count: products.filter((p) => p.category === "photo-skins").length,
    },
    {
      id: "anime-skins",
      label: "Anime & Graphic Skins",
      count: products.filter((p) => p.category === "anime-skins").length,
    },
    {
      id: "tempered-glass",
      label: "Tempered Glass (₹99)",
      count: products.filter((p) => p.category === "tempered-glass").length,
    },
    {
      id: "accessories",
      label: "Chargers & Audio",
      count: products.filter((p) => p.category === "accessories").length,
    },
    {
      id: "services",
      label: "Gadget Services",
      count: products.filter((p) => p.category === "services").length,
    },
  ];

  const brandOptions = [
    { id: "all", label: "All Devices" },
    { id: "Apple", label: "Apple iPhone" },
    { id: "Samsung", label: "Samsung Galaxy" },
    { id: "OnePlus", label: "OnePlus" },
    { id: "Google", label: "Google Pixel" },
    { id: "Xiaomi", label: "Xiaomi / Poco" },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (activeCategory !== "all" && product.category !== activeCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesCategory = product.categoryName.toLowerCase().includes(query);
          const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));
          const matchesDesc = product.description.toLowerCase().includes(query);
          if (!matchesName && !matchesCategory && !matchesTags && !matchesDesc) {
            return false;
          }
        }

        // Max price filter
        if (product.price > maxPrice) {
          return false;
        }

        // Brand compatibility filter
        if (selectedBrand !== "all") {
          if (
            product.supportedModels &&
            !product.supportedModels.some((m) => m.toLowerCase().includes(selectedBrand.toLowerCase()))
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0; // default featured
      });
  }, [products, activeCategory, searchQuery, maxPrice, selectedBrand, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedBrand("all");
    setMaxPrice(1500);
    setSortBy("featured");
    router.push("/shop");
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    searchQuery.trim() !== "" ||
    selectedBrand !== "all" ||
    maxPrice < 1500 ||
    sortBy !== "featured";

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
            <span onClick={() => router.push("/")} className="hover:text-slate-900 cursor-pointer">
              Home
            </span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Shop Collection</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Store Catalog
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Showing {filteredProducts.length} verified products available for instant dispatch or in-store pickup.
              </p>
            </div>

            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-900 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters & Sort ({filteredProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              {/* Header with Reset */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span>Filter Products</span>
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Search Within Catalog */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, specs..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeCategory === cat.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          activeCategory === cat.id
                            ? "bg-blue-600 text-white font-bold"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Device Model / Brand Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Device Compatibility
                </label>
                <div className="space-y-1">
                  {brandOptions.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedBrand === brand.id
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {brand.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wide">
                    Max Price
                  </span>
                  <span className="font-extrabold text-blue-600">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="99"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹99</span>
                  <span>₹750</span>
                  <span>₹1,500</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Product Browsing Grid */}
          <main className="lg:col-span-3">
            {/* Top Bar: Sort and Active Pills */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-500 font-medium">Applied:</span>
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-semibold">
                    {categories.find((c) => c.id === activeCategory)?.label}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-500"
                      onClick={() => setActiveCategory("all")}
                    />
                  </span>
                )}
                {selectedBrand !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-semibold">
                    {brandOptions.find((b) => b.id === selectedBrand)?.label}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-500"
                      onClick={() => setSelectedBrand("all")}
                    />
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-semibold">
                    &quot;{searchQuery}&quot;
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-500"
                      onClick={() => setSearchQuery("")}
                    />
                  </span>
                )}
                {!hasActiveFilters && (
                  <span className="text-slate-400 text-xs">All items showing</span>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="featured">Featured / Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Product Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-1">
                  No matching products found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any items matching your current filters. Try resetting your search or price range.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 z-10 ml-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-base text-slate-900">Filters & Sort</span>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Category
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setIsFilterDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                        activeCategory === cat.id
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-700"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span>({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Device Brand
                </p>
                <div className="space-y-1">
                  {brandOptions.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrand(brand.id);
                        setIsFilterDrawerOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedBrand === brand.id
                          ? "bg-slate-900 text-white font-bold"
                          : "text-slate-700"
                      }`}
                    >
                      {brand.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                  <span>Max Price</span>
                  <span className="text-blue-600">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="99"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 text-xs font-bold rounded-xl border border-slate-200 text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 text-xs font-bold rounded-xl bg-blue-600 text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Loading catalog...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
