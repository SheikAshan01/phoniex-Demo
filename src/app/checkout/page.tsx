"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  CreditCard,
  MapPin,
  ArrowRight,
  AlertCircle,
  Store,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { VERIFIED_LOCATIONS } from "@/data/locations";
import { calculateShippingFee } from "@/data/store-config";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartSavings, placeDemoOrder } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"ship" | "pickup">("ship");
  const [selectedStore, setSelectedStore] = useState<string>("loc-coimbatore");

  // Form inputs
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Coimbatore");
  const [state, setState] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"demo_upi" | "cod" | "store_pickup">("demo_upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingCost = calculateShippingFee(cartSubtotal, deliveryMethod === "pickup");
  const finalTotal = cartSubtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-2">No Items in Checkout</h1>
        <p className="text-sm text-slate-600 mb-6">
          Your shopping bag is empty. Add products to proceed with checkout.
        </p>
        <Link
          href="/shop"
          className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!phone.trim() || phone.trim().length < 10)
      errs.phone = "Valid 10-digit mobile number is required";
    if (!email.trim() || !email.includes("@"))
      errs.email = "Valid email address is required for confirmation receipt";

    if (deliveryMethod === "ship") {
      if (!address.trim()) errs.address = "Delivery street address is required";
      if (!pincode.trim() || pincode.trim().length < 6)
        errs.pincode = "Valid 6-digit PIN code is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      if (deliveryMethod === "pickup") {
        setPaymentMethod("store_pickup");
      }
      setStep(2);
    }
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    const storeInfo = VERIFIED_LOCATIONS.find((l) => l.id === selectedStore);

    const orderData = {
      items: cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        selectedModel: c.selectedModel,
        selectedFinish: c.selectedFinish,
        image: c.image,
      })),
      subtotal: cartSubtotal,
      discount: cartSavings,
      shipping: shippingCost,
      total: finalTotal,
      customer: {
        fullName,
        phone,
        email,
        address:
          deliveryMethod === "pickup"
            ? `Store Pickup at: ${storeInfo?.name} (${storeInfo?.address}, ${storeInfo?.city})`
            : address,
        city: deliveryMethod === "pickup" ? storeInfo?.city || "Coimbatore" : city,
        state,
        pincode: deliveryMethod === "pickup" ? "Store Pickup" : pincode,
        notes,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "demo_upi" ? ("paid" as const) : ("pending" as const),
      fulfillmentStatus: "Processing" as const,
    };

    setTimeout(() => {
      const order = placeDemoOrder(orderData);
      setIsSubmitting(false);
      router.push(`/order-confirmation?orderId=${order.id}&orderNumber=${order.orderNumber}`);
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Explicit Demo Notice Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Secure Demonstration Checkout:</strong> This sandbox validates all form fields and saves a genuine receipt. No actual credit card charge occurs.
            </span>
          </div>
          <span className="font-bold uppercase tracking-wider text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">
            Demo Mode Active
          </span>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10 text-xs font-bold">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              1
            </span>
            <span>Delivery & Details</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              2
            </span>
            <span>Payment & Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            {step === 1 ? (
              <form onSubmit={handleProceedToPayment} className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Customer & Delivery Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide your contact number for dispatch notifications and order tracking.
                  </p>
                </div>

                {/* Delivery Method Choice */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("ship")}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      deliveryMethod === "ship"
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Direct Home Shipping</p>
                      <p className="text-[11px] text-slate-500">Tamil Nadu & All-India Delivery</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      deliveryMethod === "pickup"
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Store className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Store Pickup (Free)</p>
                      <p className="text-[11px] text-slate-500">Coimbatore, Annur, Pulampatti</p>
                    </div>
                  </button>
                </div>

                {/* Store Selection if Pickup */}
                {deliveryMethod === "pickup" && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-900 uppercase">
                      Select PHONEX Store Branch
                    </label>
                    <div className="space-y-2">
                      {VERIFIED_LOCATIONS.map((loc) => (
                        <label
                          key={loc.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedStore === loc.id
                              ? "bg-white border-blue-600 shadow-xs"
                              : "bg-white/50 border-slate-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="store"
                            value={loc.id}
                            checked={selectedStore === loc.id}
                            onChange={() => setSelectedStore(loc.id)}
                            className="mt-1 accent-blue-600"
                          />
                          <div className="text-xs">
                            <p className="font-bold text-slate-900">{loc.name}</p>
                            <p className="text-slate-500">{loc.address}, {loc.city}</p>
                            <p className="text-blue-600 font-semibold mt-0.5">Phone: {loc.phone}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                        errors.fullName ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-blue-600"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                        errors.phone ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-blue-600"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                    Email Address * (For Receipt & Tracking)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                      errors.email ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Shipping Address (if not pickup) */}
                {deliveryMethod === "ship" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                        Street Address / Door No / Landmark *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Flat 302, Green Park Avenue, Near Bus Stand"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                          errors.address ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-blue-600"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                          City / District *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                          State *
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="e.g. 641012"
                          className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white ${
                            errors.pincode ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 focus:border-blue-600"
                          }`}
                        />
                        {errors.pincode && (
                          <p className="text-[11px] text-rose-500 mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, or fitting instructions for custom skin"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment & Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Payment Selection & Review
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your preferred payment method to finalize this demo order.
                  </p>
                </div>

                {/* Payment Option Cards */}
                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "demo_upi"
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "demo_upi"}
                      onChange={() => setPaymentMethod("demo_upi")}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Demo Instant UPI / GPay / PhonePe</p>
                      <p className="text-slate-500 mt-0.5">
                        Simulated instant digital payment. Automatically records as Paid.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-slate-500 mt-0.5">
                        Pay upon physical delivery of your precision phone skins.
                      </p>
                    </div>
                  </label>

                  {deliveryMethod === "pickup" && (
                    <label
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "store_pickup"
                          ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "store_pickup"}
                        onChange={() => setPaymentMethod("store_pickup")}
                        className="mt-1 accent-blue-600"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-slate-900">Pay at Store Counter</p>
                        <p className="text-slate-500 mt-0.5">
                          Pay cash or UPI in person at the Coimbatore / Annur store upon inspection.
                        </p>
                      </div>
                    </label>
                  )}
                </div>

                {/* Customer Review Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
                    <span>Delivery Contact</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-slate-700">
                    <strong>{fullName}</strong> • {phone} • {email}
                  </p>
                  <p className="text-slate-600">
                    {deliveryMethod === "pickup"
                      ? `In-Store Pickup at ${selectedStore}`
                      : `${address}, ${city}, ${state} - ${pincode}`}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Place Order • ₹{finalTotal}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Items Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="font-black text-base text-slate-900">Items in Your Bag ({cart.length})</h3>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-2 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200">
                    <Image
                      src={item.customDesignUrl || item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    {item.selectedModel && (
                      <p className="text-slate-500 text-[11px] truncate">{item.selectedModel}</p>
                    )}
                    {item.selectedFinish && (
                      <p className="text-blue-600 text-[10px] font-semibold">{item.selectedFinish}</p>
                    )}
                    <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-xs text-slate-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
              </div>
              {cartSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Total Discount</span>
                  <span>-₹{cartSavings}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-semibold text-slate-900">
                  {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-black text-base text-slate-900">Total Payable</span>
                <span className="font-black text-2xl text-blue-600">₹{finalTotal}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>PHONEX Verified Guarantee & Safe Packaging</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Demo checkout mode • No real card details taken</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
