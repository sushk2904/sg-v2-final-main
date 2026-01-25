// Corporate Readiness Index (CRI) Calculation Engine

import type {
  Candidate,
  CRIScore,
  CRIExplanations,
  SkillSignal,
  Role,
  Organization,
  AlignmentScore,
  AlignmentDetail,
} from './types';

// CRI Weights as per PRD
const CRI_WEIGHTS = {
  technical_readiness: 0.30,
  problem_solving_consistency: 0.20,
  learning_growth: 0.15,
  work_discipline: 0.15,
  context_alignment: 0.20,
};

export function calculateTechnicalReadiness(
  candidate: Candidate,
  skillSignals: SkillSignal[],
  role: Role
): { score: number; explanation: string } {
  if (skillSignals.length === 0) {
    return { score: 0, explanation: 'No skill signals available for assessment.' };
  }

  const requiredSkills = role.required_skills || [];
  const preferredSkills = role.preferred_skills || [];
  
  // Match required skills
  const requiredMatches = skillSignals.filter(s => 
    requiredSkills.some(req => 
      s.skill_name.toLowerCase().includes(req.toLowerCase()) ||
      req.toLowerCase().includes(s.skill_name.toLowerCase())
    )
  );
  
  const requiredCoverage = requiredSkills.length > 0 
    ? requiredMatches.length / requiredSkills.length 
    : 0.5;
  
  // Average proficiency of matched skills
  const avgProficiency = requiredMatches.length > 0
    ? requiredMatches.reduce((sum, s) => sum + s.proficiency_level, 0) / requiredMatches.length
    : 0;
  
  // Factor in confidence
  const avgConfidence = requiredMatches.length > 0
    ? requiredMatches.reduce((sum, s) => sum + s.confidence, 0) / requiredMatches.length
    : 0;
  
  // Preferred skills bonus
  const preferredMatches = skillSignals.filter(s =>
    preferredSkills.some(pref =>
      s.skill_name.toLowerCase().includes(pref.toLowerCase())
    )
  );
  const preferredBonus = preferredSkills.length > 0
    ? (preferredMatches.length / preferredSkills.length) * 0.1
    : 0;
  
  const score = Math.min(1, (requiredCoverage * 0.5 + avgProficiency * 0.3 + avgConfidence * 0.2) + preferredBonus);
  
  const explanation = `Covers ${requiredMatches.length}/${requiredSkills.length} required skills with ${(avgProficiency * 100).toFixed(0)}% average proficiency. ${preferredMatches.length} preferred skills identified.`;
  
  return { score, explanation };
}

export function calculateProblemSolvingConsistency(candidate: Candidate): { score: number; explanation: string } {
  const leetcode = candidate.leetcode_data;
  const github = candidate.github_data;
  
  let score = 0.5; // Default baseline
  const factors: string[] = [];
  
  if (leetcode) {
    const totalProblems = leetcode.total_solved || 0;
    const mediumHardRatio = leetcode.medium_solved + leetcode.hard_solved > 0
      ? (leetcode.medium_solved + leetcode.hard_solved) / Math.max(1, totalProblems)
      : 0;
    
    score += mediumHardRatio * 0.2;
    factors.push(`${totalProblems} problems solved (${leetcode.medium_solved} medium, ${leetcode.hard_solved} hard)`);
    
    if (leetcode.problem_progression === 'improving') {
      score += 0.1;
      factors.push('improving problem-solving trajectory');
    }
  }
  
  if (github) {
    const commitConsistency = Math.min(github.total_commits_last_year / 365, 1);
    score += commitConsistency * 0.15;
    factors.push(`${github.total_commits_last_year} commits in last year`);
    
    if (github.contribution_streak > 30) {
      score += 0.05;
      factors.push(`${github.contribution_streak}-day contribution streak`);
    }
  }
  
  score = Math.min(1, Math.max(0, score));
  const explanation = factors.length > 0 
    ? `Based on ${factors.join(', ')}.`
    : 'Limited coding activity data available.';
  
  return { score, explanation };
}

export function calculateLearningGrowth(candidate: Candidate): { score: number; explanation: string } {
  const github = candidate.github_data;
  const leetcode = candidate.leetcode_data;
  const resume = candidate.resume_parsed;
  
  let score = 0.5;
  const factors: string[] = [];
  
  if (github) {
    // Tool diversity indicates learning breadth
    const toolDiversity = (github.tool_diversity?.length || 0) / 10;
    score += Math.min(toolDiversity, 0.2);
    
    const languageCount = Object.keys(github.languages || {}).length;
    if (languageCount > 3) {
      score += 0.1;
      factors.push(`${languageCount} programming languages used`);
    }
    
    if (github.recent_activity_score > 0.7) {
      score += 0.1;
      factors.push('high recent activity');
    }
  }
  
  if (leetcode?.problem_progression === 'improving') {
    score += 0.1;
    factors.push('improving problem difficulty progression');
  }
  
  if (resume) {
    const certCount = resume.certifications?.length || 0;
    if (certCount > 0) {
      score += Math.min(certCount * 0.05, 0.15);
      factors.push(`${certCount} certifications`);
    }
  }
  
  score = Math.min(1, Math.max(0, score));
  const explanation = factors.length > 0
    ? `Growth indicators: ${factors.join(', ')}.`
    : 'Limited learning trajectory data available.';
  
  return { score, explanation };
}

export function calculateWorkDiscipline(candidate: Candidate): { score: number; explanation: string } {
  const github = candidate.github_data;
  
  let score = 0.5;
  const factors: string[] = [];
  
  if (github) {
    // Contribution consistency
    if (github.contribution_streak > 60) {
      score += 0.2;
      factors.push('excellent contribution consistency');
    } else if (github.contribution_streak > 30) {
      score += 0.1;
      factors.push('good contribution consistency');
    }
    
    // Collaboration indicators
    if (github.collaboration_score > 0.7) {
      score += 0.15;
      factors.push('strong collaboration patterns');
    } else if (github.collaboration_score > 0.4) {
      score += 0.08;
      factors.push('moderate collaboration patterns');
    }
    
    // Project maintenance
    if (github.total_repos > 10) {
      score += 0.1;
      factors.push(`maintains ${github.total_repos} repositories`);
    }
  }
  
  // Work history stability from resume
  const resume = candidate.resume_parsed;
  if (resume?.work_history) {
    const avgTenure = resume.work_history.reduce((sum, w) => sum + w.duration_months, 0) / 
      Math.max(1, resume.work_history.length);
    if (avgTenure > 24) {
      score += 0.15;
      factors.push('stable employment history');
    }
  }
  
  score = Math.min(1, Math.max(0, score));
  const explanation = factors.length > 0
    ? `Work discipline indicators: ${factors.join(', ')}.`
    : 'Limited work discipline data available.';
  
  return { score, explanation };
}

export function calculateContextAlignment(
  candidate: Candidate,
  role: Role,
  organization: Organization
): { score: number; explanation: string } {
  const prefs = candidate.work_preferences;
  const roleEnv = role.role_environment;
  const orgSig = organization.work_signature;
  
  if (!prefs) {
    return { score: 0.5, explanation: 'Work preference questionnaire not completed.' };
  }
  
  const alignments: { dimension: string; score: number }[] = [];
  
  if (roleEnv) {
    // Compare candidate preferences with role environment
    const meetingAlign = 1 - Math.abs(prefs.communication_frequency - roleEnv.meeting_frequency);
    alignments.push({ dimension: 'meeting frequency', score: meetingAlign });
    
    const pressureAlign = 1 - Math.abs(prefs.pace_preference - roleEnv.deadline_pressure);
    alignments.push({ dimension: 'pace/pressure', score: pressureAlign });
    
    const leadershipAlign = 1 - Math.abs(prefs.decision_autonomy - roleEnv.leadership_expected);
    alignments.push({ dimension: 'leadership', score: leadershipAlign });
  }
  
  if (orgSig) {
    // Compare candidate preferences with organization signature
    const collabAlign = 1 - Math.abs(prefs.collaboration_style - orgSig.collaboration_style);
    alignments.push({ dimension: 'collaboration', score: collabAlign });
    
    const structureAlign = 1 - Math.abs(prefs.structure_level - orgSig.structure_level);
    alignments.push({ dimension: 'structure', score: structureAlign });
    
    const innovationAlign = 1 - Math.abs(prefs.innovation_focus - orgSig.innovation_focus);
    alignments.push({ dimension: 'innovation focus', score: innovationAlign });
    
    const remoteAlign = 1 - Math.abs(prefs.remote_compatibility - orgSig.remote_compatibility);
    alignments.push({ dimension: 'remote work', score: remoteAlign });
  }
  
  if (alignments.length === 0) {
    return { score: 0.5, explanation: 'Role/Organization profiles not fully configured.' };
  }
  
  const avgAlignment = alignments.reduce((sum, a) => sum + a.score, 0) / alignments.length;
  
  const highAligns = alignments.filter(a => a.score >= 0.75).map(a => a.dimension);
  const lowAligns = alignments.filter(a => a.score < 0.45).map(a => a.dimension);
  
  let explanation = '';
  if (highAligns.length > 0) {
    explanation += `Strong alignment in: ${highAligns.join(', ')}. `;
  }
  if (lowAligns.length > 0) {
    explanation += `Potential gaps in: ${lowAligns.join(', ')}.`;
  }
  if (!explanation) {
    explanation = 'Moderate alignment across all dimensions.';
  }
  
  return { score: avgAlignment, explanation };
}

export function calculateOverallCRI(
  candidate: Candidate,
  skillSignals: SkillSignal[],
  role: Role,
  organization: Organization
): CRIScore {
  const technical = calculateTechnicalReadiness(candidate, skillSignals, role);
  const problemSolving = calculateProblemSolvingConsistency(candidate);
  const learning = calculateLearningGrowth(candidate);
  const discipline = calculateWorkDiscipline(candidate);
  const context = calculateContextAlignment(candidate, role, organization);
  
  const overallCRI = 
    technical.score * CRI_WEIGHTS.technical_readiness +
    problemSolving.score * CRI_WEIGHTS.problem_solving_consistency +
    learning.score * CRI_WEIGHTS.learning_growth +
    discipline.score * CRI_WEIGHTS.work_discipline +
    context.score * CRI_WEIGHTS.context_alignment;
  
  // Calculate confidence based on data availability
  let dataPoints = 0;
  if (candidate.resume_parsed) dataPoints++;
  if (candidate.github_data) dataPoints++;
  if (candidate.leetcode_data) dataPoints++;
  if (candidate.work_preferences) dataPoints++;
  const confidenceLevel = dataPoints / 4;
  
  // Determine trend from GitHub recency and LeetCode progression
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (candidate.github_data?.recent_activity_score > 0.7 || candidate.leetcode_data?.problem_progression === 'improving') {
    trend = 'improving';
  } else if (candidate.github_data?.recent_activity_score < 0.3 || candidate.leetcode_data?.problem_progression === 'declining') {
    trend = 'declining';
  }
  
  const explanations: CRIExplanations = {
    technical_readiness: technical.explanation,
    problem_solving_consistency: problemSolving.explanation,
    learning_growth: learning.explanation,
    work_discipline: discipline.explanation,
    context_alignment: context.explanation,
    overall_summary: generateOverallSummary(overallCRI, confidenceLevel, trend),
  };
  
  return {
    id: '', // Will be set by database
    candidate_id: candidate.id,
    role_id: role.id,
    technical_readiness: technical.score,
    problem_solving_consistency: problemSolving.score,
    learning_growth: learning.score,
    work_discipline: discipline.score,
    context_alignment: context.score,
    overall_cri: overallCRI,
    confidence_level: confidenceLevel,
    readiness_trend: trend,
    explanations,
    created_at: new Date().toISOString(),
  };
}

function generateOverallSummary(cri: number, confidence: number, trend: string): string {
  let readinessLevel = '';
  if (cri >= 0.75) readinessLevel = 'high corporate readiness';
  else if (cri >= 0.5) readinessLevel = 'moderate corporate readiness';
  else readinessLevel = 'developing corporate readiness';
  
  let trendText = '';
  if (trend === 'improving') trendText = 'with an upward trajectory';
  else if (trend === 'declining') trendText = 'with areas needing attention';
  else trendText = 'with stable indicators';
  
  let confidenceText = '';
  if (confidence >= 0.75) confidenceText = 'Assessment based on comprehensive data.';
  else if (confidence >= 0.5) confidenceText = 'Assessment based on moderate data coverage.';
  else confidenceText = 'Limited data available; consider gathering additional evidence.';
  
  return `Candidate demonstrates ${readinessLevel} ${trendText}. ${confidenceText}`;
}

export function calculateAlignmentScore(
  candidate: Candidate,
  role: Role,
  organization: Organization
): AlignmentScore {
  const prefs = candidate.work_preferences;
  const roleEnv = role.role_environment;
  const orgSig = organization.work_signature;
  
  const roleAlignmentDimensions: AlignmentDetail['dimensions'] = [];
  const orgAlignmentDimensions: AlignmentDetail['dimensions'] = [];
  
  if (prefs && roleEnv) {
    roleAlignmentDimensions.push(
      {
        name: 'Meeting Frequency',
        candidate_value: prefs.communication_frequency,
        target_value: roleEnv.meeting_frequency,
        alignment_score: 1 - Math.abs(prefs.communication_frequency - roleEnv.meeting_frequency),
      },
      {
        name: 'Pace/Pressure',
        candidate_value: prefs.pace_preference,
        target_value: roleEnv.deadline_pressure,
        alignment_score: 1 - Math.abs(prefs.pace_preference - roleEnv.deadline_pressure),
      },
      {
        name: 'Leadership Expected',
        candidate_value: prefs.decision_autonomy,
        target_value: roleEnv.leadership_expected,
        alignment_score: 1 - Math.abs(prefs.decision_autonomy - roleEnv.leadership_expected),
      },
      {
        name: 'Technical Depth',
        candidate_value: prefs.structure_level,
        target_value: roleEnv.technical_depth,
        alignment_score: 1 - Math.abs(prefs.structure_level - roleEnv.technical_depth),
      }
    );
  }
  
  if (prefs && orgSig) {
    orgAlignmentDimensions.push(
      {
        name: 'Collaboration Style',
        candidate_value: prefs.collaboration_style,
        target_value: orgSig.collaboration_style,
        alignment_score: 1 - Math.abs(prefs.collaboration_style - orgSig.collaboration_style),
      },
      {
        name: 'Structure Level',
        candidate_value: prefs.structure_level,
        target_value: orgSig.structure_level,
        alignment_score: 1 - Math.abs(prefs.structure_level - orgSig.structure_level),
      },
      {
        name: 'Innovation Focus',
        candidate_value: prefs.innovation_focus,
        target_value: orgSig.innovation_focus,
        alignment_score: 1 - Math.abs(prefs.innovation_focus - orgSig.innovation_focus),
      },
      {
        name: 'Remote Compatibility',
        candidate_value: prefs.remote_compatibility,
        target_value: orgSig.remote_compatibility,
        alignment_score: 1 - Math.abs(prefs.remote_compatibility - orgSig.remote_compatibility),
      },
      {
        name: 'Mentorship Culture',
        candidate_value: prefs.mentorship_preference,
        target_value: orgSig.mentorship_culture,
        alignment_score: 1 - Math.abs(prefs.mentorship_preference - orgSig.mentorship_culture),
      },
      {
        name: 'Decision Autonomy',
        candidate_value: prefs.decision_autonomy,
        target_value: orgSig.decision_autonomy,
        alignment_score: 1 - Math.abs(prefs.decision_autonomy - orgSig.decision_autonomy),
      }
    );
  }
  
  const roleOverall = roleAlignmentDimensions.length > 0
    ? roleAlignmentDimensions.reduce((sum, d) => sum + d.alignment_score, 0) / roleAlignmentDimensions.length
    : 0.5;
  
  const orgOverall = orgAlignmentDimensions.length > 0
    ? orgAlignmentDimensions.reduce((sum, d) => sum + d.alignment_score, 0) / orgAlignmentDimensions.length
    : 0.5;
  
  const overallAlignment = (roleOverall + orgOverall) / 2;
  
  const allDimensions = [...roleAlignmentDimensions, ...orgAlignmentDimensions];
  const keyStrengths = allDimensions
    .filter(d => d.alignment_score >= 0.75)
    .map(d => d.name);
  const potentialGaps = allDimensions
    .filter(d => d.alignment_score < 0.45)
    .map(d => d.name);
  
  let alignmentCategory: 'high' | 'medium' | 'low' = 'medium';
  if (overallAlignment >= 0.75) alignmentCategory = 'high';
  else if (overallAlignment < 0.45) alignmentCategory = 'low';
  
  return {
    id: '',
    candidate_id: candidate.id,
    role_id: role.id,
    organization_id: organization.id,
    role_alignment: {
      dimensions: roleAlignmentDimensions,
      overall: roleOverall,
    },
    org_alignment: {
      dimensions: orgAlignmentDimensions,
      overall: orgOverall,
    },
    overall_alignment: overallAlignment,
    alignment_category: alignmentCategory,
    key_strengths: keyStrengths,
    potential_gaps: potentialGaps,
    created_at: new Date().toISOString(),
  };
}
