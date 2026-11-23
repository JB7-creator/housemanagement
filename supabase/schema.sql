-- ==============================================================================
-- HouseManagement (RoomJustice) — Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/xzmgcglcyerxsgncecvc/sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Roommate User Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone_number VARCHAR(15) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    handle VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKSPACES (Houses / Student Flats)
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(12) UNIQUE NOT NULL,
    location VARCHAR(150),
    monthly_rent_kes NUMERIC(10, 2) DEFAULT 32000.00,
    rent_due_day INT DEFAULT 5,
    currency VARCHAR(5) DEFAULT 'KES',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKSPACE MEMBERS (Flatmates)
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('coordinator', 'treasurer', 'member')),
    dietary_flags JSONB DEFAULT '{"vegetarian": false, "lactose_intolerant": false, "greens_lover": true}'::jsonb,
    is_exam_period BOOLEAN DEFAULT FALSE,
    availability_multiplier NUMERIC(3, 2) DEFAULT 1.00,
    karma_score INT DEFAULT 100,
    streak_weeks INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, profile_id)
);

-- 4. EXPENSES (Master Expenses & M-Pesa Transactions)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES public.profiles(id),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('GROCERIES', 'RENT', 'ELECTRICITY', 'WATER', 'GAS', 'TRANSPORT', 'HOUSE_BUFFER')),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount > 0),
    mpesa_transaction_code VARCHAR(12) UNIQUE,
    raw_mpesa_sms TEXT,
    receipt_image_url TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXPENSE LINE ITEMS (Sub-Group Splits)
CREATE TABLE IF NOT EXISTS public.expense_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    cost NUMERIC(10, 2) NOT NULL CHECK (cost > 0),
    category VARCHAR(50) DEFAULT 'greens',
    participant_ids UUID[] NOT NULL DEFAULT '{}'
);

-- 6. CHORES (EF1 Snake Round-Robin Chore Rotation)
CREATE TABLE IF NOT EXISTS public.chores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    difficulty INT DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
    frequency VARCHAR(20) DEFAULT 'daily',
    assigned_to_id UUID REFERENCES public.profiles(id),
    due_date DATE NOT NULL,
    due_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'OVERDUE', 'BOUNTY_OPEN')),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    bounty_kes NUMERIC(10, 2) DEFAULT 50.00,
    proof_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PARLIAMENT BILLS & DEMOCRATIC LEGISLATION
CREATE TABLE IF NOT EXISTS public.parliament_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    bill_number SERIAL,
    proposer_id UUID NOT NULL REFERENCES public.profiles(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    cost_kes NUMERIC(10, 2),
    category VARCHAR(50) DEFAULT 'POLICY' CHECK (category IN ('POLICY', 'EXPENSE', 'AMENITY', 'SANCTION')),
    status VARCHAR(30) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'PASSED', 'VETOED', 'ARBITRATION_REQUIRED')),
    quorum_needed INT DEFAULT 3,
    ai_arbitrator_verdict JSONB,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '3 days'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PARLIAMENT VOTES
CREATE TABLE IF NOT EXISTS public.parliament_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES public.parliament_bills(id) ON DELETE CASCADE,
    roommate_id UUID NOT NULL REFERENCES public.profiles(id),
    vote VARCHAR(10) NOT NULL CHECK (vote IN ('PASS', 'VETO')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(bill_id, roommate_id)
);

-- 9. EMERGENCY SINKING FUND & UNITIZED NAV LEDGER
CREATE TABLE IF NOT EXISTS public.emergency_funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID UNIQUE NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    target_reserve_kes NUMERIC(10, 2) DEFAULT 12000.00,
    current_balance_kes NUMERIC(10, 2) DEFAULT 8450.00,
    unit_nav_price NUMERIC(8, 4) DEFAULT 1.0560,
    total_units INT DEFAULT 8000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emergency_fund_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_fund_id UUID NOT NULL REFERENCES public.emergency_funds(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    units_held INT NOT NULL DEFAULT 0,
    UNIQUE(emergency_fund_id, profile_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parliament_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parliament_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_fund_units ENABLE ROW LEVEL SECURITY;

-- Allow public read & write policies for MVP
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public workspaces access" ON public.workspaces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public workspace_members access" ON public.workspace_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public expenses access" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public expense_line_items access" ON public.expense_line_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public chores access" ON public.chores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public bills access" ON public.parliament_bills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public votes access" ON public.parliament_votes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public funds access" ON public.emergency_funds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public units access" ON public.emergency_fund_units FOR ALL USING (true) WITH CHECK (true);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, handle, phone_number, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student Flatmate'),
    COALESCE(NEW.raw_user_meta_data->>'handle', '@' || SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id::text
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone_number = EXCLUDED.phone_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
