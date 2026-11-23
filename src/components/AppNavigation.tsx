'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Sparkles,
  Plus,
  Building2,
  UserPlus,
  LayoutDashboard,
  Wallet,
  Receipt,
  CheckSquare,
  Gavel,
  ShoppingCart,
  Users,
  MessageSquare,
  LogIn,
  Settings,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';

const NAV_LINKS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/finances', label: 'Debts & Sinking Fund', icon: Wallet },
  { href: '/expenses', label: 'Expenses & M-Pesa', icon: Receipt },
  { href: '/chores', label: 'Chores & Bounties', icon: CheckSquare },
  { href: '/parliament', label: 'Parliament & AI', icon: Gavel },
  { href: '/shopping', label: 'Market Shopping', icon: ShoppingCart },
  { href: '/chat', label: 'Discussion Feed', icon: MessageSquare },
  { href: '/members', label: 'Flatmates', icon: Users },
];

export function AppNavigation() {
  const pathname = usePathname();
  const {
    workspaces,
    activeWorkspace,
    setActiveWorkspaceId,
    roommates,
    currentRoommate,
    setCurrentRoommateId,
    setIsMpesaModalOpen,
    setIsWorkspaceModalOpen,
    setWorkspaceModalMode,
    setIsAuthModalOpen,
    setIsProfileModalOpen,
    showToast,
  } = useHouse();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Top Tier: Brand, Workspaces, User, Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Workspace Dropdown */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-electric-500 flex items-center justify-center text-white shadow-electric-glow">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
                  HouseManagement
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-champagne-100 border border-champagne-300 text-[10px] font-semibold text-champagne-800">
                  <Sparkles className="w-3 h-3 text-champagne-600" />
                  RoomJustice AI
                </span>
              </div>
            </div>
          </Link>

          {/* Workspace Pill & Selector */}
          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 ml-2">
            <select
              value={activeWorkspace.id}
              onChange={(e) => {
                setActiveWorkspaceId(e.target.value);
                const ws = workspaces.find((w) => w.id === e.target.value);
                if (ws) showToast(`Switched to ${ws.name}`);
              }}
              className="text-xs font-bold text-electric-600 bg-electric-50/60 hover:bg-electric-50 px-2.5 py-1.5 rounded-lg border border-electric-200 cursor-pointer focus:outline-none"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.location})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Viewing as & Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Create Flat & Invite buttons */}
          <button
            onClick={() => {
              setWorkspaceModalMode('CREATE_WORKSPACE');
              setIsWorkspaceModalOpen(true);
            }}
            title="Create New Flat Workspace"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>+ Flat</span>
          </button>

          <button
            onClick={() => {
              setWorkspaceModalMode('INVITE_MEMBER');
              setIsWorkspaceModalOpen(true);
            }}
            title="Invite Roommate"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-champagne-50 hover:bg-champagne-100 border border-champagne-200 text-champagne-900 text-xs font-bold transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-champagne-700" />
            <span>Invite</span>
          </button>

          {/* Viewing as Roommate Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">User:</span>
            <select
              value={currentRoommate.id}
              onChange={(e) => setCurrentRoommateId(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {roommates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>

          {/* Auth & Switch Profile Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            title="Log in or Switch Profile"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-all bg-white shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            <span>Login</span>
          </button>

          {/* Paste M-Pesa Primary Button */}
          <button
            onClick={() => setIsMpesaModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Paste M-Pesa</span>
            <span className="sm:hidden">M-Pesa</span>
          </button>

          {/* Current Avatar Click to Edit Profile */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            title="Click to Customize Your Profile"
            className="relative group cursor-pointer focus:outline-none"
          >
            <img
              src={currentRoommate.avatar}
              alt={currentRoommate.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-electric-500/20 group-hover:ring-electric-500 transition-all"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-white flex items-center justify-center text-white">
              <Settings className="w-2.5 h-2.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Second Tier: Sub-Page Navigation Tabs */}
      <div className="bg-slate-50/80 border-t border-slate-200 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 py-1.5">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-electric-600 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-electric-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
