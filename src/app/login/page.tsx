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
      // Direct redirect to shopping page as requested by user
      router.push("/");
    }, 600);
  };

  return (
    <div className="bg-slate-100 min-h-[85vh] py-8 sm:py-16 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        {/* Left Flipkart-Style Blue Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-9 h-9 rounded-full bg-white p-0.5 relative shadow-xs">
                <Image
                  src="/images/phonex-badge.png"
                  alt="PHONEX"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-black text-xl tracking-wider uppercase">PHONEX</span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-black leading-tight">
              {mode === "login" ? "Login" : "Looks like you're new here!"}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-3 leading-relaxed">
              {mode === "login"
                ? "Get access to your Orders, Wishlist, Custom Skin Designs and Instant ₹99 Deals."
                : "Sign up with your mobile number to start shopping guaranteed 3M mobile wraps."}
            </p>
          </div>

          {/* Flipkart-style bottom illustration & guarantees */}
          <div className="relative z-10 pt-8 border-t border-blue-500/50 space-y-2 text-xs text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Over 500+ Smartphone models</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>100% 3M Residue-Free Vinyl</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Verified Unbreakable Glass from ₹99</span>
            </div>
          </div>

          {/* Decorative ambient background rings */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/30 blur-2xl pointer-events-none" />
        </div>

        {/* Right Form Area */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Mode Toggle */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`text-sm font-bold pb-2 transition-colors relative ${
                    mode === "login"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`text-sm font-bold pb-2 transition-colors relative ${
                    mode === "signup"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Direct Shopping link */}
              <Link
                href="/"
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1"
              >
                <span>Direct Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email or Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter Email or 10-digit Mobile"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                By continuing, you agree to PHONEX&apos;s{" "}
                <span className="text-blue-600 font-semibold cursor-pointer">Terms of Use</span> and{" "}
                <span className="text-blue-600 font-semibold cursor-pointer">Privacy Policy</span>.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {mode === "login"
                        ? "Log In & Continue Shopping"
                        : "Sign Up & Start Shopping"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Flip Switch & Direct Shopping button */}
          <div className="pt-6 border-t border-slate-200 mt-6 space-y-3">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-colors border border-slate-300"
            >
              {mode === "login"
                ? "New to PHONEX? Create an account"
                : "Existing User? Log In"}
            </button>

            <Link
              href="/"
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>⚡ Direct to Shopping Storefront (Skip Login)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
