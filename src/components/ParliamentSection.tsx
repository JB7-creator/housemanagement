'use client';

import React, { useState } from 'react';
import { Gavel, Check, X, ShieldAlert, Cpu, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { ParliamentBill, Roommate } from '../lib/types';
import { formatKES } from '../lib/utils';

interface ParliamentSectionProps {
  bills: ParliamentBill[];
  roommates: Roommate[];
  currentRoommate: Roommate;
  onVote: (billId: string, vote: 'PASS' | 'VETO', reason?: string) => void;
  onRequestArbitration: (billId: string) => void;
}

export function ParliamentSection({
  bills,
  roommates,
  currentRoommate,
  onVote,
  onRequestArbitration,
}: ParliamentSectionProps) {
  const [vetoReasonInput, setVetoReasonInput] = useState<Record<string, string>>({});
  const [activeReasonModalBillId, setActiveReasonModalBillId] = useState<string | null>(null);

  const getRoommate = (id: string) => roommates.find((r) => r.id === id) || { name: 'Unknown', avatar: '', handle: '' };

  const handleVetoSubmit = (billId: string) => {
    const reason = vetoReasonInput[billId] || 'Budget constraint / preference';
    onVote(billId, 'VETO', reason);
    setActiveReasonModalBillId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 md:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl text-slate-900">House Parliament & Democratic Bills</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono">
              Speaker of the House AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Democratic legislation for shared Wi-Fi, rules, and amenities. Contested bills trigger strict AI arbitration.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
          <Gavel className="w-4 h-4 text-electric-500" />
          <span className="text-xs font-semibold text-slate-700">Consensus Quorum: 3 of 4 Votes</span>
        </div>
      </div>

      {/* Bills Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        {bills.map((bill) => {
          const proposer = getRoommate(bill.proposerId);
          const hasVoted = bill.votes.some((v) => v.roommateId === currentRoommate.id);
          const passVotes = bill.votes.filter((v) => v.vote === 'PASS').length;
          const vetoVotes = bill.votes.filter((v) => v.vote === 'VETO').length;

          return (
            <div
              key={bill.id}
              className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Meta header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-electric-600 bg-electric-50 px-2 py-0.5 rounded">
                      BILL #{bill.billNumber}
                    </span>
                    <span className="font-semibold text-slate-500">{bill.category}</span>
                  </div>

                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      bill.status === 'PASSED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : bill.status === 'ARBITRATION_REQUIRED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>

                {/* Title & Proposer */}
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">{bill.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{bill.description}</p>
                </div>

                {/* Quorum Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Quorum Progress ({bill.votes.length} / 4 Voted)</span>
                    <span className="text-emerald-600">{passVotes} Pass · {vetoVotes} Veto</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 transition-all duration-300"
                      style={{ width: `${(passVotes / 4) * 100}%` }}
                    />
                    <div
                      className="bg-rose-500 transition-all duration-300"
                      style={{ width: `${(vetoVotes / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* AI Arbitrator Box if Arbitration required or rendered */}
                {bill.aiArbitratorVerdict && (
                  <div className="p-3.5 rounded-xl bg-champagne-50/70 border border-champagne-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-champagne-900">
                      <Cpu className="w-3.5 h-3.5 text-champagne-600" />
                      <span>Brutal AI Arbitrator Ruling</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug font-medium">
                      {bill.aiArbitratorVerdict.recommendedResolution}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={proposer.avatar} alt={proposer.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-[11px] text-slate-500">Proposed by <strong className="text-slate-800">{proposer.name}</strong></span>
                </div>

                {bill.status === 'OPEN' && !hasVoted ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVote(bill.id, 'PASS')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Pass</span>
                    </button>

                    <button
                      onClick={() => setActiveReasonModalBillId(bill.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Veto</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">
                    {hasVoted ? 'You already cast vote' : 'Legislation concluded'}
                  </span>
                )}
              </div>

              {/* Veto Reason Modal Drawer */}
              {activeReasonModalBillId === bill.id && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mt-2">
                  <label className="text-[11px] font-bold text-slate-700 block">State reason for Veto:</label>
                  <input
                    type="text"
                    placeholder="e.g. Can only afford Ksh 100/mo or scheduling conflict..."
                    value={vetoReasonInput[bill.id] || ''}
                    onChange={(e) => setVetoReasonInput({ ...vetoReasonInput, [bill.id]: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveReasonModalBillId(null)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleVetoSubmit(bill.id)}
                      className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold"
                    >
                      Confirm Veto
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
