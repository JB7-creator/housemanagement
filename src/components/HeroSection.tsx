'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Users,
  Radio,
  MessageSquare,
  Flame,
  Leaf,
  GraduationCap,
  Scale,
} from 'lucide-react';
import { formatKES } from '../lib/utils';
import { ConstellationCanvas } from './ConstellationCanvas';

interface HeroSectionProps {
  onOpenMpesa: () => void;
  onExploreParliament: () => void;
}

const LIVE_EVENTS = [
  { text: 'Kevin logged Ksh 1,150 Mama Mboga run · Auto-split to 4 flatmates', time: '1m ago', tag: 'M-PESA' },
  { text: 'Dennis activated Exam Mode · Kitchen chore load reduced by 80%', time: '3m ago', tag: 'EXAM HARMONY' },
  { text: 'Bill #42 (50 Mbps Wi-Fi Upgrade) passed by 100% flat consensus', time: '9m ago', tag: 'PARLIAMENT' },
  { text: 'Brian claimed Ksh 50 Bounty for 11 PM kitchen counter sanitization', time: '14m ago', tag: 'BOUNTY CLAIM' },
  { text: 'Maya settled Ksh 450 to Kevin via 1-Tap M-Pesa · Zero circular debt', time: '21m ago', tag: 'SETTLED' },
];

export function HeroSection({ onOpenMpesa, onExploreParliament }: HeroSectionProps) {
  const [rentKES, setRentKES] = useState(6000);
  const [utilitiesKES, setUtilitiesKES] = useState(800);
  const [groceriesKES, setGroceriesKES] = useState(1500);
  const [roommatesCount, setRoommatesCount] = useState(3);
  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'DIET_RULE'>('SIMULATOR');

  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Live real-time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const totalHouseExpense = rentKES + utilitiesKES + groceriesKES;
  const equitablePerPerson = Math.round(totalHouseExpense / roommatesCount);
  const currentEvent = LIVE_EVENTS[activeEventIndex];

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b border-slate-200">
      {/* High-Resolution Architectural Co-Living Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.14] pointer-events-none scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      {/* Architectural Gradient Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFF]/85 via-[#FAFCFF]/95 to-[#FAFCFF] pointer-events-none -z-10" />

      {/* Live Constellation Canvas */}
      <ConstellationCanvas />

      {/* Glowing Ambient Luminous Accents */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-champagne-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Proof, & Live Pulse */}
          <div className="lg:col-span-7 space-y-5">
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-50/90 border border-electric-200/80 text-electric-700 text-xs font-semibold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-500"></span>
              </span>
              <span className="font-mono text-[11px] font-bold tracking-tight">LIVE PULSE</span>
              <span className="text-slate-300">•</span>
              <span>University & Young Professional Flat OS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.14]">
              Autonomous fair living for flatmates.{' '}
              <span className="text-electric-500">Mathematical justice</span>,{' '}
              <span className="bg-gradient-to-r from-champagne-600 to-amber-500 bg-clip-text text-transparent">
                zero roommate drama.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
              Enforcing fair living for student bedsitters, flats, and shared rentals in Kenya. Our <strong className="text-slate-900 font-semibold">Brutal AI Arbitrator</strong> parses M-Pesa receipts, balances vegetarian vs. meat grocery sub-splits, and automates envy-free chore bounties.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenMpesa}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-bold text-xs shadow-card hover:shadow-electric-glow transition-all duration-200 active:scale-[0.98]"
              >
                <span>Paste M-Pesa SMS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs shadow-2xs transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 text-electric-500" />
                <span>Talk to Flatmates & AI</span>
              </Link>
            </div>

            {/* Live Ticker Feed */}
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-2xs flex items-center gap-3 transition-all duration-300">
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

            {/* Social Proof */}
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Student"
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
                <div className="w-7 h-7 rounded-full border-2 border-white bg-champagne-100 flex items-center justify-center text-[9px] font-bold text-champagne-800">
                  +4k
                </div>
              </div>
              <span>Harmonizing <strong>4,200+ students & flatmates</strong> across Nairobi & campuses</span>
            </div>
          </div>

          {/* Right Column: Live Interactive Flat Engine */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 relative">
              
              {/* Header Tabs: Simulator vs Diet Math */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('SIMULATOR')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'SIMULATOR' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                    }`}
                  >
                    Budget Splitter
                  </button>
                  <button
                    onClick={() => setActiveTab('DIET_RULE')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'DIET_RULE' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                    }`}
                  >
                    Dietary Math
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  <Zap className="w-3 h-3 text-emerald-500" />
                  <span>Real-Time</span>
                </div>
              </div>

              {activeTab === 'SIMULATOR' ? (
                <>
                  {/* Presets */}
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
                        rentKES === 4000 ? 'bg-electric-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Bedsitter (4K)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRentKES(8000);
                        setUtilitiesKES(900);
                        setGroceriesKES(1800);
                        setRoommatesCount(3);
                      }}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all ${
                        rentKES === 8000 ? 'bg-electric-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      2-Bed (8K)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRentKES(15000);
                        setUtilitiesKES(1500);
                        setGroceriesKES(3000);
                        setRoommatesCount(4);
                      }}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all ${
                        rentKES === 15000 ? 'bg-electric-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Townhouse (15K)
                    </button>
                  </div>

                  {/* Sliders */}
                  <div className="space-y-3.5 py-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Flat Rent (Shared):</span>
                        <span className="font-mono text-slate-900 font-bold">{formatKES(rentKES)}</span>
                      </div>
                      <input
                        type="range"
                        min={3000}
                        max={20000}
                        step={500}
                        value={rentKES}
                        onChange={(e) => setRentKES(Number(e.target.value))}
                        className="w-full accent-electric-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Utilities (Tokens, Gas, Borehole):</span>
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
                        <span>Mama Mboga & Groceries:</span>
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
                        <span>Sharing Roommates:</span>
                        <span className="font-mono text-slate-900 font-bold">{roommatesCount} Flatmates</span>
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

                  {/* Result Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-baseline text-xs text-slate-500">
                      <span>Total Flat Commitments:</span>
                      <span className="font-mono font-bold text-slate-800">{formatKES(totalHouseExpense)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200">
                      <div>
                        <span className="text-xs font-bold text-electric-600 block">Your Exact Equitable Share:</span>
                        <span className="text-[10px] text-slate-400">Auto-balanced via Bitmask DP</span>
                      </div>
                      <span className="font-mono text-xl font-extrabold text-electric-600">{formatKES(equitablePerPerson)}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Tab 2: Dietary & Fairness Rule Live Demo */
                <div className="py-4 space-y-3 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>Vegetarian & SDA Immunity (Rule #3)</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Dennis never pays for butchery meat. When Ksh 1,200 beef + Ksh 200 sukuma is bought, Dennis pays <strong>only Ksh 50</strong>. The Ksh 1,200 beef is split solely among meat consumers.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <span>University Exam Relief Mode (Rule #2)</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      During exam periods, chore burden drops by 80% (alpha=0.2). Missed tasks turn into open Ksh 50 bounties claimed by roommates and balanced post-exams.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <span>Zero Circular Debt (Bitmask DP)</span>
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      Eliminates "A owes B, B owes C, C owes A". RoomJustice calculates the mathematically minimal M-Pesa transactions.
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Guarantee */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-champagne-500" />
                  M-Pesa 1-Tap Ready
                </span>
                <span className="font-semibold text-emerald-600">KDPA Masked</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
