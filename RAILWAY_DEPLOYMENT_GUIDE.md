# 🚀 HMIS Deployment Guide for Railway

## ✅ Railway Configuration

Railway is a great free alternative to Render with $5 monthly credit (enough for small projects).

## 🗄️ Step 1: Create PostgreSQL Database

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Provision PostgreSQL"**
4. **Copy the database URL** (you'll need this for Step 3)

## 🌐 Step 2: Deploy Backend

1. **Click "New Service" → "GitHub Repo"**
2. **Connect your repo**: `rejo132/hmis-fullstack`
3. **Configure:**
   - **Root Directory**: `backend`
   - **Environment**: Python
4. **Add Environment Variables:**
   ```
   DATABASE_URL=<your_postgresql_url>
   FLASK_ENV=production
   FLASK_APP=app.py
   JWT_SECRET_KEY=<generate_random_string>
   SECRET_KEY=<generate_random_string>
   CORS_ORIGINS=https://your-frontend-url.railway.app
   ```
5. **Deploy**

## 🎨 Step 3: Deploy Frontend

1. **Click "New Service" → "GitHub Repo"**
2. **Connect your repo**: `rejo132/hmis-fullstack`
3. **Configure:**
   - **Root Directory**: `frontend`
   - **Environment**: Node.js
4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   REACT_APP_API_URL=https://your-backend-url.railway.app
   GENERATE_SOURCEMAP=false
   ```
5. **Deploy**

## 🔗 Expected URLs

After deployment, you'll get:
- **Frontend**: `https://hmis-frontend-production-xxxx.up.railway.app`
- **Backend**: `https://hmis-backend-production-xxxx.up.railway.app`

## ⏱️ Timeline

- **Database creation**: ~1 minute
- **Backend deployment**: ~2-3 minutes
- **Frontend deployment**: ~2-3 minutes
- **Total**: ~5-7 minutes

## ✅ Verification Checklist

- [ ] Database created and accessible
- [ ] Backend service deployed successfully
- [ ] Frontend service deployed successfully
- [ ] Environment variables configured
- [ ] Login functionality works
- [ ] All user roles accessible

## 🆘 Troubleshooting

If you encounter issues:
1. Check Railway logs for each service
2. Verify DATABASE_URL is correct
3. Ensure all environment variables are set
4. Check if database migrations ran successfully

## 💰 Cost

- **Free tier**: $5 credit monthly
- **Your HMIS**: Should cost ~$2-3/month
- **Remaining credit**: $2-3 for other projects

**Your HMIS system is ready for Railway deployment! 🎉** 