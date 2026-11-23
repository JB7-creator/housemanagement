'use client';

import React from 'react';
import { PiggyBank, ShieldCheck, ArrowUpRight, TrendingUp, Users, Info } from 'lucide-react';
import { EmergencyFundState, Roommate } from '../lib/types';
import { formatKES } from '../lib/utils';

interface EmergencyFundCardProps {
  fund: EmergencyFundState;
  roommates: Roommate[];
}

export function EmergencyFundCard({ fund, roommates }: EmergencyFundCardProps) {
  const getRoommate = (id: string) => roommates.find((r) => r.id === id) || { name: 'Unknown' };

  const reservePercent = Math.min(100, Math.round((fund.currentBalanceKES / fund.targetReserveKES) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-slate-900">House Emergency Sinking Fund & Buffer Pool</h2>
            <span className="px-2 py-0.5 rounded-full bg-champagne-100 border border-champagne-300 text-champagne-800 text-xs font-bold font-mono">
              Unitized NAV Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pooled buffer for emergency water repairs, token blackouts, or when a roommate is temporarily broke.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Reserve Ratio: {fund.reserveRatio}x (Healthy)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Pool Balance Meter */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-semibold text-slate-500">Current Vault Cash</span>
              <span className="text-xs text-slate-400">Target: {formatKES(fund.targetReserveKES)}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-extrabold text-slate-900">{formatKES(fund.currentBalanceKES)}</span>
              <span className="text-xs font-bold text-emerald-600">{reservePercent}% Funded</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-200 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-electric-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${reservePercent}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
              <span>Current Unit Price: <strong className="font-mono text-slate-800">{fund.unitNavPrice} KES/unit</strong></span>
              <span>Total Units: <strong className="font-mono text-slate-800">{fund.totalUnits.toLocaleString()}</strong></span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>Turnover Protection:</strong> When someone leaves, the incoming roommate buys their units at current NAV. The house bank balance stays 100% intact with zero dispute!
            </p>
          </div>
        </div>

        {/* Roommate Equity Breakdown */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-electric-500" />
            <span>Roommate Equity Shares</span>
          </h3>

          <div className="space-y-2">
            {Object.entries(fund.roommateUnits).map(([id, units]) => {
              const r = getRoommate(id);
              const equityKES = Math.round(units * fund.unitNavPrice);
              const sharePercent = Math.round((units / fund.totalUnits) * 100);

              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-800">{r.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({units} units)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">{sharePercent}% Share</span>
                    <span className="font-mono text-xs font-bold text-electric-600">{formatKES(equityKES)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
