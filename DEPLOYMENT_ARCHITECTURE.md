# 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR APPLICATION                         │
└─────────────────────────────────────────────────────────────────┘

                            DEVELOPMENT
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌──────────────────┐                  ┌───────────────────┐   │
│  │                  │                  │                   │   │
│  │  Next.js         │  ◄─── API ────► │  FastAPI          │   │
│  │  Frontend        │   localhost      │  Backend          │   │
│  │                  │                  │                   │   │
│  │  localhost:3000  │                  │  127.0.0.1:8000   │   │
│  └──────────────────┘                  └───────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘


                            PRODUCTION
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌──────────────────┐                  ┌───────────────────┐   │
│  │                  │                  │                   │   │
│  │  Next.js         │  ◄─── API ────► │  FastAPI          │   │
│  │  Frontend        │    HTTPS         │  Backend          │   │
│  │                  │                  │                   │   │
│  │  🔵 Vercel       │                  │  🟣 Render        │   │
│  │  .vercel.app     │                  │  .onrender.com    │   │
│  └──────────────────┘                  └───────────────────┘   │
│                                                                   │
│                                         ┌───────────────────┐   │
│                                         │                   │   │
│                                         │  External APIs    │   │
│                                         │  - Brevo (Email)  │   │
│                                         │  - Gemini (AI)    │   │
│                                         └───────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Browser
    │
    ├─► Opens: https://your-app.vercel.app
    │   (Vercel serves Next.js frontend)
    │
    ├─► Fills email form
    │
    ├─► Clicks "Generate with AI"
    │   │
    │   └─► POST https://your-backend.onrender.com/generate-body
    │       │
    │       └─► Render forwards to FastAPI
    │           │
    │           └─► FastAPI calls Gemini API
    │               │
    │               └─► Returns AI-generated content
    │
    ├─► Uploads file attachment
    │
    └─► Clicks "Send Email"
        │
        └─► POST https://your-backend.onrender.com/send-email
            │
            └─► Render forwards to FastAPI
                │
                └─► FastAPI calls Brevo API
                    │
                    └─► Brevo sends email
                        │
                        └─► Email delivered to recipient ✅
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        GITHUB                               │
│  Your Code Repository (Source of Truth)                    │
│                                                              │
│  - Frontend code (Next.js)                                  │
│  - Backend code (FastAPI)                                   │
│  - Dependencies                                             │
│  - Configuration files                                      │
└────────────────────────────────────────────────────────────┘
                    │                    │
                    │                    │
        ┌───────────┴──────────┐    ┌───┴───────────────────┐
        │                      │    │                       │
        ▼                      │    ▼                       │
┌───────────────┐             │  ┌────────────────┐        │
│    VERCEL     │             │  │     RENDER     │        │
│               │             │  │                │        │
│ Reads:        │             │  │ Reads:         │        │
│ - Next.js     │             │  │ - Python code  │        │
│ - package.json│             │  │ - requirements │        │
│ - vercel.json │             │  │ - render.yaml  │        │
│               │             │  │                │        │
│ Builds:       │             │  │ Installs:      │        │
│ - npm install │             │  │ - pip install  │        │
│ - npm build   │             │  │                │        │
│               │             │  │ Starts:        │        │
│ Deploys:      │             │  │ - uvicorn      │        │
│ - Static HTML │             │  │                │        │
│ - React app   │             │  │ Exposes:       │        │
│               │             │  │ - REST API     │        │
│ URL:          │             │  │                │        │
│ your-app      │             │  │ URL:           │        │
│  .vercel.app  │             │  │ your-backend   │        │
│               │             │  │  .onrender.com │        │
└───────────────┘             │  └────────────────┘        │
        │                     │           │                │
        │  Automatic          │           │  Automatic     │
        │  re-deploy on       │           │  re-deploy on  │
        │  git push           │           │  git push      │
        │                     │           │                │
        └─────────────────────┴───────────┴────────────────┘
                              │
                              │
                    ┌─────────▼─────────┐
                    │   AUTO-DEPLOY     │
                    │   on git push     │
                    └───────────────────┘
```

## Environment Variables Flow

```
Development (.env files)
    ├─► Backend: .env or env.example
    │   - BREVO_API_KEY
    │   - GEMINI_API_KEY
    │   - etc.
    │
    └─► Frontend: .env.local
        - NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

Production (Platform Dashboards)
    ├─► Render Dashboard
    │   Environment Variables:
    │   - BREVO_API_KEY=xxx
    │   - BREVO_FROM_EMAIL=xxx
    │   - GEMINI_API_KEY=xxx
    │   - DEBUG=False
    │
    └─► Vercel Dashboard
        Environment Variables:
        - NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Security & CORS

```
┌──────────────────────────────────────────────────────────┐
│                     CORS Configuration                    │
└──────────────────────────────────────────────────────────┘

Browser (https://your-app.vercel.app)
    │
    │  Request: POST https://your-backend.onrender.com/send-email
    │  Origin: https://your-app.vercel.app
    │
    ▼
Render Backend (FastAPI)
    │
    │  Checks ALLOWED_ORIGINS
    │  ├─► localhost:3000 ✅ (development)
    │  ├─► 127.0.0.1:3000 ✅ (development)
    │  └─► * ✅ (production, when DEBUG=False)
    │
    │  If allowed:
    │  └─► Process request
    │      └─► Return response with CORS headers
    │
    ▼
Response sent back to browser ✅
```

## Cost Structure

```
┌────────────────────────────────────────────────────────────┐
│                      FREE TIER                              │
└────────────────────────────────────────────────────────────┘

Vercel (Frontend)
├─► Bandwidth: 100 GB/month
├─► Build time: 6,000 minutes/month
├─► Deployments: Unlimited
├─► Custom domains: Yes
└─► Cost: $0/month

Render (Backend)
├─► Hours: 750 hours/month
├─► RAM: 512 MB
├─► Sleeps after: 15 minutes inactivity
├─► Wake time: ~30-60 seconds
├─► Custom domains: Yes
└─► Cost: $0/month

External APIs
├─► Brevo: 300 emails/day free
├─► Gemini: Free tier available
└─► Cost: $0/month

TOTAL: $0/month 🎉

┌────────────────────────────────────────────────────────────┐
│                     PAID TIER                               │
└────────────────────────────────────────────────────────────┘

Vercel Pro (Frontend)
└─► $20/month (optional, for team features)

Render Starter (Backend)
├─► Always-on (no sleep)
├─► 512 MB RAM
├─► Faster response times
└─► $7/month (recommended for production)

TOTAL: $7-27/month
```

## Monitoring & Logs

```
┌──────────────────────────────────────────────────────────┐
│                    LOGS & MONITORING                      │
└──────────────────────────────────────────────────────────┘

Vercel
├─► Deployments
│   ├─► Build logs
│   ├─► Function logs
│   └─► Error tracking
│
├─► Analytics
│   ├─► Page views
│   ├─► Web Vitals
│   └─► Performance metrics
│
└─► Access: https://vercel.com/dashboard

Render
├─► Logs
│   ├─► Application logs (print statements)
│   ├─► Error logs
│   └─► Access logs
│
├─► Metrics
│   ├─► CPU usage
│   ├─► Memory usage
│   └─► Response times
│
└─► Access: https://dashboard.render.com

External Monitoring (Optional)
├─► Sentry (Error tracking)
├─► UptimeRobot (Uptime monitoring)
└─► LogRocket (Session replay)
```

## Deployment Workflow

```
┌──────────────────────────────────────────────────────────┐
│                  TYPICAL WORKFLOW                         │
└──────────────────────────────────────────────────────────┘

1. Local Development
   ├─► npm run dev (frontend)
   ├─► py run_server.py (backend)
   └─► Test locally

2. Commit Changes
   ├─► git add .
   ├─► git commit -m "message"
   └─► git push origin main

3. Automatic Deployment
   ├─► Vercel detects push
   │   ├─► Builds frontend
   │   └─► Deploys to .vercel.app
   │
   └─► Render detects push
       ├─► Installs dependencies
       └─► Starts backend

4. Testing Production
   ├─► Visit frontend URL
   ├─► Test all features
   └─► Check logs for errors

5. Fix Issues (if any)
   ├─► Make changes locally
   ├─► Test locally
   ├─► Commit & push
   └─► Auto-deploys again
```

---

## Quick Commands

### Deploy Backend (Render)
```
1. Push to GitHub
2. Connect repo in Render
3. Set environment variables
4. Click "Create Web Service"
```

### Deploy Frontend (Vercel)
```
1. Push to GitHub
2. Import project in Vercel
3. Set NEXT_PUBLIC_API_URL
4. Click "Deploy"
```

### Update After Changes
```bash
git add .
git commit -m "Update"
git push
# Both platforms auto-deploy! ✨
```

---

**Visual learner?** This diagram shows exactly how everything connects! 🎨
