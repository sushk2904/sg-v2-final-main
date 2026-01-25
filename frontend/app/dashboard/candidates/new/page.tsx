"use client";

import React from "react"

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Github,
  Code2,
  FileText,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function NewCandidatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role_id: "",
    github_username: "",
    leetcode_username: "",
    resume_text: "",
  });

  // Fetch roles
  const { data: roles } = useSWR("/api/roles", fetcher);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isParsing, setIsParsing] = useState(false);

  const submitCandidate = async (dataToSubmit: typeof formData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/candidates/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: dataToSubmit.full_name,
          email: dataToSubmit.email,
          github_username: dataToSubmit.github_username || null,
          leetcode_username: dataToSubmit.leetcode_username || null,
          role_id: dataToSubmit.role_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.detail || "Failed to create candidate";

        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.map((err: any) => err.msg || JSON.stringify(err)).join(", ");
        }

        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      toast.success("Candidate added successfully");
      router.push(`/dashboard/candidates/${data.id}`);
    } catch (error: any) {
      console.error("Error creating candidate:", error);
      toast.error(error.message || "Failed to create candidate");
      setIsLoading(false);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsParsing(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/candidates/parse-resume", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Failed to parse resume");

      const data = await res.json();

      const newData = {
        ...formData,
        resume_text: data.resume_text || formData.resume_text,
        github_username: data.github_username || formData.github_username,
        leetcode_username: data.leetcode_username || formData.leetcode_username,
        full_name: data.full_name || formData.full_name || "Unknown Candidate",
        email: data.email || formData.email
      };

      setFormData(newData);

      if (newData.email) {
        toast.success("Resume parsed! Please review and submit.");
        // Auto-submit removed to allow review
        // await submitCandidate(newData);
      } else {
        toast.warning("Resume parsed. Please check details.");
      }

    } catch (err) {
      console.error(err);
      toast.error("Error parsing resume");
      setIsParsing(false);
    } finally {
      // Note: We don't verify isParsing=false here if we redirected, 
      // but in the error case we handled it. 
      // If we *DID NOT* redirect (no auto submit), we must set it false.
      // We can just set it true at start, and false if logic falls through.
      setIsParsing(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCandidate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/candidates">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Add New Candidate
          </h2>
          <p className="text-muted-foreground">
            Enter candidate details and data sources for analysis
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Resume</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </TabsTrigger>
            <TabsTrigger value="leetcode" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">LeetCode</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential candidate details and role assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role_id">Assign to Role</Label>
                  <Select
                    value={formData.role_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map((role: { id: string; title: string }) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Assign a role to enable alignment scoring. You can create
                    roles in the Roles section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle>Resume / CV</CardTitle>
                <CardDescription>
                  Paste the candidate&apos;s resume text for AI-powered skill
                  extraction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resume_file">Upload Resume (PDF)</Label>
                  <Input
                    id="resume_file"
                    type="file"
                    accept=".pdf"
                    onChange={onFileChange}
                    disabled={isParsing}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a PDF resume to automatically extract text and detect GitHub / LeetCode profiles.
                    {isParsing && <span className="ml-2 text-cyan-500 animate-pulse font-medium">Scanning...</span>}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      OR Paste Resume Text
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume_text">Resume Content</Label>
                  <Textarea
                    id="resume_text"
                    name="resume_text"
                    value={formData.resume_text}
                    onChange={handleInputChange}
                    placeholder="Paste the full resume text here...
The AI will extract:
- Skills and technologies
- Work experience
- Education
- Certifications"
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: The text above is automatically populated when you upload a PDF.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Profile</CardTitle>
                <CardDescription>
                  Connect GitHub for activity analysis and skill verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github_username">GitHub Username</Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input text-muted-foreground text-sm">
                      github.com/
                    </span>
                    <Input
                      id="github_username"
                      name="github_username"
                      value={formData.github_username}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium text-card-foreground">
                    What we analyze:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>- Repository activity and contribution patterns</li>
                    <li>- Programming languages and technology stack</li>
                    <li>- Collaboration indicators (PRs, issues, reviews)</li>
                    <li>- Recent activity and consistency</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leetcode">
            <Card>
              <CardHeader>
                <CardTitle>LeetCode Profile</CardTitle>
                <CardDescription>
                  Connect LeetCode for problem-solving assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leetcode_username">LeetCode Username</Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input text-muted-foreground text-sm">
                      leetcode.com/
                    </span>
                    <Input
                      id="leetcode_username"
                      name="leetcode_username"
                      value={formData.leetcode_username}
                      onChange={handleInputChange}
                      placeholder="username"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium text-card-foreground">
                    What we analyze:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>- Problem difficulty distribution</li>
                    <li>- Consistency and progression patterns</li>
                    <li>- Contest participation and ratings</li>
                    <li>- Topic coverage and strengths</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" asChild>
            <Link href="/dashboard/candidates">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? "Creating..." : "Create Candidate"}
          </Button>
        </div>

      </form>
    </div>
  );
}
