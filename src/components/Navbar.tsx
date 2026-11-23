'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Plus, Building2, UserPlus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Roommate, Workspace } from '../lib/types';

interface NavbarProps {
  currentRoommate: Roommate;
  roommates: Roommate[];
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onOpenMpesaModal: () => void;
  onSelectRoommate: (id: string) => void;
  onSelectWorkspace: (id: string) => void;
  onOpenCreateWorkspace: () => void;
  onOpenInviteMember: () => void;
}

export function Navbar({
  currentRoommate,
  roommates,
  workspaces,
  activeWorkspace,
  onOpenMpesaModal,
  onSelectRoommate,
  onSelectWorkspace,
  onOpenCreateWorkspace,
  onOpenInviteMember,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Workspace Dropdown */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-electric-500 flex items-center justify-center text-white shadow-electric-glow">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-slate-900 tracking-tight">HouseManagement</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-champagne-100 border border-champagne-300 text-[10px] font-semibold text-champagne-800">
                <Sparkles className="w-3 h-3 text-champagne-600" />
                RoomJustice AI
              </span>
            </div>
            {/* Active Workspace Selector */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <select
                value={activeWorkspace.id}
                onChange={(e) => onSelectWorkspace(e.target.value)}
                className="text-xs font-semibold text-electric-600 bg-transparent hover:text-electric-700 cursor-pointer focus:outline-none border-b border-electric-200"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.location})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Status Radar & Switcher */}
        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-700">House Harmony: 96% · Optimal</span>
          </div>

          {/* Viewing As Selector */}
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
        <div className="flex items-center gap-2.5">
          {/* Create Workspace Button */}
          <button
            onClick={onOpenCreateWorkspace}
            title="Create New Flat Workspace"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>+ Flat</span>
          </button>

          {/* Invite Roommate Button */}
          <button
            onClick={onOpenInviteMember}
            title="Invite Roommate"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-champagne-50 hover:bg-champagne-100 border border-champagne-200 text-champagne-900 text-xs font-bold transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-champagne-700" />
            <span>Invite</span>
          </button>

          {/* Paste M-Pesa Button */}
          <button
            onClick={onOpenMpesaModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold transition-all duration-150 shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Paste M-Pesa</span>
          </button>

          {/* Current Avatar */}
          <div className="relative group cursor-pointer ml-1">
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
