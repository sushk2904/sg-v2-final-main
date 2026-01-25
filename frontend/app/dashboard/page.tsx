import { createClient } from "@/lib/supabase/server";
import { CRICard } from "@/components/CRICard";
import { SkillBarChart } from "@/components/SkillBarChart";
import { AlignmentHeatmap } from "@/components/AlignmentHeatmap";
import { TrendBadge } from "@/components/TrendBadge";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";
import { EvidencePanel } from "@/components/EvidencePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMockCandidateDashboard } from "@/lib/api";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Default mock values for when Supabase is not configured
  let user: any = null;
  let totalCandidates = 0;
  let pendingIntake = 0;
  let awaitingQuestionnaire = 0;
  let analyzedCount = 0;
  let recentCandidates: any[] = [];

  if (supabase) {
    // Supabase is configured - fetch real data
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;

    // Fetch stats
    const { count: total } = await supabase
      .from("candidates")
      .select("*", { count: "exact", head: true })
      .eq("recruiter_id", user?.id);
    totalCandidates = total || 0;

    const { count: pending } = await supabase
      .from("candidates")
      .select("*", { count: "exact", head: true })
      .eq("recruiter_id", user?.id)
      .eq("status", "pending");
    pendingIntake = pending || 0;

    const { count: awaiting } = await supabase
      .from("candidates")
      .select("*", { count: "exact", head: true })
      .eq("recruiter_id", user?.id)
      .eq("status", "questionnaire_sent");
    awaitingQuestionnaire = awaiting || 0;

    const { count: analyzed } = await supabase
      .from("candidates")
      .select("*", { count: "exact", head: true })
      .eq("recruiter_id", user?.id)
      .eq("status", "analyzed");
    analyzedCount = analyzed || 0;

    // Fetch recent candidates
    const { data: candidates } = await supabase
      .from("candidates")
      .select("*, roles(title)")
      .eq("recruiter_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(3);
    recentCandidates = candidates || [];
  } else {
    // Development mode without Supabase - use demo stats
    totalCandidates = 12;
    pendingIntake = 3;
    awaitingQuestionnaire = 4;
    analyzedCount = 5;
  }

  // Determine if we should use API or mock data
  const useRealAPI = !!process.env.NEXT_PUBLIC_API_URL;

  let candidateData = null;

  if (useRealAPI && recentCandidates && recentCandidates.length > 0) {
    // Try to fetch from real API
    try {
      const { fetchCandidateDashboard } = await import("@/lib/api");
      const apiResponse = await fetchCandidateDashboard(recentCandidates[0].id);
      candidateData = apiResponse.data;
    } catch (error) {
      console.error("Failed to fetch from API, using mock data:", error);
      // Fallback to mock data if API fails
      candidateData = getMockCandidateDashboard(recentCandidates[0].id);
    }
  } else {
    // Use mock data for demo purposes
    const candidateIdForDemo = recentCandidates && recentCandidates.length > 0
      ? recentCandidates[0].id
      : 'demo-candidate-001';

    candidateData = getMockCandidateDashboard(candidateIdForDemo);
  }

  const stats = {
    total_candidates: totalCandidates,
    pending_intake: pendingIntake,
    awaiting_questionnaire: awaitingQuestionnaire,
    analyzed: analyzedCount,
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Recruiter Dashboard
        </h2>
        <p className="text-muted-foreground">
          AI-powered decision support for candidate evaluation—advisory signals only
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_candidates}</div>
            <p className="text-xs text-muted-foreground">In your pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_intake}</div>
            <p className="text-xs text-muted-foreground">Awaiting data collection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questionnaire Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awaiting_questionnaire}</div>
            <p className="text-xs text-muted-foreground">Candidate input needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.analyzed}</div>
            <p className="text-xs text-muted-foreground">Ready for review</p>
          </CardContent>
        </Card>
      </div>

      {/* Conditionally show API connection notice only if API_URL is not configured */}
      {!process.env.NEXT_PUBLIC_API_URL && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-yellow-500/10 p-2">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Backend API Not Connected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Using sample data for visualization. Set NEXT_PUBLIC_API_URL in .env.local to connect your backend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {candidateData && (
        <>
          {/* Featured Candidate Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Featured Candidate: {candidateData.candidate.full_name}
            </h3>

            {/* Top Panel: CRI Card with Confidence and Trend */}
            <div className="grid gap-6 lg:grid-cols-3 mb-6">
              <div className="lg:col-span-2">
                <CRICard
                  score={candidateData.cri_score?.overall_cri || null}
                  confidence={
                    candidateData.cri_score?.confidence_level
                      ? candidateData.cri_score.confidence_level >= 0.7
                        ? 'high'
                        : candidateData.cri_score.confidence_level >= 0.5
                          ? 'medium'
                          : 'low'
                      : null
                  }
                  trend={candidateData.cri_score?.readiness_trend || null}
                  explanation={candidateData.cri_score?.explanations.overall_summary || null}
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-lg font-semibold">
                      {candidateData.candidate.resume_parsed?.experience_years || 0} years
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">GitHub Activity</p>
                    <p className="text-lg font-semibold">
                      {candidateData.candidate.github_data?.total_commits_last_year || 0} commits
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Readiness Trend</p>
                    <TrendBadge trend={candidateData.cri_score?.readiness_trend || null} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Section: Skill Signals and Alignment */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <SkillBarChart
                signals={
                  candidateData.cri_score
                    ? {
                      technical_readiness: candidateData.cri_score.technical_readiness,
                      problem_solving_consistency: candidateData.cri_score.problem_solving_consistency,
                      learning_growth: candidateData.cri_score.learning_growth,
                      work_discipline: candidateData.cri_score.work_discipline,
                    }
                    : null
                }
              />
              <AlignmentHeatmap
                alignmentData={candidateData.alignment_score?.org_alignment || null}
                title="Organization Alignment"
              />
            </div>

            {/* Bottom Section: Evidence Panel */}
            <EvidencePanel
              resume={candidateData.candidate.resume_parsed}
              githubData={candidateData.candidate.github_data}
              leetcodeData={candidateData.candidate.leetcode_data}
            />
          </div>
        </>
      )}

      {/* Recent Candidates List */}
      {recentCandidates && recentCandidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{candidate.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(candidate.roles as any)?.title || "No role assigned"} · {candidate.status}
                    </p>
                  </div>
                  <Badge variant="outline">{candidate.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
