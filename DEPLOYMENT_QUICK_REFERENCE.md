# 🚀 Quick Deployment Reference

## 📝 Step-by-Step (TL;DR)

### PART 1: Backend (Render) - 10 minutes

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to https://dashboard.render.com/
   - New → Web Service → Connect GitHub repo
   - Settings:
     - Build: `pip install -r requirements.txt`
     - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
     - Add env vars (see below)
   - Click Deploy

3. **Save Backend URL**
   - Copy: `https://your-app.onrender.com`
   - Test: Visit `/health` endpoint

### PART 2: Frontend (Vercel) - 5 minutes

4. **Update Environment**
   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_API_URL=https://your-backend.onrender.com" > .env.local
   
   # Push changes
   git add .
   git commit -m "Add production config"
   git push origin main
   ```

5. **Deploy on Vercel**
   - Go to https://vercel.com/dashboard
   - New Project → Import from GitHub
   - Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
   - Deploy

6. **Test Your App**
   - Visit your Vercel URL
   - Send a test email
   - Done! 🎉

---

## 🔑 Environment Variables

### Backend (Render)
```
BREVO_API_KEY=your_brevo_key
BREVO_FROM_EMAIL=your@email.com
BREVO_FROM_NAME=Your Name
GEMINI_API_KEY=your_gemini_key
DEBUG=False
PYTHON_VERSION=3.11.0
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 🛠️ Commands Reference

### Render Settings
```
Build Command:  pip install -r requirements.txt
Start Command:  uvicorn main:app --host 0.0.0.0 --port $PORT
Runtime:        Python 3.11
```

### Git Commands
```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# Updates
git add .
git commit -m "Update"
git push
```

### Local Testing
```bash
# Backend
py run_server.py
# Test at: http://127.0.0.1:8000/health

# Frontend
npm run dev
# Test at: http://localhost:3000
```

---

## 🔗 Important URLs

### Development
- Backend: http://127.0.0.1:8000
- Frontend: http://localhost:3000
- API Docs: http://127.0.0.1:8000/docs

### Production
- Backend: https://[your-app].onrender.com
- Frontend: https://[your-project].vercel.app
- API Docs: https://[your-app].onrender.com/docs
- Health: https://[your-app].onrender.com/health

### Dashboards
- Render: https://dashboard.render.com/
- Vercel: https://vercel.com/dashboard
- Brevo: https://app.brevo.com/
- Gemini: https://aistudio.google.com/

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Backend 500 error | Check Render logs for details |
| CORS error | Verify backend URL has https:// |
| "Failed to fetch" | Backend might be sleeping (wait 60s) |
| Build fails | Check all dependencies in requirements.txt/package.json |
| Env vars not working | Must start with NEXT_PUBLIC_ for frontend |

---

## 💰 Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| Render | 750hrs/mo (sleeps) | $7/mo (always-on) |
| Vercel | Unlimited | $20/mo (team) |
| **Total** | **$0/mo** | **$7-27/mo** |

---

## ✅ Verification Checklist

- [ ] GitHub repo created and pushed
- [ ] Backend deployed on Render
- [ ] Backend `/health` endpoint works
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads without errors
- [ ] Can send test email
- [ ] Email received successfully

---

## 📚 Full Guides

- **Detailed Instructions**: See `DEPLOYMENT_GUIDE.md`
- **Complete Checklist**: See `DEPLOYMENT_CHECKLIST.md`

---

## 🆘 Quick Help

**Backend won't start?**
→ Check Render logs → Verify env vars → Check Python version

**Frontend can't connect?**
→ Verify NEXT_PUBLIC_API_URL → Must include https:// → Check CORS

**Email not sending?**
→ Check Brevo API key → Verify sender email → Check Render logs

**Slow response?**
→ Free tier sleeps after 15min → First request takes 60s → Upgrade to $7/mo

---

**Need detailed help?** Open `DEPLOYMENT_GUIDE.md` for step-by-step instructions with screenshots and troubleshooting.
