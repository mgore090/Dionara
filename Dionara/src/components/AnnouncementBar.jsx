import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, Truck, FileSpreadsheet, ShieldAlert } from "lucide-react";
import WhatsAppSettingsModal from "./WhatsAppSettingsModal";
import { useShop } from "../context/ShopContext";

function AnnouncementBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const { whatsappNumber, isAdmin } = useShop();

  return (
    <>
      <div className={`announcement-bar ${isAdmin ? "is-admin-view" : ""}`}>
        <div className="announcement-content">
          {isAdmin ? (
            <>
              <div className="announcement-item admin-highlight-item">
                <ShieldAlert size={14} className="announcement-icon" />
                <span>ADMIN LOGGED IN: Dionara Store Manager</span>
              </div>
              <span className="announcement-separator">•</span>
              <Link
                to="/admin"
                className="admin-excel-nav-pill"
                title="Manage incoming orders, export Excel sheet, and ship with delivery partner"
              >
                <FileSpreadsheet size={13} />
                <span>Orders & Excel Dashboard</span>
              </Link>
              <span className="announcement-separator">•</span>
              <button
                className="whatsapp-config-trigger"
                onClick={() => setModalOpen(true)}
                title="Click to change WhatsApp store number"
              >
                <MessageCircle size={13} />
                <span>Store WhatsApp: +{whatsappNumber}</span>
              </button>
            </>
          ) : (
            <>
              <div className="announcement-item">
                <Sparkles size={14} className="announcement-icon" />
                <span>USE CODE <strong>DIONARA10</strong> FOR 10% OFF</span>
              </div>
              <span className="announcement-separator">•</span>
              <div className="announcement-item">
                <Truck size={14} className="announcement-icon" />
                <span>FREE PAN-INDIA EXPRESS SHIPPING OVER ₹499</span>
              </div>
              <span className="announcement-separator">•</span>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20Dionara%20Skincare!`}
                target="_blank"
                rel="noreferrer"
                className="announcement-whatsapp-link"
                title="Chat with Dionara Skincare on WhatsApp"
              >
                <MessageCircle size={13} />
                <span>WhatsApp Helpline: +{whatsappNumber}</span>
              </a>
            </>
          )}
        </div>
      </div>

      <WhatsAppSettingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default AnnouncementBar;