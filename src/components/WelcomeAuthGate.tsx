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
  AlertCircle,
  Lock,
  Phone,
  Mail,
  Home,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { KenyanPhoneInput } from './KenyanPhoneInput';
import { DietaryPreference, Roommate } from '../lib/types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { RoomJusticeLogo } from './RoomJusticeLogo';

export function WelcomeAuthGate() {
  const {
    allRoommates,
    workspaces,
    loginUser,
    registerAndOnboard,
    verifyAndLogin,
    loginWithOAuth,
    sendMagicLink,
    pendingOAuthUser,
    setPendingOAuthUser,
    showToast,
  } = useHouse();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<'google' | 'github' | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

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

  // Auto-detect invite code from URL query params (e.g. ?invite=ROYS-402 or ?code=FLAT-1234)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('invite') || params.get('code') || params.get('flat');
      if (code) {
        const clean = code.trim().toUpperCase();
        setJoinInviteCode(clean);
        setFlatChoice('JOIN');
        try {
          localStorage.setItem('roomjustice_pending_invite_code', clean);
        } catch (e) {}
      } else {
        try {
          const stored = localStorage.getItem('roomjustice_pending_invite_code');
          if (stored) {
            setJoinInviteCode(stored.trim().toUpperCase());
            setFlatChoice('JOIN');
          }
        } catch (e) {}
      }
    }
  }, []);

  const invitedWorkspace = workspaces.find(
    (w) => w.inviteCode.toUpperCase() === joinInviteCode.trim().toUpperCase()
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local file photo upload
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

  // Handle Standard Login Submit (Credentials verified, NO unauthenticated bypass)
  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const result = await verifyAndLogin(loginEmail, loginPassword);
      if (!result.success) {
        setAuthError(result.error || 'Invalid email or password. Please verify your credentials.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OAuth Sign-in (Google / GitHub)
  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setAuthError(null);
    setIsOAuthLoading(provider);
    try {
      await loginWithOAuth(provider);
    } catch (err: any) {
      setAuthError(`OAuth initialization error: ${err.message}`);
      setIsOAuthLoading(null);
    }
  };

  // Handle Magic Link request
  const handleMagicLink = async () => {
    if (!loginEmail.trim()) {
      setAuthError('Please enter your email above to receive a Magic Link.');
      return;
    }
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const res = await sendMagicLink(loginEmail);
      if (res.success) {
        setMagicLinkSent(true);
        showToast(res.message || 'Magic Link sent! Check your inbox.');
      } else {
        setAuthError(res.error || 'Failed to send Magic Link.');
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up & Onboarding Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!fullName.trim()) {
      setAuthError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setAuthError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    // Supabase remote sign up if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
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
      email: email.trim(),
      phone: phone || '0712345678',
      avatar,
      bio: bio || 'Flatmate',
      diet: dietList,
      examPeriod: isExam,
    };

    if (flatChoice === 'CREATE') {
      registerAndOnboard(
        newUser,
        {
          mode: 'CREATE',
          ws: {
            name: newFlatName.trim() || `${fullName}'s Flat`,
            location: newFlatLocation.trim(),
            monthlyRentKES: parseFloat(newFlatRent) || 32000,
            rentDueDay: parseInt(newFlatRentDay) || 5,
          },
        },
        password
      );
      setIsSubmitting(false);
    } else {
      if (!joinInviteCode.trim()) {
        setAuthError('Please enter a valid flat invite code (e.g. ROYS-402)');
        setIsSubmitting(false);
        return;
      }

      const success = registerAndOnboard(
        newUser,
        {
          mode: 'JOIN',
          inviteCode: joinInviteCode.trim(),
        },
        password
      );
      if (!success) {
        setAuthError(`Invalid invite code "${joinInviteCode}". Please check with your flat coordinator.`);
      }
      setIsSubmitting(false);
    }
  };

  // Handle Pending OAuth User Completion (First-time Google/GitHub user setup)
  const handleOAuthOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingOAuthUser) return;
    setIsSubmitting(true);

    const newUser: Partial<Roommate> = {
      id: pendingOAuthUser.id,
      name: pendingOAuthUser.name,
      email: pendingOAuthUser.email,
      phone: pendingOAuthUser.phone || phone || '0712345678',
      avatar: pendingOAuthUser.avatar,
      bio: 'Flatmate authenticated via Provider',
      diet: ['all', 'greens_lover'],
      examPeriod: false,
    };

    if (flatChoice === 'CREATE') {
      registerAndOnboard(newUser, {
        mode: 'CREATE',
        ws: {
          name: newFlatName.trim() || `${pendingOAuthUser.name}'s Flat`,
          location: newFlatLocation.trim(),
          monthlyRentKES: parseFloat(newFlatRent) || 32000,
          rentDueDay: parseInt(newFlatRentDay) || 5,
        },
      });
    } else {
      if (!joinInviteCode.trim()) {
        setAuthError('Please enter a flat invite code');
        setIsSubmitting(false);
        return;
      }
      registerAndOnboard(newUser, {
        mode: 'JOIN',
        inviteCode: joinInviteCode.trim(),
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-radial from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* Background Architectural Accent Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-electric-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[300px] bg-champagne-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <RoomJusticeLogo size="lg" theme="dark" variant="stacked" showSubtext showBadge />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 shadow-inner text-xs font-semibold text-slate-300">
            <span className="text-sm">🇰🇪</span>
            <span>RoomJustice Kenya</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-champagne-400 font-mono text-[10px]">Secure Flat OS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            {pendingOAuthUser ? 'Complete Your Flat Setup' : 'Secure Flat Access'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {pendingOAuthUser
              ? `Signed in as ${pendingOAuthUser.name}. Choose or create your apartment flat workspace to continue.`
              : 'Authenticate with your Google account, provider, or verified email credentials to enter your scoped flat workspace.'}
          </p>
        </div>

        {/* Flat Invitation Banner */}
        {joinInviteCode && (
          <div className="p-4 rounded-2xl bg-electric-500/10 border border-electric-500/40 text-white flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-electric-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-champagne-400 uppercase tracking-wider block">
                  Flat Invitation Detected
                </span>
                <h4 className="text-sm font-bold text-white truncate">
                  You are invited to join{' '}
                  <span className="text-electric-400">
                    {invitedWorkspace ? invitedWorkspace.name : joinInviteCode}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300">
                  {invitedWorkspace ? `${invitedWorkspace.location} · ` : ''}Authenticate below to claim your flatmate profile.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-xs font-bold text-champagne-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 block">
                {joinInviteCode}
              </span>
            </div>
          </div>
        )}

        {/* CASE 1: PENDING OAUTH USER WORKSPACE ONBOARDING */}
        {pendingOAuthUser ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center gap-3.5">
              <img
                src={pendingOAuthUser.avatar}
                alt={pendingOAuthUser.name}
                className="w-12 h-12 rounded-full ring-2 ring-emerald-500 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">{pendingOAuthUser.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <span className="text-[11px] text-slate-400 block truncate">{pendingOAuthUser.email}</span>
                <span className="text-[10px] text-emerald-400 font-semibold block">Authenticated via Provider</span>
              </div>
            </div>

            <form onSubmit={handleOAuthOnboardingSubmit} className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-champagne-400 block">
                Choose Your Flat Environment:
              </span>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFlatChoice('CREATE')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    flatChoice === 'CREATE'
                      ? 'bg-electric-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create New Flat
                </button>
                <button
                  type="button"
                  onClick={() => setFlatChoice('JOIN')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    flatChoice === 'JOIN'
                      ? 'bg-electric-500 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Join Flat by Code
                </button>
              </div>

              {flatChoice === 'CREATE' ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Apartment / Flat Name</label>
                    <input
                      type="text"
                      required
                      value={newFlatName}
                      onChange={(e) => setNewFlatName(e.target.value)}
                      placeholder="e.g. Lumumba Drive Flat 4B"
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Estate / Location</label>
                      <input
                        type="text"
                        value={newFlatLocation}
                        onChange={(e) => setNewFlatLocation(e.target.value)}
                        placeholder="Roysambu, Nairobi"
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Rent (KES)</label>
                      <input
                        type="number"
                        value={newFlatRent}
                        onChange={(e) => setNewFlatRent(e.target.value)}
                        placeholder="32000"
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Invite Code from Flatmate</label>
                  <input
                    type="text"
                    required
                    value={joinInviteCode}
                    onChange={(e) => setJoinInviteCode(e.target.value)}
                    placeholder="e.g. ROYS-402"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 font-mono uppercase focus:outline-none focus:border-electric-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-electric-500 hover:bg-electric-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-electric-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Enter Flat Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* CASE 2: REGULAR AUTH GATE (LOGIN / SIGN UP) */
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl">
            {/* Auth Mode Toggle Pill */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  setAuthError(null);
                }}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'LOGIN'
                    ? 'bg-electric-500 text-white shadow-lg shadow-electric-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('SIGNUP');
                  setAuthError(null);
                }}
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

            <div className="p-4 sm:p-6 space-y-5">
              
              {/* Alert / Error Message Banner */}
              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{authError}</div>
                </div>
              )}

              {/* TAB 1: LOG IN */}
              {activeTab === 'LOGIN' ? (
                <div className="space-y-4">
                  {/* OAuth Providers Section */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={isOAuthLoading !== null}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] border border-slate-200"
                    >
                      {isOAuthLoading === 'google' ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      )}
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={isOAuthLoading !== null}
                      className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 border border-slate-700 active:scale-[0.99]"
                    >
                      {isOAuthLoading === 'github' ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          />
                        </svg>
                      )}
                      <span>Continue with GitHub</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
                      Or with email & password
                    </span>
                  </div>

                  {/* Credentials Form */}
                  <form onSubmit={handleStandardLogin} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g. brian@roomjustice.ke"
                          className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={handleMagicLink}
                          className="text-[11px] text-electric-400 hover:text-electric-300 underline"
                        >
                          Email Magic Link
                        </button>
                      </div>
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
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Log In to Workspace</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* TAB 2: SIGN UP & CHOOSE ENVIRONMENT */
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {/* Quick Google Sign Up Option */}
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={isOAuthLoading !== null}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Quick Sign Up with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-slate-900 px-3 text-[10px] font-medium text-slate-400 uppercase tracking-wider absolute">
                      Or fill profile details
                    </span>
                  </div>

                  {/* Step 1: Profile Info */}
                  <div className="space-y-3">
                    {/* Photo Upload & Preview */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5">
                      <div className="relative group shrink-0">
                        <img
                          src={avatar}
                          alt="Profile avatar"
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-electric-500 bg-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Upload photo from device"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex-1 space-y-1">
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
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold border border-slate-700 transition-colors"
                          >
                            <Upload className="w-3 h-3 text-electric-400" />
                            <span>Upload from Files</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Upload your photo or keep generated avatar
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. Victor Mutua"
                          className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="victor@student.ke"
                          className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Password (min 6 chars) *
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                        />
                      </div>
                    </div>

                    {/* Dietary Checkboxes */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Dietary Preferences (For Fair Grocery Splits):
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isVegetarian}
                            onChange={(e) => setIsVegetarian(e.target.checked)}
                            className="rounded border-slate-700 text-electric-500 focus:ring-0"
                          />
                          <span>Vegetarian (No meat bills)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isLactose}
                            onChange={(e) => setIsLactose(e.target.checked)}
                            className="rounded border-slate-700 text-electric-500 focus:ring-0"
                          />
                          <span>Lactose Intolerant (No milk)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Choose Flat Environment */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-champagne-400 block">
                      Step 2: Choose Flat Workspace
                    </span>

                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setFlatChoice('CREATE')}
                        className={`py-2 rounded-lg transition-all ${
                          flatChoice === 'CREATE'
                            ? 'bg-electric-500 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Create New Flat
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlatChoice('JOIN')}
                        className={`py-2 rounded-lg transition-all ${
                          flatChoice === 'JOIN'
                            ? 'bg-electric-500 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Join Flat by Code
                      </button>
                    </div>

                    {flatChoice === 'CREATE' ? (
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Apartment / Flat Name
                          </label>
                          <input
                            type="text"
                            required
                            value={newFlatName}
                            onChange={(e) => setNewFlatName(e.target.value)}
                            placeholder="e.g. Roysambu Lumumba Flat 4B"
                            className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Estate / Area
                            </label>
                            <input
                              type="text"
                              value={newFlatLocation}
                              onChange={(e) => setNewFlatLocation(e.target.value)}
                              placeholder="Roysambu, Nairobi"
                              className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Total Rent (KES)
                            </label>
                            <input
                              type="number"
                              value={newFlatRent}
                              onChange={(e) => setNewFlatRent(e.target.value)}
                              placeholder="32000"
                              className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-electric-500"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Flat Invite Code
                        </label>
                        <input
                          type="text"
                          required
                          value={joinInviteCode}
                          onChange={(e) => setJoinInviteCode(e.target.value)}
                          placeholder="e.g. ROYS-402"
                          className="w-full text-xs p-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 font-mono uppercase focus:outline-none focus:border-electric-500"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-electric-500 hover:bg-electric-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-electric-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Create Account & Enter Flat</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer Security Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Auth</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-electric-400" />
            <span>Scoped Data Isolation</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
            <span>Supabase Auth</span>
          </span>
        </div>

      </div>
    </div>
  );
}
