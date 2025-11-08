# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment.

## Pre-Deployment Preparation

### 1. Code Preparation
- [ ] All code changes committed
- [ ] Application tested locally (frontend + backend)
- [ ] No hardcoded secrets or API keys in code
- [ ] `.gitignore` updated to exclude sensitive files
- [ ] Environment variables documented

### 2. GitHub Setup
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Repository is public or accessible to Render/Vercel
- [ ] Default branch is `main`

### 3. API Keys Ready
- [ ] Brevo API Key
- [ ] Brevo sender email (verified in Brevo)
- [ ] Google Gemini API Key
- [ ] All keys tested and working

---

## Backend Deployment (Render)

### 4. Render Account Setup
- [ ] Render account created (https://render.com)
- [ ] GitHub connected to Render

### 5. Deploy Backend
- [ ] New Web Service created
- [ ] Repository selected
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Python version set to 3.11.0

### 6. Environment Variables (Render)
- [ ] `BREVO_API_KEY` added
- [ ] `BREVO_FROM_EMAIL` added
- [ ] `BREVO_FROM_NAME` added
- [ ] `GEMINI_API_KEY` added
- [ ] `DEBUG` set to `False`
- [ ] `APP_NAME` added (optional)
- [ ] `APP_VERSION` added (optional)

### 7. Backend Verification
- [ ] Deployment successful (green status)
- [ ] Backend URL noted: `https://__________.onrender.com`
- [ ] Health endpoint works: `https://your-backend.onrender.com/health`
- [ ] API docs accessible: `https://your-backend.onrender.com/docs`

---

## Frontend Deployment (Vercel)

### 8. Update Frontend Configuration
- [ ] Created `.env.local` with backend URL
- [ ] Updated `NEXT_PUBLIC_API_URL` to Render backend URL
- [ ] Changes committed and pushed to GitHub

### 9. Vercel Account Setup
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub connected to Vercel

### 10. Deploy Frontend
- [ ] Project imported from GitHub
- [ ] Framework detected as Next.js
- [ ] Build settings auto-configured

### 11. Environment Variables (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` added with Render backend URL
- [ ] Example: `https://your-backend.onrender.com` (no trailing slash)

### 12. Frontend Verification
- [ ] Deployment successful
- [ ] Frontend URL noted: `https://__________.vercel.app`
- [ ] Website loads without errors
- [ ] No 404 errors in browser console

---

## Testing

### 13. Functionality Testing
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Email form displays
- [ ] Can type in email fields
- [ ] Rich text editor works (formatting buttons)
- [ ] File upload works (drag & drop)
- [ ] AI generation button works
- [ ] AI generates email content
- [ ] Can send email successfully
- [ ] Receive success message after sending
- [ ] Email arrives in recipient inbox
- [ ] Email attachments received correctly

### 14. Error Handling Testing
- [ ] Try sending without filling required fields
- [ ] Try uploading oversized file (>25MB)
- [ ] Try invalid email address
- [ ] Error messages display correctly

### 15. Performance Testing
- [ ] First load time acceptable (<5 seconds)
- [ ] Backend wakes from sleep (if free tier) within 60 seconds
- [ ] Subsequent requests are fast (<2 seconds)

---

## Post-Deployment

### 16. Documentation
- [ ] Backend URL documented
- [ ] Frontend URL documented
- [ ] Environment variables documented
- [ ] Deployment process documented

### 17. Monitoring Setup (Optional)
- [ ] Check Render logs for errors
- [ ] Check Vercel deployment logs
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Set up error tracking (Sentry)

### 18. Custom Domains (Optional)
- [ ] Custom domain added to Vercel
- [ ] DNS configured
- [ ] SSL certificate provisioned
- [ ] Custom backend domain added to Render (optional)

### 19. Security
- [ ] All environment variables use production keys
- [ ] No sensitive data in GitHub repository
- [ ] CORS configured properly
- [ ] Rate limiting working

### 20. Final Verification
- [ ] Send test email from production
- [ ] Check email delivered successfully
- [ ] Share app URL with friends/testers
- [ ] Collect feedback
- [ ] Fix any issues found

---

## Troubleshooting

If anything fails, check:

1. **Backend not starting?**
   - Check Render logs
   - Verify all environment variables set
   - Verify Python version matches

2. **Frontend can't connect to backend?**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check CORS settings in backend
   - Test backend URL directly in browser

3. **Emails not sending?**
   - Check Brevo API key is valid
   - Verify sender email is verified in Brevo
   - Check Render logs for errors

4. **AI generation not working?**
   - Verify Gemini API key is valid
   - Check API quota in Google AI Studio
   - Check backend logs

---

## Success! 🎉

When all items are checked, your application is fully deployed and operational!

**Your Live URLs:**
- Frontend: https://__________.vercel.app
- Backend: https://__________.onrender.com
- API Docs: https://__________.onrender.com/docs

**Next Steps:**
- Share your app
- Monitor usage
- Collect feedback
- Plan improvements
- Consider upgrading to paid plans if needed

---

## Need Help?

Refer to `DEPLOYMENT_GUIDE.md` for detailed instructions.
