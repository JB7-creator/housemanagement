'use client';

import React, { useState } from 'react';
import { X, User, Phone, Leaf, Milk, GraduationCap, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { Roommate, DietaryPreference } from '../lib/types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { currentRoommate, roommates, showToast } = useHouse();

  const [name, setName] = useState(currentRoommate.name);
  const [phone, setPhone] = useState(currentRoommate.phone);
  const [bio, setBio] = useState(currentRoommate.bio);
  const [avatar, setAvatar] = useState(currentRoommate.avatar);

  const [isVegetarian, setIsVegetarian] = useState(currentRoommate.diet.includes('vegetarian'));
  const [isLactose, setIsLactose] = useState(currentRoommate.diet.includes('lactose_intolerant'));
  const [isGreens, setIsGreens] = useState(currentRoommate.diet.includes('greens_lover'));
  const [examActive, setExamActive] = useState(currentRoommate.examPeriod);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newDiet: DietaryPreference[] = [];
    if (isVegetarian) newDiet.push('vegetarian');
    if (isLactose) newDiet.push('lactose_intolerant');
    if (isGreens) newDiet.push('greens_lover');
    if (newDiet.length === 0) newDiet.push('all');

    // Update in memory
    currentRoommate.name = name;
    currentRoommate.phone = phone;
    currentRoommate.bio = bio;
    currentRoommate.avatar = avatar;
    currentRoommate.diet = newDiet;
    currentRoommate.examPeriod = examActive;
    currentRoommate.availabilityScore = examActive ? 0.2 : 1.0;

    // Synchronize to Supabase if logged in
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          client.from('profiles').upsert({
            id: user.id,
            full_name: name,
            phone_number: phone,
            bio: bio,
            avatar_url: avatar,
          }).then(() => {});
        }
      }).catch(() => {});
    }

    showToast('Profile updated! Your dietary splits and exam relief are synchronized.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-50 text-electric-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Customize Your Private Profile
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage your identity, M-Pesa phone number, and dietary rules
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar & Name preview */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <img src={avatar} alt={name} className="w-14 h-14 rounded-full object-cover ring-2 ring-electric-500" />
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Avatar Image URL (or type a seed)
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">M-Pesa Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Bio / Notes</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
            />
          </div>

          {/* Dietary Rules */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 block">
              Dietary Restrictions (Ensures Fair Grocery Splits):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => setIsVegetarian(e.target.checked)}
                  className="accent-electric-500 rounded"
                />
                <span>Vegetarian / SDA (Never pay for meat)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLactose}
                  onChange={(e) => setIsLactose(e.target.checked)}
                  className="accent-electric-500 rounded"
                />
                <span>Lactose Intolerant (Never pay for milk)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGreens}
                  onChange={(e) => setIsGreens(e.target.checked)}
                  className="accent-electric-500 rounded"
                />
                <span>Loves Managu & Sukuma Wiki</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700">
                <input
                  type="checkbox"
                  checked={examActive}
                  onChange={(e) => setExamActive(e.target.checked)}
                  className="accent-amber-500 rounded"
                />
                <span>Exam Week (Active Chore Relief)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
