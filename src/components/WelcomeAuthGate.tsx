'use client';

import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Building2,
  KeyRound,
  UserPlus,
  LogIn,
  Sparkles,
  ArrowRight,
  Upload,
  Camera,
  RotateCcw,
  Leaf,
  GraduationCap,
  Users,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  Home,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { KenyanPhoneInput } from './KenyanPhoneInput';
import { DietaryPreference, Roommate } from '../lib/types';
import { formatKenyanPhoneDisplay } from '../lib/utils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function WelcomeAuthGate() {
  const {
    allRoommates,
    workspaces,
    loginUser,
    registerAndOnboard,
    showToast,
  } = useHouse();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign up profile state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=student1');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isLactose, setIsLactose] = useState(false);
  const [isGreens, setIsGreens] = useState(true);
  const [isExam, setIsExam] = useState(false);

  // Sign up flat choice state
  const [flatChoice, setFlatChoice] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [newFlatName, setNewFlatName] = useState('');
  const [newFlatLocation, setNewFlatLocation] = useState('Roysambu, Nairobi');
  const [newFlatRent, setNewFlatRent] = useState('32000');
  const [newFlatRentDay, setNewFlatRentDay] = useState('5');
  const [joinInviteCode, setJoinInviteCode] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload from local disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatar(dataUrl);
        showToast('Photo uploaded from your files!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNameChange = (val: string) => {
    setFullName(val);
    if (!avatar.startsWith('data:image/')) {
      setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(val || 'student')}`);
    }
  };

  // Handle Standard Login Submit
  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isSupabaseConfigured && supabase && loginEmail && loginPassword) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });

        if (!error && data?.user) {
          const match = allRoommates.find(
            (r) =>
              r.phone === loginEmail ||
              r.handle.toLowerCase().includes(loginEmail.split('@')[0]?.toLowerCase()) ||
              r.name.toLowerCase() === (data.user.user_metadata?.full_name || '').toLowerCase()
          );
          if (match) {
            loginUser(match.id);
            setIsSubmitting(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Supabase auth warning:', err);
      }
    }

    // Match by email, handle, or phone
    const cleanSearch = loginEmail.trim().toLowerCase();
    const matched = allRoommates.find(
      (r) =>
        r.handle.toLowerCase().includes(cleanSearch.replace('@', '')) ||
        r.name.toLowerCase().includes(cleanSearch) ||
        r.phone.includes(cleanSearch)
    );

    if (matched) {
      loginUser(matched.id);
    } else if (allRoommates.length > 0) {
      // Fallback to first registered roommate
      loginUser(allRoommates[0].id);
    }

    setIsSubmitting(false);
  };

  // Handle Sign Up & Onboarding Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Please enter your full name');
      return;
    }

    setIsSubmitting(true);

    // Optional Supabase signup sync
    if (isSupabaseConfigured && supabase && email && password) {
      try {
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone_number: phone,
            },
          },
        });
      } catch (err) {
        console.warn('Supabase sign up warning:', err);
      }
    }

    const dietList: DietaryPreference[] = [];
    if (isVegetarian) dietList.push('vegetarian');
    if (isLactose) dietList.push('lactose_intolerant');
    if (isGreens) dietList.push('greens_lover');
    if (dietList.length === 0) dietList.push('all');

    const newUser: Partial<Roommate> = {
      name: fullName.trim(),
      phone: phone || '0712345678',
      avatar,
      bio: bio || 'Flatmate',
      diet: dietList,
      examPeriod: isExam,
    };

    if (flatChoice === 'CREATE') {
      const success = registerAndOnboard(newUser, {
        mode: 'CREATE',
        ws: {
          name: newFlatName.trim() || `${fullName}'s Flat`,
          location: newFlatLocation.trim(),
          monthlyRentKES: parseFloat(newFlatRent) || 32000,
          rentDueDay: parseInt(newFlatRentDay) || 5,
        },
      });
      setIsSubmitting(false);
    } else {
      if (!joinInviteCode.trim()) {
        showToast('Please enter an invite code (e.g. ROYS-402)');
        setIsSubmitting(false);
        return;
      }

      const success = registerAndOnboard(newUser, {
        mode: 'JOIN',
        inviteCode: joinInviteCode.trim(),
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-radial from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* Background Architectural Accent Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-electric-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[300px] bg-champagne-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 shadow-inner text-xs font-semibold text-slate-300">
            <span className="text-sm">🇰🇪</span>
            <span>RoomJustice Kenya</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-champagne-400 font-mono text-[11px]">Campus & Flat OS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Enter Your Flat Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Log in to your private roommate profile or create an apartment workspace to access your scoped expenses, chores, and WhatsApp bot.
          </p>
        </div>

        {/* Auth Mode Toggle Pill */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('LOGIN')}
              className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'LOGIN'
                  ? 'bg-electric-500 text-white shadow-lg shadow-electric-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SIGNUP')}
              className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'SIGNUP'
                  ? 'bg-electric-500 text-white shadow-lg shadow-electric-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Flat</span>
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {/* TAB 1: LOG IN */}
            {activeTab === 'LOGIN' ? (
              <div className="space-y-6">
                
                {/* 1-Tap Quick Select Existing Profiles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-champagne-400" />
                      <span>Select Your Flatmate Profile (1-Tap):</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {allRoommates.length} active flatmates
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {allRoommates.map((r) => {
                      const ws = workspaces.find((w) => w.id === r.workspaceId) || workspaces[0];
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => loginUser(r.id)}
                          className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-electric-500 text-left flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={r.avatar}
                              alt={r.name}
                              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-electric-400 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate group-hover:text-electric-300">
                                {r.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {ws.name} • <span className="capitalize">{r.role}</span>
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 block">
                                🇰🇪 {formatKenyanPhoneDisplay(r.phone)}
                              </span>
                            </div>
                          </div>

                          <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-electric-500 text-slate-400 group-hover:text-white shrink-0 transition-colors ml-2">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
                    Or Login with Credentials
                  </span>
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleStandardLogin} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Email, Handle, or M-Pesa Phone
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. brian@student.ke or 0712345678"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-electric-500 hover:bg-electric-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-electric-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Log In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

              </div>
            ) : (
              /* TAB 2: SIGN UP & CHOOSE ENVIRONMENT */
              <form onSubmit={handleSignUpSubmit} className="space-y-5">
                
                {/* Step 1: Profile Info */}
                <div className="space-y-3.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-champagne-400 block">
                    Step 1: Your Profile & Photo
                  </span>

                  {/* Photo Upload & Preview */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
                    <div className="relative group shrink-0">
                      <img
                        src={avatar}
                        alt="Profile avatar"
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-electric-500 bg-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Upload photo from device"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-electric-400" />
                          <span>Upload Photo from Files</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Choose your real photo from device or keep generated avatar
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Victor Mutua"
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Kenyan M-Pesa Phone
                      </label>
                      <KenyanPhoneInput
                        value={phone}
                        onChange={setPhone}
                        placeholder="712 345 678"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="victor@student.ke"
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                  </div>

                  {/* Dietary Checkboxes */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      Dietary Restrictions (Ensures Fair Grocery Splits):
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
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
                          checked={isLactose}
                          onChange={(e) => setIsLactose(e.target.checked)}
                          className="accent-electric-500 rounded"
                        />
                        <span>Lactose Intolerant</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isGreens}
                          onChange={(e) => setIsGreens(e.target.checked)}
                          className="accent-electric-500 rounded"
                        />
                        <span>Loves Sukuma & Greens</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                        <input
                          type="checkbox"
                          checked={isExam}
                          onChange={(e) => setIsExam(e.target.checked)}
                          className="accent-amber-500 rounded"
                        />
                        <span>Exam Period Active</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Step 2: Choose Living Environment */}
                <div className="space-y-3.5 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-champagne-400 block">
                    Step 2: Choose Your Flat Workspace
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setFlatChoice('CREATE')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                        flatChoice === 'CREATE'
                          ? 'border-electric-500 bg-electric-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-electric-400" />
                      <span>Create New Flat</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        Set up full environment
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlatChoice('JOIN')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                        flatChoice === 'JOIN'
                          ? 'border-champagne-500 bg-champagne-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <KeyRound className="w-5 h-5 text-champagne-400" />
                      <span>Join Flat by Code</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        Enter invite code
                      </span>
                    </button>
                  </div>

                  {flatChoice === 'CREATE' ? (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Flat / Apartment Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newFlatName}
                          onChange={(e) => setNewFlatName(e.target.value)}
                          placeholder="e.g. Lumumba Hall 4B, Juja Heights Flat 3"
                          className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Estate / Location
                          </label>
                          <input
                            type="text"
                            value={newFlatLocation}
                            onChange={(e) => setNewFlatLocation(e.target.value)}
                            placeholder="e.g. Roysambu, Juja, Madaraka"
                            className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Monthly Rent (KES)
                          </label>
                          <input
                            type="number"
                            value={newFlatRent}
                            onChange={(e) => setNewFlatRent(e.target.value)}
                            placeholder="32000"
                            className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-electric-500"
                          />
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400">
                        ℹ️ Creating this flat provisions 3 starter flatmates, 4 expenses, 4 chores, and bills.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Flat Invite Code
                        </label>
                        <input
                          type="text"
                          required
                          value={joinInviteCode}
                          onChange={(e) => setJoinInviteCode(e.target.value)}
                          placeholder="e.g. ROYS-402 or FLAT-XXXX"
                          className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono uppercase tracking-widest focus:outline-none focus:border-champagne-500"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Ask your coordinator for the code</span>
                        <button
                          type="button"
                          onClick={() => setJoinInviteCode('ROYS-402')}
                          className="text-champagne-400 hover:underline"
                        >
                          Use Demo Code: ROYS-402
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Onboarding */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-electric-500 hover:bg-electric-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-electric-500/25 flex items-center justify-center gap-2 mt-2"
                >
                  <span>Launch My Flat Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-400">
          RoomJustice guarantees workspace privacy & fair M-Pesa expense splitting for Kenyan university flatmates.
        </p>

      </div>
    </div>
  );
}
