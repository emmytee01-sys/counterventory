class ApiConstants {
  // Base URL - Change this to your backend URL
  // Choose the appropriate URL based on where you're running the app:
  
  // 🚀 PRODUCTION - Render Deployment
  static const String baseUrl = 'https://counterventory.onrender.com/api';
  
  // For Local Development (uncomment when testing locally):
  // static const String baseUrl = 'http://localhost:3000/api';
  
  // For Physical Device (your Mac's IP - uncomment to use):
  // static const String baseUrl = 'http://192.168.0.121:3000/api';
  
  // For Android Emulator (uncomment to use):
  // static const String baseUrl = 'http://10.0.2.2:3000/api';
  
  // For iOS Simulator (uncomment to use):
  // static const String baseUrl = 'http://localhost:3000/api';
  
  // Auth endpoints
  static const String login = '/auth/login';
  static const String me = '/auth/me';
  
  // Product endpoints
  static const String products = '/products';
  static String productByQR(String qrCode) => '/products/qr/$qrCode';
  
  // Count endpoints
  static const String tempCounts = '/counts/temp';
  static String tempCountsByUser(String userId) => '/counts/temp/$userId';
  static String deleteTempCount(String id) => '/counts/temp/$id';
  static String submitCounts(String userId) => '/counts/submit/$userId';
  static const String stats = '/counts/stats';
  
  // Admin endpoints
  static const String adminUsers = '/admin/users';
  static String exportUser(String userId) => '/admin/export/user/$userId';
  static const String exportAll = '/admin/export/all';
}

