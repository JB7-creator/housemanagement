'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, TrendingDown, RefreshCw, Send, DollarSign, MessageCircle } from 'lucide-react';
import { Roommate, Expense } from '../lib/types';
import { simplifyDebtsExact } from '../lib/algorithms/debtSimplifier';
import { formatKES, formatKenyanPhoneDisplay, getWhatsAppUrl } from '../lib/utils';
import confetti from 'canvas-confetti';

interface DebtHeatmapProps {
  roommates: Roommate[];
  expenses: Expense[];
  onSettleSuccess?: (tx: { fromName: string; toName: string; amount: number }) => void;
}

export function DebtHeatmap({ roommates, expenses, onSettleSuccess }: DebtHeatmapProps) {
  // Compute net balances dynamically from expenses and itemized splits
  const netBalances: Record<string, number> = {};
  roommates.forEach((r) => {
    netBalances[r.id] = 0;
  });

  expenses.forEach((exp) => {
    // Payer is credited the total amount
    netBalances[exp.payerId] = (netBalances[exp.payerId] || 0) + exp.totalAmount;

    // Line items debited to participants
    exp.items.forEach((item) => {
      const perPerson = item.cost / (item.participantIds.length || 1);
      item.participantIds.forEach((pid) => {
        netBalances[pid] = (netBalances[pid] || 0) - perPerson;
      });
    });
  });

  // Calculate optimized transactions using Bitmask DP
  const transactions = simplifyDebtsExact(netBalances);

  // Quick helper to get roommate by ID
  const getRoommate = (id: string) =>
    roommates.find((r) => r.id === id) || { name: 'Unknown', avatar: '', handle: '', phone: '' };

  const [settledTxs, setSettledTxs] = useState<Record<string, boolean>>({});

  const handleExecuteSettlement = (txKey: string, fromName: string, toName: string, amount: number) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0052FF', '#D4AF37', '#10B981'],
    });

    setSettledTxs((prev) => ({ ...prev, [txKey]: true }));
    if (onSettleSuccess) {
      onSettleSuccess({ fromName, toName, amount });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-slate-900">Roommate Fairness Index & Visual Debt Graph</h2>
            <span className="px-2 py-0.5 rounded-full bg-electric-50 text-electric-600 text-xs font-bold font-mono">
              Bitmask DP Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Circular debts eliminated. All balances condensed into the minimum possible Safaricom M-Pesa transfers.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Transactions Needed</span>
            <span className="font-mono text-base font-extrabold text-electric-600">{transactions.length} Transfers</span>
          </div>
        </div>
      </div>

      {/* Grid: Roommate Balances Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
        {roommates.map((r) => {
          const bal = Math.round(netBalances[r.id] || 0);
          const isCreditor = bal > 0;
          const isDebtor = bal < 0;

          return (
            <div
              key={r.id}
              className={`p-4 rounded-xl border transition-all ${
                isCreditor
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isDebtor
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{r.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{r.handle}</p>
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500">
                  {isCreditor ? 'Owed to them:' : isDebtor ? 'Owes house:' : 'Settled:'}
                </span>
                <span
                  className={`font-mono text-sm font-bold ${
                    isCreditor ? 'text-emerald-600' : isDebtor ? 'text-amber-600' : 'text-slate-500'
                  }`}
                >
                  {isCreditor && '+'}
                  {formatKES(bal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Directed Settlement Paths */}
      <div className="mt-4 pt-6 border-t border-slate-100">
        <h3 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <span>Minimum Directed Settlements</span>
          <span className="text-xs font-normal text-slate-400">(Click to verify M-Pesa transfer)</span>
        </h3>

        {transactions.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">All balances are completely settled!</p>
            <p className="text-[11px] text-slate-400">No pending roommate transfers required.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, idx) => {
              const from = getRoommate(tx.fromId);
              const to = getRoommate(tx.toId);
              const txKey = `${tx.fromId}-${tx.toId}-${tx.amount}`;
              const isSettled = settledTxs[txKey];

              return (
                <div
                  key={idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isSettled ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-electric-300'
                  }`}
                >
                  {/* From -> To */}
                  <div className="flex items-center gap-3">
                    <img src={from.avatar} alt={from.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">{from.name}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">🇰🇪 {formatKenyanPhoneDisplay(from.phone)}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-electric-500 shrink-0 mx-1" />

                    <img src={to.avatar} alt={to.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">{to.name}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">🇰🇪 {formatKenyanPhoneDisplay(to.phone)}</span>
                    </div>
                  </div>

                  {/* Amount & 1-Tap Settle / WhatsApp reminder */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Safaricom Send Money</span>
                      <span className="font-mono text-sm font-bold text-slate-900">{formatKES(tx.amount)}</span>
                    </div>

                    {!isSettled && (
                      <a
                        href={getWhatsAppUrl(
                          from.phone,
                          `Habari ${from.name}! Friendly reminder from flat ledger: You owe ${to.name} ${formatKES(tx.amount)} for recent shared flat expenses. Please settle via M-Pesa to ${formatKenyanPhoneDisplay(to.phone)}. Asante! 📲`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
                        title="Send M-Pesa reminder via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    <button
                      disabled={isSettled}
                      onClick={() => handleExecuteSettlement(txKey, from.name, to.name, tx.amount)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSettled
                          ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                          : 'bg-electric-500 hover:bg-electric-600 text-white shadow-xs active:scale-95'
                      }`}
                    >
                      {isSettled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Settled</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>Verify via M-Pesa</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
