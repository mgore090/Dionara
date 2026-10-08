/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  DEFAULT_WHATSAPP,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  DEFAULT_DELIVERY_PARTNER,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_COUPONS,
  DEFAULT_GOOGLE_SHEET_URL,
  DEFAULT_GOOGLE_SHEET_WEBHOOK_URL,
  GOOGLE_APPS_SCRIPT_CODE
} from "../constants/shop";
import { products as initialProducts } from "../data/products";

const ShopContext = createContext();

const SAMPLE_ORDERS = [
  {
    orderId: "DIO-921845",
    customer: {
      name: "Sneha Mukherjee",
      mobile: "9820541234",
      email: "sneha.m@example.com",
      address: "Flat 502, Orchid Woods, Goregaon East",
      landmark: "Near Oberoi Mall",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400063",
      notes: "Please call before delivery",
      paymentMethod: "UPI / WhatsApp Pay"
    },
    items: [
      {
        id: 1,
        name: "Dionara Invisible Water-Glow Sunscreen SPF 50+ PA++++",
        price: 599,
        quantity: 2
      }
    ],
    totals: {
      subtotal: 1198,
      discount: 120,
      shipping: 0,
      total: 1078
    },
    coupon: "DIONARA10",
    status: "Confirmed",
    trackingId: "SR-88492019",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    orderId: "DIO-874312",
    customer: {
      name: "Rohit Kulkarni",
      mobile: "9765123987",
      email: "rohit.k@example.com",
      address: "Villa 12, Palm Meadows, Whitefield",
      landmark: "Behind Forum Mall",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066",
      notes: "Deliver in afternoon",
      paymentMethod: "Cash on Delivery"
    },
    items: [
      {
        id: 1,
        name: "Dionara Invisible Water-Glow Sunscreen SPF 50+ PA++++",
        price: 599,
        quantity: 1
      },
      {
        id: 2,
        name: "Dionara Deep Ceramide Barrier Glow Moisturizer",
        price: 649,
        quantity: 1
      }
    ],
    totals: {
      subtotal: 1248,
      discount: 0,
      shipping: 0,
      total: 1248
    },
    coupon: null,
    status: "Shipped",
    trackingId: "DLV-94028471",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export function ShopProvider({ children }) {
  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem("dionara_is_admin") === "true";
    } catch {
      return false;
    }
  });

  // Dynamic products state (Admin can add, update prices, or remove products directly from UI)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_custom_products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Dynamic coupons & offers state
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_coupons");
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  // Load Cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load Wishlist from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // All Customer Orders List for Excel export & delivery partner management
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_all_orders");
      return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  // Delivery Partner Configuration (e.g. Shiprocket, Delhivery, Bluedart, etc.)
  const [deliveryPartner, setDeliveryPartner] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_delivery_partner");
      return saved ? JSON.parse(saved) : DEFAULT_DELIVERY_PARTNER;
    } catch {
      return DEFAULT_DELIVERY_PARTNER;
    }
  });

  // Business WhatsApp number (store owner can change it anytime in UI)
  const [whatsappNumber, setWhatsappNumberState] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_whatsapp_number");
      return saved || DEFAULT_WHATSAPP;
    } catch {
      return DEFAULT_WHATSAPP;
    }
  });

  // Connected Google Sheet URL for live order status and tracking
  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_google_sheet_url");
      return saved || DEFAULT_GOOGLE_SHEET_URL;
    } catch {
      return DEFAULT_GOOGLE_SHEET_URL;
    }
  });

  // Connected Google Sheet Webhook / Apps Script Web App URL for automated background order sync
  const [googleSheetWebhookUrl, setGoogleSheetWebhookUrl] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_google_sheet_webhook_url");
      return saved || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
    } catch {
      return DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
    }
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("dionara_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("dionara_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("dionara_custom_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("dionara_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem("dionara_is_admin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Admin Login & Logout
  const loginAdmin = (password) => {
    if (password === DEFAULT_ADMIN_PASSWORD || password === "dionara123") {
      setIsAdmin(true);
      showToast("Welcome back, Store Admin! Admin view activated.", "success");
      return true;
    } else {
      showToast("Invalid admin password. Default is 'admin123'", "error");
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    showToast("Logged out of Admin mode. Customer view active.", "info");
  };

  // Product Management (Admin only)
  const updateProduct = (productId, updatedFields) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return { ...p, ...updatedFields };
        }
        return p;
      });
      return updated;
    });

    // Also update price inside cart if in cart
    if (updatedFields.price !== undefined) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId
            ? { ...item, price: Number(updatedFields.price) }
            : item
        )
      );
    }

    showToast("Product details & price updated successfully!", "success");
  };

  const addProduct = (newProductData) => {
    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const productToAdd = {
      id: nextId,
      name: newProductData.name || "New Dionara Product",
      slug: (newProductData.name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: newProductData.category || "skincare",
      categoryName: newProductData.categoryName || "Skincare",
      subtitle: newProductData.subtitle || "Dionara Dermatologist Formulation",
      volume: newProductData.volume || "50 ml",
      price: Number(newProductData.price) || 499,
      oldPrice: Number(newProductData.oldPrice) || 699,
      rating: 5.0,
      reviews: 1,
      badge: newProductData.badge || "NEW",
      image: newProductData.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      gallery: [
        newProductData.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
      ],
      description: newProductData.description || "Formulated for daily healthy skin barrier radiance.",
      keyBenefits: newProductData.keyBenefits || ["Dermatologically Tested", "Cruelty-Free"],
      details: newProductData.details || ["Suitable for all skin types"],
      inStock: true,
      stockCount: Number(newProductData.stockCount) || 50,
      featured: true
    };

    setProducts((prev) => [...prev, productToAdd]);
    showToast(`Added new product: "${productToAdd.name}"!`, "success");
    return productToAdd;
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast("Product removed from store catalog", "info");
  };

  const resetDefaultProducts = () => {
    setProducts(initialProducts);
    localStorage.removeItem("dionara_custom_products");
    showToast("Restored default 2 Dionara products!", "success");
  };

  // Coupons / Offers Management (Admin only)
  const addCoupon = (newCoupon) => {
    const code = newCoupon.code.trim().toUpperCase();
    if (coupons.some((c) => c.code === code)) {
      showToast(`Coupon code ${code} already exists`, "error");
      return false;
    }
    const couponObj = {
      code,
      type: newCoupon.type || "percent",
      value: Number(newCoupon.value) || 10,
      minOrder: Number(newCoupon.minOrder) || 0,
      desc: newCoupon.desc || `${newCoupon.value}% Discount`,
      active: true
    };
    setCoupons((prev) => [...prev, couponObj]);
    showToast(`New offer code "${code}" added!`, "success");
    return true;
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    if (appliedCoupon?.code === code) {
      setAppliedCoupon(null);
    }
    showToast(`Offer ${code} deleted`, "info");
  };

  const toggleCoupon = (code) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    showToast(`Offer ${code} status updated`, "info");
  };

  const updateWhatsappNumber = (newNumber) => {
    const cleaned = newNumber.replace(/\D/g, "");
    setWhatsappNumberState(cleaned);
    localStorage.setItem("dionara_whatsapp_number", cleaned);
    showToast("WhatsApp store number updated!", "success");
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          image: product.image,
          categoryName: product.categoryName,
          quantity: quantity
        }
      ];
    });
    showToast(`Added "${product.name}" to your cart!`, "success");
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from Wishlist", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Calculations
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Dynamic Coupon Application
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = Math.round(cartSubtotal * (appliedCoupon.value / 100));
    } else if (appliedCoupon.type === "flat") {
      discountAmount = Math.min(appliedCoupon.value, cartSubtotal);
    }
  }

  const freeShippingUnlocked = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = cartSubtotal === 0 ? 0 : freeShippingUnlocked ? 0 : STANDARD_SHIPPING_FEE;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const applyCoupon = (code) => {
    const normalized = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === normalized && c.active);
    if (!found) {
      showToast("Invalid or expired coupon code", "error");
      return false;
    }
    if (found.minOrder && cartSubtotal < found.minOrder) {
      showToast(`Coupon ${found.code} requires minimum order of ₹${found.minOrder}`, "error");
      return false;
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied! ${found.desc}`, "success");
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  };

  // Generate WhatsApp Message
  const formatWhatsAppOrderMessage = ({ customer, orderId, items = cart, totals = { subtotal: cartSubtotal, discount: discountAmount, shipping: shippingFee, total: cartTotal } }) => {
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    let msg = `✨ *DIONARA - NEW ORDER* ✨\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🆔 *Order ID:* #${orderId}\n`;
    msg += `📅 *Date:* ${dateStr}\n\n`;

    msg += `👤 *CUSTOMER DETAILS:*\n`;
    msg += `• Name: ${customer.name}\n`;
    msg += `• Mobile: ${customer.mobile}\n`;
    if (customer.email) msg += `• Email: ${customer.email}\n`;
    msg += `• Delivery Address:\n  ${customer.address}\n`;
    if (customer.landmark) msg += `• Landmark: ${customer.landmark}\n`;
    msg += `• City / State: ${customer.city}, ${customer.state || ""}\n`;
    msg += `• Pincode: ${customer.pincode}\n`;
    if (customer.notes) msg += `• Notes: ${customer.notes}\n`;
    msg += `• Payment Mode: ${customer.paymentMethod || "UPI / WhatsApp Pay"}\n\n`;

    msg += `🛍️ *ORDER ITEMS:*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      msg += `${index + 1}. *${item.name}*\n`;
      msg += `   Qty: ${item.quantity} × ₹${item.price} = ₹${itemTotal}\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Subtotal: ₹${totals.subtotal}\n`;
    if (totals.discount > 0) {
      msg += `Discount: -₹${totals.discount}\n`;
    }
    msg += `Shipping: ${totals.shipping === 0 ? "FREE" : "₹" + totals.shipping}\n`;
    msg += `*GRAND TOTAL: ₹${totals.total}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🙏 _Please confirm my order & share the payment / delivery details. Thank you!_`;

    return msg;
  };

  // Direct 1-Click WhatsApp Order for single product
  const directProductWhatsAppOrder = (product, quantity = 1) => {
    const singleTotal = product.price * quantity;
    let msg = `✨ *DIONARA PRODUCT INQUIRY & INSTANT ORDER* ✨\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Hello Dionara Team! I would like to order this item:\n\n`;
    msg += `🛍️ *Product:* ${product.name}\n`;
    msg += `💰 *Price:* ₹${product.price} each\n`;
    msg += `🔢 *Quantity:* ${quantity}\n`;
    msg += `💵 *Total Estimated:* ₹${singleTotal}\n`;
    msg += `🔗 *Category:* ${product.categoryName}\n\n`;
    msg += `Please confirm availability and how I can provide my shipping address and payment.`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // Save order when placed
  const addOrder = (orderData) => {
    setOrders((prev) => {
      const updated = [orderData, ...prev];
      localStorage.setItem("dionara_all_orders", JSON.stringify(updated));
      return updated;
    });
  };

  // Update order status or tracking ID
  const updateOrderStatus = (orderId, newStatus, trackingId) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.orderId === orderId) {
          return {
            ...ord,
            status: newStatus,
            trackingId: trackingId !== undefined ? trackingId : ord.trackingId
          };
        }
        return ord;
      });
      localStorage.setItem("dionara_all_orders", JSON.stringify(updated));
      return updated;
    });
    showToast(`Order #${orderId} marked as ${newStatus}`, "info");
  };

  // Update Delivery Partner Configuration
  const updateDeliveryPartner = (name, url) => {
    const updated = { name, url };
    setDeliveryPartner(updated);
    localStorage.setItem("dionara_delivery_partner", JSON.stringify(updated));
    showToast("Delivery Partner settings saved!", "success");
  };

  // Export all orders to Excel-compatible CSV file
  const exportOrdersToCSV = () => {
    if (!orders || orders.length === 0) {
      showToast("No orders available to export", "error");
      return;
    }

    const headers = [
      "Order ID",
      "Order Date",
      "Customer Name",
      "Mobile Number",
      "Email",
      "Delivery Address",
      "Landmark",
      "City",
      "State",
      "Pincode",
      "Items Ordered",
      "Total Quantity",
      "Subtotal (INR)",
      "Discount (INR)",
      "Shipping (INR)",
      "Grand Total (INR)",
      "Payment Mode",
      "Order Status",
      "Tracking Waybill",
      "Delivery Partner",
      "Delivery Partner Redirect Link"
    ];

    const rows = orders.map((ord) => {
      const itemsSummary = (ord.items || [])
        .map((item) => `${item.name} (Qty: ${item.quantity})`)
        .join("; ");
      const totalQty = (ord.items || []).reduce((sum, item) => sum + item.quantity, 0);
      const dateFormatted = ord.createdAt
        ? new Date(ord.createdAt).toLocaleString("en-IN")
        : "";
      const partnerLink = deliveryPartner?.url || DEFAULT_DELIVERY_PARTNER.url;

      const sanitize = (val) => `"${String(val || "").replace(/"/g, '""')}"`;

      return [
        sanitize(ord.orderId),
        sanitize(dateFormatted),
        sanitize(ord.customer?.name),
        sanitize(ord.customer?.mobile),
        sanitize(ord.customer?.email),
        sanitize(ord.customer?.address),
        sanitize(ord.customer?.landmark),
        sanitize(ord.customer?.city),
        sanitize(ord.customer?.state),
        sanitize(ord.customer?.pincode),
        sanitize(itemsSummary),
        totalQty,
        ord.totals?.subtotal || 0,
        ord.totals?.discount || 0,
        ord.totals?.shipping || 0,
        ord.totals?.total || 0,
        sanitize(ord.customer?.paymentMethod || "UPI"),
        sanitize(ord.status || "Pending"),
        sanitize(ord.trackingId || ""),
        sanitize(deliveryPartner?.name || "Shiprocket"),
        sanitize(partnerLink)
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `dionara_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    showToast("Excel sheet (.CSV) exported with Delivery Partner links!", "success");
  };

  // Update Connected Google Sheet URL
  const updateGoogleSheetUrl = (url) => {
    const cleaned = url.trim();
    setGoogleSheetUrl(cleaned);
    localStorage.setItem("dionara_google_sheet_url", cleaned);
    showToast("Google Sheet link saved!", "success");
  };

  // Open Google Sheet directly
  const openGoogleSheet = () => {
    window.open(googleSheetUrl, "_blank");
  };

  // Update Connected Google Sheet Webhook / Script URL
  const updateGoogleSheetWebhookUrl = (url) => {
    const cleaned = url.trim();
    setGoogleSheetWebhookUrl(cleaned);
    localStorage.setItem("dionara_google_sheet_webhook_url", cleaned);
    showToast("Google Sheet Webhook URL saved!", "success");
  };

  // Send an individual order automatically to Google Sheet
  const sendOrderToGoogleSheet = async (orderData) => {
    const webhookUrl = (googleSheetWebhookUrl || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL).trim();

    const itemsSummary = (orderData.items || [])
      .map((i) => `${i.name} (Qty: ${i.quantity}, ₹${i.price})`)
      .join("; ");
    const totalQty = (orderData.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);

    const payload = {
      orderId: orderData.orderId,
      orderDate: orderData.createdAt
        ? new Date(orderData.createdAt).toLocaleString("en-IN")
        : new Date().toLocaleString("en-IN"),
      customerName: orderData.customer?.name || "",
      mobile: orderData.customer?.mobile || "",
      email: orderData.customer?.email || "",
      address: orderData.customer?.address || "",
      landmark: orderData.customer?.landmark || "",
      city: orderData.customer?.city || "",
      state: orderData.customer?.state || "",
      pincode: orderData.customer?.pincode || "",
      notes: orderData.customer?.notes || "",
      paymentMethod: orderData.customer?.paymentMethod || "UPI / WhatsApp Pay",
      items: itemsSummary,
      totalQty: totalQty,
      subtotal: orderData.totals?.subtotal || 0,
      discount: orderData.totals?.discount || 0,
      shipping: orderData.totals?.shipping || 0,
      total: orderData.totals?.total || 0,
      status: orderData.status || "Pending Confirmation",
      trackingId: orderData.trackingId || "Pending",
      deliveryPartner: deliveryPartner?.name || "Shiprocket",
      deliveryPartnerUrl: deliveryPartner?.url || DEFAULT_DELIVERY_PARTNER.url
    };

    if (!webhookUrl) {
      console.info("Google Sheet Webhook URL not configured yet. Order saved in Dionara dashboard.");
      return { success: false, reason: "No webhook URL" };
    }

    try {
      // POST with mode: 'no-cors' avoids browser CORS preflight blocking with Google Apps Script
      await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
      return { success: true };
    } catch (error) {
      console.warn("Could not post to Google Sheet script:", error);
      return { success: false, error };
    }
  };

  // Send a test row to verify Google Sheet Webhook connection
  const sendTestOrderToGoogleSheet = async () => {
    const webhookUrl = (googleSheetWebhookUrl || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL).trim();
    if (!webhookUrl) {
      showToast("Please enter and save your Google Apps Script Web App URL first", "error");
      return false;
    }

    const testOrder = {
      orderId: `DIO-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: "Test Customer (Dionara System Test)",
        mobile: "917058805659",
        email: "test@dionara.com",
        address: "Shop 101, Dionara Care Suite",
        landmark: "Near Dionara Labs",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        notes: "Automated test order from Dionara Admin",
        paymentMethod: "UPI / WhatsApp Pay"
      },
      items: [
        {
          id: 1,
          name: "Dionara Invisible Water-Glow Sunscreen SPF 50+ PA++++",
          price: 599,
          quantity: 1
        }
      ],
      totals: {
        subtotal: 599,
        discount: 0,
        shipping: 0,
        total: 599
      },
      status: "Verified Test Row"
    };

    showToast("Sending test row to Google Sheet...", "info");
    const res = await sendOrderToGoogleSheet(testOrder);
    if (res.success) {
      showToast("Test order sent! Check your Google Sheet to verify the new row.", "success");
      return true;
    } else {
      showToast("Failed to send test row. Please check the Webhook URL.", "error");
      return false;
    }
  };

  // Sync all store orders to the Google Sheet in batch
  const syncAllOrdersToGoogleSheet = async () => {
    const webhookUrl = (googleSheetWebhookUrl || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL).trim();
    if (!webhookUrl) {
      showToast("Please configure the Google Apps Script Web App URL first", "error");
      return;
    }

    if (!orders || orders.length === 0) {
      showToast("No orders available to sync", "error");
      return;
    }

    showToast(`Syncing ${orders.length} order(s) to Google Sheet...`, "info");
    let count = 0;
    for (const ord of orders) {
      await sendOrderToGoogleSheet(ord);
      count++;
    }
    showToast(`Successfully pushed ${count} order(s) to Google Sheet!`, "success");
  };

  // Copy Orders formatted for 1-Click Paste into Google Sheet (TSV format)
  const copyOrdersForGoogleSheet = (orderId = null) => {
    const targetOrders = orderId
      ? orders.filter((o) => o.orderId === orderId)
      : orders;

    if (!targetOrders || targetOrders.length === 0) {
      showToast("No orders available to copy", "error");
      return;
    }

    const headers = [
      "Order ID",
      "Date & Time",
      "Status",
      "Customer Name",
      "Phone",
      "Email",
      "Delivery Address",
      "Landmark",
      "City",
      "State",
      "Pincode",
      "Items Ordered",
      "Quantity",
      "Subtotal (INR)",
      "Discount (INR)",
      "Shipping (INR)",
      "Grand Total (INR)",
      "Payment Mode",
      "Tracking Waybill",
      "Delivery Partner",
      "Delivery Partner Portal Link"
    ];

    const lines = targetOrders.map((ord) => {
      const itemsSummary = (ord.items || [])
        .map((item) => `${item.name} (x${item.quantity})`)
        .join("; ");
      const totalQty = (ord.items || []).reduce((sum, item) => sum + item.quantity, 0);
      const dateFormatted = ord.createdAt
        ? new Date(ord.createdAt).toLocaleString("en-IN")
        : "";
      const partnerLink = deliveryPartner?.url || DEFAULT_DELIVERY_PARTNER.url;

      return [
        ord.orderId,
        dateFormatted,
        ord.status || "Pending",
        ord.customer?.name || "",
        ord.customer?.mobile || "",
        ord.customer?.email || "",
        ord.customer?.address || "",
        ord.customer?.landmark || "",
        ord.customer?.city || "",
        ord.customer?.state || "",
        ord.customer?.pincode || "",
        itemsSummary,
        totalQty,
        ord.totals?.subtotal || 0,
        ord.totals?.discount || 0,
        ord.totals?.shipping || 0,
        ord.totals?.total || 0,
        ord.customer?.paymentMethod || "UPI",
        ord.trackingId || "",
        deliveryPartner?.name || "Shiprocket",
        partnerLink
      ].join("\t");
    });

    const clipboardText = orderId
      ? lines.join("\n")
      : [headers.join("\t"), ...lines].join("\n");

    navigator.clipboard.writeText(clipboardText);
    showToast(
      orderId
        ? `Order #${orderId} copied! Open Google Sheet & press Ctrl+V to paste.`
        : "All orders copied! Open Google Sheet, select cell A1 & press Ctrl+V.",
      "success"
    );
  };

  return (
    <ShopContext.Provider
      value={{
        isAdmin,
        loginAdmin,
        logoutAdmin,
        products,
        updateProduct,
        addProduct,
        deleteProduct,
        resetDefaultProducts,
        coupons,
        addCoupon,
        deleteCoupon,
        toggleCoupon,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal,
        freeShippingUnlocked,
        FREE_SHIPPING_THRESHOLD,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        whatsappNumber,
        updateWhatsappNumber,
        formatWhatsAppOrderMessage,
        directProductWhatsAppOrder,
        orders,
        addOrder,
        updateOrderStatus,
        deliveryPartner,
        updateDeliveryPartner,
        exportOrdersToCSV,
        googleSheetUrl,
        updateGoogleSheetUrl,
        googleSheetWebhookUrl,
        updateGoogleSheetWebhookUrl,
        sendOrderToGoogleSheet,
        sendTestOrderToGoogleSheet,
        syncAllOrdersToGoogleSheet,
        GOOGLE_APPS_SCRIPT_CODE,
        openGoogleSheet,
        copyOrdersForGoogleSheet,
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
