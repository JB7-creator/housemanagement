import { NextRequest, NextResponse } from 'next/server';

interface ArbitrateRequestBody {
  billTitle: string;
  billDescription: string;
  category: string;
  proposerName: string;
  votes: {
    roommateName: string;
    vote: 'PASS' | 'VETO';
    reason?: string;
  }[];
}

const SYSTEM_PROMPT = `You are "The Brutal AI Arbitrator" (Speaker of the House) for a shared student / young professional flat in Kenya.
Your mission is to enforce absolute fairness, justice, and accountability among roommates.
Roommates have deadlocked or vetoed an issue. You must evaluate the conflicting interests impartially, strictly, and decisively.

Rules of the House:
1. No free-riding or uncompensated labor.
2. Academic exam periods give temporary chore relief, but the deficit must be repaid post-exam or via the KES 50 bounty system.
3. Vegetarians/SDAs never pay for butchery meat/pork; milk-intolerant flatmates never pay for cow milk.
4. Shared utilities (KPLC tokens, 13kg gas, Wi-Fi) are universal communal commitments.
5. Frivolous vetoes without reasonable alternatives must be overruled.

Return a JSON object with this exact structure:
{
  "summary": "Concise summary of the conflict and opposing arguments",
  "verdict": "UPHELD" | "OVERRULED" | "COMPROMISE",
  "ruling": "Brutal, clear, authoritative ruling explaining why this decision was made",
  "recommendedResolution": "Specific actionable steps (e.g. who pays what, when chores are shifted)",
  "fineAssessedKES": 0
}`;

export async function POST(req: NextRequest) {
  try {
    const body: ArbitrateRequestBody = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    const userContent = `Evaluate this flat dispute:
Title: ${body.billTitle}
Category: ${body.category}
Proposed by: ${body.proposerName}
Description: ${body.billDescription}

Roommate Votes & Reasons:
${body.votes.map((v) => `- ${v.roommateName} voted ${v.vote}: "${v.reason || 'No reason provided'}"`).join('\n')}`;

    // 1. Try Groq (Active Models: openai/gpt-oss-20b, qwen/qwen3.8-27b)
    if (groqKey) {
      const groqModels = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

      for (const modelName of groqModels) {
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${groqKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userContent },
              ],
              response_format: { type: 'json_object' },
              temperature: 0.2,
            }),
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const rawContent = data.choices[0]?.message?.content;
            if (rawContent) {
              const parsed = JSON.parse(rawContent);
              return NextResponse.json({ ...parsed, provider: 'Groq AI' });
            }
          }
        } catch (err) {
          console.warn(`Groq arbitration model ${modelName} failed:`, err);
        }
      }
    }

    // 2. Try NVIDIA NIM (meta/llama-3.1-8b-instruct)
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
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userContent },
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' },
          }),
        });

        if (nvidiaRes.ok) {
          const data = await nvidiaRes.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ ...parsed, provider: 'NVIDIA NIM' });
        }
      } catch (err) {
        console.warn('NVIDIA NIM arbitration failed, falling back to heuristic engine...', err);
      }
    }

    // 3. Fallback Heuristic Arbitrator
    return NextResponse.json({
      summary: `Contested bill with ${body.votes.length} votes.`,
      verdict: 'COMPROMISE',
      ruling: 'House Arbitrator Decision: Balanced compromise enforced to prevent deadlock. If an expense benefits the communal flat infrastructure, 75% is funded via the House Buffer Pool, and the requesting party covers the remaining 25%.',
      recommendedResolution: 'Allocate one-off cost to Emergency Buffer NAV units; all roommates uphold house harmony without out-of-pocket cash calls.',
      fineAssessedKES: 0,
      provider: 'Heuristic Game Theory Engine',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Arbitration evaluation failed', details: error?.message },
      { status: 500 }
    );
  }
}
