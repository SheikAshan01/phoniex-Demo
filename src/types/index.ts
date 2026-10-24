export type ProductCategory =
  | "all"
  | "custom-skins"
  | "photo-skins"
  | "anime-skins"
  | "tempered-glass"
  | "accessories"
  | "services";

export type SkinFinish = "Matte Soft-Touch" | "High-Gloss Ultra" | "Carbon Fiber Weave" | "Honeycomb Grippy" | "Leather Grain";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  price: number;
  mrp: number;
  badge?: string;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
  shortDescription: string;
  image: string;
  additionalImages: string[];
  features: string[];
  specs?: Record<string, string>;
  supportedModels?: string[];
  finishes?: SkinFinish[];
  inStock: boolean;
  stockCount: number;
  tags: string[];
}

export interface CartItem {
  id: string; // unique item id (composite: productId-model-finish)
  productId: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string;
  category: ProductCategory;
  selectedModel?: string;
  selectedFinish?: SkinFinish;
  customDesignUrl?: string;
  customText?: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedModel?: string;
  selectedFinish?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
  };
  paymentMethod: "demo_upi" | "cod" | "store_pickup";
  paymentStatus: "paid" | "pending";
  fulfillmentStatus: "Processing" | "Confirmed" | "Shipped" | "Delivered";
  isDemoOrder: true;
}

export interface StoreLocation {
  id: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  mapEmbedUrl?: string;
  servicesOffered: string[];
}
