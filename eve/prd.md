# PRODUCT REQUIREMENTS DOCUMENT — PRODUCTION VERSION

**Product:** Skill Genome  
**Type:** AI-Driven Culture Fit & Corporate Readiness Intelligence Platform  
**Environment:** Antigravity IDE (AI-orchestrated modular services)  
**Version:** PRD v4.0 (Build-Ready)

---

## 1. Product Vision

Skill Genome transforms real work evidence, structured candidate inputs, and organizational work models into explainable readiness and culture-alignment scores to support hiring decisions.

The system assists humans and never automates hiring decisions.

---

## 2. Problem Being Solved

Hiring lacks:
- Standardized readiness measurement  
- Structured culture/work compatibility evaluation  
- Multi-source evidence integration  
- Explainable AI scoring  

---

## 3. Core System Outputs

| Output Type | Description |
|-------------|-------------|
| Skill Signals | Evidence-based technical readiness |
| Work Preference Signals | Candidate work-environment preferences |
| Alignment Signals | Compatibility with role + organization |
| Corporate Readiness Index (CRI) | Composite advisory score |
| Confidence Indicators | Reliability of outputs |
| Readiness Trend | Improvement trajectory |

---

## 4. System Architecture Modules

### Activity Intelligence Layer
- Resume Parser
- GitHub Analysis Engine
- LeetCode Analysis Engine
- Skill Inference Engine

### Context Intelligence Layer
- AI Questionnaire Generator
- Candidate Work Preference Structuring Engine

### Corporate Modeling Layer
- Role Environment Profiler
- Organization Work Signature Profiler

### Intelligence Fusion Layer
- Work Context Alignment Engine
- Corporate Readiness Index Engine
- Confidence Scoring Engine

### Presentation Layer
- Visualization Dashboard
- API Gateway

---

## 5. End-to-End Workflow

### Step 1 — Candidate Data Intake
Resume + GitHub + LeetCode → Skill Signals

### Step 2 — Culture/Work Context Questionnaire
AI-generated work-style questions → Candidate Work Preference Vector

### Step 3 — Recruiter Defines Work Context
Role Environment Profile + Organization Work Signature

### Step 4 — Alignment Engine
Candidate Profile vs Role vs Organization → Alignment Signals

---

## 6. Corporate Readiness Index (CRI)

**Formula**

CRI =
0.30 × Technical Readiness +
0.20 × Problem-Solving Consistency +
0.15 × Learning & Growth +
0.15 × Work Discipline +
0.20 × Context Alignment Score


Output includes confidence band and explanation.

---

## 7. AI Task Contracts

| Task | Input | Output |
|------|------|--------|
| Question Generation | Role description | JSON questions |
| Preference Structuring | Candidate responses | Work vector (0–1 floats) |
| GitHub Analysis | Username | Activity features |
| Signal Inference | Extracted features | Skill signals |
| Alignment Computation | Candidate + Role + Org vectors | Alignment signals |

---

## 8. Alignment Logic

Alignment Score = 1 - |CandidateValue - Role/OrgValue|


| Range | Meaning |
|-------|--------|
| ≥ 0.75 | High |
| 0.45–0.74 | Medium |
| < 0.45 | Low |

---

## 9. Readiness Trend Engine

Analyzes GitHub recency, tool diversity growth, and difficulty progression.

Outputs: **Improving / Stable / Declining**

---

## 10. Functional Requirements

FR-1 Resume parsing  
FR-2 GitHub & LeetCode ingestion  
FR-3 AI questionnaire generation  
FR-4 Secure candidate link  
FR-5 Work preference structuring  
FR-6 Role + Org profiling  
FR-7 Alignment computation  
FR-8 CRI calculation  
FR-9 Explanation generation  
FR-10 Dashboard visualization  

---

## 11. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | <30s analysis |
| Scalability | 100k candidates/day |
| Explainability | Required |
| Security | Tokenized links |
| Fairness | No personality inference |
| Data | Public + candidate-provided |

---

## 12. Responsible AI Constraints

System must NOT:
- Predict personality
- Judge ethics
- Automate hiring decisions

Signals only. Human-in-the-loop required.

---

## 13. Dashboard Layout

**Top Panel**
- Corporate Readiness Index
- Confidence level
- Readiness Trend

**Middle**
- Skill Signals
- Alignment Heatmap

**Bottom**
- Evidence & Explanation Panel

---

## 14. Success Metrics

| Metric | Target |
|--------|--------|
| Recruiter time saved | 40% |
| Questionnaire completion | >65% |
| Signal usefulness | >4/5 |
| Adoption rate | High |

---

## 15. Final Positioning

Skill Genome delivers AI-driven culture alignment and corporate readiness scoring by combining real work data, structured work-environment modeling, and explainable intelligence signals.
