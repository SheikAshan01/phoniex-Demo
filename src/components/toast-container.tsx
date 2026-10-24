"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/store-context";

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2.5 max-w-md w-[calc(100%-2rem)] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.94 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto bg-slate-950/95 text-white backdrop-blur-md p-3.5 px-4 rounded-2xl shadow-2xl border border-slate-750 flex items-center gap-3 w-full"
          >
            {toast.image ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative border border-white/20">
                <Image src={toast.image} alt="Toast asset" fill className="object-cover" sizes="40px" />
              </div>
            ) : toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
            )}

            <p className="text-xs font-semibold leading-relaxed flex-1 text-slate-100">
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
