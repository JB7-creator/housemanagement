# HouseManagement (RoomJustice) — Complete Architecture & Technical Blueprint

> **Platform Vision:** *"Co-living without the drama. Fairness engineered for peace of mind."*  
> **Benchmark Reference:** High-trust, kinetic design inspired by [kellyleon.vercel.app](https://kellyleon.vercel.app/)  
> **Target Audience:** University students, flatmates, and co-living residents in East Africa & globally.

---

## 1. System Vision & Core Product Pillars

HouseManagement is an autonomous, fair-living operating system that balances household finances, labor, and democracy. It serves as an impartial, mathematically grounded, and disciplined **AI House Arbitrator** ("Speaker of the House") that prevents roommate friction before it starts.

---

## 2. Mathematical Engines & Core Algorithms

### 2.1 Debt Simplification & Minimum-Flow Settlement Graph
Instead of $N(N-1)/2$ confusing, high-fee pairwise payments, the system computes net balances $b_i = \sum_{in} w - \sum_{out} w$ and partitions the group into the **maximum number of disjoint zero-sum subsets** (solving the Maximum Disjoint Zero-Sum Subset Problem):
* **Exact Bitmask DP ($N \le 16$):** Computes the true minimal transaction count in $O(3^N)$ time.
* **Greedy Min-Cash Flow ($N > 16$):** Matches the largest debtor against the largest creditor in $O(N \log N)$ time, guaranteeing at most $N-1$ transactions.
* **Result:** If Alice owes Bob KES 500 and Charlie owes Dave KES 500, they settle independently in 2 direct transfers rather than chaining across 4 people.

### 2.2 Fair Chore Allocation: Envy-Free up to One Chore (EF1)
Household chores carry negative utility (disutility $d_{i, c}$). The system eliminates resentment through:
1. **Effort Weight Matrix:** Roommates rate chores across difficulty, duration, and frequency.
2. **Snake Round-Robin Draft:** Picks proceed in alternating rounds ($1 \to N$, then $N \to 1$), mathematically guaranteeing **EF1** (no roommate envies another's chore bundle by more than a single chore).
3. **Dynamic Availability Multiplier ($\alpha_{i, t}$):**
   * $\alpha = 0.2$ (Exam Week / Peak Academic Crisis)
   * $\alpha = 0.6$ (Heavy Studies)
   * $\alpha = 1.0$ (Normal Baseline)
   * $\alpha = 1.4$ (Post-Exam / Free Period)
4. **Inter-Temporal Chore Karma Ledger:** Students who take chore relief during exams accumulate a Karma deficit that is scheduled for payback post-exams or bought out via the Bounty pool.

### 2.3 The "Chore Bounty" & Escalation State Machine
Traditional fines cause social bitterness. HouseManagement uses **Market-Clearing Bounties**:
* **Deadline Missed ($T_0 + 6\text{h}$):** The chore enters the House Bounty Board.
* **Micro-Fine Levied:** Defaulter is assessed a KES 50 fine.
* **Bounty Conversion:** Any roommate who steps up, completes the task, and uploads photo proof instantly earns the KES 50 bounty credited to their ledger!
* **Habitual Defaulters:** Strikes 2 & 3 double the penalty ($F_k = 50 \times 2^{k-1}\text{ KES}$) and scale their future chore load factor to $\alpha = 1.5$.
* **Democratic Appeals:** 24-hour dispute window with blind, anonymous roommate voting ($\ge 67\%$ supermajority required to waive).

### 2.4 Emergency Buffer Pool & Unitized NAV Equity Ledger
Shared student housing suffers when roommates move out or funds run dry.
* **Operational Sinking Fund:** Monthly fixed running costs (Wi-Fi, water tokens, KPLC electricity tokens, 13kg cooking gas refills, cleaning detergents).
* **Emergency Buffer Pool:** Contingency liquidity reserve target ($RR = 1.0 - 1.5$ months of shared utilities).
* **Unitized NAV Accounting (Mutual Fund Model):**
  $$NAV(t) = \frac{\text{Total Cash in Pool}}{\text{Total Units Outstanding}}$$
  * When an emergency repair occurs, cash drops and $NAV$ drops equally across all unit holders.
  * When fines are collected, cash rises and $NAV$ increases (a dividend for good citizenship).
  * When Roommate $A$ leaves, incoming Roommate $B$ buys $A$'s units at the current $NAV$. **Zero cash leaves the house account**, avoiding arguments over past wear-and-tear.

---

## 3. East African Fintech & WhatsApp Integration

### 3.1 M-Pesa Parsing Engine
* **Deterministic Regex Engine (< 1.5ms):** Captures Paybill, Buy Goods / Till, P2P Send, P2P Receive, Fuliza overdrafts, and Reversals. Handles Safaricom KDPA 2019 phone masking (`07****1234`).
* **Groq Llama-3.1-8B LLM Fallback (~180ms):** Invoked for forwarded, noisy, or OCR-scanned SMS texts, returning strict JSON.
* **5-Layer Anti-Fraud Defense:**
  1. *Alphanumeric Epoch Validation:* First digit verifies Year (`S`=2024, `T`=2025, `U`=2026); second verifies Month (`A`=Jan ... `L`=Dec).
  2. *Global Idempotency Lock:* Unique index on `mpesa_transaction_code` prevents replayed codes.
  3. *Two-Party Peer Consensus Protocol:* P2P transfers remain `PENDING` until the recipient confirms or an automated twin SMS is detected.
  4. *Receipt OCR & PDF Signature Check:* Validates official Safaricom Neo Sans typography and X.509 digital certificates.
  5. *Reversal Watchdog:* Detects `*456#` Safaricom reversals, immediately reinstating debts plus a punitive fine.

### 3.2 Granular Grocery & Diet Sub-Splits
* **Greens & Vegetables:** Sukuma wiki, spinach, and onions shared by all; bitter African Nightshade (*managu*) or *terere* itemized only to opted-in roommates.
* **Butchery vs. Vegan/SDA:** Beef, goat, chicken, and Lake Victoria *omena* split exclusively between meat consumers; vegetarians never pay a cent.
* **Dairy:** Fresh cow milk packets vs lactose intolerance.
* **House Consumables vs Personal Toiletries:** KPLC tokens, cooking gas, vim, and harpic are split house-wide; personal perfumes, Geisha soaps, Colgate toothpaste, and sanitary products are strictly excluded from shared bills.

### 3.3 WhatsApp Native Group Assistant (Evolution API / Baileys)
* **Zero Cost & Native Groups:** Connects directly into the shared flat WhatsApp group via WhatsApp Multi-Device protocol.
* **Interactive Features:**
  * Paste M-Pesa SMS in group chat $\to$ bot responds with itemized split and tags debtors.
  * Morning chore ping at 07:00 AM EAT $\to$ roomie reacts with `✅` to confirm completion.
  * Infraction reports $\to$ `@HouseBot fine @Dennis 100 dirty dishes in sink` triggers an interactive peer seconding prompt.
  * Native WhatsApp Polls for high-cost decisions (e.g. *"Refill 13kg Gas for KES 2,800?"*).

---

## 4. UI/UX & Design Systems Architecture (Kelly Leon Benchmark)

* **Atmosphere & Substrate:** Pure Crisp White (`#FFFFFF`) with subtle Slate-50 cards.
* **Primary Accent:** Electric Blue (`#0052FF`, `#EBF2FF`).
* **Harmony Accent:** Metallic Champagne Gold (`#D4AF37`).
* **Strict Anti-Clutter Rule:** Zero generic AI emojis. All actions housed in crisp, dual-layer Lucide icon badges.
* **Typography:** `Plus Jakarta Sans` for geometric display headings, `Inter` for metadata, and tabular figures (`Outfit`) for financial balances.
