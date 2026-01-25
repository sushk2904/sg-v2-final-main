-- Skill Genome Database Schema
-- Core tables for the AI-driven hiring intelligence platform

-- Recruiters/Users profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Organization Work Signatures (defines company culture/work patterns)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  -- Work signature dimensions (0-1 scale)
  collaboration_level DECIMAL(3,2) DEFAULT 0.5,
  autonomy_level DECIMAL(3,2) DEFAULT 0.5,
  pace_intensity DECIMAL(3,2) DEFAULT 0.5,
  innovation_focus DECIMAL(3,2) DEFAULT 0.5,
  process_structure DECIMAL(3,2) DEFAULT 0.5,
  remote_flexibility DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organizations_select_own" ON public.organizations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "organizations_insert_own" ON public.organizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "organizations_update_own" ON public.organizations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "organizations_delete_own" ON public.organizations FOR DELETE USING (auth.uid() = user_id);

-- Role Profiles (defines specific job requirements)
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  department TEXT,
  seniority_level TEXT CHECK (seniority_level IN ('junior', 'mid', 'senior', 'lead', 'principal')),
  -- Required skill levels (0-1 scale)
  technical_depth_required DECIMAL(3,2) DEFAULT 0.5,
  collaboration_required DECIMAL(3,2) DEFAULT 0.5,
  autonomy_required DECIMAL(3,2) DEFAULT 0.5,
  learning_agility_required DECIMAL(3,2) DEFAULT 0.5,
  problem_complexity DECIMAL(3,2) DEFAULT 0.5,
  -- Required skills array
  required_skills TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_select_own" ON public.roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "roles_insert_own" ON public.roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "roles_update_own" ON public.roles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "roles_delete_own" ON public.roles FOR DELETE USING (auth.uid() = user_id);

-- Candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  -- Basic info
  name TEXT NOT NULL,
  email TEXT,
  -- Secure assessment link token
  assessment_token UUID DEFAULT gen_random_uuid() UNIQUE,
  assessment_completed BOOLEAN DEFAULT FALSE,
  -- Resume data (parsed)
  resume_text TEXT,
  resume_parsed_skills TEXT[] DEFAULT '{}',
  years_experience INTEGER,
  education_level TEXT,
  -- GitHub data
  github_username TEXT,
  github_repos_count INTEGER,
  github_total_commits INTEGER,
  github_languages JSONB DEFAULT '{}',
  github_contribution_frequency DECIMAL(5,2),
  github_recent_activity_score DECIMAL(3,2),
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "candidates_select_own" ON public.candidates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "candidates_insert_own" ON public.candidates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "candidates_update_own" ON public.candidates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "candidates_delete_own" ON public.candidates FOR DELETE USING (auth.uid() = user_id);
-- Allow candidates to access their own assessment via token (public read for assessment)
CREATE POLICY "candidates_select_by_token" ON public.candidates FOR SELECT USING (true);

-- AI-generated questionnaire responses
CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  -- Questions and answers stored as JSONB
  questions JSONB NOT NULL DEFAULT '[]',
  answers JSONB DEFAULT '{}',
  -- Structured work preferences (computed from answers)
  work_preferences JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
-- Recruiters can see responses for their candidates
CREATE POLICY "questionnaire_select_by_candidate_owner" ON public.questionnaire_responses 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.user_id = auth.uid())
  );
-- Allow insert/update via token (for candidate assessment)
CREATE POLICY "questionnaire_insert_public" ON public.questionnaire_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "questionnaire_update_public" ON public.questionnaire_responses FOR UPDATE USING (true);

-- Skill signals (inferred from all data sources)
CREATE TABLE IF NOT EXISTS public.skill_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level DECIMAL(3,2) NOT NULL, -- 0-1 scale
  confidence DECIMAL(3,2) NOT NULL, -- 0-1 scale
  evidence_sources TEXT[] DEFAULT '{}', -- e.g., ['resume', 'github', 'questionnaire']
  evidence_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skill_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skill_signals_select_by_candidate_owner" ON public.skill_signals 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.user_id = auth.uid())
  );
CREATE POLICY "skill_signals_insert_by_candidate_owner" ON public.skill_signals 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.user_id = auth.uid())
  );

-- CRI (Corporate Readiness Index) scores
CREATE TABLE IF NOT EXISTS public.cri_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  -- CRI components (0-1 scale)
  technical_readiness DECIMAL(3,2) NOT NULL,
  problem_solving_consistency DECIMAL(3,2) NOT NULL,
  learning_growth DECIMAL(3,2) NOT NULL,
  work_discipline DECIMAL(3,2) NOT NULL,
  context_alignment DECIMAL(3,2) NOT NULL,
  -- Overall CRI (computed)
  overall_cri DECIMAL(3,2) NOT NULL,
  -- Confidence and trend
  confidence_score DECIMAL(3,2) NOT NULL,
  readiness_trend TEXT CHECK (readiness_trend IN ('improving', 'stable', 'declining')),
  -- Explanations
  explanations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cri_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cri_scores_select_by_candidate_owner" ON public.cri_scores 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.user_id = auth.uid())
  );
CREATE POLICY "cri_scores_insert_by_candidate_owner" ON public.cri_scores 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.user_id = auth.uid())
  );

-- Alignment scores (candidate vs role/org)
CREATE TABLE IF NOT EXISTS public.alignment_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  -- Alignment dimensions
  collaboration_alignment DECIMAL(3,2),
  autonomy_alignment DECIMAL(3,2),
  pace_alignment DECIMAL(3,2),
  innovation_alignment DECIMAL(3,2),
  process_alignment DECIMAL(3,2),
  remote_alignment DECIMAL(3,2),
  -- Overall alignment
  overall_role_alignment DECIMAL(3,2),
  overall_org_alignment DECIMAL(3,2),
  -- Alignment level
  alignment_level TEXT CHECK (alignment_level IN ('high', 'medium', 'low')),
  -- Details
  alignment_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alignment_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alignment_scores_select_by_candidate_owner" ON public.alignment_scores 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.user_id = auth.uid())
  );
CREATE POLICY "alignment_scores_insert_by_candidate_owner" ON public.alignment_scores 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.user_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_role_id ON public.candidates(role_id);
CREATE INDEX IF NOT EXISTS idx_candidates_assessment_token ON public.candidates(assessment_token);
CREATE INDEX IF NOT EXISTS idx_roles_user_id ON public.roles(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_user_id ON public.organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_signals_candidate_id ON public.skill_signals(candidate_id);
CREATE INDEX IF NOT EXISTS idx_cri_scores_candidate_id ON public.cri_scores(candidate_id);
CREATE INDEX IF NOT EXISTS idx_alignment_scores_candidate_id ON public.alignment_scores(candidate_id);
