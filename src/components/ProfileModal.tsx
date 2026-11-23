'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Shield,
  Sparkles,
  Leaf,
  Milk,
  GraduationCap,
  Save,
  CheckCircle2,
  Flame,
  Award,
} from 'lucide-react';
import { Roommate, DietaryPreference } from '../lib/types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  roommate: Roommate;
  onUpdateProfile: (updated: Roommate) => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  roommate,
  onUpdateProfile,
}: ProfileModalProps) {
  const [name, setName] = useState(roommate.name);
  const [phone, setPhone] = useState(roommate.phone);
  const [bio, setBio] = useState(roommate.bio);
  const [isVegetarian, setIsVegetarian] = useState(
    roommate.diet.includes('vegetarian')
  );
  const [isLactoseIntolerant, setIsLactoseIntolerant] = useState(
    roommate.diet.includes('lactose_intolerant')
  );
  const [isGreensLover, setIsGreensLover] = useState(
    roommate.diet.includes('greens_lover')
  );
  const [isExamPeriod, setIsExamPeriod] = useState(roommate.examPeriod);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const diet: DietaryPreference[] = [];
    if (isVegetarian) diet.push('vegetarian');
    if (isLactoseIntolerant) diet.push('lactose_intolerant');
    if (isGreensLover) diet.push('greens_lover');
    if (diet.length === 0) diet.push('all');

    const updated: Roommate = {
      ...roommate,
      name,
      phone,
      bio,
      diet,
      examPeriod: isExamPeriod,
      availabilityScore: isExamPeriod ? 0.2 : 1.0,
    };

    onUpdateProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={roommate.avatar}
                alt={roommate.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-electric-500"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-electric-500 text-white text-[9px] font-bold rounded-full uppercase">
                {roommate.role}
              </span>
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">{name || 'My Profile'}</h3>
              <p className="text-xs text-slate-400 font-mono">{roommate.handle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Karma & Streaks Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-champagne-50/70 border border-champagne-200/80">
            <div className="flex items-center justify-between text-xs text-champagne-800 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-champagne-600" />
                Fairness Karma
              </span>
              <span className="font-mono font-bold">{roommate.karmaScore}/200</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-champagne-200 overflow-hidden">
              <div
                className="h-full bg-champagne-500 rounded-full"
                style={{ width: `${Math.min(100, (roommate.karmaScore / 200) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-electric-600 block">Clean Streak</span>
              <span className="font-mono text-base font-extrabold text-slate-900">{roommate.streakWeeks} Weeks</span>
            </div>
            <Flame className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              M-Pesa Registered Phone (for settlements)
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Short Bio & Living Habits
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. 3rd year Law student · Early riser · Cooks weekend pilau"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
            />
          </div>

          {/* Dietary Preferences Section */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Dietary & Grocery Split Profile
            </span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Used by the AI sub-split engine so you only get billed for what you actually eat.
            </p>
            <div className="space-y-2 pt-1 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => setIsVegetarian(e.target.checked)}
                  className="accent-electric-500 rounded"
                />
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vegetarian / SDA (Never bill me for butchery meat or pork)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLactoseIntolerant}
                  onChange={(e) => setIsLactoseIntolerant(e.target.checked)}
                  className="accent-electric-500 rounded"
                />
                <Milk className="w-3.5 h-3.5 text-amber-600" />
                <span>Lactose Intolerant (Exclude me from shared cow milk)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGreensLover}
                  onChange={(e) => setIsGreensLover(e.target.checked)}
                  className="accent-electric-500 rounded"
                />
                <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                <span>Loves Managu, Terere & Sukuma Wiki</span>
              </label>
            </div>
          </div>

          {/* Exam Mode Toggle */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>University Exam Fortnight Mode</span>
              </div>
              <p className="text-[11px] text-amber-800/80">
                Lowers weekly chore quota to $\alpha=0.2$ during academic revisions.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isExamPeriod}
                onChange={(e) => setIsExamPeriod(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Action Buttons */}
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
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
