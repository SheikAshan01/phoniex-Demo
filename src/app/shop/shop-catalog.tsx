"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Smartphone,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Check,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { ProductCard } from "@/components/product-card";
import { ProductCategory, Product } from "@/types";
import { POPULAR_PHONE_MODELS } from "@/data/products";

interface InitialParams {
  category?: string;
  q?: string;
  sort?: string;
  brand?: string;
}

// Normalize incoming category strings to official ProductCategory
export const normalizeCategory = (cat?: string): ProductCategory | "all" => {
  if (!cat) return "all";
  const lower = cat.toLowerCase().trim();
  if (lower === "all") return "all";
  if (lower === "tempered-glass" || lower === "tempered" || lower === "glass") return "tempered-glass";
  if (lower === "accessories" || lower === "chargers" || lower === "audio" || lower === "cables") return "accessories";
  if (lower === "custom-skins" || lower === "skins" || lower === "skin") return "custom-skins";
  if (lower === "photo-skins" || lower === "photo") return "photo-skins";
  if (lower === "anime-skins" || lower === "anime" || lower === "manga") return "anime-skins";
  if (lower === "services" || lower === "repairs") return "services";
  return lower as ProductCategory;
};

export function ShopCatalog({ initialParams }: { initialParams?: InitialParams }) {
  const router = useRouter();
  const { products } = useStore();

  const initialCat = normalizeCategory(initialParams?.category);
  const initialQ = initialParams?.q || "";
  const initialSort = initialParams?.sort || "featured";
  const initialBrand = initialParams?.brand || "all";

  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state if initialParams prop changes (e.g., from server navigation)
  useEffect(() => {
    if (initialParams?.category !== undefined) {
      setActiveCategory(normalizeCategory(initialParams.category));
    }
  }, [initialParams?.category]);

  useEffect(() => {
    if (initialParams?.q !== undefined) {
      setSearchQuery(initialParams.q);
    }
  }, [initialParams?.q]);

  // Handle browser back and forward button navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      setActiveCategory(normalizeCategory(currentParams.get("category") || "all"));
      setSearchQuery(currentParams.get("q") || "");
      setSortBy(currentParams.get("sort") || "featured");
      setSelectedBrand(currentParams.get("brand") || "all");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update browser URL query string without a jarring page reload
  const updateUrl = (newCategory: ProductCategory | "all", newQuery: string, newSort: string, newBrand: string) => {
    const params = new URLSearchParams();
    if (newCategory !== "all") params.set("category", newCategory);
    if (newQuery.trim()) params.set("q", newQuery.trim());
    if (newSort !== "featured") params.set("sort", newSort);
    if (newBrand !== "all") params.set("brand", newBrand);

    const queryString = params.toString();
    const targetUrl = queryString ? `/shop?${queryString}` : "/shop";
    router.push(targetUrl, { scroll: false });
  };

  const handleSelectCategory = (catId: ProductCategory | "all") => {
    setActiveCategory(catId);
    updateUrl(catId, searchQuery, sortBy, selectedBrand);
    setIsFilterDrawerOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateUrl(activeCategory, query, sortBy, selectedBrand);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateUrl(activeCategory, searchQuery, sort, selectedBrand);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    updateUrl(activeCategory, searchQuery, sortBy, brand);
    setIsFilterDrawerOpen(false);
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedBrand("all");
    setMaxPrice(1500);
    setSortBy("featured");
    router.push("/shop");
    setIsFilterDrawerOpen(false);
  };

  // Defined Store Categories with exact counts
  const categories: { id: ProductCategory | "all"; label: string; count: number }[] = [
    { id: "all", label: "All Items", count: products.length },
    {
      id: "custom-skins",
      label: "Custom Mobile Skins",
      count: products.filter((p) => p.category === "custom-skins").length,
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

  // Check if current category is valid
  const isCategoryValid = activeCategory === "all" || categories.some((c) => c.id === activeCategory);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    if (!isCategoryValid) return [];

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
  }, [products, activeCategory, searchQuery, maxPrice, selectedBrand, sortBy, isCategoryValid]);

  const hasActiveFilters =
    activeCategory !== "all" ||
    searchQuery.trim() !== "" ||
    selectedBrand !== "all" ||
    maxPrice < 1500 ||
    sortBy !== "featured";

  return (
    <div className="bg-slate-50/50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Page Header */}
        <div className="mb-6 sm:mb-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Shop Collection</span>
            {activeCategory !== "all" && (
              <>
                <span>/</span>
                <span className="text-blue-600 font-bold capitalize">
                  {categories.find((c) => c.id === activeCategory)?.label || activeCategory}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Store Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Showing {filteredProducts.length} verified products available for instant dispatch or in-store pickup.
              </p>
            </div>

            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-900 shadow-xs active:scale-95 transition-all w-full sm:w-auto"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters & Sort ({filteredProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 mb-6 scrollbar-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90"
              }`}
            >
              <span>{cat.id === "tempered-glass" ? "Unbreakable Temper (₹99)" : cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Layout: Sidebar Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-5">
              
              {/* Header with Reset */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
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
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by name, specs..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories List */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeCategory === cat.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200/80 font-bold"
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
                      onClick={() => handleBrandChange(brand.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedBrand === brand.id
                          ? "bg-slate-900 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {brand.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wide">Max Price</span>
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

          {/* Main Product Grid Column */}
          <main className="lg:col-span-3">
            {/* Top Toolbar: Applied Filters + Sort */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-500 font-medium">Applied:</span>
                {activeCategory !== "all" && (
                  <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                    <span>{categories.find((c) => c.id === activeCategory)?.label || activeCategory}</span>
                    <button onClick={() => handleSelectCategory("all")}>
                      <X className="w-3 h-3 hover:text-blue-900" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                    <span>&quot;{searchQuery}&quot;</span>
                    <button onClick={() => handleSearchChange("")}>
                      <X className="w-3 h-3 hover:text-slate-900" />
                    </button>
                  </span>
                )}
                {selectedBrand !== "all" && (
                  <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                    <span>{selectedBrand}</span>
                    <button onClick={() => handleBrandChange("all")}>
                      <X className="w-3 h-3 hover:text-slate-900" />
                    </button>
                  </span>
                )}
                {!hasActiveFilters && (
                  <span className="text-slate-400 text-xs">All items showing</span>
                )}
              </div>

              {/* Sorting Select */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer"
                >
                  <option value="featured">Featured / Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Product Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Error or Empty Category State */}
            {!isCategoryValid ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">
                  Category &quot;{activeCategory}&quot; not found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The requested category is invalid or currently has no active products.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectCategory("all")}
                  className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Browse All Products
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No products matched your search "${searchQuery}".`
                    : "No products currently available with the selected filter criteria."}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer / Modal */}
        {isFilterDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filters & Sorting</span>
                </h3>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Category
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                        activeCategory === cat.id
                          ? "bg-blue-50 text-blue-600 font-bold border border-blue-200"
                          : "text-slate-700 hover:bg-slate-50"
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
                  Device Compatibility
                </p>
                <div className="space-y-1">
                  {brandOptions.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandChange(brand.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedBrand === brand.id
                          ? "bg-slate-900 text-white font-bold"
                          : "text-slate-700 hover:bg-slate-50"
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

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-3 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
