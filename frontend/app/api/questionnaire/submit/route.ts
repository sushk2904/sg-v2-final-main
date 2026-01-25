import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";

const workPreferencesSchema = z.object({
  collaboration_style: z.number().min(0).max(1).describe("0 = prefers independent work, 1 = prefers collaborative work"),
  pace_preference: z.number().min(0).max(1).describe("0 = prefers steady pace, 1 = prefers fast-paced"),
  structure_level: z.number().min(0).max(1).describe("0 = prefers flexibility, 1 = prefers structure"),
  innovation_focus: z.number().min(0).max(1).describe("0 = prefers operational/maintenance, 1 = prefers innovation"),
  communication_frequency: z.number().min(0).max(1).describe("0 = prefers async, 1 = prefers synchronous"),
  remote_compatibility: z.number().min(0).max(1).describe("0 = prefers office, 1 = prefers remote"),
  mentorship_preference: z.number().min(0).max(1).describe("0 = self-directed, 1 = prefers mentorship"),
  decision_autonomy: z.number().min(0).max(1).describe("0 = prefers guidance, 1 = prefers autonomy"),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const { candidate_id, token, responses } = await request.json();

  if (!candidate_id || !token || !responses) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Verify token matches candidate
    const { data: candidate } = await supabase
      .from("candidates")
      .select("id, secure_token")
      .eq("id", candidate_id)
      .eq("secure_token", token)
      .single();

    if (!candidate) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 403 }
      );
    }

    // Structure responses into work preferences using AI
    const responseSummary = responses
      .map((r: { question_text: string; response: string; category: string }) => 
        `[${r.category}] Q: ${r.question_text}\nA: ${r.response}`
      )
      .join("\n\n");

    const { object: workPreferences } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: workPreferencesSchema,
      prompt: `Based on the following questionnaire responses, analyze the candidate's work preferences and return structured float values (0-1) for each dimension.

QUESTIONNAIRE RESPONSES:
${responseSummary}

IMPORTANT:
- Base your analysis ONLY on the explicit responses given
- Do not make assumptions beyond what is stated
- Values should reflect the candidate's stated preferences:
  - 0.0-0.3: Strong preference for the "low" end
  - 0.3-0.5: Slight preference for the "low" end
  - 0.5: Neutral/balanced
  - 0.5-0.7: Slight preference for the "high" end
  - 0.7-1.0: Strong preference for the "high" end

Analyze thoughtfully and return accurate preference values.`,
    });

    // Update candidate with responses and work preferences
    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        questionnaire_responses: responses,
        work_preferences: workPreferences,
        status: "questionnaire_complete",
      })
      .eq("id", candidate_id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      work_preferences: workPreferences,
    });
  } catch (error) {
    console.error("Questionnaire submit error:", error);
    return NextResponse.json(
      { error: "Failed to process questionnaire" },
      { status: 500 }
    );
  }
}
