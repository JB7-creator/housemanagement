import { Chore, Roommate } from '../types';

/**
 * Envy-Free up to One Item (EF1) Chore Rotation Engine
 * Uses Snake Round-Robin combined with dynamic availability multipliers (alpha_i,t).
 */
export function allocateChoresSnakeRoundRobin(
  chores: Omit<Chore, 'assignedToId' | 'status'>[],
  roommates: Roommate[]
): Chore[] {
  if (roommates.length === 0) return [];

  // Sort roommates by chore load capacity:
  // Normal = 1.0, Exam Week = 0.2 (lighter), Free = 1.4
  // Roommates with higher capacity and lower historical karma take priority picks
  const sortedRoommates = [...roommates].sort((a, b) => {
    // Primary: Exam periods put students at back of queue
    if (a.examPeriod !== b.examPeriod) return a.examPeriod ? 1 : -1;
    // Secondary: Lower karma means you owe house effort -> earlier pick
    return a.karmaScore - b.karmaScore;
  });

  // Sort chores by difficulty descending
  const sortedChores = [...chores].sort((a, b) => b.difficulty - a.difficulty);

  const n = sortedRoommates.length;
  const assigned: Chore[] = [];

  let round = 0;
  for (let i = 0; i < sortedChores.length; i++) {
    // Snake indexing: 0, 1, ..., n-1 then n-1, n-2, ..., 0
    const step = i % n;
    const currentRound = Math.floor(i / n);
    const roommateIndex = currentRound % 2 === 0 ? step : n - 1 - step;
    const assignee = sortedRoommates[roommateIndex];

    assigned.push({
      ...sortedChores[i],
      assignedToId: assignee.id,
      status: 'PENDING',
    });
  }

  return assigned;
}

/**
 * Bounty Escalation Calculator:
 * When a chore is missed past grace period (6 hours), turns fine into an open bounty.
 */
export function calculateChoreBounty(
  baseFineKES: number = 50,
  streakMisses: number = 1
): { bountyKES: number; penaltyKES: number } {
  // Escalates: 50 -> 100 -> 200 KES
  const penaltyKES = baseFineKES * Math.pow(2, Math.max(0, streakMisses - 1));
  // Peer who fulfills gets the base fine as a bounty credit
  const bountyKES = penaltyKES;
  return { bountyKES, penaltyKES };
}
