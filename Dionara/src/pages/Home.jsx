import { Link } from "react-router-dom";
import { MessageCircle, Star, Sun, Droplets, Sparkles, CheckCircle2, ShoppingBag } from "lucide-react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

function Home() {
  const { whatsappNumber, addToCart, products } = useShop();

  const sunscreenProduct = products.find((p) => p.category === "sunscreen");
  const moisturizerProduct = products.find((p) => p.category === "moisturizer");

  const handleAddBothToCart = () => {
    products.forEach((p) => addToCart(p, 1));
  };

  return (
    <div className="home-page skincare-home">
      <Hero />

      {/* The 2 Core Products Section */}
      <section className="featured-section" id="products">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-subtitle">THE 2 ESSENTIALS</span>
            <h2 className="section-title">Dionara Daily Skincare Collection</h2>
            <p className="section-lead-text">
              Formulated without compromise. Everything your skin needs every single morning: deep barrier moisture and ultra-shield UV defense.
            </p>
            <div className="title-divider"></div>
          </div>

          <div className="products-grid skincare-duo-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Special Both-In-One Bundle Banner */}
          <div className="bundle-promo-card">
            <div className="bundle-content">
              <div className="bundle-tag">
                <Sparkles size={16} />
                <span>COMPLETE MORNING GLOW SET</span>
              </div>
              <h3>Order Both Essentials: Sunscreen + Moisturizer</h3>
              <p>
                Pair Dionara Ceramide Moisturizer for 72-hour deep barrier hydration with our Invisible SPF 50+ Sunscreen for full UV defense.
              </p>
              <div className="bundle-pricing">
                <span className="bundle-current">₹{(sunscreenProduct?.price || 599) + (moisturizerProduct?.price || 649)}</span>
                <span className="bundle-old">₹{(sunscreenProduct?.oldPrice || 849) + (moisturizerProduct?.oldPrice || 899)}</span>
                <span className="bundle-free-ship">FREE EXPRESS SHIPPING INCLUDED</span>
              </div>
            </div>
            <div className="bundle-actions">
              <button className="btn-bundle-cart" onClick={handleAddBothToCart}>
                <ShoppingBag size={18} />
                <span>ADD BOTH TO CART</span>
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Dionara Skincare! I would like to order the Daily Duo: Sunscreen + Moisturizer set.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bundle-whatsapp"
              >
                <MessageCircle size={18} />
                <span>ORDER DUO ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Step Routine Walkthrough */}
      <section className="routine-section" id="routine">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-subtitle">EASY 2-STEP MORNING RITUAL</span>
            <h2 className="section-title">How To Use The Dionara Routine</h2>
            <div className="title-divider"></div>
          </div>

          <div className="routine-steps-grid">
            <div className="routine-step-card">
              <div className="step-icon-circle blue">
                <Droplets size={28} />
              </div>
              <span className="step-order">STEP 1 • MORNING & NIGHT</span>
              <h3>Deep Ceramide Barrier Glow Moisturizer</h3>
              <p>
                After cleansing, gently smooth a dime-sized amount across face and neck. 5 Essential Ceramides and Peptides immediately restore hydration and seal your skin barrier.
              </p>
              <ul className="step-perks">
                <li><CheckCircle2 size={16} /> 72-Hour continuous moisture retention</li>
                <li><CheckCircle2 size={16} /> Repairs irritated, sensitive or compromised barriers</li>
                <li><CheckCircle2 size={16} /> Velvety, non-sticky soufflé texture</li>
              </ul>
              <Link to="/product/2" className="step-link">
                View Moisturizer Details →
              </Link>
            </div>

            <div className="routine-step-card">
              <div className="step-icon-circle amber">
                <Sun size={28} />
              </div>
              <span className="step-order">STEP 2 • EVERY MORNING</span>
              <h3>Invisible Water-Glow Sunscreen SPF 50+</h3>
              <p>
                Follow immediately with our ultra-light fluid sunscreen. Apply two finger-lengths across your face and ears 15 minutes before stepping out into the sun.
              </p>
              <ul className="step-perks">
                <li><CheckCircle2 size={16} /> Maximum SPF 50+ PA++++ broad spectrum defense</li>
                <li><CheckCircle2 size={16} /> Absorbs in seconds with ZERO white cast or residue</li>
                <li><CheckCircle2 size={16} /> 2% Niacinamide prevents dark spots & dullness</li>
              </ul>
              <Link to="/product/1" className="step-link">
                View Sunscreen Details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Ordering Flow */}
      <section className="whatsapp-how-it-works" id="how-to-order">
        <div className="section-container">
          <div className="whatsapp-banner-card">
            <div className="banner-content">
              <span className="banner-badge">
                <MessageCircle size={16} />
                DIRECT & EFFORTLESS
              </span>
              <h2>How Your WhatsApp Order Works</h2>
              <p>
                No complicated account logins. Add your skincare to the cart, fill your delivery address, and tap submit to send your order straight to our WhatsApp team!
              </p>

              <div className="steps-flow">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h4>Add to Cart</h4>
                  <p>Choose your Sunscreen, Moisturizer, or both and add to your bag.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h4>Fill Address</h4>
                  <p>Enter your name, WhatsApp number, and delivery address in the checkout form.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h4>Submit to WhatsApp</h4>
                  <p>Click submit — all your items and address details open directly in WhatsApp chat.</p>
                </div>
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h4>Confirmation & Dispatch</h4>
                  <p>We confirm your order and send tracking updates directly to your WhatsApp!</p>
                </div>
              </div>

              <div className="banner-action-row">
                <Link to="/products" className="btn-banner-shop">
                  Shop Skincare Essentials
                </Link>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello! I have a question about Dionara Sunscreen and Moisturizer.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-banner-chat"
                >
                  <MessageCircle size={18} />
                  <span>Chat With Us on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dermatologist & Customer Reviews */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header-center">
            <span className="section-subtitle">REAL RESULTS & LOVED BY HUNDREDS</span>
            <h2 className="section-title">What Our Skincare Users Say</h2>
            <div className="title-divider"></div>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="testimonial-quote">
                "Finding a sunscreen with NO white cast on Indian wheatish skin is so rare. The Dionara SPF 50+ feels literally like water on my skin and gives a healthy subtle glow without looking oily!"
              </p>
              <div className="testimonial-author">
                <strong>Tanvi Deshmukh</strong>
                <span>Pune • Uses SPF 50+ Sunscreen</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="testimonial-quote">
                "The Ceramide Moisturizer completely saved my compromised skin barrier from retinol dryness. After 4 days, all redness was gone and my skin felt plump and hydrated all day long."
              </p>
              <div className="testimonial-author">
                <strong>Aayush Mehra</strong>
                <span>Delhi • Uses Barrier Moisturizer</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="testimonial-quote">
                "I ordered both the Sunscreen and Moisturizer via WhatsApp. The checkout was seamless — I submitted the form and within 2 minutes got order confirmation and UPI details on WhatsApp!"
              </p>
              <div className="testimonial-author">
                <strong>Shreya Patel</strong>
                <span>Ahmedabad • Uses Complete 2-Step Duo</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
