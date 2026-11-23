'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, Star, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Chore, Roommate } from '../lib/types';
import { formatKES } from '../lib/utils';
import confetti from 'canvas-confetti';

interface ChoreBoardProps {
  chores: Chore[];
  roommates: Roommate[];
  onClaimBounty: (choreId: string) => void;
  onRateChore: (choreId: string, rating: number) => void;
}

export function ChoreBoard({ chores, roommates, onClaimBounty, onRateChore }: ChoreBoardProps) {
  const getRoommate = (id: string) => roommates.find((r) => r.id === id) || { name: 'Unassigned', avatar: '', handle: '', examPeriod: false };

  const handleClaim = (choreId: string) => {
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#0052FF'],
    });
    onClaimBounty(choreId);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-slate-900">Envy-Free Weekly Chore Board</h2>
            <span className="px-2 py-0.5 rounded-full bg-champagne-100 border border-champagne-300 text-champagne-800 text-xs font-bold font-mono">
              Snake Round-Robin (EF1)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chores load-balanced against university exams. Overdue tasks automatically convert into KES 50 bounties.
          </p>
        </div>

        {/* Streak & Bounty summary */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>1 Active Bounty Available</span>
          </div>
        </div>
      </div>

      {/* Chore Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
        {chores.map((chore) => {
          const assignee = getRoommate(chore.assignedToId);
          const isBountyOpen = chore.status === 'BOUNTY_OPEN';
          const isCompleted = chore.status === 'COMPLETED';

          return (
            <div
              key={chore.id}
              className={`p-5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isBountyOpen
                  ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                  : isCompleted
                  ? 'bg-slate-50/60 border-slate-200'
                  : 'bg-white border-slate-200 hover:border-electric-300 shadow-xs'
              }`}
            >
              <div>
                {/* Top tags */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <Clock className="w-3 h-3" />
                    Due {chore.dueTime}
                  </span>

                  {isBountyOpen ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold animate-pulse">
                      Bounty: {formatKES(chore.bountyKES || 50)}
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Completed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Difficulty: {chore.difficulty}/5
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="font-display font-bold text-sm text-slate-900 mb-1">{chore.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{chore.description}</p>
              </div>

              {/* Bottom Assignee & Action */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={assignee.avatar} alt={assignee.name} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block leading-tight">{assignee.name}</span>
                    <span className="text-[10px] text-slate-400 block">{assignee.handle}</span>
                  </div>
                </div>

                {/* Bounty or Rating Action */}
                {isBountyOpen ? (
                  <button
                    onClick={() => handleClaim(chore.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    <span>Claim Bounty</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : isCompleted ? (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => onRateChore(chore.id, star)}
                        className={`w-3.5 h-3.5 cursor-pointer ${
                          star <= (chore.rating || 5)
                            ? 'fill-champagne-500 text-champagne-500'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Pending action</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
