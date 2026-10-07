import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Search, MessageCircle, Menu, X } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Navbar() {
  const { cartCount, wishlist, whatsappNumber } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* Mobile menu button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <span className="logo-main">DIONARA</span>
          <span className="logo-sub">SKINCARE • SUN & HYDRATION</span>
        </Link>

        {/* Desktop Nav Links requested: Home, All Product, Offers, Reviews, FAQ & Support, Contact Us */}
        <div className="nav-links">
          <Link
            to="/"
            className={location.pathname === "/" ? "nav-link active" : "nav-link"}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={location.pathname === "/products" ? "nav-link active" : "nav-link"}
          >
            All Product
          </Link>
          <Link
            to="/offers"
            className={location.pathname === "/offers" ? "nav-link active" : "nav-link"}
          >
            Offers
          </Link>
          <Link
            to="/reviews"
            className={location.pathname === "/reviews" ? "nav-link active" : "nav-link"}
          >
            Reviews
          </Link>
          <Link
            to="/faq"
            className={location.pathname === "/faq" ? "nav-link active" : "nav-link"}
          >
            FAQ & Support
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "nav-link active" : "nav-link"}
          >
            Contact Us
          </Link>
        </div>

        {/* Nav Actions */}
        <div className="nav-actions">
          {/* Search Toggle */}
          <button
            className="action-icon-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search products"
            title="Search products"
          >
            <Search size={20} />
          </button>

          {/* Wishlist Link */}
          <Link
            to="/products"
            className="action-icon-btn wishlist-btn"
            title={`Wishlist (${wishlist.length} saved)`}
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="counter-badge heart-badge">{wishlist.length}</span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="action-icon-btn cart-btn"
            title="View Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={21} />
            <span className="counter-badge">{cartCount}</span>
          </Link>

          {/* Direct WhatsApp chat pill */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Dionara Skincare! I would like to order or ask a question.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-nav-pill"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle size={16} />
            <span className="pill-text">WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="search-dropdown-bar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              placeholder="Search sunscreen, moisturizer, spf 50, ceramides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-submit-btn">
              Search
            </button>
            <button
              type="button"
              className="search-close-btn"
              onClick={() => setSearchOpen(false)}
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="drawer-title">DIONARA</span>
              <button onClick={closeMenu} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <div className="mobile-nav-links">
              <Link to="/" onClick={closeMenu}>Home</Link>
              <Link to="/products" onClick={closeMenu}>All Product</Link>
              <Link to="/offers" onClick={closeMenu}>Offers</Link>
              <Link to="/reviews" onClick={closeMenu}>Reviews</Link>
              <Link to="/faq" onClick={closeMenu}>FAQ & Support</Link>
              <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
              <Link to="/cart" onClick={closeMenu}>Shopping Cart ({cartCount})</Link>
              <div className="mobile-drawer-cta">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Dionara Skincare! I would like to place an order.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-whatsapp-btn"
                >
                  <MessageCircle size={18} />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;