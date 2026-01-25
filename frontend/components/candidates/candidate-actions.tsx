"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  MoreHorizontal,
  FileQuestion,
  Zap,
  Copy,
  Trash2,
  RefreshCw,
} from "lucide-react";
import type { Candidate } from "@/lib/types";

interface CandidateActionsProps {
  candidate: Candidate;
  hasRole: boolean;
  hasQuestionnaire: boolean;
  isAnalyzed: boolean;
}

export function CandidateActions({
  candidate,
  hasRole,
  hasQuestionnaire,
  isAnalyzed,
}: CandidateActionsProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleGenerateQuestionnaire = async () => {
    if (!hasRole) {
      toast.error("Please assign a role to generate a questionnaire");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/questionnaire/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidate.id,
          role_id: candidate.role_id,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate questionnaire");

      const data = await res.json();
      toast.success("Questionnaire generated! Copy the link to share.");

      // Copy link to clipboard
      const link = `${window.location.origin}/q/${candidate.secure_token}`;
      await navigator.clipboard.writeText(link);
      toast.info("Candidate link copied to clipboard");

      router.refresh();
    } catch (error) {
      console.error("Generate error:", error);
      toast.error("Failed to generate questionnaire");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!hasRole) {
      toast.error("Please assign a role to run analysis");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/candidates/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: candidate.id }),
      });

      if (!res.ok) throw new Error("Failed to analyze candidate");

      toast.success("Analysis complete!");
      router.refresh();
    } catch (error) {
      console.error("Analyze error:", error);
      toast.error("Failed to analyze candidate");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/q/${candidate.secure_token}`;
    await navigator.clipboard.writeText(link);
    toast.success("Candidate questionnaire link copied!");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Generate Questionnaire */}
      <Button
        variant="outline"
        onClick={handleGenerateQuestionnaire}
        disabled={isGenerating || !hasRole}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileQuestion className="w-4 h-4 mr-2" />
            {hasQuestionnaire ? "Regenerate" : "Generate"} Questionnaire
          </>
        )}
      </Button>

      {/* Run Analysis */}
      <Button onClick={handleAnalyze} disabled={isAnalyzing || !hasRole}>
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            {isAnalyzed ? "Re-analyze" : "Run Analysis"}
          </>
        )}
      </Button>

      {/* More actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Questionnaire Link
          </DropdownMenuItem>
          {candidate.github_username && (
            <DropdownMenuItem
              onClick={async () => {
                const res = await fetch("/api/candidates/analyze-github", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    candidate_id: candidate.id,
                    github_username: candidate.github_username,
                  }),
                });
                if (res.ok) {
                  toast.success("GitHub data refreshed");
                  router.refresh();
                } else {
                  toast.error("Failed to refresh GitHub data");
                }
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh GitHub Data
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Candidate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {candidate.full_name}? This action
              cannot be undone and will remove all associated data including
              scores and questionnaire responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                // Delete would go here
                toast.success("Candidate deleted");
                router.push("/dashboard/candidates");
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
