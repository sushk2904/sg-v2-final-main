"""
CRI Calculation Service
Calculates Corporate Readiness Index based on candidate data
"""

from typing import Dict, Any
import random


def calculate_cri(candidate_data: Dict[str, Any], github_signals: Dict[str, float] = None) -> Dict[str, Any]:
    """
    Calculate CRI score for a candidate.
    
    Args:
        candidate_data: Candidate information
        github_signals: GitHub skill signals
        
    Returns:
        CRI score breakdown
    """
    
    # Get GitHub signals or use defaults
    if not github_signals:
        github_signals = {
            "technical_diversity": 0.7,
            "code_quality": 0.7,
            "collaboration": 0.7,
            "activity_level": 0.7
        }
    
    # Component calculations
    
    # 1. Technical Readiness (heavily weighted by GitHub)
    technical_readiness = (
        github_signals.get("technical_diversity", 0.7) * 0.4 +
        github_signals.get("code_quality", 0.7) * 0.3 +
        github_signals.get("activity_level", 0.7) * 0.3
    )
    
    # 2. Problem Solving Consistency (based on code patterns and LeetCode if available)
    leetcode_data = candidate_data.get("leetcode_data", {})
    if leetcode_data and "final_score" in leetcode_data:
        # Use sophisticated LeetCode score (0-100 normalized to 0-1)
        problem_solving = leetcode_data["final_score"] / 100.0
    elif leetcode_data and "profile_overview" in leetcode_data:
        # Fallback to simple solved count if legacy data
        total_solved = leetcode_data["profile_overview"].get("total_solved", 0)
        problem_solving = min(1.0, total_solved / 200)
    else:
        problem_solving = github_signals.get("code_quality", 0.7)
    
    # 3. Learning & Growth (tool diversity and recent activity)
    learning_growth = (
        github_signals.get("technical_diversity", 0.7) * 0.6 +
        github_signals.get("activity_level", 0.7) * 0.4
    )
    
    # 4. Work Discipline (commit consistency, streaks)
    if leetcode_data and "consistency_analysis" in leetcode_data:
        # Blend GitHub activity with LeetCode consistency
        lc_consistency = leetcode_data["consistency_analysis"].get("consistency_score", 0.5)
        gh_consistency = github_signals.get("activity_level", 0.7)
        work_discipline = (lc_consistency * 0.5) + (gh_consistency * 0.5)
    else:
        work_discipline = github_signals.get("activity_level", 0.7)
    
    # 5. Context Alignment (work preferences match)
    prefs = candidate_data.get("work_preferences", {})
    if prefs:
        # Average of preference alignment
        context_alignment = sum(prefs.values()) / len(prefs) if prefs else 0.7
    else:
        context_alignment = 0.7
    
    # Overall CRI (weighted average)
    overall_cri = (
        technical_readiness * 0.30 +
        problem_solving * 0.25 +
        learning_growth * 0.20 +
        work_discipline * 0.15 +
        context_alignment * 0.10
    )
    
    # Determine confidence based on data availability
    data_sources = 0
    if candidate_data.get("github_data"): data_sources += 0.4
    if candidate_data.get("leetcode_data"): data_sources += 0.3
    if candidate_data.get("resume_parsed"): data_sources += 0.2
    if candidate_data.get("work_preferences"): data_sources += 0.1
    
    confidence_level = min(1.0, data_sources)
    
    # Determine trend (simplified - based on recent activity)
    if github_signals.get("activity_level", 0) > 0.7:
        trend = "improving"
    elif github_signals.get("activity_level", 0) > 0.4:
        trend = "stable"
    else:
        trend = "declining"
    
    return {
        "technical_readiness": round(technical_readiness, 2),
        "problem_solving_consistency": round(problem_solving, 2),
        "learning_growth": round(learning_growth, 2),
        "work_discipline": round(work_discipline, 2),
        "context_alignment": round(context_alignment, 2),
        "overall_cri": round(overall_cri, 2),
        "confidence_level": round(confidence_level, 2),
        "readiness_trend": trend,
        "explanations": {
            "technical_readiness": f"Based on GitHub activity: {len(github_signals)} language(s), {github_signals.get('code_quality', 0):.0%} code quality",
            "problem_solving_consistency": "Analyzed from GitHub commits and LeetCode performance" if leetcode_data else "Based on GitHub code patterns",
            "learning_growth": f"Expanding skills with {github_signals.get('technical_diversity', 0):.0%} diversity score",
            "work_discipline": f"{github_signals.get('activity_level', 0):.0%} activity consistency",
            "context_alignment": "Work preferences analyzed" if prefs else "Default alignment",
            "overall_summary": f"Candidate shows {trend} trajectory with {round(confidence_level * 100)}% confidence based on available data."
        }
    }


def calculate_alignment(candidate_prefs: Dict[str, float], target_prefs: Dict[str, float] = None) -> Dict[str, Any]:
    """
    Calculate work alignment between candidate and role/organization.
    
    Args:
        candidate_prefs: Candidate work preferences (0-1 scale)
        target_prefs: Target role/org preferences
        
    Returns:
        Alignment score breakdown
    """
    
    # Default target preferences if not provided
    if not target_prefs:
        target_prefs = {
            "collaboration_style": 0.75,
            "pace_preference": 0.70,
            "structure_level": 0.60,
            "innovation_focus": 0.80,
            "communication_frequency": 0.65,
            "remote_compatibility": 0.85,
            "mentorship_preference": 0.55,
            "decision_autonomy": 0.75
        }
    
    # Calculate alignment for each dimension
    dimensions = []
    for key in target_prefs:
        candidate_val = candidate_prefs.get(key, 0.5)
        target_val = target_prefs[key]
        
        # Alignment score: 1 - difference (closer values = higher alignment)
        alignment_score = 1 - abs(candidate_val - target_val)
        
        dimensions.append({
            "name": key.replace("_", " ").title(),
            "candidate_value": round(candidate_val, 2),
            "target_value": round(target_val, 2),
            "alignment_score": round(alignment_score, 2)
        })
    
    # Overall alignment
    overall = sum(d["alignment_score"] for d in dimensions) / len(dimensions)
    
    # Categorize
    if overall >= 0.75:
        category = "high"
    elif overall >= 0.5:
        category = "medium"
    else:
        category = "low"
    
    # Identify strengths and gaps
    strengths = [d["name"] for d in dimensions if d["alignment_score"] >= 0.8]
    gaps = [d["name"] for d in dimensions if d["alignment_score"] < 0.6]
    
    return {
        "dimensions": dimensions,
        "overall": round(overall, 2),
        "category": category,
        "key_strengths": strengths or ["Good overall fit"],
        "potential_gaps": gaps or ["No significant gaps"]
    }
