"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { RecruiterDashboardStats } from "@/lib/types";
import {
  Users,
  Clock,
  FileQuestion,
  CheckCircle,
  TrendingUp,
  Target,
} from "lucide-react";

interface DashboardStatsProps {
  stats: RecruiterDashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: "Total Candidates",
      value: stats.total_candidates,
      icon: Users,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Pending Intake",
      value: stats.pending_intake,
      icon: Clock,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Awaiting Response",
      value: stats.awaiting_questionnaire,
      icon: FileQuestion,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      label: "Analyzed",
      value: stats.analyzed,
      icon: CheckCircle,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Average CRI",
      value: `${(stats.average_cri * 100).toFixed(0)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "High Alignment",
      value: stats.high_alignment_count,
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
