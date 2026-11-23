'use client';

import React from 'react';
import { ShieldCheck, Heart, Sparkles, Github, ArrowUpRight } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12 overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-t from-electric-900/30 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative">
        
        {/* Communal Footprint ("Growing Together") */}
        <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-white block">3,840+</span>
            <span className="text-xs text-slate-400 mt-1 block">Student Flats Harmonized</span>
          </div>
          <div>
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-champagne-400 block">Ksh 14.8M</span>
            <span className="text-xs text-slate-400 mt-1 block">Friction-Free M-Pesa Splits</span>
          </div>
          <div>
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-emerald-400 block">21,500+</span>
            <span className="text-xs text-slate-400 mt-1 block">Chores Completed without Fights</span>
          </div>
          <div>
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-electric-400 block">99.2%</span>
            <span className="text-xs text-slate-400 mt-1 block">Average Roommate Harmony Index</span>
          </div>
        </div>

        {/* Brand & Manifesto */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-electric-400" />
              <span className="font-display font-bold text-lg text-white">HouseManagement (RoomJustice)</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Engineered with mathematical game theory, Safaricom M-Pesa parsing heuristics, and a ruthless AI Arbitrator. Built to safeguard roommate friendships and university harmony.
            </p>
          </div>

          <div className="md:col-span-4 flex items-center md:justify-end gap-3">
            <a
              href="https://github.com/JB7-creator/housemanagement"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 HouseManagement Platform. Open architecture for communal peace.</p>
          <div className="flex items-center gap-1">
            <span>Designed for university flats & roommates worldwide</span>
            <Sparkles className="w-3 h-3 text-champagne-500" />
          </div>
        </div>

      </div>
    </footer>
  );
}
