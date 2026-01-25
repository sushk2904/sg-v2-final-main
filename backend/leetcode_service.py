
import requests
import json
import datetime
from typing import Dict, Any, List, Optional
import math

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

def get_leetcode_raw_data(username: str) -> Optional[Dict[str, Any]]:
    """
    Fetches raw data from LeetCode GraphQL API.
    """
    query = """
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
            username
            githubUrl
            twitterUrl
            linkedinUrl
            profile {
                userAvatar
                realName
                aboutMe
                school
                countryName
                company
                jobTitle
                skillTags
                ranking
            }
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
                totalSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
            submissionCalendar
        }
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            topPercentage
            totalParticipants
        }
        allQuestionsCount {
            difficulty
            count
        }
        recentSubmissionList(username: $username) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
        }
        skillStats: matchedUser(username: $username) {
             tagProblemCounts {
                advanced {
                    tagName
                    tagSlug
                    problemsSolved
                }
                intermediate {
                    tagName
                    tagSlug
                    problemsSolved
                }
                fundamental {
                    tagName
                    tagSlug
                    problemsSolved
                }
            }
        }
    }
    """
    
    variables = {"username": username}
    
    try:
        response = requests.post(
            LEETCODE_GRAPHQL_URL,
            json={"query": query, "variables": variables},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "errors" in data:
                print(f"LeetCode GraphQL Error: {data['errors']}")
                return None
            return data.get("data")
        else:
            print(f"LeetCode API Error: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error fetching LeetCode data: {str(e)}")
        return None

def analyze_leetcode_profile(username: str) -> Optional[Dict[str, Any]]:
    """
    Analyzes a LeetCode profile based on the defined heuristics.
    """
    raw_data = get_leetcode_raw_data(username)
    
    if not raw_data or not raw_data.get("matchedUser"):
        return None
        
    user_data = raw_data["matchedUser"]
    submit_stats = user_data["submitStats"]["acSubmissionNum"]
    total_stats = user_data["submitStats"]["totalSubmissionNum"]
    contest_ranking = raw_data.get("userContestRanking")
    submission_calendar_str = user_data.get("submissionCalendar", "{}")
    submission_calendar = json.loads(submission_calendar_str)
    
    # --------------------------------------------------
    # 1. BASIC PROFILE OVERVIEW
    # --------------------------------------------------
    
    # Problems Solved
    total_solved = 0
    easy_solved = 0
    medium_solved = 0
    hard_solved = 0
    
    for stat in submit_stats:
        if stat["difficulty"] == "All":
            total_solved = stat["count"]
        elif stat["difficulty"] == "Easy":
            easy_solved = stat["count"]
        elif stat["difficulty"] == "Medium":
            medium_solved = stat["count"]
        elif stat["difficulty"] == "Hard":
            hard_solved = stat["count"]
            
    # Submissions
    total_submissions = 0
    accepted_submissions = 0
    
    for stat in total_stats:
        if stat["difficulty"] == "All":
            total_submissions = stat["submissions"]
            
    for stat in submit_stats:
        if stat["difficulty"] == "All":
            accepted_submissions = stat["submissions"]
            
    acceptance_rate = 0.0
    if total_submissions > 0:
        acceptance_rate = (accepted_submissions / total_submissions) * 100
        
    # Rank
    global_rank = user_data["profile"]["ranking"]
    country = user_data["profile"]["countryName"]
    
    profile_overview = {
        "total_solved": total_solved,
        "easy_solved": easy_solved,
        "medium_solved": medium_solved,
        "hard_solved": hard_solved,
        "total_submissions": total_submissions,
        "accepted_submissions": accepted_submissions,
        "acceptance_rate": round(acceptance_rate, 2),
        "global_rank": global_rank,
        "country": country
    }
    
    # --------------------------------------------------
    # 2. CONSISTENCY & DISCIPLINE ANALYSIS
    # --------------------------------------------------
    
    # Active Days (AD) in last 180 days
    today = datetime.datetime.now().timestamp()
    days_180_ago = today - (180 * 24 * 60 * 60)
    
    active_days = 0
    active_dates = []
    
    for timestamp, count in submission_calendar.items():
        ts = int(timestamp)
        if ts >= days_180_ago:
            active_days += 1
            active_dates.append(ts)
            
    consistency_score = active_days / 180
    
    # Activity Pattern Classification
    activity_pattern = "Inactive"
    if consistency_score >= 0.70:
        activity_pattern = "Consistent"
    elif consistency_score >= 0.40:
        activity_pattern = "Semi-Consistent"
    elif consistency_score >= 0.15:
        activity_pattern = "Burst-Based"
    
    # Streaks and Gaps (basic approximation from sorted timestamps)
    active_dates.sort()
    longest_streak = 0
    current_streak = 0
    gaps_gt_14 = 0
    last_date = None
    
    if active_dates:
        # Convert timestamps to date objects for easier comparison
        dates = [datetime.datetime.fromtimestamp(ts).date() for ts in active_dates]
        
        current_streak = 1
        longest_streak = 1
        
        for i in range(1, len(dates)):
            delta = (dates[i] - dates[i-1]).days
            
            if delta == 1:
                current_streak += 1
            elif delta > 1:
                longest_streak = max(longest_streak, current_streak)
                current_streak = 1
                if delta > 14:
                    gaps_gt_14 += 1
        
        longest_streak = max(longest_streak, current_streak)
    
    consistency_analysis = {
        "active_days_180": active_days,
        "consistency_score": round(consistency_score, 2),
        "activity_pattern": activity_pattern,
        "longest_streak": longest_streak,
        "gaps_gt_14_days": gaps_gt_14
    }
    
    # --------------------------------------------------
    # 3. DIFFICULTY DEPTH EVALUATION
    # --------------------------------------------------
    
    medium_plus_hard = medium_solved + hard_solved
    mhr = 0.0
    hp_pct = 0.0
    
    if total_solved > 0:
        mhr = medium_plus_hard / total_solved
        hp_pct = hard_solved / total_solved
        
    depth_interpretation = "Shallow / Easy-heavy"
    if mhr >= 0.65:
        depth_interpretation = "Strong depth"
    elif mhr >= 0.45:
        depth_interpretation = "Moderate depth"
        
    difficulty_depth = {
        "mhr": round(mhr, 2),
        "hp_percent": round(hp_pct * 100, 2),
        "interpretation": depth_interpretation
    }
    
    # --------------------------------------------------
    # 4. TOPIC COVERAGE ASSESSMENT
    # --------------------------------------------------
    
    core_topics = {
        "Array", "String", "Hash Table", "Two Pointers", "Sliding Window",
        "Recursion", "Backtracking", "Tree", "Graph", "Dynamic Programming",
        "Greedy", "Binary Search", "Heap (Priority Queue)", "Trie"
    }
    # Mapping LeetCode tags to core topics (simple string matching)
    
    solved_tags = set()
    tag_counts = raw_data.get("skillStats", {}).get("tagProblemCounts", {})
    
    for category in ["advanced", "intermediate", "fundamental"]:
         if tag_counts and category in tag_counts:
             for tag in tag_counts[category]:
                 if tag["problemsSolved"] > 0:
                     # Simple normalization for matching
                     tag_name = tag["tagName"]
                     if tag_name in core_topics or tag_name.replace(" ", "") in core_topics:
                         solved_tags.add(tag_name)
    
    # Note: This is an approximation. Ideally we map exact slugs.
    # Let's count how many core_topics are effectively covered.
    # Since I don't have the exact mapping list from your raw data structure without seeing it,
    # I'll iterate the known core topics and check if they exist in the user's solved tags.
    
    tc_count = 0
    # Flatten the user's tags
    user_tags_flat = set()
    for category in ["advanced", "intermediate", "fundamental"]:
         if tag_counts and category in tag_counts:
             for tag in tag_counts[category]:
                 if tag["problemsSolved"] > 0:
                     user_tags_flat.add(tag["tagName"])

    # Manual mapping for some tricky ones
    mapping = {
        "Arrays": "Array", "Strings": "String", "Hashing": "Hash Table", 
        "Two Pointers": "Two Pointers", "Sliding Window": "Sliding Window",
        "Recursion": "Recursion", "Backtracking": "Backtracking", "Trees": "Tree", 
        "Graphs": "Graph", "Dynamic Programming": "Dynamic Programming", 
        "Greedy": "Greedy", "Binary Search": "Binary Search", 
        "Heaps": "Heap (Priority Queue)", "Tries": "Trie"
    }
    
    # The heuristic asks for: Arrays, Strings, Hashing, Two Pointers, Sliding Window, Recursion, Backtracking, Trees, Graphs, Dynamic Programming, Greedy, Binary Search, Heaps, Tries
    # LeetCode tags are singular usually (Array, Tree).
    
    target_topics = [
        "Array", "String", "Hash Table", "Two Pointers", "Sliding Window",
        "Recursion", "Backtracking", "Tree", "Graph", 
        "Dynamic Programming", "Greedy", "Binary Search", 
        "Heap (Priority Queue)", "Trie"
    ]
    
    for topic in target_topics:
        if topic in user_tags_flat:
             tc_count += 1
             
    tcs = tc_count / 14
    
    coverage_interpretation = "Narrow coverage"
    if tcs >= 0.75:
        coverage_interpretation = "Broad coverage"
    elif tcs >= 0.50:
        coverage_interpretation = "Moderate coverage"
        
    topic_coverage = {
        "distinct_core_topics_solved": tc_count,
        "tcs": round(tcs, 2),
        "interpretation": coverage_interpretation
    }
    
    # --------------------------------------------------
    # 5. CONTEST PERFORMANCE
    # --------------------------------------------------
    
    contest_score = "Not Available"
    contest_rating = None
    attended_contests = 0
    
    if contest_ranking and contest_ranking.get("attendedContestsCount", 0) > 0:
        attended_contests = contest_ranking["attendedContestsCount"]
        contest_rating = contest_ranking["rating"]
        
        if contest_rating >= 1800:
            contest_score = 1.0
        elif contest_rating >= 1600:
            contest_score = 0.8
        elif contest_rating >= 1400:
            contest_score = 0.6
        else:
            contest_score = 0.4
            
    contest_performance = {
        "attended_contests": attended_contests,
        "rating": round(contest_rating, 0) if contest_rating else None,
        "contest_score": contest_score
    }
    
    # --------------------------------------------------
    # 6. SUBMISSION BEHAVIOR INSIGHTS
    # --------------------------------------------------
    
    asp = 0.0
    if total_solved > 0:
        asp = total_submissions / total_solved
    
    asp_interpretation = "Normal learning curve"
    if asp <= 2.5:
        asp_interpretation = "Efficient problem-solving"
    elif asp > 5:
        asp_interpretation = "Trial-and-error heavy"
        
    submission_behavior = {
        "asp": round(asp, 2),
        "interpretation": asp_interpretation
    }
    
    # --------------------------------------------------
    # 8. RED FLAGS & POSITIVE SIGNALS (Simplified)
    # --------------------------------------------------
    
    red_flags = []
    positive_signals = []
    
    # Flag: Easy-dominant profile after T >= 300
    if total_solved >= 300 and mhr < 0.45:
        red_flags.append("Easy-dominant profile despite high total solved count")
        
    # Flag: Inconsistent
    if consistency_score < 0.25:
        red_flags.append("Low consistency (< 0.25)")
        
    # Signal: Strong depth
    if mhr >= 0.60:
        positive_signals.append("Strong focus on Medium/Hard problems")
        
    # Signal: Contest participation
    if contest_score != "Not Available" and contest_rating and contest_rating > 1500:
         positive_signals.append(f"Active competitive programmer (Rating: {int(contest_rating)})")

    # --------------------------------------------------
    # 9. FINAL CANDIDATE SCORE
    # --------------------------------------------------
    
    # Normalize components
    cc = consistency_score
    dc = mhr
    tc = tcs
    ac = min(acceptance_rate / 80, 1.0)
    conc = contest_score if contest_score != "Not Available" else None
    
    final_score = 0.0
    
    if conc is not None:
        # Full formula
        final_score = 100 * (0.25 * cc + 0.25 * dc + 0.20 * tc + 0.10 * ac + 0.20 * conc)
    else:
        # Renormalize without Contest (Total weight 0.8)
        # Weights: CC(0.25), DC(0.25), TC(0.20), AC(0.10) -> Sum = 0.8
        # New Factor = 1 / 0.8 = 1.25
        final_score = 100 * 1.25 * (0.25 * cc + 0.25 * dc + 0.20 * tc + 0.10 * ac)
        
    # --------------------------------------------------
    # 10. HIRING SIGNAL SUMMARY
    # --------------------------------------------------
    
    hiring_signal = "Low Signal / Superficial"
    if final_score >= 80:
        hiring_signal = "Strong Hire"
    elif final_score >= 65:
        hiring_signal = "Interview-Ready"
    elif final_score >= 45:
        hiring_signal = "Practice-Heavy but Promising"
        
    return {
        "username": username,
        "profile_overview": profile_overview,
        "consistency_analysis": consistency_analysis,
        "difficulty_depth": difficulty_depth,
        "topic_coverage": topic_coverage,
        "contest_performance": contest_performance,
        "submission_behavior": submission_behavior,
        "red_flags": red_flags,
        "positive_signals": positive_signals,
        "final_score": round(final_score, 1),
        "hiring_signal": hiring_signal,
        "analyzed_at": datetime.datetime.utcnow().isoformat()
    }
