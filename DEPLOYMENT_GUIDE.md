# 🚀 HMIS Deployment Guide for Render

## ✅ Fixed render.yaml Configuration

Your `render.yaml` is now valid and ready for deployment:

```yaml
services:
  - type: web
    name: hmis-backend
    env: python
    plan: free
    buildCommand: cd backend && pip install -r requirements.txt && flask db upgrade && python seed.py
    startCommand: cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app
    
  - type: web
    name: hmis-frontend
    env: static
    plan: free
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
```

## 🗄️ Step 1: Create PostgreSQL Database

1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "PostgreSQL"**
3. **Configure:**
   - **Name**: `hmis-database`
   - **Database**: `hmis_db`
   - **User**: `hmis_user`
   - **Plan**: Free
4. **Click "Create Database"**
5. **Copy the "External Database URL"** (you'll need this for Step 3)

## 🌐 Step 2: Deploy Services

1. **Click "New +" → "Blueprint"**
2. **Connect your GitHub repo**: `rejo132/hmis-fullstack`
3. **Click "Apply"** - This will deploy:
   - Backend API service
   - Frontend static service

## ⚙️ Step 3: Configure Database URL

1. **Go to your Backend service** (hmis-backend)
2. **Click "Environment" tab**
3. **Find `DATABASE_URL`**
4. **Replace the placeholder with your actual database URL** from Step 1
5. **Click "Save Changes"**
6. **Redeploy the service**

## 🔗 Expected URLs

After deployment, you'll get:
- **Frontend**: `https://hmis-frontend.onrender.com`
- **Backend**: `https://hmis-backend.onrender.com`

## ⏱️ Timeline

- **Database creation**: ~2 minutes
- **Backend deployment**: ~3-4 minutes
- **Frontend deployment**: ~2 minutes
- **Total**: ~7-8 minutes

## ✅ Verification Checklist

- [ ] Database created and accessible
- [ ] Backend service deployed successfully
- [ ] Frontend service deployed successfully
- [ ] DATABASE_URL configured correctly
- [ ] Login functionality works
- [ ] All user roles accessible

## 🆘 Troubleshooting

If you encounter issues:
1. Check Render logs for each service
2. Verify DATABASE_URL is correct
3. Ensure all environment variables are set
4. Check if database migrations ran successfully

**Your HMIS system is now ready for deployment! 🎉** 