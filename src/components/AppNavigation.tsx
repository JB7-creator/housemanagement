'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Check,
  User,
  LogOut,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';

const NAV_LINKS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/finances', label: 'Finances', icon: Wallet },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/chores', label: 'Chores', icon: CheckSquare },
  { href: '/parliament', label: 'Parliament', icon: Gavel },
  { href: '/shopping', label: 'Shopping', icon: ShoppingCart },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
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
    setIsInfractionModalOpen,
    showToast,
  } = useHouse();

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setIsWorkspaceDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand & Workspace Switcher Pill */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-electric-500 flex items-center justify-center text-white shadow-electric-glow group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base text-slate-900 tracking-tight">
                  RoomJustice
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-champagne-100 border border-champagne-300 text-[9px] font-bold text-champagne-800">
                  AI
                </span>
              </div>
            </div>
          </Link>

          {/* Clean Workspace Selector Dropdown */}
          <div className="relative" ref={workspaceRef}>
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-electric-500" />
              <span className="max-w-[130px] truncate">{activeWorkspace.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isWorkspaceDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Your Flat Workspaces
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto py-1">
                  {workspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setActiveWorkspaceId(w.id);
                        setIsWorkspaceDropdownOpen(false);
                        showToast(`Switched flat to ${w.name}`);
                      }}
                      className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 block">{w.name}</span>
                        <span className="text-[10px] text-slate-400">{w.location}</span>
                      </div>
                      {w.id === activeWorkspace.id && (
                        <Check className="w-3.5 h-3.5 text-electric-500" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 border-t border-slate-100 px-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsWorkspaceDropdownOpen(false);
                      setWorkspaceModalMode('CREATE_WORKSPACE');
                      setIsWorkspaceModalOpen(true);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs text-electric-600 hover:bg-electric-50 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Flat</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsWorkspaceDropdownOpen(false);
                      setWorkspaceModalMode('INVITE_MEMBER');
                      setIsWorkspaceModalOpen(true);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 font-medium transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Invite Roommate (Code: {activeWorkspace.inviteCode})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-electric-50 text-electric-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-electric-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, M-Pesa, User Profile */}
        <div className="flex items-center gap-2">
          {/* Report Kosa Pill */}
          <button
            onClick={() => setIsInfractionModalOpen(true)}
            title="Report Rule Breach to AI Arbitrator"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 hover:border-rose-400 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden md:inline">Report Kosa</span>
          </button>

          {/* Paste M-Pesa Primary Button */}
          <button
            onClick={() => setIsMpesaModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>M-Pesa</span>
          </button>

          {/* User Account Dropdown Pill */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-2xs"
            >
              <div className="relative">
                <img
                  src={currentRoommate.avatar}
                  alt={currentRoommate.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-electric-500/30"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
              </div>
              <span className="text-xs font-bold text-slate-800 max-w-[80px] truncate hidden sm:inline">
                {currentRoommate.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                {/* Active user header */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-2.5">
                  <img
                    src={currentRoommate.avatar}
                    alt={currentRoommate.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-electric-500/20"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {currentRoommate.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block capitalize">
                      {currentRoommate.role} • {activeWorkspace.name}
                    </span>
                  </div>
                </div>

                {/* Quick Profile Switching row */}
                <div className="p-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1.5 mb-1">
                    Quick Switch Roommate:
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {roommates.map((r) => (
                      <button
                        key={r.id}
                        title={`Switch to ${r.name}`}
                        onClick={() => {
                          setCurrentRoommateId(r.id);
                          setIsUserMenuOpen(false);
                          showToast(`Logged in as ${r.name}`);
                        }}
                        className={`p-1 rounded-lg flex flex-col items-center gap-0.5 transition-all ${
                          r.id === currentRoommate.id
                            ? 'bg-electric-50 ring-1 ring-electric-500'
                            : 'hover:bg-slate-50 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={r.avatar} alt={r.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-[9px] font-medium text-slate-700 truncate max-w-[45px]">
                          {r.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1 px-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Customize Profile & Diets</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-electric-600 hover:bg-electric-50 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Create Account</span>
                  </button>

                  <Link
                    href="/members"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium transition-colors block"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Flatmate Directory</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-electric-50 text-electric-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-electric-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsInfractionModalOpen(true);
              }}
              className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 px-2 py-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report Kosa</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="text-xs font-semibold text-electric-600 flex items-center gap-1.5 px-2 py-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
