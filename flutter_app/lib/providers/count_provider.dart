import 'package:flutter/material.dart';
import '../core/models/count_model.dart';
import '../core/models/product_model.dart';
import '../core/services/storage_service.dart';
import '../core/services/api_service.dart';
import '../core/services/sync_service.dart';

class CountProvider extends ChangeNotifier {
  List<CountModel> _counts = [];
  bool _isLoading = false;
  String? _error;
  int _totalItems = 0;
  double _totalQuantity = 0;

  List<CountModel> get counts => _counts;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get totalItems => _totalItems;
  double get totalQuantity => _totalQuantity;

  Future<void> loadLocalCounts(String userId) async {
    _counts = StorageService.getAllCounts()
        .where((count) => count.userId == userId)
        .toList();
    _calculateStats();
    notifyListeners();
  }

  Future<bool> saveCount({
    required String userId,
    required ProductModel product,
    required double quantity,
    required double price,
    required SyncService syncService,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Check if count already exists
      final existingCount = StorageService.getCountByProductId(product.id, userId);
      
      final now = DateTime.now();
      CountModel count;

      if (existingCount != null) {
        // Update existing count
        existingCount.quantity = quantity;
        existingCount.price = price;
        existingCount.updatedAt = now;
        count = existingCount;
      } else {
        // Create new count
        count = CountModel(
          localId: '${userId}_${product.id}_${now.millisecondsSinceEpoch}',
          userId: userId,
          productId: product.id,
          quantity: quantity,
          price: price,
          synced: false,
          createdAt: now,
          updatedAt: now,
          product: product,
        );
      }

      // Save to local storage
      await StorageService.saveCount(count);

      // Try to sync if online
      if (syncService.isOnline) {
        try {
          final response = await ApiService.saveTempCount(
            productId: product.id,
            quantity: quantity,
            price: price,
          );

          if (response['success'] == true) {
            count.id = response['data']['_id'];
            count.synced = true;
            await count.save();
          }
        } catch (e) {
          print('Failed to sync immediately: $e');
          // Keep as unsynced, will sync later
        }
      }

      await loadLocalCounts(userId);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteCount(String localId, String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final count = _counts.firstWhere((c) => c.localId == localId);
      
      // If synced, delete from backend
      if (count.synced && count.id != null) {
        try {
          await ApiService.deleteTempCount(count.id!);
        } catch (e) {
          print('Failed to delete from backend: $e');
        }
      }

      // Delete from local storage
      await StorageService.deleteCount(localId);
      await loadLocalCounts(userId);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> submitCounts(String userId, SyncService syncService) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Check if online
      if (!syncService.isOnline) {
        _error = 'Cannot submit while offline. Please connect to the internet.';
        _isLoading = false;
        notifyListeners();
        return false;
      }

      // Sync unsynced counts first
      await syncService.syncUnsyncedCounts();

      // Check if all counts are synced
      final unsyncedCounts = StorageService.getUnsyncedCounts();
      if (unsyncedCounts.isNotEmpty) {
        _error = 'Some counts failed to sync. Please try again.';
        _isLoading = false;
        notifyListeners();
        return false;
      }

      // Submit to master inventory
      final response = await ApiService.submitCounts(userId);

      if (response['success'] == true) {
        // Clear local counts
        await StorageService.clearAllCounts();
        await loadLocalCounts(userId);
        
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to submit counts';
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

  void _calculateStats() {
    _totalItems = _counts.length;
    _totalQuantity = _counts.fold(0, (sum, count) => sum + count.quantity);
  }
}

