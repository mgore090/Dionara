import { useState } from "react";
import { X, Save } from "lucide-react";
import { useShop } from "../context/ShopContext";

const PRESET_IMAGES = [
  {
    label: "Sunscreen Glow Bottle",
    url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80"
  },
  {
    label: "Ceramide Moisturizer Jar",
    url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"
  },
  {
    label: "Hydrating Facial Serum Dropper",
    url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"
  },
  {
    label: "Gentle Radiance Cleanser",
    url: "https://images.unsplash.com/photo-1556228722-d0b71f3b7d15?w=800&auto=format&fit=crop&q=80"
  },
  {
    label: "Night Repair Barrier Balm",
    url: "https://images.unsplash.com/photo-1608248597359-2e70ef60c388?w=800&auto=format&fit=crop&q=80"
  }
];

function ProductEditForm({ productToEdit, isNew, onClose }) {
  const { updateProduct, addProduct, showToast } = useShop();

  const [formData, setFormData] = useState(() => {
    if (productToEdit && !isNew) {
      return {
        name: productToEdit.name || "",
        category: productToEdit.category || "skincare",
        categoryName: productToEdit.categoryName || "Skincare",
        subtitle: productToEdit.subtitle || "",
        volume: productToEdit.volume || "50 ml",
        price: productToEdit.price || 499,
        oldPrice: productToEdit.oldPrice || 699,
        badge: productToEdit.badge || "",
        image: productToEdit.image || PRESET_IMAGES[0].url,
        description: productToEdit.description || "",
        keyBenefits: Array.isArray(productToEdit.keyBenefits)
          ? productToEdit.keyBenefits.join(", ")
          : productToEdit.keyBenefits || "",
        inStock: productToEdit.inStock ?? true,
        stockCount: productToEdit.stockCount || 50
      };
    }
    return {
      name: "",
      category: "serum",
      categoryName: "Facial Serum",
      subtitle: "Dionara Dermatologist Formulation",
      volume: "30 ml",
      price: 699,
      oldPrice: 999,
      badge: "NEW LAUNCH",
      image: PRESET_IMAGES[2].url,
      description: "Formulated to deeply hydrate, brighten dullness, and protect skin barrier radiance.",
      keyBenefits: "Deep Hydration, Barrier Glow, Dermatologically Tested",
      inStock: true,
      stockCount: 50
    };
  });

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    let catName = "Skincare";
    if (cat === "sunscreen") catName = "Sun Care";
    if (cat === "moisturizer") catName = "Moisturizer & Creams";
    if (cat === "serum") catName = "Facial Serum";
    if (cat === "cleanser") catName = "Cleanser & Wash";
    if (cat === "combos") catName = "Duo & Combos";

    setFormData((prev) => ({
      ...prev,
      category: cat,
      categoryName: catName
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Please enter a product title", "error");
      return;
    }

    const priceNum = Number(formData.price);
    const oldPriceNum = Number(formData.oldPrice);

    if (isNaN(priceNum) || priceNum <= 0) {
      showToast("Please enter a valid selling price", "error");
      return;
    }

    const benefitsArray = formData.keyBenefits
      ? formData.keyBenefits.split(",").map((b) => b.trim()).filter(Boolean)
      : ["Dermatologically Tested"];

    if (isNew) {
      addProduct({
        ...formData,
        price: priceNum,
        oldPrice: oldPriceNum || priceNum,
        stockCount: Number(formData.stockCount) || 50,
        keyBenefits: benefitsArray
      });
    } else if (productToEdit) {
      updateProduct(productToEdit.id, {
        ...formData,
        price: priceNum,
        oldPrice: oldPriceNum || priceNum,
        stockCount: Number(formData.stockCount) || 50,
        keyBenefits: benefitsArray
      });
    }

    onClose();
  };

  return (
    <>
      <div className="admin-modal-header">
        <div className="modal-header-left">
          <span className="admin-badge-pill">ADMIN MANAGER</span>
          <h3>{isNew ? "Add New Dionara Product" : `Edit Product: ${productToEdit?.name}`}</h3>
        </div>
        <button className="btn-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-product-form">
        <div className="form-grid-two">
          {/* Product Name */}
          <div className="form-field-group col-span-2">
            <label>Product Name / Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dionara Invisible Water-Glow Sunscreen SPF 50+"
            />
          </div>

          {/* Category */}
          <div className="form-field-group">
            <label>Category</label>
            <select value={formData.category} onChange={handleCategoryChange}>
              <option value="sunscreen">Sun Care (Sunscreen)</option>
              <option value="moisturizer">Moisturizer & Creams</option>
              <option value="serum">Facial Serum</option>
              <option value="cleanser">Cleansers</option>
              <option value="combos">Duo Sets & Combos</option>
              <option value="skincare">General Skincare</option>
            </select>
          </div>

          {/* Volume / Size */}
          <div className="form-field-group">
            <label>Volume / Size</label>
            <input
              type="text"
              value={formData.volume}
              onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
              placeholder="e.g. 50 ml / 1.7 fl oz"
            />
          </div>

          {/* Selling Price */}
          <div className="form-field-group highlight-field">
            <label>
              Selling Price (₹) * <span className="label-tip">(What customer pays)</span>
            </label>
            <div className="price-input-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="599"
              />
            </div>
          </div>

          {/* MRP / Original Price */}
          <div className="form-field-group">
            <label>
              Original MRP (₹) <span className="label-tip">(Strikethrough price)</span>
            </label>
            <div className="price-input-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                type="number"
                min="1"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                placeholder="849"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="form-field-group">
            <label>Promo Badge (Optional)</label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. BESTSELLER, NEW, 20% OFF"
            />
          </div>

          {/* Stock Count */}
          <div className="form-field-group">
            <label>Inventory Units in Stock</label>
            <input
              type="number"
              min="0"
              value={formData.stockCount}
              onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
              placeholder="100"
            />
          </div>

          {/* In Stock toggle */}
          <div className="form-field-group col-span-2 checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              />
              <span>Item Available For Purchase (In Stock)</span>
            </label>
          </div>

          {/* Image URL with Presets */}
          <div className="form-field-group col-span-2">
            <label>Product Image URL *</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
            <div className="preset-images-picker">
              <span className="picker-label">Quick Skincare Image Presets:</span>
              <div className="preset-buttons">
                {PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`preset-img-btn ${formData.image === img.url ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, image: img.url })}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-field-group col-span-2">
            <label>Product Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Highlight texture, key ingredients, and who it's for..."
            />
          </div>

          {/* Key Benefits (comma-separated) */}
          <div className="form-field-group col-span-2">
            <label>Key Benefits (comma-separated)</label>
            <input
              type="text"
              value={formData.keyBenefits}
              onChange={(e) => setFormData({ ...formData, keyBenefits: e.target.value })}
              placeholder="Broad Spectrum UV Defense, 5 Ceramides Barrier, Water-Light"
            />
          </div>
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-save-product">
            <Save size={16} />
            <span>{isNew ? "Add Product to Store" : "Save Product Changes"}</span>
          </button>
        </div>
      </form>
    </>
  );
}

function AdminProductEditModal({ isOpen, onClose, productToEdit, isNew = false }) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-window" onClick={(e) => e.stopPropagation()}>
        <ProductEditForm
          key={isNew ? "new-product" : `edit-${productToEdit?.id || "custom"}`}
          productToEdit={productToEdit}
          isNew={isNew}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default AdminProductEditModal;
