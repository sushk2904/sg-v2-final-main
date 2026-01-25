import React from "react"
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // If Supabase is not configured, use mock data for development
  // Using 'any' type to allow mock objects in development mode
  let user: any = null;
  let profile: any = null;

  if (supabase) {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      redirect("/auth/login");
    }

    user = authUser;

    // Fetch user profile
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data;
  } else {
    // Development mode without Supabase - use mock user
    user = {
      id: "dev-user-001",
      email: "dev@skillgenome.local",
      user_metadata: { full_name: "Development User" }
    };
    profile = {
      id: "dev-user-001",
      full_name: "Development User",
      role: "recruiter"
    };
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar user={user} profile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
