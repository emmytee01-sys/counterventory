# Counterventory - Inventory Counting App

A Flutter mobile inventory counting app with offline support, backed by Node.js + Express and MongoDB Atlas.

![Counterventory Logo](logo.jpeg)

## 🎯 Features

- **QR Code Scanning**: Quickly scan products using built-in camera
- **Offline Support**: Count inventory without internet connection
- **Auto Sync**: Automatically sync data when internet is available
- **Role-Based Access**: User and Admin roles with different permissions
- **Real-time Dashboard**: View counting statistics in real-time
- **Excel Export**: Export inventory data to Excel (.xlsx) format
- **Secure Authentication**: JWT-based authentication
- **Clean Architecture**: Well-organized code structure

## 🛠 Tech Stack

### Frontend (Mobile App)
- **Flutter** - Cross-platform mobile framework
- **Provider** - State management
- **Hive** - Local database for offline storage
- **Mobile Scanner** - QR code scanning
- **Material UI** - Modern UI design

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Authentication
- **ExcelJS** - Excel export functionality

## 📋 Prerequisites

### Backend
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Flutter App
- Flutter SDK (v3.0 or higher)
- Dart SDK
- Android Studio / Xcode
- Physical device or emulator

## 🚀 Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your MongoDB Atlas credentials
# Update the following:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: A secure random string

# Seed database with sample data
node scripts/seedData.js

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:3000`

### 2. Flutter App Setup

```bash
# Navigate to Flutter app directory
cd flutter_app

# Install dependencies
flutter pub get

# Generate Hive adapters (if needed)
flutter pub run build_runner build

# Update API endpoint
# Edit lib/core/constants/api_constants.dart
# Change baseUrl to your backend URL:
# - For Android Emulator: http://10.0.2.2:3000/api
# - For iOS Simulator: http://localhost:3000/api
# - For Physical Device: http://YOUR_COMPUTER_IP:3000/api

# Copy logo to assets
mkdir -p assets/images
cp ../logo.jpeg assets/

# Run the app
flutter run
```

## 🔐 Default Credentials

After running the seed script, you can login with these credentials:

### Admin Account
- Username: `admin`
- Password: `admin123`

### User Accounts
- Username: `john` / Password: `password123`
- Username: `jane` / Password: `password123`

## 📱 App Flow

### For Users:
1. **Login** - Enter username and password
2. **Dashboard** - View today's count statistics
3. **Start Counting** - Tap to open QR scanner
4. **Scan QR Code** - Scan product barcode
5. **Enter Details** - Input quantity and price
6. **Save Count** - Count is saved locally (syncs when online)
7. **View Counts** - See all your counts
8. **Submit Counts** - Submit final count (locks permanently)

### For Admins:
- All user features
- View all users and their statistics
- Export per-user inventory to Excel
- Export all inventory combined to Excel

## 🔄 Offline Mode

The app fully supports offline counting:

1. **Offline Scanning**: Scan QR codes without internet
2. **Local Storage**: All counts saved to device using Hive
3. **Sync Indicator**: Visual indicator shows online/offline status
4. **Auto Sync**: When internet returns, data syncs automatically
5. **Submit Online Only**: Final submission requires internet connection

### How It Works:
- Every scan is saved immediately to local storage with `synced: false`
- When online, the app automatically syncs unsynced records
- After successful sync, records are marked as `synced: true`
- Submission only works when all records are synced

## 📊 Database Models

### User
```javascript
{
  username: String (unique),
  passwordHash: String,
  role: String (admin | user),
  createdAt: Date
}
```

### Product
```javascript
{
  qrCode: String (unique),
  name: String,
  sku: String (unique),
  description: String,
  category: String
}
```

### TemporaryCount
```javascript
{
  userId: ObjectId,
  productId: ObjectId,
  quantity: Number,
  price: Number,
  synced: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### MasterInventory
```javascript
{
  userId: ObjectId,
  productId: ObjectId,
  quantity: Number,
  price: Number,
  submittedAt: Date,
  batchId: String
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/qr/:code` - Get product by QR code
- `POST /api/products` - Create product (Admin only)

### Counts
- `POST /api/counts/temp` - Save temporary count
- `GET /api/counts/temp/:userId` - Get user's temporary counts
- `DELETE /api/counts/temp/:id` - Delete temporary count
- `POST /api/counts/submit/:userId` - Submit counts to master inventory
- `GET /api/counts/stats` - Get counting statistics

### Admin
- `GET /api/admin/users` - Get all users with statistics
- `GET /api/admin/export/user/:userId` - Export user inventory (Excel)
- `GET /api/admin/export/all` - Export all inventory (Excel)

## 🎨 Color Scheme

Based on the Counterventory logo:

- **Primary Blue**: `#2C4A68` - Main app color
- **Accent Red**: `#C94D4D` - Highlights and accents
- **Background**: `#F5F5F5` - App background
- **Success**: `#4CAF50` - Success states
- **Error**: `#F44336` - Error states
- **Warning**: `#FF9800` - Warning states

## 📁 Project Structure

### Backend
```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── TemporaryCount.js    # Temporary count model
│   └── MasterInventory.js   # Master inventory model
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product logic
│   ├── countController.js   # Count logic
│   └── adminController.js   # Admin logic
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Auth routes
│   ├── products.js          # Product routes
│   ├── counts.js            # Count routes
│   └── admin.js             # Admin routes
├── scripts/
│   └── seedData.js          # Database seeding
├── server.js                # Entry point
└── package.json
```

### Flutter App
```
flutter_app/
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   │   ├── app_colors.dart
│   │   │   └── api_constants.dart
│   │   ├── models/
│   │   │   ├── user_model.dart
│   │   │   ├── product_model.dart
│   │   │   └── count_model.dart
│   │   └── services/
│   │       ├── storage_service.dart
│   │       ├── api_service.dart
│   │       └── sync_service.dart
│   ├── providers/
│   │   ├── auth_provider.dart
│   │   ├── product_provider.dart
│   │   └── count_provider.dart
│   ├── screens/
│   │   ├── splash_screen.dart
│   │   ├── login_screen.dart
│   │   ├── dashboard_screen.dart
│   │   ├── scanner_screen.dart
│   │   ├── product_details_screen.dart
│   │   ├── count_list_screen.dart
│   │   └── admin_screen.dart
│   └── main.dart
└── pubspec.yaml
```

## 🔒 Security Features

- JWT-based authentication
- Secure password hashing with bcrypt
- Secure token storage using Flutter Secure Storage
- Role-based access control
- API endpoint protection

## 🧪 Testing

### Testing Backend Endpoints

Use tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"password123"}'

# Get product by QR (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/api/products/qr/QR001 \
  -H "Authorization: Bearer TOKEN"
```

### Testing Flutter App

```bash
# Run tests
flutter test

# Run with specific device
flutter run -d <device_id>
```

## 📝 Sample QR Codes

After seeding the database, these QR codes are available:

- QR001 - Laptop Dell XPS 15
- QR002 - iPhone 15 Pro
- QR003 - Samsung Galaxy S24
- QR004 - Wireless Mouse
- QR005 - USB-C Cable
- QR006 - Mechanical Keyboard
- QR007 - Monitor 27 inch
- QR008 - Webcam HD
- QR009 - External SSD 1TB
- QR010 - Headphones Wireless

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Verify MongoDB Atlas credentials in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**Port Already in Use**
- Change PORT in `.env` file
- Kill process using port 3000: `lsof -ti:3000 | xargs kill`

### Flutter Issues

**Cannot Connect to Backend**
- Update `baseUrl` in `api_constants.dart`
- Use correct IP for physical devices
- Ensure backend server is running

**QR Scanner Not Working**
- Grant camera permissions
- Test on physical device (simulators have limited camera support)

**Build Errors**
- Run `flutter clean`
- Run `flutter pub get`
- Rebuild: `flutter run`

## 🚀 Deployment

### Backend Deployment

Deploy to platforms like:
- **Heroku**: Easy deployment with Git
- **AWS EC2**: Full control
- **DigitalOcean**: Droplets
- **Railway**: Modern deployment

### Mobile App Deployment

```bash
# Android
flutter build apk --release

# iOS
flutter build ios --release
```

Then submit to:
- Google Play Store (Android)
- Apple App Store (iOS)

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check Flutter and Node.js documentation

## 🎉 Credits

Built with:
- Flutter framework
- Node.js & Express
- MongoDB Atlas
- Material Design
- Open source packages

---

**SCAN. COUNT. INVENTORY.** 📦✨

