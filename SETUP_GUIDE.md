# 🚀 Quick Setup Guide - Counterventory

This guide will help you get Counterventory running in under 10 minutes!

## Prerequisites Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB Atlas account created
- [ ] Flutter SDK installed (v3.0+)
- [ ] Android Studio or Xcode installed

## Step 1: MongoDB Atlas Setup (5 minutes)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE shared cluster
   - Select your region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Save credentials securely

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go to "Database" > "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

## Step 2: Backend Setup (3 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=counterventory-secret-key-change-in-production
JWT_EXPIRE=7d
EOF

# 4. Edit .env and paste your MongoDB connection string

# 5. Seed database with sample data
node scripts/seedData.js

# 6. Start server
npm start
```

You should see: `Server running on port 3000` and `MongoDB Connected`

## Step 3: Flutter App Setup (2 minutes)

```bash
# 1. Navigate to Flutter app
cd ../flutter_app

# 2. Install dependencies
flutter pub get

# 3. Copy logo
mkdir -p assets/images
cp ../logo.jpeg assets/

# 4. Update API endpoint (IMPORTANT!)
# Open: lib/core/constants/api_constants.dart
# Change baseUrl based on your setup:

# For Android Emulator:
static const String baseUrl = 'http://10.0.2.2:3000/api';

# For iOS Simulator:
static const String baseUrl = 'http://localhost:3000/api';

# For Physical Device (replace with your computer's IP):
static const String baseUrl = 'http://192.168.1.100:3000/api';

# 5. Run the app
flutter run
```

## Step 4: Test the App

### Login
1. Open the app
2. Use these credentials:
   - Username: `john`
   - Password: `password123`

### Scan QR Code
1. Click "Start Counting"
2. Create a QR code for testing:
   - Go to [qr-code-generator.com](https://www.qr-code-generator.com)
   - Enter: `QR001`
   - Generate and display on another screen
   - Scan it with the app

3. Enter quantity: `10`
4. Enter price: `25.50`
5. Click "Save Count"

### View Your Counts
1. Go back to dashboard
2. Click "View Counts"
3. See your saved count
4. Click "Submit All Counts" when ready

### Admin Features (Optional)
1. Logout
2. Login as admin:
   - Username: `admin`
   - Password: `admin123`
3. Click "Admin Panel"
4. View all users
5. Export data to Excel

## 🎯 Finding Your Computer's IP Address

### macOS/Linux
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Windows
```bash
ipconfig
```

Look for "IPv4 Address" - usually starts with `192.168.x.x`

## ✅ Success Checklist

- [ ] Backend server running without errors
- [ ] MongoDB connected successfully
- [ ] Flutter app compiled and running
- [ ] Can login with test credentials
- [ ] Can scan QR code (or manually test with QR001-QR010)
- [ ] Can save count and see it in list
- [ ] Can submit counts
- [ ] Admin can export Excel

## 🐛 Common Issues & Quick Fixes

### Issue: "Cannot connect to backend"
**Fix:** Update `baseUrl` in `api_constants.dart` with correct IP

### Issue: "MongoDB connection failed"
**Fix:** 
- Check connection string in `.env`
- Verify password is correct (no special characters issues)
- Check MongoDB Atlas IP whitelist

### Issue: "QR scanner not working"
**Fix:**
- Use physical device (not emulator)
- Grant camera permissions
- Ensure good lighting

### Issue: "Port 3000 already in use"
**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: "Flutter build failed"
**Fix:**
```bash
flutter clean
flutter pub get
flutter run
```

## 📱 Testing Without QR Scanner

You can test the product lookup by modifying the scanner temporarily:

1. Open `lib/screens/scanner_screen.dart`
2. Add a test button that calls `_onDetect` with a test QR code
3. Or create QR codes online and display them on another screen

Sample QR codes available after seeding:
- QR001 to QR010

## 🎨 Customization

### Change App Colors
Edit: `lib/core/constants/app_colors.dart`

### Change App Name
Edit: `flutter_app/pubspec.yaml` - change `name:`

### Add More Products
```bash
# In backend directory
node
# Then in Node REPL:
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
mongoose.connect(process.env.MONGODB_URI);

Product.create({
  qrCode: 'QR011',
  name: 'New Product',
  sku: 'SKU-011',
  category: 'Electronics'
});
```

## 📊 MongoDB Atlas Dashboard

Access your data:
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. See your databases and data

## 🔒 Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Restrict MongoDB IP whitelist to your server IP
- [ ] Enable HTTPS for backend
- [ ] Change default admin password
- [ ] Update API baseUrl to production URL
- [ ] Enable Firebase/Crashlytics for error tracking
- [ ] Test offline sync thoroughly
- [ ] Add loading states and error handling
- [ ] Optimize images and assets
- [ ] Run security audit on backend

## 🎓 Next Steps

Now that you're set up:

1. **Explore the Code**
   - Check out the clean architecture
   - See how offline sync works
   - Review the state management

2. **Customize**
   - Add your own products
   - Modify the UI to match your brand
   - Add new features

3. **Deploy**
   - Deploy backend to Heroku/Railway
   - Build APK/IPA for distribution
   - Share with your team

## 📚 Additional Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [JWT Best Practices](https://jwt.io/introduction)

## 💡 Tips

- **Development**: Use `npm run dev` for auto-reload on backend changes
- **Testing**: Install MongoDB Compass for local database exploration
- **Debugging**: Use Flutter DevTools for app debugging
- **API Testing**: Use Postman or Insomnia for API endpoint testing

---

**Need Help?** Check the main README.md or troubleshooting section!

Happy Counting! 📦✨

