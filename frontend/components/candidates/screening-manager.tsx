
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Sparkles, CheckCircle, Clock, AlertTriangle, FileText, Activity } from "lucide-react";
import { toast } from "sonner";
import type { Candidate } from "@/lib/types";

interface ScreeningManagerProps {
    candidate: Candidate;
}

export function ScreeningManager({ candidate }: ScreeningManagerProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [roleContext, setRoleContext] = useState("");
    const [questions, setQuestions] = useState<any[]>([]);

    // Loading state for fetching existing session
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    // Fetch existing session on mount
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/screening/candidate/${candidate.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status !== "none") {
                        setSession(data);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch screening session", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSession();
    }, [candidate.id]);

    const generateQuestions = async () => {
        if (!roleContext) {
            toast.error("Please enter a role context (e.g. 'Senior Backend Engineer')");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/screening/generate-questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role_title: roleContext,
                    count: 5
                })
            });

            if (!res.ok) throw new Error("Failed to generate");

            const data = await res.json();
            setQuestions(data.questions);
            toast.success("Questions generated!");
        } catch (e) {
            console.error(e);
            toast.error("Error generating questions");
        } finally {
            setIsGenerating(false);
        }
    };

    const sendScreening = async () => {
        if (questions.length === 0) return;

        setIsSending(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/screening/sessions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    candidate_id: candidate.id,
                    questions: questions
                })
            });

            if (!res.ok) throw new Error("Failed to send");

            const data = await res.json();
            setSession({
                status: "sent",
                id: data.session_id,
                token: data.token,
                signal: null
            });
            toast.success(`Screening sent to ${candidate.email}`);
        } catch (e) {
            console.error(e);
            toast.error("Error sending screening");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center text-muted-foreground text-sm">Checking screening status...</div>;
    }

    // --- RENDERING STATES ---

    // 1. EVALUATION COMPLETED
    if (session && session.status === "evaluated" && session.signal) {
        const s = session.signal;
        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Screening Completed & Evaluated</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ResultCard title="Applied Reasoning" score={s.applied_reasoning_score} icon={<Activity className="w-4 h-4" />} />
                    <ResultCard title="Clarity" score={s.clarity_score} icon={<FileText className="w-4 h-4" />} />
                    <ResultCard title="Conceptual Depth" score={s.conceptual_depth_score} icon={<Sparkles className="w-4 h-4" />} />
                </div>

                <div className="bg-card border rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        AI Analysis
                    </h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                        {s.analysis_text}
                    </p>
                </div>

                {s.evidence_snippets && s.evidence_snippets.length > 0 && (
                    <div className="bg-muted/30 border rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Key Evidence</h4>
                        <ul className="space-y-2">
                            {s.evidence_snippets.map((snippet: string, idx: number) => (
                                <li key={idx} className="text-sm flex gap-2">
                                    <span className="text-primary">•</span>
                                    {snippet}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="text-xs text-muted-foreground text-right">
                    Confidence: <Badge variant="outline">{s.confidence}</Badge>
                </div>
            </div>
        );
    }

    // 2. SESSION ACTIVE / SENT
    if (session) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-chart-4/10 border border-chart-4/20 rounded-lg">
                    <Clock className="w-5 h-5 text-chart-4" />
                    <div className="flex-1">
                        <div className="font-medium text-foreground">Screening In Progress</div>
                        <div className="text-sm text-muted-foreground">
                            Status: <span className="capitalize text-foreground">{session.status}</span>. Waiting for candidate submission.
                        </div>
                    </div>
                    {session.token && (
                        <Badge variant="outline" className="ml-auto font-mono text-xs">
                            Token: {session.token.substring(0, 8)}...
                        </Badge>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                        Refresh Status
                    </Button>
                </div>
            </div>
        );
    }

    // 3. NO SESSION (Generat New)
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        AI Screening Generator
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Generate role-specific screening questions using Groq AI and send them to the candidate.
                    </p>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter role context (e.g. 'Frontend React Developer', 'System Architect')"
                            value={roleContext}
                            onChange={(e) => setRoleContext(e.target.value)}
                        />
                        <Button onClick={generateQuestions} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                        </Button>
                    </div>
                </div>

                {questions.length > 0 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Preview Questions ({questions.length})</h4>
                        {questions.map((q, idx) => (
                            <div key={idx} className="p-3 bg-card border rounded-md text-sm">
                                <span className="font-semibold mr-2">{idx + 1}.</span>
                                {q.text}
                                <Badge variant="outline" className="ml-2 text-xs">{q.category}</Badge>
                            </div>
                        ))}

                        <div className="flex justify-end pt-2">
                            <Button onClick={sendScreening} disabled={isSending}>
                                {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                                Send to Candidate
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ResultCard({ title, score, icon }: { title: string, score: number, icon: any }) {
    const percentage = Math.round(score * 100);
    let colorClass = "text-yellow-500";
    if (percentage >= 80) colorClass = "text-green-500";
    if (percentage < 50) colorClass = "text-red-500";

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground font-medium flex gap-2 items-center">
                        {icon} {title}
                    </span>
                </div>
                <div className={`text-2xl font-bold ${colorClass}`}>
                    {percentage}/100
                </div>
                <div className="w-full bg-secondary h-1.5 mt-2 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
