import { useShop } from "../context/ShopContext";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

function ToastNotification() {
  const { toast } = useShop();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon success" />,
    error: <AlertCircle size={18} className="toast-icon error" />,
    info: <Info size={18} className="toast-icon info" />
  };

  return (
    <div className={`toast-container ${toast.type}`}>
      {icons[toast.type] || icons.info}
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}

export default ToastNotification;
