"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, User } from "lucide-react";

interface CandidateWithRole {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  roles?: { title: string } | null;
}

interface RecentCandidatesProps {
  candidates: CandidateWithRole[];
}

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  intake_complete: "bg-chart-3/20 text-chart-3",
  questionnaire_sent: "bg-chart-4/20 text-chart-4",
  questionnaire_complete: "bg-chart-1/20 text-chart-1",
  analyzed: "bg-chart-2/20 text-chart-2",
  archived: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  intake_complete: "Intake Done",
  questionnaire_sent: "Awaiting Response",
  questionnaire_complete: "Ready to Analyze",
  analyzed: "Analyzed",
  archived: "Archived",
};

export function RecentCandidates({ candidates }: RecentCandidatesProps) {
  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          No candidates yet. Start by adding your first candidate.
        </p>
        <Button asChild size="sm">
          <Link href="/dashboard/candidates/new">Add Candidate</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {candidates.map((candidate) => (
        <Link
          key={candidate.id}
          href={`/dashboard/candidates/${candidate.id}`}
          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {candidate.full_name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-card-foreground">
                {candidate.full_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {candidate.roles?.title || "No role assigned"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={statusColors[candidate.status] || statusColors.pending}
              variant="secondary"
            >
              {statusLabels[candidate.status] || "Unknown"}
            </Badge>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </Link>
      ))}

      <div className="pt-2">
        <Button variant="ghost" asChild className="w-full">
          <Link href="/dashboard/candidates">View all candidates</Link>
        </Button>
      </div>
    </div>
  );
}
