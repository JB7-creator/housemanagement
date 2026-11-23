'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight, Phone, Loader2 } from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { Roommate } from '../lib/types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const { roommates, currentRoommate, setCurrentRoommateId, showToast, handleInviteRoommate, activeWorkspace } = useHouse();

  const [tab, setTab] = useState<'LOGIN' | 'SIGNUP' | 'QUICK_SWITCH'>('QUICK_SWITCH');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          showToast(`Supabase: ${error.message} (Switched locally)`);
        } else if (data?.user) {
          showToast(`Authenticated via Supabase as ${data.user.email}!`);
          const found = roommates.find(
            (r) => r.phone === email || r.name.toLowerCase() === (data.user.user_metadata?.full_name || '').toLowerCase()
          );
          if (found) setCurrentRoommateId(found.id);
          router.push('/');
          onClose();
          return;
        }
      } catch (err: any) {
        console.warn('Supabase auth attempt:', err);
      } finally {
        setLoading(false);
      }
    }

    // Match by email or use first roommate
    const matched = roommates.find((r) => r.handle.toLowerCase().includes(email.split('@')[0]?.toLowerCase() || ''));
    if (matched) {
      setCurrentRoommateId(matched.id);
      showToast(`Logged in successfully as ${matched.name}!`);
    } else {
      showToast(`Logged in successfully as ${currentRoommate.name}!`);
    }
    setLoading(false);
    router.push('/');
    onClose();
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);

    if (isSupabaseConfigured && supabase && email && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone_number: phone,
            },
          },
        });

        if (error) {
          showToast(`Supabase Notice: ${error.message}`);
        } else {
          showToast(`Supabase user registered: ${email}!`);
        }
      } catch (err: any) {
        console.warn('Supabase sign up error:', err);
      } finally {
        setLoading(false);
      }
    }

    const newRoomie: Roommate = {
      id: `user_${Date.now()}`,
      workspaceId: activeWorkspace.id,
      name,
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      phone: phone || '0712345678',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      role: 'member',
      bio: 'Flatmate at ' + activeWorkspace.name,
      diet: ['all', 'greens_lover'],
      examPeriod: false,
      availabilityScore: 1.0,
      karmaScore: 100,
      streakWeeks: 0,
    };

    handleInviteRoommate(newRoomie);
    setCurrentRoommateId(newRoomie.id);
    showToast(`Account created for ${name}! Welcome to ${activeWorkspace.name}.`);
    setLoading(false);
    router.push('/');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-50 text-electric-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Roommate Authentication & Profile
              </h3>
              <p className="text-[11px] text-slate-400">
                Log in to your private profile to maintain privacy & manage splits
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTab('QUICK_SWITCH')}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'QUICK_SWITCH' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Quick Switch
          </button>
          <button
            onClick={() => setTab('LOGIN')}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'LOGIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setTab('SIGNUP')}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'SIGNUP' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Tab 1: Quick Switch (For Testing & Multi-Member Simulation) */}
        {tab === 'QUICK_SWITCH' && (
          <div className="space-y-3">
            <span className="text-xs text-slate-500 block">
              Instantly switch into any registered flatmate profile:
            </span>
            <div className="space-y-2">
              {roommates.map((r) => {
                const isSelected = r.id === currentRoommate.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentRoommateId(r.id);
                      showToast(`Switched profile to ${r.name}`);
                      router.push('/');
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-electric-500 bg-electric-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover" />
                      <div className="text-left">
                        <span className="text-xs font-bold text-slate-900 block">{r.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{r.role} • {r.diet.join(', ')}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-electric-600 bg-electric-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Standard Login */}
        {tab === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="brian@student.uonbi.ac.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-electric-500 hover:bg-electric-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Sign In to Profile</span>
            </button>
          </form>
        )}

        {/* Tab 3: Sign Up New Flatmate */}
        {tab === 'SIGNUP' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Victor Mutua"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="victor@student.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">M-Pesa Phone Number</label>
              <input
                type="text"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-electric-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-electric-500 hover:bg-electric-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Create Account & Join Flat</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
