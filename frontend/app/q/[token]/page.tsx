import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QuestionnaireForm } from "@/components/questionnaire/questionnaire-form";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function QuestionnairePage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch candidate by secure token
  const { data: candidate } = await supabase
    .from("candidates")
    .select("id, full_name, questionnaire_responses, status, roles(title)")
    .eq("secure_token", token)
    .single();

  if (!candidate) {
    notFound();
  }

  // Check if already completed
  if (candidate.status === "questionnaire_complete" || candidate.status === "analyzed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Already Completed</h1>
          <p className="text-muted-foreground">
            Thank you, {candidate.full_name}! You have already submitted your questionnaire responses.
          </p>
        </div>
      </div>
    );
  }

  // Check if questionnaire was sent
  if (!candidate.questionnaire_responses || candidate.questionnaire_responses.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Questionnaire Not Ready</h1>
          <p className="text-muted-foreground">
            The questionnaire for this assessment has not been generated yet. Please check back later or contact the recruiter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">Skill Genome</h1>
              <p className="text-sm text-muted-foreground">Work Preference Assessment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Welcome */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome, {candidate.full_name}
            </h2>
            <p className="text-muted-foreground">
              This questionnaire helps us understand your work preferences and style.
              {candidate.roles?.title && (
                <span> You are being considered for the <strong>{candidate.roles.title}</strong> role.</span>
              )}
            </p>
          </div>

          {/* Info box */}
          <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
            <h3 className="font-medium text-card-foreground">Before you begin:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>- There are no right or wrong answers</li>
              <li>- Answer based on your genuine preferences</li>
              <li>- This typically takes 5-10 minutes to complete</li>
              <li>- Your responses help match you with compatible work environments</li>
            </ul>
          </div>

          {/* Questionnaire form */}
          <QuestionnaireForm
            candidateId={candidate.id}
            token={token}
            questions={candidate.questionnaire_responses}
          />
        </div>
      </main>
    </div>
  );
}
