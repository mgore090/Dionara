# 🛍️ Dionara — Luxury E-Commerce & WhatsApp Commerce Platform

A curated, end-to-end luxury e-commerce web application built with **React**, **Vite**, and **Direct WhatsApp Ordering**.

---

## 📐 Application Architecture & Flow

```
React
 │
 ├── Home Page           (/)            - Hero, Categories, Bestsellers, Value Pillars, Testimonials
 ├── Product Listing     (/products)    - Filters (Category, Search, Price, Stock, Sort)
 ├── Product Details     (/product/:id) - Image Gallery, Specs, Qty Picker, Direct WhatsApp / Add to Cart
 ├── Cart                (/cart)        - Live Bag, Free Shipping Meter, Promo Codes, Order Summary
 ├── Checkout Form       (/checkout)    - Shipping Form, Payment Mode Selector (UPI / COD)
 │
 └── WhatsApp Order      (/order-success)
          ↓
     Your WhatsApp       (https://wa.me/{whatsappNumber}?text={encodedOrder})
```

---

## ✨ Key Features

1. **Brand Identity & Luxury Design**:
   - Modern editorial aesthetics featuring warm champagne gold, deep obsidian charcoal, and crisp ivory tones.
   - Elegant typography pairing *Playfair Display* serif headings with *Plus Jakarta Sans* UI.

2. **Full Product Catalog**:
   - Curated multi-category catalog:
     - 💎 **Jewelry & Ornaments** (18K Gold Plated Celestial Pendant, Kundan Choker, Emerald Ring)
     - 👗 **Fashion & Apparel** (Chanderi Silk Anarkali, Pure Linen Blazer)
     - 🏺 **Home & Decor** (Ribbed Ceramic Vase, Pure Brass Aroma Diffuser)
     - 🌸 **Fragrances & Wellness** (Royal Oud Velvet Rose Perfume, Himalayan Lavender Candle)
   - Real-time search, category filtering, price sorting, and stock status filters.

3. **Interactive Product Details**:
   - Multi-angle thumbnail image gallery with live preview.
   - Real-time stock counters, rating stars, and verified customer reviews.
   - Dual actions: **Add to Cart** and **Order Directly on WhatsApp**.

4. **Dynamic Cart & Checkout Flow**:
   - Live cart state persisted with `localStorage`.
   - Free shipping progress bar (threshold: ₹999).
   - Promo coupon validation (`DIONARA10` for 10% off, `DIONARA200` for ₹200 off).
   - Clean checkout form validating customer name, mobile, delivery address, city, state, and pincode.

5. **WhatsApp Ordering Integration (Your WhatsApp)**:
   - Compiles a formatted, itemized WhatsApp order message:
     - Order ID reference (`#DIO-XXXXXX`)
     - Customer details & full shipping address
     - Ordered items list with quantities and unit prices
     - Subtotal, discounts, shipping fee, and grand total
     - Preferred payment mode (UPI / WhatsApp Pay vs COD)
   - Opens the customer's WhatsApp (Web or Mobile app) directly directed to the configured store number.
   - **Configurable Store WhatsApp Number**: Click "Edit WhatsApp" in the announcement bar or floating widget to enter any mobile number (default: `919876543210`).
   - Order confirmation receipt with "Re-send WhatsApp" and "Copy Order Details" buttons.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```

---

## 📱 Changing Your WhatsApp Number

You can change the recipient WhatsApp phone number at any time:
1. In the web app, click **WhatsApp: +91... (Edit)** in the top announcement bar.
2. Enter your business WhatsApp number with country code (e.g., `919876543210` for India).
3. Tap **Save Number**. It persists automatically in browser storage!

---

© Dionara. All rights reserved.
