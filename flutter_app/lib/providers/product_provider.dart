import 'package:flutter/material.dart';
import '../core/models/product_model.dart';
import '../core/services/api_service.dart';

class ProductProvider extends ChangeNotifier {
  ProductModel? _currentProduct;
  bool _isLoading = false;
  String? _error;

  ProductModel? get currentProduct => _currentProduct;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<ProductModel?> fetchProductByBarcode(String barcode) async {
    _isLoading = true;
    _error = null;
    _currentProduct = null;
    notifyListeners();

    try {
      final response = await ApiService.getProductByBarcode(barcode);

      if (response['success'] == true) {
        _currentProduct = ProductModel.fromJson(response['data']);
        _isLoading = false;
        notifyListeners();
        return _currentProduct;
      } else {
        _error = response['message'] ?? 'Product not found';
        _isLoading = false;
        notifyListeners();
        return null;
      }
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  void clearCurrentProduct() {
    _currentProduct = null;
    _error = null;
    notifyListeners();
  }
}

