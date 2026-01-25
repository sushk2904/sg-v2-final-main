// Skill Genome Core Types

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: 'recruiter' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  recruiter_id: string;
  name: string;
  industry: string | null;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null;
  work_signature: WorkSignature | null;
  created_at: string;
  updated_at: string;
}

export interface WorkSignature {
  collaboration_style: number; // 0-1: Independent to Collaborative
  pace_preference: number; // 0-1: Steady to Fast-paced
  structure_level: number; // 0-1: Flexible to Structured
  innovation_focus: number; // 0-1: Operational to Innovative
  communication_frequency: number; // 0-1: Async to Synchronous
  remote_compatibility: number; // 0-1: Office-first to Remote-first
  mentorship_culture: number; // 0-1: Self-directed to Mentor-heavy
  decision_autonomy: number; // 0-1: Hierarchical to Autonomous
}

export interface Role {
  id: string;
  organization_id: string;
  title: string;
  department: string | null;
  seniority_level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'executive' | null;
  required_skills: string[];
  preferred_skills: string[];
  role_environment: RoleEnvironment | null;
  created_at: string;
  updated_at: string;
}

export interface RoleEnvironment {
  team_size: 'solo' | 'small' | 'medium' | 'large';
  meeting_frequency: number; // 0-1
  deadline_pressure: number; // 0-1
  cross_functional: number; // 0-1
  customer_facing: number; // 0-1
  technical_depth: number; // 0-1
  leadership_expected: number; // 0-1
}

export interface Candidate {
  id: string;
  recruiter_id: string;
  role_id: string | null;
  secure_token: string;
  email: string;
  full_name: string;
  status: 'pending' | 'intake_complete' | 'questionnaire_sent' | 'questionnaire_complete' | 'analyzed' | 'archived';
  resume_url: string | null;
  resume_parsed: ResumeParsed | null;
  github_username: string | null;
  github_data: GitHubData | null;
  leetcode_username: string | null;
  leetcode_data: LeetCodeData | null;
  work_preferences: WorkPreferences | null;
  questionnaire_responses: QuestionnaireResponse[] | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeParsed {
  skills: string[];
  experience_years: number;
  education: Education[];
  work_history: WorkHistory[];
  certifications: string[];
  summary: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: number | null;
}

export interface WorkHistory {
  company: string;
  title: string;
  duration_months: number;
  highlights: string[];
  technologies: string[];
}

export interface GitHubData {
  username: string;
  total_repos: number;
  total_stars: number;
  total_commits_last_year: number;
  languages: { [key: string]: number };
  contribution_streak: number;
  recent_activity_score: number; // 0-1
  tool_diversity: string[];
  collaboration_score: number; // 0-1 based on PRs, issues, etc.
  analyzed_at: string;
}

export interface LeetCodeData {
  username: string;
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  acceptance_rate: number;
  ranking: number | null;
  contest_rating: number | null;
  problem_progression: 'improving' | 'stable' | 'declining';
  analyzed_at: string;
}

export interface WorkPreferences {
  collaboration_style: number;
  pace_preference: number;
  structure_level: number;
  innovation_focus: number;
  communication_frequency: number;
  remote_compatibility: number;
  mentorship_preference: number;
  decision_autonomy: number;
}

export interface QuestionnaireResponse {
  question_id: string;
  question_text: string;
  response: string;
  structured_value: number | null; // 0-1 scale
  category: 'work_style' | 'collaboration' | 'growth' | 'environment' | 'communication';
}

export interface SkillSignal {
  id: string;
  candidate_id: string;
  skill_name: string;
  proficiency_level: number; // 0-1
  evidence_sources: ('resume' | 'github' | 'leetcode' | 'questionnaire')[];
  confidence: number; // 0-1
  recency_score: number; // 0-1
  depth_indicators: string[];
  created_at: string;
}

export interface CRIScore {
  id: string;
  candidate_id: string;
  role_id: string;
  technical_readiness: number; // 0-1
  problem_solving_consistency: number; // 0-1
  learning_growth: number; // 0-1
  work_discipline: number; // 0-1
  context_alignment: number; // 0-1
  overall_cri: number; // 0-1, weighted composite
  confidence_level: number; // 0-1
  readiness_trend: 'improving' | 'stable' | 'declining';
  explanations: CRIExplanations;
  created_at: string;
}

export interface CRIExplanations {
  technical_readiness: string;
  problem_solving_consistency: string;
  learning_growth: string;
  work_discipline: string;
  context_alignment: string;
  overall_summary: string;
}

export interface AlignmentScore {
  id: string;
  candidate_id: string;
  role_id: string;
  organization_id: string;
  role_alignment: AlignmentDetail;
  org_alignment: AlignmentDetail;
  overall_alignment: number; // 0-1
  alignment_category: 'high' | 'medium' | 'low';
  key_strengths: string[];
  potential_gaps: string[];
  created_at: string;
}

export interface AlignmentDetail {
  dimensions: {
    name: string;
    candidate_value: number;
    target_value: number;
    alignment_score: number;
  }[];
  overall: number;
}

// AI Generation Types
export interface GeneratedQuestion {
  id: string;
  text: string;
  category: 'work_style' | 'collaboration' | 'growth' | 'environment' | 'communication';
  purpose: string;
  response_type: 'scale' | 'multiple_choice' | 'open_ended';
  options?: string[];
}

export interface QuestionnaireConfig {
  role_id: string;
  organization_id: string;
  focus_areas: string[];
  question_count: number;
}

// Dashboard Types
export interface CandidateDashboardData {
  candidate: Candidate;
  skill_signals: SkillSignal[];
  cri_score: CRIScore | null;
  alignment_score: AlignmentScore | null;
  role: Role | null;
  organization: Organization | null;
}

export interface RecruiterDashboardStats {
  total_candidates: number;
  pending_intake: number;
  awaiting_questionnaire: number;
  analyzed: number;
  average_cri: number;
  high_alignment_count: number;
}
