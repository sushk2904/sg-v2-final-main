import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}

interface GitHubEvent {
  type: string;
  created_at: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { candidate_id, github_username } = await request.json();

  if (!candidate_id || !github_username) {
    return NextResponse.json(
      { error: "Missing candidate_id or github_username" },
      { status: 400 }
    );
  }

  try {
    // Fetch GitHub user data
    const userResponse = await fetch(
      `https://api.github.com/users/${github_username}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "GitHub user not found" },
        { status: 404 }
      );
    }

    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${github_username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    const repos: GitHubRepo[] = await reposResponse.json();

    // Fetch recent events for activity analysis
    const eventsResponse = await fetch(
      `https://api.github.com/users/${github_username}/events?per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    const events: GitHubEvent[] = await eventsResponse.json();

    // Analyze data
    const ownRepos = repos.filter((r) => !r.fork);
    const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

    // Language distribution
    const languages: Record<string, number> = {};
    ownRepos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Calculate recent activity score (last 90 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentEvents = events.filter(
      (e) => new Date(e.created_at) > thirtyDaysAgo
    );
    const recentActivityScore = Math.min(recentEvents.length / 50, 1);

    // Estimate commits from push events
    const pushEvents = events.filter((e) => e.type === "PushEvent");
    const totalCommitsLastYear = pushEvents.length * 3; // Rough estimate

    // Collaboration score based on PR and issue events
    const collabEvents = events.filter(
      (e) =>
        e.type === "PullRequestEvent" ||
        e.type === "IssueCommentEvent" ||
        e.type === "PullRequestReviewEvent"
    );
    const collaborationScore = Math.min(collabEvents.length / 30, 1);

    // Calculate contribution streak
    const uniqueDays = new Set(
      events.map((e) => new Date(e.created_at).toDateString())
    );
    const contributionStreak = uniqueDays.size;

    // Tool diversity
    const toolDiversity = Object.keys(languages);

    const githubData = {
      username: github_username,
      total_repos: ownRepos.length,
      total_stars: totalStars,
      total_commits_last_year: totalCommitsLastYear,
      languages,
      contribution_streak: contributionStreak,
      recent_activity_score: recentActivityScore,
      tool_diversity: toolDiversity,
      collaboration_score: collaborationScore,
      analyzed_at: new Date().toISOString(),
    };

    // Update candidate with GitHub data
    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        github_data: githubData,
        github_username,
      })
      .eq("id", candidate_id)
      .eq("recruiter_id", user.id);

    if (updateError) {
      throw updateError;
    }

    // Generate skill signals from GitHub languages
    const githubSkillSignals = toolDiversity.map((lang) => ({
      candidate_id,
      skill_name: lang,
      proficiency_level: Math.min((languages[lang] / ownRepos.length) * 1.5, 1),
      evidence_sources: ["github"],
      confidence: 0.8,
      recency_score: recentActivityScore,
      depth_indicators: [`${languages[lang]} repositories`],
    }));

    if (githubSkillSignals.length > 0) {
      // Upsert skill signals
      for (const signal of githubSkillSignals) {
        const { data: existing } = await supabase
          .from("skill_signals")
          .select("id, evidence_sources")
          .eq("candidate_id", candidate_id)
          .eq("skill_name", signal.skill_name)
          .single();

        if (existing) {
          // Update with combined evidence
          const sources = [...new Set([...existing.evidence_sources, "github"])];
          await supabase
            .from("skill_signals")
            .update({
              evidence_sources: sources,
              proficiency_level: Math.max(signal.proficiency_level, 0.7),
              confidence: 0.85,
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("skill_signals").insert(signal);
        }
      }
    }

    return NextResponse.json({
      success: true,
      github_data: githubData,
      skills_extracted: githubSkillSignals.length,
    });
  } catch (error) {
    console.error("GitHub analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze GitHub profile" },
      { status: 500 }
    );
  }
}
