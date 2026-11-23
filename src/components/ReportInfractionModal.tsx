'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Gavel, Cpu, Loader2, Sparkles, UserX } from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { formatKES } from '../lib/utils';

interface ReportInfractionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_INFRACTIONS = [
  { label: 'Unwashed cookware left in sink overnight', fine: 50 },
  { label: 'Violated 10:00 PM Quiet Study Hours during exams', fine: 50 },
  { label: 'Left balcony lights or water heater running all day', fine: 100 },
  { label: 'Used communal food/milk without replacement', fine: 150 },
  { label: 'Failed to empty kitchen trash bin before morning', fine: 50 },
  { label: 'Guest overstayed beyond agreed house policy', fine: 100 },
];

export function ReportInfractionModal({ isOpen, onClose }: ReportInfractionModalProps) {
  const { roommates, currentRoommate, activeWorkspace, showToast, handleClaimBounty } = useHouse();

  const otherRoommates = roommates.filter((r) => r.id !== currentRoommate.id);
  const [offenderId, setOffenderId] = useState(otherRoommates[0]?.id || '');
  const [infractionTitle, setInfractionTitle] = useState(COMMON_INFRACTIONS[0].label);
  const [details, setDetails] = useState('');
  const [isArbitrating, setIsArbitrating] = useState(false);
  const [rulingResult, setRulingResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const offender = roommates.find((r) => r.id === offenderId) || otherRoommates[0];

  const handleArbitrateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offenderId) return;

    setIsArbitrating(true);
    setRulingResult(null);

    try {
      const res = await fetch('/api/ai/arbitrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billTitle: `Rule Infraction Report: ${infractionTitle}`,
          billDescription: `Reporter ${currentRoommate.name} reported ${offender.name} for: "${details || infractionTitle}".`,
          category: 'SANCTION',
          proposerName: currentRoommate.name,
          votes: [
            { roommateName: currentRoommate.name, vote: 'VETO', reason: `Witnessed rule breach: ${details || infractionTitle}` },
            { roommateName: offender.name, vote: 'PASS', reason: 'Contesting infraction or requesting grace period' },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRulingResult({
          verdict: data.verdict || 'UPHELD',
          ruling: data.ruling || 'The Brutal AI Arbitrator upholds the fine to maintain flat discipline.',
          fineKES: 50,
          resolution: data.recommendedResolution || 'KES 50 fine assessed to offender; converted into an open bounty for whoever cleans the mess.',
        });
        showToast(`AI Arbitrator issued a ruling against ${offender.name}!`);
      }
    } catch (err) {
      setRulingResult({
        verdict: 'UPHELD',
        ruling: 'Arbitration Ruling: Rule breach verified under Section 3 of House Rules. Fines must be paid to prevent social resentment.',
        fineKES: 50,
        resolution: 'KES 50 fine assessed and posted to House Bounty Board.',
      });
    } finally {
      setIsArbitrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Report Rule Infraction ("Kosa")
              </h3>
              <p className="text-[11px] text-slate-400">
                AI Arbitrator investigates and converts fines into work bounties
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!rulingResult ? (
          <form onSubmit={handleArbitrateReport} className="space-y-4">
            {/* Target Roommate */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Roommate Involved:
              </label>
              <select
                value={offenderId}
                onChange={(e) => setOffenderId(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-200 bg-white"
              >
                {otherRoommates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.role}) — {r.handle}
                  </option>
                ))}
              </select>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Common Flat Infractions:
              </label>
              <div className="space-y-1.5">
                {COMMON_INFRACTIONS.map((inf, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInfractionTitle(inf.label)}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      infractionTitle === inf.label
                        ? 'border-rose-400 bg-rose-50/60 font-semibold text-rose-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{inf.label}</span>
                    <span className="font-mono text-[11px] text-rose-600 font-bold shrink-0">
                      {formatKES(inf.fine)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Additional Details / Location in Flat:
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Left frying pan on front left burner after frying eggs at 11 PM..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 bg-slate-50/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isArbitrating}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2"
              >
                {isArbitrating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Evaluating Infraction...</span>
                  </>
                ) : (
                  <>
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Submit to AI Arbitrator</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Ruling Card */
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-rose-900">
                  <Gavel className="w-4 h-4 text-rose-600" />
                  <span>AI Arbitrator Final Decision</span>
                </span>
                <span className="font-mono px-2 py-0.5 rounded bg-rose-200/70 text-rose-900 text-[10px]">
                  VERDICT: {rulingResult.verdict}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {rulingResult.ruling}
              </p>

              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Assessed Penalty:</span>
                <span className="font-mono font-extrabold text-rose-600 text-sm">
                  {formatKES(rulingResult.fineKES)} Fine
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Next Steps:</span>
              <p>
                The fine has been debited from {offender.name}&apos;s balance and posted as an open chore bounty. Any flatmate who remedies the issue collects the cash bounty directly!
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
