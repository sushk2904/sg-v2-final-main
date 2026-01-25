/**
 * EvidencePanel Component
 * Displays resume, GitHub, and LeetCode evidence for skill signals
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Github, FileText, Code2, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { ResumeParsed, GitHubData, LeetCodeData } from "@/lib/types";

interface EvidencePanelProps {
    resume?: ResumeParsed | null;
    githubData?: GitHubData | null;
    leetcodeData?: LeetCodeData | null;
    isLoading?: boolean;
}

export function EvidencePanel({
    resume,
    githubData,
    leetcodeData,
    isLoading = false,
}: EvidencePanelProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        resume: false,
        github: false,
        leetcode: false,
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Evidence Sources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        );
    }

    const hasAnyEvidence = resume || githubData || leetcodeData;

    if (!hasAnyEvidence) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Evidence Sources</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No evidence data available. Candidate may not have completed intake.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Evidence Sources</CardTitle>
                <p className="text-sm text-muted-foreground">
                    All signals are backed by real evidence from these sources
                </p>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Resume Evidence */}
                {resume && (
                    <Collapsible
                        open={openSections.resume}
                        onOpenChange={() => toggleSection('resume')}
                    >
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-slate-900/30 hover:border-blue-500/30 hover:bg-blue-500/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300 group">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                    <div className="text-left">
                                        <p className="font-medium text-sm text-slate-200 group-hover:text-blue-200">Resume</p>
                                        <p className="text-xs text-slate-500 group-hover:text-slate-400">
                                            {resume.skills.length} skills, {resume.experience_years} years experience
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-500 transition-transform ${openSections.resume ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 p-3 rounded-lg border bg-muted/50">
                            <div className="space-y-3 text-sm">
                                {/* Skills */}
                                <div>
                                    <p className="font-medium mb-1">Skills Mentioned:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {resume.skills.slice(0, 10).map((skill, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {resume.skills.length > 10 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{resume.skills.length - 10} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Work History */}
                                {resume.work_history && resume.work_history.length > 0 && (
                                    <div>
                                        <p className="font-medium mb-1">Latest Position:</p>
                                        <p className="text-muted-foreground">
                                            {resume.work_history[0].title} at {resume.work_history[0].company}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {Math.round(resume.work_history[0].duration_months / 12)} years
                                        </p>
                                    </div>
                                )}

                                {/* Summary */}
                                {resume.summary && (
                                    <div>
                                        <p className="font-medium mb-1">Summary:</p>
                                        <p className="text-muted-foreground text-xs line-clamp-3">
                                            {resume.summary}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* GitHub Evidence */}
                {githubData && (
                    <Collapsible
                        open={openSections.github}
                        onOpenChange={() => toggleSection('github')}
                    >
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-slate-900/30 hover:border-blue-500/30 hover:bg-blue-500/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300 group">
                                <div className="flex items-center gap-3">
                                    <Github className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                                    <div className="text-left">
                                        <p className="font-medium text-sm text-slate-200 group-hover:text-blue-200 flex items-center gap-2">
                                            GitHub Activity
                                            <ExternalLink className="w-3 h-3 opacity-50" />
                                        </p>
                                        <p className="text-xs text-slate-500 group-hover:text-slate-400">
                                            {githubData.total_repos} repos, {githubData.total_commits_last_year} commits (12mo)
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-500 transition-transform ${openSections.github ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 p-3 rounded-lg border bg-muted/50">
                            <div className="space-y-3 text-sm">
                                {/* Languages */}
                                <div>
                                    <p className="font-medium mb-1">Top Languages:</p>
                                    <div className="space-y-1">
                                        {Object.entries(githubData.languages)
                                            .sort(([, a], [, b]) => b - a)
                                            .slice(0, 5)
                                            .map(([lang, pct]) => (
                                                <div key={lang} className="flex items-center gap-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between text-xs mb-1">
                                                            <span>{lang}</span>
                                                            <span className="text-muted-foreground">{Math.round(pct * 100)}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500"
                                                                style={{ width: `${pct * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Tools */}
                                {githubData.tool_diversity && githubData.tool_diversity.length > 0 && (
                                    <div>
                                        <p className="font-medium mb-1">Tools Used:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {githubData.tool_diversity.map((tool, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {tool}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Activity Score</p>
                                        <p className="font-semibold">{Math.round(githubData.recent_activity_score * 100)}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Collaboration</p>
                                        <p className="font-semibold">{Math.round(githubData.collaboration_score * 100)}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Streak</p>
                                        <p className="font-semibold">{githubData.contribution_streak} days</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Stars</p>
                                        <p className="font-semibold">{githubData.total_stars}</p>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* LeetCode Evidence */}
                {leetcodeData && (
                    <Collapsible
                        open={openSections.leetcode}
                        onOpenChange={() => toggleSection('leetcode')}
                    >
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-slate-900/30 hover:border-blue-500/30 hover:bg-blue-500/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300 group">
                                <div className="flex items-center gap-3">
                                    <Code2 className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
                                    <div className="text-left">
                                        <p className="font-medium text-sm text-slate-200 group-hover:text-blue-200">LeetCode</p>
                                        <p className="text-xs text-slate-500 group-hover:text-slate-400">
                                            {leetcodeData.total_solved} problems solved
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-500 transition-transform ${openSections.leetcode ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 p-3 rounded-lg border bg-muted/50">
                            <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Easy</p>
                                        <p className="font-semibold text-green-600 dark:text-green-400">
                                            {leetcodeData.easy_solved}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Medium</p>
                                        <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                                            {leetcodeData.medium_solved}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Hard</p>
                                        <p className="font-semibold text-red-600 dark:text-red-400">
                                            {leetcodeData.hard_solved}
                                        </p>
                                    </div>
                                </div>

                                {leetcodeData.problem_progression && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Progression</p>
                                        <Badge
                                            variant="outline"
                                            className={
                                                leetcodeData.problem_progression === 'improving'
                                                    ? 'text-green-700 dark:text-green-400'
                                                    : leetcodeData.problem_progression === 'declining'
                                                        ? 'text-orange-700 dark:text-orange-400'
                                                        : ''
                                            }
                                        >
                                            {leetcodeData.problem_progression}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* Evidence Source Badges */}
                <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Evidence from:</p>
                    <div className="flex flex-wrap gap-1">
                        {resume && <Badge variant="secondary" className="text-xs">Resume</Badge>}
                        {githubData && <Badge variant="secondary" className="text-xs">GitHub</Badge>}
                        {leetcodeData && <Badge variant="secondary" className="text-xs">LeetCode</Badge>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
