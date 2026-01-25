import { createClient } from "@/lib/supabase/server";
import { CandidatesList } from "@/components/candidates/candidates-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default async function CandidatesPage() {
  const supabase = await createClient();
  let candidates: any[] = [];

  // TRY LOCAL API FIRST (Since we are using FastAPI + SQLite)
  const shouldUseLocalApi = process.env.NEXT_PUBLIC_API_URL?.includes("localhost") || process.env.NEXT_PUBLIC_API_URL?.includes("127.0.0.1");

  if (shouldUseLocalApi) {
    try {
      console.log("Fetching candidates from Local API...");
      const response = await fetch("http://127.0.0.1:8000/api/candidates/", {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      if (response.ok) {
        const data = await response.json();
        // Adapt API response to match Supabase structure if needed
        // The API returns { candidates: [...], total: ... }
        candidates = data.candidates || [];
        console.log(`Fetched ${candidates.length} candidates from Local API`);
      }
    } catch (e) {
      console.log("Failed to fetch candidates from local backend:", e);
    }
  }

  // Fallback to Supabase if Local API returned nothing and we have a client
  if (candidates.length === 0 && supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("candidates")
        .select(
          `
          *,
          roles(id, title),
          cri_scores(overall_cri, confidence_level, readiness_trend),
          alignment_scores(overall_alignment, alignment_category)
        `
        )
        .eq("recruiter_id", user.id)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        candidates = data;
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Candidates
          </h2>
          <p className="text-muted-foreground">
            Manage and analyze your candidate pipeline
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/candidates/new">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Candidate
          </Link>
        </Button>
      </div>

      {/* Candidates list */}
      <CandidatesList candidates={candidates || []} />
    </div>
  );
}
