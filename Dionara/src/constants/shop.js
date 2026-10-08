export const DEFAULT_WHATSAPP = "917058805659"; // Default Store WhatsApp Number
export const FREE_SHIPPING_THRESHOLD = 499; // Free shipping above ₹499
export const STANDARD_SHIPPING_FEE = 49; // Flat ₹49 for orders below ₹499

// Connected Google Spreadsheet for live order status and tracking
export const DEFAULT_GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1QwctkxincKSGSPqPhifS-6Ka77LD11D4qW2u6k-meQ0/edit?usp=sharing";

// Default or fallback Webhook URL if already configured
export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL = "";

// Google Apps Script source code for automatic Google Sheets sync
export const GOOGLE_APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var contents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);

    // Initialize header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Order ID",
        "Order Date",
        "Customer Name",
        "WhatsApp Mobile",
        "Email",
        "Delivery Address",
        "Landmark",
        "City",
        "State",
        "Pincode",
        "Order Notes",
        "Payment Mode",
        "Items Ordered",
        "Total Quantity",
        "Subtotal (₹)",
        "Discount (₹)",
        "Shipping (₹)",
        "Grand Total (₹)",
        "Order Status",
        "Tracking ID",
        "Delivery Partner",
        "Courier Portal Link"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#0F9D58");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Append new order row
    sheet.appendRow([
      data.orderId || "",
      data.orderDate || new Date().toLocaleString("en-IN"),
      data.customerName || "",
      data.mobile || "",
      data.email || "",
      data.address || "",
      data.landmark || "",
      data.city || "",
      data.state || "",
      data.pincode || "",
      data.notes || "",
      data.paymentMethod || "UPI / WhatsApp Pay",
      data.items || "",
      data.totalQty || 1,
      data.subtotal || 0,
      data.discount || 0,
      data.shipping || 0,
      data.total || 0,
      data.status || "Pending Confirmation",
      data.trackingId || "Pending",
      data.deliveryPartner || "Shiprocket",
      data.deliveryPartnerUrl || "https://app.shiprocket.in/orders/create"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "online", message: "Dionara Google Sheet Webhook is active" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

export const DEFAULT_DELIVERY_PARTNER = {
  name: "Shiprocket",
  url: "https://app.shiprocket.in/orders/create"
};

export const DEFAULT_ADMIN_PASSWORD = "admin123"; // Admin login password

export const DEFAULT_COUPONS = [
  {
    code: "DIONARA10",
    type: "percent",
    value: 10,
    minOrder: 0,
    desc: "10% Off your entire order",
    active: true
  },
  {
    code: "DIONARA200",
    type: "flat",
    value: 200,
    minOrder: 1000,
    desc: "₹200 Flat Discount on orders above ₹1000",
    active: true
  }
];
