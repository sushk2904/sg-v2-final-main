"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { Loader2, Save, Building2 } from "lucide-react";
import type { Organization, WorkSignature } from "@/lib/types";

const companySizes = [
  { value: "startup", label: "Startup (1-50)" },
  { value: "small", label: "Small (50-200)" },
  { value: "medium", label: "Medium (200-1000)" },
  { value: "large", label: "Large (1000-5000)" },
  { value: "enterprise", label: "Enterprise (5000+)" },
];

const defaultWorkSignature: WorkSignature = {
  collaboration_style: 0.6,
  pace_preference: 0.5,
  structure_level: 0.5,
  innovation_focus: 0.6,
  communication_frequency: 0.5,
  remote_compatibility: 0.7,
  mentorship_culture: 0.6,
  decision_autonomy: 0.5,
};

export default function OrganizationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [organization, setOrganization] = useState<Partial<Organization> | null>(null);
  const [workSignature, setWorkSignature] = useState<WorkSignature>(defaultWorkSignature);

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    const supabase = createClient();

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("organizations")
          .select("*")
          .eq("recruiter_id", user.id)
          .single();

        if (data) {
          setOrganization(data);
          if (data.work_signature) {
            setWorkSignature(data.work_signature as WorkSignature);
          }
        } else {
          setOrganization({ name: "", industry: "", size: null });
        }
      }
    } else {
      // Local demo mode - load from localStorage or mock
      const saved = localStorage.getItem("demo_organization");
      if (saved) {
        const data = JSON.parse(saved);
        setOrganization(data);
        if (data.work_signature) {
          setWorkSignature(data.work_signature);
        }
      } else {
        setOrganization({ name: "Demo Corp", industry: "Technology", size: "medium" });
      }
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();

    // Local demo save
    if (!supabase) {
      const orgData = {
        id: organization?.id || "demo-org-1",
        recruiter_id: "demo-user",
        name: organization?.name || "My Organization",
        industry: organization?.industry || null,
        size: organization?.size || null,
        work_signature: workSignature,
      };

      localStorage.setItem("demo_organization", JSON.stringify(orgData));
      setOrganization(orgData);
      toast.success("Organization profile saved (Local)");
      setIsSaving(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Not authenticated");
      setIsSaving(false);
      return;
    }

    try {
      const orgData = {
        recruiter_id: user.id,
        name: organization?.name || "My Organization",
        industry: organization?.industry || null,
        size: organization?.size || null,
        work_signature: workSignature,
      };

      if (organization?.id) {
        // Update existing
        const { error } = await supabase
          .from("organizations")
          .update(orgData)
          .eq("id", organization.id);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from("organizations")
          .insert(orgData)
          .select()
          .single();

        if (error) throw error;
        setOrganization(data);
      }

      toast.success("Organization profile saved");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save organization");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSignature = (key: keyof WorkSignature, value: number) => {
    setWorkSignature((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Organization Profile
          </h2>
          <p className="text-muted-foreground">
            Define your organization&apos;s work culture and environment
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            General organization details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={organization?.name || ""}
                onChange={(e) =>
                  setOrganization((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={organization?.industry || ""}
                onChange={(e) =>
                  setOrganization((prev) => ({ ...prev, industry: e.target.value }))
                }
                placeholder="Technology, Finance, Healthcare..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Company Size</Label>
            <Select
              value={organization?.size || ""}
              onValueChange={(value) =>
                setOrganization((prev) => ({
                  ...prev,
                  size: value as Organization["size"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Work Signature */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Work Signature</CardTitle>
          <CardDescription>
            Define your organization&apos;s work culture characteristics. These
            values are used to calculate candidate alignment scores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Collaboration Style</Label>
              <span className="text-sm text-muted-foreground">
                {workSignature.collaboration_style < 0.3
                  ? "Independent work"
                  : workSignature.collaboration_style < 0.7
                    ? "Balanced"
                    : "Highly collaborative"}
              </span>
            </div>
            <Slider
              value={[workSignature.collaboration_style * 100]}
              onValueChange={([val]) => updateSignature("collaboration_style", val / 100)}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              How much team collaboration is expected vs. independent work
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Pace Preference</Label>
              <span className="text-sm text-muted-foreground">
                {workSignature.pace_preference < 0.3
                  ? "Steady pace"
                  : workSignature.pace_preference < 0.7
                    ? "Moderate"
                    : "Fast-paced"}
              </span>
            </div>
            <Slider
              value={[workSignature.pace_preference * 100]}
              onValueChange={([val]) => updateSignature("pace_preference", val / 100)}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              Overall work pace and urgency level
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Structure Level</Label>
              <span className="text-sm text-muted-foreground">
                {workSignature.structure_level < 0.3
                  ? "Flexible/Agile"
                  : workSignature.structure_level < 0.7
                    ? "Balanced"
                    : "Highly structured"}
              </span>
            </div>
            <Slider
              value={[workSignature.structure_level * 100]}
              onValueChange={([val]) => updateSignature("structure_level", val / 100)}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              How much process and structure exists
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Innovation Focus</Label>
              <span className="text-sm text-muted-foreground">
                {workSignature.innovation_focus < 0.3
                  ? "Operational"
                  : workSignature.innovation_focus < 0.7
                    ? "Balanced"
                    : "Innovation-driven"}
              </span>
            </div>
            <Slider
              value={[workSignature.innovation_focus * 100]}
              onValueChange={([val]) => updateSignature("innovation_focus", val / 100)}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              Focus on innovation vs. operational excellence
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Communication Frequency</Label>
              <span className="text-sm text-muted-foreground">
                {workSignature.communication_frequency < 0.3
                  ? "Async-first"
                  : workSignature.communication_frequency < 0.7
                    ? "Balanced"
                    : "Synchronous"}
              </span>
            </div>
            <Slider
              value={[workSignature.communication_frequency * 100]}
              onValueChange={([val]) => updateSignature("communication_frequency", val / 100)}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              Preference for async vs. real-time communication
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Remote Compatibility</Label>
              <span className="text-sm text-muted-foreground">
                {workSignature.remote_compatibility < 0.3
                  ? "Office-first"
                  : workSignature.remote_compatibility < 0.7
                    ? "Hybrid"
                    : "Remote-first"}
              </span>
            </div>
            <Slider
              value={[workSignature.remote_compatibility * 100]}
              onValueChange={([val]) => updateSignature("remote_compatibility", val / 100)}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              Support for remote work arrangements
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Mentorship Culture</Label>
              <span className="text-sm text-muted-foreground">
                {workSignature.mentorship_culture < 0.3
                  ? "Self-directed"
                  : workSignature.mentorship_culture < 0.7
                    ? "Moderate support"
                    : "Strong mentorship"}
              </span>
            </div>
            <Slider
              value={[workSignature.mentorship_culture * 100]}
              onValueChange={([val]) => updateSignature("mentorship_culture", val / 100)}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              Level of mentorship and guidance provided
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Decision Autonomy</Label>
              <span className="text-sm text-muted-foreground">
                {workSignature.decision_autonomy < 0.3
                  ? "Hierarchical"
                  : workSignature.decision_autonomy < 0.7
                    ? "Balanced"
                    : "High autonomy"}
              </span>
            </div>
            <Slider
              value={[workSignature.decision_autonomy * 100]}
              onValueChange={([val]) => updateSignature("decision_autonomy", val / 100)}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              Level of autonomy in decision-making
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
