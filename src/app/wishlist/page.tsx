"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/store-context";
import { ProductCard } from "@/components/product-card";

export default function WishlistPage() {
  const { wishlist, products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Saved Wishlist
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {savedProducts.length} items saved for future purchase or store visit.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {savedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              Save your favorite custom mobile skins, unbreakable screen protectors, and accessories here to easily purchase them later.
            </p>
            <Link
              href="/shop"
              className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-colors shadow-sm inline-block"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
