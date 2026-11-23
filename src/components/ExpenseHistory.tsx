'use client';

import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  Users,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Flame,
  Home,
  Droplets,
  Car,
  PiggyBank,
} from 'lucide-react';
import { Expense, Roommate } from '../lib/types';
import { formatKES } from '../lib/utils';

interface ExpenseHistoryProps {
  expenses: Expense[];
  roommates: Roommate[];
}

const CATEGORY_STYLES: Record<
  Expense['category'],
  { bg: string; text: string; border: string; Icon: typeof ShoppingBag }
> = {
  GROCERIES: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    Icon: ShoppingBag,
  },
  ELECTRICITY: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    Icon: Zap,
  },
  GAS: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    Icon: Flame,
  },
  RENT: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    Icon: Home,
  },
  WATER: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    Icon: Droplets,
  },
  TRANSPORT: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    Icon: Car,
  },
  HOUSE_BUFFER: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    Icon: PiggyBank,
  },
};

export function ExpenseHistory({ expenses, roommates }: ExpenseHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(expenses[0]?.id || null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const getRoommate = (id: string) =>
    roommates.find((r) => r.id === id) || {
      name: 'Unknown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback',
      handle: '',
    };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredExpenses =
    filterCategory === 'ALL'
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.totalAmount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-slate-900">
              Audit Ledger & Itemized Sub-Splits
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-electric-50 text-electric-600 text-xs font-bold font-mono">
              {filteredExpenses.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete paper trail of all house expenditures, Safaricom M-Pesa reference codes, and granular participant splits.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-electric-500 cursor-pointer"
          >
            <option value="ALL">All Categories ({formatKES(totalSpent)})</option>
            <option value="GROCERIES">Groceries & Market</option>
            <option value="ELECTRICITY">KPLC Electricity Tokens</option>
            <option value="GAS">Cooking Gas</option>
            <option value="RENT">Rent</option>
            <option value="WATER">Water</option>
            <option value="HOUSE_BUFFER">Emergency Fund</option>
          </select>
        </div>
      </div>

      {/* Expenses Ledger List */}
      <div className="divide-y divide-slate-100 pt-2">
        {filteredExpenses.map((exp) => {
          const payer = getRoommate(exp.payerId);
          const isExpanded = expandedId === exp.id;
          const catStyle = CATEGORY_STYLES[exp.category] || CATEGORY_STYLES.GROCERIES;
          const CatIcon = catStyle.Icon;

          return (
            <div key={exp.id} className="py-4 transition-colors hover:bg-slate-50/50 rounded-xl px-2">
              {/* Main Collapsible Header Row */}
              <div
                onClick={() => toggleExpand(exp.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Left info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                  >
                    <CatIcon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-slate-900">
                        {exp.title}
                      </h4>
                      {exp.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span>Paid by <strong className="text-slate-800">{payer.name}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-400">{exp.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right Amount & Code */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {exp.mpesaCode && (
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      Ref: {exp.mpesaCode}
                    </span>
                  )}

                  <div className="text-right">
                    <span className="font-mono text-base font-extrabold text-slate-900 block">
                      {formatKES(exp.totalAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {exp.items.length} line item{exp.items.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Line-Item Sub-Splits Details */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-slate-100 pl-2 sm:pl-12 space-y-2 animate-in fade-in duration-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-2">
                    <span>Line Item Breakdown</span>
                    <span>Sub-Split & Fairness Math</span>
                  </div>

                  {exp.items.map((item) => {
                    const participantCount = item.participantIds.length || 1;
                    const perPersonCost = item.cost / participantCount;

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        {/* Item Name */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-electric-500" />
                            <span className="font-semibold text-slate-900">{item.name}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.2 rounded">
                              {item.category}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-slate-500 mt-0.5 block pl-3.5">
                            Cost: {formatKES(item.cost)}
                          </span>
                        </div>

                        {/* Roommate Sub-Split Avatar Matrix */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-medium">Split among:</span>
                            <div className="flex items-center gap-1">
                              {roommates.map((r) => {
                                const isIncluded = item.participantIds.includes(r.id);
                                return (
                                  <div
                                    key={r.id}
                                    title={`${r.name} (${isIncluded ? 'Included: ' + formatKES(perPersonCost) : 'Excluded / Diet'})`}
                                    className={`relative group ${!isIncluded ? 'opacity-35 grayscale' : ''}`}
                                  >
                                    <img
                                      src={r.avatar}
                                      alt={r.name}
                                      className={`w-6 h-6 rounded-full object-cover border ${
                                        isIncluded
                                          ? 'border-electric-500 ring-1 ring-electric-500/30'
                                          : 'border-slate-300'
                                      }`}
                                    />
                                    {!isIncluded && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-0.5 bg-rose-500 rotate-45" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="text-right pl-2 border-l border-slate-200">
                            <span className="text-[10px] text-slate-400 block">Each pays</span>
                            <span className="font-mono text-xs font-bold text-electric-600">
                              {formatKES(perPersonCost)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
