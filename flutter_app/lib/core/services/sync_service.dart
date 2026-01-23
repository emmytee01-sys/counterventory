import 'package:flutter/material.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'storage_service.dart';
import 'api_service.dart';
import '../models/count_model.dart';

class SyncService extends ChangeNotifier {
  bool _isSyncing = false;
  bool _isOnline = true;
  String? _syncError;

  bool get isSyncing => _isSyncing;
  bool get isOnline => _isOnline;
  String? get syncError => _syncError;

  SyncService() {
    _initConnectivityListener();
    _checkConnectivity();
  }

  void _initConnectivityListener() {
    Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
      final wasOffline = !_isOnline;
      _isOnline = result != ConnectivityResult.none;
      notifyListeners();

      // Auto sync when coming online
      if (wasOffline && _isOnline) {
        syncUnsyncedCounts();
      }
    });
  }

  Future<void> _checkConnectivity() async {
    final result = await Connectivity().checkConnectivity();
    _isOnline = result != ConnectivityResult.none;
    notifyListeners();
  }

  Future<void> syncUnsyncedCounts() async {
    if (_isSyncing || !_isOnline) return;

    _isSyncing = true;
    _syncError = null;
    notifyListeners();

    try {
      final unsyncedCounts = StorageService.getUnsyncedCounts();
      
      if (unsyncedCounts.isEmpty) {
        _isSyncing = false;
        notifyListeners();
        return;
      }

      // Sync each count
      for (var count in unsyncedCounts) {
        try {
          final response = await ApiService.saveTempCount(
            productId: count.productId,
            quantity: count.quantity,
            price: count.price,
          );

          if (response['success'] == true) {
            // Update local count with backend ID
            count.id = response['data']['_id'];
            count.synced = true;
            await count.save();
          }
        } catch (e) {
          print('Failed to sync count ${count.localId}: $e');
          // Continue with other counts
        }
      }

      _isSyncing = false;
      notifyListeners();
    } catch (e) {
      _syncError = e.toString();
      _isSyncing = false;
      notifyListeners();
    }
  }

  Future<bool> checkAndSync() async {
    await _checkConnectivity();
    if (_isOnline) {
      await syncUnsyncedCounts();
      return true;
    }
    return false;
  }
}

