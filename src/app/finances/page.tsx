'use client';

import React from 'react';
import { DebtHeatmap } from '../../components/DebtHeatmap';
import { EmergencyFundCard } from '../../components/EmergencyFundCard';
import { useHouse } from '../../context/HouseContext';

export default function FinancesPage() {
  const { roommates, expenses, fund, showToast } = useHouse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Finances, Debt Graph & Sinking Fund
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Algorithmic debt simplification (Bitmask DP) minimizing cash transfers, and house emergency reserve NAV accounting.
        </p>
      </div>

      {/* Visual Debt Heatmap & Directed Settlement Paths */}
      <DebtHeatmap
        roommates={roommates}
        expenses={expenses}
        onSettleSuccess={({ fromName, toName, amount }) =>
          showToast(`Verified M-Pesa transfer: ${fromName} paid ${toName} Ksh ${amount}`)
        }
      />

      {/* Emergency Sinking Fund & Buffer Pool */}
      <EmergencyFundCard fund={fund} roommates={roommates} />
    </div>
  );
}
