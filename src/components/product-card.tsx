"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, Plus, Check, Smartphone } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/context/store-context";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useStore();
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
    setTimeout(() => setIsAdding(false), 800);
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
      className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Area */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          {/* Base Product Image (Always visible, smoothly zooms on hover) */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Smooth Secondary Image Transition if available */}
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

        {/* Offer / Category Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top-Right: Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 shadow-sm ${
            inWishlist
              ? "bg-rose-500 text-white"
              : "bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
        </button>

        {/* Quick View Hover Trigger */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:flex gap-2">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-white/95 backdrop-blur-md hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-semibold py-2 px-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Information Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Compatibility indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
            <span className="truncate">{product.categoryName}</span>
            {product.supportedModels && product.supportedModels.length > 0 && (
              <span className="flex items-center gap-1 text-slate-400 font-normal">
                <Smartphone className="w-3 h-3" />
                <span>500+ Models</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Add to Bag */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              Inclusive of taxes
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              !product.inStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isAdding
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 hover:bg-blue-600 text-white"
            }`}
            aria-label={`Add ${product.name} to bag`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : product.supportedModels && product.supportedModels.length > 0 ? (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Select</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
