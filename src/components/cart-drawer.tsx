"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/store-context";

export function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartSavings,
  } = useStore();

  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - cartSubtotal;

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg leading-none">Your Shopping Bag</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {cart.length === 0 ? "Empty" : `${cart.length} unique items`}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCartDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {cart.length > 0 && (
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 text-xs">
                <div className="flex items-center justify-between font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    {amountNeeded <= 0 ? (
                      <span className="text-emerald-600 font-semibold">
                        Free Express Delivery Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong>₹{amountNeeded}</strong> more for Free Shipping
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-slate-900">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                    Explore custom mobile skins, ₹99 unbreakable tempered glass, and high-speed chargers.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCartDrawer}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl bg-white overflow-hidden flex-shrink-0 relative border border-slate-200">
                      <Image
                        src={item.customDesignUrl || item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCartDrawer}
                            className="font-semibold text-sm text-slate-900 hover:text-blue-600 line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Model / Texture Tags */}
                        <div className="flex flex-wrap gap-1 mt-1 text-[11px]">
                          {item.selectedModel && (
                            <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium truncate max-w-[170px]">
                              {item.selectedModel}
                            </span>
                          )}
                          {item.selectedFinish && (
                            <span className="bg-blue-50 border border-blue-200 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                              {item.selectedFinish}
                            </span>
                          )}
                          {item.customText && (
                            <span className="bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                              Text: &quot;{item.customText}&quot;
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-slate-500 hover:text-slate-900 p-0.5"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs text-slate-900 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-slate-500 hover:text-slate-900 p-0.5"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-sm text-slate-900">
                            ₹{item.price * item.quantity}
                          </span>
                          {item.mrp > item.price && (
                            <span className="text-[11px] text-slate-400 line-through ml-1.5">
                              ₹{item.mrp * item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer with Subtotal & Actions */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-white space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">₹{cartSubtotal}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Total Savings</span>
                      <span>-₹{cartSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Shipping</span>
                    <span>
                      {amountNeeded <= 0 ? (
                        <span className="text-emerald-600 font-semibold uppercase">Free</span>
                      ) : (
                        "Calculated at checkout"
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-sm">Estimated Total</span>
                    <span className="font-black text-xl text-slate-900">₹{cartSubtotal}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/cart"
                    onClick={closeCartDrawer}
                    className="py-3 px-4 rounded-xl font-semibold text-xs text-center border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View Full Bag
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCartDrawer}
                    className="py-3 px-4 rounded-xl font-bold text-xs text-center bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure demo order • In-store pickup available</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
