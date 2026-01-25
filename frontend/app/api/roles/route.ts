import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's organization
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("recruiter_id", user.id)
    .single();

  if (!org) {
    return NextResponse.json([]);
  }

  const { data: roles, error } = await supabase
    .from("roles")
    .select("id, title, department, seniority_level")
    .eq("organization_id", org.id)
    .order("title");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(roles);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Get or create organization
  let { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("recruiter_id", user.id)
    .single();

  if (!org) {
    const { data: newOrg, error: orgError } = await supabase
      .from("organizations")
      .insert({ recruiter_id: user.id, name: "My Organization" })
      .select()
      .single();

    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 500 });
    }
    org = newOrg;
  }

  const { data: role, error } = await supabase
    .from("roles")
    .insert({
      organization_id: org.id,
      title: body.title,
      department: body.department,
      seniority_level: body.seniority_level,
      required_skills: body.required_skills || [],
      preferred_skills: body.preferred_skills || [],
      role_environment: body.role_environment,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(role);
}
