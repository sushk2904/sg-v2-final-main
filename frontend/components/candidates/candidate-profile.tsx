"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, Code2, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Candidate, Role } from "@/lib/types";

interface CandidateProfileProps {
  candidate: Candidate;
  role: Role | null;
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

export function CandidateProfile({ candidate, role }: CandidateProfileProps) {
  return (
    <div className="flex items-start gap-4">
      <Button variant="ghost" size="icon" asChild className="mt-1">
        <Link href="/dashboard/candidates">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </Button>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary">
            {candidate.full_name.charAt(0)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {candidate.full_name}
            </h2>
            <Badge
              className={statusColors[candidate.status]}
              variant="secondary"
            >
              {statusLabels[candidate.status]}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {candidate.email}
            </div>
            {role && (
              <div className="flex items-center gap-1">
                <span className="text-foreground font-medium">{role.title}</span>
                {role.department && (
                  <span className="text-muted-foreground">
                    ({role.department})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {candidate.github_username && (
              <a
                href={`https://github.com/${candidate.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                {candidate.github_username}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {candidate.leetcode_username && (
              <a
                href={`https://leetcode.com/${candidate.leetcode_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Code2 className="w-4 h-4" />
                {candidate.leetcode_username}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
