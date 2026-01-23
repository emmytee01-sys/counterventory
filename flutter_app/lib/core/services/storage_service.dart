import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/count_model.dart';

class StorageService {
  static const String _countsBox = 'counts';
  static const String _settingsBox = 'settings';
  static const _secureStorage = FlutterSecureStorage();
  
  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  static const String _usernameKey = 'username';
  static const String _roleKey = 'role';

  static Future<void> init() async {
    // Register adapters
    if (!Hive.isAdapterRegistered(0)) {
      Hive.registerAdapter(CountModelAdapter());
    }
    
    // Open boxes
    await Hive.openBox<CountModel>(_countsBox);
    await Hive.openBox(_settingsBox);
  }

  // Auth Storage
  static Future<void> saveAuthToken(String token) async {
    await _secureStorage.write(key: _tokenKey, value: token);
  }

  static Future<String?> getAuthToken() async {
    return await _secureStorage.read(key: _tokenKey);
  }

  static Future<void> saveUserData({
    required String userId,
    required String username,
    required String role,
  }) async {
    await _secureStorage.write(key: _userIdKey, value: userId);
    await _secureStorage.write(key: _usernameKey, value: username);
    await _secureStorage.write(key: _roleKey, value: role);
  }

  static Future<Map<String, String?>> getUserData() async {
    return {
      'userId': await _secureStorage.read(key: _userIdKey),
      'username': await _secureStorage.read(key: _usernameKey),
      'role': await _secureStorage.read(key: _roleKey),
    };
  }

  static Future<void> clearAuth() async {
    await _secureStorage.delete(key: _tokenKey);
    await _secureStorage.delete(key: _userIdKey);
    await _secureStorage.delete(key: _usernameKey);
    await _secureStorage.delete(key: _roleKey);
  }

  // Counts Storage
  static Box<CountModel> get countsBox => Hive.box<CountModel>(_countsBox);

  static Future<void> saveCount(CountModel count) async {
    await countsBox.put(count.localId, count);
  }

  static List<CountModel> getAllCounts() {
    return countsBox.values.toList();
  }

  static List<CountModel> getUnsyncedCounts() {
    return countsBox.values.where((count) => !count.synced).toList();
  }

  static Future<void> deleteCount(String localId) async {
    await countsBox.delete(localId);
  }

  static Future<void> clearAllCounts() async {
    await countsBox.clear();
  }

  static CountModel? getCountByProductId(String productId, String userId) {
    try {
      return countsBox.values.firstWhere(
        (count) => count.productId == productId && count.userId == userId,
      );
    } catch (e) {
      return null;
    }
  }
}

