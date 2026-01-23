// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'count_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CountModelAdapter extends TypeAdapter<CountModel> {
  @override
  final int typeId = 0;

  @override
  CountModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return CountModel(
      id: fields[0] as String?,
      localId: fields[1] as String,
      userId: fields[2] as String,
      productId: fields[3] as String,
      quantity: fields[4] as double,
      price: fields[5] as double,
      synced: fields[6] as bool,
      createdAt: fields[7] as DateTime,
      updatedAt: fields[8] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, CountModel obj) {
    writer
      ..writeByte(9)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.localId)
      ..writeByte(2)
      ..write(obj.userId)
      ..writeByte(3)
      ..write(obj.productId)
      ..writeByte(4)
      ..write(obj.quantity)
      ..writeByte(5)
      ..write(obj.price)
      ..writeByte(6)
      ..write(obj.synced)
      ..writeByte(7)
      ..write(obj.createdAt)
      ..writeByte(8)
      ..write(obj.updatedAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CountModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

