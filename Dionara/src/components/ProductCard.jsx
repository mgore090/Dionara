import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, MessageCircle, Star, Edit3 } from "lucide-react";
import { useShop } from "../context/ShopContext";
import AdminProductEditModal from "./AdminProductEditModal";

function ProductCard({ product }) {
  const { addToCart, isInWishlist, toggleWishlist, directProductWhatsAppOrder, isAdmin } = useShop();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const isFavorited = isInWishlist(product.id);

  return (
    <>
      <div className={`product-card ${isAdmin ? "has-admin-controls" : ""}`}>
        {/* Admin floating quick-edit trigger */}
        {isAdmin && (
          <div className="card-admin-overlay-bar">
            <button
              className="btn-card-admin-edit"
              onClick={() => setEditModalOpen(true)}
              title="Admin Quick Price & Stock Edit"
            >
              <Edit3 size={13} />
              <span>Admin: Edit Price (₹{product.price})</span>
            </button>
          </div>
        )}

        <div className="product-image-container">
          <div className="badge-stack">
            {product.badge && (
              <span className="product-badge badge-skincare">
                {product.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="product-badge badge-discount">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist toggle */}
          <button
            className={`card-wishlist-btn ${isFavorited ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isFavorited ? "#e11d48" : "none"} color={isFavorited ? "#e11d48" : "#333333"} />
          </button>

          {/* Product image link */}
          <Link to={`/product/${product.id}`} className="image-link-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
          </Link>

          {/* Quick action overlay */}
          <div className="card-quick-actions">
            <button
              className="card-add-cart-btn"
              onClick={() => addToCart(product, 1)}
            >
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </button>
            <button
              className="card-quick-wa-btn"
              onClick={() => directProductWhatsAppOrder(product, 1)}
              title="Order directly on WhatsApp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="product-info">
          <span className="product-category-tag">{product.categoryName}</span>

          <h3 className="product-title">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          <div className="product-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < Math.floor(product.rating || 5) ? "#f59e0b" : "none"}
                  color={i < Math.floor(product.rating || 5) ? "#f59e0b" : "#d1d5db"}
                />
              ))}
            </div>
            <span className="reviews-count">({product.reviews || 1})</span>
          </div>

          <div className="product-price-row">
            <div className="price-group">
              <span className="current-price">₹{product.price.toLocaleString("en-IN")}</span>
              {product.oldPrice && (
                <span className="old-price">₹{product.oldPrice.toLocaleString("en-IN")}</span>
              )}
            </div>
            {product.inStock ? (
              <span className="stock-tag in-stock">In Stock</span>
            ) : (
              <span className="stock-tag out-of-stock">Sold Out</span>
            )}
          </div>
        </div>
      </div>

      {/* Admin Quick Edit Modal */}
      <AdminProductEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        productToEdit={product}
        isNew={false}
      />
    </>
  );
}

export default ProductCard;