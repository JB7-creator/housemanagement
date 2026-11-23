'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Gavel,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useHouse } from '../../context/HouseContext';

interface HouseDiscussionPost {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isAiResponse?: boolean;
}

export default function HouseChatPage() {
  const { activeWorkspace, currentRoommate, roommates } = useHouse();

  const [posts, setPosts] = useState<HouseDiscussionPost[]>([
    {
      id: 'p1',
      senderId: 'roomie_2',
      senderName: 'Kevin Ochieng',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      text: 'Hey everyone, I just paid Ksh 2,850 for the 13kg Pro-Gas refill at the depot. Ref code is RFD98120MM. Please check your splits in the ledger.',
      timestamp: 'Today, 11:30 AM',
    },
    {
      id: 'p2',
      senderId: 'roomie_3',
      senderName: 'Dennis Mwangi',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      text: 'Got it Kevin, confirmed! Also heads up guys: my Mechanical FE exams start tomorrow so I have exam relief toggled on. If anyone can pick up my trash run, claim the KES 50 bounty!',
      timestamp: 'Today, 12:15 PM',
    },
    {
      id: 'p3',
      senderId: 'ai',
      senderName: 'Brutal AI Arbitrator',
      senderAvatar: '',
      text: 'AI House Notice: Dennis exam period relief ratified (alpha=0.2). Trash chore converted to open KES 50 bounty. Next roommate who hauls garbage bag and uploads photo proof earns 50 KES credited to their balance.',
      timestamp: 'Today, 12:16 PM',
      isAiResponse: true,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newPost: HouseDiscussionPost = {
      id: `p_${Date.now()}`,
      senderId: currentRoommate.id,
      senderName: currentRoommate.name,
      senderAvatar: currentRoommate.avatar,
      text: userText,
      timestamp: 'Just now',
    };

    setPosts((prev) => [...prev, newPost]);
    setInputText('');

    // If user mentions @AI, @arbitrator, or asks a question, trigger the AI!
    const shouldTriggerAi =
      userText.toLowerCase().includes('@ai') ||
      userText.toLowerCase().includes('arbitrate') ||
      userText.toLowerCase().includes('ruling') ||
      userText.toLowerCase().includes('dispute') ||
      userText.includes('?');

    if (shouldTriggerAi) {
      setIsAiReplying(true);
      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: userText }],
            context: {
              workspaceName: activeWorkspace.name,
              userName: currentRoommate.name,
              userRole: currentRoommate.role,
              roommatesSummary: roommates.map((r) => r.name).join(', '),
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const aiPost: HouseDiscussionPost = {
            id: `ai_${Date.now()}`,
            senderId: 'ai',
            senderName: 'Brutal AI Arbitrator',
            senderAvatar: '',
            text: data.reply || 'Ruling logged on the flat board.',
            timestamp: 'Just now',
            isAiResponse: true,
          };
          setPosts((prev) => [...prev, aiPost]);
        }
      } catch (err) {
        console.error('Failed AI discussion reply:', err);
      } finally {
        setIsAiReplying(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-50 text-electric-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 font-display">
              Flatmate Discussion & Community Feed
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Talk together with your flatmates. Mention <strong className="text-electric-600 font-mono">@AI</strong> anytime to summon the AI Arbitrator into the conversation.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-champagne-50 border border-champagne-200 text-xs font-semibold text-champagne-800">
          <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
          <span>{activeWorkspace.name}</span>
        </div>
      </div>

      {/* Discussion Stream */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-5 rounded-2xl border transition-all ${
              post.isAiResponse
                ? 'bg-gradient-to-r from-champagne-50/80 via-white to-blue-50/50 border-champagne-300 shadow-xs'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              {post.isAiResponse ? (
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-champagne-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
              ) : (
                <img
                  src={post.senderAvatar}
                  alt={post.senderName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs text-slate-900">
                      {post.senderName}
                    </span>
                    {post.isAiResponse && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-champagne-200 text-champagne-900">
                        OFFICIAL RULING
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{post.timestamp}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                  {post.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isAiReplying && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-500">
            <Bot className="w-4 h-4 text-electric-500 animate-pulse" />
            <span>The Brutal AI Arbitrator is formulating an authoritative response...</span>
          </div>
        )}
      </div>

      {/* Post Composer Bar */}
      <form onSubmit={handleSendMessage} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card flex items-center gap-3">
        <input
          type="text"
          placeholder="Message flatmates or type '@AI evaluate our split'..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-electric-500 bg-slate-50/60"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isAiReplying}
          className="px-5 py-3 rounded-xl bg-electric-500 hover:bg-electric-600 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
