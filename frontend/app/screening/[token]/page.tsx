
"use client";

import { useEffect, useState, use } from "react"; // Added "use" for params
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Question {
    id: string;
    text: string;
    category: string;
}

interface PageProps {
    params: Promise<{ token: string }>;
}

export default function ScreeningPage({ params }: PageProps) {
    // Directly unwrap params using "use" or await if async component
    // Since this is client component ("use client"), we should resolve params
    const { token } = use(params);

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<{ candidate_name: string; questions: Question[] } | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/screening/session/${token}`);
                if (res.status === 404) {
                    setError("Session not found or expired.");
                    return;
                }
                if (!res.ok) throw new Error("Failed to load");

                const jsonData = await res.json();
                setData(jsonData);
            } catch (e) {
                console.error(e);
                setError("Failed to load screening session.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleSubmit = async () => {
        if (!data) return;

        // Validate all answered
        const missing = data.questions.some(q => !answers[q.id]?.trim());
        if (missing) {
            toast.error("Please answer all questions before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = data.questions.map(q => ({
                question_id: q.id,
                response_text: answers[q.id]
            }));

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/screening/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    responses: payload
                })
            });

            if (!res.ok) throw new Error("Failed to submit");

            setIsSubmitted(true);
        } catch (e) {
            console.error(e);
            toast.error("Error submitting responses.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-red-900 mb-2">Access Error</h2>
                        <p className="text-red-700">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md border-green-200 bg-green-50">
                    <CardContent className="pt-6 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-green-900 mb-2">Assessment Submitted</h2>
                        <p className="text-green-700">Thank you! Your responses have been securely recorded.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative text-slate-100 font-sans selection:bg-cyan-500/30">
            {/* Background */}
            <div className="fixed inset-0 -z-50 bg-[#0A0E17]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E17] via-[#0f172a] to-[#0A0E17]" />
                <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <Toaster theme="dark" position="top-center" />

                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <CheckCircle className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-cyan-100 to-white drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                        Technical Screening
                    </h1>
                    <p className="text-lg text-slate-400 flex items-center justify-center gap-2">
                        Candidate: <span className="text-blue-300 font-medium">{data?.candidate_name}</span>
                    </p>
                </div>

                <div className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-white/5">
                        <h2 className="text-xl font-semibold text-white mb-2">Screening Questions</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Please provide detailed responses to the scenarios below.
                            Our AI evaluates based on <span className="text-cyan-300">clarity</span>, <span className="text-cyan-300">technical depth</span>, and <span className="text-cyan-300">reasoning</span>.
                        </p>
                    </div>

                    <div className="p-8 space-y-10">
                        {data?.questions.map((q, idx) => (
                            <div key={q.id} className="space-y-4 group">
                                <label className="block text-lg font-medium text-slate-200 leading-snug group-hover:text-blue-200 transition-colors">
                                    <span className="text-blue-500 mr-2 font-mono">0{idx + 1}.</span>
                                    {q.text}
                                </label>
                                <div className="relative">
                                    <Textarea
                                        placeholder="Type your detailed answer here..."
                                        rows={6}
                                        className="w-full bg-slate-950/50 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl resize-y font-mono text-sm leading-relaxed p-4 transition-all"
                                        value={answers[q.id] || ""}
                                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    />
                                    {/* Subtle active border glow */}
                                    <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent peer-focus:border-blue-500/20" />
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 border-t border-white/10 flex justify-end">
                            <Button
                                size="lg"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] border-none px-8 h-12 rounded-full transition-all hover:scale-105 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Code & Answers"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8 text-xs text-slate-600">
                    Powered by <span className="text-slate-500 font-semibold">Skill Genome</span> • Secure Assessment Environment
                </div>
            </div>
        </div>
    );
}
