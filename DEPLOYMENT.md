# 🚀 Deployment Guide - Skill Genome

Complete guide to deploy the Skill Genome application to production.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Supabase account and project created
- ✅ GitHub account (for code hosting)
- ✅ Vercel account (for frontend) - https://vercel.com
- ✅ Railway/Render account (for backend) - https://railway.app or https://render.com

---

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/flaymbrucxlosgillfop
2. Click **SQL Editor** → **New Query**
3. Copy and paste the contents of `backend/supabase_schema.sql`
4. Click **Run** to execute

### 1.2 Verify Tables Created

Go to **Table Editor** and verify you see:
- `candidates`
- `cri_scores`
- `alignment_scores`
- `roles`
- `organizations`

### 1.3 Migrate Existing Data (Optional)

If you have data in SQLite that you want to migrate:
```bash
cd backend
python sync_to_supabase_rest.py
```

---

## 🖥️ Step 2: Deploy Backend (FastAPI)

### Option A: Railway (Recommended)

1. **Sign up** at https://railway.app
2. **Create New Project** → **Deploy from GitHub repo**
3. **Connect your repository**
4. **Select** `backend` folder as root directory
5. **Add Environment Variables**:
   ```
   GITHUB_TOKEN=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
   DATABASE_URL=postgresql://postgres.flaymbrucxlosgillfop:ZGeDS0vhKgt5HUNe@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
   CORS_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:3000
   DEBUG=False
   API_HOST=0.0.0.0
   API_PORT=8000
   ```
6. **Deploy** - Railway will automatically:
   - Detect Python
   - Install from `requirements.txt`
   - Run using `Procfile`

7. **Copy your deployed backend URL** (e.g., `https://skill-genome-production.up.railway.app`)

### Option B: Render

1. **Sign up** at https://render.com
2. **New** → **Web Service**
3. **Connect your repository**
4. Configure:
   - **Name**: skill-genome-api
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Add Environment Variables** (same as Railway)
6. **Create Web Service**

---

## 🌐 Step 3: Deploy Frontend (Next.js)

### Vercel Deployment (Recommended)

1. **Sign up** at https://vercel.com
2. **Import Project** from GitHub
3. **Select** your repository
4. **Configure**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://flaymbrucxlosgillfop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYXltYnJ1Y3hsb3NnaWxsZm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTY2NzQsImV4cCI6MjA4NDgzMjY3NH0.nxsPP5qgS-gVoLeopmaUKcdyZkHP1CjvEDIAMJ7lp3Y
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   ```
   
   **Important**: Replace `your-backend-url.railway.app` with your actual backend URL from Step 2!

6. **Deploy** - Vercel will automatically build and deploy

---

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Update Backend CORS

After frontend is deployed, update backend environment variables:
```
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### 4.2 Test the Deployment

1. Visit your Vercel URL
2. Try creating a new candidate
3. Verify data appears in Supabase

### 4.3 Enable Authentication (Optional)

If you want to add authentication:
1. Go to Supabase → **Authentication** → **Providers**
2. Enable **Email** or **Google** auth
3. Update RLS policies in Supabase

---

## 📊 Step 5: Monitor and Debug

### Backend Logs
- **Railway**: Dashboard → Logs
- **Render**: Dashboard → Logs

### Frontend Logs
- **Vercel**: Dashboard → Deployments → View Function Logs

### Database
- **Supabase**: Dashboard → Table Editor (view data)

---

## 🎯 Quick Deployment Checklist

- [ ] Supabase tables created (`supabase_schema.sql` executed)
- [ ] Backend deployed to Railway/Render
- [ ] Backend environment variables configured
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured (with backend URL)
- [ ] CORS updated in backend with frontend URL
- [ ] Test: Create a candidate → Check Supabase
- [ ] Test: View candidate dashboard

---

## 🐛 Common Issues

### Issue: CORS Error
**Solution**: Add your frontend URL to `CORS_ORIGINS` in backend environment variables

### Issue: Database Connection Failed
**Solution**: Verify `DATABASE_URL` is correct in backend environment variables

### Issue: 404 on API Calls
**Solution**: Ensure `NEXT_PUBLIC_API_URL` in frontend points to your backend URL (including `/api`)

### Issue: Build Failed
**Solution**: Check logs for specific errors. Common fixes:
- Frontend: Run `npm install` locally first
- Backend: Ensure `requirements.txt` has all dependencies

---

## 📝 Environment Variables Summary

### Backend (.env or Platform Settings)
```bash
DATABASE_URL=postgresql://postgres.flaymbrucxlosgillfop:ZGeDS0vhKgt5HUNe@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
GITHUB_TOKEN=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
CORS_ORIGINS=https://your-frontend.vercel.app
DEBUG=False
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend (.env.local or Vercel Settings)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://flaymbrucxlosgillfop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYXltYnJ1Y3hsb3NnaWxsZm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTY2NzQsImV4cCI6MjA4NDgzMjY3NH0.nxsPP5qgS-gVoLeopmaUKcdyZkHP1CjvEDIAMJ7lp3Y
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## 🎉 You're Done!

Your Skill Genome application is now deployed and ready to use!

**Frontend**: https://your-app.vercel.app  
**Backend API**: https://your-api.railway.app  
**Database**: Supabase Dashboard
