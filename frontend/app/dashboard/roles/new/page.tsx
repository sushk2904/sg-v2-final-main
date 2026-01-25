"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, X, Plus } from "lucide-react";
import Link from "next/link";

const seniorityLevels = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "principal", label: "Principal" },
  { value: "executive", label: "Executive" },
];

const teamSizes = [
  { value: "solo", label: "Solo / Individual" },
  { value: "small", label: "Small (2-5)" },
  { value: "medium", label: "Medium (6-15)" },
  { value: "large", label: "Large (15+)" },
];

export default function NewRolePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    seniority_level: "",
    required_skills: [] as string[],
    preferred_skills: [] as string[],
    role_environment: {
      team_size: "small" as "solo" | "small" | "medium" | "large",
      meeting_frequency: 0.5,
      deadline_pressure: 0.5,
      cross_functional: 0.5,
      customer_facing: 0.3,
      technical_depth: 0.7,
      leadership_expected: 0.3,
    },
  });

  const addSkill = (type: "required" | "preferred") => {
    if (!skillInput.trim()) return;
    const key = type === "required" ? "required_skills" : "preferred_skills";
    if (!formData[key].includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key], skillInput.trim()],
      }));
    }
    setSkillInput("");
  };

  const removeSkill = (type: "required" | "preferred", skill: string) => {
    const key = type === "required" ? "required_skills" : "preferred_skills";
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((s) => s !== skill),
    }));
  };

  const updateEnvironment = (key: string, value: number | string) => {
    setFormData((prev) => ({
      ...prev,
      role_environment: {
        ...prev.role_environment,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create role");

      toast.success("Role created successfully");
      router.push("/dashboard/roles");
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/roles">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Create New Role
          </h2>
          <p className="text-muted-foreground">
            Define the role profile for candidate alignment scoring
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core role details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Role Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, department: e.target.value }))
                  }
                  placeholder="e.g., Engineering"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seniority">Seniority Level</Label>
              <Select
                value={formData.seniority_level}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, seniority_level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seniority level" />
                </SelectTrigger>
                <SelectContent>
                  {seniorityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
            <CardDescription>
              Skills the candidate must have for this role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type a skill and press Add"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill("required");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSkill("required")}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            {formData.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill("required", skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Environment */}
        <Card>
          <CardHeader>
            <CardTitle>Role Environment</CardTitle>
            <CardDescription>
              Define the work environment characteristics for this role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Team Size</Label>
              <Select
                value={formData.role_environment.team_size}
                onValueChange={(value) => updateEnvironment("team_size", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teamSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Meeting Frequency</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.role_environment.meeting_frequency < 0.3
                      ? "Mostly async"
                      : formData.role_environment.meeting_frequency < 0.7
                      ? "Balanced"
                      : "Frequent meetings"}
                  </span>
                </div>
                <Slider
                  value={[formData.role_environment.meeting_frequency * 100]}
                  onValueChange={([val]) =>
                    updateEnvironment("meeting_frequency", val / 100)
                  }
                  max={100}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Deadline Pressure</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.role_environment.deadline_pressure < 0.3
                      ? "Relaxed"
                      : formData.role_environment.deadline_pressure < 0.7
                      ? "Moderate"
                      : "High pressure"}
                  </span>
                </div>
                <Slider
                  value={[formData.role_environment.deadline_pressure * 100]}
                  onValueChange={([val]) =>
                    updateEnvironment("deadline_pressure", val / 100)
                  }
                  max={100}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Cross-Functional Collaboration</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.role_environment.cross_functional < 0.3
                      ? "Within team"
                      : formData.role_environment.cross_functional < 0.7
                      ? "Some collaboration"
                      : "Highly cross-functional"}
                  </span>
                </div>
                <Slider
                  value={[formData.role_environment.cross_functional * 100]}
                  onValueChange={([val]) =>
                    updateEnvironment("cross_functional", val / 100)
                  }
                  max={100}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Customer Facing</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.role_environment.customer_facing < 0.3
                      ? "Internal only"
                      : formData.role_environment.customer_facing < 0.7
                      ? "Some interaction"
                      : "Customer-facing"}
                  </span>
                </div>
                <Slider
                  value={[formData.role_environment.customer_facing * 100]}
                  onValueChange={([val]) =>
                    updateEnvironment("customer_facing", val / 100)
                  }
                  max={100}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Technical Depth Required</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.role_environment.technical_depth < 0.3
                      ? "Generalist"
                      : formData.role_environment.technical_depth < 0.7
                      ? "Moderate depth"
                      : "Deep expertise"}
                  </span>
                </div>
                <Slider
                  value={[formData.role_environment.technical_depth * 100]}
                  onValueChange={([val]) =>
                    updateEnvironment("technical_depth", val / 100)
                  }
                  max={100}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Leadership Expected</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.role_environment.leadership_expected < 0.3
                      ? "Individual contributor"
                      : formData.role_environment.leadership_expected < 0.7
                      ? "Some leadership"
                      : "Leadership role"}
                  </span>
                </div>
                <Slider
                  value={[formData.role_environment.leadership_expected * 100]}
                  onValueChange={([val]) =>
                    updateEnvironment("leadership_expected", val / 100)
                  }
                  max={100}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/roles">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Role"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
