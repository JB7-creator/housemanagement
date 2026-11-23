'use client';

import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Bot,
  CheckCheck,
  Check,
  Share2,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { formatKES } from '../lib/utils';

interface WhatsAppMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isBot?: boolean;
}

export function WhatsAppPreviewDrawer() {
  const { activeWorkspace, currentRoommate, roommates, expenses, chores, showToast } = useHouse();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'w1',
      sender: 'Kevin Ochieng',
      text: 'UKL90123AB Confirmed. Ksh1,150.00 paid to KANGEMI FRESH VEGETABLES on 23/11/26 at 6:45 PM.\nSukuma 150 (all), Managu 250 (Kevin, Brian), Potatoes 400 (all), Milk 350 (Kevin, Brian, Maya). Dennis lactose-free.',
      time: '06:46 PM',
    },
    {
      id: 'w2',
      sender: 'HouseManager AI Bot',
      text: `✅ Safaricom M-Pesa Receipt Recorded [UKL90123AB]\n🛒 Kangemi Market: Ksh 1,150.00\nPayer: @Kevin\n\nBreakdown:\n• Sukuma: Ksh 38 ea (4 flatmates)\n• Managu: Ksh 125 ea (@Kevin, @Brian)\n• Potatoes: Ksh 100 ea (4 flatmates)\n• Fresh Milk: Ksh 117 ea (@Dennis excluded)\n\n📊 Net Settlement Balances:\n👉 @Brian owes @Kevin Ksh 380.00\n👉 @Dennis owes @Kevin Ksh 138.00\n👉 @Maya owes @Kevin Ksh 255.00`,
      time: '06:46 PM',
      isBot: true,
    },
    {
      id: 'w3',
      sender: 'HouseManager AI Bot',
      text: `☀️ Good morning ${activeWorkspace.name}!\n🧹 Daily Chore Schedule:\n👉 @Dennis is on Kitchen Sink & Stove duty today!\n\nDeadline: 10:00 PM. React with ✅ upon completion to prevent the KES 50 bounty fine.`,
      time: '07:00 AM',
      isBot: true,
    },
  ]);

  const [input, setInput] = useState('');

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: `w_${Date.now()}`,
      sender: currentRoommate.name,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    showToast('Sent simulated message to WhatsApp Flat Group!');

    // Simulated Bot auto-reply
    setTimeout(() => {
      const botReply: WhatsAppMessage = {
        id: `bot_${Date.now()}`,
        sender: 'HouseManager AI Bot',
        text: `🤖 Broadcast to ${activeWorkspace.name}:\nMessage from @${currentRoommate.name} logged in house ledger. All ${roommates.length} flatmates synchronized.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBot: true,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xl border border-emerald-400 hover:scale-105 active:scale-95 transition-all"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp Group Bot</span>
        <span className="sm:hidden">WhatsApp</span>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#EFEAE2] h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            
            {/* WhatsApp Header */}
            <div className="p-3.5 bg-[#075E54] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold text-sm">
                  🏠
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">{activeWorkspace.name}</h3>
                  <p className="text-[11px] text-emerald-200">
                    {roommates.map((r) => r.name.split(' ')[0]).join(', ')}, HouseBot
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-white hover:bg-[#0c7064] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === currentRoommate.name ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-2.5 text-xs shadow-xs relative ${
                      m.sender === currentRoommate.name
                        ? 'bg-[#E1FFC7] text-slate-900 rounded-tr-none'
                        : 'bg-white text-slate-900 rounded-tl-none'
                    }`}
                  >
                    {m.sender !== currentRoommate.name && (
                      <span className={`text-[11px] font-bold block mb-0.5 ${m.isBot ? 'text-[#075E54]' : 'text-blue-700'}`}>
                        {m.sender}
                      </span>
                    )}
                    <p className="whitespace-pre-line text-[11px] leading-relaxed">{m.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                      <span>{m.time}</span>
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendToWhatsApp} className="p-2.5 bg-[#F0F2F5] flex items-center gap-2">
              <input
                type="text"
                placeholder="Type Safaricom SMS or message to flat..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-full bg-white border border-slate-300 focus:outline-none focus:border-[#075E54]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-full bg-[#075E54] hover:bg-[#0c7064] text-white disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
