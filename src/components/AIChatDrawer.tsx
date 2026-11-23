'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Cpu,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  provider?: string;
}

const QUICK_PROMPTS = [
  'Who owes the most right now?',
  'Dennis skipped chores due to exams. Is that fair?',
  'How do we split Ksh 2,400 KPLC tokens?',
  'Maya bought beef but Dennis is vegetarian. Calculate split.',
  'What happens if someone fails to pay rent on the 5th?',
];

export function AIChatDrawer() {
  const {
    activeWorkspace,
    currentRoommate,
    roommates,
    expenses,
    chores,
    fund,
  } = useHouse();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: `Greetings ${currentRoommate.name}. I am the Brutal AI House Manager for ${activeWorkspace.name}. I enforce zero free-riding, mathematically envy-free chores, and strict M-Pesa accountability. What issue or dispute requires my arbitration today?`,
      timestamp: 'Just now',
      provider: 'Groq Llama-3.1',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
            { role: 'user', content: query },
          ],
          context: {
            workspaceName: activeWorkspace.name,
            userName: currentRoommate.name,
            userRole: currentRoommate.role,
            roommatesSummary: roommates.map((r) => `${r.name} (${r.diet.join(', ')}, ${r.examPeriod ? 'Exam active' : 'Normal'})`).join('; '),
            debtSummary: `Total expenses recorded: ${expenses.length}. Emergency vault balance: Ksh ${fund.currentBalanceKES}`,
            bountiesSummary: `${chores.filter((c) => c.status === 'BOUNTY_OPEN').length} active bounties`,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: data.reply || 'Decision logged.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: data.provider || 'Groq AI',
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: 'Connection hiccup. Under standard house arbitration rules: ensure all receipts have valid Safaricom reference codes and expenses are split only among opted-in dietary consumers.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Pill / Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-2xl border border-slate-700 hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-electric-500 to-champagne-500 flex items-center justify-center text-white">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <span>Talk to AI Arbitrator</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-electric-500 text-white flex items-center justify-center shadow-electric-glow">
                  <Bot className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-slate-900">
                      The Brutal AI House Manager
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Speaker of {activeWorkspace.name} · Powered by Groq AI
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-electric-500 text-white rounded-br-none shadow-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {m.provider && (
                      <>
                        <span>•</span>
                        <span className="text-electric-600 font-medium font-mono">{m.provider}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 max-w-[70%]">
                  <Loader2 className="w-4 h-4 text-electric-500 animate-spin" />
                  <span>Evaluating house rules & balances...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Quick Prompts:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-electric-400 hover:text-electric-600 transition-colors shrink-0 shadow-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3.5 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask the AI Arbitrator anything about your house..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-electric-500 bg-slate-50/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 disabled:opacity-40 text-white transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
