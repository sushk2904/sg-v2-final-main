import { createClient } from "@/lib/supabase/server";
import { RolesList } from "@/components/roles/roles-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function RolesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get organization
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("recruiter_id", user?.id)
    .single();

  let roles = [];
  if (org) {
    const { data } = await supabase
      .from("roles")
      .select("*")
      .eq("organization_id", org.id)
      .order("created_at", { ascending: false });
    roles = data || [];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Roles
          </h2>
          <p className="text-muted-foreground">
            Define role profiles for candidate alignment scoring
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/roles/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Link>
        </Button>
      </div>

      {/* Roles list */}
      <RolesList roles={roles} />
    </div>
  );
}
