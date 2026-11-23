'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { DebtHeatmap } from '../components/DebtHeatmap';
import { ChoreBoard } from '../components/ChoreBoard';
import { ParliamentSection } from '../components/ParliamentSection';
import { EmergencyFundCard } from '../components/EmergencyFundCard';
import { ShoppingListBuilder } from '../components/ShoppingListBuilder';
import { MpesaPasteModal } from '../components/MpesaPasteModal';
import { FooterSection } from '../components/FooterSection';
import {
  INITIAL_ROOMMATES,
  INITIAL_EXPENSES,
  INITIAL_CHORES,
  INITIAL_BILLS,
  INITIAL_EMERGENCY_FUND,
} from '../lib/mockData';
import { Expense, Chore, ParliamentBill } from '../lib/types';
import { ShieldCheck, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [roommates, setRoommates] = useState(INITIAL_ROOMMATES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [chores, setChores] = useState<Chore[]>(INITIAL_CHORES);
  const [bills, setBills] = useState<ParliamentBill[]>(INITIAL_BILLS);
  const [fund, setFund] = useState(INITIAL_EMERGENCY_FUND);

  const [currentRoommateId, setCurrentRoommateId] = useState(roommates[0].id);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentRoommate = roommates.find((r) => r.id === currentRoommateId) || roommates[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses([newExpense, ...expenses]);
    showToast(`Recorded ${newExpense.title} (${newExpense.totalAmount} KES) to house ledger!`);
  };

  const handleClaimBounty = (choreId: string) => {
    setChores(
      chores.map((c) => {
        if (c.id === choreId) {
          return {
            ...c,
            status: 'COMPLETED',
            rating: 5,
            assignedToId: currentRoommate.id, // Claimed by viewer
          };
        }
        return c;
      })
    );
    showToast(`${currentRoommate.name} claimed KES 50 bounty and completed the chore!`);
  };

  const handleRateChore = (choreId: string, rating: number) => {
    setChores(
      chores.map((c) => {
        if (c.id === choreId) {
          return { ...c, rating };
        }
        return c;
      })
    );
    showToast(`Rated chore ${rating}/5 stars.`);
  };

  const handleVoteBill = (billId: string, vote: 'PASS' | 'VETO', reason?: string) => {
    setBills(
      bills.map((b) => {
        if (b.id === billId) {
          const updatedVotes = [
            ...b.votes.filter((v) => v.roommateId !== currentRoommate.id),
            {
              roommateId: currentRoommate.id,
              vote,
              reason: reason || (vote === 'PASS' ? 'Supported' : 'Objected'),
              timestamp: 'Just now',
            },
          ];

          const passCount = updatedVotes.filter((v) => v.vote === 'PASS').length;
          const status = passCount >= b.quorumNeeded ? 'PASSED' : b.status;

          return {
            ...b,
            votes: updatedVotes,
            status,
          };
        }
        return b;
      })
    );
    showToast(`Vote recorded: ${vote}`);
  };

  const handleRequestArbitration = (billId: string) => {
    showToast('AI Arbitrator summoned to evaluate conflicting house interests.');
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-champagne-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentRoommate={currentRoommate}
        roommates={roommates}
        onOpenMpesaModal={() => setIsMpesaModalOpen(true)}
        onSelectRoommate={(id) => setCurrentRoommateId(id)}
      />

      {/* Hero Section with Live Simulator */}
      <HeroSection
        onOpenMpesa={() => setIsMpesaModalOpen(true)}
        onExploreParliament={() => handleScrollToSection('parliament-section')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Module 1: Visual Debt Heatmap & Directed Settlements */}
        <section id="debt-section">
          <DebtHeatmap
            roommates={roommates}
            expenses={expenses}
            onSettleSuccess={({ fromName, toName, amount }) =>
              showToast(`Verified M-Pesa transfer: ${fromName} paid ${toName} Ksh ${amount}`)
            }
          />
        </section>

        {/* Module 2: Envy-Free Weekly Chore Board */}
        <section id="chores-section">
          <ChoreBoard
            chores={chores}
            roommates={roommates}
            onClaimBounty={handleClaimBounty}
            onRateChore={handleRateChore}
          />
        </section>

        {/* Module 3: House Parliament & Democratic Bills */}
        <section id="parliament-section">
          <ParliamentSection
            bills={bills}
            roommates={roommates}
            currentRoommate={currentRoommate}
            onVote={handleVoteBill}
            onRequestArbitration={handleRequestArbitration}
          />
        </section>

        {/* Module 4: Market Shopping List & Dietary Sub-Splitter */}
        <section id="shopping-section">
          <ShoppingListBuilder roommates={roommates} />
        </section>

        {/* Module 5: House Emergency Sinking Fund & Buffer Pool */}
        <section id="emergency-section">
          <EmergencyFundCard fund={fund} roommates={roommates} />
        </section>
      </main>

      {/* Footer */}
      <FooterSection />

      {/* M-Pesa Paste Modal */}
      <MpesaPasteModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        roommates={roommates}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
}
