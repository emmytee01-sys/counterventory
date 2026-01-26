import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/product_provider.dart';
import 'product_details_screen.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({Key? key}) : super(key: key);

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  MobileScannerController cameraController = MobileScannerController();
  bool _isProcessing = false;
  final FocusNode _focusNode = FocusNode();
  final StringBuilder _barcodeBuffer = StringBuilder();

  @override
  void initState() {
    super.initState();
    // Ensure focus to capture keyboard events from external scanners
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    cameraController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  Future<void> _processBarcode(String code) async {
    if (_isProcessing) return;

    setState(() {
      _isProcessing = true;
    });

    final productProvider = Provider.of<ProductProvider>(context, listen: false);
    final product = await productProvider.fetchProductByBarcode(code);

    if (!mounted) return;

    if (product != null) {
      await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ProductDetailsScreen(product: product),
        ),
      );

      if (!mounted) return;
      _focusNode.requestFocus();

      setState(() {
        _isProcessing = false;
      });
    } else {
      setState(() {
        _isProcessing = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(productProvider.error ?? 'Product not found'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  Future<void> _onDetect(BarcodeCapture capture) async {
    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isEmpty) return;

    final String? code = barcodes.first.rawValue;
    if (code == null || code.isEmpty) return;

    _processBarcode(code);
  }

  Future<void> _showManualEntryDialog() async {
    final controller = TextEditingController();
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Manual Entry'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            labelText: 'Barcode or SKU',
            hintText: 'Type here...',
          ),
          autofocus: true,
          onSubmitted: (value) {
            Navigator.pop(context);
            if (value.isNotEmpty) _processBarcode(value);
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('CANCEL'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              if (controller.text.isNotEmpty) _processBarcode(controller.text);
            },
            child: const Text('SEARCH'),
          ),
        ],
      ),
    );
  }

  void _handleKeyEvent(RawKeyEvent event) {
    if (event is RawKeyDownEvent) {
      if (event.logicalKey == LogicalKeyboardKey.enter) {
        final barcode = _barcodeBuffer.toString();
        if (barcode.isNotEmpty) {
          _barcodeBuffer.clear();
          _processBarcode(barcode);
        }
      } else if (event.character != null) {
        _barcodeBuffer.append(event.character!);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return RawKeyboardListener(
      focusNode: _focusNode,
      autofocus: true,
      onKey: _handleKeyEvent,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Scan Barcode'),
          actions: [
            IconButton(
            icon: const Icon(Icons.keyboard),
            tooltip: 'Manual Entry',
            onPressed: () => _showManualEntryDialog(),
          ),
          IconButton(
            icon: ValueListenableBuilder(
                valueListenable: cameraController.torchState,
                builder: (context, state, child) {
                  return Icon(
                    state == TorchState.off ? Icons.flash_off : Icons.flash_on,
                  );
                },
              ),
              onPressed: () => cameraController.toggleTorch(),
            ),
            IconButton(
              icon: const Icon(Icons.flip_camera_ios),
              onPressed: () => cameraController.switchCamera(),
            ),
          ],
        ),
        body: Stack(
          children: [
            MobileScanner(
              controller: cameraController,
              onDetect: _onDetect,
            ),
            // Overlay
            CustomPaint(
              painter: ScannerOverlayPainter(),
              child: Container(),
            ),
            // Instructions
            Positioned(
              bottom: 100,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'Align Barcode within the frame\nConnect a scanner to scan automatically',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
            ),
            // Loading indicator
            if (_isProcessing)
              Container(
                color: Colors.black54,
                child: const Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class StringBuilder {
  final List<String> _strings = [];
  void append(String s) => _strings.add(s);
  void clear() => _strings.clear();
  @override
  String toString() => _strings.join();
  bool get isNotEmpty => _strings.isNotEmpty;
}

class ScannerOverlayPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black54
      ..style = PaintingStyle.fill;

    // Barcode scan area is typically wider and shorter
    final scanAreaWidth = size.width * 0.8;
    final scanAreaHeight = 150.0;
    
    final left = (size.width - scanAreaWidth) / 2;
    final top = (size.height - scanAreaHeight) / 2;
    final scanRect = Rect.fromLTWH(left, top, scanAreaWidth, scanAreaHeight);

    // Draw dark overlay
    canvas.drawPath(
      Path()
        ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
        ..addRect(scanRect)
        ..fillType = PathFillType.evenOdd,
      paint,
    );

    // Draw corner borders
    final borderPaint = Paint()
      ..color = AppColors.accentRed
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4;

    final cornerLength = 30.0;

    // Top-left
    canvas.drawLine(Offset(left, top), Offset(left + cornerLength, top), borderPaint);
    canvas.drawLine(Offset(left, top), Offset(left, top + cornerLength), borderPaint);

    // Top-right
    canvas.drawLine(Offset(left + scanAreaWidth, top), 
        Offset(left + scanAreaWidth - cornerLength, top), borderPaint);
    canvas.drawLine(Offset(left + scanAreaWidth, top), 
        Offset(left + scanAreaWidth, top + cornerLength), borderPaint);

    // Bottom-left
    canvas.drawLine(Offset(left, top + scanAreaHeight), 
        Offset(left + cornerLength, top + scanAreaHeight), borderPaint);
    canvas.drawLine(Offset(left, top + scanAreaHeight), 
        Offset(left, top + scanAreaHeight - cornerLength), borderPaint);

    // Bottom-right
    canvas.drawLine(Offset(left + scanAreaWidth, top + scanAreaHeight), 
        Offset(left + scanAreaWidth - cornerLength, top + scanAreaHeight), borderPaint);
    canvas.drawLine(Offset(left + scanAreaWidth, top + scanAreaHeight), 
        Offset(left + scanAreaWidth, top + scanAreaHeight - cornerLength), borderPaint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}


