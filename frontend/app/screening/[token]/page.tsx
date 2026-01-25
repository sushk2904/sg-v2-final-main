
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <Toaster />

                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Technical Screening</h1>
                    <p className="mt-2 text-gray-600">Candidate: {data?.candidate_name}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Screening Questions</CardTitle>
                        <CardDescription>
                            Please compare your thoughts and type your answers below. We value depth and clarity in your reasoning.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {data?.questions.map((q, idx) => (
                            <div key={q.id} className="space-y-3">
                                <label className="block text-base font-medium text-gray-900">
                                    {idx + 1}. {q.text}
                                </label>
                                <Textarea
                                    placeholder="Type your answer here..."
                                    rows={6}
                                    className="w-full resize-y font-mono text-sm"
                                    value={answers[q.id] || ""}
                                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                />
                            </div>
                        ))}

                        <div className="pt-4 border-t flex justify-end">
                            <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Code & Answers"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
