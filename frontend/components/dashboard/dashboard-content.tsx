
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { CRICard } from "@/components/CRICard";
import { SkillBarChart } from "@/components/SkillBarChart";
import { AlignmentHeatmap } from "@/components/AlignmentHeatmap";
import { EvidencePanel } from "@/components/EvidencePanel";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendBadge } from "@/components/TrendBadge";
import { Users, FileText, CheckCircle, Clock } from "lucide-react";

interface DashboardContentProps {
    stats: {
        total_candidates: number;
        pending_intake: number;
        awaiting_questionnaire: number;
        analyzed: number;
    };
    candidateData: any;
    recentCandidates: any[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export function DashboardContent({ stats, candidateData, recentCandidates }: DashboardContentProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Welcome Header */}
            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                    Recruiter Dashboard
                </h2>
                <p className="text-slate-400 mt-1 font-light">
                    AI-powered decision matrix & candidate signals
                </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Candidates</CardTitle>
                        <Users className="w-4 h-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-100">{stats.total_candidates}</div>
                        <p className="text-xs text-slate-500">Pipeline total</p>
                    </CardContent>
                </GlassCard>

                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Pending Intake</CardTitle>
                        <Clock className="w-4 h-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-100">{stats.pending_intake}</div>
                        <p className="text-xs text-slate-500">Awaiting data</p>
                    </CardContent>
                </GlassCard>

                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Questionnaire</CardTitle>
                        <FileText className="w-4 h-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-100">{stats.awaiting_questionnaire}</div>
                        <p className="text-xs text-slate-500">Candidate input</p>
                    </CardContent>
                </GlassCard>

                <GlassCard>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Analyzed</CardTitle>
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-100">{stats.analyzed}</div>
                        <p className="text-xs text-slate-500 font-medium text-cyan-400/80">Ready for review</p>
                    </CardContent>
                </GlassCard>
            </motion.div>

            {/* Main Content Area */}
            {candidateData && (
                <>
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            Featured Candidate Analysis: <span className="text-blue-300">{candidateData.candidate.full_name}</span>
                        </h3>

                        <div className="grid gap-6 lg:grid-cols-3 mb-6">
                            <div className="lg:col-span-2 transform transition-all">
                                {/* We wrap generic cards in motion div, but CRICard needs to be styled separately or accept className */}
                                <GlassCard className="h-full border-blue-500/20 bg-blue-950/10">
                                    <CRICard
                                        score={candidateData.cri_score?.overall_cri || null}
                                        confidence={candidateData.cri_score?.confidence_level >= 0.7 ? 'high' : 'medium'}
                                        trend={candidateData.cri_score?.readiness_trend}
                                        explanation={candidateData.cri_score?.explanations.overall_summary}
                                    />
                                </GlassCard>
                            </div>

                            <GlassCard>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-slate-400">Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Experience</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-white">{candidateData.candidate.resume_parsed?.experience_years || 0}</span>
                                            <span className="text-xs text-slate-400">years</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">GitHub Velocity</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-white">{candidateData.candidate.github_data?.total_commits_last_year || 0}</span>
                                            <span className="text-xs text-slate-400">commits/yr</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Readiness Trend</p>
                                        <TrendBadge trend={candidateData.cri_score?.readiness_trend || null} />
                                    </div>
                                </CardContent>
                            </GlassCard>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2 mb-6">
                            {/* Charts Section */}
                            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                                <SkillBarChart
                                    signals={candidateData.cri_score
                                        ? {
                                            technical_readiness: candidateData.cri_score.technical_readiness,
                                            problem_solving_consistency: candidateData.cri_score.problem_solving_consistency,
                                            learning_growth: candidateData.cri_score.learning_growth,
                                            work_discipline: candidateData.cri_score.work_discipline,
                                        }
                                        : null
                                    }
                                />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                                <AlignmentHeatmap
                                    alignmentData={candidateData.alignment_score?.org_alignment || null}
                                    title="Organization Alignment"
                                />
                            </motion.div>
                        </div>

                        <EvidencePanel
                            resume={candidateData.candidate.resume_parsed}
                            githubData={candidateData.candidate.github_data}
                            leetcodeData={candidateData.candidate.leetcode_data}
                        />
                    </motion.div>
                </>
            )}

            {/* Recent Candidates */}
            {recentCandidates.length > 0 && (
                <motion.div variants={itemVariants}>
                    <GlassCard>
                        <CardHeader>
                            <CardTitle className="text-slate-200">Recent Candidates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentCandidates.map((candidate) => (
                                    <div
                                        key={candidate.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                                    >
                                        <div>
                                            <p className="font-medium text-blue-100 group-hover:text-blue-300 transition-colors">{candidate.full_name}</p>
                                            <p className="text-sm text-slate-500">
                                                {(candidate.roles as any)?.title || "No role assigned"}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10 group-hover:bg-blue-500/20">{candidate.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </GlassCard>
                </motion.div>
            )}
        </motion.div>
    );
}
