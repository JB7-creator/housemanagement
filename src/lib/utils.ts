import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace("KES", "Ksh");
}

export function truncateCode(code: string): string {
  if (code.length <= 6) return code;
  return `${code.slice(0, 3)}...${code.slice(-3)}`;
}

/**
 * Normalizes any Kenyan phone number format into 254XXXXXXXXX (digits only).
 * Handles: 0712345678 -> 254712345678, +254712345678 -> 254712345678, 712345678 -> 254712345678
 */
export function normalizeKenyanPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) {
    return digits;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }
  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
    return `254${digits}`;
  }
  return digits;
}

/**
 * Formats a Kenyan phone number for display with country code: +254 7XX XXX XXX
 */
export function formatKenyanPhoneDisplay(phone: string): string {
  if (!phone) return '+254';
  const norm = normalizeKenyanPhone(phone);
  if (norm.startsWith('254') && norm.length === 12) {
    return `+254 ${norm.slice(3, 6)} ${norm.slice(6, 9)} ${norm.slice(9)}`;
  }
  if (phone.startsWith('0') && phone.length === 10) {
    return `+254 ${phone.slice(1, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  }
  return phone.startsWith('+254') ? phone : `+254 ${phone.replace(/^0+/, '')}`;
}

/**
 * Generates an official WhatsApp click-to-chat URL: https://wa.me/254...
 */
export function getWhatsAppUrl(phone: string, message: string = ''): string {
  const norm = normalizeKenyanPhone(phone);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${norm}${message ? `?text=${encodedMsg}` : ''}`;
}

/**
 * Detects the Kenyan mobile network provider based on phone prefix
 */
export function detectKenyanCarrier(phone: string): {
  name: 'Safaricom' | 'Airtel' | 'Telkom' | 'Mobile KE';
  color: string;
  badge: string;
} {
  const norm = normalizeKenyanPhone(phone);
  if (!norm || norm.length < 5) {
    return { name: 'Mobile KE', color: 'text-slate-500', badge: 'bg-slate-100 text-slate-600' };
  }
  const prefix = norm.slice(3, 5); // 254 [7X / 1X]
  const p3 = norm.slice(3, 6);

  // Safaricom: 070x, 071x, 072x, 074x, 079x, 011x
  if (
    ['70', '71', '72', '74', '79'].includes(prefix) ||
    ['110', '111', '112', '113', '114', '115'].includes(p3)
  ) {
    return { name: 'Safaricom', color: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  // Airtel: 073x, 075x, 078x, 010x
  if (['73', '75', '78', '10'].includes(prefix)) {
    return { name: 'Airtel', color: 'text-red-600', badge: 'bg-red-50 text-red-700 border-red-200' };
  }
  // Telkom: 077x
  if (prefix === '77') {
    return { name: 'Telkom', color: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  return { name: 'Mobile KE', color: 'text-slate-600', badge: 'bg-slate-100 text-slate-700 border-slate-200' };
}
