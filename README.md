# HouseManagement (RoomJustice) ⚖️

> **"Co-living without the drama. Fairness engineered for peace of mind."**  
> An autonomous, fair-living operating system designed for university students, flatmates, and co-living communities in Kenya, East Africa, and globally.

---

## 🌟 Key Features

### 1. 🤖 The Brutal AI Arbitrator ("Speaker of the House")
* Evaluates deadlock disputes, enforces discipline, and levies automatic micro-fines (e.g. KES 50).
* Unbiased, objective adjudication of conflicting house interests (e.g., quiet study hours during exams, kitchen sanitization standards).

### 2. 📱 Safaricom M-Pesa Parsing & 5-Layer Anti-Fraud
* **Deterministic Regex (< 1.5ms):** Instantly parses Paybill (`888880` KPLC tokens), Till / Buy Goods (Mama Mboga, Supermarket), P2P transfers, and Fuliza overdrafts.
* **KDPA 2019 Privacy Protection:** Handles masked Safaricom phone numbers (`07****1234`).
* **Groq / Llama-3.1-8B Fallback:** Handles messy forwarded texts or OCR photos in under 200ms.
* **Epoch & Reversal Watchdog:** Verifies transaction code alphanumeric calendar stamps and detects Safaricom `*456#` reversals.

### 3. 🥦 Granular Dietary & Consumable Sub-Splits
* **Mama Mboga Greens Divide:** Sukuma wiki, spinach, and onions pooled house-wide; bitter *managu* or *terere* itemized only to opted-in roommates.
* **Butchery vs. Vegetarian/SDA:** Beef, goat, chicken, and Lake *omena* split exclusively among meat-eaters—vegetarians never pay a cent.
* **House Utilities vs. Personal Items:** Cooking gas and KPLC tokens are shared; personal bath soaps, Colgate, and perfumes are strictly excluded.

### 4. 🧮 Bitmask DP Debt Simplification ($O(3^N)$)
* Partitions roommates into the maximum number of disjoint zero-sum subsets.
* Eliminates circular debt (if A owes B and B owes C, A pays C directly), minimizing transactions down to at most $N-1$ M-Pesa transfers.

### 5. 🧹 Envy-Free Chore Allocation & "Chore Bounties" (EF1)
* **Snake Round-Robin Draft:** Alternates chore picks to achieve mathematical EF1 envy-freeness.
* **Exam Multipliers ($\alpha_{i, t}$):** Reduces chore loads during university exam fortnight ($\alpha = 0.2$), scheduling compensatory tasks post-exams.
* **Market-Clearing Bounties:** When a chore is neglected past 6 hours, a KES 50 micro-fine is converted into an open bounty. Any roommate who completes the chore earns the bounty directly.

### 6. 🏛️ House Parliament & Democratic Bill Voting
* Propose bills for Wi-Fi upgrades, house rules, and amenities.
* Real-time quorum voting: Pass, Veto (with mandatory constructive reasoning), or trigger the AI Arbitrator.

### 7. 🏦 Emergency Sinking Fund & Unitized NAV Ledger
* Mutual fund unit accounting ($NAV = \text{Cash} / \text{Units}$).
* Roommate exits/turnover: incoming roommates buy units at current NAV; the house bank balance stays 100% intact with zero dispute over wear-and-tear.

---

## 🎨 Design System & Aesthetic Benchmark

* **Benchmark:** Inspired by [kellyleon.vercel.app](https://kellyleon.vercel.app/) (kinetic typography, live interactive simulator, zero clutter).
* **Color Palette:** Pure White canvas, Electric Blue (`#0052FF`), Metallic Champagne Gold (`#D4AF37`), and Slate-50.
* **Iconography:** Strictly **NO tacky AI-generated emojis**—crisp Lucide React dual-layer badge housings throughout.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ (tested on v26)
* npm or pnpm

### Installation
```bash
git clone https://github.com/JB7-creator/housemanagement.git
cd housemanagement
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the live platform.

---

## 🚢 Deployment on Vercel
1. Push this repository to GitHub: `https://github.com/JB7-creator/housemanagement`
2. Import project in Vercel.
3. Configure environment variables for Supabase & Groq API.
4. Deploy!
