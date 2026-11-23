'use client';

import React from 'react';
import { Home, ShieldCheck, Sparkles, MessageSquare, Plus, Bell } from 'lucide-react';
import { Roommate } from '../lib/types';
import { truncateCode } from '../lib/utils';

interface NavbarProps {
  currentRoommate: Roommate;
  roommates: Roommate[];
  onOpenMpesaModal: () => void;
  onSelectRoommate: (id: string) => void;
}

export function Navbar({ currentRoommate, roommates, onOpenMpesaModal, onSelectRoommate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-electric-500 flex items-center justify-center text-white shadow-electric-glow">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-slate-900 tracking-tight">HouseManagement</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-champagne-100 border border-champagne-300 text-[10px] font-semibold text-champagne-800">
                <Sparkles className="w-3 h-3 text-champagne-600" />
                RoomJustice AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Flat 4B Roysambu Workspace</p>
          </div>
        </div>

        {/* Live Status Radar & Switcher */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-700">House Harmony: 96% · Optimal</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Viewing as:</span>
            <select
              value={currentRoommate.id}
              onChange={(e) => onSelectRoommate(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-electric-500 cursor-pointer"
            >
              {roommates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMpesaModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold transition-all duration-150 shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Paste M-Pesa SMS</span>
          </button>

          {/* Current Avatar */}
          <div className="relative group cursor-pointer">
            <img
              src={currentRoommate.avatar}
              alt={currentRoommate.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-electric-500/20 group-hover:ring-electric-500 transition-all"
            />
            {currentRoommate.examPeriod && (
              <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                Exam
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
