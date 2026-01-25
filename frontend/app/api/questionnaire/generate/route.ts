import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";

const questionSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      text: z.string().describe("The question text - must NOT include personality traits or psychological assessments"),
      category: z.enum(["work_style", "collaboration", "growth", "environment", "communication"]),
      purpose: z.string().describe("Why this question helps understand work preferences"),
      response_type: z.enum(["scale", "multiple_choice", "open_ended"]),
      options: z.array(z.string()).optional().describe("Options for multiple choice questions"),
    })
  ),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { candidate_id, role_id, focus_areas, question_count = 10 } = await request.json();

  if (!candidate_id) {
    return NextResponse.json({ error: "Missing candidate_id" }, { status: 400 });
  }

  try {
    // Fetch candidate data for context
    const { data: candidate } = await supabase
      .from("candidates")
      .select("*, roles(*)")
      .eq("id", candidate_id)
      .single();

    // Fetch role and org data if available
    let roleContext = "";
    let orgContext = "";

    if (role_id || candidate?.role_id) {
      const { data: role } = await supabase
        .from("roles")
        .select("*, organizations(*)")
        .eq("id", role_id || candidate?.role_id)
        .single();

      if (role) {
        roleContext = `
Role: ${role.title}
Department: ${role.department || "Not specified"}
Seniority: ${role.seniority_level || "Not specified"}
Required Skills: ${role.required_skills?.join(", ") || "Not specified"}
Role Environment: ${JSON.stringify(role.role_environment) || "Not specified"}`;

        if (role.organizations) {
          orgContext = `
Organization: ${role.organizations.name}
Industry: ${role.organizations.industry || "Not specified"}
Size: ${role.organizations.size || "Not specified"}
Work Signature: ${JSON.stringify(role.organizations.work_signature) || "Not specified"}`;
        }
      }
    }

    const focusAreasText = focus_areas?.length
      ? `Focus particularly on: ${focus_areas.join(", ")}`
      : "";

    // Generate questions with AI
    const { object: generatedQuestions } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: questionSchema,
      prompt: `Generate ${question_count} work-context questions for a candidate assessment.

IMPORTANT CONSTRAINTS:
1. Questions must focus on WORK PREFERENCES and BEHAVIORS only
2. NO personality trait assessments (Big Five, Myers-Briggs, etc.)
3. NO psychological profiling questions
4. NO questions about personal values or ethics
5. Questions should be about concrete work situations and preferences
6. Each question should help understand how the candidate prefers to work

CONTEXT:
${roleContext}
${orgContext}
${focusAreasText}

CATEGORIES TO COVER:
- work_style: How they approach tasks, deadlines, planning
- collaboration: Team interaction preferences, meeting styles
- growth: Learning preferences, feedback reception, skill development
- environment: Workspace preferences, remote/office, noise levels
- communication: Async vs sync, documentation habits, update frequency

Generate thoughtful questions that reveal work preferences without being intrusive or personality-focused. Each question should have a clear purpose for understanding workplace compatibility.`,
    });

    // Store generated questions
    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        questionnaire_responses: generatedQuestions.questions.map((q) => ({
          question_id: q.id,
          question_text: q.text,
          response: null,
          structured_value: null,
          category: q.category,
        })),
        status: "questionnaire_sent",
      })
      .eq("id", candidate_id)
      .eq("recruiter_id", user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      questions: generatedQuestions.questions,
      candidate_link: `/q/${candidate?.secure_token}`,
    });
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
