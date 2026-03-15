# Skill Genome - Technical Description

## Overview
**Skill Genome** is an AI-powered hiring intelligence platform that objectively evaluates candidates for **Corporate Readiness** and **Culture Fit** using real data from GitHub, LeetCode, and resumes.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18, TypeScript)
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Charts**: Recharts (for CRI Score visualization)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLite (local) / PostgreSQL (production)
- **ORM**: SQLAlchemy 2.0
- **PDF Parsing**: PyPDF2
- **HTTP Client**: Requests (for GitHub/LeetCode APIs)
- **AI/LLM**: Google Gemini API (for screening analysis)
- **Server**: Uvicorn (ASGI)

### External APIs
- **GitHub REST API**: Repository analysis, commit history, language detection
- **LeetCode GraphQL API**: Problem-solving stats, contest rankings, skill tags
- **Google Gemini API**: AI-powered response evaluation for soft skills

### Database Schema
- **Candidates**: Core candidate records
- **CRI Scores**: Corporate Readiness Index scores
- **Alignment Scores**: Culture-fit metrics
- **Roles**: Job position definitions
- **Screening Sessions**: Questionnaire tracking
- **Screening Responses**: Candidate answers
- **Screening Signals**: AI-analyzed soft skill scores

---

## 📐 Core Formulas & Algorithms

### 1. Corporate Readiness Index (CRI)
The **CRI Score** (0-1 scale) is a weighted composite of 5 dimensions:

```
Overall CRI = (Technical Readiness × 0.30) +
              (Problem Solving × 0.25) +
              (Learning & Growth × 0.20) +
              (Work Discipline × 0.15) +
              (Context Alignment × 0.10)
```

#### Dimension Calculations:

**A. Technical Readiness** (30% weight)
```
Technical Readiness = (Technical Diversity × 0.4) +
                      (Code Quality × 0.3) +
                      (Activity Level × 0.3)
```
- **Technical Diversity**: Number of languages used / 10 (capped at 1.0)
- **Code Quality**: Based on repo star count, fork ratio
- **Activity Level**: Recent commit frequency

**B. Problem Solving Consistency** (25% weight)
```
If LeetCode data available:
    Problem Solving = LeetCode Final Score / 100

Else:
    Problem Solving = GitHub Code Quality Signal
```

**C. Learning & Growth** (20% weight)
```
Learning & Growth = (Technical Diversity × 0.6) +
                    (Activity Level × 0.4)
```

**D. Work Discipline** (15% weight)
```
If LeetCode consistency available:
    Work Discipline = (LC Consistency Score × 0.5) +
                      (GitHub Activity × 0.5)
Else:
    Work Discipline = GitHub Activity Level
```

**E. Context Alignment** (10% weight)
```
Context Alignment = Average of work preference scores
```

#### Confidence Level
```
Confidence = min(1.0, sum([
    GitHub Data: 0.4,
    LeetCode Data: 0.3,
    Resume Parsed: 0.2,
    Work Preferences: 0.1
]))
```

#### Readiness Trend
```
If Activity Level > 0.7: "Improving"
Else if Activity Level > 0.4: "Stable"
Else: "Declining"
```

---

### 2. LeetCode Final Score (0-100 scale)
The **LeetCode Score** evaluates competitive programming prowess:

```
LeetCode Score = (Volume × 0.30) +
                 (Difficulty × 0.25) +
                 (Contest × 0.25) +
                 (Consistency × 0.15) +
                 (Velocity × 0.05)
```

#### Component Formulas:

**A. Volume Score** (30%)
```
Total Solved = Easy + Medium + Hard
Normalized = min(100, (Total Solved / 500) × 100)

Weighted = (Easy × 1) + (Medium × 3) + (Hard × 5)
Volume Score = min(100, (Weighted / 1000) × 100)
```

**B. Difficulty Score** (25%)
```
Hard Ratio = Hard Solved / max(Total Solved, 1)
Medium Ratio = Medium Solved / max(Total Solved, 1)

Difficulty Score = (Hard Ratio × 100 × 0.6) +
                   (Medium Ratio × 100 × 0.4)
```

**C. Contest Score** (25%)
```
If contests attended > 0:
    Percentile = 100 - Top Percentage
    Rating Normalized = min(100, (Rating / 3000) × 100)
    
    Contest Score = (Percentile × 0.6) +
                    (Rating Normalized × 0.4)
Else:
    Contest Score = 0
```

**D. Consistency Score** (15%)
```
Active Days = days with submissions in last 365 days
Streak = longest consecutive days
Recent Activity = submissions in last 30 days

Consistency = (Active Days / 365 × 100 × 0.5) +
              (min(100, Streak / 30 × 100) × 0.3) +
              (min(100, Recent Activity × 10) × 0.2)
```

**E. Velocity Score** (5%)
```
Daily Rate = Total Solved / account_age_in_days
Velocity = min(100, Daily Rate × 100)
```

---

### 3. Alignment Score (Culture Fit)
Measures candidate-organization compatibility (0-1 scale):

```
Alignment Score = Average(alignment_scores_per_dimension)

For each dimension:
    Alignment = 1 - |Candidate Value - Target Value|
```

#### Dimensions (8 total):
1. **Collaboration Style** (Solo ← → Team-oriented)
2. **Pace Preference** (Relaxed ← → Fast-paced)
3. **Structure Level** (Flexible ← → Rigid)
4. **Innovation Focus** (Conservative ← → Cutting-edge)
5. **Communication Frequency** (Async ← → High-sync)
6. **Remote Compatibility** (Office-only ← → Fully remote)
7. **Mentorship Preference** (Independent ← → Guided)
8. **Decision Autonomy** (Directed ← → Self-driven)

#### Categorization:
```
If Overall ≥ 0.75: "High Alignment"
Else if Overall ≥ 0.50: "Medium Alignment"
Else: "Low Alignment"
```

**Note**: If no candidate preferences exist, default score = 0.35 (Low).

---

### 4. Screening Signal (Soft Skills Analysis)
AI-evaluated scores for open-ended responses (0-1 scale):

```
Applied Reasoning = AI score for practical thinking
Clarity = AI score for communication quality
Conceptual Depth = AI score for understanding

Overall Screening Signal = Average(3 scores)
```

**Confidence Bands**:
- High: All scores > 0.7
- Medium: Average > 0.5
- Low: Average ≤ 0.5

---

## 🔄 Data Flow

### Candidate Onboarding
1. **Resume Upload** → PDF parsed for GitHub/LeetCode links
2. **GitHub Analysis** → Fetch repos, commits, languages
3. **LeetCode Analysis** → GraphQL query for stats, contests
4. **CRI Calculation** → Composite score generation
5. **Alignment Scoring** → Culture-fit evaluation
6. **Dashboard Display** → Visual CRI breakdown + Evidence Panel

### Screening Workflow
1. **Question Generation** → Role-specific technical/behavioral questions
2. **Email Dispatch** → Unique token link sent to candidate
3. **Response Collection** → Open-ended text submission
4. **AI Evaluation** → Gemini analyzes responses for Applied Reasoning, Clarity, Depth
5. **Signal Storage** → Scores saved to database
6. **Recruiter Review** → Evidence snippets + confidence level shown

---

## 📊 Key Visualizations

### 1. CRI Score Radial Chart
- 5-axis radar chart showing dimension breakdown
- Gradient fills (blue → cyan)
- Interactive hover tooltips

### 2. Skill Lifecycle Analysis
- **Active Skills Momentum**: Skills with recent usage (scatter plot)
- **Decaying Skills Watchlist**: Stagnant skills (scatter plot)
- Connected dots with trend lines

### 3. Alignment Heatmap
- Color-coded bars per dimension (green = high, red = low)
- Side-by-side role vs. org alignment

### 4. LeetCode Analytics
- Pie chart: Easy/Medium/Hard distribution
- Line chart: Submission timeline (30-day window)
- Progress bars: Percentile rankings

---

## 🎨 Design System

### Theme
- **Base**: Dark mode (slate-900 background)
- **Accents**: Blue-cyan gradients
- **Effects**: Glassmorphism (`backdrop-blur-sm`, `bg-white/5`)

### Typography
- **Font**: Inter (system default)
- **Gradient Text**: `bg-gradient-to-r from-blue-100 to-cyan-100`

### Components
- **Cards**: `bg-slate-900/40 border-white/5`
- **Buttons**: `bg-blue-600 hover:bg-blue-700`
- **Badges**: Status-coded colors (green = Analyzed, yellow = Pending)

---

## 🚀 Deployment Notes

### Environment Variables

**Backend** (`.env`):
```bash
DATABASE_URL=sqlite:///./skill_genome.db
GITHUB_TOKEN=<optional>
GEMINI_API_KEY=<required for screening>
```

**Frontend** (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Stack
- **Frontend**: Vercel (auto-deploy from GitHub)
- **Backend**: Render.com (Python runtime, PostgreSQL addon)
- **Database**: PostgreSQL (via Render or Supabase)

---

## 📖 API Endpoints

### Candidates
- `POST /api/candidates/parse-resume` - Extract GitHub/LeetCode from PDF
- `POST /api/candidates/` - Create candidate + trigger analysis
- `GET /api/candidates/{id}/dashboard` - Full candidate data
- `POST /api/candidates/{id}/analyze-github` - Force GitHub re-scan

### Screening
- `POST /api/screening/sessions` - Create questionnaire session
- `GET /api/screening/{token}` - Candidate view (public)
- `POST /api/screening/{token}/submit` - Submit responses
- `POST /api/screening/{session_id}/evaluate` - Trigger AI analysis

### Roles
- `GET /api/roles/` - List all roles
- `POST /api/roles/` - Create new role

---

## 🧪 Testing Commands

```bash
# Backend Health Check
curl http://localhost:8000/health

# Test GitHub Analysis
curl -X POST http://localhost:8000/api/candidates/{id}/analyze-github

# View API Docs
http://localhost:8000/docs
```

---

## 📚 Key Dependencies

### Backend
```
fastapi>=0.100.0
uvicorn>=0.23.0
sqlalchemy>=2.0.0
requests>=2.31.0
PyPDF2>=3.0.0
google-generativeai>=0.3.0
psycopg2-binary>=2.9.0
```

### Frontend
```
next@14.x
react@18.x
recharts@2.x
framer-motion@11.x
tailwindcss@3.x
```

---

## 🎯 Hackathon Alignment

**Problem Statement 4**: AI-Driven Culture-Fit & Corporate Readiness Scoring

### How We Address It:
1. ✅ **Objective Soft Skill Evaluation**: AI analyzes open-ended responses
2. ✅ **Corporate Readiness Quantification**: CRI score (5 dimensions)
3. ✅ **Culture Fit Matching**: 8-dimensional alignment scoring
4. ✅ **Data-Driven**: Uses real GitHub/LeetCode signals, not self-reported

### Unique Features:
- **Explainable AI**: Every CRI component has human-readable explanations
- **Confidence Scoring**: Transparency about data completeness
- **Dynamic Trend Analysis**: Shows if candidate is improving/declining
- **Evidence-Based**: Visual charts link scores to actual code/submissions
