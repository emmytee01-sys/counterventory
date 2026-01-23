import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import 'storage_service.dart';

class ApiService {
  static Future<Map<String, String>> _getHeaders() async {
    final token = await StorageService.getAuthToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.login}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Login failed');
    }
  }

  static Future<Map<String, dynamic>> getMe() async {
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.me}'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to get user data');
    }
  }

  static Future<Map<String, dynamic>> getProductByQR(String qrCode) async {
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.productByQR(qrCode)}'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 404) {
      throw Exception('Product not found');
    } else {
      throw Exception('Failed to fetch product');
    }
  }

  static Future<Map<String, dynamic>> saveTempCount({
    required String productId,
    required double quantity,
    required double price,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.tempCounts}'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'productId': productId,
        'quantity': quantity,
        'price': price,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Failed to save count');
    }
  }

  static Future<Map<String, dynamic>> getTempCounts(String userId) async {
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.tempCountsByUser(userId)}'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch counts');
    }
  }

  static Future<void> deleteTempCount(String id) async {
    final response = await http.delete(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.deleteTempCount(id)}'),
      headers: await _getHeaders(),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete count');
    }
  }

  static Future<Map<String, dynamic>> submitCounts(String userId) async {
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.submitCounts(userId)}'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Failed to submit counts');
    }
  }

  static Future<Map<String, dynamic>> getStats() async {
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.stats}'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch stats');
    }
  }

  static Future<List<dynamic>> getAllUsers() async {
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.adminUsers}'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } else {
      throw Exception('Failed to fetch users');
    }
  }

  static String getExportUserUrl(String userId) {
    return '${ApiConstants.baseUrl}${ApiConstants.exportUser(userId)}';
  }

  static String getExportAllUrl() {
    return '${ApiConstants.baseUrl}${ApiConstants.exportAll}';
  }
}

