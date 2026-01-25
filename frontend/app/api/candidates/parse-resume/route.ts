import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";

const resumeSchema = z.object({
  skills: z.array(z.string()).describe("Technical and soft skills mentioned"),
  experience_years: z.number().describe("Total years of professional experience"),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      year: z.number().nullable(),
    })
  ),
  work_history: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      duration_months: z.number(),
      highlights: z.array(z.string()),
      technologies: z.array(z.string()),
    })
  ),
  certifications: z.array(z.string()),
  summary: z.string().describe("Brief professional summary"),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { candidate_id, resume_text } = await request.json();

  if (!candidate_id || !resume_text) {
    return NextResponse.json(
      { error: "Missing candidate_id or resume_text" },
      { status: 400 }
    );
  }

  try {
    // Parse resume with AI
    const { object: parsedResume } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: resumeSchema,
      prompt: `Parse the following resume and extract structured information. Be thorough but accurate.

RESUME TEXT:
${resume_text}

Extract all skills, work experience, education, certifications, and create a brief professional summary.`,
    });

    // Update candidate with parsed resume
    const { error: updateError } = await supabase
      .from("candidates")
      .update({
        resume_parsed: parsedResume,
        status: "intake_complete",
      })
      .eq("id", candidate_id)
      .eq("recruiter_id", user.id);

    if (updateError) {
      throw updateError;
    }

    // Generate skill signals from resume
    const skillSignals = parsedResume.skills.map((skill) => ({
      candidate_id,
      skill_name: skill,
      proficiency_level: 0.6, // Default from resume
      evidence_sources: ["resume"],
      confidence: 0.7,
      recency_score: 0.8,
      depth_indicators: [],
    }));

    if (skillSignals.length > 0) {
      await supabase.from("skill_signals").insert(skillSignals);
    }

    return NextResponse.json({
      success: true,
      parsed: parsedResume,
      skills_extracted: skillSignals.length,
    });
  } catch (error) {
    console.error("Resume parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
