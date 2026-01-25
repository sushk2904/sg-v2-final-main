/**
 * TrendBadge Component
 * Displays readiness trajectory indicator
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendBadgeProps {
    trend: 'improving' | 'stable' | 'declining' | null;
    tooltipText?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function TrendBadge({
    trend,
    tooltipText,
    size = 'md',
}: TrendBadgeProps) {
    if (!trend) {
        return null;
    }

    const getTrendIcon = () => {
        const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
        if (trend === 'improving') return <TrendingUp className={iconSize} />;
        if (trend === 'declining') return <TrendingDown className={iconSize} />;
        return <Minus className={iconSize} />;
    };

    const getTrendColor = () => {
        if (trend === 'improving') return 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20';
        if (trend === 'declining') return 'border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20';
        return 'border-gray-500/50 bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20';
    };

    const getTrendLabel = () => {
        if (trend === 'improving') return 'Improving';
        if (trend === 'declining') return 'Declining';
        return 'Stable';
    };

    const defaultTooltip = trend === 'improving'
        ? 'Recent activity shows increasing skill diversity, consistent contributions, and learning trajectory'
        : trend === 'declining'
            ? 'Reduced recent activity or skill stagnation detected. May indicate career shift or temp inactivity.'
            : 'Steady skill maintenance with consistent activity levels';

    const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Badge
                        variant="outline"
                        className={`${getTrendColor()} ${textSize} flex items-center gap-1.5 px-2 py-1`}
                    >
                        {getTrendIcon()}
                        <span className="font-medium">{getTrendLabel()}</span>
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                        {tooltipText || defaultTooltip}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
