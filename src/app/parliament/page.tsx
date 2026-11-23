'use client';

import React, { useState } from 'react';
import { ParliamentSection } from '../../components/ParliamentSection';
import { useHouse } from '../../context/HouseContext';
import { Plus, Gavel, X } from 'lucide-react';

export default function ParliamentPage() {
  const {
    bills,
    roommates,
    currentRoommate,
    handleVoteBill,
    handleArbitrationVerdict,
    handleCreateBill,
  } = useHouse();

  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'POLICY' | 'EXPENSE' | 'AMENITY'>('POLICY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    handleCreateBill({ title, description, category });
    setTitle('');
    setDescription('');
    setIsProposeModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Propose Bill CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50/60 to-champagne-50/40 border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            House Parliament & AI Arbitrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Democratic bills for flat policies, Wi-Fi upgrades, and quiet hours. Deadlocks are arbitrated with our brutal AI judge.
          </p>
        </div>

        <button
          onClick={() => setIsProposeModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Propose New Bill</span>
        </button>
      </div>

      <ParliamentSection
        bills={bills}
        roommates={roommates}
        currentRoommate={currentRoommate}
        onVote={handleVoteBill}
        onRequestArbitration={handleArbitrationVerdict}
      />

      {/* Propose Bill Modal */}
      {isProposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-electric-500" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Propose House Legislation
                </h3>
              </div>
              <button
                onClick={() => setIsProposeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Bill Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement No-Shoes Policy in Living Room"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="POLICY">House Policy / Rule</option>
                  <option value="EXPENSE">Communal Expense</option>
                  <option value="AMENITY">Apartment Amenity</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Detailed Justification
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain why this proposal is fair and beneficial to the household..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
