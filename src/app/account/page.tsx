"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Package,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { STORE_CONTACT, VERIFIED_LOCATIONS } from "@/data/locations";

export default function AccountPage() {
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");

  const [customerName, setCustomerName] = useState("Karthik S.");
  const [customerPhone, setCustomerPhone] = useState("088075 74880");
  const [customerEmail, setCustomerEmail] = useState("customer@phonex.net.in");

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Account Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {customerName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{customerName}</h1>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {customerEmail} • {customerPhone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Local Store:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Coimbatore Flagship
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "addresses"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "profile"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base mb-1">No Orders Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Place an order for custom phone skins or ₹99 screen protectors to view live order tracking here.
                </p>
                <Link
                  href="/shop"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-sm inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-blue-600">
                        #{order.orderNumber}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {order.fulfillmentStatus}
                      </span>
                      <span className="text-base font-black text-slate-900">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Order items list */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.name}</p>
                          {item.selectedModel && (
                            <p className="text-slate-500 text-[11px] truncate">{item.selectedModel}</p>
                          )}
                          <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Delivery: <strong className="text-slate-700">{order.customer.address}</strong>
                    </span>
                    <Link
                      href={`/order-confirmation?orderId=${order.id}`}
                      className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View Receipt</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-600/30 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Default Home Address
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm mt-3">{customerName}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Cross Cut Road, Gandhipuram
                <br />
                Coimbatore, Tamil Nadu - 641012
                <br />
                Phone: {customerPhone}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Store Pickup Hub
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm mt-3">PHONEX Annur Branch</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Main Road, Near Bus Stand
                <br />
                Annur, Tamil Nadu - 641653
                <br />
                Phone: {STORE_CONTACT.phone}
              </p>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-xl">
            <h3 className="font-bold text-base text-slate-900 mb-4">Profile Information</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Demo authentication profile. Changes persist in current session storage.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
