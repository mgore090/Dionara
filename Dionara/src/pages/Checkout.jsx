import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  CreditCard,
  Banknote
} from "lucide-react";
import { useShop } from "../context/ShopContext";

function Checkout() {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    whatsappNumber,
    formatWhatsAppOrderMessage,
    clearCart,
    addOrder,
    showToast
  } = useShop();

  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    notes: "",
    paymentMethod: "UPI / WhatsApp Pay"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="section-container empty-cart-container">
          <h2>No items in your cart to checkout</h2>
          <p>Please add products from our collection before proceeding to checkout.</p>
          <Link to="/products" className="btn-primary-action">
            Shop Collection
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Basic validation
    if (!customer.name.trim() || !customer.mobile.trim() || !customer.address.trim() || !customer.city.trim() || !customer.pincode.trim()) {
      showToast("Please fill all required delivery details", "error");
      return;
    }

    setIsSubmitting(true);

    const orderId = `DIO-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      orderId,
      customer,
      items: cart,
      totals: {
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingFee,
        total: cartTotal
      },
      coupon: appliedCoupon ? appliedCoupon.code : null,
      createdAt: new Date().toISOString()
    };

    // Save order in localStorage for confirmation receipt and all orders list
    try {
      localStorage.setItem("dionara_last_order", JSON.stringify(orderData));
      addOrder(orderData);
    } catch {
      // storage quota fallback
    }

    // Format WhatsApp message
    const message = formatWhatsAppOrderMessage({
      customer,
      orderId,
      items: cart,
      totals: orderData.totals
    });

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Clear cart and navigate to order success receipt
    clearCart();
    showToast("Order prepared! Opening WhatsApp...", "success");

    setTimeout(() => {
      navigate(`/order-success?orderId=${orderId}`);
    }, 400);
  };

  return (
    <div className="checkout-page">
      <div className="section-container">
        {/* Step progress bar */}
        <div className="checkout-stepper">
          <div className="step done">
            <span className="step-icon"><CheckCircle2 size={16} /></span>
            <span>1. Shopping Bag</span>
          </div>
          <div className="step-divider done"></div>
          <div className="step active">
            <span className="step-num">2</span>
            <span>2. Delivery Details</span>
          </div>
          <div className="step-divider"></div>
          <div className="step">
            <span className="step-num">3</span>
            <span>3. WhatsApp Confirmation</span>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Left: Form */}
          <div className="checkout-form-col">
            <div className="form-card">
              <div className="form-card-header">
                <h2>Shipping & Contact Information</h2>
                <p>We will send your order dispatch and tracking updates to this WhatsApp number.</p>
              </div>

              <form onSubmit={handlePlaceOrder} id="checkout-form">
                {/* Contact row */}
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Priya Sharma"
                      value={customer.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="e.g. 9876543210"
                      value={customer.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Email Address (For receipt)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. priya@example.com"
                    value={customer.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Address row */}
                <div className="form-field">
                  <label>Complete House / Flat Address *</label>
                  <textarea
                    rows={3}
                    name="address"
                    placeholder="Flat / House No., Apartment or Society, Street Name"
                    value={customer.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="Near City Center / Temple"
                      value={customer.landmark}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="e.g. 400001"
                      value={customer.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. Mumbai"
                      value={customer.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="e.g. Maharashtra"
                      value={customer.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Order Notes / Gift Message (Optional)</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Please pack as a gift / call before delivery"
                    value={customer.notes}
                    onChange={handleChange}
                  />
                </div>

                {/* Payment Selection */}
                <div className="payment-options-block">
                  <label className="section-label">Preferred Payment Mode</label>
                  <div className="payment-radios">
                    <label className={`radio-card ${customer.paymentMethod === "UPI / WhatsApp Pay" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI / WhatsApp Pay"
                        checked={customer.paymentMethod === "UPI / WhatsApp Pay"}
                        onChange={handleChange}
                      />
                      <CreditCard size={18} />
                      <div>
                        <strong>UPI / WhatsApp Pay</strong>
                        <span>Fastest via GPay, PhonePe, Paytm or WhatsApp</span>
                      </div>
                    </label>

                    <label className={`radio-card ${customer.paymentMethod === "Cash on Delivery" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={customer.paymentMethod === "Cash on Delivery"}
                        onChange={handleChange}
                      />
                      <Banknote size={18} />
                      <div>
                        <strong>Cash on Delivery (COD)</strong>
                        <span>Pay in cash upon doorstep delivery</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* WhatsApp Order Action Button */}
                <div className="checkout-submit-wrap">
                  <button
                    type="submit"
                    className="btn-place-whatsapp-order"
                    disabled={isSubmitting}
                  >
                    <MessageCircle size={22} />
                    <span>
                      {isSubmitting ? "Submitting Order..." : `SUBMIT ORDER TO WHATSAPP (+${whatsappNumber})`}
                    </span>
                  </button>
                  <p className="whatsapp-help-note">
                    ✅ All filled address details & cart products will be sent directly to <strong>+{whatsappNumber}</strong> on WhatsApp for instant confirmation.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary-col">
            <div className="summary-card">
              <div className="summary-title-row">
                <h3>Order Summary</h3>
                <Link to="/cart" className="edit-cart-link">
                  <ArrowLeft size={14} />
                  <span>Edit Bag</span>
                </Link>
              </div>

              {/* Items mini list */}
              <div className="checkout-items-preview">
                {cart.map((item) => (
                  <div key={item.id} className="preview-item">
                    <img src={item.image} alt={item.name} className="preview-img" />
                    <div className="preview-info">
                      <span className="preview-title">{item.name}</span>
                      <span className="preview-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="preview-price">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="summary-rows">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="summary-line discount-line">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="summary-line">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>

                <div className="summary-line-divider"></div>

                <div className="summary-line grand-total">
                  <span>Total Payable</span>
                  <span className="grand-total-amount">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* WhatsApp recipient info card */}
              <div className="recipient-store-box">
                <div className="store-wa-header">
                  <MessageCircle size={18} color="#25D366" />
                  <span>Sending to Verified WhatsApp Store</span>
                </div>
                <p>
                  Your order is submitted to Dionara Store: <strong>+{whatsappNumber}</strong>. You will receive an immediate response with order confirmation and payment link.
                </p>
              </div>

              <div className="safe-checkout-badge">
                <Lock size={15} />
                <span>Zero hassle checkout • Verified Merchant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;