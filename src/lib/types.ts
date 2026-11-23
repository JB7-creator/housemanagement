export type DietaryPreference = 'all' | 'vegetarian' | 'halal' | 'lactose_intolerant' | 'greens_lover';

export interface Roommate {
  id: string;
  name: string;
  handle: string; // e.g. @brian_ke
  phone: string;  // e.g. 0712345678
  avatar: string;
  role: 'coordinator' | 'treasurer' | 'member';
  bio: string;
  diet: DietaryPreference[];
  examPeriod: boolean; // Dynamic Availability Multiplier
  availabilityScore: number; // 0.2 to 1.4
  karmaScore: number; // Cumulative chore & fairness points
  streakWeeks: number;
}

export interface LineItem {
  id: string;
  name: string;
  cost: number; // KES
  category: 'greens' | 'meat' | 'dairy' | 'carbs' | 'cleaning' | 'toiletries' | 'utilities';
  participantIds: string[]; // Sub-group split
}

export interface Expense {
  id: string;
  payerId: string;
  title: string;
  category: 'GROCERIES' | 'RENT' | 'ELECTRICITY' | 'WATER' | 'GAS' | 'TRANSPORT' | 'HOUSE_BUFFER';
  totalAmount: number; // KES
  date: string;
  mpesaCode?: string;
  receiptUrl?: string;
  items: LineItem[];
  verified: boolean;
}

export interface SettlementTransaction {
  fromId: string;
  toId: string;
  amount: number; // KES
  note?: string;
}

export interface Chore {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  frequency: 'daily' | 'twice_weekly' | 'weekly';
  assignedToId: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'BOUNTY_OPEN';
  rating?: number; // 1 to 5 stars given by peers
  bountyKES?: number; // Micro-fine converted to bounty
  proofImageUrl?: string;
}

export interface ParliamentBill {
  id: string;
  billNumber: number;
  proposerId: string;
  title: string;
  description: string;
  costKES?: number;
  category: 'POLICY' | 'EXPENSE' | 'AMENITY' | 'SANCTION';
  status: 'OPEN' | 'PASSED' | 'VETOED' | 'ARBITRATION_REQUIRED';
  votes: {
    roommateId: string;
    vote: 'PASS' | 'VETO';
    reason?: string;
    timestamp: string;
  }[];
  quorumNeeded: number;
  aiArbitratorVerdict?: {
    summary: string;
    recommendedResolution: string;
    decisionTimestamp: string;
  };
  expiresAt: string;
}

export interface EmergencyFundState {
  targetReserveKES: number;
  currentBalanceKES: number;
  reserveRatio: number;
  unitNavPrice: number;
  totalUnits: number;
  roommateUnits: Record<string, number>; // roommateId -> units held
}

export interface FineRecord {
  id: string;
  offenderId: string;
  reporterId: string;
  infraction: string;
  amountKES: number;
  date: string;
  status: 'ASSESSED' | 'BOUNTY_CLAIMED' | 'DISPUTED' | 'RESOLVED';
  bountyClaimerId?: string;
}
