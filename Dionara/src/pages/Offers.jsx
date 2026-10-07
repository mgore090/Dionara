import { Sparkles, Tag, Truck, ShoppingBag, ArrowRight } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Offers() {
  const { coupons, products, applyCoupon, addToCart, showToast } = useShop();

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    showToast(`Code ${code} copied and applied to your cart!`, "success");
  };

  const handleAddBundle = () => {
    products.forEach((p) => addToCart(p, 1));
    showToast("Added Dionara Daily Routine to Cart!", "success");
  };

  const activeCoupons = coupons.filter((c) => c.active);

  return (
    <div className="offers-page">
      <div className="page-header-banner">
        <div className="section-container">
          <span className="page-subtitle">SPECIAL PROMOTIONS & DEALS</span>
          <h1 className="page-title">Exclusive Dionara Offers</h1>
          <p className="page-lead">
            Save more on your daily suncare and ceramide barrier routine with our active promo coupons and value bundles.
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="offers-grid">
          {/* Dynamic Active Coupons created by Admin or Default */}
          {activeCoupons.map((coupon, idx) => (
            <div
              key={coupon.code}
              className={`offer-card ${idx === 0 ? "featured-offer" : ""}`}
            >
              {idx === 0 && (
                <div className="offer-badge-tag">
                  <Sparkles size={14} />
                  <span>FEATURED OFFER</span>
                </div>
              )}
              <div className="offer-icon-circle">
                <Tag size={28} />
              </div>
              <h3>
                {coupon.type === "percent"
                  ? `${coupon.value}% Off Your Order`
                  : `₹${coupon.value} Flat Discount`}
              </h3>
              <p>
                {coupon.desc || "Special promo discount applicable at checkout."}
                {coupon.minOrder > 0 && ` (Min cart value: ₹${coupon.minOrder})`}
              </p>
              <div className="coupon-code-pill">
                <span>Code: <strong>{coupon.code}</strong></span>
                <button
                  className="btn-copy-code"
                  onClick={() => handleCopyCode(coupon.code)}
                >
                  Copy & Apply
                </button>
              </div>
              <span className="offer-validity">
                {coupon.minOrder ? `Orders above ₹${coupon.minOrder}` : "Valid on all orders"} • Active
              </span>
            </div>
          ))}

          {/* Standard Free Express Delivery Offer */}
          <div className="offer-card">
            <div className="offer-icon-circle green">
              <Truck size={28} />
            </div>
            <h3>Free Express Delivery</h3>
            <p>
              Enjoy automatic 100% Free Express Shipping on all orders above ₹499 across India. Delivered safely to your doorstep with tracking.
            </p>
            <div className="coupon-code-pill no-code">
              <span>Auto-applied on orders above ₹499</span>
            </div>
            <span className="offer-validity">No code needed • Pan-India</span>
          </div>

          {/* Routine Bundle Card */}
          <div className="offer-card bundle-offer">
            <div className="offer-badge-tag bundle">
              <Sparkles size={14} />
              <span>VALUE DUO SET</span>
            </div>
            <div className="offer-icon-circle amber">
              <ShoppingBag size={28} />
            </div>
            <h3>The Complete Skincare Set</h3>
            <p>
              Get both Dionara SPF 50+ Sunscreen and Ceramide Barrier Moisturizer together for a complete morning and evening ritual.
            </p>
            <div className="bundle-action-box">
              <button className="btn-claim-bundle" onClick={handleAddBundle}>
                <span>Add Set to Cart</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <span className="offer-validity">Includes Free Express Delivery</span>
          </div>
        </div>

        {/* How to Redeem Banner */}
        <div className="redeem-steps-card">
          <h3>How to Redeem Your Offers</h3>
          <div className="redeem-steps-row">
            <div className="redeem-step">
              <span className="step-num-circle">1</span>
              <div>
                <strong>Add Products</strong>
                <p>Add Sunscreen or Moisturizer to your cart</p>
              </div>
            </div>
            <div className="redeem-step">
              <span className="step-num-circle">2</span>
              <div>
                <strong>Apply Code</strong>
                <p>Click 'Copy & Apply' or enter promo code in Cart</p>
              </div>
            </div>
            <div className="redeem-step">
              <span className="step-num-circle">3</span>
              <div>
                <strong>Submit on WhatsApp</strong>
                <p>Discount is automatically saved and sent to WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Offers;
