"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useStore } from "@/context/store-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { showToast } = useStore();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Input validation
  const validateForm = (): boolean => {
    setError("");

    if (mode === "signup") {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setError("Please enter your full name (at least 2 characters).");
        return false;
      }
    }

    if (!identifier.trim()) {
      setError("Please enter your email address or 10-digit mobile number.");
      return false;
    }

    // Check basic email or phone format
    const isEmail = identifier.includes("@") && identifier.includes(".");
    const isPhone = /^[6-9]\d{9}$/.test(identifier.replace(/[\s-]/g, ""));

    if (!isEmail && !isPhone) {
      setError("Please enter a valid email address or 10-digit mobile number.");
      return false;
    }

    if (mode !== "forgot") {
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);

      if (mode === "forgot") {
        setForgotSubmitted(true);
        showToast("Password reset link sent to your registered contact.", "success");
        return;
      }

      if (mode === "signup") {
        showToast(`Welcome, ${fullName.trim()}! Your PHONEX account is ready.`, "success");
      } else {
        showToast("Signed in successfully!", "success");
      }

      // Respect the redirect parameter or go to storefront
      router.push(redirectUrl);
    }, 600);
  };

  return (
    <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Brand Logo & Title */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex flex-col items-center gap-2 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-200 shadow-2xs group-hover:border-blue-600 transition-colors">
            <Image
              src="/images/phonex-badge.png"
              alt="PHONEX Logo"
              fill
              priority
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <span className="font-black text-xl tracking-wider text-slate-900 block leading-tight">
              PHONEX
            </span>
            <span className="text-[10px] tracking-widest uppercase text-slate-400 font-bold">
              Sales • Services • Gadgets
            </span>
          </div>
        </Link>

        {/* Heading & Subtitle */}
        <div className="mt-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {mode === "login" && "Welcome back"}
            {mode === "signup" && "Create an account"}
            {mode === "forgot" && "Reset your password"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {mode === "login" && "Sign in to your PHONEX account."}
            {mode === "signup" && "Register to manage orders and track shipments."}
            {mode === "forgot" && "Enter your email or phone to receive a recovery link."}
          </p>
        </div>
      </div>

      {/* Mode Selector Tabs (Sign In / Create Account) */}
      {mode !== "forgot" && (
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Forgot Password Success State */}
      {mode === "forgot" && forgotSubmitted ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recovery Instructions Sent</h2>
            <p className="text-xs text-slate-500 mt-1">
              We&apos;ve sent password reset instructions to{" "}
              <strong className="text-slate-800">{identifier}</strong>. Check your inbox or SMS.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setForgotSubmitted(false);
              setError("");
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        /* Form Content */
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Registration Name Field */}
          {mode === "signup" && (
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          )}

          {/* Email or Mobile Number Field */}
          <div>
            <label
              htmlFor="auth-identifier"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Email or mobile number
            </label>
            <input
              id="auth-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or mobile number"
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          </div>

          {/* Password Field (for Login and Signup) */}
          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Create a password (min. 6 characters)" : "Enter your password"}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {mode === "login" && "Signing in..."}
                    {mode === "signup" && "Creating account..."}
                    {mode === "forgot" && "Sending link..."}
                  </span>
                </>
              ) : (
                <span>
                  {mode === "login" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Send Recovery Link"}
                </span>
              )}
            </button>
          </div>

          {/* Forgot mode back button */}
          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className="w-full text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 transition-colors text-center"
            >
              ← Back to Sign In
            </button>
          )}

          {/* Privacy and Terms */}
          {mode !== "forgot" && (
            <p className="text-[11px] text-center text-slate-400 leading-normal pt-2">
              By continuing, you agree to PHONEX&apos;s{" "}
              <Link
                href="/about#privacy"
                className="text-slate-600 hover:text-slate-900 underline underline-offset-2"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/about#privacy"
                className="text-slate-600 hover:text-slate-900 underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </form>
      )}

      {/* Subtle Guest Shopping Navigation */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <Link
          href={redirectUrl || "/"}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <span>Continue shopping as guest</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/60 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Suspense
        fallback={
          <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl p-8 shadow-xs animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4" />
            <div className="h-5 bg-slate-200 rounded w-1/2 mx-auto mb-2" />
            <div className="h-3 bg-slate-200 rounded w-3/4 mx-auto mb-6" />
            <div className="h-10 bg-slate-100 rounded-lg mb-4" />
            <div className="h-10 bg-slate-100 rounded-lg mb-4" />
            <div className="h-10 bg-blue-100 rounded-lg" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
