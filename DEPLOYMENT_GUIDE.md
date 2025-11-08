# 🚀 Deployment Guide: Vercel + Render

This guide will walk you through deploying your Quick Mail Sender application with:
- **Frontend (Next.js)** → Vercel
- **Backend (FastAPI)** → Render

---

## 📋 Prerequisites

Before you start, make sure you have:
- [ ] GitHub account
- [ ] Your code pushed to a GitHub repository
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Render account (sign up at https://render.com)
- [ ] Your API keys ready:
  - Brevo API Key
  - Google Gemini API Key

---

## 🎯 Deployment Overview

**Order of deployment:**
1. **Deploy Backend first** (on Render) → Get backend URL
2. **Deploy Frontend** (on Vercel) → Use backend URL

---

## PART 1: Deploy Backend to Render 🐍

### Step 1: Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account & Deploy

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com/
   - Sign up or log in

2. **Create New Web Service**
   - Click "New +" button → Select "Web Service"
   - Connect your GitHub account if not already connected
   - Select your repository

3. **Configure the Web Service**
   
   Fill in these details:
   
   | Field | Value |
   |-------|-------|
   | **Name** | `quick-mail-sender-api` (or any name you prefer) |
   | **Region** | Choose closest to you (e.g., Oregon, Frankfurt) |
   | **Branch** | `main` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

4. **Add Environment Variables**
   
   Click "Advanced" → Add these environment variables:
   
   | Key | Value | Notes |
   |-----|-------|-------|
   | `BREVO_API_KEY` | Your Brevo API key | From your Brevo account |
   | `BREVO_FROM_EMAIL` | `noreply@yourdomain.com` | Your verified sender email |
   | `BREVO_FROM_NAME` | `Your App Name` | Sender name |
   | `GEMINI_API_KEY` | Your Gemini API key | From Google AI Studio |
   | `APP_NAME` | `Quick Mail Sender` | Optional |
   | `APP_VERSION` | `1.0` | Optional |
   | `DEBUG` | `False` | Set to False for production |
   | `PYTHON_VERSION` | `3.11.0` | Specify Python version |

5. **Select Plan**
   - Choose **Free** plan (or paid if you need more resources)
   - Free plan includes:
     - 750 hours/month
     - Automatic deploys
     - Custom domains
     - SSL certificates

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - You'll see build logs in real-time

7. **Get Your Backend URL**
   - Once deployed, you'll see: `https://quick-mail-sender-api.onrender.com`
   - **SAVE THIS URL** - you'll need it for frontend deployment
   - Test it: Visit `https://your-app-name.onrender.com/health`
   - You should see: `{"status": "healthy"}`

### ⚠️ Important Render Notes:

- **Free tier sleeps after 15 minutes of inactivity**
  - First request after sleep takes ~30-60 seconds to wake up
  - Subsequent requests are fast
  - Solution: Upgrade to paid plan ($7/month) for always-on service

- **Logs**: View logs in Render dashboard → Your service → Logs tab

---

## PART 2: Deploy Frontend to Vercel ⚡

### Step 1: Update Frontend Configuration

1. **Create `.env.local` file** (in your project root):

```bash
# In your project root
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Replace `https://your-backend-url.onrender.com` with your actual Render backend URL from Part 1.

2. **Update `.gitignore`** to include `.env.local`:

```
.env.local
```

3. **Commit and push changes**:

```bash
git add .
git commit -m "Update for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Sign up or log in (use GitHub for easier integration)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Project**
   
   Vercel will auto-detect Next.js settings:
   
   | Field | Value |
   |-------|-------|
   | **Framework Preset** | Next.js (auto-detected) |
   | **Root Directory** | `./` (leave default) |
   | **Build Command** | `npm run build` (auto-detected) |
   | **Output Directory** | `.next` (auto-detected) |
   | **Install Command** | `npm install` (auto-detected) |

4. **Add Environment Variables**
   
   Expand "Environment Variables" section and add:
   
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend-url.onrender.com` |
   
   ⚠️ Replace with your actual Render backend URL!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Vercel will build and deploy your frontend

6. **Get Your Frontend URL**
   - Once deployed: `https://your-project-name.vercel.app`
   - Visit it and test your application!

### Step 3: Test Your Deployed Application

1. **Visit your Vercel URL**: `https://your-project-name.vercel.app`

2. **Test Email Sending**:
   - Fill in the email form
   - Try AI generation
   - Upload a file attachment
   - Send an email

3. **Check for Errors**:
   - Open browser console (F12)
   - Look for any red errors
   - Check Network tab for failed requests

---

## 🔧 Troubleshooting

### Backend Issues (Render)

**Problem**: "Application failed to start"
```
Solution:
1. Check Render logs for error messages
2. Verify all environment variables are set correctly
3. Ensure requirements.txt includes all dependencies
4. Check Python version matches your local version
```

**Problem**: Backend responds with 500 errors
```
Solution:
1. Check Render logs for detailed error
2. Verify API keys (Brevo, Gemini) are valid
3. Check email configuration (BREVO_FROM_EMAIL must be verified)
```

**Problem**: Slow first response (free tier)
```
This is expected behavior. Free tier sleeps after 15 minutes.
Solutions:
- Wait 30-60 seconds for first request
- Upgrade to paid plan ($7/month) for always-on service
- Use a "keep-alive" service to ping your backend every 10 minutes
```

### Frontend Issues (Vercel)

**Problem**: "Failed to fetch" or CORS errors
```
Solution:
1. Verify NEXT_PUBLIC_API_URL environment variable is set correctly
2. Ensure backend URL includes https:// (not http://)
3. Check backend CORS settings allow your frontend domain
4. Test backend health endpoint directly in browser
```

**Problem**: Environment variable not working
```
Solution:
1. Environment variables MUST start with NEXT_PUBLIC_ for client-side access
2. After adding env vars, redeploy: Deployments → Click "..." → Redeploy
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
```

**Problem**: Build fails
```
Solution:
1. Check Vercel build logs for specific error
2. Test build locally: npm run build
3. Fix any TypeScript errors or warnings
4. Ensure all dependencies are in package.json
```

---

## 🎛️ Configuration

### Update Backend URL Later

If you need to change your backend URL:

1. **In Vercel**:
   - Go to your project → Settings → Environment Variables
   - Edit `NEXT_PUBLIC_API_URL`
   - Redeploy: Deployments → Latest deployment → "..." → Redeploy

2. **In Code** (not recommended):
   - Update `.env.local` locally
   - Commit and push
   - Vercel will auto-deploy

### Custom Domains

**Vercel (Frontend)**:
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `mail.yourdomain.com`)
3. Follow DNS configuration instructions
4. SSL certificate automatically provisioned

**Render (Backend)**:
1. Go to your service → Settings
2. Add custom domain under "Custom Domain"
3. Update DNS records as instructed
4. SSL certificate automatically provisioned

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ **Never commit `.env.local` or `.env` files**
- ✅ **Use different API keys for development and production**
- ✅ **Rotate API keys regularly**
- ✅ **Use Vercel and Render secrets management**

### Backend Security
- ✅ **Set `DEBUG=False` in production**
- ✅ **Enable rate limiting (already configured)**
- ✅ **Monitor API usage in Brevo dashboard**
- ✅ **Set up Render health checks**

### Frontend Security
- ✅ **Use HTTPS only (enforced by Vercel)**
- ✅ **Implement proper error handling**
- ✅ **Don't expose sensitive data in client-side code**

---

## 📊 Monitoring & Maintenance

### Render Monitoring
- **Logs**: Dashboard → Your Service → Logs
- **Metrics**: Dashboard → Your Service → Metrics
- **Health Check**: Set up at `/health` endpoint

### Vercel Monitoring
- **Analytics**: Project → Analytics
- **Logs**: Deployments → Select deployment → Function Logs
- **Performance**: Built-in Web Vitals monitoring

### Recommended Monitoring Tools
- **Sentry** (Error tracking) - Free tier available
- **LogRocket** (Session replay) - Paid
- **UptimeRobot** (Uptime monitoring) - Free tier available

---

## 💰 Cost Estimation

### Free Tier (Perfect for getting started)
- **Render**: Free - 750 hours/month (sleeps after inactivity)
- **Vercel**: Free - Unlimited projects, 100GB bandwidth
- **Total**: $0/month

### Paid Tier (Recommended for production)
- **Render**: $7/month (always-on, 512MB RAM)
- **Vercel**: Free or $20/month for team features
- **Total**: $7-27/month

---

## 🚀 Quick Reference

### URLs After Deployment
```
Frontend: https://your-project.vercel.app
Backend:  https://your-backend.onrender.com
Health:   https://your-backend.onrender.com/health
API Docs: https://your-backend.onrender.com/docs
```

### Essential Commands
```bash
# Test backend locally
py run_server.py

# Test frontend locally
npm run dev

# Build frontend
npm run build

# Git commands
git add .
git commit -m "Your message"
git push origin main
```

### Environment Variables Checklist
**Render (Backend):**
- [ ] BREVO_API_KEY
- [ ] BREVO_FROM_EMAIL
- [ ] BREVO_FROM_NAME
- [ ] GEMINI_API_KEY
- [ ] DEBUG=False
- [ ] PYTHON_VERSION=3.11.0

**Vercel (Frontend):**
- [ ] NEXT_PUBLIC_API_URL

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible at `/health` endpoint
- [ ] Frontend deployed and loads correctly
- [ ] Email sending works (send test email)
- [ ] AI generation works
- [ ] File attachments work
- [ ] Error messages display properly
- [ ] No console errors in browser
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Backups configured (optional)

---

## 🆘 Need Help?

**Render Documentation**: https://render.com/docs
**Vercel Documentation**: https://vercel.com/docs
**FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
**Next.js Deployment**: https://nextjs.org/docs/deployment

---

## 🎉 Congratulations!

Your application is now live! Share your URL and start sending emails! 📧

**Your URLs:**
- Frontend: `https://[your-project].vercel.app`
- Backend: `https://[your-service].onrender.com`

Remember to monitor your application and check logs regularly.
