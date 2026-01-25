"""
GitHub Analysis Service
Fetches and analyzes GitHub profile data
"""

import requests
from datetime import datetime
from typing import Dict, Any, Optional
from config import settings


def analyze_github_profile(username: str) -> Optional[Dict[str, Any]]:
    """
    Analyze a GitHub profile and extract skill signals.
    
    Args:
        username: GitHub username
        
    Returns:
        Dictionary with GitHub analysis data or None if failed
    """
    
    headers = {}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"
    
    try:
        # Fetch user profile
        user_response = requests.get(
            f"https://api.github.com/users/{username}",
            headers=headers,
            timeout=10
        )
        
        if user_response.status_code != 200:
            print(f"GitHub API error: {user_response.status_code}")
            return None
        
        user_data = user_response.json()
        
        # Fetch repositories
        repos_response = requests.get(
            f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated",
            headers=headers,
            timeout=10
        )
        
        if repos_response.status_code != 200:
            repos = []
        else:
            repos = repos_response.json()
        
        # Analyze repositories
        languages = {}
        total_stars = 0
        tools = set()
        
        for repo in repos[:50]:  # Analyze top 50 repos
            # Count language usage
            if repo.get("language"):
                lang = repo["language"]
                languages[lang] = languages.get(lang, 0) + 1
            
            # Count stars
            total_stars += repo.get("stargazers_count", 0)
            
            # Extract tools from topics/description
            topics = repo.get("topics", [])
            tools.update(topics)
        
        # Normalize language percentages
        total_repos_with_lang = sum(languages.values()) or 1
        language_percentages = {
            lang: round(count / total_repos_with_lang, 2)
            for lang, count in sorted(languages.items(), key=lambda x: x[1], reverse=True)[:10]
        }
        
        # Calculate activity score (simplified)
        activity_score = min(1.0, user_data.get("public_repos", 0) / 50)
        
        # Build analysis result
        github_data = {
            "username": username,
            "total_repos": user_data.get("public_repos", 0),
            "total_stars": total_stars,
            "total_commits_last_year": 0,  # Would need events API for accurate count
            "languages": language_percentages,
            "contribution_streak": 0,  # Simplified
            "recent_activity_score": activity_score,
            "tool_diversity": list(tools)[:20],
            "collaboration_score": min(1.0, (user_data.get("followers", 0) + user_data.get("following", 0)) / 100),
            "analyzed_at": datetime.utcnow().isoformat()
        }
        
        return github_data
        
    except requests.RequestException as e:
        print(f"GitHub API request failed: {e}")
        return None
    except Exception as e:
        print(f"GitHub analysis error: {e}")
        return None


def calculate_github_signals(github_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Calculate skill signals from GitHub data.
    
    Returns:
        Dictionary with skill signal scores (0.0 - 1.0)
    """
    
    if not github_data:
        return {
            "technical_diversity": 0.5,
            "code_quality": 0.5,
            "collaboration": 0.5,
            "activity_level": 0.5
        }
    
    # Technical diversity based on languages
    lang_count = len(github_data.get("languages", {}))
    technical_diversity = min(1.0, lang_count / 5)  # 5+ languages = max score
    
    # Activity level
    activity_level = github_data.get("recent_activity_score", 0.5)
    
    # Collaboration based on social metrics
    collaboration = github_data.get("collaboration_score", 0.5)
    
    # Code quality proxy (stars per repo)
    repos = github_data.get("total_repos", 1)
    stars = github_data.get("total_stars", 0)
    code_quality = min(1.0, (stars / repos) / 10) if repos > 0 else 0.5
    
    return {
        "technical_diversity": round(technical_diversity, 2),
        "code_quality": round(code_quality, 2),
        "collaboration": round(collaboration, 2),
        "activity_level": round(activity_level, 2)
    }
