"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, ChevronRight, Settings } from "lucide-react";
import type { Role } from "@/lib/types";

interface RolesListProps {
  roles: Role[];
}

const seniorityColors: Record<string, string> = {
  junior: "bg-chart-3/20 text-chart-3",
  mid: "bg-chart-1/20 text-chart-1",
  senior: "bg-chart-2/20 text-chart-2",
  lead: "bg-chart-4/20 text-chart-4",
  principal: "bg-primary/20 text-primary",
  executive: "bg-accent/20 text-accent",
};

export function RolesList({ roles }: RolesListProps) {
  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No roles defined
        </h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Create role profiles to enable alignment scoring for candidates.
        </p>
        <Button asChild>
          <Link href="/dashboard/roles/new">Create Your First Role</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <Card key={role.id} className="group hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{role.title}</CardTitle>
                {role.department && (
                  <p className="text-sm text-muted-foreground">{role.department}</p>
                )}
              </div>
              {role.seniority_level && (
                <Badge
                  className={seniorityColors[role.seniority_level] || "bg-muted"}
                  variant="secondary"
                >
                  {role.seniority_level}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skills */}
            {role.required_skills && role.required_skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {role.required_skills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {role.required_skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.required_skills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Environment preview */}
            {role.role_environment && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{role.role_environment.team_size} team</span>
                </div>
                {role.role_environment.customer_facing > 0.5 && (
                  <span>Customer-facing</span>
                )}
                {role.role_environment.leadership_expected > 0.5 && (
                  <span>Leadership</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/roles/${role.id}/edit`}>
                  <Settings className="w-4 h-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/roles/${role.id}`}>
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
