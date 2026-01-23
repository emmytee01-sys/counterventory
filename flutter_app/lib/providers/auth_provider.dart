import 'package:flutter/material.dart';
import '../core/models/user_model.dart';
import '../core/services/api_service.dart';
import '../core/services/storage_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;
  String? _error;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  bool get isAdmin => _user?.isAdmin ?? false;

  Future<void> checkAuthStatus() async {
    final token = await StorageService.getAuthToken();
    if (token != null) {
      final userData = await StorageService.getUserData();
      if (userData['userId'] != null) {
        _user = UserModel(
          id: userData['userId']!,
          username: userData['username']!,
          role: userData['role']!,
        );
        notifyListeners();
      }
    }
  }

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.login(username, password);

      if (response['success'] == true) {
        // Save token
        await StorageService.saveAuthToken(response['token']);

        // Save user data
        final userData = response['user'];
        _user = UserModel.fromJson(userData);
        
        await StorageService.saveUserData(
          userId: _user!.id,
          username: _user!.username,
          role: _user!.role,
        );

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Login failed';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await StorageService.clearAuth();
    await StorageService.clearAllCounts();
    _user = null;
    notifyListeners();
  }
}

