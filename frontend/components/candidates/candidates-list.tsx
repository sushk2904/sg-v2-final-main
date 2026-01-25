"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  MoreHorizontal,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
} from "lucide-react";
import { useState } from "react";

interface CandidateWithScores {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  github_username: string | null;
  leetcode_username: string | null;
  roles?: { id: string; title: string } | null;
  cri_scores?: { overall_cri: number; confidence_level: number; readiness_trend: string }[] | null;
  alignment_scores?: { overall_alignment: number; alignment_category: string }[] | null;
}

interface CandidatesListProps {
  candidates: CandidateWithScores[];
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

const alignmentColors: Record<string, string> = {
  high: "text-chart-2",
  medium: "text-chart-3",
  low: "text-chart-5",
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "improving") return <TrendingUp className="w-4 h-4 text-chart-2" />;
  if (trend === "declining") return <TrendingDown className="w-4 h-4 text-chart-5" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

export function CandidatesList({ candidates }: CandidatesListProps) {
  const [search, setSearch] = useState("");

  const filteredCandidates = candidates.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.roles?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No candidates yet
        </h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Start building your talent pipeline by adding your first candidate for
          analysis.
        </p>
        <Button asChild>
          <Link href="/dashboard/candidates/new">Add Your First Candidate</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">CRI Score</TableHead>
              <TableHead className="text-center">Alignment</TableHead>
              <TableHead className="text-center">Trend</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) => {
              const criScore = candidate.cri_scores?.[0];
              const alignmentScore = candidate.alignment_scores?.[0];

              return (
                <TableRow key={candidate.id} className="group">
                  <TableCell>
                    <Link
                      href={`/dashboard/candidates/${candidate.id}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {candidate.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {candidate.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {candidate.email}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {candidate.roles?.title || "Unassigned"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={statusColors[candidate.status]}
                      variant="secondary"
                    >
                      {statusLabels[candidate.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {criScore ? (
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-foreground">
                          {Math.round(criScore.overall_cri * 100)}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round(criScore.confidence_level * 100)}% conf)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {alignmentScore ? (
                      <span
                        className={`font-medium capitalize ${
                          alignmentColors[alignmentScore.alignment_category]
                        }`}
                      >
                        {alignmentScore.alignment_category}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {criScore?.readiness_trend ? (
                      <div className="flex items-center justify-center">
                        <TrendIcon trend={criScore.readiness_trend} />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/candidates/${candidate.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/candidates/${candidate.id}/questionnaire`}>
                            Send Questionnaire
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/candidates/${candidate.id}/analyze`}>
                            Run Analysis
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </p>
    </div>
  );
}
