"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Palette,
  Home,
  Store,
  Headphones,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/store-context";
import { STORE_CONTACT } from "@/data/locations";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, wishlist, openCartDrawer, products } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastTapRef = useRef<number>(0);

  const triggerAdminSecret = () => {
    setIsMobileMenuOpen(false);
    router.push("/admin");
  };

  const handleSecretDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      e.preventDefault();
      triggerAdminSecret();
    }
    lastTapRef.current = now;
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Filter products for live search preview
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks: { label: string; href: string; icon: any; highlight?: boolean }[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Store },
    { label: "Unbreakable Temper", href: "/shop?category=tempered-glass", icon: ShieldCheck },
    { label: "Accessories", href: "/shop?category=accessories", icon: Headphones },
    { label: "Skins", href: "/shop?category=custom-skins", icon: Palette },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white border border-slate-200 shadow-xs flex-shrink-0 group-hover:border-blue-600 transition-all group-hover:scale-105">
                  <Image
                    src="/images/phonex-badge.png"
                    alt="PHONEX Logo"
                    fill
                    sizes="48px"
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg sm:text-xl tracking-wider text-slate-900 leading-none group-hover:text-blue-600 transition-colors uppercase">
                    PHONEX
                  </span>
                  <span className="text-[9px] tracking-widest uppercase font-bold text-slate-400 mt-1 hidden sm:block">
                    Sales • Services • Gadgets
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      link.highlight
                        ? "text-blue-600 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 shadow-2xs"
                        : isActive
                        ? "text-slate-950 font-bold bg-slate-100"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart, Account) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Open search dialog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden sm:flex items-center justify-center"
                aria-label={`Wishlist with ${wishlist.length} saved items`}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Flipkart-Style Login Button */}
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all shadow-2xs"
                aria-label="Login or Sign Up"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>

              {/* Cart Drawer Button */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow"
                aria-label={`Open shopping cart with ${cartCount} items`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bag</span>
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Live Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="p-4 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search custom skins, 9H tempered glass, GaN chargers, models..."
                  className="w-full text-slate-900 placeholder-slate-400 text-base outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              {/* Quick suggestions or search results */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Matching Products
                      </p>
                      {searchResults.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 relative">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                              {prod.name}
                            </p>
                            <p className="text-xs text-slate-500">{prod.categoryName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">₹{prod.price}</p>
                            {prod.mrp > prod.price && (
                              <p className="text-xs text-slate-400 line-through">₹{prod.mrp}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                      <div className="pt-3 border-t border-slate-100 text-center">
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View all results for &quot;{searchQuery}&quot; &rarr;
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p className="text-sm">No products found for &quot;{searchQuery}&quot;.</p>
                      <p className="text-xs text-slate-400 mt-1">Try searching for &quot;skin&quot;, &quot;glass&quot;, or &quot;charger&quot;</p>
                    </div>
                  )
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Unbreakable Tempered Glass ₹99",
                        "Custom Photo Skin",
                        "iPhone 16 Pro Skins",
                        "Samsung S24 Ultra",
                        "Anime Skins",
                        "65W GaN Charger",
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setSearchQuery(item);
                          }}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full font-medium transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 z-10"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div
                    onDoubleClick={triggerAdminSecret}
                    onTouchEnd={handleSecretDoubleTap}
                    className="flex items-center gap-3 cursor-pointer select-none group/brand"
                    title="Double-tap for Admin Portal"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-slate-200 shadow-xs flex-shrink-0 group-hover/brand:border-blue-600 transition-colors">
                      <Image
                        src="/images/phonex-badge.png"
                        alt="PHONEX"
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div>
                      <p className="font-black text-base text-slate-900 tracking-wider">PHONEX</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Coimbatore • Annur • Pulampatti
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links with Icons & Auto-Close */}
                <div className="py-6 space-y-1.5">
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          link.highlight
                            ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                            : pathname === link.href
                            ? "bg-slate-100 text-slate-950 font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              link.highlight
                                ? "bg-blue-100/80 text-blue-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>

                {/* Secondary Links with Auto-Close */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold text-blue-600 bg-blue-50/70 hover:bg-blue-100/70"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Login / Sign Up</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Saved Wishlist</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-slate-500" />
                      <span>My Account & Orders</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Bottom Support contact */}
              <div className="pt-6 border-t border-slate-100 mt-6">
                <a
                  href={`tel:${STORE_CONTACT.phone}`}
                  className="flex items-center justify-center gap-2.5 text-sm font-bold text-slate-800 p-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl border border-slate-200/80 transition-colors shadow-2xs"
                  aria-label="Call PHONEX Store"
                >
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span>Call Store</span>
                </a>
                <p
                  onDoubleClick={triggerAdminSecret}
                  onTouchEnd={handleSecretDoubleTap}
                  className="text-[10px] text-slate-400 text-center mt-3 cursor-pointer select-none hover:text-slate-600 transition-colors"
                  title="Double-tap for Admin Portal"
                >
                  © 2026 PHONEX • Verified Genuine Goods
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
