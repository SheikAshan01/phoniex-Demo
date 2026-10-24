"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Check, ShoppingBag, ShieldCheck, ArrowRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/store-context";
import { SkinFinish } from "@/types";

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedFinish, setSelectedFinish] = useState<SkinFinish>("Matte Soft-Touch");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.image);
      setSelectedModel(
        quickViewProduct.supportedModels && quickViewProduct.supportedModels.length > 0
          ? quickViewProduct.supportedModels[0]
          : ""
      );
      setSelectedFinish(
        quickViewProduct.finishes && quickViewProduct.finishes.length > 0
          ? quickViewProduct.finishes[0]
          : "Matte Soft-Touch"
      );
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);
  const discountPercent =
    quickViewProduct.mrp > quickViewProduct.price
      ? Math.round(((quickViewProduct.mrp - quickViewProduct.price) / quickViewProduct.mrp) * 100)
      : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(quickViewProduct, {
      selectedModel: selectedModel || undefined,
      selectedFinish: selectedFinish || undefined,
      quantity,
    });
    setTimeout(() => {
      setIsAdding(false);
      closeQuickView();
    }, 600);
  };

  const allImages = [
    quickViewProduct.image,
    ...(quickViewProduct.additionalImages || []),
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center z-20 transition-colors"
            aria-label="Close preview modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Gallery */}
            <div className="p-6 bg-slate-50 flex flex-col justify-between">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200 mb-4">
                <Image
                  src={selectedImage || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                {quickViewProduct.badge && (
                  <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {quickViewProduct.badge}
                  </span>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === img
                          ? "border-blue-600 ring-2 ring-blue-600/20"
                          : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="thumbnail" fill className="object-cover" sizes="56px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product configuration & purchase */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                  {quickViewProduct.categoryName}
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {quickViewProduct.name}
                </h2>

                {/* Price block */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    ₹{quickViewProduct.price}
                  </span>
                  {quickViewProduct.mrp > quickViewProduct.price && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{quickViewProduct.mrp}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Save ₹{quickViewProduct.mrp - quickViewProduct.price} ({discountPercent}%)
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {quickViewProduct.shortDescription}
                </p>

                {/* Phone Model Compatibility Selection (Crucial for skins!) */}
                {quickViewProduct.supportedModels && quickViewProduct.supportedModels.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                      Select Your Phone Model *
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    >
                      {quickViewProduct.supportedModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cut with exact 0.01mm laser tolerances for your chassis.
                    </p>
                  </div>
                )}

                {/* Texture / Finish Options */}
                {quickViewProduct.finishes && quickViewProduct.finishes.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">
                      Select Tactile Finish
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.finishes.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setSelectedFinish(f)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                            selectedFinish === f
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center font-bold text-slate-700"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm py-3 px-5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • ₹{quickViewProduct.price * quantity}</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`p-3 rounded-xl border transition-colors ${
                      inWishlist
                        ? "bg-rose-50 border-rose-200 text-rose-500"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? "fill-rose-500" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>In-stock at Coimbatore & Annur</span>
                  </div>
                  <Link
                    href={`/product/${quickViewProduct.slug}`}
                    onClick={closeQuickView}
                    className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
