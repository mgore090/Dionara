import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, RotateCcw, SlidersHorizontal, PlusCircle } from "lucide-react";
import ProductCard from "../components/ProductCard";
import AdminProductEditModal from "../components/AdminProductEditModal";
import { categories } from "../data/products";
import { useShop } from "../context/ShopContext";

function Products() {
  const { products, isAdmin } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [addModalOpen, setAddModalOpen] = useState(false);

  // URL query params
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("featured");

  // Sync category changes to URL
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catId);
    }
    setSearchParams(searchParams);
  };

  // Filter and sort products dynamically
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "all" && item.category !== selectedCategory) {
          return false;
        }
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchName = item.name.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          const matchCat = item.categoryName?.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0; // default featured
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setSortBy("featured");
    setSearchParams({});
  };

  return (
    <>
      <div className="products-page">
        {/* Header Banner */}
        <div className="page-header-banner">
          <div className="section-container">
            <span className="page-subtitle">DIONARA DERMA ESSENTIALS</span>
            <h1 className="page-title">Sunscreen & Moisturizer Collection</h1>
            <p className="page-lead">
              Everyday glow made simple. Backed by science with SPF 50+ broad-spectrum UV protection and 5 essential barrier ceramides.
            </p>
          </div>
        </div>

        <div className="section-container">
          {/* Admin Header Action */}
          {isAdmin && (
            <div className="admin-catalog-banner">
              <div>
                <strong>ADMIN ACTIVE:</strong> You can edit product prices, stock, or add new items.
              </div>
              <button
                className="btn-admin-add-catalog"
                onClick={() => setAddModalOpen(true)}
              >
                <PlusCircle size={15} />
                <span>Add New Product to Store</span>
              </button>
            </div>
          )}

          {/* Controls Bar */}
          <div className="catalog-controls-bar">
            {/* Category Tabs */}
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-pill-btn ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search & Sort Row */}
            <div className="filter-controls-row">
              <div className="search-input-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search sunscreen, moisturizer, ceramides, spf..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchTerm("")}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="sort-box">
                <SlidersHorizontal size={15} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status header */}
          <div className="catalog-status-header">
            <p className="catalog-count">
              Showing <strong>{filteredProducts.length}</strong> of {products.length} products
              {selectedCategory !== "all" && (
                <span className="active-filter-badge">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
              {searchTerm && (
                <span className="active-filter-badge">
                  "{searchTerm}"
                </span>
              )}
            </p>

            {(selectedCategory !== "all" || searchTerm || sortBy !== "featured") && (
              <button className="reset-filter-btn" onClick={resetFilters}>
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid skincare-duo-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products-state">
              <div className="no-products-icon">🧴</div>
              <h3>No skincare products found</h3>
              <p>Try searching for "sunscreen" or "moisturizer".</p>
              <button className="btn-primary-action" onClick={resetFilters}>
                Clear Filters & View All
              </button>
            </div>
          )}
        </div>
      </div>

      <AdminProductEditModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        isNew={true}
      />
    </>
  );
}

export default Products;
