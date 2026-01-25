/**
 * ConfidenceIndicator Component
 * Visual display of confidence levels for signals
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { HelpCircle } from "lucide-react";

interface ConfidenceIndicatorProps {
    level: 'low' | 'medium' | 'high' | null;
    percentage?: number; // 0-1 scale, optional
    tooltipText?: string;
    variant?: 'badge' | 'bar' | 'both';
}

export function ConfidenceIndicator({
    level,
    percentage,
    tooltipText,
    variant = 'badge',
}: ConfidenceIndicatorProps) {
    if (!level) {
        return null;
    }

    const getConfidenceColor = () => {
        if (level === 'high') return {
            badge: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
            bar: 'bg-green-500',
        };
        if (level === 'medium') return {
            badge: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
            bar: 'bg-yellow-500',
        };
        return {
            badge: 'border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400',
            bar: 'bg-orange-500',
        };
    };

    const getConfidencePercentage = (): number => {
        if (percentage !== undefined) return percentage * 100;
        // Default values if not provided
        if (level === 'high') return 85;
        if (level === 'medium') return 60;
        return 35;
    };

    const defaultTooltip = level === 'high'
        ? 'High confidence: Multiple evidence sources with recent data'
        : level === 'medium'
            ? 'Medium confidence: Moderate evidence with some data recency'
            : 'Low confidence: Limited evidence or older data points';

    const colors = getConfidenceColor();
    const percent = getConfidencePercentage();

    const BadgeComponent = (
        <Badge
            variant="outline"
            className={`${colors.badge} text-xs font-medium`}
        >
            {level} confidence
        </Badge>
    );

    const BarComponent = (
        <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium">{Math.round(percent)}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full ${colors.bar} transition-all duration-300`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );

    const content = (
        <div className="space-y-2">
            {variant === 'badge' && BadgeComponent}
            {variant === 'bar' && BarComponent}
            {variant === 'both' && (
                <>
                    {BadgeComponent}
                    <div className="mt-2">{BarComponent}</div>
                </>
            )}
        </div>
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={variant === 'bar' || variant === 'both' ? 'w-full' : ''}>
                    {content}
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Confidence Level: {level}</p>
                        <p className="text-xs">
                            {tooltipText || defaultTooltip}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Higher confidence indicates more evidence sources and recent data.
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
