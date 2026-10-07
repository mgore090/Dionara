import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, KeyRound, ShieldCheck, ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import { useShop } from "../context/ShopContext";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { loginAdmin, isAdmin } = useShop();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }

    const success = loginAdmin(password.trim());
    if (success) {
      navigate("/admin");
    } else {
      setError("Incorrect password. Hint: default password is 'admin123'");
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin("admin123");
    navigate("/admin");
  };

  return (
    <div className="admin-login-page">
      <div className="login-card-container">
        <div className="login-card">
          <div className="login-header">
            <div className="admin-lock-circle">
              <ShieldCheck size={32} />
            </div>
            <span className="login-badge">PORTAL AUTHENTICATION</span>
            <h1 className="login-title">Dionara Store Admin</h1>
            <p className="login-subtext">
              Log in to manage orders, export Excel sheets, adjust product prices, launch new products, and configure courier delivery.
            </p>
          </div>

          {isAdmin ? (
            <div className="already-logged-in-banner">
              <p>You are already logged in as Store Admin!</p>
              <div className="already-actions">
                <button
                  className="btn-primary-action"
                  onClick={() => navigate("/admin")}
                >
                  Go to Admin Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="login-form">
              {error && <div className="login-error-alert">{error}</div>}

              <div className="form-field-group">
                <label>Admin Security Password</label>
                <div className="password-input-wrap">
                  <KeyRound size={18} className="field-icon-prefix" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password (e.g. admin123)"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-admin-submit">
                <Lock size={16} />
                <span>Unlock Store Admin View</span>
              </button>

              <div className="quick-demo-divider">
                <span>OR</span>
              </div>

              <button
                type="button"
                className="btn-quick-demo"
                onClick={handleQuickDemoLogin}
              >
                <Sparkles size={16} />
                <span>Quick Login with Default Password (admin123)</span>
              </button>
            </form>
          )}

          <div className="login-footer">
            <Link to="/" className="back-to-store-link">
              <ArrowLeft size={16} />
              <span>Return to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
