import { NextRequest, NextResponse } from 'next/server';
import { parseMpesaMessage } from '@/lib/algorithms/mpesaParser';

const EXTRACTION_SYSTEM_PROMPT = `You are an ultra-accurate Kenyan M-Pesa SMS parsing engine.
Extract the transaction metadata into valid JSON strictly following this schema:
{
  "code": "10-character uppercase Safaricom reference code",
  "type": "PAYBILL" | "BUY_GOODS" | "P2P_SEND" | "P2P_RECEIVE" | "FULIZA" | "REVERSAL" | "UNKNOWN",
  "amount": number (KES without commas),
  "counterparty": "Name of recipient, merchant, or sender",
  "phoneOrAccount": "Phone number or Paybill account number if present",
  "timestamp": "ISO 8601 or original date string",
  "confidence": number between 0 and 1
}
Only output valid JSON. No markdown ticks, no extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { rawSms } = await req.json();

    if (!rawSms || typeof rawSms !== 'string') {
      return NextResponse.json({ error: 'Missing rawSms string' }, { status: 400 });
    }

    // 1. Fast deterministic regex check (< 1.5ms)
    const regexResult = parseMpesaMessage(rawSms);
    if (regexResult.confidence >= 0.8 && regexResult.code && regexResult.amount > 0) {
      return NextResponse.json({
        ...regexResult,
        source: 'Regex Engine (<1.5ms)',
      });
    }

    // 2. Fallback to Groq AI (~180ms)
    const groqKey = process.env.GROQ_API_KEY;
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
                { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
                { role: 'user', content: `Parse this Kenyan M-Pesa SMS:\n${rawSms}` },
              ],
              response_format: { type: 'json_object' },
              temperature: 0.0,
            }),
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const parsed = JSON.parse(data.choices[0]?.message?.content);
            return NextResponse.json({
              ...parsed,
              source: `Groq AI (${modelName})`,
            });
          }
        } catch (err) {
          console.warn(`Groq M-Pesa extraction failed on ${modelName}:`, err);
        }
      }
    }

    // Return the best regex effort
    return NextResponse.json({
      ...regexResult,
      source: 'Regex Engine Fallback',
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'M-Pesa parsing failed', details: error?.message }, { status: 500 });
  }
}
