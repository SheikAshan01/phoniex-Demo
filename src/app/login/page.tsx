"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  Eye,
  EyeOff,
  Sparkles,
  Truck,
  Check,
} from "lucide-react";
import { useStore } from "@/context/store-context";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useStore();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === "signup") {
        showToast(`Welcome ${fullName || "Shopper"}! Account created successfully.`, "success");
      } else {
        showToast("Signed in successfully! Redirecting to shop...", "success");
      }
      // Redirect directly to storefront
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-4xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 z-10">
        
        {/* Left Side: Brand Showcase & Customer Guarantees */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-6 sm:p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-4 sm:mb-6 md:mb-8 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <Image
                  src="/images/phonex-badge.png"
                  alt="PHONEX"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <span className="font-black text-xl tracking-wider block leading-none">PHONEX</span>
                <span className="text-[10px] tracking-widest uppercase text-blue-200 font-bold">
                  Sales • Services • Gadgets
                </span>
              </div>
            </Link>

            {/* Title & Headline */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
              {mode === "login" ? "Welcome Back to PHONEX" : "Create Your Shopper Account"}
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-blue-100 leading-relaxed hidden sm:block">
              {mode === "login"
                ? "Access saved delivery addresses, track live courier shipments, and view your custom skin studio creations."
                : "Join thousands of smartphone enthusiasts enjoying precision 3M vinyl skins and honest ₹99 screen protection."}
            </p>
          </div>

          {/* Value Props */}
          <div className="relative z-10 pt-4 md:pt-8 border-t border-blue-500/40 space-y-2.5 sm:space-y-3.5 text-xs text-blue-100 mt-4 sm:mt-6 md:mt-8">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs">500+ Smartphone models supported</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs">Genuine 3M residue-free cast vinyl</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs">Free express shipping above ₹499</span>
            </div>
          </div>

          {/* Ambient circles */}
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>

        {/* Right Side: Clean Modern Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white text-slate-900">
          <div>
            {/* Top Bar with Mode Switcher & Direct Storefront link */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              {/* Segmented Pill Tab Switcher */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === "login"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === "signup"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Direct Shopping link */}
              <Link
                href="/"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
              >
                <span>Direct Shopping</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Anand Kumar"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs font-medium"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email or Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email or 10-digit mobile"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    WhatsApp Mobile (for shipment updates)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9842012345"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs font-medium"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password *
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => showToast("Enter your registered phone/email to reset password", "info")}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                By continuing, you agree to PHONEX&apos;s{" "}
                <Link href="/about#privacy" className="text-blue-600 font-semibold hover:underline">
                  Privacy Policy & Terms
                </Link>
                .
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing securely...</span>
                  </div>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {mode === "login"
                        ? "Log In & Continue Shopping"
                        : "Create Account & Start Shopping"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Actions & Skip Login */}
          <div className="pt-6 border-t border-slate-100 mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors border border-slate-200"
            >
              {mode === "login"
                ? "New to PHONEX? Create a free account"
                : "Already registered? Sign In to your account"}
            </button>

            <Link
              href="/"
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>⚡ Skip to Storefront (Browse & Buy as Guest)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
