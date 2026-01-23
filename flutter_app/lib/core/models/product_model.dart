class ProductModel {
  final String id;
  final String productSKU;
  final String recordUID;
  final String deptName;
  final String itemName;
  final String itemDetailedSpecs;
  final double sellingPrice;
  final double costPrice;
  final double currentStock;
  final double caseQuantity;
  final String upcBarcode;
  final String alternateLookupBarcode;
  final String productVariant;
  final String dimensionScale;

  ProductModel({
    required this.id,
    required this.productSKU,
    this.recordUID = '',
    this.deptName = '',
    required this.itemName,
    this.itemDetailedSpecs = '',
    this.sellingPrice = 0,
    this.costPrice = 0,
    this.currentStock = 0,
    this.caseQuantity = 1,
    this.upcBarcode = '',
    this.alternateLookupBarcode = '',
    this.productVariant = '',
    this.dimensionScale = '',
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['_id'] ?? json['id'] ?? '',
      productSKU: json['productSKU'] ?? '',
      recordUID: json['recordUID'] ?? '',
      deptName: json['deptName'] ?? '',
      itemName: json['itemName'] ?? '',
      itemDetailedSpecs: json['itemDetailedSpecs'] ?? '',
      sellingPrice: (json['sellingPrice'] ?? 0).toDouble(),
      costPrice: (json['costPrice'] ?? 0).toDouble(),
      currentStock: (json['currentStock'] ?? 0).toDouble(),
      caseQuantity: (json['caseQuantity'] ?? 1).toDouble(),
      upcBarcode: json['upcBarcode'] ?? '',
      alternateLookupBarcode: json['alternateLookupBarcode'] ?? '',
      productVariant: json['productVariant'] ?? '',
      dimensionScale: json['dimensionScale'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productSKU': productSKU,
      'recordUID': recordUID,
      'deptName': deptName,
      'itemName': itemName,
      'itemDetailedSpecs': itemDetailedSpecs,
      'sellingPrice': sellingPrice,
      'costPrice': costPrice,
      'currentStock': currentStock,
      'caseQuantity': caseQuantity,
      'upcBarcode': upcBarcode,
      'alternateLookupBarcode': alternateLookupBarcode,
      'productVariant': productVariant,
      'dimensionScale': dimensionScale,
    };
  }
  
  // Helper getters for backward compatibility
  String get name => itemName;
  String get sku => productSKU;
  String get qrCode => upcBarcode.isNotEmpty ? upcBarcode : alternateLookupBarcode;
}

