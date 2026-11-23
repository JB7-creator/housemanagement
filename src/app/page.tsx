'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { DebtHeatmap } from '../components/DebtHeatmap';
import { RoommateProfiles } from '../components/RoommateProfiles';
import { ExpenseHistory } from '../components/ExpenseHistory';
import { ChoreBoard } from '../components/ChoreBoard';
import { ParliamentSection } from '../components/ParliamentSection';
import { EmergencyFundCard } from '../components/EmergencyFundCard';
import { ShoppingListBuilder } from '../components/ShoppingListBuilder';
import { MpesaPasteModal } from '../components/MpesaPasteModal';
import { WorkspaceModal } from '../components/WorkspaceModal';
import { FooterSection } from '../components/FooterSection';
import {
  INITIAL_ROOMMATES,
  INITIAL_EXPENSES,
  INITIAL_CHORES,
  INITIAL_BILLS,
  INITIAL_EMERGENCY_FUND,
} from '../lib/mockData';
import { Expense, Chore, ParliamentBill, Workspace, Roommate } from '../lib/types';
import { Sparkles } from 'lucide-react';

const DEFAULT_WORKSPACE: Workspace = {
  id: 'ws_roysambu_4b',
  name: 'Flat 4B Roysambu Crew',
  inviteCode: 'ROYS-402',
  location: 'Roysambu, Lumumba Drive',
  monthlyRentKES: 32000,
  rentDueDay: 5,
  createdAt: '2026-11-01',
};

export default function HomePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([DEFAULT_WORKSPACE]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(DEFAULT_WORKSPACE.id);

  const [roommates, setRoommates] = useState<Roommate[]>(INITIAL_ROOMMATES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [chores, setChores] = useState<Chore[]>(INITIAL_CHORES);
  const [bills, setBills] = useState<ParliamentBill[]>(INITIAL_BILLS);
  const [fund, setFund] = useState(INITIAL_EMERGENCY_FUND);

  const [currentRoommateId, setCurrentRoommateId] = useState(roommates[0]?.id || 'roomie_1');
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceModalMode, setWorkspaceModalMode] = useState<'CREATE_WORKSPACE' | 'INVITE_MEMBER'>('CREATE_WORKSPACE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const currentRoommate = roommates.find((r) => r.id === currentRoommateId) || roommates[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateWorkspace = (newWs: Workspace) => {
    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspaceId(newWs.id);
    showToast(`Created workspace: ${newWs.name}! Share code ${newWs.inviteCode} with flatmates.`);
  };

  const handleInviteRoommate = (newMember: Roommate) => {
    setRoommates((prev) => [...prev, newMember]);
    showToast(`Added ${newMember.name} (${newMember.handle}) to ${activeWorkspace.name}!`);
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
            assignedToId: currentRoommate.id,
          };
        }
        return c;
      })
    );
    showToast(`${currentRoommate.name} claimed KES 50 bounty and verified chore completion!`);
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

  const handleArbitrationVerdict = (
    billId: string,
    verdict: { summary: string; recommendedResolution: string; decisionTimestamp: string }
  ) => {
    setBills(
      bills.map((b) => {
        if (b.id === billId) {
          return {
            ...b,
            status: 'PASSED',
            aiArbitratorVerdict: verdict,
          };
        }
        return b;
      })
    );
    showToast('Brutal AI Arbitrator has rendered a final, binding decision on the bill!');
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

      {/* Navigation with Multi-Workspace support */}
      <Navbar
        currentRoommate={currentRoommate}
        roommates={roommates}
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onOpenMpesaModal={() => setIsMpesaModalOpen(true)}
        onSelectRoommate={(id) => setCurrentRoommateId(id)}
        onSelectWorkspace={(id) => {
          setActiveWorkspaceId(id);
          const ws = workspaces.find((w) => w.id === id);
          if (ws) showToast(`Switched to workspace: ${ws.name}`);
        }}
        onOpenCreateWorkspace={() => {
          setWorkspaceModalMode('CREATE_WORKSPACE');
          setIsWorkspaceModalOpen(true);
        }}
        onOpenInviteMember={() => {
          setWorkspaceModalMode('INVITE_MEMBER');
          setIsWorkspaceModalOpen(true);
        }}
      />

      {/* Hero Section with Live Simulator */}
      <HeroSection
        onOpenMpesa={() => setIsMpesaModalOpen(true)}
        onExploreParliament={() => handleScrollToSection('parliament-section')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Module 1: Roommate Profiles Directory */}
        <section id="profiles-section">
          <RoommateProfiles roommates={roommates} />
        </section>

        {/* Module 2: Visual Debt Heatmap & Directed Settlements */}
        <section id="debt-section">
          <DebtHeatmap
            roommates={roommates}
            expenses={expenses}
            onSettleSuccess={({ fromName, toName, amount }) =>
              showToast(`Verified M-Pesa transfer: ${fromName} paid ${toName} Ksh ${amount}`)
            }
          />
        </section>

        {/* Module 3: Expense Ledger & Line-Item Sub-Splits */}
        <section id="ledger-section">
          <ExpenseHistory expenses={expenses} roommates={roommates} />
        </section>

        {/* Module 4: Envy-Free Weekly Chore Board */}
        <section id="chores-section">
          <ChoreBoard
            chores={chores}
            roommates={roommates}
            onClaimBounty={handleClaimBounty}
            onRateChore={handleRateChore}
          />
        </section>

        {/* Module 5: House Parliament & Democratic Bills */}
        <section id="parliament-section">
          <ParliamentSection
            bills={bills}
            roommates={roommates}
            currentRoommate={currentRoommate}
            onVote={handleVoteBill}
            onRequestArbitration={handleArbitrationVerdict}
          />
        </section>

        {/* Module 6: Market Shopping List & Dietary Sub-Splitter */}
        <section id="shopping-section">
          <ShoppingListBuilder roommates={roommates} />
        </section>

        {/* Module 7: House Emergency Sinking Fund & Buffer Pool */}
        <section id="emergency-section">
          <EmergencyFundCard fund={fund} roommates={roommates} />
        </section>
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Modals */}
      <MpesaPasteModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        roommates={roommates}
        onAddExpense={handleAddExpense}
      />

      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        mode={workspaceModalMode}
        activeWorkspace={activeWorkspace}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
        onInviteRoommate={handleInviteRoommate}
      />
    </div>
  );
}
