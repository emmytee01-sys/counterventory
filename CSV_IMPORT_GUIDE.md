# 📊 CSV Import Guide - Counterventory

Your system now fully supports your existing CSV format!

## ✅ What's Updated

### 1. Product Model
The database now stores all 19 columns from your CSV:
- ProductSKU
- RecordUID
- DeptName
- ItemName
- ItemDetailedSpecs
- SellingPrice
- CostPrice
- CurrentStock(QTY)
- CaseQuantity(CTN)
- UPC(BARCODE)
- AlternateLookupBarcode(ALPHANUMERIC)
- ProductVariant
- DimensionScale
- AltKeyAlpha, Beta, Gamma, Delta, Epsilon, Zeta

### 2. Excel Export
Exports now include:
- All original CSV columns
- **CountedQuantity** - The counted amount
- **CountedBy** - Username who counted
- **CountedDate** - When it was counted
- **BatchID** - Submission batch ID

### 3. QR Code Scanning
Now searches products by:
- UPC Barcode
- Alternate Lookup Barcode
- Product SKU

---

## 🚀 How to Import Your CSV

### Option 1: Import All Products from CSV

```bash
cd backend

# Import from your existing CSV file
node scripts/importFromCSV.js "../Counterventory Import Inventory Format  - example.csv"

# Or if CSV is in different location:
node scripts/importFromCSV.js "/path/to/your/file.csv"
```

This will:
- Parse your CSV file
- Create/update products in MongoDB
- Show progress for each product
- Report success/failure counts

### Option 2: Use the Seed Script (Sample Data)

```bash
cd backend
node scripts/seedDataFromCSV.js
```

This creates:
- Admin and user accounts
- 10 sample products from your CSV format
- You can then import the full CSV later

---

## 📋 CSV Format Requirements

Your CSV must have this header (exact column order):

```
ProductSKU,RecordUID,DeptName,ItemName,ItemDetailedSpecs,SellingPrice,CostPrice,CurrentStock(QTY),CaseQuantity(CTN),UPC(BARCODE),AlternateLookupBarcode(ALPHANUMERIC),ProductVariant,DimensionScale,AltKeyAlpha,AltKeyBeta,AltKeyGamma,AltKeyDelta,AltKeyEpsilon,AltKeyZeta
```

**Important:** ProductSKU must be unique for each product!

---

## 🔄 Import Behavior

### New Products
- If ProductSKU doesn't exist → Creates new product

### Existing Products
- If ProductSKU exists → Updates with new data
- Preserves product ID and history

### Error Handling
- Skips rows with missing ProductSKU
- Continues on errors
- Reports all failures at end

---

## 📊 Export Format

When you export counted inventory, you get:

### Original Product Data
All columns from your CSV:
- ProductSKU, DeptName, ItemName, etc.
- Current prices and stock levels

### Count Data
New columns added:
- **CountedQuantity**: What was actually counted
- **CountedBy**: Who performed the count
- **CountedDate**: Timestamp of count
- **BatchID**: Unique batch identifier

### Example Export Row
```csv
1001,,PROVISIONS,KELLOGG'S CEREALS,900G,0,0,18,1,615400000001,615400000001,15,john,2024-01-23 14:30,BATCH_user123_1706024400000
```

---

## 🧪 Testing the Import

### Step 1: Seed Sample Data
```bash
cd backend
node scripts/seedDataFromCSV.js
```

### Step 2: Test with Sample Products
- Login to app
- Scan barcode: `615400000001` (Kellogg's Cereals)
- Or scan: `215879` (Carrot)
- Or scan SKU: `1001`, `101`, `102`, etc.

### Step 3: Import Full CSV (Optional)
```bash
node scripts/importFromCSV.js "../Counterventory Import Inventory Format  - example.csv"
```

This imports all 1,700+ products from your CSV!

---

## 🎯 API Updates

### New Endpoint: Bulk Import
```bash
POST /api/products/import
Authorization: Bearer <admin_token>

Body:
{
  "products": [
    {
      "productSKU": "1001",
      "itemName": "Product Name",
      "upcBarcode": "123456",
      ...
    }
  ]
}
```

### Updated Search
```bash
GET /api/products/qr/:code
```

Now searches:
- upcBarcode
- alternateLookupBarcode
- productSKU

---

## 📱 Mobile App Updates

### Product Display
- Shows ItemName as main title
- Shows ProductSKU as identifier
- Shows Department if available
- Shows Current Stock and Selling Price

### Scanning
- Scans any barcode format
- Searches UPC, Alternate, or SKU
- Matches your existing barcodes

---

## 🔧 Customization

### Change CSV Path
Edit `backend/scripts/importFromCSV.js`:
```javascript
const csvPath = process.argv[2] || path.join(__dirname, '../../your-file.csv');
```

### Add Custom Parsing
Modify the `parseCSV` function to handle special formats:
```javascript
function parseCSV(filePath) {
  // Add custom parsing logic
  // Handle scientific notation
  // Clean up data
}
```

---

## ⚠️ Important Notes

1. **Backup First**: Backup your MongoDB before importing!

2. **Unique SKUs**: Ensure ProductSKU is unique in your CSV

3. **Barcode Format**: System handles various barcode formats including scientific notation (6.154E+12)

4. **Update vs Create**: 
   - First import = Creates all products
   - Second import = Updates existing products

5. **Empty Fields**: Empty fields are stored as empty strings or 0

---

## 📝 Next Steps

1. **Now** - Run seed script:
   ```bash
   cd backend
   node scripts/seedDataFromCSV.js
   ```

2. **Test** - Scan sample barcodes in app

3. **Import** - When ready, import full CSV:
   ```bash
   node scripts/importFromCSV.js "../Counterventory Import Inventory Format  - example.csv"
   ```

4. **Count** - Start counting with mobile app

5. **Export** - Download counted inventory in your format

---

## 🎉 Benefits

✅ **Preserves Your Format** - Keeps all 19 columns
✅ **Easy Import** - One command to import all products
✅ **Update-Safe** - Can re-import to update prices/stock
✅ **Export Compatible** - Exports match import format
✅ **Flexible Search** - Multiple barcode formats supported
✅ **No Data Loss** - All fields preserved

---

## 🆘 Troubleshooting

### "CSV file not found"
- Check file path
- Use absolute path if needed
- Verify filename exactly matches

### "Failed to import ProductSKU"
- Check for duplicate SKUs
- Verify required fields present
- Check console for specific error

### "Some products failed"
- Review error log
- Check data format
- Verify MongoDB connection

---

**Your CSV format is now fully integrated! 🎊**

Ready to import? Run:
```bash
cd backend && node scripts/seedDataFromCSV.js
```

