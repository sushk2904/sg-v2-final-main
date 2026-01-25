"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface CRIScore {
  id: string;
  overall_cri: number;
  candidates?: { full_name: string } | null;
}

interface CRIOverviewProps {
  scores: CRIScore[];
}

export function CRIOverview({ scores }: CRIOverviewProps) {
  if (scores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">
          No CRI scores available yet. Analyze candidates to see their readiness
          scores.
        </p>
      </div>
    );
  }

  const chartData = scores.map((score) => ({
    name: score.candidates?.full_name?.split(" ")[0] || "Candidate",
    cri: Math.round(score.overall_cri * 100),
  }));

  const getBarColor = (value: number) => {
    if (value >= 75) return "var(--chart-2)"; // High - teal
    if (value >= 50) return "var(--chart-1)"; // Medium - blue
    return "var(--chart-5)"; // Low - orange/red
  };

  const chartConfig = {
    cri: {
      label: "CRI Score",
      color: "var(--chart-1)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            className="text-xs fill-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="text-xs fill-muted-foreground"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="cri" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.cri)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
