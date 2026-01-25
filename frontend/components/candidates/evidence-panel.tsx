"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Github, Code2, MessageSquare } from "lucide-react";
import type { Candidate, CRIScore } from "@/lib/types";
import { ScreeningManager } from "./screening-manager";

interface EvidencePanelProps {
  candidate: Candidate;
  criScore: CRIScore | null;
}

export function EvidencePanel({ candidate, criScore }: EvidencePanelProps) {
  const hasResume = !!candidate.resume_parsed;
  const hasGithub = !!candidate.github_data;
  const hasLeetcode = !!candidate.leetcode_data;
  const hasQuestionnaire =
    candidate.questionnaire_responses &&
    candidate.questionnaire_responses.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence & Explanations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={hasResume ? "resume" : hasGithub ? "github" : "explanations"}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="resume" disabled={!hasResume}>
              <FileText className="w-4 h-4 mr-2" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="github" disabled={!hasGithub}>
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="leetcode" disabled={!hasLeetcode}>
              <Code2 className="w-4 h-4 mr-2" />
              LeetCode
            </TabsTrigger>
            <TabsTrigger value="questionnaire">
              <MessageSquare className="w-4 h-4 mr-2" />
              Responses
            </TabsTrigger>
            <TabsTrigger value="explanations" disabled={!criScore}>
              Explanations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-4">
            {candidate.resume_parsed ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {candidate.resume_parsed.summary}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Experience
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {candidate.resume_parsed.experience_years} years of experience
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Skills ({candidate.resume_parsed.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.resume_parsed.skills.slice(0, 20).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                {candidate.resume_parsed.work_history && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Work History
                    </h4>
                    <div className="space-y-2">
                      {candidate.resume_parsed.work_history
                        .slice(0, 3)
                        .map((job, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-muted/50 border border-border"
                          >
                            <div className="font-medium text-foreground">
                              {job.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {job.company} -{" "}
                              {Math.round(job.duration_months / 12)} years
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No resume data available.
              </p>
            )}
          </TabsContent>

          <TabsContent value="github" className="mt-4">
            {candidate.github_data ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-foreground">
                      {candidate.github_data.total_repos}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Repositories
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-foreground">
                      {candidate.github_data.total_stars}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Stars
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-foreground">
                      {candidate.github_data.total_commits_last_year}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Commits (Last Year)
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(candidate.github_data.languages)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 10)
                        .map(([lang, count]) => (
                          <Badge key={lang} variant="outline">
                            {lang} ({count})
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-lg font-semibold text-foreground">
                      {Math.round(candidate.github_data.recent_activity_score * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Recent Activity Score
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-lg font-semibold text-foreground">
                      {Math.round(candidate.github_data.collaboration_score * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Collaboration Score
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No GitHub data available.
              </p>
            )}
          </TabsContent>

          <TabsContent value="leetcode" className="mt-4">
            {candidate.leetcode_data ? (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-2xl font-bold text-foreground">
                      {/* Handle nested (new) or flat (old) structure */}
                      {(candidate.leetcode_data as any).profile_overview?.total_solved ?? candidate.leetcode_data.total_solved ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Problems Solved
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
                    <div className="text-2xl font-bold text-chart-2">
                      {(candidate.leetcode_data as any).profile_overview?.easy_solved ?? candidate.leetcode_data.easy_solved ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Easy</div>
                  </div>

                  <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
                    <div className="text-2xl font-bold text-chart-3">
                      {(candidate.leetcode_data as any).profile_overview?.medium_solved ?? candidate.leetcode_data.medium_solved ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Medium</div>
                  </div>

                  <div className="p-4 rounded-lg bg-chart-5/10 border border-chart-5/20">
                    <div className="text-2xl font-bold text-chart-5">
                      {(candidate.leetcode_data as any).profile_overview?.hard_solved ?? candidate.leetcode_data.hard_solved ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Hard</div>
                  </div>

                  {/* Hiring Signal / Trend */}
                  <div className="p-4 rounded-lg bg-muted/50 border border-border col-span-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Hiring Signal
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {(candidate.leetcode_data as any).hiring_signal ?? "Analyzing..."}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Consistency
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                          {(candidate.leetcode_data as any).consistency_analysis?.activity_pattern ??
                            (candidate.leetcode_data.problem_progression || "Unknown")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis (if available) */}
                {(candidate.leetcode_data as any).difficulty_depth && (
                  <div className="bg-muted p-4 rounded-md text-sm space-y-2">
                    <div className="font-semibold text-foreground flex justify-between">
                      <span>Topic Coverage</span>
                      <span>{(candidate.leetcode_data as any).topic_coverage?.interpretation}</span>
                    </div>
                    <div className="font-semibold text-foreground flex justify-between">
                      <span>Depth</span>
                      <span>{(candidate.leetcode_data as any).difficulty_depth?.interpretation}</span>
                    </div>
                    {(candidate.leetcode_data as any).contest_performance?.contest_score !== "Not Available" && (
                      <div className="font-semibold text-foreground flex justify-between">
                        <span>Contest Rating</span>
                        <span>{(candidate.leetcode_data as any).contest_performance?.rating ?? "N/A"}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No LeetCode data available.
              </p>
            )}
          </TabsContent>

          <TabsContent value="questionnaire" className="mt-4">
            <ScreeningManager candidate={candidate} />
          </TabsContent>

          <TabsContent value="explanations" className="mt-4">
            {criScore?.explanations ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Overall Assessment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {criScore.explanations.overall_summary}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Technical Readiness
                    </h4>
                    <p className="text-sm text-foreground">
                      {criScore.explanations.technical_readiness}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Problem Solving
                    </h4>
                    <p className="text-sm text-foreground">
                      {criScore.explanations.problem_solving_consistency}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Learning & Growth
                    </h4>
                    <p className="text-sm text-foreground">
                      {criScore.explanations.learning_growth}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Work Discipline
                    </h4>
                    <p className="text-sm text-foreground">
                      {criScore.explanations.work_discipline}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run analysis to generate explanations.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
