import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Truck,
  Tag,
  ShieldCheck,
  MessageCircle
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import { FREE_SHIPPING_THRESHOLD } from "../constants/shop";

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    freeShippingUnlocked,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState("");

  const neededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon("");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="section-container empty-cart-container">
          <div className="empty-cart-icon-wrap">
            <ShoppingBag size={48} />
          </div>
          <h2>Your Cart is Currently Empty</h2>
          <p>
            Explore our curated collections of handcrafted jewelry, fine apparel, and artisanal decor.
          </p>
          <div className="empty-cart-actions">
            <Link to="/products" className="btn-primary-action">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="section-container">
        <div className="cart-page-header">
          <h1 className="page-title">Your Shopping Bag</h1>
          <span className="cart-items-count">({cart.length} unique items)</span>
        </div>

        {/* Free Shipping Meter */}
        <div className="shipping-progress-card">
          <div className="shipping-progress-info">
            <Truck size={20} className="shipping-icon" />
            {freeShippingUnlocked ? (
              <span>
                🎉 <strong>Hooray!</strong> You have unlocked <strong>FREE Express Shipping</strong>!
              </span>
            ) : (
              <span>
                Add <strong>₹{neededForFreeShipping.toLocaleString("en-IN")}</strong> more to unlock <strong>FREE Express Shipping</strong>!
              </span>
            )}
          </div>
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill ${freeShippingUnlocked ? "complete" : ""}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="cart-layout-grid">
          {/* Cart Items List */}
          <div className="cart-items-col">
            <div className="cart-table-header">
              <span className="col-product">Product</span>
              <span className="col-price">Price</span>
              <span className="col-qty">Quantity</span>
              <span className="col-total">Subtotal</span>
              <span className="col-action"></span>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="item-details-wrap">
                    <img src={item.image} alt={item.name} className="item-thumbnail" />
                    <div className="item-meta">
                      <span className="item-category">{item.categoryName}</span>
                      <Link to={`/product/${item.id}`} className="item-title">
                        {item.name}
                      </Link>
                      <span className="item-unit-price-mobile">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="item-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </div>

                  <div className="item-quantity-ctrl">
                    <div className="qty-counter small">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="item-row-total">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>

                  <div className="item-remove-cell">
                    <button
                      className="btn-remove-item"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item from cart"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer-actions">
              <Link to="/products" className="btn-continue-shopping">
                ← Continue Shopping
              </Link>
              <button className="btn-clear-cart" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary-col">
            <div className="summary-card">
              <h3>Order Summary</h3>

              {/* Coupon Code section */}
              <div className="coupon-box">
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <div className="coupon-input-wrap">
                    <Tag size={16} />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. DIONARA10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-apply-coupon">
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="applied-coupon-pill">
                    <Sparkles size={14} />
                    <span>
                      <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.desc})
                    </span>
                    <button onClick={removeCoupon} className="remove-coupon-btn">
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Breakdown */}
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
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="free-shipping-text">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="summary-line-divider"></div>

                <div className="summary-line grand-total">
                  <span>Grand Total</span>
                  <span className="grand-total-amount">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Proceed to checkout */}
              <button
                className="btn-proceed-checkout"
                onClick={() => navigate("/checkout")}
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={18} />
              </button>

              <div className="summary-trust-bullets">
                <div className="trust-bullet">
                  <MessageCircle size={15} />
                  <span>One-click WhatsApp order confirmation</span>
                </div>
                <div className="trust-bullet">
                  <ShieldCheck size={15} />
                  <span>Encrypted & secure checkout flow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;