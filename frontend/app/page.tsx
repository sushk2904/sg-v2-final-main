

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Brain,
  BarChart3,
  Shield,
  Users,
  FileText,
  GitBranch,
  Sparkles,
  CheckCircle2,
  Cpu,
  Fingerprint
} from "lucide-react"
import { NeuralBackground } from "@/components/landing/neural-background"
import { CustomCursor } from "@/components/landing/custom-cursor"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 selection:bg-cyan-500/30">
      <CustomCursor />
      <NeuralBackground />

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/20">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative w-10 h-10 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Skill Genome
            </span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
              <Link href="#features" className="hover:text-cyan-400 transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</Link>
              <Link href="#trust" className="hover:text-cyan-400 transition-colors">Trust & Safety</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold border-none shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 interactive-card">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">The Future of Hiring Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Transform Hiring with <br className="hidden md:block" />
            <span className="relative whitespace-nowrap">
              <span className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 blur-2xl opacity-20"></span>
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 animate-gradient bg-300%">
                Explainable AI
              </span>
            </span> Insights
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Analyze candidate resumes, GitHub signals, and cultural alignment with precision.
            Automated intelligence that empowers, never replaces, human decision-making.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/auth/sign-up">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-slate-950 hover:bg-slate-200 border-none interactive-card">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm interactive-card">
                View Live Demo
              </Button>
            </Link>
          </div>

          {/* Stats / Trust */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12 animate-in fade-in duration-1000 delay-500">
            {[
              { label: "Candidates Analyzed", value: "10k+" },
              { label: "Accuracy Score", value: "98%" },
              { label: "Time Saved", value: "40hrs/mo" },
              { label: "Bias Reduction", value: "Verified" }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid with Glassmorphism */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Intelligence Signals</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Comprehensive analysis designed to surface the signals that matter most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Skill Genome Analysis",
                desc: "Extracts validated technical skills from code repositories and resumes.",
                icon: Fingerprint,
                color: "text-cyan-400",
                bg: "bg-cyan-500/10"
              },
              {
                title: "Work Style Signature",
                desc: "Maps candidate preferences to your organizational culture.",
                icon: Users,
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              {
                title: "Corporate Readiness Index",
                desc: "A composite score measuring overall professional maturity.",
                icon: BarChart3,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10"
              },
              {
                title: "Explainable Insights",
                desc: "Every score comes with transparent, natural language explanations.",
                icon: FileText,
                color: "text-amber-400",
                bg: "bg-amber-500/10"
              },
              {
                title: "Bias Detection",
                desc: "Automated checks to ensure fair and equitable evaluation.",
                icon: Shield,
                color: "text-rose-400",
                bg: "bg-rose-500/10"
              },
              {
                title: "Growth Trajectory",
                desc: "Predicts future potential based on learning consistency.",
                icon: GitBranch,
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              }
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group relative p-8 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 interactive-card overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 relative z-10 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-24 bg-slate-900/30 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-sm mb-6">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                LIVE ANALYSIS
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                See Beyond the Resume with <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Deep Signals</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Traditional hiring relies on keywords. Skill Genome analyzes the vector space of candidate capabilities,
                understanding semantic relationships between skills, projects, and role requirements.
              </p>

              <ul className="space-y-4">
                {[
                  "Github Commit Frequency Analysis",
                  "Code Quality & Complexity Scoring",
                  "Cultural Fit Heatmaps",
                  "Automated Resume Parsing"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              {/* Abstract UI Mockup */}
              <div className="relative rounded-xl bg-slate-950 border border-white/10 shadow-2xl p-6 backdrop-blur-xl interactive-card">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-20"></div>

                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800" />
                    <div>
                      <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
                      <div className="h-3 w-20 bg-slate-800/50 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-cyan-500/20 rounded-full border border-cyan-500/30" />
                </div>

                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-cyan-400 to-blue-500" />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>TECHNICAL READINESS</span>
                    <span>85/100</span>
                  </div>

                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-purple-400 to-pink-500" />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>GROWTH POTENTIAL</span>
                    <span>92/100</span>
                  </div>

                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-emerald-400 to-teal-500" />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>CULTURE MATCH</span>
                    <span>78/100</span>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -right-6 -bottom-6 bg-slate-900 border border-white/10 p-4 rounded-lg shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-xs text-slate-400">AI Confidence</div>
                      <div className="text-sm font-bold text-white">High (94%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to modernize your <br />
              <span className="text-cyan-400">hiring pipeline?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join forward-thinking companies using explainable AI to find the best talent faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="h-14 px-10 text-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 border-none interactive-card shadow-[0_0_40px_rgba(34,211,238,0.3)]">
                  Get Started Now
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              No credit card required · Free 14-day trial · Cancel anytime
            </p>
          </div>
        </div>

        {/* Decorative Gradients */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none" />
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 py-12 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">Skill Genome</span>
          </div>
          <p className="text-sm text-slate-600">
            © 2026 Skill Genome Inc. Built with Responsible AI.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-cyan-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

