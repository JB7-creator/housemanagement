'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Workspace,
  Roommate,
  Expense,
  Chore,
  ParliamentBill,
  EmergencyFundState,
} from '../lib/types';
import {
  INITIAL_ROOMMATES,
  INITIAL_EXPENSES,
  INITIAL_CHORES,
  INITIAL_BILLS,
  INITIAL_EMERGENCY_FUND,
} from '../lib/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULT_WORKSPACE: Workspace = {
  id: 'ws_roysambu_4b',
  name: 'Flat 4B Roysambu Crew',
  inviteCode: 'ROYS-402',
  location: 'Roysambu, Lumumba Drive',
  monthlyRentKES: 32000,
  rentDueDay: 5,
  createdAt: '2026-11-01',
};

interface HouseContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspaceId: (id: string) => void;
  handleCreateWorkspace: (ws: Workspace) => void;

  roommates: Roommate[];
  currentRoommate: Roommate;
  setCurrentRoommateId: (id: string) => void;
  handleInviteRoommate: (member: Roommate) => void;

  expenses: Expense[];
  handleAddExpense: (expense: Expense) => void;

  chores: Chore[];
  handleClaimBounty: (choreId: string) => void;
  handleRateChore: (choreId: string, rating: number) => void;

  bills: ParliamentBill[];
  handleVoteBill: (billId: string, vote: 'PASS' | 'VETO', reason?: string) => void;
  handleArbitrationVerdict: (
    billId: string,
    verdict: { summary: string; recommendedResolution: string; decisionTimestamp: string }
  ) => void;
  handleCreateBill: (bill: Partial<ParliamentBill>) => void;

  fund: EmergencyFundState;

  // Modals & Notifications
  isMpesaModalOpen: boolean;
  setIsMpesaModalOpen: (open: boolean) => void;
  isWorkspaceModalOpen: boolean;
  setIsWorkspaceModalOpen: (open: boolean) => void;
  workspaceModalMode: 'CREATE_WORKSPACE' | 'INVITE_MEMBER';
  setWorkspaceModalMode: (mode: 'CREATE_WORKSPACE' | 'INVITE_MEMBER') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isInfractionModalOpen: boolean;
  setIsInfractionModalOpen: (open: boolean) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export function HouseProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([DEFAULT_WORKSPACE]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(DEFAULT_WORKSPACE.id);

  const [roommates, setRoommates] = useState<Roommate[]>(INITIAL_ROOMMATES);
  const [currentRoommateId, setCurrentRoommateId] = useState<string>(INITIAL_ROOMMATES[0].id);

  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [chores, setChores] = useState<Chore[]>(INITIAL_CHORES);
  const [bills, setBills] = useState<ParliamentBill[]>(INITIAL_BILLS);
  const [fund, setFund] = useState<EmergencyFundState>(INITIAL_EMERGENCY_FUND);

  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceModalMode, setWorkspaceModalMode] = useState<'CREATE_WORKSPACE' | 'INVITE_MEMBER'>('CREATE_WORKSPACE');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInfractionModalOpen, setIsInfractionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const currentRoommate = roommates.find((r) => r.id === currentRoommateId) || roommates[0];

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || '';
          const name = session.user.user_metadata?.full_name || email.split('@')[0];
          setRoommates((prev) => {
            const exists = prev.some((r) => r.id === session.user.id || r.name.toLowerCase() === name.toLowerCase());
            if (exists) return prev;
            return [
              ...prev,
              {
                id: session.user.id,
                workspaceId: activeWorkspaceId,
                name: name,
                handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
                phone: session.user.user_metadata?.phone_number || '',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
                role: 'member',
                bio: 'Flatmate at ' + activeWorkspace.name,
                diet: ['all', 'greens_lover'],
                examPeriod: false,
                availabilityScore: 1.0,
                karmaScore: 100,
                streakWeeks: 0,
              },
            ];
          });
        }
      });
    }
  }, [activeWorkspaceId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateWorkspace = (newWs: Workspace) => {
    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspaceId(newWs.id);
    showToast(`Created workspace: ${newWs.name}! Share code: ${newWs.inviteCode}`);
  };

  const handleInviteRoommate = (newMember: Roommate) => {
    setRoommates((prev) => [...prev, newMember]);
    showToast(`Added ${newMember.name} to ${activeWorkspace.name}!`);
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Recorded ${newExpense.title} (${newExpense.totalAmount} KES)`);
  };

  const handleClaimBounty = (choreId: string) => {
    setChores((prev) =>
      prev.map((c) =>
        c.id === choreId
          ? { ...c, status: 'COMPLETED', rating: 5, assignedToId: currentRoommate.id }
          : c
      )
    );
    showToast(`${currentRoommate.name} claimed KES 50 bounty!`);
  };

  const handleRateChore = (choreId: string, rating: number) => {
    setChores((prev) =>
      prev.map((c) => (c.id === choreId ? { ...c, rating } : c))
    );
    showToast(`Rated chore ${rating}/5 stars.`);
  };

  const handleVoteBill = (billId: string, vote: 'PASS' | 'VETO', reason?: string) => {
    setBills((prev) =>
      prev.map((b) => {
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
          return { ...b, votes: updatedVotes, status };
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
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? { ...b, status: 'PASSED', aiArbitratorVerdict: verdict }
          : b
      )
    );
    showToast('AI Arbitrator has rendered a binding verdict!');
  };

  const handleCreateBill = (newBill: Partial<ParliamentBill>) => {
    const fullBill: ParliamentBill = {
      id: `bill_${Date.now()}`,
      billNumber: bills.length + 42,
      proposerId: currentRoommate.id,
      title: newBill.title || 'Untitled Proposal',
      description: newBill.description || '',
      category: newBill.category || 'POLICY',
      status: 'OPEN',
      votes: [
        {
          roommateId: currentRoommate.id,
          vote: 'PASS',
          reason: 'Proposer vote',
          timestamp: 'Just now',
        },
      ],
      quorumNeeded: Math.max(2, Math.ceil(roommates.length * 0.67)),
      expiresAt: new Date(Date.now() + 3 * 86400000).toISOString(),
    };
    setBills((prev) => [fullBill, ...prev]);
    showToast(`Proposed Bill #${fullBill.billNumber}!`);
  };

  return (
    <HouseContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspaceId,
        handleCreateWorkspace,
        roommates,
        currentRoommate,
        setCurrentRoommateId,
        handleInviteRoommate,
        expenses,
        handleAddExpense,
        chores,
        handleClaimBounty,
        handleRateChore,
        bills,
        handleVoteBill,
        handleArbitrationVerdict,
        handleCreateBill,
        fund,
        isMpesaModalOpen,
        setIsMpesaModalOpen,
        isWorkspaceModalOpen,
        setIsWorkspaceModalOpen,
        workspaceModalMode,
        setWorkspaceModalMode,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isInfractionModalOpen,
        setIsInfractionModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
}

export function useHouse() {
  const context = useContext(HouseContext);
  if (!context) {
    throw new Error('useHouse must be used within a HouseProvider');
  }
  return context;
}
