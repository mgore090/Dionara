import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingBag,
  MessageCircle,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  ChevronRight,
  Share2,
  Check,
  Sparkles,
  Edit3
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import AdminProductEditModal from "../components/AdminProductEditModal";
import { useShop } from "../context/ShopContext";

function ProductDetail() {
  const { id } = useParams();
  const {
    products,
    addToCart,
    isInWishlist,
    toggleWishlist,
    directProductWhatsAppOrder,
    showToast,
    isAdmin
  } = useShop();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const product = products.find((p) => p.id === parseInt(id));

  // Active gallery image
  const [activeImage, setActiveImage] = useState(product ? product.image : "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("benefits");

  if (!product) {
    return (
      <div className="section-container not-found-page">
        <h2>Product Not Found</h2>
        <p>The skincare item you are looking for does not exist in our catalog.</p>
        <Link to="/products" className="btn-primary-action">
          Browse All Skincare
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const savings = product.oldPrice ? product.oldPrice - product.price : 0;

  // Gallery items (fallback to product image if no gallery)
  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  // Companion product
  const companionProduct = products.find((p) => p.id !== product.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Dionara Skincare!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!", "info");
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleDirectWhatsApp = () => {
    directProductWhatsAppOrder(product, quantity);
  };

  return (
    <>
      <div className="product-detail-page">
        <div className="section-container">
          {/* Admin Banner if Admin logged in */}
          {isAdmin && (
            <div className="detail-admin-alert-bar">
              <div className="admin-alert-text">
                <span className="live-pulse-dot"></span>
                <strong>ADMIN ACTIVE:</strong> You are viewing live customer pricing for this product.
              </div>
              <button
                className="btn-admin-edit-detail"
                onClick={() => setEditModalOpen(true)}
              >
                <Edit3 size={14} />
                <span>Edit Price & Product Details</span>
              </button>
            </div>
          )}

          {/* Breadcrumb Navigation */}
          <nav className="breadcrumbs">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products">Skincare Collection</Link>
            <ChevronRight size={14} />
            <span className="current-crumb">{product.name}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="product-layout-grid">
            {/* Gallery Column */}
            <div className="gallery-column">
              <div className="main-image-viewport">
                {product.badge && (
                  <span className="detail-badge">{product.badge}</span>
                )}
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  className="main-detail-img"
                />
              </div>

              {/* Thumbnail previews */}
              <div className="gallery-thumbnails">
                {galleryImages.map((imgUrl, index) => (
                  <button
                    key={index}
                    className={`thumb-btn ${activeImage === imgUrl ? "selected" : ""}`}
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`${product.name} thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Info Column */}
            <div className="detail-info-column">
              <div className="detail-category-row">
                <span className="detail-category-label">
                  {product.category === "sunscreen"
                    ? "☀️ SUNCARE DEFENSE"
                    : product.category === "moisturizer"
                    ? "💧 BARRIER REPAIR"
                    : `✨ ${product.categoryName?.toUpperCase() || "SKINCARE"}`}
                </span>
                {product.volume && (
                  <span className="detail-volume-badge">{product.volume}</span>
                )}
              </div>

              <h1 className="detail-title">{product.name}</h1>
              <p className="detail-subtitle">{product.subtitle}</p>

              {/* Ratings row */}
              <div className="detail-ratings-row">
                <div className="stars-cluster">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(product.rating || 5) ? "#f59e0b" : "none"}
                      color={i < Math.floor(product.rating || 5) ? "#f59e0b" : "#d1d5db"}
                    />
                  ))}
                </div>
                <span className="detail-rating-num">{product.rating || 5.0}</span>
                <span className="detail-reviews-num">({product.reviews || 1} verified customer reviews)</span>
                <span className={`stock-pill ${product.inStock ? "in-stock" : "out-of-stock"}`}>
                  <Check size={14} /> {product.inStock ? `In Stock (${product.stockCount || 50} units ready)` : "Currently Sold Out"}
                </span>
              </div>

              {/* Price Box */}
              <div className="detail-price-box">
                <div className="price-main">
                  <span className="price-tag">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.oldPrice && (
                    <span className="price-tag-old">₹{product.oldPrice.toLocaleString("en-IN")}</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="discount-pill">{discountPercent}% OFF</span>
                  )}
                </div>
                {savings > 0 && (
                  <p className="savings-note">
                    ✨ Save ₹{savings.toLocaleString("en-IN")} today • Free Express Shipping
                  </p>
                )}
                <p className="inclusive-tax-note">Inclusive of all taxes • Ships in 24 hours</p>
              </div>

              {/* Description */}
              <p className="detail-description">{product.description}</p>

              {/* Quantity Selector & Buttons */}
              <div className="purchase-controls">
                <div className="quantity-block">
                  <label>Select Quantity</label>
                  <div className="qty-counter">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockCount || 99, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons-stack">
                  <button
                    className="btn-add-to-cart"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingBag size={20} />
                    <span>{product.inStock ? "ADD TO CART" : "OUT OF STOCK"}</span>
                  </button>

                  <button
                    className="btn-order-whatsapp-large"
                    onClick={handleDirectWhatsApp}
                    title="Directly purchase this item via WhatsApp message"
                  >
                    <MessageCircle size={22} />
                    <span>ORDER DIRECTLY ON WHATSAPP</span>
                  </button>
                </div>

                {/* Auxiliary actions: Wishlist & Share */}
                <div className="aux-actions-row">
                  <button
                    className={`btn-aux ${isFavorited ? "active" : ""}`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart size={18} fill={isFavorited ? "#e11d48" : "none"} color={isFavorited ? "#e11d48" : "currentColor"} />
                    <span>{isFavorited ? "Saved to Wishlist" : "Save to Wishlist"}</span>
                  </button>

                  <button className="btn-aux" onClick={handleShare}>
                    <Share2 size={18} />
                    <span>Share Product</span>
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="detail-trust-cards">
                <div className="trust-card-item">
                  <Truck size={20} />
                  <div>
                    <strong>Pan-India Shipping</strong>
                    <p>Free on orders above ₹499</p>
                  </div>
                </div>
                <div className="trust-card-item">
                  <ShieldCheck size={20} />
                  <div>
                    <strong>100% Genuine Formula</strong>
                    <p>Dermatologically tested & approved</p>
                  </div>
                </div>
              </div>

              {/* Accordion / Tabs */}
              <div className="detail-tabs-section">
                <div className="tab-buttons-row">
                  <button
                    className={`tab-btn ${activeTab === "benefits" ? "active" : ""}`}
                    onClick={() => setActiveTab("benefits")}
                  >
                    Key Benefits
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "howToUse" ? "active" : ""}`}
                    onClick={() => setActiveTab("howToUse")}
                  >
                    How to Apply
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "ingredients" ? "active" : ""}`}
                    onClick={() => setActiveTab("ingredients")}
                  >
                    Details & Safety
                  </button>
                </div>

                <div className="tab-body-card">
                  {activeTab === "benefits" && (
                    <ul className="benefits-checklist">
                      {(product.keyBenefits || []).map((benefit, idx) => (
                        <li key={idx}>
                          <Sparkles size={16} className="benefit-icon" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === "howToUse" && (
                    <p className="tab-text-content">
                      {product.howToUse || "Take an adequate amount and gently massage onto cleansed skin in upward circular motions until fully absorbed. Apply every morning as part of your daily skincare routine."}
                    </p>
                  )}

                  {activeTab === "ingredients" && (
                    <ul className="details-bullet-list">
                      {(product.details || ["Formulated for daily healthy skin barrier radiance", "Dermatologically tested", "Cruelty-free"]).map((detail, idx) => (
                        <li key={idx}>• {detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Complete the Routine: Companion Product */}
          {companionProduct && (
            <div className="related-products-section">
              <div className="section-header-center">
                <span className="section-subtitle">THE PERFECT COMPANION</span>
                <h2 className="section-title">Complete Your Daily Routine</h2>
                <p className="section-lead-text">
                  Pair your essentials for deep barrier hydration and ultra-shield UV protection.
                </p>
                <div className="title-divider"></div>
              </div>

              <div className="single-companion-container">
                <ProductCard product={companionProduct} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Edit Modal */}
      <AdminProductEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        productToEdit={product}
        isNew={false}
      />
    </>
  );
}

export default ProductDetail;
