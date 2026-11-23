'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Phone,
  Leaf,
  Milk,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Upload,
  Camera,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { Roommate, DietaryPreference } from '../lib/types';
import { KenyanPhoneInput } from './KenyanPhoneInput';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { currentRoommate, handleUpdateProfile, showToast } = useHouse();

  const [name, setName] = useState(currentRoommate.name);
  const [phone, setPhone] = useState(currentRoommate.phone);
  const [bio, setBio] = useState(currentRoommate.bio);
  const [avatar, setAvatar] = useState(currentRoommate.avatar);

  const [isVegetarian, setIsVegetarian] = useState(currentRoommate.diet.includes('vegetarian'));
  const [isLactose, setIsLactose] = useState(currentRoommate.diet.includes('lactose_intolerant'));
  const [isGreens, setIsGreens] = useState(currentRoommate.diet.includes('greens_lover'));
  const [examActive, setExamActive] = useState(currentRoommate.examPeriod);

  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file selection and convert to Base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file too large. Please upload an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatar(dataUrl);
        showToast('Photo loaded from your files!');
      }
    };
    reader.onerror = () => {
      showToast('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const resetToDicebear = () => {
    const fresh = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'roomie')}`;
    setAvatar(fresh);
    showToast('Reset avatar to generated illustration');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newDiet: DietaryPreference[] = [];
    if (isVegetarian) newDiet.push('vegetarian');
    if (isLactose) newDiet.push('lactose_intolerant');
    if (isGreens) newDiet.push('greens_lover');
    if (newDiet.length === 0) newDiet.push('all');

    // Update profile permanently through context (updates state + localStorage + Supabase DB)
    handleUpdateProfile({
      name,
      phone,
      bio,
      avatar,
      diet: newDiet,
      examPeriod: examActive,
      availabilityScore: examActive ? 0.2 : 1.0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
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
                Upload profile photo, M-Pesa phone number, and dietary fairness rules
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Avatar & File Upload Block */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Profile Photo & Avatar
            </span>
            
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-electric-500 shadow-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Upload from files"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 shadow-2xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-electric-600" />
                    <span>Upload from Files</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetToDicebear}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 text-slate-500 text-xs transition-colors"
                    title="Generate illustration avatar"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-electric-600 hover:underline"
                  >
                    {showUrlInput ? 'Hide URL' : 'Paste Image URL'}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400">
                  Select a photo directly from your device (JPG, PNG, WebP up to 5MB)
                </p>
              </div>
            </div>

            {/* Optional URL input toggle */}
            {showUrlInput && (
              <div className="pt-2 border-t border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Or Image Web URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-electric-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Full Name & Kenyan Phone Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-electric-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Kenyan M-Pesa Phone Number
              </label>
              <KenyanPhoneInput
                value={phone}
                onChange={setPhone}
                placeholder="712 345 678"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Bio / Flat Notes</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Room 3 · Engineering student · Night owl"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-electric-500"
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
