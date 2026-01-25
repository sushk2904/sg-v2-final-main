"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, AlertCircle } from "lucide-react";
import type { AlignmentScore, Role, Organization } from "@/lib/types";

interface AlignmentHeatmapProps {
  alignmentScore: AlignmentScore;
  role: Role | null;
  organization: Organization | null;
}

const alignmentCategoryColors: Record<string, string> = {
  high: "bg-chart-2/20 text-chart-2",
  medium: "bg-chart-3/20 text-chart-3",
  low: "bg-chart-5/20 text-chart-5",
};

const alignmentCategoryLabels: Record<string, string> = {
  high: "High Alignment",
  medium: "Medium Alignment",
  low: "Low Alignment",
};

export function AlignmentHeatmap({
  alignmentScore,
  role,
  organization,
}: AlignmentHeatmapProps) {
  const getAlignmentColor = (value: number) => {
    if (value >= 0.75) return "bg-chart-2";
    if (value >= 0.45) return "bg-chart-3";
    return "bg-chart-5";
  };

  const getAlignmentBg = (value: number) => {
    if (value >= 0.75) return "bg-chart-2/20";
    if (value >= 0.45) return "bg-chart-3/20";
    return "bg-chart-5/20";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Alignment Analysis
          </CardTitle>
          <Badge
            className={alignmentCategoryColors[alignmentScore.alignment_category]}
            variant="secondary"
          >
            {alignmentCategoryLabels[alignmentScore.alignment_category]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${getAlignmentBg(alignmentScore.role_alignment.overall)}`}>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(alignmentScore.role_alignment.overall * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Role Alignment
              {role && <span className="block text-xs">{role.title}</span>}
            </div>
          </div>
          <div className={`p-4 rounded-lg ${getAlignmentBg(alignmentScore.org_alignment.overall)}`}>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(alignmentScore.org_alignment.overall * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Culture Alignment
              {organization && (
                <span className="block text-xs">{organization.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Dimension heatmap */}
        <div className="space-y-4">
          {/* Role alignment dimensions */}
          {alignmentScore.role_alignment.dimensions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Role Fit
              </p>
              <div className="grid grid-cols-2 gap-2">
                {alignmentScore.role_alignment.dimensions.map((dim) => (
                  <div
                    key={dim.name}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <span className="text-sm text-foreground">{dim.name}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-2 rounded-full ${getAlignmentColor(
                          dim.alignment_score
                        )}`}
                      />
                      <span className="text-xs font-medium w-10 text-right">
                        {Math.round(dim.alignment_score * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Org alignment dimensions */}
          {alignmentScore.org_alignment.dimensions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Culture Fit
              </p>
              <div className="grid grid-cols-2 gap-2">
                {alignmentScore.org_alignment.dimensions.map((dim) => (
                  <div
                    key={dim.name}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <span className="text-sm text-foreground">{dim.name}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-2 rounded-full ${getAlignmentColor(
                          dim.alignment_score
                        )}`}
                      />
                      <span className="text-xs font-medium w-10 text-right">
                        {Math.round(dim.alignment_score * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Strengths and gaps */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          {alignmentScore.key_strengths.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm font-medium text-chart-2">
                <CheckCircle className="w-4 h-4" />
                Key Strengths
              </div>
              <ul className="space-y-1">
                {alignmentScore.key_strengths.map((strength) => (
                  <li
                    key={strength}
                    className="text-sm text-muted-foreground pl-5"
                  >
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {alignmentScore.potential_gaps.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm font-medium text-chart-5">
                <AlertCircle className="w-4 h-4" />
                Potential Gaps
              </div>
              <ul className="space-y-1">
                {alignmentScore.potential_gaps.map((gap) => (
                  <li key={gap} className="text-sm text-muted-foreground pl-5">
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
