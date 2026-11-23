'use client';

import React from 'react';
import { ExpenseHistory } from '../../components/ExpenseHistory';
import { useHouse } from '../../context/HouseContext';
import { Plus, ShieldCheck, Zap } from 'lucide-react';

export default function ExpensesPage() {
  const { expenses, roommates, setIsMpesaModalOpen } = useHouse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-blue-50/40 border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Expenses & M-Pesa Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit ledger with sub-group fairness math so vegetarians never pay for meat and individual toiletries remain excluded.
          </p>
        </div>

        <button
          onClick={() => setIsMpesaModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Paste M-Pesa SMS</span>
        </button>
      </div>

      {/* Detailed Ledger & Sub-Splits */}
      <ExpenseHistory expenses={expenses} roommates={roommates} />
    </div>
  );
}
