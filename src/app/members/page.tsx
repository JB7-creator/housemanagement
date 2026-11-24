'use client';

import React from 'react';
import { RoommateProfiles } from '../../components/RoommateProfiles';
import { useHouse } from '../../context/HouseContext';
import { Building2, UserPlus, Copy, Check, MapPin, Calendar, DollarSign, MessageCircle, Share2 } from 'lucide-react';
import { formatKES } from '../../lib/utils';

export default function MembersPage() {
  const {
    activeWorkspace,
    roommates,
    setIsWorkspaceModalOpen,
    setWorkspaceModalMode,
    showToast,
  } = useHouse();

  const [copiedCode, setCopiedCode] = React.useState(false);

  const copyInviteLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const link = `${origin}/?invite=${activeWorkspace.inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(true);
    showToast(`Copied flat invite link: ${link}`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const link = `${origin}/?invite=${activeWorkspace.inviteCode}`;
    const text = `Habari! Join our flat workspace *${activeWorkspace.name}* on RoomJustice to manage expenses and chores: ${link} (Code: *${activeWorkspace.inviteCode}*)`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Flat Details & Invite Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-50 text-electric-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              {activeWorkspace.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {activeWorkspace.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Rent Due: {activeWorkspace.rentDueDay}th of each month
            </span>
            <span>•</span>
            <span className="font-mono font-bold text-slate-800">
              Monthly Rent: {formatKES(activeWorkspace.monthlyRentKES)}
            </span>
          </div>
        </div>

        {/* Invite Code Pill & Actions */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 px-3.5 rounded-xl bg-champagne-50 border border-champagne-200 flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-champagne-800 block">
                Invite Code
              </span>
              <span className="font-mono text-sm font-extrabold text-slate-900">
                {activeWorkspace.inviteCode}
              </span>
            </div>
            <button
              onClick={copyInviteLink}
              title="Copy Full Invite Link"
              className="p-1.5 rounded-lg bg-white border border-champagne-300 hover:bg-champagne-100 text-slate-700 transition-all"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={shareViaWhatsApp}
              title="Share via WhatsApp"
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            </button>
          </div>

          <button
            onClick={() => {
              setWorkspaceModalMode('INVITE_MEMBER');
              setIsWorkspaceModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Invite & Add Members</span>
          </button>
        </div>
      </div>

      {/* Flat Members Directory */}
      <RoommateProfiles roommates={roommates} />
    </div>
  );
}
