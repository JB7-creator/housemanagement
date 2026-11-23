'use client';

import React, { useState } from 'react';
import { X, Building2, UserPlus, Copy, Check, Sparkles, Hash, MapPin, DollarSign } from 'lucide-react';
import { Workspace, Roommate, DietaryPreference } from '../lib/types';
import { KenyanPhoneInput } from './KenyanPhoneInput';

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
  mode,
  activeWorkspace,
  onClose,
  onCreateWorkspace,
  onInviteRoommate,
  onJoinWorkspace,
}: WorkspaceModalProps) {
  // Create Workspace Form State
  const [workspaceName, setWorkspaceName] = useState('');
  const [location, setLocation] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('32000');
  const [rentDueDay, setRentDueDay] = useState('5');

  // Invite Member Form State
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberBio, setMemberBio] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isLactoseIntolerant, setIsLactoseIntolerant] = useState(false);
  const [isGreensLover, setIsGreensLover] = useState(true);
  const [isExamPeriod, setIsExamPeriod] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);

  // Join Workspace Form State
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  if (!isOpen) return null;

  const handleCreateWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName) return;

    const code = `FLAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newWs: Workspace = {
      id: `ws_${Date.now()}`,
      name: workspaceName,
      inviteCode: code,
      location: location || 'Nairobi, Kenya',
      monthlyRentKES: parseFloat(monthlyRent) || 30000,
      rentDueDay: parseInt(rentDueDay) || 5,
      createdAt: new Date().toISOString(),
    };

    onCreateWorkspace(newWs);
    onClose();
  };

  const handleInviteMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName) return;

    const diet: DietaryPreference[] = [];
    if (isVegetarian) diet.push('vegetarian');
    if (isLactoseIntolerant) diet.push('lactose_intolerant');
    if (isGreensLover) diet.push('greens_lover');
    if (diet.length === 0) diet.push('all');

    const cleanHandle = `@${memberName.toLowerCase().replace(/\s+/g, '_')}`;
    const avatarSeed = encodeURIComponent(memberName);

    const newMember: Roommate = {
      id: `roomie_${Date.now()}`,
      workspaceId: activeWorkspace.id,
      name: memberName,
      handle: cleanHandle,
      phone: memberPhone || '0700000000',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
      role: 'member',
      bio: memberBio || 'Roommate at ' + activeWorkspace.name,
      diet,
      examPeriod: isExamPeriod,
      availabilityScore: isExamPeriod ? 0.2 : 1.0,
      karmaScore: 100,
      streakWeeks: 0,
    };

    onInviteRoommate(newMember);
    onClose();
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(activeWorkspace.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-50 border border-electric-200 flex items-center justify-center text-electric-600">
              {mode === 'CREATE_WORKSPACE' ? <Building2 className="w-4 h-4" /> : mode === 'JOIN_WORKSPACE' ? <Hash className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                {mode === 'CREATE_WORKSPACE' ? 'Create New Flat Workspace' : mode === 'JOIN_WORKSPACE' ? 'Join a Flat by Invite Code' : `Invite Roommate to ${activeWorkspace.name}`}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'CREATE_WORKSPACE'
                  ? 'Set up your shared apartment or university hostel'
                  : mode === 'JOIN_WORKSPACE'
                  ? 'Enter the code shared by your flat coordinator'
                  : 'Add flatmates with dietary & exam schedules'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on mode */}
        {mode === 'JOIN_WORKSPACE' ? (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-electric-50/60 border border-electric-200 text-xs text-electric-800 font-medium">
              Ask your flat coordinator to share the flat invite code (e.g. <span className="font-mono font-bold">FLAT-4291</span>). Enter it below to join their workspace.
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Flat Invite Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ROYS-402 or FLAT-4291"
                value={joinCode}
                onChange={(e) => { setJoinCode(e.target.value); setJoinError(''); }}
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
        ) : mode === 'CREATE_WORKSPACE' ? (
          <form onSubmit={handleCreateWorkspaceSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Flat / Apartment Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Goshen Plains Flat 4B, Lumumba Hall 6"
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
                  placeholder="e.g. Juja, Roysambu, Madaraka"
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
                Create Workspace
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleInviteMemberSubmit} className="space-y-4">
            {/* Shareable Invite Code Pill */}
            <div className="p-3 rounded-xl bg-champagne-50/80 border border-champagne-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-champagne-800 block">
                  Flat Invite Code
                </span>
                <span className="font-mono text-sm font-extrabold text-slate-900">{activeWorkspace.inviteCode}</span>
              </div>
              <button
                type="button"
                onClick={copyInvite}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-champagne-300 text-slate-800 text-xs font-semibold hover:bg-champagne-100 transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Roommate Full Name
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Kenyan M-Pesa Phone Number
                </label>
                <KenyanPhoneInput
                  value={memberPhone}
                  onChange={setMemberPhone}
                  placeholder="712 345 678"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Short Bio / Room #
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 2 · Law student"
                  value={memberBio}
                  onChange={(e) => setMemberBio(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
                />
              </div>
            </div>

            {/* Dietary Checkboxes */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Dietary & Fairness Profile:</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVegetarian}
                    onChange={(e) => setIsVegetarian(e.target.checked)}
                    className="accent-electric-500 rounded"
                  />
                  <span>Vegetarian / SDA (No meat)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLactoseIntolerant}
                    onChange={(e) => setIsLactoseIntolerant(e.target.checked)}
                    className="accent-electric-500 rounded"
                  />
                  <span>Lactose Intolerant (No milk)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGreensLover}
                    onChange={(e) => setIsGreensLover(e.target.checked)}
                    className="accent-electric-500 rounded"
                  />
                  <span>Loves Managu & Greens</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-amber-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={isExamPeriod}
                    onChange={(e) => setIsExamPeriod(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Exam Period (Chore relief)</span>
                </label>
              </div>
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
                Add Member to Flat
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
