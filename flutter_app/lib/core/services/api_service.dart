import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:csv/csv.dart';
import 'package:excel/excel.dart';
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

  static Future<Map<String, dynamic>> getProductByBarcode(String barcode) async {
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.productByBarcode(barcode)}'),
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

  static Future<Map<String, dynamic>> importProducts(String filePath) async {
    final file = File(filePath);
    final bytes = await file.readAsBytes();
    List<Map<String, dynamic>> productsList = [];

    if (filePath.endsWith('.csv')) {
      final input = file.openRead();
      final fields = await input
          .transform(utf8.decoder)
          .transform(const CsvToListConverter())
          .toList();

      if (fields.length > 1) {
        // Skip header
        for (var i = 1; i < fields.length; i++) {
          final row = fields[i];
          if (row.length < 10) continue;
          productsList.add(_mapRowToProduct(row));
        }
      }
    } else if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
      final excel = Excel.decodeBytes(bytes);
      for (var table in excel.tables.keys) {
        final sheet = excel.tables[table]!;
        if (sheet.maxRows > 1) {
          for (var i = 1; i < sheet.maxRows; i++) {
            final row = sheet.rows[i].map((cell) => cell?.value).toList();
            if (row.length < 10) continue;
            productsList.add(_mapRowToProduct(row));
          }
        }
        break; // Only first sheet
      }
    }

    if (productsList.isEmpty) {
      throw Exception('No valid products found in file');
    }

    // Send batches to avoid huge payloads
    const batchSize = 100;
    Map<String, dynamic> lastResponse = {};
    
    for (var i = 0; i < productsList.length; i += batchSize) {
      final end = (i + batchSize < productsList.length) ? i + batchSize : productsList.length;
      final batch = productsList.sublist(i, end);

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.importProducts}'),
        headers: await _getHeaders(),
        body: jsonEncode({'products': batch}),
      );

      if (response.statusCode != 200) {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Import failed at batch starting at $i');
      }
      lastResponse = jsonDecode(response.body);
    }

    return lastResponse;
  }

  static Map<String, dynamic> _mapRowToProduct(List<dynamic> row) {
    // Following existing 19-column CSV format
    return {
      'productSKU': row[0]?.toString() ?? '',
      'recordUID': row[1]?.toString() ?? '',
      'deptName': row[2]?.toString() ?? '',
      'itemName': row[3]?.toString() ?? '',
      'itemDetailedSpecs': row[4]?.toString() ?? '',
      'sellingPrice': _parseDouble(row[5]),
      'costPrice': _parseDouble(row[6]),
      'currentStock': _parseDouble(row[7]),
      'caseQuantity': _parseDouble(row[8]),
      'upcBarcode': _formatBarcode(row[9]),
      'alternateLookupBarcode': _formatBarcode(row[10]),
      'productVariant': row[11]?.toString() ?? '',
      'dimensionScale': row[12]?.toString() ?? '',
    };
  }

  static double _parseDouble(dynamic val) {
    if (val == null) return 0.0;
    if (val is num) return val.toDouble();
    return double.tryParse(val.toString()) ?? 0.0;
  }

  static String _formatBarcode(dynamic val) {
    if (val == null) return '';
    String s = val.toString();
    // Handle scientific notation (common in Excel)
    if (s.contains('E+') || s.contains('e+')) {
      try {
        double d = double.parse(s);
        return d.toInt().toString();
      } catch (_) {}
    }
    return s;
  }

  static Future<void> clearProducts() async {
    final response = await http.delete(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.clearProducts}'),
      headers: await _getHeaders(),
    );

    if (response.statusCode != 200) {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Failed to clear products');
    }
  }

  static Future<Map<String, dynamic>> createUser({
    required String username,
    required String password,
    required String role,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}${ApiConstants.createUser}'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'username': username,
        'password': password,
        'role': role,
      }),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Failed to create user');
    }
  }

  static String getSampleImportUrl() {
    return '${ApiConstants.baseUrl}${ApiConstants.sampleImportFile}';
  }
}

