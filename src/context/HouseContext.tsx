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

  // Authentication & Onboarding Gate
  isAuthenticated: boolean;
  isHydrated: boolean;
  allRoommates: Roommate[];
  loginUser: (roommateId: string) => void;
  logoutUser: () => void;
  registerAndOnboard: (
    user: Partial<Roommate>,
    workspaceChoice:
      | { mode: 'CREATE'; ws: { name: string; location?: string; monthlyRentKES?: number; rentDueDay?: number } }
      | { mode: 'JOIN'; inviteCode: string }
  ) => boolean;

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

  // Authentication & Onboarding Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Restore authenticated session from localStorage on client load
  useEffect(() => {
    setIsHydrated(true);
    try {
      const storedAuth = localStorage.getItem('roomjustice_is_authenticated');
      const storedRoomieId = localStorage.getItem('roomjustice_current_roommate_id');
      const storedWsId = localStorage.getItem('roomjustice_active_ws_id');

      if (storedAuth === 'true' && storedRoomieId) {
        if (storedWsId) {
          setActiveWorkspaceId(storedWsId);
        }
        setCurrentRoommateId(storedRoomieId);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('LocalStorage session read error:', e);
    }
  }, []);

  const loginUser = (roommateId: string) => {
    const found = allRoommates.find((r) => r.id === roommateId);
    if (!found) return;

    if (found.workspaceId) {
      setActiveWorkspaceId(found.workspaceId);
    }
    setCurrentRoommateId(found.id);
    setIsAuthenticated(true);

    try {
      localStorage.setItem('roomjustice_is_authenticated', 'true');
      localStorage.setItem('roomjustice_current_roommate_id', found.id);
      if (found.workspaceId) {
        localStorage.setItem('roomjustice_active_ws_id', found.workspaceId);
      }
    } catch (e) {}

    const ws = workspaces.find((w) => w.id === found.workspaceId) || DEFAULT_WORKSPACE;
    showToast(`Welcome, ${found.name}! Entered ${ws.name}.`);
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('roomjustice_is_authenticated');
      localStorage.removeItem('roomjustice_current_roommate_id');
      localStorage.removeItem('roomjustice_active_ws_id');
    } catch (e) {}
    showToast('Logged out of your profile. Please sign in to re-enter.');
  };

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

  // Create New Flat Workspace with its own rich isolated full environment
  const handleCreateWorkspace = (newWs: Workspace) => {
    const timestamp = Date.now();

    // 1. Coordinator for the new flat (Current User)
    const newCoordinator: Roommate = {
      id: `coord_${timestamp}`,
      workspaceId: newWs.id,
      name: currentRoommate ? currentRoommate.name : 'Flat Coordinator',
      handle: `@${(currentRoommate ? currentRoommate.name : 'coordinator').toLowerCase().replace(/\s+/g, '_')}`,
      phone: currentRoommate ? currentRoommate.phone : '0712345678',
      avatar: currentRoommate ? currentRoommate.avatar : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`,
      role: 'coordinator',
      bio: `Founder & Coordinator of ${newWs.name}`,
      diet: currentRoommate ? currentRoommate.diet : ['all', 'greens_lover'],
      examPeriod: false,
      availabilityScore: 1.0,
      karmaScore: 120,
      streakWeeks: 1,
    };

    // 2. Realistic Co-tenants / Roommates for a full living environment
    const roommateTreasurer: Roommate = {
      id: `roomie_${timestamp}_1`,
      workspaceId: newWs.id,
      name: 'Amani Kamau',
      handle: '@amani_k',
      phone: '0711223344',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      role: 'treasurer',
      bio: 'Finance & Accounting finalist · Safaricom M-Pesa ledger auditor',
      diet: ['all', 'greens_lover'],
      examPeriod: false,
      availabilityScore: 1.0,
      karmaScore: 135,
      streakWeeks: 4,
    };

    const roommateFaith: Roommate = {
      id: `roomie_${timestamp}_2`,
      workspaceId: newWs.id,
      name: 'Faith Chebet',
      handle: '@faith_c',
      phone: '0722334455',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      role: 'member',
      bio: 'Nursing student · Morning person · Vegetarian & Chapati chef',
      diet: ['vegetarian'],
      examPeriod: false,
      availabilityScore: 0.9,
      karmaScore: 110,
      streakWeeks: 3,
    };

    const roommateIan: Roommate = {
      id: `roomie_${timestamp}_3`,
      workspaceId: newWs.id,
      name: 'Ian Mutua',
      handle: '@ian_m',
      phone: '0733445566',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
      role: 'member',
      bio: 'Software Eng · Night owl gamer · Lactose intolerant',
      diet: ['lactose_intolerant', 'greens_lover'],
      examPeriod: false,
      availabilityScore: 1.0,
      karmaScore: 102,
      streakWeeks: 5,
    };

    const allNewRoommates = [newCoordinator, roommateTreasurer, roommateFaith, roommateIan];
    const memberIds = allNewRoommates.map((r) => r.id);

    // 3. Isolated Realistic Starter Expenses for this flat
    const starterExpenses: Expense[] = [
      {
        id: `exp_${timestamp}_1`,
        workspaceId: newWs.id,
        payerId: newCoordinator.id,
        title: 'Safaricom 5G Home Wi-Fi Setup (50Mbps)',
        category: 'HOUSE_BUFFER',
        totalAmount: 3500,
        date: 'Today, 10:30 AM',
        mpesaCode: `SAF${Math.floor(100000 + Math.random() * 900000)}`,
        verified: true,
        items: [
          {
            id: `item_${timestamp}_1`,
            name: 'Monthly Unlimited 5G Fibre Router',
            cost: 3500,
            category: 'utilities',
            participantIds: memberIds,
          },
        ],
      },
      {
        id: `exp_${timestamp}_2`,
        workspaceId: newWs.id,
        payerId: roommateTreasurer.id,
        title: '13kg K-Gas Communal Cylinder Refill',
        category: 'GAS',
        totalAmount: 2900,
        date: 'Yesterday, 3:15 PM',
        mpesaCode: `GAS${Math.floor(100000 + Math.random() * 900000)}`,
        verified: true,
        items: [
          {
            id: `item_${timestamp}_2`,
            name: 'TotalEnergies 13kg Gas Refill',
            cost: 2900,
            category: 'utilities',
            participantIds: memberIds,
          },
        ],
      },
      {
        id: `exp_${timestamp}_3`,
        workspaceId: newWs.id,
        payerId: roommateFaith.id,
        title: 'Market Fresh Sukuma & Veggies Run',
        category: 'GROCERIES',
        totalAmount: 850,
        date: 'Yesterday, 6:00 PM',
        mpesaCode: `VEG${Math.floor(100000 + Math.random() * 900000)}`,
        verified: true,
        items: [
          {
            id: `item_${timestamp}_3`,
            name: 'Sukuma Wiki & Terere',
            cost: 200,
            category: 'greens',
            participantIds: memberIds,
          },
          {
            id: `item_${timestamp}_4`,
            name: 'Managu Fresh Bundle',
            cost: 250,
            category: 'greens',
            participantIds: [newCoordinator.id, roommateTreasurer.id, roommateIan.id],
          },
          {
            id: `item_${timestamp}_5`,
            name: 'Irish Potatoes (Waru) & Onions',
            cost: 400,
            category: 'carbs',
            participantIds: memberIds,
          },
        ],
      },
      {
        id: `exp_${timestamp}_4`,
        workspaceId: newWs.id,
        payerId: roommateIan.id,
        title: 'Communal Vim Disinfectant, Mop & Brooms',
        category: 'GROCERIES',
        totalAmount: 620,
        date: '2 days ago',
        mpesaCode: `VIM${Math.floor(100000 + Math.random() * 900000)}`,
        verified: true,
        items: [
          {
            id: `item_${timestamp}_6`,
            name: 'Vim Scourer & Floor Mop',
            cost: 620,
            category: 'cleaning',
            participantIds: memberIds,
          },
        ],
      },
    ];

    // 4. Isolated Starter Chores for this new flat
    const starterChores: Chore[] = [
      {
        id: `chore_${timestamp}_1`,
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
        id: `chore_${timestamp}_2`,
        workspaceId: newWs.id,
        title: 'Balcony & Estate Trash Dumpster Run',
        description: 'Collect trash bags and drop at estate garbage collection point',
        difficulty: 2,
        frequency: 'daily',
        assignedToId: roommateIan.id,
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '21:00',
        status: 'PENDING',
        bountyKES: 50,
      },
      {
        id: `chore_${timestamp}_3`,
        workspaceId: newWs.id,
        title: 'Bathroom Scrubbing & Vim Disinfection',
        description: 'Scrub tiles, sanitize toilet bowl, wipe mirror and taps',
        difficulty: 4,
        frequency: 'twice_weekly',
        assignedToId: roommateFaith.id,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dueTime: '18:00',
        status: 'PENDING',
        bountyKES: 100,
      },
      {
        id: `chore_${timestamp}_4`,
        workspaceId: newWs.id,
        title: '20L Drinking Water Purifier Refill Run',
        description: 'Refill 4 water bottles from the water station at gate',
        difficulty: 2,
        frequency: 'weekly',
        assignedToId: roommateTreasurer.id,
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '17:00',
        status: 'BOUNTY_OPEN',
        bountyKES: 50,
      },
    ];

    // 5. Isolated Starter Bills for this new flat
    const starterBills: ParliamentBill[] = [
      {
        id: `bill_${timestamp}_1`,
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
        quorumNeeded: 3,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      },
      {
        id: `bill_${timestamp}_2`,
        workspaceId: newWs.id,
        billNumber: 2,
        proposerId: roommateTreasurer.id,
        title: 'Ratify High-Speed Wi-Fi & Electricity Equal Share Protocol',
        description: 'All 4 flatmates contribute equal Ksh 875/month for 50Mbps unlimited internet on the 1st of every month.',
        category: 'EXPENSE',
        status: 'PASSED',
        votes: [
          { roommateId: roommateTreasurer.id, vote: 'PASS', reason: 'Essential for study & coursework', timestamp: 'Yesterday' },
          { roommateId: roommateFaith.id, vote: 'PASS', reason: 'Agreed, shared cost is minimal', timestamp: 'Yesterday' },
          { roommateId: newCoordinator.id, vote: 'PASS', reason: 'Ratified by Coordinator', timestamp: 'Just now' },
        ],
        quorumNeeded: 3,
        expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
      },
    ];

    setWorkspaces((prev) => [...prev, newWs]);
    setAllRoommates((prev) => [...prev, ...allNewRoommates]);
    setAllExpenses((prev) => [...starterExpenses, ...prev]);
    setAllChores((prev) => [...starterChores, ...prev]);
    setAllBills((prev) => [...starterBills, ...prev]);
    setActiveWorkspaceId(newWs.id);
    setCurrentRoommateId(newCoordinator.id);

    showToast(`Created full environment for "${newWs.name}" with 4 flatmates, expenses & chores!`);
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

  // Onboard new user: register profile + choose workspace (Create or Join)
  const registerAndOnboard = (
    user: Partial<Roommate>,
    workspaceChoice:
      | { mode: 'CREATE'; ws: { name: string; location?: string; monthlyRentKES?: number; rentDueDay?: number } }
      | { mode: 'JOIN'; inviteCode: string }
  ): boolean => {
    const timestamp = Date.now();

    if (workspaceChoice.mode === 'CREATE') {
      const code = `FLAT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newWs: Workspace = {
        id: `ws_${timestamp}`,
        name: workspaceChoice.ws.name || 'My Shared Flat',
        inviteCode: code,
        location: workspaceChoice.ws.location || 'Nairobi, Kenya',
        monthlyRentKES: workspaceChoice.ws.monthlyRentKES || 32000,
        rentDueDay: workspaceChoice.ws.rentDueDay || 5,
        createdAt: new Date().toISOString(),
      };

      const newCoordinator: Roommate = {
        id: `user_${timestamp}`,
        workspaceId: newWs.id,
        name: user.name || 'Flat Coordinator',
        handle: `@${(user.name || 'coordinator').toLowerCase().replace(/\s+/g, '_')}`,
        phone: user.phone || '0712345678',
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'lead')}`,
        role: 'coordinator',
        bio: user.bio || `Founder & Coordinator of ${newWs.name}`,
        diet: user.diet && user.diet.length > 0 ? user.diet : ['all', 'greens_lover'],
        examPeriod: !!user.examPeriod,
        availabilityScore: user.examPeriod ? 0.2 : 1.0,
        karmaScore: 120,
        streakWeeks: 1,
      };

      const roommateTreasurer: Roommate = {
        id: `roomie_${timestamp}_1`,
        workspaceId: newWs.id,
        name: 'Amani Kamau',
        handle: '@amani_k',
        phone: '0711223344',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        role: 'treasurer',
        bio: 'Finance & Accounting finalist · Safaricom M-Pesa auditor',
        diet: ['all', 'greens_lover'],
        examPeriod: false,
        availabilityScore: 1.0,
        karmaScore: 135,
        streakWeeks: 4,
      };

      const roommateFaith: Roommate = {
        id: `roomie_${timestamp}_2`,
        workspaceId: newWs.id,
        name: 'Faith Chebet',
        handle: '@faith_c',
        phone: '0722334455',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
        role: 'member',
        bio: 'Nursing student · Morning person · Vegetarian & Chapati chef',
        diet: ['vegetarian'],
        examPeriod: false,
        availabilityScore: 0.9,
        karmaScore: 110,
        streakWeeks: 3,
      };

      const roommateIan: Roommate = {
        id: `roomie_${timestamp}_3`,
        workspaceId: newWs.id,
        name: 'Ian Mutua',
        handle: '@ian_m',
        phone: '0733445566',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
        role: 'member',
        bio: 'Software Eng · Night owl gamer · Lactose intolerant',
        diet: ['lactose_intolerant', 'greens_lover'],
        examPeriod: false,
        availabilityScore: 1.0,
        karmaScore: 102,
        streakWeeks: 5,
      };

      const allNewRoommates = [newCoordinator, roommateTreasurer, roommateFaith, roommateIan];
      const memberIds = allNewRoommates.map((r) => r.id);

      const starterExpenses: Expense[] = [
        {
          id: `exp_${timestamp}_1`,
          workspaceId: newWs.id,
          payerId: newCoordinator.id,
          title: 'Safaricom 5G Home Wi-Fi Setup (50Mbps)',
          category: 'HOUSE_BUFFER',
          totalAmount: 3500,
          date: 'Today, 10:30 AM',
          mpesaCode: `SAF${Math.floor(100000 + Math.random() * 900000)}`,
          verified: true,
          items: [
            {
              id: `item_${timestamp}_1`,
              name: 'Monthly Unlimited 5G Fibre Router',
              cost: 3500,
              category: 'utilities',
              participantIds: memberIds,
            },
          ],
        },
        {
          id: `exp_${timestamp}_2`,
          workspaceId: newWs.id,
          payerId: roommateTreasurer.id,
          title: '13kg K-Gas Communal Cylinder Refill',
          category: 'GAS',
          totalAmount: 2900,
          date: 'Yesterday, 3:15 PM',
          mpesaCode: `GAS${Math.floor(100000 + Math.random() * 900000)}`,
          verified: true,
          items: [
            {
              id: `item_${timestamp}_2`,
              name: 'TotalEnergies 13kg Gas Refill',
              cost: 2900,
              category: 'utilities',
              participantIds: memberIds,
            },
          ],
        },
        {
          id: `exp_${timestamp}_3`,
          workspaceId: newWs.id,
          payerId: roommateFaith.id,
          title: 'Market Fresh Sukuma & Veggies Run',
          category: 'GROCERIES',
          totalAmount: 850,
          date: 'Yesterday, 6:00 PM',
          mpesaCode: `VEG${Math.floor(100000 + Math.random() * 900000)}`,
          verified: true,
          items: [
            {
              id: `item_${timestamp}_3`,
              name: 'Sukuma Wiki & Terere',
              cost: 200,
              category: 'greens',
              participantIds: memberIds,
            },
            {
              id: `item_${timestamp}_4`,
              name: 'Managu Fresh Bundle',
              cost: 250,
              category: 'greens',
              participantIds: [newCoordinator.id, roommateTreasurer.id, roommateIan.id],
            },
            {
              id: `item_${timestamp}_5`,
              name: 'Irish Potatoes (Waru) & Onions',
              cost: 400,
              category: 'carbs',
              participantIds: memberIds,
            },
          ],
        },
      ];

      const starterChores: Chore[] = [
        {
          id: `chore_${timestamp}_1`,
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
          id: `chore_${timestamp}_2`,
          workspaceId: newWs.id,
          title: 'Balcony & Estate Trash Dumpster Run',
          description: 'Collect trash bags and drop at estate garbage collection point',
          difficulty: 2,
          frequency: 'daily',
          assignedToId: roommateIan.id,
          dueDate: new Date().toISOString().split('T')[0],
          dueTime: '21:00',
          status: 'PENDING',
          bountyKES: 50,
        },
        {
          id: `chore_${timestamp}_3`,
          workspaceId: newWs.id,
          title: 'Bathroom Scrubbing & Vim Disinfection',
          description: 'Scrub tiles, sanitize toilet bowl, wipe mirror and taps',
          difficulty: 4,
          frequency: 'twice_weekly',
          assignedToId: roommateFaith.id,
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          dueTime: '18:00',
          status: 'PENDING',
          bountyKES: 100,
        },
      ];

      const starterBills: ParliamentBill[] = [
        {
          id: `bill_${timestamp}_1`,
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
          quorumNeeded: 3,
          expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        },
      ];

      setWorkspaces((prev) => [...prev, newWs]);
      setAllRoommates((prev) => [...prev, ...allNewRoommates]);
      setAllExpenses((prev) => [...starterExpenses, ...prev]);
      setAllChores((prev) => [...starterChores, ...prev]);
      setAllBills((prev) => [...starterBills, ...prev]);
      setActiveWorkspaceId(newWs.id);
      setCurrentRoommateId(newCoordinator.id);
      setIsAuthenticated(true);

      try {
        localStorage.setItem('roomjustice_is_authenticated', 'true');
        localStorage.setItem('roomjustice_current_roommate_id', newCoordinator.id);
        localStorage.setItem('roomjustice_active_ws_id', newWs.id);
      } catch (e) {}

      showToast(`Created full environment for "${newWs.name}"! Welcome, ${newCoordinator.name}.`);
      return true;
    } else {
      const cleanCode = workspaceChoice.inviteCode.trim().toUpperCase();
      const foundWs = workspaces.find((w) => w.inviteCode.toUpperCase() === cleanCode);

      if (!foundWs) {
        showToast(`Invalid invite code "${cleanCode}". Please verify with flat coordinator.`);
        return false;
      }

      const newMember: Roommate = {
        id: `user_${timestamp}`,
        workspaceId: foundWs.id,
        name: user.name || 'Flatmate',
        handle: `@${(user.name || 'flatmate').toLowerCase().replace(/\s+/g, '_')}`,
        phone: user.phone || '0712345678',
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'member')}`,
        role: 'member',
        bio: user.bio || `Roommate at ${foundWs.name}`,
        diet: user.diet && user.diet.length > 0 ? user.diet : ['all', 'greens_lover'],
        examPeriod: !!user.examPeriod,
        availabilityScore: user.examPeriod ? 0.2 : 1.0,
        karmaScore: 100,
        streakWeeks: 0,
      };

      setAllRoommates((prev) => [...prev, newMember]);
      setActiveWorkspaceId(foundWs.id);
      setCurrentRoommateId(newMember.id);
      setIsAuthenticated(true);

      try {
        localStorage.setItem('roomjustice_is_authenticated', 'true');
        localStorage.setItem('roomjustice_current_roommate_id', newMember.id);
        localStorage.setItem('roomjustice_active_ws_id', foundWs.id);
      } catch (e) {}

      showToast(`Joined ${foundWs.name}! Welcome, ${newMember.name}.`);
      return true;
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
        isAuthenticated,
        isHydrated,
        allRoommates,
        loginUser,
        logoutUser,
        registerAndOnboard,
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
