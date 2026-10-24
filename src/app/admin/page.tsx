"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { Product, ProductCategory, Order } from "@/types";

export default function AdminDashboardPage() {
  const { products, orders, updateOrderStatus, updateProduct, addProduct, deleteProduct } = useStore();

  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@phonex.net.in");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Admin Navigation Tab
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");

  // Product Editing Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // New Product Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState(149);
  const [newMrp, setNewMrp] = useState(299);
  const [newCategory, setNewCategory] = useState<ProductCategory>("custom-skins");
  const [newBadge, setNewBadge] = useState("");
  const [newStock, setNewStock] = useState(100);

  // Search & Filtering inside Admin
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === "admin@phonex.net.in" && adminPassword === "phonex2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials. Try email: admin@phonex.net.in / password: phonex2026");
    }
  };

  const handleQuickDemoLogin = () => {
    setAdminEmail("admin@phonex.net.in");
    setAdminPassword("phonex2026");
    setIsAuthenticated(true);
    setAuthError("");
  };

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalItemsSold = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((s, itm) => s + itm.quantity, 0),
    0
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer.phone.includes(orderSearch)
  );

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: newTitle,
      category: newCategory,
      categoryName:
        newCategory === "custom-skins"
          ? "Custom Mobile Skins"
          : newCategory === "tempered-glass"
          ? "Tempered Glass"
          : "Accessories",
      price: Number(newPrice),
      mrp: Number(newMrp),
      badge: newBadge.trim() || undefined,
      rating: 4.8,
      reviewsCount: 1,
      shortDescription: "Newly created catalog product via PHONEX Admin Console.",
      description: "Full product description and technical specs.",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
      additionalImages: [],
      features: ["Precision fit", "Tested durability"],
      inStock: newStock > 0,
      stockCount: Number(newStock),
      tags: ["new", "admin"],
    };

    addProduct(newProd);
    setIsNewProductModalOpen(false);
    setNewTitle("");
    setNewBadge("");
  };

  // If not authenticated, render login gate
  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center mx-auto mb-4 border border-slate-800 shadow-md">
              <Lock className="w-7 h-7 text-blue-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">PHONEX Admin Portal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Authorized personnel only. Protected e-commerce management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                {authError}
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Quick Demo Bypass Button */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Access (Bypass Login)</span>
            </button>
            <p className="text-[10px] text-slate-400 mt-2">
              Default password: <code>phonex2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10 pb-20 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Store Management Console</h1>
              <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Logged in as {adminEmail} • Coimbatore / Annur / Pulampatti Hubs
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
            <Link
              href="/"
              className="flex-1 sm:flex-none text-center text-xs font-bold text-slate-700 hover:text-blue-600 border border-slate-200 px-3.5 py-2 rounded-xl bg-slate-50"
            >
              Storefront &rarr;
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex-1 sm:flex-none text-center text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl bg-rose-50 flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Controls - Fully Responsive Segment Bar */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 border border-slate-200/90 rounded-2xl mb-6 sm:mb-8 sm:flex sm:gap-2 sm:p-0 sm:bg-transparent sm:border-0 sm:border-b sm:border-slate-200 sm:rounded-none sm:pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            aria-label="Sales Overview"
            className={`w-full min-w-0 py-2.5 px-1 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 overflow-hidden ${
              activeTab === "overview"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60 sm:hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-full text-center text-[11px] sm:text-xs">
              <span className="sm:hidden">Overview</span>
              <span className="hidden sm:inline">Sales Overview</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            aria-label={`Catalog Manager (${products.length})`}
            className={`w-full min-w-0 py-2.5 px-1 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 overflow-hidden ${
              activeTab === "products"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60 sm:hover:bg-slate-100"
            }`}
          >
            <Package className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-full text-center text-[11px] sm:text-xs">
              <span className="sm:hidden">Catalog ({products.length})</span>
              <span className="hidden sm:inline">Catalog Manager ({products.length})</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            aria-label={`Order Fulfillment (${orders.length})`}
            className={`w-full min-w-0 py-2.5 px-1 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 overflow-hidden ${
              activeTab === "orders"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60 sm:hover:bg-slate-100"
            }`}
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-full text-center text-[11px] sm:text-xs">
              <span className="sm:hidden">Orders ({orders.length})</span>
              <span className="hidden sm:inline">Order Fulfillment ({orders.length})</span>
            </span>
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Total Sales</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">₹{totalRevenue}</div>
                <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold mt-1">Live demo</p>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Total Orders</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 sm:mt-2">{orders.length}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-1">Session DB</p>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Dispatched</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">{totalItemsSold}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-1">Items sold</p>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Catalog Items</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">{products.length}</div>
                <p className="text-[10px] sm:text-[11px] text-blue-600 font-medium mt-1">Active items</p>
              </div>
            </div>

            {/* Recent Orders in Overview */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">Recent Demo Orders</h2>
              {orders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No orders placed yet. Place an order on the storefront to test live tracking!
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 font-mono">
                          #{order.orderNumber}
                        </span>
                        <span className="text-slate-500 ml-2">{order.customer.fullName}</span>
                        <span className="text-slate-400 ml-2">({order.customer.phone})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">₹{order.total}</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                          {order.fulfillmentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter catalog..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <button
                onClick={() => setIsNewProductModalOpen(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Mobile View: Clean Responsive Cards (Screens < 640px) */}
            <div className="sm:hidden space-y-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden relative flex-shrink-0 shadow-xs">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 truncate leading-snug">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {p.categoryName}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-black text-xs text-slate-900">₹{p.price}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{p.mrp}</span>
                        {p.badge && (
                          <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {p.badge}
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            p.inStock
                              ? "bg-emerald-100/70 text-emerald-800"
                              : "bg-rose-100/70 text-rose-800"
                          }`}
                        >
                          {p.inStock ? "In Stock" : "Sold Out"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions Toolbar */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {p.id.slice(0, 8)}...</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProduct({ ...p })}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-blue-600 text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Screens >= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-2">Product</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Price</th>
                    <th className="py-3 px-2">MRP</th>
                    <th className="py-3 px-2">Badge</th>
                    <th className="py-3 px-2">Stock</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-2 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden relative flex-shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="32px" />
                        </div>
                        <span className="truncate max-w-[200px]">{p.name}</span>
                      </td>
                      <td className="py-3 px-2 text-slate-600">{p.categoryName}</td>
                      <td className="py-3 px-2 font-bold text-slate-900">₹{p.price}</td>
                      <td className="py-3 px-2 text-slate-400 line-through">₹{p.mrp}</td>
                      <td className="py-3 px-2">
                        {p.badge ? (
                          <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.inStock ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {p.inStock ? "In Stock" : "Sold Out"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct({ ...p })}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders by customer or ID..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No matching orders found.</p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <span className="font-bold font-mono text-blue-600 text-sm">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-slate-500 ml-2">
                          {new Date(ord.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <span className="font-black text-slate-900 text-sm">₹{ord.total}</span>
                        {/* Status Switcher Dropdown */}
                        <select
                          value={ord.fulfillmentStatus}
                          onChange={(e) =>
                            updateOrderStatus(ord.id, e.target.value as Order["fulfillmentStatus"])
                          }
                          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-slate-900">{ord.customer.fullName}</p>
                        <p className="text-slate-600 text-[11px]">{ord.customer.phone} • {ord.customer.email}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{ord.customer.address}</p>
                      </div>

                      <div className="text-slate-600 text-[11px] space-y-1">
                        <p className="font-semibold text-slate-900">Items Ordered:</p>
                        {ord.items.map((it, i) => (
                          <p key={i} className="truncate">
                            {it.quantity}x {it.name} {it.selectedModel ? `(${it.selectedModel})` : ""} — ₹
                            {it.price * it.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Edit Existing Product */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-black text-slate-900 mb-4">Edit Product</h2>
              <form onSubmit={handleSaveProductEdit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.mrp}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })
                      }
                      className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, badge: e.target.value })
                    }
                    placeholder="e.g. Mega Sale, Offer ₹99"
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Status</label>
                  <select
                    value={editingProduct.inStock ? "true" : "false"}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, inStock: e.target.value === "true" })
                    }
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Sold Out</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add New Product */}
        {isNewProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-black text-slate-900 mb-4">Add Product to Catalog</h2>
              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Matte Camo Edition Skin"
                    required
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="custom-skins">Custom Mobile Skins</option>
                    <option value="photo-skins">Personalised Photo Skins</option>
                    <option value="anime-skins">Anime & Graphic Skins</option>
                    <option value="tempered-glass">Tempered Glass</option>
                    <option value="accessories">Chargers & Accessories</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original MRP (₹)</label>
                    <input
                      type="number"
                      value={newMrp}
                      onChange={(e) => setNewMrp(Number(e.target.value))}
                      className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Promo Badge</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="e.g. New Drop, Hot Deal"
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewProductModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
