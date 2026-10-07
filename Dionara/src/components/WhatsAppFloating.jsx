import { useState } from "react";
import { useShop } from "../context/ShopContext";
import { MessageCircle, X } from "lucide-react";

function WhatsAppFloating() {
  const { whatsappNumber } = useShop();
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpenChat = () => {
    const greeting = encodeURIComponent(
      "Hello Dionara Team! ✨ I'm visiting your online store and have a question about your collection."
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${greeting}`, "_blank");
  };

  return (
    <div className="floating-whatsapp-container">
      {showTooltip && (
        <div className="whatsapp-tooltip">
          <button
            className="tooltip-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            aria-label="Close message"
          >
            <X size={14} />
          </button>
          <p className="tooltip-title">Need help or want to order?</p>
          <p className="tooltip-desc">Chat directly with Dionara on WhatsApp!</p>
        </div>
      )}

      <button
        className="whatsapp-float-btn"
        onClick={handleOpenChat}
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="pulse-ring"></span>
      </button>
    </div>
  );
}

export default WhatsAppFloating;
