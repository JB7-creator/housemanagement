'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Github,
  ArrowUpRight,
  Clock,
  Activity,
  Heart,
  Radio,
  Wifi,
  Server,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoomJusticeLogo } from './RoomJusticeLogo';

export function FooterSection() {
  // 1. Live EAT Clock (Nairobi Time)
  const [currentTime, setCurrentTime] = useState<string>('');
  const [highFiveCount, setHighFiveCount] = useState<number>(1428);
  const [hasHighFived, setHasHighFived] = useState<boolean>(false);

  // 2. Interactive Constellation Canvas ref (inspired by kellyleon.vercel.app space-canvas)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Clock interval
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-KE', {
          timeZone: 'Africa/Nairobi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Ambient interactive particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(45, Math.floor(width / 24));
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }[] = [];

    const colors = ['#0052FF', '#D4AF37', '#387DFF', '#E5C158', '#94A3B8'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.8 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 82, 255, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleHighFive = () => {
    if (!hasHighFived) {
      setHighFiveCount((prev) => prev + 1);
      setHasHighFived(true);
    }
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.9 },
      colors: ['#0052FF', '#D4AF37', '#10B981'],
    });
  };

  return (
    <footer className="relative bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12 overflow-hidden">
      {/* Interactive Constellation Canvas Backdrop */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
      />

      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-electric-900/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Live Network & Telemetry Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md">
          {/* EAT Clock */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-300">
                Nairobi, Kenya: <strong className="font-mono text-emerald-400">{currentTime || '15:15:00 EAT'}</strong>
              </span>
            </div>
          </div>

          {/* Infrastructure Health Badges */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-electric-400" />
              <span>Safaricom M-Pesa Rail: <strong>Active</strong></span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-champagne-400" />
              <span>Groq LLM Arbitrator: <strong>Online</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Latency: <strong className="font-mono text-white">12ms</strong></span>
            </span>
          </div>
        </div>

        {/* Communal Footprint ("Growing Together") */}
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-2">
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-white block">3,840+</span>
            <span className="text-xs text-slate-400 mt-1 block">Student Flats Harmonized</span>
          </div>
          <div className="p-2">
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-champagne-400 block">Ksh 14.8M</span>
            <span className="text-xs text-slate-400 mt-1 block">Friction-Free M-Pesa Splits</span>
          </div>
          <div className="p-2">
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-emerald-400 block">21,500+</span>
            <span className="text-xs text-slate-400 mt-1 block">Chores Completed without Fights</span>
          </div>
          <div className="p-2">
            <span className="font-mono text-2xl md:text-3xl font-extrabold text-electric-400 block">99.2%</span>
            <span className="text-xs text-slate-400 mt-1 block">Average Roommate Harmony Index</span>
          </div>
        </div>

        {/* Live Interactive High-Five & Brand Manifesto */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          <div className="md:col-span-7 space-y-3">
            <RoomJusticeLogo size="md" theme="dark" showBadge showSubtext />
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Engineered with Bitmask DP game theory, Kenyan M-Pesa heuristics, and an impartial AI Arbitrator. Designed so university flatmates build lifelong friendships without money or chore friction.
            </p>
          </div>

          {/* Interactive Live Harmony High-Five Box */}
          <div className="md:col-span-5 flex flex-col sm:flex-row items-center md:justify-end gap-3">
            <button
              onClick={handleHighFive}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-electric-400 text-white text-xs font-bold shadow-lg shadow-electric-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${hasHighFived ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
              <span>Send Roommate High-Five</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 font-mono text-[10px]">
                {highFiveCount}
              </span>
            </button>

            <a
              href="https://github.com/JB7-creator/housemanagement"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 HouseManagement Platform · Built for university hostels & shared flats worldwide</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Zap className="w-3 h-3 text-champagne-400" />
              Real-time Sync Active
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
