import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are "The Brutal AI House Manager" (Speaker of the House) for a shared student / young professional apartment in Kenya.
Your job is to enforce mathematical fairness, resolve disputes, prevent freeloading, and give ruthless, unbiased, witty rulings.

You have access to the house context:
- Roommates, their roles, diet restrictions (some eat meat, some are vegetarians/SDA, some are lactose intolerant), and university exam statuses.
- Finances: Rent, KPLC electricity tokens, 13kg cooking gas, Mama Mboga vegetables (Sukuma wiki, Managu, Terere), and debt balances.
- The Rulebook:
  1. Missed chore past 6 hours = KES 50 bounty fine credited to whoever cleans it.
  2. Exam periods give chore relief (alpha=0.2), but load is repaid post-exams.
  3. Vegetarians never pay for butchery meat; milk-intolerant never pay for cow milk.
  4. Personal toiletries (Colgate, perfumes, soaps) are excluded from shared bills.
  5. Contested bills require 67% supermajority quorum or AI ruling.

Personality:
- Authoritative, disciplined, witty, Kenyan campus-aware (understands M-Pesa, Fuliza, Roysambu/Juja flat life, "bana", "mama mboga", "tokens").
- Never coddle freeloaders. Always emphasize transparency and mathematical fairness.
- Keep answers punchy, clear, and actionable. Use bullet points when calculating splits or giving rulings.
- STRICTLY DO NOT USE GENERIC EMOJIS (no 🚀🔥💸🧹).`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    const contextPreamble = context
      ? `CURRENT FLAT CONTEXT:
Workspace: ${context.workspaceName || 'Flat 4B'}
User Speaking: ${context.userName || 'Roommate'} (${context.userRole || 'Member'})
Active Roommates: ${context.roommatesSummary || 'Brian (Coordinator), Kevin (Treasurer), Dennis (Member, Exam active), Maya (Member)'}
Net Debt State: ${context.debtSummary || 'Kevin is owed Ksh 1,600; Brian is owed Ksh 850; Dennis owes Ksh 1,450; Maya owes Ksh 1,000'}
Active Bounties: ${context.bountiesSummary || '1 active bounty: Trash run (KES 50)'}
---`
      : '';

    const fullMessages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${contextPreamble}` },
      ...messages,
    ];

    // 1. Try Groq Llama-3.1-8B-instant
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: fullMessages,
            temperature: 0.3,
            max_tokens: 600,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const reply = data.choices[0].message.content;
          return NextResponse.json({ reply, provider: 'Groq Llama-3.1' });
        }
      } catch (err) {
        console.warn('Groq chat failed, falling back to NVIDIA NIM...', err);
      }
    }

    // 2. Try NVIDIA NIM fallback
    if (nvidiaKey) {
      try {
        const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${nvidiaKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta/llama-3.1-8b-instruct',
            messages: fullMessages,
            temperature: 0.3,
            max_tokens: 600,
          }),
        });

        if (nvidiaRes.ok) {
          const data = await nvidiaRes.json();
          const reply = data.choices[0].message.content;
          return NextResponse.json({ reply, provider: 'NVIDIA NIM' });
        }
      } catch (err) {
        console.warn('NVIDIA NIM chat failed, falling back to heuristic engine...', err);
      }
    }

    // 3. Fallback Autonomous Response
    return NextResponse.json({
      reply: `AI House Manager Ruling: As the arbitrator of this flat, I have recorded your query. Under Section 4 of the House Constitution, all financial transactions must be verified via Safaricom M-Pesa reference codes, and chores must be completed within 6 hours of deadline to prevent the KES 50 bounty penalty. If this is a dispute regarding dietary splits, remember that vegetarians are exempt from butchery Nyama expenses.`,
      provider: 'Heuristic Game Theory Engine',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'AI House Manager failed to process message', details: error?.message },
      { status: 500 }
    );
  }
}
