# Quick Render.com Deployment Guide

## Prerequisites
✅ GitHub account  
✅ Render.com account (free)  
✅ Code pushed to GitHub repository

## Steps to Deploy

### 1️⃣ Push Code to GitHub

```bash
cd c:\Projects\quiz-web-app\quiz-web-app

# Initialize git if not already done
git init
git add .
git commit -m "Prepare for Render deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/quiz-web-app.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select the `quiz-web-app` repository
5. Click **"Apply"**

Render will automatically:
- Create PostgreSQL database
- Build and deploy backend (takes ~8-10 minutes)
- Build and deploy frontend (takes ~3-5 minutes)

### 3️⃣ Configure Environment Variables

After deployment starts, you need to set two environment variables manually:

**Backend Service** (`quiz-backend`):
1. Go to quiz-backend → Environment
2. Add variable:
   - **Key**: `CORS_ALLOWED_ORIGINS`
   - **Value**: `https://quiz-frontend.onrender.com` (use your actual frontend URL)

**Frontend Service** (`quiz-frontend`):
1. Go to quiz-frontend → Environment
2. Add variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://quiz-backend.onrender.com/api` (use your actual backend URL)

3. **Redeploy both services** after setting variables:
   - Click "Manual Deploy" → "Deploy latest commit"

### 4️⃣ Access Your App

Your URLs will be:
- **Frontend**: `https://quiz-frontend.onrender.com`
- **Backend API**: `https://quiz-backend.onrender.com/api`
- **Health Check**: `https://quiz-backend.onrender.com/actuator/health`

### 5️⃣ Login Credentials

Use these seeded accounts:
- **Student**: `test@quiz.com` / `password123`
- **Admin**: `admin@quiz.com` / `admin123`

## Important Notes

⚠️ **Free Tier Limitations**:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- PostgreSQL free database expires after 90 days

💡 **Tips**:
- Use UptimeRobot.com to ping your app every 14 minutes (keeps it awake)
- Database data persists even with free tier cold starts
- Monitor deployment logs in Render dashboard

## Troubleshooting

**Build Failed?**
- Check logs in Render dashboard
- Ensure Dockerfiles are in correct paths
- Verify environment variables are set

**CORS Errors?**
- Update `CORS_ALLOWED_ORIGINS` with your exact frontend URL
- Redeploy backend after updating

**Database Connection Error?**
- Database takes 2-3 minutes to provision
- Backend will retry automatically once DB is ready

**Frontend Can't Reach Backend?**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Must include `/api` at the end
- Redeploy frontend after updating

## Cost

**Totally Free!** 🎉
- PostgreSQL: Free (90 days)
- Backend: Free (750 hours/month)
- Frontend: Free (750 hours/month)

Perfect for portfolio projects and demos!

---

Need help? Check the full guide in [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
