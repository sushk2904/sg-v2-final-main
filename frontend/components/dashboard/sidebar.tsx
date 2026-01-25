
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import { LayoutDashboard, Users, Building2, Briefcase, Settings, BarChartBig as ChartBar, FileText, UserPlus, Sparkles } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Candidates", href: "/dashboard/candidates", icon: Users },
  { name: "Add Candidate", href: "/dashboard/candidates/new", icon: UserPlus },
  { name: "Roles", href: "/dashboard/roles", icon: Briefcase },
  { name: "Organization", href: "/dashboard/organization", icon: Building2 },
  { name: "Analytics", href: "/dashboard/reports", icon: ChartBar },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  user: User;
  profile: Profile | null;
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 relative z-20 flex flex-col h-full border-r border-white/5 bg-slate-900/20 backdrop-blur-xl transition-all duration-300">
      {/* Glow Effect Top Left */}
      <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/10 blur-[50px] pointer-events-none" />

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-white/5 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-cyan-100 tracking-tight">
            Skill Genome
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-white/5">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className="block relative group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-lg shadow-[0_0_10px_rgba(37,99,235,0.1)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-blue-100"
                  : "text-slate-400 group-hover:text-slate-200 group-hover:bg-white/5"
              )}>
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-400 drop-shadow-[0_0_5px_rgba(60,166,255,0.5)]" : "group-hover:text-blue-300")} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {profile?.full_name?.charAt(0) || "R"}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
              {profile?.full_name || "Recruiter"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {profile?.company_name || "Enterprise Access"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
