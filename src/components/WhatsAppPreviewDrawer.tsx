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
  ExternalLink,
  Users,
  Copy,
  AlertCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import {
  formatKES,
  formatKenyanPhoneDisplay,
  getWhatsAppUrl,
  detectKenyanCarrier,
  normalizeKenyanPhone,
} from '../lib/utils';
import { Roommate } from '../lib/types';

interface WhatsAppMessage {
  id: string;
  sender: string;
  recipientPhone?: string;
  recipientName?: string;
  text: string;
  time: string;
  isBot?: boolean;
}

export function WhatsAppPreviewDrawer() {
  const { activeWorkspace, currentRoommate, roommates, expenses, chores, showToast } = useHouse();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('ALL');
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Initial messages seeded with active workspace context
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'w1',
      sender: 'HouseManager AI Bot',
      text: `🏠 Welcome to ${activeWorkspace.name} WhatsApp Dispatch!\nAll ${roommates.length} flatmate phone numbers are synchronized with the M-Pesa ledger.\n\nYou can send automated reminders (Chores, Rent, M-Pesa splits) directly to their actual WhatsApp numbers!`,
      time: '08:00 AM',
      isBot: true,
    },
    {
      id: 'w2',
      sender: currentRoommate.name,
      text: `Habari flatmates! Rent due date is set for the ${activeWorkspace.rentDueDay}th of each month. Let's keep our ledger balanced!`,
      time: '08:15 AM',
    },
  ]);

  const [input, setInput] = useState('');

  // Selected recipient roommate
  const selectedRoommate: Roommate | undefined =
    selectedRecipientId === 'ALL'
      ? undefined
      : roommates.find((r) => r.id === selectedRecipientId);

  // Target phone number for WhatsApp link
  const targetPhone = selectedRoommate ? selectedRoommate.phone : (roommates[0]?.phone || '0712345678');
  const carrier = detectKenyanCarrier(targetPhone);

  // Quick Action Template Generator
  const applyTemplate = (type: 'CHORE' | 'RENT' | 'EXPENSE' | 'INFRACTION') => {
    const flatmateName = selectedRoommate ? selectedRoommate.name : 'Flatmate';
    const rentPerPerson = Math.round(activeWorkspace.monthlyRentKES / Math.max(1, roommates.length));

    // Find assigned chore for this roommate
    const assignedChore = chores.find(
      (c) => c.assignedToId === (selectedRoommate ? selectedRoommate.id : currentRoommate.id)
    ) || chores[0];

    let templateText = '';

    if (type === 'CHORE') {
      templateText = `🧹 Habari ${flatmateName}! Friendly reminder from ${activeWorkspace.name} Bot: You are on "${assignedChore?.title || 'Kitchen Sanitization'}" today. Please complete by ${assignedChore?.dueTime || '8:00 PM'} to avoid the KES 50 bounty fine! ✅`;
    } else if (type === 'RENT') {
      templateText = `🏠 Jambo ${flatmateName}! Notice from ${activeWorkspace.name}: Monthly rent of ${formatKES(rentPerPerson)} is due on the ${activeWorkspace.rentDueDay}th. Please settle via M-Pesa to prevent landlord estate penalties. 📲`;
    } else if (type === 'EXPENSE') {
      templateText = `🛒 Ujumbe kutoka ${activeWorkspace.name}: Hey ${flatmateName}, your share for the recent communal flat purchase is ready for settlement. Please send via M-Pesa to ${currentRoommate.name} (${formatKenyanPhoneDisplay(currentRoommate.phone)}). Asante sana!`;
    } else if (type === 'INFRACTION') {
      templateText = `⚖️ Notice from ${activeWorkspace.name} Parliament: Please remember quiet study hours (10:00 PM) during exam periods as agreed in our house charter. Let's keep the flat peaceful! 🤝`;
    }

    setInput(templateText);
  };

  // Open Direct Official WhatsApp Click-to-Chat (wa.me)
  const handleOpenOfficialWhatsApp = () => {
    const messageToSend = input.trim() || `Habari from ${activeWorkspace.name}!`;
    const url = getWhatsAppUrl(targetPhone, messageToSend);
    window.open(url, '_blank');
    showToast(`Opening WhatsApp chat with ${selectedRoommate ? selectedRoommate.name : 'Flatmate'} (${formatKenyanPhoneDisplay(targetPhone)})`);
  };

  // Simulate in-app send
  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: `w_${Date.now()}`,
      sender: currentRoommate.name,
      recipientName: selectedRoommate ? selectedRoommate.name : 'All Flatmates',
      recipientPhone: selectedRoommate ? selectedRoommate.phone : undefined,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    const sentText = input.trim();
    setInput('');
    showToast(`Dispatched message to ${newMsg.recipientName}!`);

    // Simulated Bot auto-reply with real workspace context
    setTimeout(() => {
      const isBroadcast = selectedRecipientId === 'ALL';
      const targetName = selectedRoommate ? selectedRoommate.name : 'the flat';

      const botReply: WhatsAppMessage = {
        id: `bot_${Date.now()}`,
        sender: 'HouseManager AI Bot',
        text: `🤖 Gateway Confirmation [${activeWorkspace.name}]:\nDispatched to: ${
          isBroadcast ? `Broadcast (All ${roommates.length} members)` : `${targetName} (${formatKenyanPhoneDisplay(targetPhone)})`
        }\nMessage state: Delivered (✓✓). Ledger updated.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBot: true,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(targetPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
    showToast(`Copied phone number ${targetPhone} to clipboard`);
  };

  return (
    <>
      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xl border border-emerald-400 hover:scale-105 active:scale-95 transition-all"
        title="Open WhatsApp Flat Bot"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp Group Bot</span>
        <span className="sm:hidden">WhatsApp</span>
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#EFEAE2] h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            
            {/* WhatsApp Header */}
            <div className="p-3.5 bg-[#075E54] text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold text-base shadow-xs">
                  🏠
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    <span>{activeWorkspace.name}</span>
                    <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded text-emerald-100 font-mono">
                      {activeWorkspace.inviteCode}
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    {roommates.length} flatmates • Bot connected
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white hover:bg-[#0c7064] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Roommate Selector & Phone Badge */}
            <div className="bg-white border-b border-slate-200 p-3 space-y-2.5 shrink-0 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-electric-600" />
                  <span>Direct Message Recipient:</span>
                </label>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Numbers Synchronized
                </span>
              </div>

              {/* Recipient Dropdown */}
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-electric-500"
              >
                <option value="ALL">📢 Broadcast to All Flatmates ({roommates.length} members)</option>
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>
                    👤 {r.name} ({r.role}) • {formatKenyanPhoneDisplay(r.phone)}
                  </option>
                ))}
              </select>

              {/* Selected Roommate Phone Card */}
              {selectedRoommate ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <img src={selectedRoommate.avatar} alt={selectedRoommate.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px]">{selectedRoommate.name}</span>
                      <span className="font-mono text-[10px] text-slate-600 flex items-center gap-1">
                        <span>🇰🇪</span>
                        <span>{formatKenyanPhoneDisplay(selectedRoommate.phone)}</span>
                        <span className={`px-1 rounded text-[8px] font-bold ${carrier.badge}`}>
                          {carrier.name}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={copyNumber}
                      className="p-1.5 text-slate-500 hover:text-slate-800 bg-white rounded border border-slate-200 shadow-2xs"
                      title="Copy phone number"
                    >
                      {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenOfficialWhatsApp}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366] hover:bg-[#20bd5a] text-white text-[10px] font-bold shadow-2xs transition-colors"
                      title="Open chat in WhatsApp"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <span>Targeting all {roommates.length} flatmate numbers simultaneously</span>
                  <button
                    type="button"
                    onClick={handleOpenOfficialWhatsApp}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366] hover:bg-[#20bd5a] text-white text-[10px] font-bold shadow-2xs"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Group</span>
                  </button>
                </div>
              )}

              {/* Quick Template Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 shrink-0">Templates:</span>
                <button
                  type="button"
                  onClick={() => applyTemplate('CHORE')}
                  className="px-2 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[10px] font-semibold text-amber-800 shrink-0 transition-colors"
                >
                  🧹 Chore Alert
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('RENT')}
                  className="px-2 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[10px] font-semibold text-blue-800 shrink-0 transition-colors"
                >
                  🏠 Rent Due
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('EXPENSE')}
                  className="px-2 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-semibold text-emerald-800 shrink-0 transition-colors"
                >
                  📲 M-Pesa Split
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('INFRACTION')}
                  className="px-2 py-1 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[10px] font-semibold text-purple-800 shrink-0 transition-colors"
                >
                  ⚖️ Quiet Hours
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const isMe = m.sender === currentRoommate.name;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-2.5 text-xs shadow-xs relative ${
                        isMe
                          ? 'bg-[#E1FFC7] text-slate-900 rounded-tr-none'
                          : m.isBot
                          ? 'bg-white border border-emerald-200 text-slate-900 rounded-tl-none'
                          : 'bg-white text-slate-900 rounded-tl-none'
                      }`}
                    >
                      {!isMe && (
                        <div className="flex items-center gap-1.5 mb-1">
                          {m.isBot && <Bot className="w-3.5 h-3.5 text-[#075E54]" />}
                          <span
                            className={`text-[11px] font-bold ${
                              m.isBot ? 'text-[#075E54]' : 'text-blue-700'
                            }`}
                          >
                            {m.sender}
                          </span>
                        </div>
                      )}

                      {m.recipientName && (
                        <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mb-1">
                          To: {m.recipientName}
                        </span>
                      )}

                      <p className="whitespace-pre-line text-[11px] leading-relaxed">{m.text}</p>
                      
                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                        <span>{m.time}</span>
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Bar & Direct Send Actions */}
            <div className="p-2.5 bg-[#F0F2F5] border-t border-slate-200 shrink-0 space-y-2">
              <form onSubmit={handleSendToWhatsApp} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={
                    selectedRoommate
                      ? `Message ${selectedRoommate.name} (${formatKenyanPhoneDisplay(selectedRoommate.phone)})...`
                      : 'Type broadcast to all flatmates...'
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-full bg-white border border-slate-300 focus:outline-none focus:border-[#075E54]"
                />
                
                {/* Send In App */}
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 rounded-full bg-[#075E54] hover:bg-[#0c7064] text-white disabled:opacity-40 transition-colors"
                  title="Simulate bot dispatch in app"
                >
                  <Send className="w-4 h-4" />
                </button>

                {/* Direct Send via Official WhatsApp Link */}
                <button
                  type="button"
                  onClick={handleOpenOfficialWhatsApp}
                  disabled={!input.trim()}
                  className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white disabled:opacity-40 transition-colors shadow-2xs"
                  title="Open in WhatsApp Web / App directly"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span>Green button opens official WhatsApp (<span className="font-mono">wa.me</span>)</span>
                <span>Dark button tests in-app bot</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
