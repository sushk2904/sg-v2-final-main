# Skill Genome — Frontend System Design Doc

## Purpose

This frontend is the decision-support interface for the Skill Genome platform.  
It visualizes AI-generated skill signals, work-context alignment insights, and Corporate Readiness Index (CRI) scores for recruiters.

The UI must be:
- Data-rich
- Trust-focused
- Explainable
- Non-automated decision support

---

## 1. Application Structure

| Page | Role |
|------|------|
| Dashboard | Recruiter overview of candidates |
| Candidate Profile | Detailed analysis of one candidate |
| Questionnaire | Candidate work-preference form |
| Role Setup | Recruiter defines role environment |
| CRI Explanation Modal | Transparency layer |

---

## 2. State Flow

Frontend **never computes AI logic**.

All signals come from backend APIs.

User Action → API Call → Backend Signals → UI Visualization

---

## 3. Core Data Objects

### CandidateSignals
```ts
{
  technical_readiness: number,
  problem_solving_consistency: number,
  learning_growth: number,
  work_discipline: number,
  trend: "improving" | "stable" | "declining",
  confidence: "low" | "medium" | "high"
}
AlignmentSignals
{
  collaboration_alignment: string,
  pace_alignment: string,
  structure_alignment: string,
  autonomy_alignment: string
}
CRI
{
  score: number,
  confidence: string,
  explanation: string
}

4. Dashboard Layout Logic

Top Section

CRI Score Card

Confidence Badge

Readiness Trend Badge

Middle

Skill Signals Bar Chart

Alignment Heatmap

Right Sidebar

Candidate summary

Resume preview

GitHub link

5. UX Rules

Always show explanation tooltips

Never show “Pass / Fail”

Use neutral advisory language

Show confidence levels visually

Keep enterprise, non-gamified design

6. Component Responsibilities
Component	Responsibility
CRICard	Display readiness score
SkillBarChart	Visualize skill signals
AlignmentHeatmap	Show compatibility
EvidencePanel	Show GitHub + resume evidence
TrendBadge	Show trajectory
ConfidenceIndicator	Show reliability
7. Error Handling

If API fails:

Show “Signal unavailable”

Do NOT estimate or fake data

8. Security

Frontend never stores:

GitHub tokens

Raw resume files


---

# 🧠 Now: What prompt to give Antigravity?

Paste this in Antigravity:

> Use the designdoc.md to refactor the existing Next.js frontend into a structured decision-support dashboard.  
> Create reusable components for CRI card, skill signal charts, alignment heatmap, and explanation panels.  
> Connect UI state to API response structures defined in the design doc.  
> Ensure UI uses advisory language and includes confidence indicators.  
> Do not implement AI logic in frontend. Only visualization and interaction.

---

# 🚀 What happens next

Antigravity will:

✔ Structure component architecture  
✔ Wire state properly  
✔ Create clean recruiter dashboard  
✔ Prevent logic leakage into frontend  

---

You’re now operating like a real AI product team.

If you want next, I can give:

- Component folder structure  
- API service layer file  
- UI microcopy text  

Tell me.