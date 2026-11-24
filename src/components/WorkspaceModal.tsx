'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  UserPlus,
  Copy,
  Check,
  Sparkles,
  Hash,
  MapPin,
  DollarSign,
  Share2,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Workspace, Roommate, DietaryPreference } from '../lib/types';
import { KenyanPhoneInput } from './KenyanPhoneInput';
import { useHouse } from '../context/HouseContext';
import { formatKenyanPhoneDisplay } from '../lib/utils';

interface WorkspaceModalProps {
  isOpen: boolean;
  mode: 'CREATE_WORKSPACE' | 'INVITE_MEMBER' | 'JOIN_WORKSPACE';
  activeWorkspace: Workspace;
  onClose: () => void;
  onCreateWorkspace: (ws: Workspace) => void;
  onInviteRoommate: (member: Roommate) => void;
  onJoinWorkspace?: (code: string) => boolean;
}

export function WorkspaceModal({
  isOpen,
  mode: initialMode,
  activeWorkspace,
  onClose,
  onCreateWorkspace,
  onInviteRoommate,
  onJoinWorkspace,
}: WorkspaceModalProps) {
  const { currentRoommate, showToast } = useHouse();

  const [currentMode, setCurrentMode] = useState<'CREATE_WORKSPACE' | 'INVITE_MEMBER' | 'JOIN_WORKSPACE'>(initialMode);

  useEffect(() => {
    setCurrentMode(initialMode);
  }, [initialMode, isOpen]);

  // Create Workspace Form State
  const [workspaceName, setWorkspaceName] = useState('');
  const [location, setLocation] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('32000');
  const [rentDueDay, setRentDueDay] = useState('5');

  // Invite Member Sub-tab
  const [inviteTab, setInviteTab] = useState<'SHARE_LINK' | 'ADD_DIRECT'>('SHARE_LINK');

  // Invite Member Form State
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberBio, setMemberBio] = useState('');
  const [memberRole, setMemberRole] = useState<'member' | 'treasurer'>('member');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isLactoseIntolerant, setIsLactoseIntolerant] = useState(false);
  const [isGreensLover, setIsGreensLover] = useState(true);
  const [isExamPeriod, setIsExamPeriod] = useState(false);

  // Confirmation view state when a member was just added directly
  const [confirmationData, setConfirmationData] = useState<{
    memberName: string;
    phone: string;
    inviteUrl: string;
    message: string;
    waUrl: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Join Workspace Form State
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const inviteUrl = `${origin}/?invite=${activeWorkspace.inviteCode}`;

  const cleanKenyanPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('0')) return '254' + digits.slice(1);
    if (digits.startsWith('254')) return digits;
    return '254' + digits;
  };

  const handleCreateWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    const code = `FLAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newWs: Workspace = {
      id: `ws_${Date.now()}`,
      name: workspaceName.trim(),
      inviteCode: code,
      location: location.trim() || 'Nairobi, Kenya',
      monthlyRentKES: parseFloat(monthlyRent) || 32000,
      rentDueDay: parseInt(rentDueDay) || 5,
      createdAt: new Date().toISOString(),
    };

    onCreateWorkspace(newWs);
    // Transition straight to INVITE_MEMBER so coordinator can immediately invite flatmates
    setCurrentMode('INVITE_MEMBER');
    setInviteTab('SHARE_LINK');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    showToast('Copied full flat invite link!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const shareViaWhatsApp = () => {
    const text = `Habari! Join our flat workspace *${activeWorkspace.name}* on RoomJustice.\n\nManage our communal M-Pesa splits, grocery fairness, and chore rotas here:\n${inviteUrl}\n\nFlat Invite Code: *${activeWorkspace.inviteCode}*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaDevice = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Join ${activeWorkspace.name} on RoomJustice`,
          text: `Join our flat workspace on RoomJustice: ${activeWorkspace.name} (Code: ${activeWorkspace.inviteCode})`,
          url: inviteUrl,
        });
      } catch (e) {}
    } else {
      copyInviteLink();
    }
  };

  const handleInviteMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    const diet: DietaryPreference[] = [];
    if (isVegetarian) diet.push('vegetarian');
    if (isLactoseIntolerant) diet.push('lactose_intolerant');
    if (isGreensLover) diet.push('greens_lover');
    if (diet.length === 0) diet.push('all');

    const cleanHandle = `@${memberName.trim().toLowerCase().replace(/\s+/g, '_')}`;
    const avatarSeed = encodeURIComponent(memberName.trim());
    const phoneNum = memberPhone || '0712345678';

    const newMember: Roommate = {
      id: `roomie_${Date.now()}`,
      workspaceId: activeWorkspace.id,
      name: memberName.trim(),
      email: memberEmail.trim(),
      handle: cleanHandle,
      phone: phoneNum,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
      role: memberRole,
      bio: memberBio.trim() || `Flatmate at ${activeWorkspace.name}`,
      diet,
      examPeriod: isExamPeriod,
      availabilityScore: isExamPeriod ? 0.2 : 1.0,
      karmaScore: 100,
      streakWeeks: 0,
    };

    onInviteRoommate(newMember);

    // Build personalized WhatsApp confirmation message
    const waPhone = cleanKenyanPhone(phoneNum);
    const confirmationMsg = `Habari ${newMember.name}! You have been added to *${activeWorkspace.name}* by ${currentRoommate.name} on RoomJustice.\n\nClick this invite link to authenticate with Google or Email and access our flat expenses and chore rotations:\n${inviteUrl}\n\nFlat Invite Code: *${activeWorkspace.inviteCode}*`;
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(confirmationMsg)}`;

    setConfirmationData({
      memberName: newMember.name,
      phone: phoneNum,
      inviteUrl,
      message: confirmationMsg,
      waUrl,
    });
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoinError('');
    const success = onJoinWorkspace?.(joinCode);
    if (success) {
      setJoinCode('');
      onClose();
    } else {
      setJoinError('Invalid invite code. Ask your flat coordinator for the correct code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-electric-50 border border-electric-200 flex items-center justify-center text-electric-600">
              {currentMode === 'CREATE_WORKSPACE' ? (
                <Building2 className="w-4 h-4" />
              ) : currentMode === 'JOIN_WORKSPACE' ? (
                <Hash className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                {currentMode === 'CREATE_WORKSPACE'
                  ? 'Create New Flat Workspace'
                  : currentMode === 'JOIN_WORKSPACE'
                  ? 'Join a Flat by Invite Code'
                  : `Invite Members to ${activeWorkspace.name}`}
              </h3>
              <p className="text-[11px] text-slate-400">
                {currentMode === 'CREATE_WORKSPACE'
                  ? 'Set up your shared apartment or hostel environment'
                  : currentMode === 'JOIN_WORKSPACE'
                  ? 'Enter the code provided by your flat coordinator'
                  : 'Share invite link or add flatmates with direct WhatsApp confirmations'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setConfirmationData(null);
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODE 1: JOIN WORKSPACE */}
        {currentMode === 'JOIN_WORKSPACE' && (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-electric-50/60 border border-electric-200 text-xs text-electric-800 font-medium">
              Enter the invite code shared by your flat coordinator (e.g.{' '}
              <span className="font-mono font-bold">ROYS-402</span> or{' '}
              <span className="font-mono font-bold">FLAT-4291</span>).
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Flat Invite Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ROYS-402"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                  setJoinError('');
                }}
                className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500 font-mono tracking-widest uppercase"
              />
              {joinError && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{joinError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Join Flat →
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: CREATE WORKSPACE */}
        {currentMode === 'CREATE_WORKSPACE' && (
          <form onSubmit={handleCreateWorkspaceSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Flat / Apartment Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lumumba Drive Flat 4B, Juja Greenfield"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location / Estate
                </label>
                <input
                  type="text"
                  placeholder="e.g. Roysambu, Madaraka, Juja"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Total Monthly Rent (KES)
                </label>
                <input
                  type="number"
                  placeholder="32000"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Rent Due Day of the Month
              </label>
              <select
                value={rentDueDay}
                onChange={(e) => setRentDueDay(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
              >
                {[1, 5, 10, 15, 20, 25, 28, 30].map((day) => (
                  <option key={day} value={day}>
                    {day}th of every month
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Create Flat & Invite Members →
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: INVITE MEMBERS (SHARE LINK OR ADD DIRECTLY + WHATSAPP CONFIRMATION) */}
        {currentMode === 'INVITE_MEMBER' && (
          <div className="space-y-4">
            {/* If confirmation screen is active after adding a member directly */}
            {confirmationData ? (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      {confirmationData.memberName} Added to {activeWorkspace.name}!
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Send them their confirmation message so they can authenticate and claim their profile.
                    </p>
                  </div>
                </div>

                {/* Message Preview Box */}
                <div className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Confirmation Message to 🇰🇪 {formatKenyanPhoneDisplay(confirmationData.phone)}:
                  </span>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap font-sans bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {confirmationData.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <a
                    href={confirmationData.waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>Send via WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(confirmationData.message);
                      setCopiedMsg(true);
                      showToast('Copied confirmation message!');
                      setTimeout(() => setCopiedMsg(false), 2500);
                    }}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMsg ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationData(null);
                      setMemberName('');
                      setMemberPhone('');
                      setMemberEmail('');
                      setMemberBio('');
                    }}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    + Add Another
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Invite Navigation Tabs */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setInviteTab('SHARE_LINK')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      inviteTab === 'SHARE_LINK'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-electric-500" />
                    <span>Share Invite Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteTab('ADD_DIRECT')}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      inviteTab === 'ADD_DIRECT'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5 text-electric-500" />
                    <span>Add Member Directly</span>
                  </button>
                </div>

                {/* TAB A: SHARE LINK */}
                {inviteTab === 'SHARE_LINK' && (
                  <div className="space-y-4">
                    {/* Shareable Invite Card */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Flat Invite Link:
                        </span>
                        <span className="text-[11px] font-mono font-bold text-electric-600 bg-electric-50 px-2 py-0.5 rounded border border-electric-200">
                          {activeWorkspace.inviteCode}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-700 break-all select-all">
                        {inviteUrl}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={copyInviteLink}
                          className="py-2 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={shareViaWhatsApp}
                          className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                          <span>Share on WhatsApp</span>
                        </button>
                      </div>
                    </div>

                    {/* Authentication Security Notice */}
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold block">Mandatory Authentication Enforced</span>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          When your flatmate taps this link, they are automatically directed to authenticate with Google, GitHub, or Email before accessing your flat's private ledger and chores.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB B: ADD MEMBER DIRECTLY */}
                {inviteTab === 'ADD_DIRECT' && (
                  <form onSubmit={handleInviteMemberSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Roommate Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sharon Atieno"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Kenyan M-Pesa Phone Number *
                        </label>
                        <KenyanPhoneInput
                          value={memberPhone}
                          onChange={setMemberPhone}
                          placeholder="712 345 678"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="sharon@student.ke"
                          value={memberEmail}
                          onChange={(e) => setMemberEmail(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Flat Role
                        </label>
                        <select
                          value={memberRole}
                          onChange={(e) => setMemberRole(e.target.value as 'member' | 'treasurer')}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="member">Flatmate / Member</option>
                          <option value="treasurer">Treasurer (Ledger Auditor)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Short Bio / Room #
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Room 2 · Law finalist"
                          value={memberBio}
                          onChange={(e) => setMemberBio(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
                        />
                      </div>
                    </div>

                    {/* Dietary Checkboxes */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-800 block">
                        Dietary Fairness & Availability Rules:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isVegetarian}
                            onChange={(e) => setIsVegetarian(e.target.checked)}
                            className="rounded border-slate-300 text-electric-600 focus:ring-0"
                          />
                          <span>Vegetarian (No meat)</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isLactoseIntolerant}
                            onChange={(e) => setIsLactoseIntolerant(e.target.checked)}
                            className="rounded border-slate-300 text-electric-600 focus:ring-0"
                          />
                          <span>Lactose Intolerant</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isGreensLover}
                            onChange={(e) => setIsGreensLover(e.target.checked)}
                            className="rounded border-slate-300 text-electric-600 focus:ring-0"
                          />
                          <span>Loves Greens</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer text-amber-700 font-semibold">
                          <input
                            type="checkbox"
                            checked={isExamPeriod}
                            onChange={(e) => setIsExamPeriod(e.target.checked)}
                            className="rounded border-slate-300 text-amber-500 focus:ring-0"
                          />
                          <span>Exam Period Relief</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                      >
                        <span>Add & Send WhatsApp Confirmation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
