'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Wallet,
  Receipt,
  CheckSquare,
  Gavel,
  ShoppingCart,
  Users,
  ShieldCheck,
  TrendingUp,
  Clock,
  Send,
  Zap,
  Leaf,
  GraduationCap,
  ShieldAlert,
  Plus,
  LogIn,
  Settings,
  Flame,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { formatKES } from '../lib/utils';
import { HeroSection } from '../components/HeroSection';

export default function OverviewPage() {
  const {
    activeWorkspace,
    roommates,
    currentRoommate,
    expenses,
    chores,
    bills,
    fund,
    setIsMpesaModalOpen,
    setIsAuthModalOpen,
    setIsProfileModalOpen,
    setIsInfractionModalOpen,
    handleClaimBounty,
  } = useHouse();

  // Quick stats
  const totalSpent = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const pendingChores = chores.filter((c) => c.status === 'PENDING' || c.status === 'BOUNTY_OPEN');
  const openBills = bills.filter((b) => b.status === 'OPEN' || b.status === 'ARBITRATION_REQUIRED');
  const activeBounties = chores.filter((c) => c.status === 'BOUNTY_OPEN');

  // Compute current roommate net balance
  let userNetBalance = 0;
  expenses.forEach((exp) => {
    if (exp.payerId === currentRoommate.id) userNetBalance += exp.totalAmount;
    exp.items.forEach((item) => {
      if (item.participantIds.includes(currentRoommate.id)) {
        userNetBalance -= item.cost / (item.participantIds.length || 1);
      }
    });
  });

  // Current user's assigned chores
  const myChores = chores.filter((c) => c.assignedToId === currentRoommate.id);
  const myPendingChore = myChores.find((c) => c.status === 'PENDING');

  return (
    <div className="space-y-8 pb-16">
      {/* Live Hero with Interactive Budget & Dietary Simulator */}
      <HeroSection
        onOpenMpesa={() => setIsMpesaModalOpen(true)}
        onExploreParliament={() => {}}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Personalized User Dashboard Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-electric-50/70 via-white to-champagne-50/50 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={currentRoommate.avatar}
                alt={currentRoommate.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-electric-500/30 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-electric-600 font-mono">
                  {activeWorkspace.name} ({activeWorkspace.location})
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">Rent Due on the {activeWorkspace.rentDueDay}th</span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
                Welcome to your Dashboard, {currentRoommate.name}
              </h2>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700 capitalize">
                  Role: {currentRoommate.role}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-champagne-100 border border-champagne-200 font-bold text-champagne-800 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-champagne-600" />
                  <span>Karma: {currentRoommate.karmaScore} pts</span>
                </span>

                {currentRoommate.diet.includes('vegetarian') && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    <span>Vegetarian (No meat bills)</span>
                  </span>
                )}

                {currentRoommate.examPeriod && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-amber-600" />
                    <span>Exam Relief Active (-80% chores)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsMpesaModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Paste M-Pesa</span>
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch User</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Your Net Balance */}
          <Link
            href="/finances"
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-electric-300 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold text-slate-500">Your Net Balance</span>
              <div className="w-8 h-8 rounded-lg bg-electric-50 text-electric-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <span
              className={`font-mono text-2xl font-extrabold block ${
                userNetBalance > 0
                  ? 'text-emerald-600'
                  : userNetBalance < 0
                  ? 'text-amber-600'
                  : 'text-slate-800'
              }`}
            >
              {userNetBalance > 0 && '+'}
              {formatKES(Math.round(userNetBalance))}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block flex items-center gap-1">
              <span>{userNetBalance >= 0 ? 'House owes you' : 'You owe flatmates'}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* Card 2: Today's Chores */}
          <Link
            href="/chores"
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold text-slate-500">Chores & Bounties</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <span className="font-mono text-2xl font-extrabold text-slate-900 block">
              {pendingChores.length} Pending
            </span>
            <span className="text-[11px] text-amber-700 font-semibold mt-1 block flex items-center gap-1">
              <span>{activeBounties.length} open bounty (KES 50)</span>
              <ArrowRight className="w-3 h-3 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* Card 3: Parliament Legislation */}
          <Link
            href="/parliament"
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold text-slate-500">Democratic Bills</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Gavel className="w-4 h-4" />
              </div>
            </div>
            <span className="font-mono text-2xl font-extrabold text-slate-900 block">
              {openBills.length} Active
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block flex items-center gap-1">
              <span>Quorum voting underway</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* Card 4: Emergency Reserve Fund */}
          <Link
            href="/finances"
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold text-slate-500">Emergency Vault</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <span className="font-mono text-2xl font-extrabold text-slate-900 block">
              {formatKES(fund.currentBalanceKES)}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block flex items-center gap-1">
              <span>Reserve Ratio: {fund.reserveRatio}x</span>
              <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Action Alert Banner: If there is an active chore bounty or bill */}
        {activeBounties.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block">
                  Open Chore Bounty Available: {activeBounties[0].title}
                </span>
                <span className="text-[11px] text-amber-700">
                  Complete this chore and earn Ksh 50 credited directly to your roommate balance!
                </span>
              </div>
            </div>
            <button
              onClick={() => handleClaimBounty(activeBounties[0].id)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs transition-all shrink-0"
            >
              Claim Ksh 50
            </button>
          </div>
        )}

        {/* Quick Launchpad to Dedicated Modules */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900">
              Platform Modules
            </h3>
            <span className="text-xs text-slate-400">Click to open dedicated pages</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/finances"
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-electric-400 hover:shadow-card transition-all space-y-2 block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-electric-50 text-electric-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Debts & Sinking Fund</h4>
                  <span className="text-[11px] text-slate-400">Bitmask DP settlement paths</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                Zero circular debt. Net balances simplified down to the fewest Safaricom transfers with 1-tap verification.
              </p>
            </Link>

            <Link
              href="/expenses"
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-electric-400 hover:shadow-card transition-all space-y-2 block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Expenses & M-Pesa</h4>
                  <span className="text-[11px] text-slate-400">Audit trail & line-item splits</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                Paste Safaricom SMS receipts. Break down bills so vegetarians never pay for meat and milk-intolerant flatmates skip dairy.
              </p>
            </Link>

            <Link
              href="/chores"
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-electric-400 hover:shadow-card transition-all space-y-2 block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Chores & Bounties</h4>
                  <span className="text-[11px] text-slate-400">Snake Round-Robin (EF1)</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                Envy-free chore load balancing with exam relief. Missed deadlines turn into KES 50 bounties for roommates.
              </p>
            </Link>

            <Link
              href="/parliament"
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-electric-400 hover:shadow-card transition-all space-y-2 block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">House Parliament</h4>
                  <span className="text-[11px] text-slate-400">Speaker of the House AI</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                Democratic legislation for Wi-Fi, rules, and amenities. Deadlocks trigger strict rulings from our AI Arbitrator.
              </p>
            </Link>

            <Link
              href="/shopping"
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-electric-400 hover:shadow-card transition-all space-y-2 block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-champagne-50 text-champagne-700 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Market Shopping List</h4>
                  <span className="text-[11px] text-slate-400">Mama Mboga list builder</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                Collaborative shopping list with dietary filters. Download a printable receipt for the market trip.
              </p>
            </Link>

            <Link
              href="/members"
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-electric-400 hover:shadow-card transition-all space-y-2 block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900">Flatmates & Settings</h4>
                  <span className="text-[11px] text-slate-400">Roommate profiles & invite codes</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                View member profiles, karma scores, exam periods, invite codes, and apartment rent due dates.
              </p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
