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
} from "recharts"
import { Download, TrendingUp, Users, Target, Clock } from "lucide-react"

// Sample data for charts
const criDistribution = [
  { range: "0-20", count: 3, fill: "hsl(var(--chart-5))" },
  { range: "21-40", count: 8, fill: "hsl(var(--chart-5))" },
  { range: "41-60", count: 15, fill: "hsl(var(--chart-3))" },
  { range: "61-80", count: 22, fill: "hsl(var(--chart-2))" },
  { range: "81-100", count: 12, fill: "hsl(var(--chart-1))" },
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
  { name: "New", value: 24, fill: "hsl(var(--chart-1))" },
  { name: "Screening", value: 18, fill: "hsl(var(--chart-2))" },
  { name: "Interview", value: 12, fill: "hsl(var(--chart-3))" },
  { name: "Offer", value: 5, fill: "hsl(var(--chart-4))" },
  { name: "Hired", value: 3, fill: "hsl(var(--chart-5))" },
]

const roleComparison = [
  { dimension: "Technical Skills", "Frontend Dev": 85, "Backend Dev": 78, "Full Stack": 82 },
  { dimension: "Problem Solving", "Frontend Dev": 72, "Backend Dev": 85, "Full Stack": 78 },
  { dimension: "Communication", "Frontend Dev": 80, "Backend Dev": 70, "Full Stack": 75 },
  { dimension: "Adaptability", "Frontend Dev": 78, "Backend Dev": 72, "Full Stack": 80 },
  { dimension: "Culture Fit", "Frontend Dev": 82, "Backend Dev": 75, "Full Stack": 78 },
]

const confidenceLevels = [
  { level: "High", count: 28 },
  { level: "Medium", count: 22 },
  { level: "Low", count: 10 },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your hiring intelligence data
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. CRI Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+4.2%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Candidates Analyzed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent">+12</span> new this period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Alignment</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74.2%</div>
            <p className="text-xs text-muted-foreground">
              Role + Culture combined
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Questionnaire Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              Completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="alignment">Alignment</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>CRI Score Distribution</CardTitle>
                <CardDescription>
                  Distribution of Corporate Readiness Index scores across all candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={criDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="range" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-5" />
                    <span className="text-muted-foreground">Low (0-40)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-3" />
                    <span className="text-muted-foreground">Medium (41-60)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-1" />
                    <span className="text-muted-foreground">High (61-100)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidence Levels</CardTitle>
                <CardDescription>
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
                        label={({ level, count }) => `${level}: ${count}`}
                      >
                        <Cell fill="hsl(var(--chart-2))" />
                        <Cell fill="hsl(var(--chart-3))" />
                        <Cell fill="hsl(var(--chart-5))" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Higher confidence indicates more complete candidate data
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Skills in Candidate Pool</CardTitle>
              <CardDescription>
                Most common skills identified from resumes and GitHub analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="skill" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Bar 
                      dataKey="candidates" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alignment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alignment Trends</CardTitle>
                <CardDescription>
                  Role and culture alignment scores over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={alignmentTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        domain={[50, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="roleAlignment" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Role Alignment"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cultureAlignment" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        name="Culture Alignment"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Comparison</CardTitle>
                <CardDescription>
                  Average scores by dimension across open roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={roleComparison}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="dimension" 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      />
                      <Radar 
                        name="Frontend Dev" 
                        dataKey="Frontend Dev" 
                        stroke="hsl(var(--chart-1))" 
                        fill="hsl(var(--chart-1))" 
                        fillOpacity={0.3}
                      />
                      <Radar 
                        name="Backend Dev" 
                        dataKey="Backend Dev" 
                        stroke="hsl(var(--chart-2))" 
                        fill="hsl(var(--chart-2))" 
                        fillOpacity={0.3}
                      />
                      <Radar 
                        name="Full Stack" 
                        dataKey="Full Stack" 
                        stroke="hsl(var(--chart-3))" 
                        fill="hsl(var(--chart-3))" 
                        fillOpacity={0.3}
                      />
                      <Legend />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Pipeline</CardTitle>
                <CardDescription>
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
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline Metrics</CardTitle>
                <CardDescription>
                  Key metrics for your hiring pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Screening Rate</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-1 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interview Rate</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-2 rounded-full" style={{ width: "67%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Offer Rate</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-3 rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-4 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg. Time to Hire</span>
                    <Badge variant="secondary">18 days</Badge>
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
