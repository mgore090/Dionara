export const DEFAULT_WHATSAPP = "917058805659"; // Default Store WhatsApp Number
export const FREE_SHIPPING_THRESHOLD = 499; // Free shipping above ₹499
export const STANDARD_SHIPPING_FEE = 49; // Flat ₹49 for orders below ₹499

// Connected Google Spreadsheet for live order status and tracking
export const DEFAULT_GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1QwctkxincKSGSPqPhifS-6Ka77LD11D4qW2u6k-meQ0/edit?usp=sharing";

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
