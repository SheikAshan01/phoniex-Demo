"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Smartphone,
  Sparkles,
  Layers,
  ShoppingBag,
  Check,
  RefreshCw,
  Scissors,
  ShieldCheck,
  Info,
} from "lucide-react";
import { useStore } from "@/context/store-context";
import { POPULAR_PHONE_MODELS, SKIN_FINISHES } from "@/data/products";
import { SkinFinish } from "@/types";

export default function CustomStudioPage() {
  const { products, addToCart } = useStore();

  const [selectedModel, setSelectedModel] = useState<string>("Apple iPhone 16 Pro");
  const [selectedFinish, setSelectedFinish] = useState<SkinFinish>("Matte Soft-Touch");
  const [customText, setCustomText] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    {
      id: "preset-1",
      name: "Cyber Carbon Matrix",
      image: "/images/hero-skin-showcase.jpg",
      price: 149,
      mrp: 299,
    },
    {
      id: "preset-2",
      name: "Forged Carbon Fiber",
      image: "/images/carbon-skin-design.jpg",
      price: 149,
      mrp: 299,
    },
    {
      id: "preset-3",
      name: "Straw Hat Anime Manga",
      image: "/images/anime-skin-design.jpg",
      price: 149,
      mrp: 299,
    },
    {
      id: "preset-4",
      name: "Personalised Photo Memory",
      image: "/images/photo-skin-design.jpg",
      price: 199,
      mrp: 399,
    },
    {
      id: "preset-5",
      name: "PHONEX Original Signature",
      image: "/images/custom-skin-orig.jpeg",
      price: 149,
      mrp: 299,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearUpload = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const activeDesignUrl = uploadedImage || presets[selectedPresetIndex].image;
  const isCustomPhoto = !!uploadedImage;
  const price = isCustomPhoto ? 199 : presets[selectedPresetIndex].price;
  const mrp = isCustomPhoto ? 399 : presets[selectedPresetIndex].mrp;

  const handleAddToCart = () => {
    const baseProduct =
      products.find((p) => p.slug === (isCustomPhoto ? "personalised-photo-mobile-skin" : "customised-mobile-skin")) ||
      products[0];

    setIsAdding(true);
    addToCart(baseProduct, {
      selectedModel,
      selectedFinish,
      customDesignUrl: uploadedImage || undefined,
      customText: customText.trim() || undefined,
      quantity: 1,
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Skin Configurator
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            PHONEX Custom Skin Studio
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Select your exact chassis, choose an art-directed pattern or upload your custom portrait, and preview on a realistic phone mockup before placing your order.
          </p>
        </div>

        {/* Configurator 2-Column Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Mockup Stage */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col items-center sticky top-28">
            <div className="relative w-64 sm:w-72 aspect-[9/19] rounded-[3rem] bg-slate-950 p-2.5 shadow-2xl border-4 border-slate-900 ring-2 ring-slate-800 overflow-hidden">
              {/* Phone skin layer */}
              <div className="relative w-full h-full rounded-[2.3rem] overflow-hidden bg-slate-900">
                <Image
                  src={activeDesignUrl}
                  alt="Custom Skin Visual Preview"
                  fill
                  className="object-cover transition-all duration-500"
                  sizes="320px"
                />

                {/* Camera Module Mockup for uploaded photos */}
                {uploadedImage && (
                  <div className="absolute top-4 left-4 w-20 h-24 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 p-2 flex flex-col justify-between shadow-lg">
                    <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-700 ring-2 ring-slate-800" />
                    <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-700 ring-2 ring-slate-800" />
                  </div>
                )}

                {/* Simulated Custom Name Monogram if entered */}
                {customText.trim() && (
                  <div className="absolute bottom-16 inset-x-4 text-center">
                    <span className="inline-block bg-black/70 backdrop-blur-md text-white font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md border border-white/20 shadow-md">
                      {customText}
                    </span>
                  </div>
                )}

                {/* Model & Texture Overlay Tag */}
                <div className="absolute bottom-4 inset-x-4 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl text-white text-center border border-white/10">
                  <p className="text-[11px] font-bold truncate">{selectedModel}</p>
                  <p className="text-[10px] text-blue-400 font-semibold">{selectedFinish}</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-6">
              Interactive 3M Cast Vinyl Mockup. Cut to precision on Japanese plotter cutters.
            </p>
          </div>

          {/* Right: Customisation Controls */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
            {/* 1. Device Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center justify-between">
                <span>1. Select Device Model</span>
                <span className="text-slate-400 font-normal">500+ Supported</span>
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-xs"
              >
                {POPULAR_PHONE_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Design Selection (Upload or Presets) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                  2. Choose Artwork or Upload Photo
                </label>
                {uploadedImage && (
                  <button
                    onClick={handleClearUpload}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Clear Upload & Use Preset
                  </button>
                )}
              </div>

              {/* Upload Box */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="studio-file-upload"
                />
                <label
                  htmlFor="studio-file-upload"
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer flex items-center justify-center gap-3 transition-all ${
                    uploadedImage
                      ? "border-emerald-500 bg-emerald-50/40 text-emerald-900"
                      : "border-slate-300 hover:border-blue-600 hover:bg-blue-50/30 text-slate-600"
                  }`}
                >
                  <Upload className="w-5 h-5 text-blue-600" />
                  <div className="text-left text-xs">
                    <p className="font-bold">
                      {uploadedImage ? "Custom Image Uploaded (Click to Change)" : "Upload Custom Photo or Artwork"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      JPEG, PNG or WebP • 1200 DPI High-definition archival print
                    </p>
                  </div>
                </label>
              </div>

              {/* Presets Grid */}
              <p className="text-xs font-bold text-slate-700 mb-2">Or Select Curated Designer Preset:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presets.map((preset, idx) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPresetIndex(idx);
                      setUploadedImage(null);
                    }}
                    className={`p-2 rounded-2xl border text-left transition-all ${
                      !uploadedImage && selectedPresetIndex === idx
                        ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/30 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 mb-2">
                      <Image src={preset.image} alt={preset.name} fill className="object-cover" sizes="120px" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{preset.name}</p>
                    <p className="text-[11px] text-blue-600 font-semibold">₹{preset.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Tactile Finish */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                3. Select Tactile Vinyl Texture
              </label>
              <div className="flex flex-wrap gap-2.5">
                {SKIN_FINISHES.map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    className={`text-xs px-4 py-2.5 rounded-xl font-bold border transition-all ${
                      selectedFinish === finish
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Optional Monogram */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                4. Optional Name / Monogram Text Imprint
              </label>
              <input
                type="text"
                maxLength={20}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. S. KARTHIK (Max 20 chars)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Rendered with laser micro-typography on the bottom frame.
              </p>
            </div>

            {/* Pricing & Add to Cart */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Custom Wrap Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">₹{price}</span>
                  <span className="text-sm text-slate-400 line-through">₹{mrp}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added Custom Skin!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Custom Wrap to Bag</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>
                3M automotive cast vinyl • 100% residue-free removal • Free walk-in heat fit at Coimbatore & Annur
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
