/**
 * CRICard Component
 * Displays the Corporate Readiness Index with confidence and trend indicators
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CRICardProps {
    score: number | null; // 0-1 scale
    confidence: 'low' | 'medium' | 'high' | null;
    trend: 'improving' | 'stable' | 'declining' | null;
    explanation: string | null;
    isLoading?: boolean;
}

export function CRICard({
    score,
    confidence,
    trend,
    explanation,
    isLoading = false,
}: CRICardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Corporate Readiness Index</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
        );
    }

    if (score === null) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Corporate Readiness Index</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <HelpCircle className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Signal unavailable
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Candidate analysis pending or incomplete
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const scorePercentage = Math.round(score * 100);
    const getTrendIcon = () => {
        if (trend === 'improving') return <TrendingUp className="w-4 h-4" />;
        if (trend === 'declining') return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getTrendColor = () => {
        if (trend === 'improving') return 'text-green-600 dark:text-green-400';
        if (trend === 'declining') return 'text-orange-600 dark:text-orange-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const getScoreColor = () => {
        if (score >= 0.75) return 'text-green-600 dark:text-green-400';
        if (score >= 0.50) return 'text-blue-600 dark:text-blue-400';
        return 'text-orange-600 dark:text-orange-400';
    };

    const getConfidenceBadge = () => {
        const variants: Record<string, "default" | "secondary" | "outline"> = {
            high: 'default',
            medium: 'secondary',
            low: 'outline',
        };
        return confidence ? variants[confidence] : 'outline';
    };

    return (
        <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Corporate Readiness Index
                </CardTitle>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                            <p className="text-sm">
                                {explanation ||
                                    "CRI combines technical readiness, problem-solving consistency, learning growth, work discipline, and context alignment into a single advisory score. This is not a hiring decision—use it as one input among many."}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Score Display */}
                    <div className="flex items-baseline gap-2">
                        <div className={`text-5xl font-bold ${getScoreColor()}`}>
                            {scorePercentage}
                        </div>
                        <div className="text-muted-foreground text-sm">/100</div>
                    </div>

                    {/* Confidence and Trend Badges */}
                    <div className="flex items-center gap-2">
                        {confidence && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant={getConfidenceBadge()}>
                                            {confidence} confidence
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            Confidence level indicates how much evidence supports this score.
                                            Higher confidence comes from more data sources.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {trend && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant="outline" className={getTrendColor()}>
                                            <span className="flex items-center gap-1">
                                                {getTrendIcon()}
                                                {trend}
                                            </span>
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            Readiness trend based on recent activity, tool diversity growth,
                                            and skill development trajectory.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    {/* Advisory Note */}
                    <p className="text-xs text-muted-foreground italic">
                        Advisory signal only—consider alongside interview, references, and other factors
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
