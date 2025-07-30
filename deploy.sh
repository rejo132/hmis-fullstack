#!/bin/bash

echo "🚀 HMIS 100% FREE Deployment Script"
echo "=================================="
echo ""

echo "📋 Prerequisites:"
echo "1. GitHub repository: rejo132/hmis-fullstack"
echo "2. Railway account: https://railway.app"
echo "3. Vercel account: https://vercel.com"
echo ""

echo "🗄️ Step 1: Create Railway PostgreSQL Database"
echo "   - Go to https://railway.app"
echo "   - Sign up with GitHub"
echo "   - Click 'New Project' → 'Provision PostgreSQL'"
echo "   - Copy the database URL"
echo ""

echo "🌐 Step 2: Deploy Backend to Railway"
echo "   - Click 'New Service' → 'GitHub Repo'"
echo "   - Connect repo: rejo132/hmis-fullstack"
echo "   - Root Directory: backend"
echo "   - Environment: Python"
echo "   - Add environment variables (see FREE_DEPLOYMENT_GUIDE.md)"
echo ""

echo "🎨 Step 3: Deploy Frontend to Vercel"
echo "   - Go to https://vercel.com"
echo "   - Sign up with GitHub"
echo "   - Click 'New Project'"
echo "   - Import repo: rejo132/hmis-fullstack"
echo "   - Root Directory: frontend"
echo "   - Add REACT_APP_API_URL environment variable"
echo ""

echo "✅ Expected URLs:"
echo "   - Frontend: https://hmis-fullstack.vercel.app"
echo "   - Backend: https://hmis-backend-production-xxxx.up.railway.app"
echo ""

echo "🎯 Total Cost: $0/month"
echo "⏱️  Total Time: ~5 minutes"
echo ""

echo "📖 For detailed instructions, see: FREE_DEPLOYMENT_GUIDE.md"
echo ""

echo "🚀 Ready to deploy! Good luck with your presentation! 🎉" 