'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'horizontal' | 'vertical' | 'badge';
  theme?: 'light' | 'dark' | 'auto';
  showBadge?: boolean;
  showTagline?: boolean;
  tagline?: string;
  href?: string;
  useRasterImage?: boolean;
  className?: string;
}

export function BrandLogoMark({
  size = 'md',
  useRasterImage = false,
  className = '',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  useRasterImage?: boolean;
  className?: string;
}) {
  const pixelSizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 52,
    xl: 68,
  };

  const dim = pixelSizes[size];

  if (useRasterImage) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shadow-md shadow-electric-500/20 shrink-0 border border-slate-700/30 ${className}`}
        style={{ width: dim, height: dim }}
      >
        <Image
          src="/logo.png"
          alt="RoomJustice AI Logo"
          width={dim}
          height={dim}
          className="w-full h-full object-cover rounded-xl"
          priority
        />
      </div>
    );
  }

  // Crisp Vector SVG Mark using exact Electric Cobalt & Champagne Gold palette
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      style={{ width: dim, height: dim }}
    >
      <svg
        viewBox="0 0 128 128"
        width={dim}
        height={dim}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          <linearGradient id="brandElectricGrad" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="50%" stopColor="#0052FF" />
            <stop offset="100%" stopColor="#0035A8" />
          </linearGradient>

          <linearGradient id="brandChampagneGrad" x1="30" y1="20" x2="98" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FCEBA4" />
            <stop offset="45%" stopColor="#E5C158" />
            <stop offset="100%" stopColor="#C9971D" />
          </linearGradient>

          <linearGradient id="brandEmeraldGrad" x1="50" y1="60" x2="78" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <filter id="brandGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Rounded Squircle Container */}
        <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#brandElectricGrad)" />
        <rect
          x="8.5"
          y="8.5"
          width="111"
          height="111"
          rx="27.5"
          stroke="#4D8BFF"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Ambient Depth Fill */}
        <path
          d="M64 26 L98 50 L98 72 C98 88 82 101 64 106 C46 101 30 88 30 72 L30 50 Z"
          fill="#06122E"
          opacity="0.3"
        />

        {/* Shield of Justice & Communal Trust */}
        <path
          d="M64 29 L94 51 L94 70 C94 84 80 96 64 101 C48 96 34 84 34 70 L34 51 Z"
          stroke="url(#brandChampagneGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Architectural Apartment Structure */}
        <path
          d="M48 64 L64 52 L80 64 V84 H48 Z"
          fill="#FFFFFF"
          fillOpacity="0.09"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.35"
          strokeLinejoin="round"
        />

        {/* Horizontal Balance Rail of Fair Division */}
        <line
          x1="42"
          y1="56"
          x2="86"
          y2="56"
          stroke="url(#brandChampagneGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Scales Nodes */}
        <circle cx="44" cy="62" r="3.2" fill="url(#brandChampagneGrad)" />
        <circle cx="84" cy="62" r="3.2" fill="url(#brandChampagneGrad)" />

        {/* Central Algorithmic AI Diamond */}
        <polygon points="64,62 72,70 64,78 56,70" fill="url(#brandChampagneGrad)" />
        {/* Kenyan Emerald Core */}
        <circle cx="64" cy="70" r="3" fill="url(#brandEmeraldGrad)" />

        {/* Intelligence Sparkle Star */}
        <path
          d="M64 41 L65.5 45.8 L70.5 47 L65.5 48.2 L64 53 L62.5 48.2 L57.5 47 L62.5 45.8 Z"
          fill="#FFF4C4"
          filter="url(#brandGlow)"
        />
        <circle cx="88" cy="38" r="1.5" fill="#E5C158" />
        <circle cx="40" cy="40" r="1.5" fill="#E5C158" />
      </svg>
    </div>
  );
}

export function BrandLogo({
  size = 'md',
  variant = 'horizontal',
  theme = 'auto',
  showBadge = true,
  showTagline = false,
  tagline = 'Algorithmic Co-Living OS',
  href,
  useRasterImage = false,
  className = '',
}: BrandLogoProps) {
  const isDark = theme === 'dark';

  const textSizes = {
    xs: { main: 'text-sm', badge: 'text-[8px] px-1 py-0.2', sub: 'text-[9px]' },
    sm: { main: 'text-base', badge: 'text-[9px] px-1.5 py-0.5', sub: 'text-[10px]' },
    md: { main: 'text-lg', badge: 'text-[10px] px-2 py-0.5', sub: 'text-[11px]' },
    lg: { main: 'text-2xl', badge: 'text-xs px-2.5 py-0.5', sub: 'text-xs' },
    xl: { main: 'text-3xl', badge: 'text-sm px-3 py-1', sub: 'text-sm' },
  }[size];

  const content = (
    <div
      className={`group flex ${
        variant === 'vertical' ? 'flex-col items-center text-center gap-2.5' : 'flex-row items-center gap-3'
      } ${className}`}
    >
      <BrandLogoMark size={size} useRasterImage={useRasterImage} />

      {variant !== 'icon' && (
        <div className={`flex flex-col ${variant === 'vertical' ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center gap-2">
            <span
              className={`font-display font-extrabold tracking-tight ${textSizes.main} ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Room<span className="text-electric-500">Justice</span>
            </span>

            {showBadge && (
              <span
                className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider shadow-xs ${
                  textSizes.badge
                } ${
                  isDark
                    ? 'bg-champagne-500/20 text-champagne-300 border border-champagne-500/40'
                    : 'bg-champagne-100 text-champagne-800 border border-champagne-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-champagne-500 animate-pulse" />
                AI
              </span>
            )}
          </div>

          {showTagline && (
            <span
              className={`font-medium ${textSizes.sub} ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex cursor-pointer transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}

export const RoomJusticeLogo = BrandLogo;
export default BrandLogo;
