import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FileSpreadsheet,
  ShoppingBag,
  Sparkles,
  Sliders,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Search,
  Truck,
  Settings,
  PlusCircle,
  Edit,
  Trash2,
  RotateCcw,
  ShieldAlert,
  Package,
  TrendingUp,
  AlertCircle,
  Zap,
  Code,
  RefreshCw
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import AdminProductEditModal from "../components/AdminProductEditModal";

function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "orders";

  const {
    isAdmin,
    orders,
    products,
    coupons,
    deliveryPartner,
    whatsappNumber,
    googleSheetUrl,
    updateGoogleSheetUrl,
    googleSheetWebhookUrl,
    updateGoogleSheetWebhookUrl,
    sendTestOrderToGoogleSheet,
    syncAllOrdersToGoogleSheet,
    sendOrderToGoogleSheet,
    GOOGLE_APPS_SCRIPT_CODE,
    openGoogleSheet,
    copyOrdersForGoogleSheet,
    updateDeliveryPartner,
    updateOrderStatus,
    updateProduct,
    deleteProduct,
    resetDefaultProducts,
    addCoupon,
    deleteCoupon,
    toggleCoupon,
    updateWhatsappNumber,
    exportOrdersToCSV,
    showToast
  } = useShop();

  // Sync tab with URL
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // Orders Tab State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [tempSheetUrl, setTempSheetUrl] = useState(googleSheetUrl);
  const [tempWebhookUrl, setTempWebhookUrl] = useState(googleSheetWebhookUrl || "");
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Delivery Partner Settings Modal State
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState(deliveryPartner?.name || "Shiprocket");
  const [partnerUrl, setPartnerUrl] = useState(deliveryPartner?.url || "https://app.shiprocket.in/orders/create");

  // Product Manager State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [inlinePrices, setInlinePrices] = useState({});

  // Coupon Manager State
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponType, setNewCouponType] = useState("percent");
  const [newCouponValue, setNewCouponValue] = useState("");
  const [newCouponMin, setNewCouponMin] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");

  // Store WhatsApp Settings State
  const [tempWhatsapp, setTempWhatsapp] = useState(whatsappNumber);

  // Redirect to login if not admin
  if (!isAdmin) {
    return (
      <div className="admin-access-required section-container">
        <div className="access-card">
          <div className="access-icon-circle">
            <ShieldAlert size={36} />
          </div>
          <h2>Store Admin Portal</h2>
          <p>
            Please log in with your store administrator credentials to view incoming orders, adjust pricing, export Excel sheets, and configure delivery partners.
          </p>
          <div className="access-buttons">
            <Link to="/admin/login" className="btn-primary-action">
              Log In as Admin
            </Link>
            <Link to="/" className="btn-secondary-action">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Orders Stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totals?.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending" || !o.status).length;
  const shippedOrders = orders.filter((o) => o.status === "Shipped" || o.status === "Delivered").length;

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchStatus = statusFilter === "all" || (ord.status || "Pending") === statusFilter;
    const query = searchTerm.toLowerCase().trim();
    if (!query) return matchStatus;

    const matchName = ord.customer?.name?.toLowerCase().includes(query);
    const matchMobile = ord.customer?.mobile?.includes(query);
    const matchId = ord.orderId?.toLowerCase().includes(query);
    const matchCity = ord.customer?.city?.toLowerCase().includes(query);

    return matchStatus && (matchName || matchMobile || matchId || matchCity);
  });

  // Copy customer delivery label
  const handleCopyAddress = (ord) => {
    const label = `Recipient: ${ord.customer.name}\nPhone: ${ord.customer.mobile}\nAddress: ${ord.customer.address}\nLandmark: ${ord.customer.landmark || "N/A"}\nCity/State: ${ord.customer.city}, ${ord.customer.state || ""}\nPincode: ${ord.customer.pincode}\nItems: ${ord.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}\nTotal: ₹${ord.totals.total}`;
    navigator.clipboard.writeText(label);
    setCopiedId(ord.orderId);
    showToast(`Shipping label for #${ord.orderId} copied!`, "success");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open delivery partner link
  const handleRedirectDeliveryPartner = (ord) => {
    const targetUrl = ord?.trackingId
      ? `${deliveryPartner.url}?tracking=${encodeURIComponent(ord.trackingId)}`
      : deliveryPartner.url;
    window.open(targetUrl, "_blank");
    showToast(`Redirecting to ${deliveryPartner.name}...`, "info");
  };

  // Send WhatsApp update to customer
  const handleNotifyCustomer = (ord) => {
    const mobile = ord.customer.mobile?.replace(/\D/g, "");
    let text = `Hello ${ord.customer.name}! ✨\n\n`;
    text += `Your Dionara order *#${ord.orderId}* is currently marked as *${ord.status || "Confirmed"}*.\n`;
    if (ord.trackingId) {
      text += `🚚 Delivery Partner: ${deliveryPartner.name}\n`;
      text += `📦 Tracking ID: ${ord.trackingId}\n`;
    }
    text += `\nThank you for choosing Dionara Skincare! Let us know if you need any assistance.`;

    const url = `https://wa.me/${mobile.length === 10 ? "91" + mobile : mobile}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Save Delivery Partner
  const handleSavePartner = (e) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerUrl.trim()) return;
    updateDeliveryPartner(partnerName.trim(), partnerUrl.trim());
    setPartnerModalOpen(false);
  };

  // Quick Inline Price Change
  const handleInlinePriceUpdate = (productId) => {
    const newPriceVal = inlinePrices[productId];
    if (!newPriceVal || isNaN(Number(newPriceVal)) || Number(newPriceVal) <= 0) {
      showToast("Please enter a valid price amount", "error");
      return;
    }
    updateProduct(productId, { price: Number(newPriceVal) });
    setInlinePrices((prev) => ({ ...prev, [productId]: "" }));
  };

  // Add Coupon Handler
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      showToast("Please provide a promo code", "error");
      return;
    }
    if (!newCouponValue || Number(newCouponValue) <= 0) {
      showToast("Please provide a discount amount", "error");
      return;
    }

    const added = addCoupon({
      code: newCouponCode.trim(),
      type: newCouponType,
      value: Number(newCouponValue),
      minOrder: Number(newCouponMin) || 0,
      desc: newCouponDesc.trim() || (newCouponType === "percent" ? `${newCouponValue}% OFF` : `₹${newCouponValue} OFF`)
    });

    if (added) {
      setNewCouponCode("");
      setNewCouponValue("");
      setNewCouponMin("");
      setNewCouponDesc("");
    }
  };

  // Google Sheet Webhook Sync Handlers
  const handleSaveWebhookUrl = (e) => {
    e.preventDefault();
    updateGoogleSheetWebhookUrl(tempWebhookUrl);
  };

  const handleCopyAppsScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setScriptCopied(true);
    showToast("Google Apps Script code copied to clipboard!", "success");
    setTimeout(() => setScriptCopied(false), 3000);
  };

  const handleRunTestOrder = async () => {
    setIsTestingWebhook(true);
    await sendTestOrderToGoogleSheet();
    setIsTestingWebhook(false);
  };

  const handleRunSyncAll = async () => {
    setIsSyncingAll(true);
    await syncAllOrdersToGoogleSheet();
    setIsSyncingAll(false);
  };

  return (
    <div className="admin-dashboard-page">
      {/* Admin Top Header Banner */}
      <div className="admin-header-banner">
        <div className="section-container">
          <div className="admin-banner-flex">
            <div>
              <div className="admin-tag-row">
                <span className="admin-mode-pill">STORE MANAGEMENT CONSOLE</span>
                <span className="admin-live-badge">● LIVE ADMIN VIEW</span>
              </div>
              <h1 className="admin-main-heading">Dionara Store Command Center</h1>
              <p className="admin-lead-desc">
                Manage incoming orders, export Excel sheets, adjust product prices, launch new products, and configure delivery partners.
              </p>
            </div>

            <div className="admin-header-quick-actions">
              <button
                className="btn-quick-gsheet"
                onClick={openGoogleSheet}
                title="Open connected Google Spreadsheet for order status"
              >
                <ExternalLink size={15} />
                <span>Open Google Sheet</span>
              </button>
              <button
                className="btn-quick-export"
                onClick={exportOrdersToCSV}
                title="Export all orders to Excel sheet"
              >
                <FileSpreadsheet size={16} />
                <span>Export to Excel (.CSV)</span>
              </button>
              <button
                className="btn-quick-add"
                onClick={() => {
                  setEditingProduct(null);
                  setIsNewProduct(true);
                  setProductModalOpen(true);
                }}
              >
                <PlusCircle size={16} />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-dashboard-tabs">
            <button
              className={`dashboard-tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => handleTabChange("orders")}
            >
              <FileSpreadsheet size={16} />
              <span>Orders & Excel Sync ({orders.length})</span>
              {pendingOrders > 0 && <span className="tab-bubble-counter">{pendingOrders}</span>}
            </button>

            <button
              className={`dashboard-tab-btn ${activeTab === "products" ? "active" : ""}`}
              onClick={() => handleTabChange("products")}
            >
              <ShoppingBag size={16} />
              <span>Products & Price Manager ({products.length})</span>
            </button>

            <button
              className={`dashboard-tab-btn ${activeTab === "offers" ? "active" : ""}`}
              onClick={() => handleTabChange("offers")}
            >
              <Sparkles size={16} />
              <span>Offers & Coupons ({coupons.length})</span>
            </button>

            <button
              className={`dashboard-tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => handleTabChange("settings")}
            >
              <Sliders size={16} />
              <span>Courier & Store Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="section-container admin-content-area">
        {/* ====================================================
            TAB 1: ORDERS & EXCEL SYNC
            ==================================================== */}
        {activeTab === "orders" && (
          <div className="admin-tab-pane">
            {/* Google Sheets Live Sync Hero Banner */}
            <div className="google-sheet-sync-card">
              <div className="sheet-sync-left">
                <div className="sheet-logo-icon">
                  <FileSpreadsheet size={26} />
                </div>
                <div>
                  <div className="sheet-status-tag">
                    <span className="live-pulse-dot"></span>
                    <strong>LIVE CONNECTED GOOGLE SPREADSHEET</strong>
                  </div>
                  <h3 className="sheet-title">Order Status & Courier Dispatch Tracker</h3>
                  <p className="sheet-url-text">
                    Google Sheet:{" "}
                    <a
                      href={googleSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sheet-link-display"
                    >
                      {googleSheetUrl}
                      <ExternalLink size={12} />
                    </a>
                  </p>
                </div>
              </div>
              <div className="sheet-sync-actions">
                <button
                  className="btn-open-gsheet-main"
                  onClick={openGoogleSheet}
                  title="Open live Google Sheet in new tab"
                >
                  <ExternalLink size={15} />
                  <span>Open Google Sheet</span>
                </button>
                <button
                  className="btn-copy-for-sheet"
                  onClick={() => copyOrdersForGoogleSheet()}
                  title="Copy all orders as spreadsheet rows (paste with Ctrl+V into cell A1)"
                >
                  <Copy size={15} />
                  <span>Copy All Rows (1-Click Paste)</span>
                </button>
                <button
                  className="btn-download-csv-sec"
                  onClick={exportOrdersToCSV}
                  title="Download offline Excel CSV file"
                >
                  <FileSpreadsheet size={15} />
                  <span>Download .CSV</span>
                </button>
              </div>
            </div>

            {/* Automatic Google Sheets Real-Time Sync Sub-card */}
            <div className="sheet-webhook-config-box">
              <div className="webhook-box-header">
                <div className="webhook-title-left">
                  <div className="webhook-icon-badge">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="webhook-badge-row">
                      <h4>Automated Real-Time Order Sync to Google Sheet</h4>
                      {googleSheetWebhookUrl ? (
                        <span className="badge-sync-on">
                          <span className="pulse-mini-dot"></span> LIVE WEBHOOK ACTIVE
                        </span>
                      ) : (
                        <span className="badge-sync-off">
                          SETUP WEBHOOK (1 MINUTE)
                        </span>
                      )}
                    </div>
                    <p>
                      Orders submitted by customers on the store automatically log all 22 details directly into your Google Sheet in real time.
                    </p>
                  </div>
                </div>
                <div className="webhook-actions-right">
                  <button
                    type="button"
                    className="btn-script-guide-toggle"
                    onClick={() => setShowScriptModal(true)}
                  >
                    <Code size={14} />
                    <span>Setup Guide & Script</span>
                  </button>
                  <button
                    type="button"
                    className="btn-trigger-test-order"
                    onClick={handleRunTestOrder}
                    disabled={isTestingWebhook}
                  >
                    <Zap size={14} />
                    <span>{isTestingWebhook ? "Sending..." : "Send Test Row"}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-trigger-sync-all"
                    onClick={handleRunSyncAll}
                    disabled={isSyncingAll}
                  >
                    <RefreshCw size={14} className={isSyncingAll ? "animate-spin" : ""} />
                    <span>{isSyncingAll ? "Syncing..." : "Sync All Orders"}</span>
                  </button>
                </div>
              </div>

              {/* Webhook URL Input Form */}
              <form onSubmit={handleSaveWebhookUrl} className="webhook-input-form">
                <div className="webhook-input-wrap">
                  <label>Google Apps Script Web App URL:</label>
                  <div className="input-with-button">
                    <input
                      type="url"
                      placeholder="e.g. https://script.google.com/macros/s/AKfycb.../exec"
                      value={tempWebhookUrl}
                      onChange={(e) => setTempWebhookUrl(e.target.value)}
                    />
                    <button type="submit" className="btn-save-webhook">
                      Save Webhook URL
                    </button>
                  </div>
                </div>
                <div className="webhook-quick-tips">
                  <span>💡 <strong>How it works:</strong> Click <em>'Setup Guide & Script'</em> above, paste the 20-line script into your Google Sheet, and paste your Web App URL here. Dionara will post every checkout order automatically!</span>
                </div>
              </form>
            </div>

            {/* KPI Stats Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon-wrap orders-icon">
                  <Package size={22} />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Total Orders</span>
                  <strong className="stat-number">{totalOrders}</strong>
                  <span className="stat-sub">From WhatsApp & Checkout</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap revenue-icon">
                  <TrendingUp size={22} />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Total Revenue</span>
                  <strong className="stat-number">₹{totalRevenue.toLocaleString("en-IN")}</strong>
                  <span className="stat-sub">Gross customer value</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap pending-icon">
                  <AlertCircle size={22} />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Pending Dispatch</span>
                  <strong className="stat-number">{pendingOrders}</strong>
                  <span className="stat-sub">Action required</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap shipped-icon">
                  <Truck size={22} />
                </div>
                <div className="stat-text">
                  <span className="stat-label">Shipped / Delivered</span>
                  <strong className="stat-number">{shippedOrders}</strong>
                  <span className="stat-sub">Via {deliveryPartner.name}</span>
                </div>
              </div>
            </div>

            {/* Delivery Partner Status Banner */}
            <div className="partner-integration-banner">
              <div className="partner-info-left">
                <div className="partner-icon-circle">
                  <Truck size={20} />
                </div>
                <div>
                  <h4>Delivery Partner: <strong>{deliveryPartner.name}</strong></h4>
                  <p>
                    Orders exported to Excel include direct redirect links to your {deliveryPartner.name} portal for 1-click awb creation.
                  </p>
                </div>
              </div>
              <div className="partner-banner-actions">
                <button
                  className="btn-configure-partner"
                  onClick={() => setPartnerModalOpen(true)}
                >
                  <Settings size={15} />
                  <span>Configure Courier Partner</span>
                </button>
                <button
                  className="btn-excel-export-primary"
                  onClick={exportOrdersToCSV}
                >
                  <FileSpreadsheet size={16} />
                  <span>Download Excel Sheet (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Search and Filters Toolbar */}
            <div className="orders-toolbar-card">
              <div className="toolbar-search">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, order ID, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="toolbar-filter-tabs">
                <button
                  className={`filter-pill ${statusFilter === "all" ? "active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  All ({orders.length})
                </button>
                <button
                  className={`filter-pill ${statusFilter === "Pending" ? "active" : ""}`}
                  onClick={() => setStatusFilter("Pending")}
                >
                  Pending ({orders.filter((o) => (o.status || "Pending") === "Pending").length})
                </button>
                <button
                  className={`filter-pill ${statusFilter === "Confirmed" ? "active" : ""}`}
                  onClick={() => setStatusFilter("Confirmed")}
                >
                  Confirmed ({orders.filter((o) => o.status === "Confirmed").length})
                </button>
                <button
                  className={`filter-pill ${statusFilter === "Shipped" ? "active" : ""}`}
                  onClick={() => setStatusFilter("Shipped")}
                >
                  Shipped ({orders.filter((o) => o.status === "Shipped").length})
                </button>
                <button
                  className={`filter-pill ${statusFilter === "Delivered" ? "active" : ""}`}
                  onClick={() => setStatusFilter("Delivered")}
                >
                  Delivered ({orders.filter((o) => o.status === "Delivered").length})
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="orders-table-wrapper">
              {filteredOrders.length === 0 ? (
                <div className="empty-orders-view">
                  <Package size={44} className="empty-icon" />
                  <h3>No Orders Found</h3>
                  <p>Try clearing your search query or placing a test order through the checkout.</p>
                </div>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID & Date</th>
                      <th>Customer Details</th>
                      <th>Delivery Address</th>
                      <th>Items Ordered</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Delivery Partner Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => (
                      <tr key={ord.orderId}>
                        {/* Order ID */}
                        <td className="cell-order-id">
                          <strong className="order-id-badge">#{ord.orderId}</strong>
                          <span className="order-date-text">
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })
                              : "Just now"}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="cell-customer">
                          <div className="customer-info-box">
                            <span className="customer-name">{ord.customer?.name}</span>
                            <div className="customer-contact-links">
                              <a
                                href={`https://wa.me/${ord.customer?.mobile?.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="whatsapp-customer-link"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle size={13} />
                                <span>+{ord.customer?.mobile}</span>
                              </a>
                            </div>
                            {ord.customer?.email && (
                              <span className="customer-email-sub">{ord.customer.email}</span>
                            )}
                          </div>
                        </td>

                        {/* Shipping Address */}
                        <td className="cell-address">
                          <p className="address-snippet">
                            {ord.customer?.address}
                            {ord.customer?.landmark && `, Near ${ord.customer.landmark}`}
                          </p>
                          <span className="address-city-badge">
                            {ord.customer?.city}, {ord.customer?.pincode}
                          </span>
                          <button
                            className="btn-copy-address"
                            onClick={() => handleCopyAddress(ord)}
                            title="Copy complete delivery label for courier"
                          >
                            {copiedId === ord.orderId ? (
                              <>
                                <Check size={12} />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy Label</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Items */}
                        <td className="cell-items">
                          <ul className="order-items-list">
                            {(ord.items || []).map((item, idx) => (
                              <li key={idx}>
                                <span className="item-qty-tag">{item.quantity}x</span>
                                <span className="item-name-tag">{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        </td>

                        {/* Total */}
                        <td className="cell-total">
                          <strong className="order-total-price">
                            ₹{(ord.totals?.total || 0).toLocaleString("en-IN")}
                          </strong>
                          <span className="order-pay-method">{ord.customer?.paymentMethod || "UPI"}</span>
                          {ord.coupon && (
                            <span className="order-discount-pill">Code: {ord.coupon}</span>
                          )}
                        </td>

                        {/* Status Select */}
                        <td className="cell-status">
                          <select
                            value={ord.status || "Pending"}
                            onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                            className={`status-select status-${(ord.status || "pending").toLowerCase()}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Delivery Partner Actions */}
                        <td className="cell-actions">
                          <div className="delivery-action-stack">
                            {/* Courier Redirect Button */}
                            <button
                              className="btn-partner-redirect"
                              onClick={() => handleRedirectDeliveryPartner(ord)}
                              title={`Create shipment directly on ${deliveryPartner.name}`}
                            >
                              <ExternalLink size={13} />
                              <span>Ship with {deliveryPartner.name}</span>
                            </button>

                            {/* Tracking ID Input */}
                            <div className="tracking-input-row">
                              <input
                                type="text"
                                placeholder="Tracking / AWB #"
                                defaultValue={ord.trackingId || ""}
                                onBlur={(e) => updateOrderStatus(ord.orderId, ord.status || "Pending", e.target.value)}
                              />
                            </div>

                            {/* WhatsApp Notification Button */}
                            <button
                              className="btn-customer-notify"
                              onClick={() => handleNotifyCustomer(ord)}
                              title="Send tracking status update to customer on WhatsApp"
                            >
                              <MessageCircle size={13} />
                              <span>Notify Customer</span>
                            </button>

                            {/* Copy single row for Google Sheet */}
                            <button
                              className="btn-sheet-copy-row"
                              onClick={() => copyOrdersForGoogleSheet(ord.orderId)}
                              title="Copy this order row to paste directly into Google Sheet"
                            >
                              <Copy size={12} />
                              <span>Copy for Google Sheet</span>
                            </button>

                            {/* Push single row to Google Sheet automatically via webhook */}
                            <button
                              className="btn-sheet-push-row"
                              onClick={async () => {
                                const res = await sendOrderToGoogleSheet(ord);
                                if (res.success) {
                                  showToast(`Order #${ord.orderId} pushed to Google Sheet!`, "success");
                                } else {
                                  showToast("Configured Webhook URL needed to sync live to Sheet", "info");
                                }
                              }}
                              title="Push this individual order to Google Sheet"
                            >
                              <Zap size={12} />
                              <span>Auto-Push to Sheet</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Excel & Google Sheet Sync Explainer Card */}
            <div className="excel-guide-card">
              <div className="guide-header">
                <FileSpreadsheet size={24} className="guide-icon" />
                <div>
                  <h3>Google Sheets & Delivery Partner Live Integration</h3>
                  <p>
                    All order records and statuses are connected to your Dionara Google Sheet:{" "}
                    <a
                      href={googleSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#0284c7", fontWeight: "700" }}
                    >
                      {googleSheetUrl}
                    </a>.
                    Click <strong>'Copy All Rows (1-Click Paste)'</strong> above, open cell A1 in the sheet, and press <strong>Ctrl + V</strong>.
                    Column <strong>Delivery Partner Portal Link</strong> enables instant label creation on {deliveryPartner.name}.
                  </p>
                </div>
              </div>
              <div className="guide-columns-preview">
                <span className="col-pill">Order ID</span>
                <span className="col-pill">Date & Time</span>
                <span className="col-pill">Order Status</span>
                <span className="col-pill">Customer Name</span>
                <span className="col-pill">Phone</span>
                <span className="col-pill">Email</span>
                <span className="col-pill">Delivery Address</span>
                <span className="col-pill">Pincode</span>
                <span className="col-pill">Items Ordered</span>
                <span className="col-pill">Total Quantity</span>
                <span className="col-pill">Grand Total</span>
                <span className="col-pill">Payment</span>
                <span className="col-pill highlight">Tracking Waybill</span>
                <span className="col-pill highlight">Delivery Partner</span>
                <span className="col-pill highlight">Delivery Partner Portal Link</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 2: PRODUCTS & PRICE MANAGER
            ==================================================== */}
        {activeTab === "products" && (
          <div className="admin-tab-pane">
            <div className="pane-header-actions">
              <div>
                <h2>Store Catalog & Live Pricing Manager</h2>
                <p>
                  Change product selling prices, original MRP, inventory status, or add new skincare products directly to the live website.
                </p>
              </div>
              <div className="pane-buttons-group">
                <button
                  className="btn-reset-catalog"
                  onClick={resetDefaultProducts}
                  title="Reset to Dionara's 2 core products"
                >
                  <RotateCcw size={15} />
                  <span>Reset to 2 Default Products</span>
                </button>
                <button
                  className="btn-primary-action"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsNewProduct(true);
                    setProductModalOpen(true);
                  }}
                >
                  <PlusCircle size={16} />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            <div className="admin-products-table-wrap">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Selling Price</th>
                    <th>MRP / Old Price</th>
                    <th>Stock Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      {/* Product details */}
                      <td className="product-info-cell">
                        <div className="product-thumb-flex">
                          <img src={p.image} alt={p.name} className="product-row-thumb" />
                          <div>
                            <Link to={`/product/${p.id}`} className="product-row-title" target="_blank">
                              {p.name}
                              <ExternalLink size={12} className="inline-link-icon" />
                            </Link>
                            <span className="product-row-volume">{p.volume} • {p.badge || "No badge"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="category-pill-tag">{p.categoryName}</span>
                      </td>

                      {/* Selling Price with Quick Inline Edit */}
                      <td>
                        <div className="inline-price-editor">
                          <div className="price-display-group">
                            <span className="current-price-badge">₹{p.price}</span>
                          </div>
                          <div className="inline-edit-input-group">
                            <span className="currency-symbol">₹</span>
                            <input
                              type="number"
                              min="1"
                              placeholder={String(p.price)}
                              value={inlinePrices[p.id] !== undefined ? inlinePrices[p.id] : ""}
                              onChange={(e) => setInlinePrices({ ...inlinePrices, [p.id]: e.target.value })}
                            />
                            {inlinePrices[p.id] && (
                              <button
                                className="btn-apply-price"
                                onClick={() => handleInlinePriceUpdate(p.id)}
                                title="Update price immediately"
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Old Price */}
                      <td>
                        <span className="old-price-badge">₹{p.oldPrice || p.price}</span>
                        {p.oldPrice && p.oldPrice > p.price && (
                          <span className="discount-tag-sub">
                            {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% OFF
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td>
                        <div className="stock-control-cell">
                          <label className="stock-toggle-label">
                            <input
                              type="checkbox"
                              checked={p.inStock}
                              onChange={(e) => updateProduct(p.id, { inStock: e.target.checked })}
                            />
                            <span className={p.inStock ? "text-in-stock" : "text-out-of-stock"}>
                              {p.inStock ? "In Stock" : "Sold Out"}
                            </span>
                          </label>
                          <span className="stock-units-text">{p.stockCount || 50} units</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="row-actions-group">
                          <button
                            className="btn-edit-product-row"
                            onClick={() => {
                              setEditingProduct(p);
                              setIsNewProduct(false);
                              setProductModalOpen(true);
                            }}
                            title="Edit full product details"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>

                          <button
                            className="btn-delete-product-row"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            title="Remove product from store"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 3: OFFERS & COUPONS MANAGER
            ==================================================== */}
        {activeTab === "offers" && (
          <div className="admin-tab-pane">
            <div className="pane-header-actions">
              <div>
                <h2>Promo Offers & Coupon Code Management</h2>
                <p>
                  Create promo codes for customers (e.g. 10% off, ₹100 off), enable/disable them instantly, or set minimum order values.
                </p>
              </div>
            </div>

            {/* Create Coupon Form Card */}
            <div className="create-coupon-card">
              <h3>
                <PlusCircle size={18} />
                <span>Create New Discount Coupon</span>
              </h3>
              <form onSubmit={handleCreateCoupon} className="create-coupon-form">
                <div className="form-fields-row">
                  <div className="form-field-group">
                    <label>Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SUMMER20, GLOW50"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                    >
                      <option value="percent">Percentage Discount (%)</option>
                      <option value="flat">Flat Rupee Discount (₹)</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label>Discount Amount *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder={newCouponType === "percent" ? "15 (for 15%)" : "100 (for ₹100)"}
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Min. Order Value (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0 (no minimum)"
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Description Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Special 15% Off"
                      value={newCouponDesc}
                      onChange={(e) => setNewCouponDesc(e.target.value)}
                    />
                  </div>
                </div>

                <div className="coupon-form-actions">
                  <button type="submit" className="btn-create-coupon">
                    <Sparkles size={16} />
                    <span>Create & Activate Coupon</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons Table */}
            <div className="coupons-table-wrapper">
              <table className="coupons-table">
                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Discount</th>
                    <th>Min. Cart Value</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.code}>
                      <td>
                        <strong className="coupon-code-tag">{c.code}</strong>
                      </td>
                      <td>
                        <span className="coupon-value-badge">
                          {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                        </span>
                      </td>
                      <td>{c.minOrder ? `₹${c.minOrder}` : "No Minimum"}</td>
                      <td>{c.desc}</td>
                      <td>
                        <label className="coupon-toggle-switch">
                          <input
                            type="checkbox"
                            checked={c.active}
                            onChange={() => toggleCoupon(c.code)}
                          />
                          <span className={c.active ? "badge-active" : "badge-inactive"}>
                            {c.active ? "Active" : "Inactive"}
                          </span>
                        </label>
                      </td>
                      <td>
                        <button
                          className="btn-delete-coupon"
                          onClick={() => deleteCoupon(c.code)}
                          title="Delete coupon"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 4: SETTINGS (DELIVERY PARTNER & WHATSAPP)
            ==================================================== */}
        {activeTab === "settings" && (
          <div className="admin-tab-pane">
            <div className="pane-header-actions">
              <div>
                <h2>Store Integration & Courier Settings</h2>
                <p>
                  Configure your business WhatsApp number and default delivery partner portal (e.g. Shiprocket, Delhivery, etc.).
                </p>
              </div>
            </div>

            <div className="settings-grid-two">
              {/* WhatsApp Config Card */}
              <div className="settings-card">
                <div className="card-header-icon">
                  <MessageCircle size={24} className="icon-whatsapp" />
                  <div>
                    <h3>Store WhatsApp Ordering Number</h3>
                    <p>Customer checkout orders and questions will be routed directly to this WhatsApp number.</p>
                  </div>
                </div>

                <div className="settings-card-body">
                  <div className="form-field-group">
                    <label>WhatsApp Number (With Country Code)</label>
                    <div className="prefix-input-wrap">
                      <span className="prefix-tag">+</span>
                      <input
                        type="text"
                        value={tempWhatsapp}
                        onChange={(e) => setTempWhatsapp(e.target.value)}
                        placeholder="917058805659"
                      />
                    </div>
                    <span className="field-hint">Current: +{whatsappNumber}</span>
                  </div>

                  <div className="settings-actions-row">
                    <button
                      className="btn-save-settings"
                      onClick={() => updateWhatsappNumber(tempWhatsapp)}
                    >
                      Save WhatsApp Number
                    </button>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=Test%20Dionara%20Store%20Connection`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-test-wa"
                    >
                      <ExternalLink size={14} />
                      <span>Test WhatsApp Link</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Delivery Partner Config Card */}
              <div className="settings-card">
                <div className="card-header-icon">
                  <Truck size={24} className="icon-courier" />
                  <div>
                    <h3>Default Delivery Partner Integration</h3>
                    <p>Configure the logistics portal used for Excel exports and 1-click order shipping.</p>
                  </div>
                </div>

                <div className="settings-card-body">
                  <div className="form-field-group">
                    <label>Quick Courier Presets</label>
                    <div className="courier-presets-grid">
                      <button
                        type="button"
                        className={`preset-courier-btn ${partnerName === "Shiprocket" ? "active" : ""}`}
                        onClick={() => {
                          setPartnerName("Shiprocket");
                          setPartnerUrl("https://app.shiprocket.in/orders/create");
                        }}
                      >
                        Shiprocket
                      </button>
                      <button
                        type="button"
                        className={`preset-courier-btn ${partnerName === "Delhivery" ? "active" : ""}`}
                        onClick={() => {
                          setPartnerName("Delhivery");
                          setPartnerUrl("https://one.delhivery.com/");
                        }}
                      >
                        Delhivery
                      </button>
                      <button
                        type="button"
                        className={`preset-courier-btn ${partnerName === "Shadowfax" ? "active" : ""}`}
                        onClick={() => {
                          setPartnerName("Shadowfax");
                          setPartnerUrl("https://dashboard.shadowfax.in/");
                        }}
                      >
                        Shadowfax
                      </button>
                      <button
                        type="button"
                        className={`preset-courier-btn ${partnerName === "Blue Dart" ? "active" : ""}`}
                        onClick={() => {
                          setPartnerName("Blue Dart");
                          setPartnerUrl("https://www.bluedart.com/");
                        }}
                      >
                        Blue Dart
                      </button>
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label>Partner Name</label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Portal Redirect URL</label>
                    <input
                      type="url"
                      value={partnerUrl}
                      onChange={(e) => setPartnerUrl(e.target.value)}
                    />
                  </div>

                  <div className="settings-actions-row">
                    <button
                      className="btn-save-settings"
                      onClick={() => updateDeliveryPartner(partnerName, partnerUrl)}
                    >
                      Save Delivery Partner
                    </button>
                    <a
                      href={deliveryPartner.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-test-wa"
                    >
                      <ExternalLink size={14} />
                      <span>Open {deliveryPartner.name}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Connected Google Sheet Configuration Card */}
              <div className="settings-card col-span-2">
                <div className="card-header-icon">
                  <FileSpreadsheet size={24} className="icon-sheet-green" />
                  <div>
                    <h3>Live Google Spreadsheet Integration</h3>
                    <p>
                      Your Dionara store is linked to this Google Sheet for orders, customer addresses, and tracking statuses.
                    </p>
                  </div>
                </div>

                <div className="settings-card-body">
                  <div className="form-field-group">
                    <label>Google Spreadsheet Link</label>
                    <div className="prefix-input-wrap">
                      <input
                        type="url"
                        value={tempSheetUrl}
                        onChange={(e) => setTempSheetUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                      />
                    </div>
                    <span className="field-hint">
                      Current: <a href={googleSheetUrl} target="_blank" rel="noreferrer" style={{ color: "#0284c7" }}>{googleSheetUrl}</a>
                    </span>
                  </div>

                  <div className="settings-actions-row">
                    <button
                      className="btn-save-settings"
                      onClick={() => updateGoogleSheetUrl(tempSheetUrl)}
                    >
                      Save Google Sheet Link
                    </button>
                    <button
                      type="button"
                      className="btn-test-wa"
                      onClick={openGoogleSheet}
                    >
                      <ExternalLink size={14} />
                      <span>Open in Google Sheets</span>
                    </button>
                    <button
                      type="button"
                      className="btn-test-wa"
                      onClick={() => copyOrdersForGoogleSheet()}
                    >
                      <Copy size={14} />
                      <span>Copy All Rows (1-Click Paste)</span>
                    </button>
                  </div>

                  <div className="sheet-instructions-box">
                    <h4>📋 Quick Setup & Paste Guide:</h4>
                    <ol>
                      <li>Click <strong>'Copy All Rows'</strong> button above (or on the Orders tab).</li>
                      <li>Open your Google Sheet at: <a href={googleSheetUrl} target="_blank" rel="noreferrer" style={{ color: "#0284c7", fontWeight: 700 }}>{googleSheetUrl}</a></li>
                      <li>Click cell <strong>A1</strong> and press <strong>Ctrl + V</strong>.</li>
                      <li>All columns (Order ID, Status, Customer Name, Mobile, Address, Items, Total, Payment, Tracking Waybill, Delivery Partner Link) will populate into organized spreadsheet columns!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit / Add Product Modal */}
      <AdminProductEditModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        productToEdit={editingProduct}
        isNew={isNewProduct}
      />

      {/* Delivery Partner Quick Modal */}
      {partnerModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setPartnerModalOpen(false)}>
          <div className="admin-modal-window modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-header-left">
                <span className="admin-badge-pill">COURIER INTEGRATION</span>
                <h3>Configure Delivery Partner</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setPartnerModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="admin-product-form">
              <div className="form-field-group">
                <label>Courier Name</label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Direct Portal URL</label>
                <input
                  type="url"
                  required
                  value={partnerUrl}
                  onChange={(e) => setPartnerUrl(e.target.value)}
                />
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setPartnerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save-product">
                  Save Courier Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Apps Script Setup & Automation Guide Modal */}
      {showScriptModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowScriptModal(false)}>
          <div className="admin-modal-window modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-header-left">
                <span className="admin-badge-pill">LIVE GOOGLE SHEETS SETUP</span>
                <h3>Automated Google Sheet Receiver Setup</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setShowScriptModal(false)}>
                &times;
              </button>
            </div>

            <div className="apps-script-modal-content">
              <div className="setup-target-sheet-bar">
                <span>Target Connected Spreadsheet:</span>
                <a
                  href={googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="target-sheet-link"
                >
                  {googleSheetUrl}
                  <ExternalLink size={13} />
                </a>
              </div>

              <div className="setup-steps-list">
                <div className="setup-step-item">
                  <div className="step-badge">1</div>
                  <div className="step-content">
                    <strong>Open Apps Script in Google Sheets</strong>
                    <p>
                      Click the link above to open your Google Sheet. In the top navigation bar, click <strong>Extensions</strong> &rarr; <strong>Apps Script</strong>.
                    </p>
                  </div>
                </div>

                <div className="setup-step-item">
                  <div className="step-badge">2</div>
                  <div className="step-content">
                    <strong>Paste this Script & Save</strong>
                    <p>
                      In the code editor, delete any existing code, paste the script below, and click the <strong>Save</strong> (💾) button.
                    </p>
                  </div>
                </div>

                <div className="setup-step-item">
                  <div className="setup-step-badge-green">3</div>
                  <div className="step-content">
                    <strong>Deploy as Web App</strong>
                    <p>
                      Click the blue <strong>Deploy</strong> button (top right) &rarr; <strong>New deployment</strong>.
                      Select type <strong>Web app</strong>. Set <em>Execute as:</em> <strong>Me</strong> and <em>Who has access:</em> <strong>Anyone</strong>.
                      Click <strong>Deploy</strong>, copy the generated <strong>Web app URL</strong>, and paste it into the Dionara Admin input.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code viewer with 1-click copy */}
              <div className="script-code-viewer">
                <div className="viewer-header">
                  <span>Google Apps Script (Code.gs)</span>
                  <button className="btn-copy-code-inline" onClick={handleCopyAppsScript}>
                    {scriptCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{scriptCopied ? "Copied to Clipboard!" : "Copy Full Code"}</span>
                  </button>
                </div>
                <pre className="script-code-block">
                  <code>{GOOGLE_APPS_SCRIPT_CODE}</code>
                </pre>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-primary-action"
                  onClick={handleCopyAppsScript}
                >
                  <Copy size={15} />
                  <span>{scriptCopied ? "Code Copied!" : "Copy Code to Clipboard"}</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setShowScriptModal(false)}
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
