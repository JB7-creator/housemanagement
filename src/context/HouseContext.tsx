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

// Tag initial seed data with the default workspace ID
const SEED_ROOMMATES = INITIAL_ROOMMATES.map((r) => ({
  ...r,
  workspaceId: r.workspaceId || DEFAULT_WORKSPACE.id,
}));

const SEED_EXPENSES = INITIAL_EXPENSES.map((e) => ({
  ...e,
  workspaceId: e.workspaceId || DEFAULT_WORKSPACE.id,
}));

const SEED_CHORES = INITIAL_CHORES.map((c) => ({
  ...c,
  workspaceId: c.workspaceId || DEFAULT_WORKSPACE.id,
}));

const SEED_BILLS = INITIAL_BILLS.map((b) => ({
  ...b,
  workspaceId: b.workspaceId || DEFAULT_WORKSPACE.id,
}));

interface HouseContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspaceId: (id: string) => void;
  handleCreateWorkspace: (ws: Workspace) => void;
  handleJoinWorkspaceByCode: (code: string) => boolean;

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
  workspaceModalMode: 'CREATE_WORKSPACE' | 'INVITE_MEMBER' | 'JOIN_WORKSPACE';
  setWorkspaceModalMode: (mode: 'CREATE_WORKSPACE' | 'INVITE_MEMBER' | 'JOIN_WORKSPACE') => void;
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
  // Master Lists across all workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>([DEFAULT_WORKSPACE]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(DEFAULT_WORKSPACE.id);

  const [allRoommates, setAllRoommates] = useState<Roommate[]>(SEED_ROOMMATES);
  const [currentRoommateId, setCurrentRoommateId] = useState<string>(SEED_ROOMMATES[0].id);

  const [allExpenses, setAllExpenses] = useState<Expense[]>(SEED_EXPENSES);
  const [allChores, setAllChores] = useState<Chore[]>(SEED_CHORES);
  const [allBills, setAllBills] = useState<ParliamentBill[]>(SEED_BILLS);
  const [fund, setFund] = useState<EmergencyFundState>(INITIAL_EMERGENCY_FUND);

  // Modals
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceModalMode, setWorkspaceModalMode] = useState<'CREATE_WORKSPACE' | 'INVITE_MEMBER' | 'JOIN_WORKSPACE'>('CREATE_WORKSPACE');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInfractionModalOpen, setIsInfractionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active workspace object
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  // Dynamically filter data strictly for the active workspace
  const roommates = allRoommates.filter((r) => r.workspaceId === activeWorkspace.id);
  const expenses = allExpenses.filter((e) => e.workspaceId === activeWorkspace.id);
  const chores = allChores.filter((c) => c.workspaceId === activeWorkspace.id);
  const bills = allBills.filter((b) => b.workspaceId === activeWorkspace.id);

  // Fallback safe roommate for this workspace
  const currentRoommate =
    roommates.find((r) => r.id === currentRoommateId) ||
    roommates[0] || {
      id: `lead_${activeWorkspace.id}`,
      workspaceId: activeWorkspace.id,
      name: 'Flat Coordinator',
      handle: '@flat_lead',
      phone: '0712345678',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeWorkspace.id}`,
      role: 'coordinator',
      bio: `Coordinator at ${activeWorkspace.name}`,
      diet: ['all', 'greens_lover'],
      examPeriod: false,
      availabilityScore: 1.0,
      karmaScore: 100,
      streakWeeks: 0,
    };

  // Keep currentRoommateId aligned with active workspace members
  useEffect(() => {
    if (roommates.length > 0 && !roommates.some((r) => r.id === currentRoommateId)) {
      setCurrentRoommateId(roommates[0].id);
    }
  }, [activeWorkspaceId, roommates, currentRoommateId]);

  // Sync Supabase Auth session on mount
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || '';
          const name = session.user.user_metadata?.full_name || email.split('@')[0];
          setAllRoommates((prev) => {
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

  // Create New Flat Workspace with its own isolated creator, chores, and bill
  const handleCreateWorkspace = (newWs: Workspace) => {
    // 1. Isolated Coordinator for the new flat
    const newCoordinator: Roommate = {
      id: `coord_${Date.now()}`,
      workspaceId: newWs.id,
      name: currentRoommate ? currentRoommate.name : 'Flat Coordinator',
      handle: `@${(currentRoommate ? currentRoommate.name : 'coordinator').toLowerCase().replace(/\s+/g, '_')}`,
      phone: currentRoommate ? currentRoommate.phone : '0712345678',
      avatar: currentRoommate ? currentRoommate.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${newWs.id}`,
      role: 'coordinator',
      bio: `Founder & Coordinator of ${newWs.name}`,
      diet: currentRoommate ? currentRoommate.diet : ['all', 'greens_lover'],
      examPeriod: false,
      availabilityScore: 1.0,
      karmaScore: 100,
      streakWeeks: 0,
    };

    // 2. Isolated Starter Chores for this new flat
    const starterChores: Chore[] = [
      {
        id: `chore_${Date.now()}_1`,
        workspaceId: newWs.id,
        title: 'Kitchen Counter & Gas Cooker Sanitization',
        description: 'Wipe burners, scrub grease traps, wash communal utensils',
        difficulty: 3,
        frequency: 'daily',
        assignedToId: newCoordinator.id,
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '20:00',
        status: 'PENDING',
        bountyKES: 50,
      },
      {
        id: `chore_${Date.now()}_2`,
        workspaceId: newWs.id,
        title: 'Balcony & Estate Trash Dumpster Run',
        description: 'Collect trash bags and drop at estate garbage collection point',
        difficulty: 2,
        frequency: 'daily',
        assignedToId: newCoordinator.id,
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '21:00',
        status: 'BOUNTY_OPEN',
        bountyKES: 50,
      },
    ];

    // 3. Isolated Starter Bill for this new flat
    const starterBill: ParliamentBill = {
      id: `bill_${Date.now()}`,
      workspaceId: newWs.id,
      billNumber: 1,
      proposerId: newCoordinator.id,
      title: 'Ratify Flat Rules: Quiet Hours & Grocery Split Agreement',
      description: 'Establishes 10:00 PM study hours on weekdays, vegetarian non-meat split immunity, and Ksh 50 bounty system.',
      category: 'POLICY',
      status: 'OPEN',
      votes: [
        { roommateId: newCoordinator.id, vote: 'PASS', reason: 'Founding flat charter', timestamp: 'Just now' },
      ],
      quorumNeeded: 1,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    };

    setWorkspaces((prev) => [...prev, newWs]);
    setAllRoommates((prev) => [...prev, newCoordinator]);
    setAllChores((prev) => [...starterChores, ...prev]);
    setAllBills((prev) => [starterBill, ...prev]);
    setActiveWorkspaceId(newWs.id);
    setCurrentRoommateId(newCoordinator.id);

    showToast(`Created new flat "${newWs.name}"! Share invite code: ${newWs.inviteCode}`);
  };

  // Join existing flat workspace by its invite code
  const handleJoinWorkspaceByCode = (inviteCode: string): boolean => {
    const cleanCode = inviteCode.trim().toUpperCase();
    const foundWs = workspaces.find((w) => w.inviteCode.toUpperCase() === cleanCode);

    if (foundWs) {
      setActiveWorkspaceId(foundWs.id);
      showToast(`Switched into ${foundWs.name}!`);
      return true;
    } else {
      showToast(`Invalid invite code "${cleanCode}". Please verify with your flat coordinator.`);
      return false;
    }
  };

  // Invite Roommate to active workspace
  const handleInviteRoommate = (newMember: Roommate) => {
    const memberWithWs: Roommate = {
      ...newMember,
      workspaceId: activeWorkspace.id,
    };
    setAllRoommates((prev) => [...prev, memberWithWs]);
    showToast(`Added ${newMember.name} to ${activeWorkspace.name}!`);
  };

  // Add Expense to active workspace
  const handleAddExpense = (newExpense: Expense) => {
    const expenseWithWs: Expense = {
      ...newExpense,
      workspaceId: activeWorkspace.id,
    };
    setAllExpenses((prev) => [expenseWithWs, ...prev]);
    showToast(`Recorded ${newExpense.title} (${newExpense.totalAmount} KES) in ${activeWorkspace.name}`);
  };

  // Claim Bounty within active workspace
  const handleClaimBounty = (choreId: string) => {
    setAllChores((prev) =>
      prev.map((c) =>
        c.id === choreId
          ? { ...c, status: 'COMPLETED', rating: 5, assignedToId: currentRoommate.id }
          : c
      )
    );
    showToast(`${currentRoommate.name} claimed KES 50 bounty!`);
  };

  // Rate Chore within active workspace
  const handleRateChore = (choreId: string, rating: number) => {
    setAllChores((prev) =>
      prev.map((c) => (c.id === choreId ? { ...c, rating } : c))
    );
    showToast(`Rated chore ${rating}/5 stars.`);
  };

  // Vote on Parliament Bill
  const handleVoteBill = (billId: string, vote: 'PASS' | 'VETO', reason?: string) => {
    setAllBills((prev) =>
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

  // Handle AI Arbitration Verdict
  const handleArbitrationVerdict = (
    billId: string,
    verdict: { summary: string; recommendedResolution: string; decisionTimestamp: string }
  ) => {
    setAllBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? { ...b, status: 'PASSED', aiArbitratorVerdict: verdict }
          : b
      )
    );
    showToast('AI Arbitrator has rendered a binding verdict!');
  };

  // Propose New Bill in active workspace
  const handleCreateBill = (newBill: Partial<ParliamentBill>) => {
    const fullBill: ParliamentBill = {
      id: `bill_${Date.now()}`,
      workspaceId: activeWorkspace.id,
      billNumber: bills.length + 1,
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
      quorumNeeded: Math.max(1, Math.ceil(roommates.length * 0.67)),
      expiresAt: new Date(Date.now() + 3 * 86400000).toISOString(),
    };
    setAllBills((prev) => [fullBill, ...prev]);
    showToast(`Proposed Bill #${fullBill.billNumber}!`);
  };

  return (
    <HouseContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspaceId,
        handleCreateWorkspace,
        handleJoinWorkspaceByCode,
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
