/**
 * SkillBarChart Component
 * Visualizes skill signals using horizontal bar charts
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Cell,
    Tooltip as RechartsTooltip,
    ComposedChart,
    Line
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface SkillSignals {
    technical_readiness: number;
    problem_solving_consistency: number;
    learning_growth: number;
    work_discipline: number;
}

interface SkillBarChartProps {
    signals: SkillSignals | null;
    confidence?: Record<string, number>; // optional per-skill confidence
    isLoading?: boolean;
}

const SKILL_LABELS = {
    technical_readiness: 'Technical Readiness',
    problem_solving_consistency: 'Problem Solving',
    learning_growth: 'Learning & Growth',
    work_discipline: 'Work Discipline',
};

const SKILL_DESCRIPTIONS = {
    technical_readiness: 'Evidence of technical skills from GitHub, resume, and coding activity',
    problem_solving_consistency: 'Consistent problem-solving patterns and code quality',
    learning_growth: 'Skill development trajectory and tool diversity expansion',
    work_discipline: 'Regular contributions, project completion, and work consistency',
};

export function SkillBarChart({
    signals,
    confidence,
    isLoading = false,
}: SkillBarChartProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Skill Signals</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        );
    }

    if (!signals) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Skill Signals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <HelpCircle className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Signal unavailable
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Skill analysis pending or data insufficient
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Convert signals object to chart data
    const chartData = Object.entries(signals).map(([key, value]) => ({
        name: SKILL_LABELS[key as keyof SkillSignals],
        value: Math.round(value * 100),
        key,
        confidence: confidence?.[key] || 0.8, // default confidence
    }));

    const getBarColor = (value: number) => {
        if (value >= 75) return 'hsl(var(--chart-2))'; // High - teal/green
        if (value >= 50) return 'hsl(var(--chart-1))'; // Medium - blue
        return 'hsl(var(--chart-5))'; // Low - orange
    };

    const chartConfig = {
        value: {
            label: "Score",
            color: 'hsl(var(--chart-1))',
        },
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Skill Signals</CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <p className="text-sm">
                                    Skill signals are computed from evidence sources (GitHub, resume, LeetCode).
                                    These are advisory metrics to support your evaluation—not automated decisions.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="gradientHigh" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="gradientMedium" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="gradientLow" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={1} />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-white/10" horizontal={false} />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                                className="text-xs fill-slate-400"
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={150}
                                className="text-xs fill-slate-300 font-medium"
                                axisLine={false}
                                tickLine={false}
                            />
                            <RechartsTooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur-md p-3 shadow-xl">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-semibold text-white">{data.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-blue-400">{data.value}%</span>
                                                        <span className="text-xs text-slate-400">Score</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 max-w-[200px] leading-tight">
                                                        {SKILL_DESCRIPTIONS[data.key as keyof typeof SKILL_DESCRIPTIONS]}
                                                    </span>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500" style={{ width: `${Math.round(data.confidence * 100)}%` }} />
                                                        </div>
                                                        <span className="text-xs text-slate-500 whitespace-nowrap">
                                                            Conf: {Math.round(data.confidence * 100)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                {chartData.map((entry, index) => {
                                    let fillUrl = "url(#gradientLow)";
                                    if (entry.value >= 75) fillUrl = "url(#gradientHigh)";
                                    else if (entry.value >= 50) fillUrl = "url(#gradientMedium)";
                                    return (
                                        <Cell key={`cell-${index}`} fill={fillUrl} strokeWidth={0} />
                                    );
                                })}
                            </Bar>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#ffffff"
                                strokeWidth={2}
                                dot={{ fill: '#ffffff', r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                strokeOpacity={0.5}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Advisory Note */}
                <p className="text-xs text-muted-foreground italic mt-4">
                    Hover over bars for detailed explanations of each signal
                </p>
            </CardContent>
        </Card>
    );
}
