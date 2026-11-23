'use client';

import React from 'react';
import { ChoreBoard } from '../../components/ChoreBoard';
import { useHouse } from '../../context/HouseContext';

export default function ChoresPage() {
  const { chores, roommates, handleClaimBounty, handleRateChore } = useHouse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Envy-Free Chores & Bounty Board
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Snake Round-Robin rotation (EF1) load-balanced with academic exam periods. Missed chores convert into KES 50 cash bounties.
        </p>
      </div>

      <ChoreBoard
        chores={chores}
        roommates={roommates}
        onClaimBounty={handleClaimBounty}
        onRateChore={handleRateChore}
      />
    </div>
  );
}
