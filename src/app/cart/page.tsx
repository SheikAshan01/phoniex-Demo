"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useStore } from "@/context/store-context";

import { STORE_CONFIG, calculateShippingFee } from "@/data/store-config";

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartSavings,
  } = useStore();

  const freeShippingThreshold = STORE_CONFIG.freeShippingThreshold;
  const amountNeeded = freeShippingThreshold - cartSubtotal;
  const shippingFee = calculateShippingFee(cartSubtotal);
  const isFreeShipping = shippingFee === 0;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Your Bag is Empty</h1>
        <p className="text-sm text-slate-600 max-w-sm mx-auto mb-8">
          You haven&apos;t added any items yet. Explore custom skins, unbreakable screen protectors, and accessories.
        </p>
        <Link
          href="/shop"
          className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-colors shadow-sm"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Shopping Bag
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review your selected mobile models, finishes, and quantities before checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200">
                    <Image
                      src={item.customDesignUrl || item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </Link>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1.5 mt-1 text-xs">
                      {item.selectedModel && (
                        <span className="bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded-md">
                          Model: {item.selectedModel}
                        </span>
                      )}
                      {item.selectedFinish && (
                        <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-200/60">
                          {item.selectedFinish}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      Unit Price: <span className="font-bold text-slate-900">₹{item.price}</span>
                      {item.mrp > item.price && (
                        <span className="line-through text-slate-400 ml-1.5">₹{item.mrp}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls: quantity & line total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center font-bold text-slate-700"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center font-bold text-slate-700"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="font-black text-lg text-slate-900">Order Summary</h2>

            {/* Free delivery indicator */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>
                  {isFreeShipping ? "Free Delivery Unlocked!" : `Add ₹${amountNeeded} for Free Delivery`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Applicable on orders above ₹499 across all Tamil Nadu & Indian pincodes.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
              </div>
              {cartSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount & Savings</span>
                  <span>-₹{cartSavings}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {isFreeShipping ? "FREE" : "₹49 (Free above ₹499)"}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated GST</span>
                <span className="font-semibold text-slate-900">Included (₹0 additional)</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-black text-base text-slate-900">Total</span>
                <span className="font-black text-2xl text-slate-900">
                  ₹{cartSubtotal + (isFreeShipping ? 0 : 49)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-center">
              <Link
                href="/shop"
                className="text-xs font-bold text-slate-600 hover:text-blue-600 underline underline-offset-4"
              >
                &larr; Continue Browsing
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Transparent Pricing • Verified PHONEX Hubs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
