# 🚀 Quick Start Guide

## For Local Demo/Testing

### 1. Start Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

Backend runs at: **http://localhost:8000**

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 3. Access the App
- Dashboard: http://localhost:3000/dashboard
- Create Candidate: Use the "Add Candidate" button
- API Docs: http://localhost:8000/docs

---

## For Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions to:
- **Frontend**: Vercel
- **Backend**: Railway or Render  
- **Database**: Supabase

---

## Current Configuration

✅ **Backend**: Using SQLite (local database)  
✅ **Frontend**: Next.js 16 with Turbopack  
✅ **Data**: 8 candidates already in database

---

## Troubleshooting

### Backend won't start?
```bash
cd backend
pip install --upgrade -r requirements.txt
python main.py
```

### Frontend won't start?
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Port already in use?
Kill existing processes:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# macOS/Linux
lsof -ti:3000 | xargs kill
```

---

## Need Help?

1. Check `DEPLOYMENT.md` for deployment guide
2. Check `README.md` for full documentation
3. Open an issue on GitHub

**Made with ❤️ for GLA Hackathon 2026**
