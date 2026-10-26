"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Check,
  Smartphone,
  PhoneCall,
  Layers,
  Flame,
  Scissors,
  Zap,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { ProductCard } from "@/components/product-card";
import { SkinFinish, Product } from "@/types";
import { STORE_CONTACT } from "@/data/locations";
import { INITIAL_PRODUCTS } from "@/data/products";

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { products, addToCart, toggleWishlist, isInWishlist } = useStore();

  const product = products.find((p) => p.slug === slug);

  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedFinish, setSelectedFinish] = useState<SkinFinish>("Matte Soft-Touch");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [modelError, setModelError] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (product.supportedModels && product.supportedModels.length > 0) {
        setSelectedModel(product.supportedModels[0]);
      }
      if (product.finishes && product.finishes.length > 0) {
        setSelectedFinish(product.finishes[0]);
      }
      setQuantity(1);
      setModelError(false);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested product may have been relocated or is temporarily unavailable.
        </p>
        <Link
          href="/shop"
          className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleAddToCart = () => {
    if (product.supportedModels && product.supportedModels.length > 0 && !selectedModel) {
      setModelError(true);
      return;
    }
    setModelError(false);
    setIsAdding(true);
    addToCart(product, {
      selectedModel: selectedModel || undefined,
      selectedFinish: selectedFinish || undefined,
      quantity,
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = () => {
    if (product.supportedModels && product.supportedModels.length > 0 && !selectedModel) {
      setModelError(true);
      return;
    }
    setModelError(false);
    addToCart(product, {
      selectedModel: selectedModel || undefined,
      selectedFinish: selectedFinish || undefined,
      quantity,
    });
    router.push("/checkout");
  };

  const allImages = [
    product.image,
    ...(product.additionalImages || []),
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-slate-50/40 min-h-screen py-6 sm:py-8 pb-32 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-900">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-slate-900 capitalize"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-8 lg:p-10 shadow-xs mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-xs">
                <Image
                  src={activeImage || product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-slate-950/90 text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails list */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImage === img
                          ? "border-blue-600 ring-2 ring-blue-600/20"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Customisation Options */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {product.categoryName}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-slate-900">★ {product.rating}</span>
                    <span>({product.reviewsCount} verified reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">₹{product.price}</span>
                  {product.mrp > product.price && (
                    <>
                      <span className="text-base text-slate-400 line-through">₹{product.mrp}</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        Save ₹{product.mrp - product.price}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  Tax included • Free shipping across Tamil Nadu & India over ₹499
                </p>

                {/* Description */}
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Model Compatibility Selector (Critical requirement) */}
                {product.supportedModels && product.supportedModels.length > 0 && (
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                        <span>Select Your Exact Phone Model *</span>
                      </label>
                      <span className="text-[11px] text-slate-500">
                        {product.supportedModels.length}+ Devices
                      </span>
                    </div>

                    <select
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                        setModelError(false);
                      }}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none transition-all shadow-xs ${
                        modelError
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                      }`}
                    >
                      {product.supportedModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    {modelError && (
                      <p className="text-xs text-rose-600 font-medium mt-1.5">
                        Please select your phone model to ensure a precision fit.
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-2">
                      Need a model not listed? Call store directly: {STORE_CONTACT.phone}
                    </p>
                  </div>
                )}

                {/* Finishes / Textures */}
                {product.finishes && product.finishes.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                      Select Tactile Finish
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.finishes.map((finish) => (
                        <button
                          key={finish}
                          type="button"
                          onClick={() => setSelectedFinish(finish)}
                          className={`text-xs px-4 py-2.5 rounded-xl font-bold border transition-all ${
                            selectedFinish === finish
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {finish}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Action Box */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1 flex-shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-white flex items-center justify-center font-bold text-slate-700"
                    >
                      -
                    </button>
                    <span className="w-8 sm:w-10 text-center font-bold text-xs sm:text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-white flex items-center justify-center font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm py-3.5 sm:py-4 px-3 sm:px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span className="truncate">Add to Bag</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm py-3.5 sm:py-4 px-3 sm:px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span className="truncate">Buy Now • ₹{product.price * quantity}</span>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-colors flex-shrink-0 ${
                      inWishlist
                        ? "bg-rose-50 border-rose-200 text-rose-500"
                        : "border-slate-300 hover:bg-slate-50 text-slate-600"
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${inWishlist ? "fill-rose-500" : ""}`} />
                  </button>
                </div>

                {/* In-Store Pickup Banner */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-center justify-between text-xs text-blue-950">
                  <span className="font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>In-store laser application available</span>
                  </span>
                  <Link href="/services" className="font-bold underline text-blue-700">
                    Store Info &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications & Engineering Highlights */}
          <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Features & Specifications</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {product.specs && (
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-blue-600" />
                  <span>Technical Data</span>
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 divide-y divide-slate-200/60 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="py-2.5 flex justify-between">
                      <span className="font-semibold text-slate-600">{key}</span>
                      <span className="font-bold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Floating Action Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">₹{product.price * quantity}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">₹{product.mrp * quantity}</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-medium truncate">
            {selectedModel ? selectedModel.split(" ")[0] + " • " : ""}{selectedFinish}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2.5 rounded-xl border transition-colors ${
              inWishlist
                ? "bg-rose-50 border-rose-200 text-rose-500"
                : "border-slate-300 bg-white text-slate-600"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-rose-500" : ""}`} />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-slate-900 hover:bg-blue-600 active:scale-95 text-white font-extrabold text-xs py-3 px-5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Loading product details...</p>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
