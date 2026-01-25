-- ============================================
-- Skill Genome Database Schema for Supabase
-- ============================================
-- Run this script in the Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste and Run

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Candidates Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID,
    role_id UUID,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending_intake',
    
    -- Data sources
    github_username TEXT,
    github_data JSONB,
    leetcode_username TEXT,
    leetcode_data JSONB,
    resume_url TEXT,
    resume_parsed JSONB,
    
    -- Preferences
    work_preferences JSONB,
    questionnaire_responses JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CRI Scores Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.cri_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    role_id UUID,
    
    -- CRI Components
    technical_readiness FLOAT NOT NULL,
    problem_solving_consistency FLOAT NOT NULL,
    learning_growth FLOAT NOT NULL,
    work_discipline FLOAT NOT NULL,
    context_alignment FLOAT NOT NULL,
    
    -- Overall
    overall_cri FLOAT NOT NULL,
    confidence_level FLOAT NOT NULL,
    readiness_trend TEXT NOT NULL, -- improving, stable, declining
    
    -- Explanations
    explanations JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Alignment Scores Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.alignment_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    role_id UUID,
    organization_id UUID,
    
    -- Alignment data
    role_alignment JSONB,
    org_alignment JSONB,
    overall_alignment FLOAT NOT NULL,
    alignment_category TEXT NOT NULL, -- high, medium, low
    
    -- Insights
    key_strengths JSONB,
    potential_gaps JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Roles Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    requirements JSONB, -- Technical requirements
    work_environment JSONB, -- Pace, collaboration, etc.
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Organizations Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    culture_profile JSONB, -- Work style preferences
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_recruiter ON public.candidates(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON public.candidates(status);
CREATE INDEX IF NOT EXISTS idx_cri_scores_candidate ON public.cri_scores(candidate_id);
CREATE INDEX IF NOT EXISTS idx_alignment_scores_candidate ON public.alignment_scores(candidate_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- Enable RLS on all tables
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cri_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alignment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read access" ON public.candidates
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.cri_scores
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.alignment_scores
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.roles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON public.organizations
    FOR SELECT TO authenticated USING (true);

-- Policy: Allow recruiters to manage their own candidates
CREATE POLICY "Recruiters can manage their candidates" ON public.candidates
    FOR ALL TO authenticated 
    USING (auth.uid() = recruiter_id);

-- Policy: Allow public (anon) access for demo/development
-- WARNING: Remove these in production
CREATE POLICY "Allow anon read access" ON public.candidates
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon read access" ON public.cri_scores
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon read access" ON public.alignment_scores
    FOR SELECT TO anon USING (true);

-- Policy: Allow inserting data via API (for sync)
CREATE POLICY "Allow anon insert" ON public.candidates
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon insert" ON public.cri_scores
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon insert" ON public.alignment_scores
    FOR INSERT TO anon WITH CHECK (true);

-- ============================================
-- Functions and Triggers
-- ============================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON public.candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Grant Permissions
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Skill Genome schema created successfully!';
    RAISE NOTICE '💡 You can now run the sync script to import your data.';
END $$;
