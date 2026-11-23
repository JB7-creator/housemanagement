import { SettlementTransaction } from '../types';

/**
 * Exact Bitmask DP Algorithm (O(3^N)) for N <= 16
 * Partitions roommates into the MAXIMUM number of disjoint zero-sum subsets,
 * mathematically proving the absolute minimum number of settlement transactions.
 */
export function simplifyDebtsExact(netBalances: Record<string, number>): SettlementTransaction[] {
  // 1. Filter out settled participants (cents converted to integers)
  const nonZeroEntries = Object.entries(netBalances)
    .filter(([_, b]) => Math.abs(b) >= 0.5)
    .map(([id, b]) => ({ id, cents: Math.round(b * 100) }));

  const n = nonZeroEntries.length;
  if (n === 0) return [];

  // If group is too large for 3^N DP, fallback to greedy min-cash flow
  if (n > 14) {
    return simplifyDebtsGreedy(netBalances);
  }

  const vals = nonZeroEntries.map((e) => e.cents);

  // Precompute subset sums
  const subsetSum = new Int32Array(1 << n);
  for (let mask = 1; mask < 1 << n; mask++) {
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subsetSum[mask] = subsetSum[mask ^ (1 << i)] + vals[i];
        break;
      }
    }
  }

  // DP[mask] stores max count of disjoint zero-sum components
  const dp = new Int8Array(1 << n);
  const parent = new Int32Array(1 << n).fill(-1);

  for (let mask = 1; mask < 1 << n; mask++) {
    if (subsetSum[mask] === 0) {
      dp[mask] = 1;
      let sub = (mask - 1) & mask;
      while (sub > 0) {
        if (subsetSum[sub] === 0 && dp[sub] + dp[mask ^ sub] > dp[mask]) {
          dp[mask] = dp[sub] + dp[mask ^ sub];
          parent[mask] = sub;
        }
        sub = (sub - 1) & mask;
      }
    } else {
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          if (dp[mask ^ (1 << i)] > dp[mask]) {
            dp[mask] = dp[mask ^ (1 << i)];
          }
        }
      }
    }
  }

  // Decompose into components
  const components: number[][] = [];
  function decompose(mask: number) {
    if (subsetSum[mask] !== 0) return;
    if (parent[mask] !== -1) {
      decompose(parent[mask]);
      decompose(mask ^ parent[mask]);
    } else {
      const comp: number[] = [];
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) comp.push(i);
      }
      if (comp.length > 0) components.push(comp);
    }
  }

  decompose((1 << n) - 1);

  // If decomposition did not consume all (e.g. tiny rounding residue), group remainder
  const used = new Set<number>();
  for (const c of components) {
    for (const idx of c) used.add(idx);
  }
  const leftover: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!used.has(i)) leftover.push(i);
  }
  if (leftover.length > 0) components.push(leftover);

  // Settle greedily within each independent component
  const transactions: SettlementTransaction[] = [];
  for (const comp of components) {
    const debtors = comp
      .filter((i) => vals[i] < 0)
      .map((i) => ({ id: nonZeroEntries[i].id, amount: -vals[i] }));
    const creditors = comp
      .filter((i) => vals[i] > 0)
      .map((i) => ({ id: nonZeroEntries[i].id, amount: vals[i] }));

    let d = 0;
    let c = 0;
    while (d < debtors.length && c < creditors.length) {
      const transfer = Math.min(debtors[d].amount, creditors[c].amount);
      if (transfer > 0) {
        transactions.push({
          fromId: debtors[d].id,
          toId: creditors[c].id,
          amount: transfer / 100,
        });
      }
      debtors[d].amount -= transfer;
      creditors[c].amount -= transfer;
      if (debtors[d].amount === 0) d++;
      if (creditors[c].amount === 0) c++;
    }
  }

  return transactions;
}

/**
 * Greedy Minimum Cash Flow Fallback (Splitwise algorithm)
 * Guaranteed at most N - 1 transactions.
 */
export function simplifyDebtsGreedy(netBalances: Record<string, number>): SettlementTransaction[] {
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  for (const [id, bal] of Object.entries(netBalances)) {
    const rounded = Math.round(bal * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ id, amount: -rounded });
    } else if (rounded > 0.01) {
      creditors.push({ id, amount: rounded });
    }
  }

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions: SettlementTransaction[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const settle = Math.min(debtors[i].amount, creditors[j].amount);
    if (settle > 0.01) {
      transactions.push({
        fromId: debtors[i].id,
        toId: creditors[j].id,
        amount: Math.round(settle * 100) / 100,
      });
    }

    debtors[i].amount -= settle;
    creditors[j].amount -= settle;

    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return transactions;
}
