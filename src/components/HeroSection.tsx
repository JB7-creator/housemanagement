'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MessageSquare,
  Zap,
  Users,
  Leaf,
  GraduationCap,
  Scale,
  TrendingDown,
  Smartphone,
  CheckCircle2,
  Flame,
  Star,
} from 'lucide-react';
import { formatKES } from '../lib/utils';
import { RoomJusticeLogo } from './RoomJusticeLogo';

interface HeroSectionProps {
  onOpenMpesa: () => void;
  onExploreParliament: () => void;
}

// ─── Animated Particle Network Canvas ───────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const COLORS = ['#0052FF', '#387DFF', '#D4AF37', '#E5C158', '#10B981'];
    const COUNT = Math.min(Math.floor((W * H) / 12000), 70);

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const { x: mx, y: my } = mouseRef.current;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 82, 255, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const mdist = Math.sqrt(dx * dx + dy * dy);
        if (mdist < 100) {
          p.vx += (dx / mdist) * 0.3;
          p.vy += (dy / mdist) * 0.3;
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) { p.vx *= 2 / speed; p.vy *= 2 / speed; }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ pointerEvents: 'none' }}
    />
  );
}

// ─── Animated Counting Number ────────────────────────────────────────────────
function CountUp({ to, duration = 1800, prefix = '', suffix = '' }: { to: number; duration?: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * to));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration]);

  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

// ─── Typewriter Effect ───────────────────────────────────────────────────────
const TYPEWRITER_PHRASES = [
  'Zero Roommate Drama.',
  'Fair M-Pesa Splits.',
  'Automatic Chore Bounties.',
  'Envy-Free Living.',
  'Vegetarian Rules Enforced.',
];

function TypewriterText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIndex];
    if (!deleting && displayed.length < phrase.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === phrase.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % TYPEWRITER_PHRASES.length);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, deleting, phraseIndex]);

  return (
    <span className="bg-gradient-to-r from-champagne-500 via-champagne-400 to-amber-400 bg-clip-text text-transparent">
      {displayed}
      <span className="animate-pulse text-champagne-400">|</span>
    </span>
  );
}

// ─── Live Activity Feed ──────────────────────────────────────────────────────
const FEED_EVENTS = [
  { icon: Smartphone, color: 'text-emerald-500 bg-emerald-50 border-emerald-200', tag: 'M-PESA', text: 'Kevin parsed Ksh 1,150 Mama Mboga — split to 4 flatmates instantly' },
  { icon: GraduationCap, color: 'text-amber-500 bg-amber-50 border-amber-200', tag: 'EXAM MODE', text: 'Dennis activated Exam Relief · chore weight reduced 80%' },
  { icon: Scale, color: 'text-electric-500 bg-electric-50 border-electric-200', tag: 'PARLIAMENT', text: 'Bill #42 — 50 Mbps Wi-Fi Upgrade — passed by unanimous flat consensus' },
  { icon: Flame, color: 'text-rose-500 bg-rose-50 border-rose-200', tag: 'BOUNTY', text: 'Brian claimed Ksh 50 bounty for 11 PM kitchen sanitization' },
  { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 border-emerald-200', tag: 'SETTLED', text: 'Maya cleared Ksh 450 debt to Kevin · zero circular debt remaining' },
  { icon: Leaf, color: 'text-green-500 bg-green-50 border-green-200', tag: 'DIETARY', text: 'Vegetarian rule enforced · Dennis exempted from Ksh 1,200 beef split' },
  { icon: TrendingDown, color: 'text-electric-500 bg-electric-50 border-electric-200', tag: 'AI ARBITRATOR', text: 'Chore conflict resolved · Bitmask DP rebalanced 3-way debt chain' },
];

// ─── Live M-Pesa SMS Mockup ──────────────────────────────────────────────────
const MPESA_LINES = [
  'SB34JK Confirmed.',
  'You have received Ksh1,150.00 from',
  'KEVIN OCHIENG 0712 *** 456',
  'on 25/11/26 at 10:14 AM',
  'New M-Pesa balance is Ksh8,450.00',
  'Transaction cost, Ksh0.00',
];

export function HeroSection({ onOpenMpesa, onExploreParliament }: HeroSectionProps) {
  const [rentKES, setRentKES] = useState(8000);
  const [utilitiesKES, setUtilitiesKES] = useState(900);
  const [groceriesKES, setGroceriesKES] = useState(1800);
  const [roommatesCount, setRoommatesCount] = useState(3);
  const [feedIndex, setFeedIndex] = useState(0);
  const [smsParsed, setSmsParsed] = useState(false);
  const [smsLineIndex, setSmsLineIndex] = useState(0);
  const [activeCard, setActiveCard] = useState<'budget' | 'mpesa' | 'rules'>('budget');
  const [hasAnimated, setHasAnimated] = useState(false);

  const totalHouseExpense = rentKES + utilitiesKES + groceriesKES;
  const perPerson = Math.round(totalHouseExpense / roommatesCount);

  // Live feed ticker
  useEffect(() => {
    const t = setInterval(() => setFeedIndex((i) => (i + 1) % FEED_EVENTS.length), 3200);
    return () => clearInterval(t);
  }, []);

  // SMS parsing animation
  useEffect(() => {
    if (!smsParsed) return;
    if (smsLineIndex < MPESA_LINES.length) {
      const t = setTimeout(() => setSmsLineIndex((i) => i + 1), 180);
      return () => clearTimeout(t);
    }
  }, [smsParsed, smsLineIndex]);

  // Trigger countup animation on mount
  useEffect(() => {
    const t = setTimeout(() => setHasAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const event = FEED_EVENTS[feedIndex];
  const EventIcon = event.icon;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#030818] to-slate-950">

      {/* ── Layered Background ─────────────────────────────────────── */}
      {/* Deep navy radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,82,255,0.18),transparent)] pointer-events-none" />
      {/* Gold accent glow bottom-right */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
      {/* Emerald glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />

      {/* Interactive Particle Canvas */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas />
      </div>

      {/* Grid overlay texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Main Content ───────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ═══ LEFT: Headline & Proof ════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-7">

            {/* Live status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-400">LIVE</span>
              <span className="text-slate-500">•</span>
              <span>4,200+ flatmates harmonized across Kenya</span>
            </div>

            {/* Logo */}
            <div>
              <RoomJusticeLogo size="lg" theme="dark" showBadge showSubtext />
            </div>

            {/* Main headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-display font-extrabold text-white leading-[1.1] tracking-tight">
                Your flat.<br />
                Your rules.<br />
                <TypewriterText />
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed mt-4">
                The <strong className="text-white font-semibold">algorithmic co-living OS</strong> for Kenyan university students
                and young professionals. M-Pesa splits, vegetarian rules, envy-free chore
                bounties, and an AI arbitrator — all in one flat workspace.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenMpesa}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-bold text-sm shadow-lg shadow-electric-500/30 hover:shadow-electric-500/50 transition-all duration-200 active:scale-[0.97]"
              >
                <Smartphone className="w-4 h-4" />
                <span>Paste M-Pesa SMS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 text-electric-400" />
                <span>AI Flatmate Chat</span>
              </Link>
            </div>

            {/* Live activity ticker */}
            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-3.5">
              <div className="flex items-start gap-3 animate-in fade-in duration-500" key={feedIndex}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${event.color}`}>
                  <EventIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="inline-block text-[10px] font-bold tracking-widest font-mono text-electric-400 mb-0.5">{event.tag}</span>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{event.text}</p>
                </div>
              </div>
              {/* Shimmer bar */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-electric-500 via-champagne-400 to-emerald-500 animate-[shimmer_3.2s_linear_infinite]" style={{ width: '100%', backgroundSize: '200% 100%' }} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { label: 'Flats Active', value: 3840, suffix: '+', color: 'text-electric-400' },
                { label: 'M-Pesa Splits', value: 14800000, prefix: 'Ksh ', suffix: '+', abbr: 'Ksh 14.8M+', color: 'text-champagne-400' },
                { label: 'Harmony Score', value: 99, suffix: '.2%', color: 'text-emerald-400' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/8 px-3 py-3 text-center backdrop-blur-sm">
                  <div className={`font-mono font-extrabold text-lg leading-tight ${s.color}`}>
                    {s.abbr ?? (hasAnimated ? <CountUp to={s.value} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} /> : '—')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT: Live Interactive Engine ═══════════════════════ */}
          <div className="lg:col-span-6 space-y-4">

            {/* Card switcher tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              {(['budget', 'mpesa', 'rules'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCard(tab)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 capitalize ${
                    activeCard === tab
                      ? 'bg-electric-500 text-white shadow-md shadow-electric-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'budget' ? '⚖️ Budget Splitter' : tab === 'mpesa' ? '📱 M-Pesa Parser' : '📋 Fairness Rules'}
                </button>
              ))}
            </div>

            {/* ── Card 1: Budget Splitter ───────────────────────────── */}
            {activeCard === 'budget' && (
              <div className="rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-white font-bold text-sm">Flat Budget Splitter</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Bitmask DP envy-free algorithm</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <Zap className="w-3 h-3" /> LIVE
                  </div>
                </div>

                {/* Presets */}
                <div className="flex gap-1.5 mb-5">
                  {[
                    { label: 'Bedsitter', r: 4000, u: 500, g: 1000, n: 2 },
                    { label: '2-Bed Flat', r: 8000, u: 900, g: 1800, n: 3 },
                    { label: 'Townhouse', r: 15000, u: 1500, g: 3000, n: 4 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => { setRentKES(p.r); setUtilitiesKES(p.u); setGroceriesKES(p.g); setRoommatesCount(p.n); }}
                      className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all border ${
                        rentKES === p.r
                          ? 'bg-electric-500/20 border-electric-500/40 text-electric-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                  {[
                    { label: 'Flat Rent', val: rentKES, min: 3000, max: 25000, step: 500, set: setRentKES },
                    { label: 'Utilities', val: utilitiesKES, min: 200, max: 4000, step: 100, set: setUtilitiesKES },
                    { label: 'Groceries', val: groceriesKES, min: 300, max: 5000, step: 100, set: setGroceriesKES },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-400">{s.label}</span>
                        <span className="text-white font-mono">{formatKES(s.val)}</span>
                      </div>
                      <input
                        type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                        onChange={(e) => s.set(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full accent-electric-500 cursor-pointer"
                        style={{ background: `linear-gradient(to right, #0052FF ${((s.val - s.min) / (s.max - s.min)) * 100}%, #1E293B ${((s.val - s.min) / (s.max - s.min)) * 100}%)` }}
                      />
                    </div>
                  ))}

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-400">Roommates</span>
                      <span className="text-white font-mono">{roommatesCount} flatmates</span>
                    </div>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          onClick={() => setRoommatesCount(n)}
                          className={`flex-1 h-8 rounded-lg text-xs font-bold border transition-all ${
                            roommatesCount === n
                              ? 'bg-electric-500 border-electric-500 text-white'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-electric-500/10 to-champagne-500/5 border border-electric-500/20">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span>Total flat bill</span>
                    <span className="font-mono text-slate-300">{formatKES(totalHouseExpense)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-3">
                    <div>
                      <span className="text-xs font-bold text-electric-400 block">Your Exact Share</span>
                      <span className="text-[10px] text-slate-500">Envy-free · M-Pesa ready</span>
                    </div>
                    <span className="font-mono text-3xl font-extrabold text-white">{formatKES(perPerson)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Card 2: M-Pesa Parser ─────────────────────────────── */}
            {activeCard === 'mpesa' && (
              <div className="rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-sm">M-Pesa SMS Parser</h3>
                    <p className="text-slate-500 text-xs mt-0.5">AI reads your SMS, splits instantly</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                {/* Phone mockup */}
                <div className="relative mx-auto w-56">
                  <div className="rounded-[28px] bg-slate-800 border-2 border-slate-700 p-3 shadow-2xl">
                    {/* Phone top bar */}
                    <div className="flex justify-between items-center px-2 mb-2">
                      <span className="text-[9px] text-slate-400 font-mono">10:14 AM</span>
                      <div className="flex gap-1">
                        <div className="w-2.5 h-1 bg-slate-500 rounded-sm" />
                        <div className="w-2.5 h-1 bg-slate-500 rounded-sm" />
                        <div className="w-3 h-1 bg-emerald-400 rounded-sm" />
                      </div>
                    </div>
                    {/* SMS bubble */}
                    <div className="rounded-2xl bg-[#1A1A2E] p-3 border border-slate-700/50 font-mono text-[9px] min-h-[100px]">
                      <div className="text-emerald-400 font-bold mb-1.5 text-[8px] tracking-widest">M-PESA</div>
                      {!smsParsed ? (
                        <div className="text-slate-500 leading-relaxed">
                          {'SB34JK Confirmed.\nYou have received Ksh1,150.00...'}
                        </div>
                      ) : (
                        MPESA_LINES.slice(0, smsLineIndex).map((line, i) => (
                          <div key={i} className={`leading-relaxed ${i === 0 ? 'text-white font-bold' : 'text-slate-300'}`}>
                            {line}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Parse button + result */}
                {!smsParsed ? (
                  <button
                    onClick={() => { setSmsParsed(true); setSmsLineIndex(0); }}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Zap className="w-4 h-4" />
                    Parse & Split SMS
                  </button>
                ) : smsLineIndex >= MPESA_LINES.length ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in duration-300">
                    <div className="text-emerald-400 font-bold text-xs mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Split Calculated
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Brian', 'Kevin', 'Dennis', 'Maya'].map((name, i) => (
                        <div key={name} className="flex justify-between text-[11px] text-slate-300 bg-white/5 rounded-lg px-2.5 py-1.5">
                          <span>{name}</span>
                          <span className="font-mono text-white font-bold">{formatKES(Math.floor(1150 / 4))}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setSmsParsed(false); setSmsLineIndex(0); }} className="mt-3 w-full text-xs text-slate-500 hover:text-slate-300 transition-colors">Reset demo</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Parsing M-Pesa SMS…
                  </div>
                )}
              </div>
            )}

            {/* ── Card 3: Fairness Rules ────────────────────────────── */}
            {activeCard === 'rules' && (
              <div className="rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3">
                <div>
                  <h3 className="text-white font-bold text-sm">Algorithmic Fairness Rules</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Built-in rules that eliminate conflict</p>
                </div>

                {[
                  {
                    icon: Leaf,
                    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    title: 'Vegetarian & SDA Immunity',
                    desc: 'Dennis never pays for meat. Butchery costs split only among meat-eaters. Shared veg costs split equally.',
                    badge: 'Rule #3',
                    badgeColor: 'bg-emerald-500/20 text-emerald-400',
                  },
                  {
                    icon: GraduationCap,
                    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                    title: 'Exam Mode (80% chore relief)',
                    desc: 'During CATs or finals, weight α=0.2. Uncompleted chores become Ksh 50 open bounties for other flatmates.',
                    badge: 'Rule #2',
                    badgeColor: 'bg-amber-500/20 text-amber-400',
                  },
                  {
                    icon: Scale,
                    color: 'text-electric-400 bg-electric-500/10 border-electric-500/20',
                    title: 'Zero Circular Debt (Bitmask DP)',
                    desc: 'A owes B, B owes C, C owes A → collapsed to minimum 1 M-Pesa transaction. Mathematically optimal.',
                    badge: 'Rule #1',
                    badgeColor: 'bg-electric-500/20 text-electric-400',
                  },
                ].map((rule) => {
                  const RIcon = rule.icon;
                  return (
                    <div key={rule.title} className="flex gap-3 p-3.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${rule.color}`}>
                        <RIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-xs">{rule.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${rule.badgeColor}`}>{rule.badge}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{rule.desc}</p>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={onExploreParliament}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-3.5 h-3.5 text-champagne-400" />
                  Explore All Rules in Parliament
                </button>
              </div>
            )}

            {/* Trust badges row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'KDPA Compliant', icon: '🔒' },
                { label: 'Safaricom M-Pesa', icon: '📲' },
                { label: 'Groq AI Engine', icon: '⚡' },
              ].map((b) => (
                <div key={b.label} className="rounded-xl bg-white/4 border border-white/8 px-3 py-2.5 flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold backdrop-blur-sm">
                  <span>{b.icon}</span>
                  <span className="leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom fade to page ─────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
    </section>
  );
}
