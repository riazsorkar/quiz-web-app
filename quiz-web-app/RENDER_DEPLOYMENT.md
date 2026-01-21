# Deploying QuizMaster to Render.com (Free Tier)

This guide will help you deploy your QuizMaster application to Render.com's free tier.

## Prerequisites

1. **GitHub Account** - You need to push your code to GitHub
2. **Render.com Account** - Sign up at https://render.com (free)
3. **Git Repository** - Your code should be in a GitHub repository

## Free Tier Limitations

Render.com free tier includes:
- ✅ Free PostgreSQL database (expires after 90 days, but you can create a new one)
- ✅ 750 hours/month of runtime per service (enough for 24/7 operation)
- ⚠️ Services spin down after 15 minutes of inactivity (cold starts take ~30 seconds)
- ⚠️ 512 MB RAM per service

## Deployment Methods

### Method 1: Automatic Deployment with render.yaml (Recommended)

#### Step 1: Push Code to GitHub

```bash
cd c:\Projects\quiz-web-app\quiz-web-app
git init
git add .
git commit -m "Initial commit for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quiz-web-app.git
git push -u origin main
```

#### Step 2: Connect to Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` and deploy all services

#### Step 3: Wait for Deployment

- PostgreSQL: ~2-3 minutes
- Backend: ~5-10 minutes (Maven build)
- Frontend: ~3-5 minutes (Next.js build)

#### Step 4: Update CORS Settings

After deployment, you need to update CORS in the backend:

1. Note your frontend URL (e.g., `https://quiz-frontend.onrender.com`)
2. Update `WebSecurityConfig.java` CORS configuration
3. Push the update to GitHub
4. Render will auto-redeploy

### Method 2: Manual Service Creation

If you prefer manual setup:

#### 1. Create PostgreSQL Database

1. Dashboard → **New +** → **PostgreSQL**
2. Name: `quiz-postgres`
3. Database: `quiz_app`
4. User: `postgres`
5. Region: `Oregon (US West)`
6. Plan: **Free**
7. Click **Create Database**

**Save these credentials:**
- Internal Database URL
- External Database URL
- Username
- Password

#### 2. Create Backend Service

1. Dashboard → **New +** → **Web Service**
2. Connect your GitHub repository
3. Configuration:
   - **Name**: `quiz-backend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile.render`
   - **Plan**: `Free`

4. **Environment Variables**:
   ```
   SPRING_DATASOURCE_URL=<Your Postgres Internal Connection String>
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=<Your DB Password>
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   JWT_SECRET=<Generate a random 64-character string>
   ```

5. Click **Create Web Service**

#### 3. Create Frontend Service

1. Dashboard → **New +** → **Web Service**
2. Connect your GitHub repository
3. Configuration:
   - **Name**: `quiz-frontend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile.render`
   - **Plan**: `Free`

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=<Your Backend URL>/api
   ```
   Example: `https://quiz-backend.onrender.com/api`

5. Click **Create Web Service**

## Post-Deployment Configuration

### Update Backend CORS

After getting your frontend URL, update the backend:

**File: `backend/src/main/java/com/quiz/security/WebSecurityConfig.java`**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Add both local and production URLs
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",
        "https://quiz-frontend.onrender.com"  // Your Render frontend URL
    ));
    
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Auth-Token"));
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### Update Frontend API URL

**File: `frontend/src/lib/api.ts`**

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

## Environment Variables Reference

### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://...` | PostgreSQL connection string |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `<generated>` | Database password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | DDL mode (use `update` for production) |
| `JWT_SECRET` | `<64-char-string>` | JWT signing secret |
| `PORT` | Auto-set by Render | Application port |

### Frontend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://quiz-backend.onrender.com/api` | Backend API URL |
| `PORT` | Auto-set by Render | Application port |

## Monitoring & Logs

### View Logs

1. Go to your service in Render Dashboard
2. Click **Logs** tab
3. Watch real-time logs for errors

### Monitor Performance

1. Dashboard → Your Service → **Metrics**
2. Check CPU, Memory, Request count

### Health Checks

- Backend: `https://quiz-backend.onrender.com/actuator/health`
- Frontend: `https://quiz-frontend.onrender.com`

## Common Issues & Solutions

### Issue 1: Service Won't Start

**Solution:** Check logs for errors. Common causes:
- Missing environment variables
- Database connection issues
- Port configuration

### Issue 2: CORS Errors

**Solution:**
1. Verify frontend URL in backend CORS config
2. Ensure `allowCredentials` is set to `true`
3. Redeploy backend after changes

### Issue 3: Cold Starts (15-minute timeout)

**Problem:** Free tier services spin down after 15 minutes of inactivity

**Solutions:**
1. Accept the 30-second cold start delay
2. Use a service like UptimeRobot to ping your app every 14 minutes
3. Upgrade to paid plan ($7/month per service)

### Issue 4: Database Connection Errors

**Solution:**
1. Use **Internal Database URL** (faster, free data transfer)
2. Verify database credentials
3. Ensure database is in same region as backend

### Issue 5: Build Failures

**Backend Build Timeout:**
- Maven builds can take 5-10 minutes
- Render free tier has 15-minute build timeout (should be fine)

**Frontend Build Issues:**
- Ensure `output: 'standalone'` in `next.config.ts`
- Check Node.js version compatibility

## Optimization Tips

### 1. Reduce Cold Start Time

**Backend:**
- Use lighter base images
- Minimize dependencies
- Consider GraalVM native image (advanced)

**Frontend:**
- Enable Next.js image optimization
- Use static generation where possible

### 2. Database Optimization

- Use connection pooling (already configured in Spring Boot)
- Index frequently queried columns
- Regular VACUUM operations

### 3. Caching

- Enable Redis (Render has free Redis too!)
- Cache quiz data
- Use browser caching for static assets

## URLs After Deployment

Your application will be available at:

- **Frontend**: `https://quiz-frontend.onrender.com`
- **Backend**: `https://quiz-backend.onrender.com`
- **API**: `https://quiz-backend.onrender.com/api`

## Cost Breakdown (Free Tier)

| Service | Cost | Notes |
|---------|------|-------|
| PostgreSQL | Free | 90 days, then need new instance |
| Backend Web Service | Free | 750 hours/month |
| Frontend Web Service | Free | 750 hours/month |
| **Total** | **$0/month** | Perfect for testing/portfolio! |

## Upgrading to Paid (Optional)

If you need better performance:

| Plan | Price | Benefits |
|------|-------|----------|
| Starter | $7/month/service | No spin-down, more RAM |
| Standard | $25/month/service | 4GB RAM, priority support |

## Next Steps

1. ✅ Deploy to Render
2. ✅ Test all functionality
3. ✅ Set up custom domain (optional, requires paid plan)
4. ✅ Add monitoring (UptimeRobot)
5. ✅ Share your portfolio project!

## Support

- Render Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

## Alternative: Deploy to Railway.app

If you prefer Railway.app (also has free tier):
- Similar process
- Use railway.json instead of render.yaml
- $5 free credit per month
- Better free tier DX

---

**Your QuizMaster app is now ready for the cloud! 🚀**
