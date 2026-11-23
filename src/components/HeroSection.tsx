'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Activity, ShieldAlert, Cpu, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { formatKES } from '../lib/utils';

interface HeroSectionProps {
  onOpenMpesa: () => void;
  onExploreParliament: () => void;
}

export function HeroSection({ onOpenMpesa, onExploreParliament }: HeroSectionProps) {
  // Live Simulator state right in the hero
  const [rentKES, setRentKES] = useState(32000);
  const [utilitiesKES, setUtilitiesKES] = useState(6500);
  const [groceriesKES, setGroceriesKES] = useState(12000);
  const [roommatesCount, setRoommatesCount] = useState(4);

  const totalHouseExpense = rentKES + utilitiesKES + groceriesKES;
  const equitablePerPerson = Math.round(totalHouseExpense / roommatesCount);
  const unfairDisputeRisk = Math.max(5, Math.round((totalHouseExpense / 50000) * 15));

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden border-b border-slate-200">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-electric-50 via-champagne-50/40 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vision & Typographic Rhythm */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Micro-Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse" />
              <span>Algorithmic Justice for University & Shared Housing</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Co-living without the drama.{' '}
              <span className="text-electric-500">Fairness engineered</span> for{' '}
              <span className="bg-gradient-to-r from-champagne-600 to-amber-500 bg-clip-text text-transparent">
                peace of mind.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              No more awkward money confrontations, neglected chores, or endless WhatsApp arguments.
              Our <strong className="text-slate-900 font-semibold">Brutal AI Arbitrator</strong> parses Safaricom M-Pesa receipts, balances dietary sub-splits (greens vs. meat), and automates envy-free chore rotations.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenMpesa}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-bold text-sm shadow-card hover:shadow-electric-glow transition-all duration-200 active:scale-[0.98]"
              >
                <span>Post M-Pesa Receipt</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={onExploreParliament}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs transition-all duration-200"
              >
                <Cpu className="w-4 h-4 text-champagne-600" />
                <span>House Parliament & AI Rules</span>
              </button>
            </div>

            {/* Live Real-Time Activity Pill */}
            <div className="pt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-800">Live Pulse:</span> Kevin logged Ksh 1,150 Mama Mboga run · Dennis exempted from beef & dairy · Net settled in 1 tap.
              </p>
            </div>
          </div>

          {/* Right Column: Live Interactive Simulator Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">Live Flat Simulator</h3>
                  <p className="text-xs text-slate-500">Test how HouseManagement balances your house</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-electric-50 text-electric-600 font-mono text-xs font-bold">
                  {roommatesCount} Roommates
                </span>
              </div>

              {/* Sliders */}
              <div className="space-y-4 py-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Monthly Flat Rent</span>
                    <span className="font-mono text-slate-900">{formatKES(rentKES)}</span>
                  </div>
                  <input
                    type="range"
                    min={15000}
                    max={60000}
                    step={1000}
                    value={rentKES}
                    onChange={(e) => setRentKES(Number(e.target.value))}
                    className="w-full accent-electric-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Utilities (KPLC Tokens, Gas, Wi-Fi)</span>
                    <span className="font-mono text-slate-900">{formatKES(utilitiesKES)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={15000}
                    step={500}
                    value={utilitiesKES}
                    onChange={(e) => setUtilitiesKES(Number(e.target.value))}
                    className="w-full accent-electric-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Shared Food & Market Runs</span>
                    <span className="font-mono text-slate-900">{formatKES(groceriesKES)}</span>
                  </div>
                  <input
                    type="range"
                    min={4000}
                    max={25000}
                    step={500}
                    value={groceriesKES}
                    onChange={(e) => setGroceriesKES(Number(e.target.value))}
                    className="w-full accent-electric-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                  />
                </div>
              </div>

              {/* Simulation Result Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-medium text-slate-500">Total House Commitment:</span>
                  <span className="font-mono font-bold text-slate-900">{formatKES(totalHouseExpense)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-electric-600 block">Equitable Split per Person:</span>
                    <span className="text-[11px] text-slate-400">Dietary & exam adjustments applied</span>
                  </div>
                  <span className="font-mono text-xl font-extrabold text-electric-600">{formatKES(equitablePerPerson)}</span>
                </div>
              </div>

              {/* Bottom Guarantee */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-champagne-500" />
                  Direct M-Pesa settlement ready
                </span>
                <span className="font-semibold text-emerald-600">Zero Unfair Debt Residue</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
