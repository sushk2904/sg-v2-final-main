import { DashboardContent } from "@/components/dashboard/dashboard-content";

// Force dynamic rendering to ensure real-time data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  // Default empty state
  let stats = {
    total_candidates: 0,
    pending_intake: 0,
    awaiting_questionnaire: 0,
    analyzed: 0,
  };
  let recentCandidates: any[] = [];
  let candidateData: any = null;

  try {
    // 1. Fetch Candidates List for Stats and Recent
    const candidatesRes = await fetch(`${API_URL}/candidates/?limit=100`, { cache: 'no-store' });
    if (candidatesRes.ok) {
      const data = await candidatesRes.json();
      const candidates = data.candidates || [];

      stats.total_candidates = data.total || candidates.length;
      stats.analyzed = candidates.filter((c: any) => c.status === 'analyzed').length;
      stats.pending_intake = candidates.filter((c: any) => c.status === 'pending_intake' || c.status === 'pending').length;
      stats.awaiting_questionnaire = candidates.filter((c: any) => c.status === 'questionnaire_sent').length;

      // Take top 3 for recent
      recentCandidates = candidates.slice(0, 3);

      // 2. Fetch Featured Candidate (First available or first analyzed)
      // Prefer 'analyzed' candidate for the main view
      const featured = candidates.find((c: any) => c.status === 'analyzed') || candidates[0];

      if (featured) {
        const dashboardRes = await fetch(`${API_URL}/candidates/${featured.id}/dashboard`, { cache: 'no-store' });
        if (dashboardRes.ok) {
          const dashboardData = await dashboardRes.json();
          candidateData = dashboardData;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Silent fail to empty state (or could show error)
  }

  return (
    <DashboardContent
      stats={stats}
      candidateData={candidateData}
      recentCandidates={recentCandidates}
    />
  );
}
