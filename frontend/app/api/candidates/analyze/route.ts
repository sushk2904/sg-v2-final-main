import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {
  calculateOverallCRI,
  calculateAlignmentScore,
} from "@/lib/cri-calculator";
import type { Candidate, Role, Organization, SkillSignal } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { candidate_id } = await request.json();

  if (!candidate_id) {
    return NextResponse.json({ error: "Missing candidate_id" }, { status: 400 });
  }

  try {
    // Fetch candidate with all related data
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidates")
      .select("*")
      .eq("id", candidate_id)
      .eq("recruiter_id", user.id)
      .single();

    if (candidateError || !candidateData) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const candidate = candidateData as Candidate;

    // Check if candidate has a role assigned
    if (!candidate.role_id) {
      return NextResponse.json(
        { error: "Candidate must be assigned to a role for analysis" },
        { status: 400 }
      );
    }

    // Fetch role
    const { data: roleData } = await supabase
      .from("roles")
      .select("*")
      .eq("id", candidate.role_id)
      .single();

    if (!roleData) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const role = roleData as Role;

    // Fetch organization
    const { data: orgData } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", role.organization_id)
      .single();

    if (!orgData) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const organization = orgData as Organization;

    // Fetch skill signals
    const { data: skillSignalsData } = await supabase
      .from("skill_signals")
      .select("*")
      .eq("candidate_id", candidate_id);

    const skillSignals = (skillSignalsData || []) as SkillSignal[];

    // Calculate CRI Score
    const criScore = calculateOverallCRI(
      candidate,
      skillSignals,
      role,
      organization
    );

    // Calculate Alignment Score
    const alignmentScore = calculateAlignmentScore(candidate, role, organization);

    // Save CRI score
    const { data: savedCRI, error: criError } = await supabase
      .from("cri_scores")
      .upsert(
        {
          candidate_id,
          role_id: role.id,
          technical_readiness: criScore.technical_readiness,
          problem_solving_consistency: criScore.problem_solving_consistency,
          learning_growth: criScore.learning_growth,
          work_discipline: criScore.work_discipline,
          context_alignment: criScore.context_alignment,
          overall_cri: criScore.overall_cri,
          confidence_level: criScore.confidence_level,
          readiness_trend: criScore.readiness_trend,
          explanations: criScore.explanations,
        },
        {
          onConflict: "candidate_id,role_id",
        }
      )
      .select()
      .single();

    if (criError) {
      console.error("CRI save error:", criError);
    }

    // Save Alignment score
    const { data: savedAlignment, error: alignError } = await supabase
      .from("alignment_scores")
      .upsert(
        {
          candidate_id,
          role_id: role.id,
          organization_id: organization.id,
          role_alignment: alignmentScore.role_alignment,
          org_alignment: alignmentScore.org_alignment,
          overall_alignment: alignmentScore.overall_alignment,
          alignment_category: alignmentScore.alignment_category,
          key_strengths: alignmentScore.key_strengths,
          potential_gaps: alignmentScore.potential_gaps,
        },
        {
          onConflict: "candidate_id,role_id",
        }
      )
      .select()
      .single();

    if (alignError) {
      console.error("Alignment save error:", alignError);
    }

    // Update candidate status
    await supabase
      .from("candidates")
      .update({ status: "analyzed" })
      .eq("id", candidate_id);

    return NextResponse.json({
      success: true,
      cri_score: savedCRI || criScore,
      alignment_score: savedAlignment || alignmentScore,
      skill_signals: skillSignals.length,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze candidate" },
      { status: 500 }
    );
  }
}
