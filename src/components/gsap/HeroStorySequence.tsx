"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, ShieldCheck, Flame, Scissors } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroStorySequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current];

      gsap.fromTo(
        cards,
        {
          y: 60,
          opacity: 0,
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      ref: card1Ref,
      step: "01",
      title: "Laser Calibration",
      desc: "Measured down to 0.01 mm for camera rings, flash cutouts, and speaker grills across 500+ phone chassis.",
      icon: Scissors,
      metric: "0.01mm Tolerance",
    },
    {
      ref: card2Ref,
      step: "02",
      title: "Air-Release Matrix",
      desc: "Microscopic hexagonal channel pathways in the 3M cast vinyl ensure air escapes effortlessly with zero air pockets.",
      icon: Layers,
      metric: "Zero Bubbles",
    },
    {
      ref: card3Ref,
      step: "03",
      title: "Thermal Edge Seal",
      desc: "Gentle heat application conforms the skin flawlessly around modern curved edges for a factory-fitted feel.",
      icon: Flame,
      metric: "No Edge Peel",
    },
    {
      ref: card4Ref,
      step: "04",
      title: "Zero-Residue Removal",
      desc: "Non-damaging pressure-sensitive adhesive peels away cleanly months or years later, preserving factory back glass.",
      icon: ShieldCheck,
      metric: "100% Clean Peel",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-slate-50 border-y border-slate-200/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
            <span>Precision Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
            Engineered for Flawless Fit.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            How PHONEX achieves an unmistakable, millimeter-perfect wrap on your smartphone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                ref={item.ref}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold tracking-widest text-slate-400">
                      STEP {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Standard</span>
                  <span className="font-semibold text-blue-600 bg-blue-50/70 px-2.5 py-1 rounded-md">
                    {item.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
