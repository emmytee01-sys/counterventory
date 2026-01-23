# 🚀 Deployment Guide - Counterventory Backend to Render

## 📋 Prerequisites

- [x] GitHub account
- [x] Render account (free tier available at https://render.com)
- [x] MongoDB Atlas connection string

---

## 🔧 Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
cd /Users/macbook/counterventory

# Add all files
git add .

# Commit
git commit -m "Initial commit - Counterventory backend and Flutter app"

# Push to GitHub
git push -u origin main
```

---

## ☁️ Step 2: Deploy to Render

### A. Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `emmytee01-sys/counterventory`
4. Configure:
   - **Name**: `counterventory-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### B. Add Environment Variables

Click **"Advanced"** and add these environment variables:

```
MONGODB_URI=mongodb+srv://tiffanypowers290_db_user:1UbBDw2BsmO2JTPV@cluster0.3rpcsqw.mongodb.net/counterventory?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=counterventory-production-secret-key-2024-change-this

JWT_EXPIRE=7d

PORT=3000
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` to a strong random string for production!

### C. Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. You'll get a URL like: `https://counterventory-backend.onrender.com`

---

## 🔒 Step 3: Update MongoDB Atlas

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Add: `0.0.0.0/0` (allows Render to connect)
4. Click **"Confirm"**

---

## 📱 Step 4: Update Flutter App

Once deployed, update your Flutter app to use the production URL:

**File**: `flutter_app/lib/core/constants/api_constants.dart`

```dart
// For Production (Render)
static const String baseUrl = 'https://counterventory-backend.onrender.com/api';

// For Local Development (uncomment when testing locally)
// static const String baseUrl = 'http://localhost:3000/api';
```

---

## ✅ Step 5: Test Deployment

Test your deployed backend:

```bash
# Health check
curl https://counterventory-backend.onrender.com/health

# Test login
curl -X POST https://counterventory-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'
```

Should return a JWT token!

---

## 🔄 Step 6: Seed Production Database

After first deployment, seed the database:

### Option A: Using Render Shell

1. Go to Render Dashboard → Your Service
2. Click **"Shell"** tab
3. Run:
```bash
node scripts/seedDataFromCSV.js
```

### Option B: Using API Endpoint (Recommended)

Create a one-time admin endpoint or run locally pointing to production MongoDB.

---

## 🎯 Your Deployed URLs

After deployment, you'll have:

- **Backend API**: `https://counterventory-backend.onrender.com/api`
- **Health Check**: `https://counterventory-backend.onrender.com/health`
- **Login**: `https://counterventory-backend.onrender.com/api/auth/login`

---

## 📊 Import Products to Production

After deployment, import your CSV:

```bash
# Option 1: Using Render Shell
# In Render dashboard → Shell tab
node scripts/importFromCSV.js "../Counterventory Import Inventory Format  - example.csv"

# Option 2: Create upload endpoint (Admin only)
POST /api/products/import
```

---

## ⚙️ Render Configuration

### Auto-Deploy

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically rebuild and deploy!

### Environment Variables

To update environment variables:
1. Render Dashboard → Your Service
2. **"Environment"** tab
3. Add/Edit variables
4. Click **"Save Changes"**
5. Render auto-redeploys

---

## 🆓 Free Tier Limits

Render Free Tier includes:
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ Auto-deploy from GitHub
- ✅ SSL/HTTPS included
- ⚠️ Sleeps after 15 min of inactivity
- ⚠️ Cold start takes ~30 seconds

**Note**: First request may be slow due to cold start.

---

## 🔐 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to strong random string
- [ ] Update MongoDB IP whitelist
- [ ] Remove test user accounts
- [ ] Change admin password
- [ ] Enable MongoDB authentication
- [ ] Review CORS settings
- [ ] Add rate limiting
- [ ] Enable logging

---

## 📱 Flutter App Build for Production

### Android APK

```bash
cd flutter_app
flutter build apk --release
```

APK at: `build/app/outputs/flutter-apk/app-release.apk`

### iOS

```bash
flutter build ios --release
```

Then use Xcode to archive and submit to App Store.

---

## 🐛 Troubleshooting

### "Service Unavailable"
- Check Render logs: Dashboard → Logs tab
- Verify MongoDB connection string
- Check environment variables

### "Cannot connect to MongoDB"
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string is correct
- Ensure MongoDB user has proper permissions

### "Cold Start Slow"
- First request wakes up the service (30 sec)
- Upgrade to paid plan for always-on service
- Or use a cron job to ping every 14 minutes

---

## 💰 Upgrade Options

If you need more:
- **Starter**: $7/month - Always on, no cold starts
- **Standard**: $25/month - More resources
- **Pro**: Custom pricing

---

## 📊 Monitoring

Monitor your deployment:
1. **Render Dashboard** - Logs, metrics, deployments
2. **MongoDB Atlas** - Database performance
3. **Add monitoring** - New Relic, Datadog, Sentry

---

## 🎉 Success!

Your backend is now live at:
`https://counterventory-backend.onrender.com`

Update your Flutter app and start counting! 📦✨

