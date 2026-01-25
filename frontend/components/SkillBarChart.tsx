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
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                                className="text-xs"
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={150}
                                className="text-xs"
                            />
                            <RechartsTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-semibold">{data.name}</span>
                                                    <span className="text-sm">{data.value}%</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {SKILL_DESCRIPTIONS[data.key as keyof typeof SKILL_DESCRIPTIONS]}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        Confidence: {Math.round(data.confidence * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                                ))}
                            </Bar>
                        </BarChart>
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
