'use client';

import { Roommate, DietaryPreference } from '../lib/types';
import { formatKenyanPhoneDisplay, getWhatsAppUrl, detectKenyanCarrier } from '../lib/utils';
import {
  User,
  Phone,
  Shield,
  Sparkles,
  BookOpen,
  Leaf,
  Milk,
  GraduationCap,
  MessageCircle,
} from 'lucide-react';

// ── Helpers ─────────────────────────────────────────────────────────────

const ROLE_STYLES: Record<
  Roommate['role'],
  { ring: string; badge: string; label: string }
> = {
  coordinator: {
    ring: 'ring-[#0052FF]',
    badge: 'bg-[#0052FF]/10 text-[#0052FF]',
    label: 'Coordinator',
  },
  treasurer: {
    ring: 'ring-[#D4AF37]',
    badge: 'bg-[#D4AF37]/10 text-[#D4AF37]',
    label: 'Treasurer',
  },
  member: {
    ring: 'ring-slate-300',
    badge: 'bg-slate-100 text-slate-600',
    label: 'Member',
  },
};

const DIET_CONFIG: Record<
  DietaryPreference,
  { bg: string; text: string; label: string; Icon: typeof Leaf | null }
> = {
  vegetarian: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    label: 'Vegetarian',
    Icon: Leaf,
  },
  lactose_intolerant: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    label: 'Lactose Intolerant',
    Icon: Milk,
  },
  greens_lover: {
    bg: 'bg-emerald-600/10',
    text: 'text-emerald-700',
    label: 'Greens Lover',
    Icon: Leaf,
  },
  halal: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-600',
    label: 'Halal',
    Icon: null,
  },
  all: {
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    label: 'No Restrictions',
    Icon: null,
  },
};

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

// ── Sub‑components ──────────────────────────────────────────────────────

function AvatarRing({
  avatar,
  name,
  role,
}: {
  avatar: string;
  name: string;
  role: Roommate['role'];
}) {
  const { ring } = ROLE_STYLES[role];
  return (
    <div
      className={`relative mx-auto h-20 w-20 rounded-full ring-[3px] ${ring} ring-offset-2 ring-offset-white`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100">
          <User className="h-8 w-8 text-slate-400" />
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: Roommate['role'] }) {
  const { badge, label } = ROLE_STYLES[role];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${badge}`}
    >
      <Shield className="h-3 w-3" />
      {label}
    </span>
  );
}

function DietPills({ diet }: { diet: DietaryPreference[] }) {
  if (!diet.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {diet.map((d) => {
        const cfg = DIET_CONFIG[d];
        return (
          <span
            key={d}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.text}`}
          >
            {cfg.Icon && <cfg.Icon className="h-2.5 w-2.5" />}
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
}

function KarmaBar({ score }: { score: number }) {
  const pct = clamp((score / 200) * 100, 0, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-medium">Karma</span>
        <span className="tabular-nums font-semibold text-slate-700">
          {score}
          <span className="text-slate-400">/200</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StreakBadge({ weeks }: { weeks: number }) {
  if (weeks <= 0) return null;
  const highlight = weeks > 4;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        highlight
          ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
          : 'bg-slate-100 text-slate-500'
      }`}
    >
      {highlight && <Sparkles className="h-3 w-3" />}
      {weeks}W Streak
    </span>
  );
}

function AvailabilityBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#0052FF]/8 px-2.5 py-0.5 text-[11px] font-semibold text-[#0052FF]">
      {score.toFixed(1)}
    </span>
  );
}

// ── Card ────────────────────────────────────────────────────────────────

function RoommateCard({ roommate }: { roommate: Roommate }) {
  const {
    avatar,
    name,
    handle,
    phone,
    role,
    bio,
    diet,
    examPeriod,
    karmaScore,
    streakWeeks,
    availabilityScore,
  } = roommate;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-100 bg-[#F8FAFC] p-5 transition-shadow hover:shadow-md">
      {/* Exam period banner */}
      {examPeriod && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-1.5 rounded-t-2xl bg-amber-500/20 px-3 py-1.5 text-[11px] font-semibold text-amber-700">
          <GraduationCap className="h-3.5 w-3.5" />
          Exam Period Active
        </div>
      )}

      <div className={examPeriod ? 'mt-5' : ''}>
        {/* Avatar */}
        <AvatarRing avatar={avatar} name={name} role={role} />

        {/* Identity block */}
        <div className="mt-4 text-center">
          <h3 className="text-sm font-bold text-slate-900 font-display">
            {name}
          </h3>
          <p className="text-xs text-slate-400">{handle}</p>
        </div>

        {/* Role */}
        <div className="mt-2 flex justify-center">
          <RoleBadge role={role} />
        </div>

        {/* Phone with Kenyan Flag & Carrier Badge */}
        <div className="mt-2.5 flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
            <span>🇰🇪</span>
            <span className="font-semibold">{formatKenyanPhoneDisplay(phone)}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${detectKenyanCarrier(phone).badge}`}>
              {detectKenyanCarrier(phone).name}
            </span>
          </div>

          {/* Quick WhatsApp Action */}
          <a
            href={getWhatsAppUrl(phone, `Habari ${name}! Message from flatmate via RoomJustice`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:text-[#1da851] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Bio */}
        {bio && (
          <p className="mt-3 line-clamp-2 text-center text-xs leading-relaxed text-slate-500">
            {bio}
          </p>
        )}

        {/* Divider */}
        <div className="my-3 h-px w-full bg-slate-100" />

        {/* Diet pills */}
        <div className="flex justify-center">
          <DietPills diet={diet} />
        </div>

        {/* Karma bar */}
        <div className="mt-3">
          <KarmaBar score={karmaScore} />
        </div>

        {/* Bottom metrics row */}
        <div className="mt-3 flex items-center justify-between">
          <StreakBadge weeks={streakWeeks} />
          <AvailabilityBadge score={availabilityScore} />
        </div>
      </div>
    </div>
  );
}

// ── Section ─────────────────────────────────────────────────────────────

interface RoommateProfilesSectionProps {
  roommates: Roommate[];
}

export function RoommateProfilesSection({
  roommates,
}: RoommateProfilesSectionProps) {
  return (
    <section className="w-full">
      {/* Section header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052FF]/10">
          <User className="h-5 w-5 text-[#0052FF]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Flat Members
          </h2>
          <p className="text-xs text-slate-400">
            {roommates.length} roommate{roommates.length !== 1 && 's'}
          </p>
        </div>
      </div>

      {/* Responsive grid: 1 → 2 → 4 columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {roommates.map((r) => (
          <RoommateCard key={r.id} roommate={r} />
        ))}
      </div>
    </section>
  );
}

export { RoommateProfilesSection as RoommateProfiles };
export default RoommateProfilesSection;
