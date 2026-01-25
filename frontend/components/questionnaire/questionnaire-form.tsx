"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface Question {
  question_id: string;
  question_text: string;
  response: string | null;
  structured_value: number | null;
  category: string;
  response_type?: string;
  options?: string[];
}

interface QuestionnaireFormProps {
  candidateId: string;
  token: string;
  questions: Question[];
}

const categoryLabels: Record<string, string> = {
  work_style: "Work Style",
  collaboration: "Collaboration",
  growth: "Growth & Learning",
  environment: "Work Environment",
  communication: "Communication",
};

const categoryColors: Record<string, string> = {
  work_style: "bg-chart-1",
  collaboration: "bg-chart-2",
  growth: "bg-chart-3",
  environment: "bg-chart-4",
  communication: "bg-primary",
};

export function QuestionnaireForm({
  candidateId,
  token,
  questions,
}: QuestionnaireFormProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, { text: string; value: number }>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleResponse = (text: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.question_id]: { text, value },
    }));
  };

  const canProceed = responses[currentQuestion?.question_id]?.text !== undefined;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formattedResponses = questions.map((q) => ({
        question_id: q.question_id,
        question_text: q.question_text,
        response: responses[q.question_id]?.text || "",
        structured_value: responses[q.question_id]?.value || 0.5,
        category: q.category,
      }));

      const res = await fetch("/api/questionnaire/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          token,
          responses: formattedResponses,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      toast.success("Responses submitted successfully!");
      router.push(`/q/${token}/complete`);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit responses. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentResponse = responses[currentQuestion?.question_id];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="font-medium text-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                categoryColors[currentQuestion.category] || "bg-primary"
              }`}
            />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {categoryLabels[currentQuestion.category] || currentQuestion.category}
            </span>
          </div>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scale response type */}
          {(!currentQuestion.response_type || currentQuestion.response_type === "scale") && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Strongly Disagree</span>
                  <span>Neutral</span>
                  <span>Strongly Agree</span>
                </div>
                <Slider
                  value={[currentResponse?.value !== undefined ? currentResponse.value * 100 : 50]}
                  onValueChange={([val]) => {
                    const normalized = val / 100;
                    let label = "Neutral";
                    if (normalized < 0.3) label = "Strongly Disagree";
                    else if (normalized < 0.45) label = "Disagree";
                    else if (normalized < 0.55) label = "Neutral";
                    else if (normalized < 0.7) label = "Agree";
                    else label = "Strongly Agree";
                    handleResponse(label, normalized);
                  }}
                  max={100}
                  step={1}
                  className="py-4"
                />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-foreground">
                  {currentResponse?.text || "Move the slider to respond"}
                </span>
              </div>
            </div>
          )}

          {/* Multiple choice */}
          {currentQuestion.response_type === "multiple_choice" &&
            currentQuestion.options && (
              <RadioGroup
                value={currentResponse?.text || ""}
                onValueChange={(val) => {
                  const index = currentQuestion.options!.indexOf(val);
                  const normalized =
                    currentQuestion.options!.length > 1
                      ? index / (currentQuestion.options!.length - 1)
                      : 0.5;
                  handleResponse(val, normalized);
                }}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                      currentResponse?.text === option
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label
                      htmlFor={`option-${idx}`}
                      className="flex-1 cursor-pointer text-foreground"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

          {/* Open ended */}
          {currentQuestion.response_type === "open_ended" && (
            <div className="space-y-2">
              <Textarea
                value={currentResponse?.text || ""}
                onChange={(e) => handleResponse(e.target.value, 0.5)}
                placeholder="Type your response here..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Your response will be analyzed for work preference insights.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Submit Responses
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {questions.map((q, idx) => (
          <button
            key={q.question_id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              idx === currentIndex
                ? "bg-primary"
                : responses[q.question_id]
                ? "bg-chart-2"
                : "bg-muted"
            }`}
            aria-label={`Go to question ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
