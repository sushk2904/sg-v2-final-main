import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CandidateProfile } from "@/components/candidates/candidate-profile";
import { CRIDashboard } from "@/components/candidates/cri-dashboard";
import { AlignmentHeatmap } from "@/components/candidates/alignment-heatmap";
import { SkillSignals } from "@/components/candidates/skill-signals";
import { EvidencePanel } from "@/components/candidates/evidence-panel";
import { CandidateActions } from "@/components/candidates/candidate-actions";
import { getMockCandidateDashboard } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  let candidate: any = null;
  let skillSignals: any[] = [];
  let organization: any = null;

  // TRY LOCAL API FIRST (Since we are using FastAPI + SQLite)
  const shouldUseLocalApi = process.env.NEXT_PUBLIC_API_URL?.includes("localhost") || process.env.NEXT_PUBLIC_API_URL?.includes("127.0.0.1");

  if (shouldUseLocalApi) {
    console.log("Local API configured, prioritizing backend fetch over Supabase...");
    try {
      // Using direct Python backend address since this is server-side fetch
      // Note: server-side fetch to localhost often needs 127.0.0.1
      const apiUrl = `http://127.0.0.1:8000/api/candidates/${id}/dashboard`;
      console.log(`Fetching from: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      console.log(`Local API response: ${response.status}`);

      if (response.ok) {
        const apiData = await response.json();

        // Adapt API response to match Supabase structure
        if (apiData.candidate) {
          candidate = {
            ...apiData.candidate,
            // If API returns role, use it, otherwise mock or leave null
            roles: apiData.role || (apiData.candidate.role_id ? { title: "Role " + apiData.candidate.role_id } : { title: "Unassigned Role" }),
            cri_scores: apiData.cri_score ? [apiData.cri_score] : [],
            alignment_scores: apiData.alignment_score ? [apiData.alignment_score] : []
          };

          // Use organization from API if available
          organization = apiData.organization;

          // Generate signals from GitHub data if available
          if (candidate.github_data) {
            const languages = candidate.github_data.languages || {};
            skillSignals = Object.entries(languages).map(([lang, usage]: [string, any]) => ({
              skill_name: lang,
              proficiency_level: Math.min(usage * 2, 1),
              confidence: 0.8,
              evidence_sources: ["github"]
            })).sort((a: any, b: any) => b.proficiency_level - a.proficiency_level);
          }
        }
      }
    } catch (error) {
      console.log("Failed to fetch from local backend:", error);
    }
  }

  // Fallback to Supabase if Local API didn't return candidate
  if (!candidate && supabase) {
    console.log("Local API failed or skipped, trying Supabase...");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Fetch candidate with all related data
      const { data } = await supabase
        .from("candidates")
        .select(
          `
          *,
          roles(*),
          cri_scores(*),
          alignment_scores(*)
        `
        )
        .eq("id", id)
        .eq("recruiter_id", user.id)
        .single();

      if (data) {
        candidate = data;

        // Fetch skill signals
        const { data: signals } = await supabase
          .from("skill_signals")
          .select("*")
          .eq("candidate_id", id)
          .order("proficiency_level", { ascending: false });
        skillSignals = signals || [];

        // Fetch organization if role exists
        if (candidate.roles?.organization_id) {
          const { data: org } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", candidate.roles.organization_id)
            .single();
          organization = org;
        }
      }
    }
  }

  // Final fallback: Mock Data
  if (!candidate) {
    console.log("No data found, trying mock data...");
    const mockData = getMockCandidateDashboard(id);
    if (mockData) {
      // Map mock data to component structure
      candidate = {
        ...mockData.candidate,
        roles: { title: "Senior Checkin Engineer", organization_id: "org-001" }, // Mock role
        cri_scores: [mockData.cri_score],
        alignment_scores: [mockData.alignment_score]
      };

      // Generate mock skill signals
      skillSignals = [
        { skill_name: "Python", proficiency_level: 0.9, confidence: 0.8 },
        { skill_name: "React", proficiency_level: 0.85, confidence: 0.9 },
        { skill_name: "TypeScript", proficiency_level: 0.8, confidence: 0.85 },
        { skill_name: "FastAPI", proficiency_level: 0.75, confidence: 0.7 },
        { skill_name: "PostgreSQL", proficiency_level: 0.7, confidence: 0.8 },
      ];

      organization = {
        name: "Tech Corp Inc.",
        industry: "Technology"
      };
    }
  }


  if (!candidate) {
    notFound();
  }

  const criScore = candidate.cri_scores?.[0] || null;
  const alignmentScore = candidate.alignment_scores?.[0] || null;

  return (
    <div className="space-y-6">
      {/* Header with profile and actions */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <CandidateProfile candidate={candidate} role={candidate.roles} />
        <CandidateActions
          candidate={candidate}
          hasRole={!!candidate.roles}
          hasQuestionnaire={
            candidate.questionnaire_responses &&
            candidate.questionnaire_responses.length > 0
          }
          isAnalyzed={candidate.status === "analyzed"}
        />
      </div>

      {/* CRI Dashboard - Top */}
      {criScore && (
        <CRIDashboard criScore={criScore} />
      )}

      {/* Middle section: Skills and Alignment */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill Signals */}
        <SkillSignals signals={skillSignals || []} />

        {/* Alignment Heatmap */}
        {alignmentScore && (
          <AlignmentHeatmap
            alignmentScore={alignmentScore}
            role={candidate.roles}
            organization={organization}
          />
        )}
      </div>

      {/* Evidence Panel - Bottom */}
      <EvidencePanel
        candidate={candidate}
        criScore={criScore}
      />
    </div>
  );
}
