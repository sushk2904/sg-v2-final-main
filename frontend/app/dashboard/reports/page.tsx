"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from "recharts"
import { Download, TrendingUp, Users, Target, Clock, Activity, FileText } from "lucide-react"

// Sample data for charts
const criDistribution = [
  { range: "0-20", count: 3, fill: "#ef4444" },
  { range: "21-40", count: 8, fill: "#f97316" },
  { range: "41-60", count: 15, fill: "#eab308" },
  { range: "61-80", count: 22, fill: "#3b82f6" },
  { range: "81-100", count: 12, fill: "#22d3ee" },
]

const skillsBreakdown = [
  { skill: "JavaScript", candidates: 45 },
  { skill: "TypeScript", candidates: 38 },
  { skill: "React", candidates: 42 },
  { skill: "Node.js", candidates: 35 },
  { skill: "Python", candidates: 28 },
  { skill: "SQL", candidates: 32 },
]

const alignmentTrend = [
  { month: "Jan", roleAlignment: 65, cultureAlignment: 72 },
  { month: "Feb", roleAlignment: 68, cultureAlignment: 70 },
  { month: "Mar", roleAlignment: 72, cultureAlignment: 75 },
  { month: "Apr", roleAlignment: 70, cultureAlignment: 78 },
  { month: "May", roleAlignment: 75, cultureAlignment: 80 },
  { month: "Jun", roleAlignment: 78, cultureAlignment: 82 },
]

const pipelineData = [
  { name: "New", value: 24, fill: "#3b82f6" },
  { name: "Screening", value: 18, fill: "#22d3ee" },
  { name: "Interview", value: 12, fill: "#8b5cf6" },
  { name: "Offer", value: 5, fill: "#ec4899" },
  { name: "Hired", value: 3, fill: "#10b981" },
]

const roleComparison = [
  { dimension: "Technical Skills", "Frontend Dev": 85, "Backend Dev": 78, "Full Stack": 82 },
  { dimension: "Problem Solving", "Frontend Dev": 72, "Backend Dev": 85, "Full Stack": 78 },
  { dimension: "Communication", "Frontend Dev": 80, "Backend Dev": 70, "Full Stack": 75 },
  { dimension: "Adaptability", "Frontend Dev": 78, "Backend Dev": 72, "Full Stack": 80 },
  { dimension: "Culture Fit", "Frontend Dev": 82, "Backend Dev": 75, "Full Stack": 78 },
]

const confidenceLevels = [
  { level: "High", count: 28, fill: "#22d3ee" },
  { level: "Medium", count: 22, fill: "#3b82f6" },
  { level: "Low", count: 10, fill: "#64748b" },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-sm font-bold text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
            {entry.name}: <span className="text-white font-mono">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-cyan-100 to-white drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
            Analytics & Reports
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Comprehensive insights into your hiring intelligence data
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-slate-900/40 border-white/10 text-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-slate-900/40 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Avg. CRI Score", value: "68.4", trend: "+4.2%", icon: TrendingUp, color: "text-cyan-400" },
          { title: "Candidates Analyzed", value: "60", trend: "+12", icon: Users, color: "text-blue-400" },
          { title: "Avg. Alignment", value: "74.2%", trend: "Role + Culture", icon: Target, color: "text-purple-400" },
          { title: "Questionnaire Rate", value: "82%", trend: "Completion rate", icon: Clock, color: "text-emerald-400" }
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900/40 border-white/5 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-xs text-slate-500">
                <span className={stat.trend.includes("+") ? "text-emerald-400" : "text-slate-500"}>{stat.trend}</span>
                {stat.trend.includes("+") ? " from last period" : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-900/60 border border-white/5 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">Overview</TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">Skills Analysis</TabsTrigger>
          <TabsTrigger value="alignment" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">Alignment</TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-900/40 border-white/5">
              <CardHeader>
                <CardTitle className="text-white">CRI Score Distribution</CardTitle>
                <CardDescription className="text-slate-400">
                  Distribution of Corporate Readiness Index scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={criDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis
                        dataKey="range"
                        stroke="#94a3b8"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar
                        dataKey="count"
                        radius={[4, 4, 0, 0]}
                      >
                        {criDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Confidence Levels</CardTitle>
                <CardDescription className="text-slate-400">
                  Signal confidence distribution based on data completeness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confidenceLevels}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        stroke="rgba(0,0,0,0)"
                      >
                        {confidenceLevels.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card className="bg-slate-900/40 border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Top Skills in Candidate Pool</CardTitle>
              <CardDescription className="text-slate-400">
                Most common skills identified from resumes and GitHub analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsBreakdown} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      stroke="#94a3b8"
                      fontSize={12}
                      width={100}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar
                      dataKey="candidates"
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    >
                      {skillsBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(200, 80%, ${50 + (index * 5)}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alignment" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-900/40 border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Alignment Trends</CardTitle>
                <CardDescription className="text-slate-400">
                  Role and culture alignment scores over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={alignmentTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke="#94a3b8"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        domain={[50, 100]}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                      <Line
                        type="monotone"
                        dataKey="roleAlignment"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
                        name="Role Alignment"
                      />
                      <Line
                        type="monotone"
                        dataKey="cultureAlignment"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        dot={{ fill: '#22d3ee', r: 4, strokeWidth: 0 }}
                        name="Culture Alignment"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Role Comparison</CardTitle>
                <CardDescription className="text-slate-400">
                  Average scores by dimension across open roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={roleComparison}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#52525b", fontSize: 10 }}
                        axisLine={false}
                      />
                      <Radar
                        name="Frontend Dev"
                        dataKey="Frontend Dev"
                        stroke="#22d3ee"
                        fill="#22d3ee"
                        fillOpacity={0.2}
                      />
                      <Radar
                        name="Backend Dev"
                        dataKey="Backend Dev"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                      <Legend />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-900/40 border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Candidate Pipeline</CardTitle>
                <CardDescription className="text-slate-400">
                  Current distribution of candidates by stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        stroke="rgba(0,0,0,0)"
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Pipeline Metrics</CardTitle>
                <CardDescription className="text-slate-400">
                  Key metrics for your hiring pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Screening Rate", value: "75%", color: "bg-blue-500" },
                  { label: "Interview Rate", value: "67%", color: "bg-purple-500" },
                  { label: "Offer Rate", value: "42%", color: "bg-pink-500" },
                  { label: "Acceptance Rate", value: "60%", color: "bg-emerald-500" },
                ].map((metric, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{metric.label}</span>
                      <span className="font-medium text-white">{metric.value}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${metric.color} rounded-full`} style={{ width: metric.value }} />
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">Avg. Time to Hire</span>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-300 border-blue-500/20">18 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
