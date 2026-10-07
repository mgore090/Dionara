import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Sun, Droplets } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Hero() {
  const { whatsappNumber } = useShop();

  return (
    <section className="hero-section skincare-hero">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>DAILY SUNCARE & MOISTURE RITUAL</span>
          </div>

          <h1 className="hero-title">
            Protect With SPF.
            <br />
            <span className="hero-title-accent">Nourish</span> With Moisture.
          </h1>

          <p className="hero-description">
            Experience Dionara's two daily skin essentials. Powered by broad-spectrum 
            SPF 50+ PA++++ with zero white cast, and barrier-repairing Ceramides for 
            72-hour dewy, glass-skin hydration.
          </p>

          <div className="hero-cta-group">
            <Link to="/products" className="btn-hero-primary">
              <span>EXPLORE THE 2 ESSENTIALS</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Dionara Skincare! I would like to order your Sunscreen and Moisturizer.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-whatsapp"
            >
              <MessageCircle size={18} />
              <span>ORDER ON WHATSAPP</span>
            </a>
          </div>

          <div className="hero-features-bar">
            <div className="feature-item">
              <Sun size={20} color="#f59e0b" />
              <div>
                <strong>SPF 50+ PA++++ Sunscreen</strong>
                <span>Zero white cast, ultra-light fluid</span>
              </div>
            </div>
            <div className="feature-item">
              <Droplets size={20} color="#38bdf8" />
              <div>
                <strong>Ceramide Moisturizer</strong>
                <span>72H deep barrier repair & glow</span>
              </div>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} color="#4ade80" />
              <div>
                <strong>Derm Approved & Safe</strong>
                <span>Cruelty-free, fragrance-free, sensitive skin safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;