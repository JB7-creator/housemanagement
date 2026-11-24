'use client';

import React from 'react';
import Link from 'next/link';

export interface RoomJusticeLogoProps {
  /**
   * Predefined size presets or numeric dimension in pixels for the mark
   * - 'xs': 28px mark
   * - 'sm': 34px mark
   * - 'md': 40px mark (standard navbar)
   * - 'lg': 48px mark (welcome screens)
   * - 'xl': 64px mark (hero / splash)
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /**
   * Presentation variant:
   * - 'icon': Just the geometric "Scales of Sanctuary" brand mark
   * - 'horizontal' or 'full': Brand mark + "RoomJustice" typography + "AI" badge
   * - 'stacked': Centered brand mark with typography below
   */
  variant?: 'icon' | 'horizontal' | 'full' | 'stacked';
  /**
   * Color theme mode:
   * - 'light': Dark text on light backgrounds (Navbar, light cards)
   * - 'dark': White/luminous text on dark backgrounds (WelcomeAuthGate, Footer, hero banner)
   * - 'auto': Responsive to parent classes
   */
  theme?: 'light' | 'dark' | 'auto';
  /**
   * Whether to show the subtitle ('ALGORITHMIC CO-LIVING')
   */
  showSubtext?: boolean;
  /**
   * Whether to show the champagne gold 'AI' badge
   */
  showBadge?: boolean;
  /**
   * If provided, wraps the logo in a Next.js Link
   */
  href?: string;
  /**
   * Extra container class name
   */
  className?: string;
  /**
   * Extra class name for the icon mark wrapper
   */
  iconClassName?: string;
}

const SIZE_MAP: Record<string, { iconSize: number; textClass: string; subtextClass: string; gapClass: string }> = {
  xs: { iconSize: 28, textClass: 'text-sm', subtextClass: 'text-[7px]', gapClass: 'gap-2' },
  sm: { iconSize: 34, textClass: 'text-base', subtextClass: 'text-[8px]', gapClass: 'gap-2.5' },
  md: { iconSize: 40, textClass: 'text-lg', subtextClass: 'text-[9px]', gapClass: 'gap-3' },
  lg: { iconSize: 50, textClass: 'text-2xl', subtextClass: 'text-[10px]', gapClass: 'gap-3.5' },
  xl: { iconSize: 64, textClass: 'text-3xl', subtextClass: 'text-[11px]', gapClass: 'gap-4' },
};

/**
 * The pure SVG Brand Emblem of RoomJustice
 * Symbolizes:
 * 1. The Gabled Shelter (The Roof of communal living)
 * 2. The Scales of Justice (Algorithmic 50/50 and proportional fairness)
 * 3. The Champagne Gold AI Keystone (Mathematical equilibrium & peace of mind)
 */
export function RoomJusticeEmblem({ size = 40, className = '' }: { size?: number; className?: string }) {
  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      className={`shrink-0 transition-transform duration-300 ${className}`}
      aria-label="RoomJustice Emblem"
    >
      <defs>
        {/* Architectural Obsidian Squircle Gradient */}
        <linearGradient id={`bg-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>

        {/* Electric Blue Gradient (Precision & Trust) */}
        <linearGradient id={`electric-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#387DFF" />
          <stop offset="60%" stop-color="#0052FF" />
          <stop offset="100%" stop-color="#00287D" />
        </linearGradient>

        {/* Kenyan Harmony Emerald Gradient (Prosperity & Safaricom M-Pesa Rail) */}
        <linearGradient id={`emerald-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34D399" />
          <stop offset="50%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>

        {/* Champagne Gold Gradient (Justice Fulcrum & AI Arbitration Spark) */}
        <linearGradient id={`gold-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF5D6" />
          <stop offset="40%" stop-color="#F5EAC4" />
          <stop offset="80%" stop-color="#D4AF37" />
          <stop offset="100%" stop-color="#916E18" />
        </linearGradient>

        {/* Radial Ambient Glow */}
        <radialGradient id={`glow-${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0052FF" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#0052FF" stop-opacity="0" />
        </radialGradient>

        {/* Subtle Keystone Glow */}
        <filter id={`coreGlow-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Squircle Protective Frame with Subtle Dual-Tone Rim */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="15"
        fill={`url(#bg-${uniqueId})`}
        stroke="#1E293B"
        strokeWidth="1.5"
      />

      {/* Luminous Inner Atmosphere */}
      <rect x="2" y="2" width="60" height="60" rx="15" fill={`url(#glow-${uniqueId})`} opacity="0.6" />

      {/* 2. The Roof Gable / Scales Fulcrum (Shelter Apex) */}
      {/* Left Roof Facet (Electric Blue) */}
      <path
        d="M 32 10 L 14 21.5 L 17.5 26 L 32 17 L 32 10 Z"
        fill={`url(#electric-${uniqueId})`}
      />

      {/* Right Roof Facet (Harmony Emerald) */}
      <path
        d="M 32 10 L 50 21.5 L 46.5 26 L 32 17 L 32 10 Z"
        fill={`url(#emerald-${uniqueId})`}
      />

      {/* 3. Balanced Living Chambers / Suspended Trays of Justice */}
      {/* Left Chamber (Electric Blue) */}
      <path
        d="M 13 25 L 21 25 L 24 37 L 16 43 L 10 37 L 13 25 Z"
        fill={`url(#electric-${uniqueId})`}
        opacity="0.95"
      />
      <polygon points="13,25 21,25 18,31 10,31" fill="#70A3FF" opacity="0.45" />

      {/* Right Chamber (Harmony Emerald) */}
      <path
        d="M 51 25 L 43 25 L 40 37 L 48 43 L 54 37 L 51 25 Z"
        fill={`url(#emerald-${uniqueId})`}
        opacity="0.95"
      />
      <polygon points="51,25 43,25 46,31 54,31" fill="#6EE7B7" opacity="0.45" />

      {/* 4. The Equilibrium Datum Bar (Zero Drama Consensus Line) */}
      <line
        x1="20"
        y1="34"
        x2="44"
        y2="34"
        stroke="#475569"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.8"
      />

      {/* 5. Base Interlocking Pedestal (House Foundation) */}
      <path
        d="M 27 49 L 32 45 L 37 49 L 32 53 Z"
        fill="#334155"
        opacity="0.85"
      />
      <line x1="32" y1="41" x2="32" y2="45" stroke="#475569" strokeWidth="1.5" />

      {/* 6. The AI Keystone / Central Harmony Spark (Champagne Gold) */}
      <g filter={`url(#coreGlow-${uniqueId})`}>
        <path
          d="M 32 23
             C 33 29.5 35 31.2 41 32
             C 35 32.8 33 34.5 32 41
             C 31 34.5 29 32.8 23 32
             C 29 31.2 31 29.5 32 23 Z"
          fill={`url(#gold-${uniqueId})`}
        />
        <circle cx="32" cy="32" r="1.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

/**
 * Primary Responsive Logo Component for RoomJustice
 */
export function RoomJusticeLogo({
  size = 'md',
  variant = 'horizontal',
  theme = 'light',
  showSubtext = false,
  showBadge = true,
  href,
  className = '',
  iconClassName = '',
}: RoomJusticeLogoProps) {
  // Resolve size specs
  const sizeConfig = typeof size === 'number'
    ? { iconSize: size, textClass: 'text-lg', subtextClass: 'text-[9px]', gapClass: 'gap-2.5' }
    : SIZE_MAP[size] || SIZE_MAP.md;

  const isDark = theme === 'dark';
  const isIconOnly = variant === 'icon';
  const isStacked = variant === 'stacked';

  const content = (
    <div
      className={`inline-flex ${
        isStacked ? 'flex-col items-center text-center' : 'items-center'
      } ${sizeConfig.gapClass} ${className} group select-none`}
    >
      {/* Brand Icon Mark */}
      <div className={`relative flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${iconClassName}`}>
        <RoomJusticeEmblem size={sizeConfig.iconSize} />
      </div>

      {/* Brand Typography & Badges */}
      {!isIconOnly && (
        <div className={`flex flex-col ${isStacked ? 'items-center mt-1' : 'justify-center'}`}>
          <div className="flex items-center gap-1.5 leading-tight">
            <span
              className={`font-display font-bold tracking-tight ${sizeConfig.textClass} ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Room<span className="font-extrabold text-electric-500">Justice</span>
            </span>

            {showBadge && (
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  isDark
                    ? 'bg-champagne-500/15 border-champagne-500/40 text-champagne-300'
                    : 'bg-champagne-50 border-champagne-300 text-champagne-800'
                }`}
              >
                AI
              </span>
            )}
          </div>

          {showSubtext && (
            <span
              className={`font-mono font-semibold tracking-wider uppercase mt-0.5 ${sizeConfig.subtextClass} ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Algorithmic Co-Living
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

export const BrandLogo = RoomJusticeLogo;
export default RoomJusticeLogo;
