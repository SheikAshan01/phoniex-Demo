"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Eye, Plus, Check, Smartphone, Star, Zap, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/context/store-context";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, openQuickView, showToast } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has multiple supported models, open quick view so customer explicitly picks model
    if (product.supportedModels && product.supportedModels.length > 0) {
      openQuickView(product);
      return;
    }

    setIsAdding(true);
    addToCart(product);
    showToast(`Added ${product.name} to cart!`, "success", product.image);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.supportedModels && product.supportedModels.length > 0) {
      openQuickView(product);
      return;
    }

    addToCart(product);
    router.push("/checkout");
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const secondaryImage =
    product.additionalImages && product.additionalImages.length > 1
      ? product.additionalImages[1]
      : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Area */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden p-2">
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full rounded-xl overflow-hidden">
          {/* Base Product Image */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Smooth Secondary Image Transition */}
          {secondaryImage && secondaryImage !== product.image && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-500 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100 pointer-events-none"
              }`}
            />
          )}
        </Link>

        {/* Flipkart-Style Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top-Right: Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-xs ${
            inWishlist
              ? "bg-rose-500 text-white"
              : "bg-white/95 text-slate-500 hover:text-rose-500 hover:bg-white"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
        </button>

        {/* Quick View Hover Trigger */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:flex gap-2">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-white/95 backdrop-blur-md hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-semibold py-1.5 px-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Information Area - Flipkart Formatting */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & 500+ Models Indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-medium">
            <span className="truncate">{product.categoryName}</span>
            {product.supportedModels && product.supportedModels.length > 0 && (
              <span className="flex items-center gap-1 text-blue-600 font-semibold text-[10px] bg-blue-50 px-1.5 py-0.5 rounded">
                <Smartphone className="w-2.5 h-2.5" />
                <span>500+ Models</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Flipkart-Style Rating Badge */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              ({product.reviewsCount})
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded ml-auto">
              Assured
            </span>
          </div>

          {/* Short description */}
          <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Flipkart Dual Buttons */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.mrp}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-600">
                {discountPercent}% off
              </span>
            )}
          </div>

          <div className="text-[10px] text-slate-500 mb-2 flex items-center justify-between">
            <span className="text-emerald-700 font-medium">Free delivery over ₹499</span>
            <span className="font-semibold text-slate-400">Taxes incl.</span>
          </div>

          {/* Flipkart Action Buttons: Add to Bag + Buy Now */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all border ${
                !product.inStock
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : isAdding
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300"
              }`}
              aria-label={`Add ${product.name} to bag`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-xs ${
                !product.inStock
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 active:scale-95 text-white"
              }`}
              aria-label={`Buy ${product.name} now`}
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
