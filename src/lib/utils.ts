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
