/**
 * AlignmentHeatmap Component
 * Shows work-context compatibility between candidate and role/organization
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AlignmentDimension {
    name: string;
    candidate_value: number; // 0-1
    target_value: number; // 0-1
    alignment_score: number; // 0-1
}

interface AlignmentData {
    dimensions: AlignmentDimension[];
}

interface AlignmentHeatmapProps {
    alignmentData: AlignmentData | null;
    title?: string;
    isLoading?: boolean;
}

export function AlignmentHeatmap({
    alignmentData,
    title = "Work Context Alignment",
    isLoading = false,
}: AlignmentHeatmapProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        );
    }

    if (!alignmentData || alignmentData.dimensions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
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
                            Alignment analysis requires completed questionnaire
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getAlignmentColor = (score: number): string => {
        if (score >= 0.75) return 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]';
        if (score >= 0.45) return 'bg-blue-500/10 border-blue-500/50 text-blue-400 font-medium';
        return 'bg-amber-500/10 border-amber-500/50 text-amber-500';
    };

    const getAlignmentLabel = (score: number): string => {
        if (score >= 0.75) return 'High';
        if (score >= 0.45) return 'Medium';
        return 'Low';
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <p className="text-sm">
                                    Alignment shows compatibility between candidate work preferences
                                    and role/organization characteristics. Computed as 1 - |candidate - target|.
                                    Green (≥0.75) = High, Yellow (0.45-0.74) = Medium, Orange (&lt;0.45) = Low.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {alignmentData.dimensions.map((dimension, index) => (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger className="w-full">
                                    <div className="space-y-2">
                                        {/* Dimension Name and Alignment Label */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{dimension.name}</span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getAlignmentColor(dimension.alignment_score)}`}
                                            >
                                                {getAlignmentLabel(dimension.alignment_score)} ({Math.round(dimension.alignment_score * 100)}%)
                                            </span>
                                        </div>

                                        {/* Visual Bar Comparison */}
                                        <div className="relative h-8 bg-muted rounded-md overflow-hidden">
                                            {/* Candidate Bar */}
                                            <div
                                                className="absolute top-0 left-0 h-4 bg-blue-500/40 border-r-2 border-blue-500"
                                                style={{ width: `${dimension.candidate_value * 100}%` }}
                                            />
                                            {/* Target Bar */}
                                            <div
                                                className="absolute bottom-0 left-0 h-4 bg-purple-500/40 border-r-2 border-purple-500"
                                                style={{ width: `${dimension.target_value * 100}%` }}
                                            />
                                        </div>

                                        {/* Legend */}
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded-sm bg-blue-500/40 border border-blue-500" />
                                                <span>Candidate: {Math.round(dimension.candidate_value * 100)}%</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded-sm bg-purple-500/40 border border-purple-500" />
                                                <span>Target: {Math.round(dimension.target_value * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">{dimension.name}</p>
                                        <p className="text-xs">
                                            Candidate preference: {Math.round(dimension.candidate_value * 100)}%
                                        </p>
                                        <p className="text-xs">
                                            Role/Org target: {Math.round(dimension.target_value * 100)}%
                                        </p>
                                        <p className="text-xs mt-2">
                                            Alignment score of {Math.round(dimension.alignment_score * 100)}% means {getAlignmentLabel(dimension.alignment_score).toLowerCase()} compatibility for this dimension.
                                        </p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>

                {/* Advisory Note */}
                <p className="text-xs text-muted-foreground italic mt-4">
                    Alignment is advisory—cultural fit requires conversation, not just scores
                </p>
            </CardContent>
        </Card>
    );
}
