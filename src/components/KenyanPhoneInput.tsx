'use client';

import React from 'react';
import { detectKenyanCarrier } from '../lib/utils';
import { Phone } from 'lucide-react';

interface KenyanPhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function KenyanPhoneInput({
  value,
  onChange,
  placeholder = '712 345 678',
  required = false,
  disabled = false,
  className = '',
  id,
}: KenyanPhoneInputProps) {
  // Strip country code if entered, so user sees natural local 9 digits or leading 0
  const carrier = detectKenyanCarrier(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Allow digits, spaces, and plus
    const sanitized = raw.replace(/[^\d+ ]/g, '');
    onChange(sanitized);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="relative flex items-center rounded-xl border border-slate-200 bg-white shadow-2xs focus-within:border-electric-500 focus-within:ring-2 focus-within:ring-electric-500/20 transition-all overflow-hidden">
        {/* Kenyan Flag & Dial Code Pill */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-700 select-none shrink-0">
          <span className="text-base leading-none">🇰🇪</span>
          <span className="font-mono text-xs font-bold text-slate-800">+254</span>
        </div>

        {/* Input Field */}
        <input
          id={id}
          type="tel"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono bg-transparent"
        />

        {/* Detected Carrier Badge (Safaricom M-Pesa / Airtel Money) */}
        {value.length >= 3 && (
          <div className="pr-2.5 shrink-0 hidden sm:flex items-center">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${carrier.badge} transition-all`}
            >
              {carrier.name}
            </span>
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-400 flex items-center justify-between px-0.5">
        <span>Safaricom M-Pesa / Airtel Money enabled</span>
        <span className="font-mono text-[9px] text-slate-400">e.g. 0712... or 712...</span>
      </p>
    </div>
  );
}
