import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle,
  MessageCircle,
  Copy,
  Printer,
  ShoppingBag,
  Check
} from "lucide-react";
import { useShop } from "../context/ShopContext";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const urlOrderId = searchParams.get("orderId");
  const { whatsappNumber, formatWhatsAppOrderMessage, showToast } = useShop();

  const [order] = useState(() => {
    try {
      const saved = localStorage.getItem("dionara_last_order");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [copied, setCopied] = useState(false);

  const orderId = urlOrderId || order?.orderId || "DIO-893120";

  // Re-send to WhatsApp handler
  const handleReopenWhatsApp = () => {
    if (order) {
      const message = formatWhatsAppOrderMessage({
        customer: order.customer,
        orderId: order.orderId,
        items: order.items,
        totals: order.totals
      });
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    } else {
      window.open(`https://wa.me/${whatsappNumber}`, "_blank");
    }
  };

  const handleCopyDetails = () => {
    if (order) {
      const message = formatWhatsAppOrderMessage({
        customer: order.customer,
        orderId: order.orderId,
        items: order.items,
        totals: order.totals
      });
      navigator.clipboard.writeText(message);
      setCopied(true);
      showToast("Order details copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="order-success-page">
      <div className="section-container">
        <div className="success-card">
          <div className="success-header">
            <div className="success-badge-icon">
              <CheckCircle size={48} color="#16a34a" />
            </div>
            <span className="order-pretitle">ORDER PLACED SUCCESSFULLY</span>
            <h1>Thank You for Choosing Dionara!</h1>
            <p className="order-lead-text">
              Your order request has been generated and sent to our official WhatsApp store.
            </p>
            <div className="order-id-badge">
              <span>Order Reference:</span>
              <strong>#{orderId}</strong>
            </div>
          </div>

          {/* WhatsApp Primary Re-direct Callout */}
          <div className="whatsapp-action-callout">
            <div className="callout-left">
              <div className="wa-icon-large">
                <MessageCircle size={32} />
              </div>
              <div>
                <h3>Need to send or re-send your order on WhatsApp?</h3>
                <p>
                  If WhatsApp didn't open automatically, tap below to chat with Dionara store at <strong>+{whatsappNumber}</strong>.
                </p>
              </div>
            </div>
            <div className="callout-actions">
              <button className="btn-resend-wa" onClick={handleReopenWhatsApp}>
                <MessageCircle size={18} />
                <span>Open WhatsApp Chat</span>
              </button>
              <button className="btn-copy-wa" onClick={handleCopyDetails}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? "Copied!" : "Copy Order Text"}</span>
              </button>
            </div>
          </div>

          {/* What happens next */}
          <div className="next-steps-container">
            <h3>What Happens Next?</h3>
            <div className="steps-row">
              <div className="next-step-box">
                <div className="step-circle">1</div>
                <h4>Message Received</h4>
                <p>Our team receives your order items and delivery details on WhatsApp.</p>
              </div>
              <div className="next-step-box">
                <div className="step-circle">2</div>
                <h4>Order Confirmation</h4>
                <p>We review stock and send you payment verification or COD confirmation.</p>
              </div>
              <div className="next-step-box">
                <div className="step-circle">3</div>
                <h4>Dispatch & Tracking</h4>
                <p>Your package is safely packed and tracking ID is shared on your WhatsApp.</p>
              </div>
            </div>
          </div>

          {/* Order Details Receipt */}
          {order && (
            <div className="receipt-section">
              <div className="receipt-header">
                <h3>Order Receipt</h3>
                <span>Date: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>

              {/* Delivery Info */}
              <div className="receipt-customer-details">
                <div className="receipt-block">
                  <h4>Delivery Address</h4>
                  <p><strong>{order.customer.name}</strong></p>
                  <p>{order.customer.address}</p>
                  <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                  <p>WhatsApp: {order.customer.mobile}</p>
                </div>
                <div className="receipt-block">
                  <h4>Payment Information</h4>
                  <p><strong>Method:</strong> {order.customer.paymentMethod}</p>
                  <p><strong>Status:</strong> Awaiting WhatsApp Confirmation</p>
                  {order.customer.notes && (
                    <p><strong>Notes:</strong> {order.customer.notes}</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="receipt-items-table">
                <h4>Items Ordered</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="receipt-item-row">
                    <img src={item.image} alt={item.name} className="receipt-item-thumb" />
                    <div className="receipt-item-info">
                      <span className="receipt-item-name">{item.name}</span>
                      <span className="receipt-item-qty">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</span>
                    </div>
                    <span className="receipt-item-subtotal">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="receipt-totals-box">
                <div className="receipt-totals-line">
                  <span>Subtotal:</span>
                  <span>₹{order.totals.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="receipt-totals-line discount">
                    <span>Discount:</span>
                    <span>-₹{order.totals.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="receipt-totals-line">
                  <span>Shipping:</span>
                  <span>{order.totals.shipping === 0 ? "FREE" : `₹${order.totals.shipping}`}</span>
                </div>
                <div className="receipt-totals-line grand">
                  <span>Total Amount:</span>
                  <span>₹{order.totals.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom actions */}
          <div className="success-footer-actions">
            <Link to="/products" className="btn-primary-action">
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
            </Link>
            <button className="btn-secondary-action" onClick={() => window.print()}>
              <Printer size={18} />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
