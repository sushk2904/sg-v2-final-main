# Skill Genome - AI-Powered Candidate Analysis Platform

![Skill Genome](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

**Skill Genome** is an AI-powered recruitment platform that analyzes candidate readiness using the **Corporate Readiness Index (CRI)** - a comprehensive scoring system based on GitHub activity, problem-solving consistency, and alignment with organizational needs.

---

## ✨ Features

- 📊 **Corporate Readiness Index (CRI)** - Multi-dimensional candidate scoring
- 🔍 **GitHub Analysis** - Automated code quality and contribution analysis
- 🎯 **Role Alignment** - Match candidates to specific job requirements
- 📈 **Skill Signals** - Extract and visualize technical proficiency
- 🤖 **AI-Powered Insights** - Automated candidate evaluation
- 🔐 **Secure Authentication** - Supabase-powered auth system

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16 with TypeScript
- **UI**: Tailwind CSS + Radix UI Components
- **State**: React Server Components
- **Auth**: Supabase Authentication
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLAlchemy
- **APIs**: GitHub REST API
- **ML**: Sentence Transformers (skill matching)

### Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **File Storage**: Supabase Storage

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Supabase account
- GitHub Personal Access Token

### Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Skill_GenomeV1.0.git
cd Skill_GenomeV1.0
```

#### 2. Set Up Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt

# Copy and configure .env
copy .env.example .env  # Edit with your credentials

# Run backend
python main.py
```

Backend will run at `http://localhost:8000`

#### 3. Set Up Frontend
```bash
cd frontend
npm install

# Copy and configure environment
copy .env.example .env.local  # Edit with your Supabase credentials

# Run frontend
npm run dev
```

Frontend will run at `http://localhost:3000`

#### 4. Set Up Database

1. Go to Supabase Dashboard
2. Run the SQL from `backend/supabase_schema.sql` in SQL Editor
3. Tables will be created automatically

---

##📦 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions.

### Quick Deploy Summary:

1. **Database**: Create tables in Supabase using `backend/supabase_schema.sql`
2. **Backend**: Deploy to Railway or Render
3. **Frontend**: Deploy to Vercel
4. **Configure**: Update environment variables with production URLs

---

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints:

```
POST   /api/candidates/              Create new candidate
GET    /api/candidates/{id}/dashboard  Get candidate details + CRI
POST   /api/candidates/{id}/analyze-github  Trigger GitHub analysis
GET    /api/candidates/              List all candidates
```

---

## 🗂️ Project Structure

```
Skill_GenomeV1.0/
├── backend/
│   ├── main.py                 # FastAPI application entry
│   ├── routes_candidates.py    # Candidate API routes
│   ├── models.py               # SQLAlchemy models
│   ├── database.py             # Database connection
│   ├── cri_service.py          # CRI calculation logic
│   ├── github_service.py       # GitHub API integration
│   ├── requirements.txt        # Python dependencies
│   ├── supabase_schema.sql     # Database schema
│   └── .env                    # Backend configuration
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── auth/               # Authentication pages
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   └── candidates/         # Candidate-related components
│   ├── lib/
│   │   ├── supabase/           # Supabase client
│   │   └── api.ts              # API utilities
│   ├── package.json
│   └── .env.local              # Frontend configuration
│
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

---

## 🔑 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://...
GITHUB_TOKEN=ghp_...
CORS_ORIGINS=http://localhost:3000
DEBUG=True
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📖 How It Works

### The Corporate Readiness Index (CRI)

CRI is calculated from 5 key dimensions:

1. **Technical Readiness** (0-1)
   - Code quality metrics
   - Language proficiency
   - Project complexity

2. **Problem Solving Consistency** (0-1)
   - Commit frequency
   - Issue resolution rate
   - Code review participation

3. **Learning & Growth** (0-1)
   - Technology adoption rate
   - Skill diversity
   - Recent activity trends

4. **Work Discipline** (0-1)
   - Commit regularity
   - Documentation quality
   - Code organization

5. **Context Alignment** (0-1)
   - Skill match with role requirements
   - Domain expertise
   - Work style fit

**Overall CRI** = Weighted average of all dimensions (0-100 scale)

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by the Skill Genome Team

---

## 📧 Support

For questions or support, please open an issue or contact us at support@skillgenome.com

---

## 🙏 Acknowledgments

- Supabase for amazing database and auth infrastructure
- Vercel for seamless frontend hosting
- FastAPI for the powerful Python web framework
- The open-source community

---

**Made for GLA Hackathon 2026** 🎉
