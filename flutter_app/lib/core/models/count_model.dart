import 'package:hive/hive.dart';
import 'product_model.dart';

part 'count_model.g.dart';

@HiveType(typeId: 0)
class CountModel extends HiveObject {
  @HiveField(0)
  String? id; // Backend ID, null if not synced

  @HiveField(1)
  final String localId; // Local unique ID

  @HiveField(2)
  final String userId;

  @HiveField(3)
  final String productId;

  @HiveField(4)
  double quantity;

  @HiveField(5)
  double price;

  @HiveField(6)
  bool synced;

  @HiveField(7)
  final DateTime createdAt;

  @HiveField(8)
  DateTime updatedAt;

  // Not stored in Hive, populated when needed
  ProductModel? product;

  CountModel({
    this.id,
    required this.localId,
    required this.userId,
    required this.productId,
    required this.quantity,
    required this.price,
    this.synced = false,
    required this.createdAt,
    required this.updatedAt,
    this.product,
  });

  factory CountModel.fromJson(Map<String, dynamic> json) {
    return CountModel(
      id: json['_id'] ?? json['id'],
      localId: json['localId'] ?? DateTime.now().millisecondsSinceEpoch.toString(),
      userId: json['userId'] is Map ? json['userId']['_id'] : json['userId'],
      productId: json['productId'] is Map ? json['productId']['_id'] : json['productId'],
      quantity: (json['quantity'] ?? 0).toDouble(),
      price: (json['price'] ?? 0).toDouble(),
      synced: json['synced'] ?? true,
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null 
          ? DateTime.parse(json['updatedAt']) 
          : DateTime.now(),
      product: json['productId'] is Map 
          ? ProductModel.fromJson(json['productId']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) '_id': id,
      'localId': localId,
      'userId': userId,
      'productId': productId,
      'quantity': quantity,
      'price': price,
      'synced': synced,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  double get totalValue => quantity * price;
}

