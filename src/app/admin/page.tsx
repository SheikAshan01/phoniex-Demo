"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Package,
  ShoppingBag,
  TrendingUp,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  Upload,
  Camera,
  Check,
  X,
  Layers,
  Smartphone,
  Eye,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  Phone,
  MessageCircle,
  FileText,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { Product, ProductCategory, Order } from "@/types";
import { POPULAR_PHONE_MODELS } from "@/data/products";

// Verified High-Definition Store Assets Library
const PRESET_PRODUCT_IMAGES = [
  { label: "3D Laser Carbon Skin", src: "/images/hero-skin-showcase.jpg" },
  { label: "Forged Carbon Weave", src: "/images/carbon-skin-design.jpg" },
  { label: "Personalised Photo Skin", src: "/images/photo-skin-design.jpg" },
  { label: "Anime Straw Hat Skin", src: "/images/anime-skin-design.jpg" },
  { label: "Dark Shinobi Manga Skin", src: "/images/shinobi-skin.jpg" },
  { label: "Unbreakable 9H Glass", src: "/images/tempered-glass-promo.jpg" },
  { label: "Anti-Spy Privacy Glass", src: "/images/privacy-glass.jpg" },
  { label: "100W Braided Cable", src: "/images/braided-cable.jpg" },
  { label: "65W GaN Dual Charger", src: "/images/fast-charger.jpg" },
  { label: "Magnetic Neckband Earphones", src: "/images/neckband.jpg" },
  { label: "Precision Laser Skin Fit", src: "/images/laser-service.jpg" },
  { label: "OCA Screen Restoration", src: "/images/oca-service.jpg" },
];

export default function AdminDashboardPage() {
  const {
    products,
    orders,
    updateOrderStatus,
    updateProduct,
    addProduct,
    deleteProduct,
    placeDemoOrder,
    showToast,
  } = useStore();

  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@phonex.net.in");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Admin Navigation Tab
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");

  // Catalog Filter State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Orders Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Product Editing Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // New Product Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState(149);
  const [newMrp, setNewMrp] = useState(299);
  const [newCategory, setNewCategory] = useState<ProductCategory>("custom-skins");
  const [newBadge, setNewBadge] = useState("New Drop");
  const [newStock, setNewStock] = useState(100);
  const [newImage, setNewImage] = useState("/images/hero-skin-showcase.jpg");
  const [newShortDesc, setNewShortDesc] = useState("Precision cut 3M vinyl skin engineered for flawless fit.");
  const [newFeatures, setNewFeatures] = useState("0.01mm laser cut\n3M cast bubble-free vinyl\n100% clean residue-free removal");
  const [newHasModelSupport, setNewHasModelSupport] = useState(true);

  // Hidden File Input Refs
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      if (isEditing && editingProduct) {
        setEditingProduct({ ...editingProduct, image: dataUrl });
      } else {
        setNewImage(dataUrl);
      }
      showToast("Photo uploaded successfully!", "success", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // One-click stock toggle
  const handleToggleStock = (product: Product) => {
    const updated = { ...product, inStock: !product.inStock };
    updateProduct(updated);
    showToast(
      `"${product.name}" marked as ${updated.inStock ? "In Stock" : "Sold Out"}`,
      updated.inStock ? "success" : "info"
    );
  };

  // Seed sample real-world orders for realistic testing
  const handleSeedSampleOrders = () => {
    const sampleOrders: Omit<Order, "id" | "orderNumber" | "createdAt" | "isDemoOrder">[] = [
      {
        customer: {
          fullName: "Karthik Subramanian",
          phone: "9842109876",
          email: "karthik.subbu@gmail.com",
          address: "142 Cross Cut Road, 2nd Floor, Gandhipuram, Coimbatore - 641012",
          city: "Coimbatore",
          state: "Tamil Nadu",
          pincode: "641012",
        },
        items: [
          {
            productId: "prod-1",
            name: "PHONEX 3D Laser Carbon Fiber Mobile Skin",
            price: 149,
            quantity: 1,
            image: "/images/hero-skin-showcase.jpg",
            selectedModel: "Apple iPhone 16 Pro",
            selectedFinish: "Carbon Fiber Weave",
          },
        ],
        subtotal: 149,
        shipping: 49,
        discount: 0,
        total: 198,
        paymentMethod: "cod",
        paymentStatus: "pending",
        fulfillmentStatus: "Delivered",
      },
      {
        customer: {
          fullName: "Priya Rajendran",
          phone: "9789012345",
          email: "priya.raj@outlook.com",
          address: "24 Sathy Main Road, Near Bus Stand, Annur, Coimbatore - 641653",
          city: "Annur",
          state: "Tamil Nadu",
          pincode: "641653",
        },
        items: [
          {
            productId: "prod-5",
            name: "PHONEX Unbreakable 9H Hybrid Screen Protector",
            price: 99,
            quantity: 2,
            image: "/images/tempered-glass-promo.jpg",
            selectedModel: "Samsung Galaxy S24 Ultra",
          },
          {
            productId: "prod-9",
            name: "Heavy-Duty 100W Braided Type-C to Type-C Cable",
            price: 249,
            quantity: 1,
            image: "/images/braided-cable.jpg",
          },
        ],
        subtotal: 447,
        shipping: 0,
        discount: 0,
        total: 447,
        paymentMethod: "demo_upi",
        paymentStatus: "paid",
        fulfillmentStatus: "Shipped",
      },
      {
        customer: {
          fullName: "Vignesh Kumar",
          phone: "9944055667",
          email: "vignesh.k@gmail.com",
          address: "Store Pickup: Coimbatore Flagship (Cross Cut Road)",
          city: "Coimbatore",
          state: "Tamil Nadu",
          pincode: "641012",
        },
        items: [
          {
            productId: "prod-4",
            name: "Dark Shinobi Manga Edition Skin",
            price: 149,
            quantity: 1,
            image: "/images/shinobi-skin.jpg",
            selectedModel: "OnePlus 12",
            selectedFinish: "Matte Soft-Touch",
          },
        ],
        subtotal: 149,
        shipping: 0,
        discount: 0,
        total: 149,
        paymentMethod: "store_pickup",
        paymentStatus: "pending",
        fulfillmentStatus: "Processing",
      },
    ];

    sampleOrders.forEach((so) => placeDemoOrder(so));
    showToast("Generated 3 real-world test orders!", "success");
  };

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalItemsSold = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((s, itm) => s + itm.quantity, 0),
    0
  );

  const processingOrdersCount = orders.filter((o) => o.fulfillmentStatus === "Processing").length;
  const shippedOrdersCount = orders.filter((o) => o.fulfillmentStatus === "Shipped").length;
  const deliveredOrdersCount = orders.filter((o) => o.fulfillmentStatus === "Delivered").length;

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter orders by status and search
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      orderStatusFilter === "all" || o.fulfillmentStatus.toLowerCase() === orderStatusFilter.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct);
      showToast(`Updated "${editingProduct.name}"`, "success", editingProduct.image);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) {
      deleteProduct(productId);
      showToast(`Removed "${productName}" from catalog`, "info");
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categoryNameMap: Record<ProductCategory, string> = {
      all: "All Products",
      "custom-skins": "Custom Mobile Skins",
      "photo-skins": "Personalised Photo Skins",
      "anime-skins": "Anime & Graphic Skins",
      "tempered-glass": "Tempered Glass",
      accessories: "Chargers & Audio",
      services: "Store Services & Repairs",
    };

    const parsedFeatures = newFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: newTitle,
      category: newCategory,
      categoryName: categoryNameMap[newCategory] || "Custom Mobile Skins",
      price: Number(newPrice),
      mrp: Number(newMrp),
      badge: newBadge.trim() || undefined,
      rating: 4.9,
      reviewsCount: 1,
      shortDescription: newShortDesc.trim() || "Precision-crafted product directly from PHONEX studio.",
      description: `${newTitle} manufactured with authentic high-performance materials for lasting daily durability.`,
      image: newImage || "/images/hero-skin-showcase.jpg",
      additionalImages: [newImage || "/images/hero-skin-showcase.jpg"],
      features: parsedFeatures.length > 0 ? parsedFeatures : ["Laser precision cut", "3M Cast vinyl", "Residue-free removal"],
      supportedModels: newHasModelSupport ? POPULAR_PHONE_MODELS : undefined,
      finishes: ["Matte Soft-Touch", "High-Gloss Ultra", "Carbon Fiber Weave", "Honeycomb Grippy", "Leather Grain"],
      inStock: newStock > 0,
      stockCount: Number(newStock),
      tags: ["e-commerce", newCategory, "phonex"],
    };

    addProduct(newProd);
    showToast(`Added "${newProd.name}" to store catalog!`, "success", newProd.image);
    setIsNewProductModalOpen(false);

    // Reset Form
    setNewTitle("");
    setNewPrice(149);
    setNewMrp(299);
    setNewBadge("New Drop");
    setNewImage("/images/hero-skin-showcase.jpg");
  };

  // If not authenticated, render login gate
  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900 min-h-screen py-20 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl max-w-md w-full relative z-10">
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
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
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
        
        {/* Admin Top Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-xs mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Store Management Console</h1>
              <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Logged in as {adminEmail} • Catalog ({products.length}) • Active Orders ({orders.length})
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">
            {orders.length === 0 && (
              <button
                type="button"
                onClick={handleSeedSampleOrders}
                className="flex-1 sm:flex-none text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl bg-emerald-50 flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                title="Populate 3 realistic customer transactions"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulate Test Sales</span>
              </button>
            )}

            <Link
              href="/"
              className="flex-1 sm:flex-none text-center text-xs font-bold text-slate-700 hover:text-blue-600 border border-slate-200 px-3.5 py-2 rounded-xl bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex-1 sm:flex-none text-center text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl bg-rose-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Controls - Responsive Segment Bar */}
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
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Total Sales</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">₹{totalRevenue}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    +18.4% this week
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Total Orders</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 sm:mt-2">{orders.length}</div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1">
                  {processingOrdersCount} Processing • {shippedOrdersCount} Shipped
                </p>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Dispatched Items</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">{totalItemsSold}</div>
                <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium mt-1">
                  99.2% on-time fulfillment
                </p>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase">Catalog Items</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">{products.length}</div>
                <p className="text-[10px] sm:text-[11px] text-blue-600 font-medium mt-1">
                  {products.filter((p) => p.inStock).length} In Stock • 100% active
                </p>
              </div>
            </div>

            {/* Quick Actions & Store Health Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Recent Customer Orders */}
              <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Customer Orders</h2>
                    <p className="text-xs text-slate-400">Real-time store tracking and fulfillment</p>
                  </div>
                  {orders.length > 0 && (
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>View All ({orders.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {orders.length === 0 ? (
                  <div className="py-10 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">No session orders placed yet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Place an order on the storefront or generate sample orders to test live tracking!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSeedSampleOrders}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simulate Demo Transactions</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 font-mono">
                              #{order.orderNumber}
                            </span>
                            <span className="text-slate-700 font-semibold">{order.customer.fullName}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {order.items.length} item(s) • {order.customer.phone}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-slate-900 text-sm">₹{order.total}</span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              order.fulfillmentStatus === "Delivered"
                                ? "bg-emerald-50 text-emerald-700"
                                : order.fulfillmentStatus === "Shipped"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {order.fulfillmentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right 1 Col: Branch Locations & Inventory Status */}
              <div className="space-y-6">
                {/* Store Branches Status */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Store Locations & Hours
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">Coimbatore Flagship</p>
                        <p className="text-[11px] text-slate-500">Cross Cut Road • 10 AM - 9 PM</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Open
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">Annur Branch</p>
                        <p className="text-[11px] text-slate-500">Sathy Main Road • 10 AM - 8:30 PM</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Open
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">P. Puliam patti Branch</p>
                        <p className="text-[11px] text-slate-500">Bhavani Road • 9:30 AM - 8:30 PM</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Open
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Add Product CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-5 text-white shadow-md space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-200" />
                    <h3 className="font-black text-sm">Quick Catalog Expansion</h3>
                  </div>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Instantly upload high-resolution device photos or pick verified 3M vinyl designs to publish to live store.
                  </p>
                  <button
                    onClick={() => setIsNewProductModalOpen(true)}
                    className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs space-y-4 sm:space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter catalog by name, model..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsNewProductModalOpen(true)}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: "all", label: `All (${products.length})` },
                { id: "custom-skins", label: "Custom Skins" },
                { id: "photo-skins", label: "Photo Skins" },
                { id: "anime-skins", label: "Anime Skins" },
                { id: "tempered-glass", label: "Tempered Glass" },
                { id: "accessories", label: "Accessories" },
                { id: "services", label: "Services" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs ${
                    selectedCategoryFilter === cat.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
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
                        <button
                          type="button"
                          onClick={() => handleToggleStock(p)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                            p.inStock
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                          title="Tap to toggle stock"
                        >
                          {p.inStock ? "● In Stock" : "○ Sold Out"}
                        </button>
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
                        onClick={() => handleDeleteProduct(p.id, p.name)}
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
                    <th className="py-3 px-2">Stock Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-2 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="36px" />
                        </div>
                        <span className="truncate max-w-[220px]">{p.name}</span>
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
                        <button
                          type="button"
                          onClick={() => handleToggleStock(p)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            p.inStock
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                          }`}
                          title="Click to toggle stock status"
                        >
                          {p.inStock ? "In Stock" : "Sold Out"}
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct({ ...p })}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders by customer or ID..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: "all", label: `All (${orders.length})` },
                  { id: "processing", label: `Processing (${processingOrdersCount})` },
                  { id: "shipped", label: `Shipped (${shippedOrdersCount})` },
                  { id: "delivered", label: `Delivered (${deliveredOrdersCount})` },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setOrderStatusFilter(s.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      orderStatusFilter === s.id
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-700">No matching orders found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {orderSearch || orderStatusFilter !== "all"
                      ? "Try resetting your search query or filter"
                      : "Generate sample demo orders to preview the fulfillment workflow"}
                  </p>
                </div>
                {orders.length === 0 && (
                  <button
                    type="button"
                    onClick={handleSeedSampleOrders}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate Demo Transactions</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3.5 text-xs transition-all hover:border-slate-300"
                  >
                    {/* Header: Order #, Date, Total & Status selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-blue-600 text-sm">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">
                          {new Date(ord.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})
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
                          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 shadow-2xs focus:border-blue-600 focus:outline-none cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Info & Ordered Items Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-sm">{ord.customer.fullName}</p>
                        <p className="text-slate-600 text-[11px]">
                          📞 {ord.customer.phone} {ord.customer.email ? `• ${ord.customer.email}` : ""}
                        </p>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          📍 {ord.customer.address}
                        </p>

                        {/* Direct Customer Notification Action Buttons */}
                        <div className="pt-2 flex items-center gap-2">
                          <a
                            href={`https://wa.me/91${ord.customer.phone}?text=${encodeURIComponent(
                              `Hello ${ord.customer.fullName}, your PHONEX order #${ord.orderNumber} status is now: ${ord.fulfillmentStatus}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp Status</span>
                          </a>

                          <a
                            href={`tel:${ord.customer.phone}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-[11px] border border-slate-200 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        </div>
                      </div>

                      {/* Item list */}
                      <div className="text-slate-600 text-[11px] space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
                        <p className="font-bold text-slate-900 text-xs">Ordered Items ({ord.items.length}):</p>
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                            <span className="truncate">
                              {it.quantity}x {it.name} {it.selectedModel ? `(${it.selectedModel})` : ""}
                            </span>
                            <span className="font-bold text-slate-900 flex-shrink-0">
                              ₹{it.price * it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: Edit Existing Product with Full Image Upload & Details */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Edit Product</h2>
                  <p className="text-xs text-slate-500">Update product photos, pricing, and catalog specifications.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
                {/* 1. Media Section */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="block font-bold text-slate-900 uppercase tracking-wide">
                    Product Image & Visual Asset *
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-slate-300 flex-shrink-0 shadow-xs">
                      <Image
                        src={editingProduct.image || "/images/hero-skin-showcase.jpg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={editFileInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, true)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Camera className="w-4 h-4 text-blue-600" />
                        <span>Upload Photo from Device</span>
                      </button>

                      <input
                        type="text"
                        value={editingProduct.image}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, image: e.target.value })
                        }
                        placeholder="Or paste image URL (/images/...)"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Preset Quick Chooser */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                      Or Pick From Store Library:
                    </span>
                    <div className="grid grid-cols-6 gap-1.5">
                      {PRESET_PRODUCT_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image: preset.src })}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            editingProduct.image === preset.src
                              ? "border-blue-600 ring-2 ring-blue-600/30"
                              : "border-slate-200 opacity-75 hover:opacity-100"
                          }`}
                          title={preset.label}
                        >
                          <Image src={preset.src} alt={preset.label} fill className="object-cover" sizes="40px" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Title & Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const catMap: Record<ProductCategory, string> = {
                        all: "All Products",
                        "custom-skins": "Custom Mobile Skins",
                        "photo-skins": "Personalised Photo Skins",
                        "anime-skins": "Anime & Graphic Skins",
                        "tempered-glass": "Tempered Glass",
                        accessories: "Chargers & Audio",
                        services: "Store Services & Repairs",
                      };
                      setEditingProduct({
                        ...editingProduct,
                        category: cat,
                        categoryName: catMap[cat] || "Custom Mobile Skins",
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="custom-skins">Custom Mobile Skins</option>
                    <option value="photo-skins">Personalised Photo Skins</option>
                    <option value="anime-skins">Anime & Graphic Skins</option>
                    <option value="tempered-glass">Tempered Glass</option>
                    <option value="accessories">Chargers & Audio</option>
                    <option value="services">Store Services & Repairs</option>
                  </select>
                </div>

                {/* 3. Pricing & Discount Calculation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original MRP (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.mrp}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                {editingProduct.mrp > editingProduct.price && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-[11px] font-bold">
                    <span>Customer Savings:</span>
                    <span>
                      Save ₹{editingProduct.mrp - editingProduct.price} (
                      {Math.round(((editingProduct.mrp - editingProduct.price) / editingProduct.mrp) * 100)}% OFF)
                    </span>
                  </div>
                )}

                {/* 4. Badge & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Promo Badge</label>
                    <input
                      type="text"
                      value={editingProduct.badge || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, badge: e.target.value })
                      }
                      placeholder="e.g. Mega Sale, Best Seller"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Stock Status</label>
                    <select
                      value={editingProduct.inStock ? "true" : "false"}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, inStock: e.target.value === "true" })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Sold Out</option>
                    </select>
                  </div>
                </div>

                {/* 5. Short Description */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.shortDescription || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Add New Product with Direct Photo Upload & Rich Details */}
        {isNewProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Add Product to Store Catalog</h2>
                  <p className="text-xs text-slate-500">Upload photos, configure pricing, and publish directly to live shopping.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                {/* 1. Direct Image Uploader */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="block font-bold text-slate-900 uppercase tracking-wide">
                    1. Product Image & Photo *
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-slate-300 flex-shrink-0 shadow-xs">
                      <Image
                        src={newImage || "/images/hero-skin-showcase.jpg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        ref={newFileInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, false)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => newFileInputRef.current?.click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo from Device</span>
                      </button>

                      <input
                        type="text"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Or paste Image URL (/images/...)"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Preset Library Thumbnails */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                      Or Quick Select High-Definition Asset:
                    </span>
                    <div className="grid grid-cols-6 gap-1.5">
                      {PRESET_PRODUCT_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setNewImage(preset.src)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            newImage === preset.src
                              ? "border-blue-600 ring-2 ring-blue-600/30"
                              : "border-slate-200 opacity-75 hover:opacity-100"
                          }`}
                          title={preset.label}
                        >
                          <Image src={preset.src} alt={preset.label} fill className="object-cover" sizes="40px" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Title & Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Cyberpunk Holo-Matrix Skin"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  >
                    <option value="custom-skins">Custom Mobile Skins (3M Vinyl)</option>
                    <option value="photo-skins">Personalised Photo Skins</option>
                    <option value="anime-skins">Anime & Graphic Skins</option>
                    <option value="tempered-glass">Tempered Glass & Protectors</option>
                    <option value="accessories">Chargers & Audio</option>
                    <option value="services">Store Services & Repairs</option>
                  </select>
                </div>

                {/* 3. Pricing & Discounts */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original MRP (₹)</label>
                    <input
                      type="number"
                      value={newMrp}
                      onChange={(e) => setNewMrp(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                {newMrp > newPrice && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-[11px] font-bold">
                    <span>Calculated Discount:</span>
                    <span>
                      Save ₹{newMrp - newPrice} ({Math.round(((newMrp - newPrice) / newMrp) * 100)}% OFF)
                    </span>
                  </div>
                )}

                {/* 4. Promo Badge & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Promo Badge</label>
                    <input
                      type="text"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder="e.g. Mega Sale, Hot Deal"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Initial Stock Count</label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* 5. Short Description & Features */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={newShortDesc}
                    onChange={(e) => setNewShortDesc(e.target.value)}
                    placeholder="Brief description for catalog cards"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Key Features (One bullet per line)</label>
                  <textarea
                    rows={2}
                    value={newFeatures}
                    onChange={(e) => setNewFeatures(e.target.value)}
                    placeholder="Feature 1&#10;Feature 2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modelSupport"
                    checked={newHasModelSupport}
                    onChange={(e) => setNewHasModelSupport(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="modelSupport" className="text-slate-700 font-semibold cursor-pointer">
                    Enable compatibility selector for 50+ Popular Phone Models
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-200 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewProductModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Product to Store</span>
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
