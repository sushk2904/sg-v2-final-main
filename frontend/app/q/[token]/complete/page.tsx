export default async function QuestionnaireCompletePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-chart-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Thank You!
          </h1>
          <p className="text-muted-foreground">
            Your responses have been submitted successfully. The recruiter will
            review your work preference profile and follow up with next steps.
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 border border-border p-4 text-left space-y-3">
          <h3 className="font-medium text-card-foreground">What happens next?</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <span>Your responses are analyzed to understand your work preferences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <span>We calculate alignment with the role and organization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <span>The recruiter receives insights to support their hiring decision</span>
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <p className="text-xs text-muted-foreground">
            Powered by Skill Genome - AI-driven hiring intelligence that respects
            your privacy and focuses on work compatibility, not personality profiling.
          </p>
        </div>
      </div>
    </div>
  );
}
