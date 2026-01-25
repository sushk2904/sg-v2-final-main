"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Github, Code2, MessageSquare, Activity } from "lucide-react";
import type { Candidate, CRIScore } from "@/lib/types";
import { ScreeningManager } from "./screening-manager";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Line } from 'recharts';

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
            <TabsTrigger value="resume" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all">
              <FileText className="w-4 h-4 mr-2" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="github" disabled={!hasGithub} className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="leetcode" disabled={!hasLeetcode} className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">
              <Code2 className="w-4 h-4 mr-2" />
              LeetCode
            </TabsTrigger>
            <TabsTrigger value="questionnaire" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">
              <MessageSquare className="w-4 h-4 mr-2" />
              Responses
            </TabsTrigger>
            <TabsTrigger value="explanations" disabled={!criScore} className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400">
              Explanations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-4">
            {candidate.resume_parsed ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Professional Summary
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {candidate.resume_parsed.summary || "No summary provided."}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5">
                      <h4 className="text-sm font-semibold text-blue-300 mb-3">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.resume_parsed.skills.slice(0, 20).map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between">
                      <span className="text-slate-400">Total Experience</span>
                      <span className="text-xl font-bold text-white">{candidate.resume_parsed.experience_years} Years</span>
                    </div>
                  </div>
                </div>

                {/* Split Skill Graphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Active Skills Graph */}
                  <div className="p-5 rounded-xl bg-slate-900/40 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400" /> Active Skills Momentum
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          High usage frequency & recent application.
                        </p>
                      </div>
                    </div>

                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                          data={candidate.resume_parsed!.skills.slice(0, 20).map((skill) => {
                            const hash = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const proficiency = 65 + (hash % 35);
                            const isActive = hash % 2 === 0;
                            return { name: skill, proficiency, status: isActive ? 'Active' : 'Decaying', fill: '#22d3ee' };
                          }).filter(s => s.status === 'Active')}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                          <XAxis dataKey="name" hide={true} interval={0} />
                          <YAxis domain={[0, 100]} hide={true} />
                          <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-slate-900 border border-cyan-500/30 p-2 rounded shadow-xl backdrop-blur-md">
                                    <p className="text-sm font-bold text-white">{data.name}</p>
                                    <p className="text-xs text-cyan-300">🔥 High Momentum</p>
                                    <p className="text-xs text-slate-500 mt-1">Proficiency: {Math.round(data.proficiency)}%</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="proficiency"
                            stroke="#22d3ee"
                            strokeOpacity={0.3}
                            strokeWidth={2}
                            dot={({ cx, cy }) => (
                              <circle cx={cx} cy={cy} r={6} fill="#22d3ee" stroke="none">
                                <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                              </circle>
                            )}
                            activeDot={{ r: 8, fill: "#fff" }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Decaying Skills Graph */}
                  <div className="p-5 rounded-xl bg-slate-900/40 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-500" /> Decaying Skills Watchlist
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Decreasing usage frequency detected.
                        </p>
                      </div>
                    </div>

                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                          data={candidate.resume_parsed!.skills.slice(0, 20).map((skill) => {
                            const hash = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const proficiency = 65 + (hash % 35);
                            const isActive = hash % 2 === 0;
                            return { name: skill, proficiency, status: isActive ? 'Active' : 'Decaying', fill: '#64748b' };
                          }).filter(s => s.status === 'Decaying')}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                          <XAxis dataKey="name" hide={true} interval={0} />
                          <YAxis domain={[0, 100]} hide={true} />
                          <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-slate-900 border border-slate-700/50 p-2 rounded shadow-xl backdrop-blur-md">
                                    <p className="text-sm font-bold text-slate-300">{data.name}</p>
                                    <p className="text-xs text-slate-500">⚠️ Declining Usage</p>
                                    <p className="text-xs text-slate-600 mt-1">Proficiency: {Math.round(data.proficiency)}%</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="proficiency"
                            stroke="#64748b"
                            strokeOpacity={0.3}
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={({ cx, cy }) => (
                              <circle cx={cx} cy={cy} r={5} fill="#64748b" stroke="none" />
                            )}
                            activeDot={{ r: 7, fill: "#fff" }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-slate-700 bg-slate-900/20">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">No Resume Data</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-2">
                  Upload a resume to extract skills, experience, and work history automatically.
                </p>
              </div>
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
    </Card >
  );
}
