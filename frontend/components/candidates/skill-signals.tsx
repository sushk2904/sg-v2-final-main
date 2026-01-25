"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, FileText, Github, Code2, MessageSquare } from "lucide-react";
import type { SkillSignal } from "@/lib/types";

interface SkillSignalsProps {
  signals: SkillSignal[];
}

const sourceIcons: Record<string, typeof FileText> = {
  resume: FileText,
  github: Github,
  leetcode: Code2,
  questionnaire: MessageSquare,
};

const sourceColors: Record<string, string> = {
  resume: "bg-chart-1/20 text-chart-1",
  github: "bg-chart-2/20 text-chart-2",
  leetcode: "bg-chart-3/20 text-chart-3",
  questionnaire: "bg-chart-4/20 text-chart-4",
};

export function SkillSignals({ signals }: SkillSignalsProps) {
  if (signals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Skill Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No skill signals detected yet. Add resume or GitHub data to
              extract skills.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getProficiencyColor = (value: number) => {
    if (value >= 0.75) return "bg-chart-2";
    if (value >= 0.5) return "bg-chart-1";
    return "bg-chart-3";
  };

  const getProficiencyLabel = (value: number) => {
    if (value >= 0.75) return "Expert";
    if (value >= 0.5) return "Proficient";
    return "Familiar";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Skill Signals
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {signals.length} skills detected
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {signals.slice(0, 12).map((signal) => (
            <div
              key={signal.id || signal.skill_name}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {signal.skill_name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${signal.proficiency_level >= 0.75
                          ? "text-chart-2 border-chart-2"
                          : signal.proficiency_level >= 0.5
                            ? "text-chart-1 border-chart-1"
                            : "text-chart-3 border-chart-3"
                        }`}
                    >
                      {getProficiencyLabel(signal.proficiency_level)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {signal.evidence_sources?.map((source) => {
                      const Icon = sourceIcons[source] || FileText;
                      return (
                        <span
                          key={source}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${sourceColors[source]}`}
                        >
                          <Icon className="w-3 h-3" />
                          {source}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProficiencyColor(
                        signal.proficiency_level
                      )}`}
                      style={{ width: `${signal.proficiency_level * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {Math.round(signal.proficiency_level * 100)}%
                </span>
              </div>
            </div>
          ))}

          {signals.length > 12 && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              +{signals.length - 12} more skills
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
