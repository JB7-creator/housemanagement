'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Activity, ShieldAlert, Cpu, CheckCircle2, Zap, Users, Radio, MessageSquare } from 'lucide-react';
import { formatKES } from '../lib/utils';
import { ConstellationCanvas } from './ConstellationCanvas';

interface HeroSectionProps {
  onOpenMpesa: () => void;
  onExploreParliament: () => void;
}

const LIVE_EVENTS = [
  { text: 'Kevin logged Ksh 1,150 Mama Mboga run · Auto-split to 4 roommates', time: '1m ago', tag: 'M-PESA' },
  { text: 'Dennis activated University Exam Mode · Chore load lowered by 80%', time: '4m ago', tag: 'CHORE HARMONY' },
  { text: 'Bill #42 (Wi-Fi 50 Mbps Upgrade) passed by 100% flat consensus', time: '12m ago', tag: 'PARLIAMENT' },
  { text: 'Brian claimed Ksh 50 Bounty for late kitchen counter sanitization', time: '18m ago', tag: 'BOUNTY' },
  { text: 'Maya settled Ksh 450 to Kevin via 1-Tap M-Pesa · Zero circular debt', time: '25m ago', tag: 'SETTLED' },
];

export function HeroSection({ onOpenMpesa, onExploreParliament }: HeroSectionProps) {
  // Realistic university student low-budget presets starting from 4k:
  const [rentKES, setRentKES] = useState(4000); // 4,000 KES student bedsitter/flat
  const [utilitiesKES, setUtilitiesKES] = useState(600); // KPLC tokens + water
  const [groceriesKES, setGroceriesKES] = useState(1200); // Sukuma + unga + staples
  const [roommatesCount, setRoommatesCount] = useState(2); // 2 roommates sharing

  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Live real-time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const totalHouseExpense = rentKES + utilitiesKES + groceriesKES;
  const equitablePerPerson = Math.round(totalHouseExpense / roommatesCount);

  const currentEvent = LIVE_EVENTS[activeEventIndex];

  return (
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-24 overflow-hidden border-b border-slate-200">
      {/* High-Resolution Architectural Co-Living Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.15] pointer-events-none scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      {/* Architectural Gradient Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFF]/80 via-[#FAFCFF]/92 to-[#FAFCFF] pointer-events-none -z-10" />

      {/* Live Constellation Canvas */}
      <ConstellationCanvas />

      {/* Glowing Ambient Luminous Accents */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-champagne-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Kinetic Typographic Rhythm */}
          <div className="lg:col-span-7 space-y-5">
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-200 text-blue-700 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-500"></span>
              </span>
              <span>Low-Budget & University Flat Fairness Engine</span>
              <span className="text-[10px] bg-electric-100 text-electric-800 px-1.5 py-0.2 rounded font-mono font-bold">
                From 3K Rent
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Co-living without the drama.{' '}
              <span className="text-electric-500">Fairness engineered</span> for{' '}
              <span className="bg-gradient-to-r from-champagne-600 to-amber-500 bg-clip-text text-transparent">
                peace of mind.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Designed for student flats and low-budget roommates.
              Our <strong className="text-slate-900 font-semibold">Brutal AI Arbitrator</strong> parses Safaricom M-Pesa receipts, balances greens vs. meat diets, and eliminates awkward money fights.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onOpenMpesa}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-bold text-sm shadow-card hover:shadow-electric-glow transition-all duration-200 active:scale-[0.98]"
              >
                <span>Paste M-Pesa SMS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 text-electric-500" />
                <span>Flatmate Discussion</span>
              </Link>
            </div>

            {/* Emotional Human Social Proof */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-champagne-100 flex items-center justify-center text-[10px] font-bold text-champagne-800">
                  +4.2k
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Harmonizing <strong className="text-slate-900">4,200+ students & flatmates</strong> across Kenya
              </p>
            </div>

            {/* Dynamic Kinetic Live Pulse Feed */}
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-3 transition-all duration-300">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-electric-600 font-mono">
                      {currentEvent.tag}
                    </span>
                    <span className="text-[10px] text-slate-400">· {currentEvent.time}</span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium truncate">{currentEvent.text}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Flat Budget Simulator */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">Live Low-Budget Flat Simulator</h3>
                  <p className="text-xs text-slate-500">Student & campus apartment cost estimator</p>
                </div>
                <div className="flex items-center gap-1 bg-electric-50 px-2.5 py-1 rounded-md text-electric-700 text-xs font-bold font-mono">
                  <Users className="w-3 h-3" />
                  <span>{roommatesCount} Roommates</span>
                </div>
              </div>

              {/* Quick Budget Presets */}
              <div className="flex items-center gap-1.5 pt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setRentKES(4000);
                    setUtilitiesKES(500);
                    setGroceriesKES(1000);
                    setRoommatesCount(2);
                  }}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all ${
                    rentKES === 4000
                      ? 'bg-electric-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Bedsitter (4K)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRentKES(7000);
                    setUtilitiesKES(850);
                    setGroceriesKES(1600);
                    setRoommatesCount(2);
                  }}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all ${
                    rentKES === 7000
                      ? 'bg-electric-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  1-Bed (7K)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRentKES(10000);
                    setUtilitiesKES(1400);
                    setGroceriesKES(2400);
                    setRoommatesCount(3);
                  }}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all ${
                    rentKES === 10000
                      ? 'bg-electric-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Shared Flat (10K)
                </button>
              </div>

              {/* Sliders tailored for Student / Low-Budget Living */}
              <div className="space-y-4 py-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Flat Rent (Shared)</span>
                    <span className="font-mono text-slate-900 font-bold">{formatKES(rentKES)}</span>
                  </div>
                  <input
                    type="range"
                    min={2500}
                    max={18000}
                    step={250}
                    value={rentKES}
                    onChange={(e) => setRentKES(Number(e.target.value))}
                    className="w-full accent-electric-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>2.5K Bedsitter</span>
                    <span>18K 2-Bedroom</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Utilities (Tokens, Gas, Borehole Water)</span>
                    <span className="font-mono text-slate-900 font-bold">{formatKES(utilitiesKES)}</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={3000}
                    step={50}
                    value={utilitiesKES}
                    onChange={(e) => setUtilitiesKES(Number(e.target.value))}
                    className="w-full accent-electric-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Mama Mboga & Market Staples</span>
                    <span className="font-mono text-slate-900 font-bold">{formatKES(groceriesKES)}</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={4000}
                    step={50}
                    value={groceriesKES}
                    onChange={(e) => setGroceriesKES(Number(e.target.value))}
                    className="w-full accent-electric-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Sharing Roommates</span>
                    <span className="font-mono text-slate-900 font-bold">{roommatesCount} People</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={6}
                    step={1}
                    value={roommatesCount}
                    onChange={(e) => setRoommatesCount(Number(e.target.value))}
                    className="w-full accent-electric-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                  />
                </div>
              </div>

              {/* Simulation Result Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-medium text-slate-500">Total Flat Expense:</span>
                  <span className="font-mono font-bold text-slate-900">{formatKES(totalHouseExpense)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-electric-600 block">Your Exact Share:</span>
                    <span className="text-[11px] text-slate-400">Dietary & exam factors active</span>
                  </div>
                  <span className="font-mono text-xl font-extrabold text-electric-600">{formatKES(equitablePerPerson)}</span>
                </div>
              </div>

              {/* Bottom Guarantee */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-champagne-500" />
                  M-Pesa 1-Tap Ready
                </span>
                <span className="font-semibold text-emerald-600">Zero Debt Fights</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
