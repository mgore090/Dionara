import { useState } from "react";
import { useShop } from "../context/ShopContext";
import { MessageCircle, X, Check, HelpCircle } from "lucide-react";

function WhatsAppSettingsModal({ isOpen, onClose }) {
  const { whatsappNumber, updateWhatsappNumber } = useShop();
  const [inputNumber, setInputNumber] = useState(whatsappNumber);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const clean = inputNumber.replace(/\D/g, "");
    if (clean.length < 10) {
      setError("Please enter a valid WhatsApp number with country code (e.g. 919876543210)");
      return;
    }
    setError("");
    updateWhatsappNumber(clean);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="whatsapp-icon-badge">
              <MessageCircle size={22} color="#ffffff" />
            </div>
            <div>
              <h3>Configure Store WhatsApp</h3>
              <p className="modal-subtitle">Incoming customer orders will be sent to this number</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-form">
          <label className="input-label">
            WhatsApp Business Number (with country code, no + or dashes)
          </label>
          <div className="input-with-icon">
            <span className="country-prefix">+</span>
            <input
              type="text"
              value={inputNumber}
              onChange={(e) => {
                setInputNumber(e.target.value);
                setError("");
              }}
              placeholder="e.g. 919876543210 (India: 91 + 10 digits)"
              className="styled-modal-input"
              autoFocus
            />
          </div>
          {error && <p className="input-error-msg">{error}</p>}

          <div className="modal-tips">
            <HelpCircle size={16} />
            <span>
              Format: Country code followed by mobile number. For India: <strong>91XXXXXXXXXX</strong>.
              Orders submitted in Dionara will directly open this WhatsApp chat with itemized order details!
            </span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-whatsapp">
              <Check size={18} />
              Save Number
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WhatsAppSettingsModal;
