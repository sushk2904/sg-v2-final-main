'use client'

import React, { useState } from "react"
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { NeuralBackground } from "@/components/landing/neural-background"
import { CustomCursor } from "@/components/landing/custom-cursor"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!supabase) {
      router.push('/dashboard')
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500/30">

      {/* 1. Interactive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950/80 z-10" />
        <NeuralBackground />
      </div>

      <CustomCursor />

      {/* 2. Ambient Light Halo - Much more subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none z-0 opacity-50" />

      {/* 3. Login Card Container */}
      <div className="relative z-20 w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-1000">

        {/* Wavy/Glowing Border Wrapper */}
        <div className="relative group">
          {/* Border Glow: Subtle by default, brighter on hover */}
          <div className="absolute -inset-px bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 rounded-2xl opacity-10 blur-[1px] group-hover:opacity-50 group-hover:blur-sm transition-all duration-700 animate-gradient bg-[length:200%_200%]"></div>

          <Card className="relative bg-slate-950/70 backdrop-blur-md border-white/5 shadow-2xl overflow-hidden ring-1 ring-white/5">
            {/* Top Light Glint */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <CardHeader className="space-y-4 text-center pb-8 pt-8">
              <div className="flex justify-center">
                <div className="relative group/icon cursor-default">
                  <div className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-inner relative z-10 transition-transform duration-500 group-hover/icon:scale-105">
                    <Brain className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold tracking-tight text-white">
                  Skill Genome
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Access the Neural Hiring Intelligence
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2 group/input">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-focus-within/input:text-cyan-400 transition-colors">
                      Access Key (Email)
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 focus:bg-slate-900/80 transition-all duration-300 h-11 pl-4"
                      />
                      {/* Status Indicator */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    </div>
                  </div>
                  <div className="space-y-2 group/input">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-focus-within/input:text-cyan-400 transition-colors">
                        Security Token (Password)
                      </Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 focus:bg-slate-900/80 transition-all duration-300 h-11 pl-4"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold border-none shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 group/btn relative overflow-hidden"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>Authenticating...</>
                    ) : (
                      <>
                        Initialize Session
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </form>
              <div className="mt-8 text-center text-sm">
                <span className="text-slate-500">No clearance? </span>
                <Link
                  href="/auth/sign-up"
                  className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline underline-offset-4 transition-colors"
                >
                  Request Access
                </Link>
              </div>
            </CardContent>

            {/* Bottom Tech/Deco Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          </Card>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-8 font-mono">
          SECURE CONNECTION :: ENCRYPTED :: V1.0.4
        </p>
      </div>
    </div>
  )
}
