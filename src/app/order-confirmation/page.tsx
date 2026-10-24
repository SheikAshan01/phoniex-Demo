"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  Truck,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/context/store-context";
import { STORE_CONTACT } from "@/data/locations";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");

  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderNumber) || orders[0];

  useEffect(() => {
    // Trigger celebratory confetti burst on successful checkout
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#10b981", "#38bdf8", "#0f172a"],
      });
    } catch {}
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-2">No Order Found</h1>
        <p className="text-sm text-slate-600 mb-6">
          You can view past orders in your customer profile.
        </p>
        <Link
          href="/account"
          className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors"
        >
          Go to Account & Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
          {/* Header Status */}
          <div className="text-center pb-8 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed (Demo Sandbox)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Your order number is{" "}
              <strong className="text-blue-600 font-mono">#{order.orderNumber}</strong>. We have
              dispatched confirmation details to {order.customer.email}.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Order Number</span>
              <span className="font-bold text-slate-900 font-mono">#{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Order Date</span>
              <span className="font-bold text-slate-900">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Payment Method</span>
              <span className="font-bold text-slate-900 uppercase">
                {order.paymentMethod.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Status</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {order.fulfillmentStatus}
              </span>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="py-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
              Ordered Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    {item.selectedModel && (
                      <p className="text-slate-500 text-[11px]">Model: {item.selectedModel}</p>
                    )}
                    {item.selectedFinish && (
                      <p className="text-blue-600 text-[11px] font-semibold">{item.selectedFinish}</p>
                    )}
                    <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right text-xs font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Pricing Breakdown */}
          <div className="py-6 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
                Delivery Details
              </h4>
              <p className="text-slate-700 font-semibold">{order.customer.fullName}</p>
              <p className="text-slate-500 leading-relaxed mt-0.5">
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </p>
              <p className="text-slate-500 mt-1">Phone: {order.customer.phone}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
                Payment Summary
              </h4>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Savings</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-sm text-slate-900">
                <span>Total Paid / Due</span>
                <span className="text-base text-blue-600">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* In-store support reminder */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Questions about your skin order? Call {STORE_CONTACT.phone}</span>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-blue-600 bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-colors shadow-sm text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account"
              className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs px-6 py-3.5 rounded-xl transition-colors text-center"
            >
              View Order in Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="text-sm font-semibold text-slate-600">Loading order receipt...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
