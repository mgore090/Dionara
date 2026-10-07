import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  FileSpreadsheet,
  PlusCircle,
  LogOut,
  Sliders,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import AdminProductEditModal from "./AdminProductEditModal";

function AdminBar() {
  const { isAdmin, logoutAdmin, orders, products, googleSheetUrl } = useShop();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const pendingCount = orders.filter((o) => o.status === "Pending" || !o.status).length;

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <>
      <div className="admin-status-bar">
        <div className="admin-bar-inner">
          {/* Status Label */}
          <div className="admin-badge-indicator">
            <span className="live-pulse-dot"></span>
            <ShieldAlert size={15} />
            <span className="admin-title">ADMIN MODE</span>
            <span className="admin-sub">Store Manager</span>
          </div>

          {/* Quick Admin Navigation */}
          <div className="admin-quick-links">
            <Link to="/admin?tab=orders" className="admin-nav-item">
              <FileSpreadsheet size={14} />
              <span>Orders ({orders.length})</span>
              {pendingCount > 0 && <span className="admin-pending-chip">{pendingCount} new</span>}
            </Link>

            <a
              href={googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-nav-item google-sheet-nav-pill"
              title="Open connected Google Sheet for order status"
            >
              <ExternalLink size={13} />
              <span>Google Sheet</span>
            </a>

            <Link to="/admin?tab=products" className="admin-nav-item">
              <ShoppingBag size={14} />
              <span>Products ({products.length})</span>
            </Link>

            <Link to="/admin?tab=offers" className="admin-nav-item">
              <Sparkles size={14} />
              <span>Offers & Coupons</span>
            </Link>

            <Link to="/admin?tab=settings" className="admin-nav-item">
              <Sliders size={14} />
              <span>Courier & WhatsApp</span>
            </Link>
          </div>

          {/* Admin Actions */}
          <div className="admin-bar-actions">
            <button
              className="btn-admin-add-product"
              onClick={() => setIsAddModalOpen(true)}
              title="Add a new product to Dionara catalog"
            >
              <PlusCircle size={14} />
              <span>Add Product</span>
            </button>

            <button
              className="btn-admin-logout"
              onClick={handleLogout}
              title="Exit Admin Mode and return to Customer View"
            >
              <LogOut size={14} />
              <span>Exit to Customer View</span>
            </button>
          </div>
        </div>
      </div>

      <AdminProductEditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        isNew={true}
      />
    </>
  );
}

export default AdminBar;
