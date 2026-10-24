"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order, SkinFinish } from "@/types";
import { INITIAL_PRODUCTS } from "@/data/products";

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "info" | "error";
  image?: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  isCartDrawerOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastNotification[];
  // Cart Actions
  addToCart: (
    product: Product,
    options?: {
      selectedModel?: string;
      selectedFinish?: SkinFinish;
      customDesignUrl?: string;
      customText?: string;
      quantity?: number;
    }
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Quick View Actions
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  // Order Actions
  placeDemoOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "isDemoOrder">) => Order;
  updateOrderStatus: (orderId: string, status: Order["fulfillmentStatus"]) => void;
  // Admin Catalog Actions
  updateProduct: (updated: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  // Toasts
  showToast: (message: string, type?: "success" | "info" | "error", image?: string) => void;
  removeToast: (id: string) => void;
  // Computations
  cartCount: number;
  cartSubtotal: number;
  cartSavings: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("phonex_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("phonex_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem("phonex_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedProducts = localStorage.getItem("phonex_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch {
      // fallback to initial
    }
    setIsInitialized(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("phonex_cart", JSON.stringify(cart));
    } catch {}
  }, [cart, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("phonex_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("phonex_orders", JSON.stringify(orders));
    } catch {}
  }, [orders, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("phonex_products", JSON.stringify(products));
    } catch {}
  }, [products, isInitialized]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success", image?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, image }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    options?: {
      selectedModel?: string;
      selectedFinish?: SkinFinish;
      customDesignUrl?: string;
      customText?: string;
      quantity?: number;
    }
  ) => {
    const qty = options?.quantity ?? 1;
    const model = options?.selectedModel || (product.supportedModels && product.supportedModels[0]) || "";
    const finish = options?.selectedFinish || (product.finishes && product.finishes[0]);
    const compositeId = `${product.id}-${model}-${finish || "std"}-${options?.customText || ""}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === compositeId);
      if (existing) {
        return prev.map((item) =>
          item.id === compositeId ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      const newItem: CartItem = {
        id: compositeId,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        mrp: product.mrp,
        image: product.image,
        category: product.category,
        selectedModel: model,
        selectedFinish: finish,
        customDesignUrl: options?.customDesignUrl,
        customText: options?.customText,
        quantity: qty,
      };
      return [...prev, newItem];
    });

    showToast(
      `${product.name}${model ? ` (${model.split(" ").slice(-2).join(" ")})` : ""} added to cart!`,
      "success",
      product.image
    );
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast("Item removed from your bag", "info");
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const targetProd = products.find((p) => p.id === productId);
      const name = targetProd ? targetProd.name : "Product";
      if (exists) {
        showToast(`${name} removed from wishlist`, "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`${name} saved to wishlist!`, "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const placeDemoOrder = (
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "isDemoOrder">
  ): Order => {
    const timestamp = Date.now();
    const orderNumber = `PX-${timestamp.toString().slice(-6)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${timestamp}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      isDemoOrder: true,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["fulfillmentStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: status } : o))
    );
    showToast(`Order #${orderId} marked as ${status}`, "info");
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Product "${updated.name}" updated`, "success");
  };

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" added to catalog`, "success");
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast("Product deleted from catalog", "info");
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartSavings = cart.reduce(
    (total, item) => total + Math.max(0, item.mrp - item.price) * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        isCartDrawerOpen,
        quickViewProduct,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCartDrawer,
        closeCartDrawer,
        toggleWishlist,
        isInWishlist,
        openQuickView,
        closeQuickView,
        placeDemoOrder,
        updateOrderStatus,
        updateProduct,
        addProduct,
        deleteProduct,
        showToast,
        removeToast,
        cartCount,
        cartSubtotal,
        cartSavings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
