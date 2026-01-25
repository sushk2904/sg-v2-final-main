"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CRIScore } from "@/lib/types";

interface CRIDashboardProps {
  criScore: CRIScore;
}

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "improving")
    return <TrendingUp className="w-5 h-5 text-chart-2" />;
  if (trend === "declining")
    return <TrendingDown className="w-5 h-5 text-chart-5" />;
  return <Minus className="w-5 h-5 text-muted-foreground" />;
};

const trendLabels: Record<string, string> = {
  improving: "Improving",
  stable: "Stable",
  declining: "Declining",
};

const trendColors: Record<string, string> = {
  improving: "text-chart-2",
  stable: "text-muted-foreground",
  declining: "text-chart-5",
};

export function CRIDashboard({ criScore }: CRIDashboardProps) {
  const criPercent = Math.round(criScore.overall_cri * 100);
  const confidencePercent = Math.round(criScore.confidence_level * 100);

  const getCRIColor = (value: number) => {
    if (value >= 0.75) return "text-chart-2";
    if (value >= 0.5) return "text-chart-1";
    return "text-chart-5";
  };

  const getCRILabel = (value: number) => {
    if (value >= 0.75) return "High Readiness";
    if (value >= 0.5) return "Moderate Readiness";
    return "Developing";
  };

  const dimensions = [
    {
      label: "Technical Readiness",
      value: criScore.technical_readiness,
      weight: "30%",
      explanation: criScore.explanations?.technical_readiness,
    },
    {
      label: "Problem Solving",
      value: criScore.problem_solving_consistency,
      weight: "20%",
      explanation: criScore.explanations?.problem_solving_consistency,
    },
    {
      label: "Learning & Growth",
      value: criScore.learning_growth,
      weight: "15%",
      explanation: criScore.explanations?.learning_growth,
    },
    {
      label: "Work Discipline",
      value: criScore.work_discipline,
      weight: "15%",
      explanation: criScore.explanations?.work_discipline,
    },
    {
      label: "Context Alignment",
      value: criScore.context_alignment,
      weight: "20%",
      explanation: criScore.explanations?.context_alignment,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Corporate Readiness Index (CRI)
          </CardTitle>
          <Badge variant="outline" className={trendColors[criScore.readiness_trend]}>
            <TrendIcon trend={criScore.readiness_trend} />
            <span className="ml-1">{trendLabels[criScore.readiness_trend]}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Main CRI Score */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-muted/50 border border-border">
            <div className={`text-5xl font-bold ${getCRIColor(criScore.overall_cri)}`}>
              {criPercent}%
            </div>
            <div className="text-sm font-medium text-muted-foreground mt-1">
              {getCRILabel(criScore.overall_cri)}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>Confidence: {confidencePercent}%</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3.5 h-3.5" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Confidence reflects data availability. Higher confidence
                      means more evidence sources were analyzed.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Dimension breakdown */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {criScore.explanations?.overall_summary}
            </p>

            <div className="space-y-3">
              {dimensions.map((dim) => (
                <div key={dim.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {dim.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({dim.weight})
                      </span>
                    </div>
                    <span className={`font-semibold ${getCRIColor(dim.value)}`}>
                      {Math.round(dim.value * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        dim.value >= 0.75
                          ? "bg-chart-2"
                          : dim.value >= 0.5
                          ? "bg-chart-1"
                          : "bg-chart-5"
                      }`}
                      style={{ width: `${dim.value * 100}%` }}
                    />
                  </div>
                  {dim.explanation && (
                    <p className="text-xs text-muted-foreground">
                      {dim.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
