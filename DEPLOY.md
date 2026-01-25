# 🚀 How to Deploy Your Application for Free

To share a live link with your teacher, you have two main options. **Option 1** is recommended for permanent links. **Option 2** is faster for a quick 1-hour demo.

---

## ✅ Option 1: Cloud Deployment (Permanent Link)
**Time**: ~20 mins | **Cost**: Free | **Best for**: Final Submission

### Step 1: Push Code to GitHub
1.  Create a new repository on GitHub (e.g., `skill-genome-app`).
2.  Push your code to this repository.

### Step 2: Deploy Backend (Render.com)
1.  Sign up for [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repo.
4.  Settings:
    *   **Root Directory**: `backend`
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
    *   **Environment Variables**:
        *   `DATABASE_URL`: (Render will provide a Postgres URL if you add a Database, otherwise it uses a temporary internal one. For a persistent demo, **Add a PostgreSQL** database on Render too and link it).
        *   `PYTHON_VERSION`: `3.9.0`
5.  Click **Deploy**.
6.  Copy the URL (e.g., `https://skill-genome-api.onrender.com`).

### Step 3: Deploy Frontend (Vercel)
1.  Sign up for [Vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repo.
4.  Settings:
    *   **Root Directory**: `frontend`
    *   **Framework**: Next.js (Automatic)
    *   **Environment Variables**:
        *   `NEXT_PUBLIC_API_URL`: Paste your Render Backend URL (e.g., `https://skill-genome-api.onrender.com`).
5.  Click **Deploy**.
6.  **Done!** Share the Vercel URL.

---

## ⚡ Option 2: Ngrok Tunnel (Instant Demo)
**Time**: ~3 mins | **Cost**: Free | **Best for**: Live Presentation from your laptop

This exposes your *currently running* localhost to the internet.

1.  **Download Ngrok**: [https://ngrok.com/download](https://ngrok.com/download)
2.  **Start Backend Tunnel**:
    *   Open a new terminal.
    *   Run: `ngrok http 8000`
    *   Copy the https URL (e.g., `https://aaa-111.ngrok-free.app`).
3.  **Update Frontend Config**:
    *   Open `frontend/.env.local`.
    *   Change `NEXT_PUBLIC_API_URL` to the URL you just copied (e.g., `https://aaa-111.ngrok-free.app`).
4.  **Restart Frontend**:
    *   Stop your frontend terminal (`Ctrl+C`).
    *   Run `npm run dev`.
5.  **Start Frontend Tunnel**:
    *   Open another new terminal.
    *   Run: `ngrok http 3000`
    *   Copy *this* URL (e.g., `https://bbb-222.ngrok-free.app`).
6.  **Share**: Give the **Frontend URL** (`https://bbb-222...`) to your teacher.
    *   *Note: Your laptop must stay open and the terminals running.*
