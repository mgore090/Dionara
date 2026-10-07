import { useState } from "react";
import {
  FileSpreadsheet,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Search,
  Filter,
  Truck,
  Settings,
  Clock,
  Package,
  AlertCircle
} from "lucide-react";
import { useShop } from "../context/ShopContext";

function AdminOrders() {
  const {
    orders,
    deliveryPartner,
    updateDeliveryPartner,
    updateOrderStatus,
    exportOrdersToCSV,
    showToast
  } = useShop();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState(deliveryPartner?.name || "Shiprocket");
  const [partnerUrl, setPartnerUrl] = useState(deliveryPartner?.url || "https://app.shiprocket.in/orders/create");
  const [copiedId, setCopiedId] = useState(null);

  // Calculations for stats
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

  const handleSavePartner = (e) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerUrl.trim()) return;
    updateDeliveryPartner(partnerName.trim(), partnerUrl.trim());
    setPartnerModalOpen(false);
  };

  return (
    <div className="admin-orders-page">
      <div className="page-header-banner admin-banner">
        <div className="section-container">
          <span className="page-subtitle">DIONARA STORE MANAGEMENT</span>
          <h1 className="page-title">Orders Management & Excel Sync</h1>
          <p className="page-lead">
            Manage incoming customer orders, export to Excel spreadsheets, and redirect directly to your delivery partner.
          </p>
        </div>
      </div>

      <div className="section-container">
        {/* Metric Cards Row */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap blue">
              <Package size={24} />
            </div>
            <div>
              <span className="stat-label">Total Orders</span>
              <strong className="stat-val">{totalOrders}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap green">
              <span className="currency-symbol">₹</span>
            </div>
            <div>
              <span className="stat-label">Total Order Value</span>
              <strong className="stat-val">₹{totalRevenue.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap amber">
              <Clock size={24} />
            </div>
            <div>
              <span className="stat-label">Pending Confirmation</span>
              <strong className="stat-val">{pendingOrders}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap purple">
              <Truck size={24} />
            </div>
            <div>
              <span className="stat-label">Shipped / Dispatched</span>
              <strong className="stat-val">{shippedOrders}</strong>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="admin-toolbar-card">
          <div className="search-filter-cluster">
            <div className="admin-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Phone, City..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm("")}>
                  ×
                </button>
              )}
            </div>

            <div className="status-filter-box">
              <Filter size={15} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="styled-admin-select"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="admin-actions-cluster">
            <button
              className="btn-export-excel"
              onClick={exportOrdersToCSV}
              title="Download entire order list as Excel CSV spreadsheet with delivery partner links"
            >
              <FileSpreadsheet size={18} />
              <span>EXPORT TO EXCEL (.CSV)</span>
            </button>

            <button
              className="btn-delivery-settings"
              onClick={() => setPartnerModalOpen(true)}
              title="Configure your delivery partner link"
            >
              <Settings size={17} />
              <span>Delivery Partner: {deliveryPartner.name}</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-wrapper">
          {filteredOrders.length > 0 ? (
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer Information</th>
                  <th>Products Ordered</th>
                  <th>Total & Payment</th>
                  <th>Order Status</th>
                  <th>Delivery Partner Action</th>
                  <th>Customer WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.orderId}>
                    {/* Order Reference */}
                    <td className="col-ref">
                      <strong>#{ord.orderId}</strong>
                      <span className="order-time">
                        {ord.createdAt
                          ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : ""}
                      </span>
                    </td>

                    {/* Customer Information */}
                    <td className="col-customer">
                      <div className="customer-info-box">
                        <strong className="customer-name">{ord.customer.name}</strong>
                        <span className="customer-mobile">📱 {ord.customer.mobile}</span>
                        <p className="customer-address">
                          {ord.customer.address}
                          {ord.customer.landmark && `, Near ${ord.customer.landmark}`}
                        </p>
                        <span className="customer-city-pin">
                          {ord.customer.city}, {ord.customer.state || ""} - {ord.customer.pincode}
                        </span>
                        <button
                          className="btn-copy-address"
                          onClick={() => handleCopyAddress(ord)}
                          title="Copy full shipping label to clipboard"
                        >
                          {copiedId === ord.orderId ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedId === ord.orderId ? "Copied!" : "Copy Shipping Address"}</span>
                        </button>
                      </div>
                    </td>

                    {/* Products Ordered */}
                    <td className="col-items">
                      <ul className="items-ordered-list">
                        {ord.items.map((item, idx) => (
                          <li key={idx}>
                            <span className="item-qty-tag">{item.quantity}×</span>
                            <span className="item-name-tag">{item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* Total & Payment */}
                    <td className="col-total">
                      <strong className="order-total-price">₹{ord.totals.total.toLocaleString("en-IN")}</strong>
                      <span className="order-pay-method">{ord.customer.paymentMethod || "UPI"}</span>
                      {ord.totals.discount > 0 && (
                        <span className="order-discount-pill">-₹{ord.totals.discount} off</span>
                      )}
                    </td>

                    {/* Status dropdown */}
                    <td className="col-status">
                      <select
                        value={ord.status || "Pending"}
                        onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                        className={`status-select status-${(ord.status || "Pending").toLowerCase()}`}
                      >
                        <option value="Pending">🟡 Pending</option>
                        <option value="Confirmed">🔵 Confirmed</option>
                        <option value="Shipped">🟣 Shipped</option>
                        <option value="Delivered">🟢 Delivered</option>
                      </select>
                    </td>

                    {/* Delivery Partner Action */}
                    <td className="col-delivery-action">
                      <div className="delivery-action-stack">
                        <button
                          className="btn-partner-redirect"
                          onClick={() => handleRedirectDeliveryPartner(ord)}
                          title={`Open ${deliveryPartner.name} portal to book courier`}
                        >
                          <Truck size={14} />
                          <span>Ship with {deliveryPartner.name}</span>
                          <ExternalLink size={12} />
                        </button>

                        <div className="tracking-input-row">
                          <input
                            type="text"
                            placeholder="Tracking / AWB #"
                            defaultValue={ord.trackingId || ""}
                            onBlur={(e) => updateOrderStatus(ord.orderId, ord.status || "Shipped", e.target.value)}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Customer WhatsApp message */}
                    <td className="col-notify">
                      <button
                        className="btn-customer-notify"
                        onClick={() => handleNotifyCustomer(ord)}
                        title="Chat or send dispatch updates to customer on WhatsApp"
                      >
                        <MessageCircle size={15} />
                        <span>Chat Customer</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-orders-view">
              <Package size={40} className="empty-icon" />
              <h3>No matching orders found</h3>
              <p>Try clearing your search terms or filter.</p>
              <button
                className="btn-primary-action"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Informative Excel & Delivery Partner Banner */}
        <div className="excel-guide-card">
          <div className="guide-header">
            <FileSpreadsheet size={28} className="guide-icon" />
            <div>
              <h3>How the Excel Sheet & Delivery Partner Link Work</h3>
              <p>
                Every order placed on Dionara is saved with complete customer delivery information. Clicking <strong>Export to Excel (.CSV)</strong> generates a clean spreadsheet file with:
              </p>
            </div>
          </div>
          <div className="guide-columns-preview">
            <div className="col-pill">Order ID & Date</div>
            <div className="col-pill">Customer Name & Mobile</div>
            <div className="col-pill">Full Shipping Address & Pincode</div>
            <div className="col-pill">Items & Quantity</div>
            <div className="col-pill">Subtotal, Discount & Total</div>
            <div className="col-pill">Payment Mode & Status</div>
            <div className="col-pill highlight">🔗 Delivery Partner Link ({deliveryPartner.name})</div>
          </div>
          <p className="guide-footnote">
            💡 The <strong>Delivery Partner Link</strong> in the Excel sheet is directly clickable in Microsoft Excel and Google Sheets, instantly taking you to your courier portal ({deliveryPartner.name}) to book or track dispatch!
          </p>
        </div>
      </div>

      {/* Delivery Partner Settings Modal */}
      {partnerModalOpen && (
        <div className="modal-backdrop" onClick={() => setPartnerModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="partner-icon-badge">
                  <Truck size={22} color="#ffffff" />
                </div>
                <div>
                  <h3>Configure Delivery Partner</h3>
                  <p className="modal-subtitle">Set your courier portal name & redirect link</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setPartnerModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="modal-form">
              <div className="form-field">
                <label className="input-label">Delivery Partner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shiprocket, Delhivery, BlueDart, Porter, India Post"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="styled-modal-input-field"
                  required
                />
              </div>

              <div className="form-field">
                <label className="input-label">Delivery Partner Portal / Booking Link</label>
                <input
                  type="url"
                  placeholder="e.g. https://app.shiprocket.in/orders/create or https://www.delhivery.com"
                  value={partnerUrl}
                  onChange={(e) => setPartnerUrl(e.target.value)}
                  className="styled-modal-input-field"
                  required
                />
              </div>

              <div className="modal-tips">
                <AlertCircle size={16} />
                <span>
                  This link will be used for the <strong>"Ship with {partnerName}"</strong> button and will be included in every exported Excel sheet row!
                </span>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setPartnerModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  Save Delivery Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
