import { Link } from "react-router-dom";
import { MessageCircle, Mail, MapPin, Shield, RefreshCw, Truck } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Footer() {
  const { whatsappNumber, isAdmin } = useShop();

  return (
    <footer className="footer">
      {/* Brand value pillars */}
      <div className="footer-pillars">
        <div className="pillar">
          <Truck size={24} />
          <h4>Pan-India Shipping</h4>
          <p>Delivered carefully to your doorstep with tracking</p>
        </div>
        <div className="pillar">
          <Shield size={24} />
          <h4>Artisan Certified</h4>
          <p>Handcrafted using pure, premium-grade materials</p>
        </div>
        <div className="pillar">
          <MessageCircle size={24} />
          <h4>WhatsApp Ordering</h4>
          <p>Chat directly with our stylists & place instant orders</p>
        </div>
        <div className="pillar">
          <RefreshCw size={24} />
          <h4>Easy Exchanges</h4>
          <p>Hassle-free 7-day replacement support</p>
        </div>
      </div>

      <div className="footer-main">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <h2 className="footer-logo">DIONARA</h2>
          <p className="footer-tagline">
            Dionara Skincare: Formulated with science-backed broad-spectrum UV filters and 5 essential skin barrier ceramides. Clean, cruelty-free, and dermatologically approved.
          </p>
          <div className="footer-whatsapp-badge">
            <MessageCircle size={20} />
            <div>
              <span className="badge-label">Official WhatsApp Helpline:</span>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="badge-phone"
              >
                +{whatsappNumber}
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Product</Link></li>
            <li><Link to="/offers">Offers</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/faq">FAQ & Support</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="footer-col">
          <h3>Customer Care</h3>
          <ul>
            <li><Link to="/cart">My Shopping Cart</Link></li>
            <li><Link to="/checkout">Checkout & WhatsApp Order</Link></li>
            <li><Link to="/faq">Order Help & FAQ</Link></li>
            <li><a href={`https://wa.me/${whatsappNumber}?text=Hi%20Dionara%20Support`} target="_blank" rel="noreferrer">Instant WhatsApp Support</a></li>
            <li>
              {isAdmin ? (
                <Link to="/admin" style={{ color: "#0284c7", fontWeight: "700" }}>
                  🛡️ Store Admin Dashboard (Active)
                </Link>
              ) : (
                <Link to="/admin/login" style={{ color: "var(--color-text-light)", fontSize: "12px" }}>
                  🔒 Staff / Admin Login
                </Link>
              )}
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="footer-col contact-col">
          <h3>Direct Connect</h3>
          <p className="contact-line">
            <MapPin size={16} />
            <span>Dionara Lifestyle Studio, Mumbai & Jaipur, India</span>
          </p>
          <p className="contact-line">
            <Mail size={16} />
            <span>concierge@dionara.com</span>
          </p>
          <p className="contact-line">
            <MessageCircle size={16} />
            <span>WhatsApp: +{whatsappNumber}</span>
          </p>
          <div className="payment-badges-row">
            <span className="pay-pill">UPI</span>
            <span className="pay-pill">WhatsApp Pay</span>
            <span className="pay-pill">Cards</span>
            <span className="pay-pill">Cash On Delivery</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DIONARA. All Rights Reserved. Crafted with care for elegant lifestyles.</p>
        <p className="footer-made-with">
          Powered by React • Instant WhatsApp Commerce
        </p>
      </div>
    </footer>
  );
}

export default Footer;