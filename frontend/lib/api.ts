/**
 * Skill Genome API Service Layer
 * 
 * Centralizes all backend API calls with type safety and error handling.
 * The frontend never computes AI logic—all signals come from the backend.
 */

import type {
  CandidateDashboardData,
  RecruiterDashboardStats,
  CRIScore,
  AlignmentScore,
  SkillSignal,
  Candidate,
} from './types';

// API base URL - configure based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Generic API response wrapper
 */
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * API Error class for structured error handling
 */
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with error handling and loading states
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'API request failed',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Network error or server unavailable',
      undefined,
      error
    );
  }
}

/**
 * Fetch complete dashboard data for a single candidate
 * Includes: candidate info, skill signals, CRI score, and alignment
 */
export async function fetchCandidateDashboard(
  candidateId: string
): Promise<ApiResponse<CandidateDashboardData>> {
  try {
    const data = await apiFetch<CandidateDashboardData>(
      `/candidates/${candidateId}/dashboard`
    );
    
    return {
      data,
      error: null,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error fetching candidate dashboard:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      isLoading: false,
    };
  }
}

/**
 * Fetch recruiter dashboard statistics
 * Returns aggregate metrics for the recruiter's candidates
 */
export async function fetchRecruiterStats(
  recruiterId: string
): Promise<ApiResponse<RecruiterDashboardStats>> {
  try {
    const data = await apiFetch<RecruiterDashboardStats>(
      `/recruiters/${recruiterId}/stats`
    );
    
    return {
      data,
      error: null,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error fetching recruiter stats:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      isLoading: false,
    };
  }
}

/**
 * Fetch skill signals for a candidate
 * Returns evidence-backed technical readiness and soft skill signals
 */
export async function fetchSkillSignals(
  candidateId: string
): Promise<ApiResponse<SkillSignal[]>> {
  try {
    const data = await apiFetch<{ skills: SkillSignal[] }>(
      `/candidates/${candidateId}/signals`
    );
    
    return {
      data: data.skills,
      error: null,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error fetching skill signals:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      isLoading: false,
    };
  }
}

/**
 * Fetch CRI (Corporate Readiness Index) score for a candidate
 * Includes breakdown by dimensions and confidence level
 */
export async function fetchCRIScore(
  candidateId: string,
  roleId: string
): Promise<ApiResponse<CRIScore>> {
  try {
    const data = await apiFetch<CRIScore>(
      `/candidates/${candidateId}/cri?roleId=${roleId}`
    );
    
    return {
      data,
      error: null,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error fetching CRI score:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      isLoading: false,
    };
  }
}

/**
 * Fetch alignment score between candidate and role/organization
 * Returns detailed alignment dimensions with candidate vs. target values
 */
export async function fetchAlignmentScore(
  candidateId: string,
  roleId: string,
  organizationId: string
): Promise<ApiResponse<AlignmentScore>> {
  try {
    const data = await apiFetch<AlignmentScore>(
      `/candidates/${candidateId}/alignment?roleId=${roleId}&orgId=${organizationId}`
    );
    
    return {
      data,
      error: null,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error fetching alignment score:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      isLoading: false,
    };
  }
}

/**
 * Fetch list of candidates for a recruiter
 * Supports pagination and filtering
 */
export async function fetchCandidates(
  recruiterId: string,
  options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }
): Promise<ApiResponse<{ candidates: Candidate[]; total: number }>> {
  try {
    const params = new URLSearchParams({
      ...(options?.limit && { limit: options.limit.toString() }),
      ...(options?.offset && { offset: options.offset.toString() }),
      ...(options?.status && { status: options.status }),
    });
    
    const data = await apiFetch<{ candidates: Candidate[]; total: number }>(
      `/recruiters/${recruiterId}/candidates?${params}`
    );
    
    return {
      data,
      error: null,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      isLoading: false,
    };
  }
}

/**
 * Mock data generator for development/demo purposes
 * Returns realistic test data when backend is unavailable
 */
export function getMockCandidateDashboard(candidateId: string): CandidateDashboardData {
  return {
    candidate: {
      id: candidateId,
      recruiter_id: 'recruiter_1',
      role_id: 'role_1',
      secure_token: 'mock_token',
      email: 'candidate@example.com',
      full_name: 'Alex Johnson',
      status: 'analyzed',
      resume_url: null,
      resume_parsed: {
        skills: ['Python', 'JavaScript', 'React', 'FastAPI'],
        experience_years: 5,
        education: [],
        work_history: [],
        certifications: [],
        summary: 'Experienced software engineer',
      },
      github_username: 'alexjohnson',
      github_data: {
        username: 'alexjohnson',
        total_repos: 42,
        total_stars: 156,
        total_commits_last_year: 847,
        languages: { Python: 0.45, JavaScript: 0.30, TypeScript: 0.15, Go: 0.10 },
        contribution_streak: 128,
        recent_activity_score: 0.85,
        tool_diversity: ['Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
        collaboration_score: 0.72,
        analyzed_at: new Date().toISOString(),
      },
      leetcode_username: null,
      leetcode_data: null,
      work_preferences: {
        collaboration_style: 0.7,
        pace_preference: 0.8,
        structure_level: 0.6,
        innovation_focus: 0.85,
        communication_frequency: 0.65,
        remote_compatibility: 0.9,
        mentorship_preference: 0.55,
        decision_autonomy: 0.75,
      },
      questionnaire_responses: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    skill_signals: [],
    cri_score: {
      id: 'cri_1',
      candidate_id: candidateId,
      role_id: 'role_1',
      technical_readiness: 0.85,
      problem_solving_consistency: 0.78,
      learning_growth: 0.82,
      work_discipline: 0.88,
      context_alignment: 0.75,
      overall_cri: 0.82,
      confidence_level: 0.80,
      readiness_trend: 'improving',
      explanations: {
        technical_readiness: 'Strong GitHub activity with diverse tech stack',
        problem_solving_consistency: 'Consistent commit patterns and code quality',
        learning_growth: 'Expanding tool diversity and exploring new frameworks',
        work_discipline: 'Regular contributions and project completion',
        context_alignment: 'Work preferences align well with role requirements',
        overall_summary: 'Candidate shows strong technical skills and positive trajectory',
      },
      created_at: new Date().toISOString(),
    },
    alignment_score: {
      id: 'align_1',
      candidate_id: candidateId,
      role_id: 'role_1',
      organization_id: 'org_1',
      role_alignment: {
        dimensions: [
          { name: 'Technical Depth', candidate_value: 0.85, target_value: 0.80, alignment_score: 0.95 },
          { name: 'Leadership', candidate_value: 0.60, target_value: 0.65, alignment_score: 0.95 },
        ],
        overall: 0.75,
      },
      org_alignment: {
        dimensions: [
          { name: 'Collaboration', candidate_value: 0.70, target_value: 0.75, alignment_score: 0.95 },
          { name: 'Innovation Focus', candidate_value: 0.85, target_value: 0.80, alignment_score: 0.95 },
          { name: 'Remote Work', candidate_value: 0.90, target_value: 0.85, alignment_score: 0.95 },
        ],
        overall: 0.80,
      },
      overall_alignment: 0.77,
      alignment_category: 'high',
      key_strengths: ['Strong technical skills', 'Innovation mindset', 'Remote work compatibility'],
      potential_gaps: ['Leadership experience could be developed'],
      created_at: new Date().toISOString(),
    },
    role: null,
    organization: null,
  };
}

/**
 * Helper to check if error should show "Signal unavailable" fallback
 */
export function isSignalUnavailable(error: string | null): boolean {
  if (!error) return false;
  
  const unavailableKeywords = [
    'unavailable',
    'not found',
    '404',
    'network error',
    'timeout',
  ];
  
  return unavailableKeywords.some(keyword => 
    error.toLowerCase().includes(keyword)
  );
}
