import { useState } from "react";
import { Star, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Reviews() {
  const { whatsappNumber } = useShop();
  const [filter, setFilter] = useState("all");

  const reviewsList = [
    {
      id: 1,
      name: "Tanvi Deshmukh",
      city: "Pune",
      product: "Invisible Sunscreen SPF 50+ PA++++",
      category: "sunscreen",
      rating: 5,
      date: "2 days ago",
      comment: "Finding a sunscreen with NO white cast on Indian wheatish skin is so rare. The Dionara SPF 50+ feels literally like water on my skin and gives a healthy subtle glow without looking oily or causing any breakouts!"
    },
    {
      id: 2,
      name: "Aayush Mehra",
      city: "New Delhi",
      product: "Deep Ceramide Barrier Glow Moisturizer",
      category: "moisturizer",
      rating: 5,
      date: "4 days ago",
      comment: "The Ceramide Moisturizer completely saved my compromised skin barrier from retinol dryness. After 4 days, all redness was gone and my skin felt plump and hydrated all day long. Doesn't feel heavy at all."
    },
    {
      id: 3,
      name: "Shreya Patel",
      city: "Ahmedabad",
      product: "The Complete 2-Step Routine",
      category: "both",
      rating: 5,
      date: "1 week ago",
      comment: "I ordered both the Sunscreen and Moisturizer via WhatsApp. The checkout was super smooth — submitted the form and got instant confirmation on WhatsApp! Both products together are a match made in heaven."
    },
    {
      id: 4,
      name: "Dr. Radhika Kulkarni",
      city: "Mumbai",
      product: "Invisible Sunscreen SPF 50+ PA++++",
      category: "sunscreen",
      rating: 5,
      date: "2 weeks ago",
      comment: "As someone who spends 8+ hours under harsh hospital lighting and outdoors, this sunscreen re-applies like a dream over makeup without pilling or stinging the eyes. 10/10 recommendation!"
    },
    {
      id: 5,
      name: "Karan Singhania",
      city: "Bengaluru",
      product: "Deep Ceramide Barrier Glow Moisturizer",
      category: "moisturizer",
      rating: 5,
      date: "2 weeks ago",
      comment: "Men's skincare is usually full of heavy creams or drying washes. This moisturizer is lightweight, absorbs in 10 seconds after shaving, and has no artificial perfumes. Really impressed."
    },
    {
      id: 6,
      name: "Nandini Sen",
      city: "Kolkata",
      product: "The Complete 2-Step Routine",
      category: "both",
      rating: 5,
      date: "3 weeks ago",
      comment: "The Dionara duo gives that effortless Korean glass skin finish without making my T-zone greasy in Kolkata humidity. The WhatsApp team also answered all my ingredient questions very politely."
    }
  ];

  const filtered = filter === "all"
    ? reviewsList
    : reviewsList.filter((r) => r.category === filter || r.category === "both");

  return (
    <div className="reviews-page">
      <div className="page-header-banner">
        <div className="section-container">
          <span className="page-subtitle">REAL EXPERIENCES</span>
          <h1 className="page-title">Verified Customer Reviews</h1>
          <p className="page-lead">
            Discover what hundreds of real skincare users across India say about Dionara SPF 50+ Sunscreen and Ceramide Moisturizer.
          </p>
        </div>
      </div>

      <div className="section-container">
        {/* Rating Overview Card */}
        <div className="rating-overview-card">
          <div className="overview-score-box">
            <span className="score-number">4.9</span>
            <div className="overview-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span className="score-total">Based on 274+ Verified Buyers</span>
          </div>

          <div className="overview-stats-grid">
            <div className="stat-pill">
              <strong>99%</strong>
              <span>Agreed ZERO White Cast</span>
            </div>
            <div className="stat-pill">
              <strong>97%</strong>
              <span>Noticed Barrier Repair in 7 Days</span>
            </div>
            <div className="stat-pill">
              <strong>98%</strong>
              <span>Would Recommend to Friends</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="reviews-filter-bar">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Reviews ({reviewsList.length})
          </button>
          <button
            className={`filter-tab ${filter === "sunscreen" ? "active" : ""}`}
            onClick={() => setFilter("sunscreen")}
          >
            ☀️ Sunscreen SPF 50+
          </button>
          <button
            className={`filter-tab ${filter === "moisturizer" ? "active" : ""}`}
            onClick={() => setFilter("moisturizer")}
          >
            💧 Ceramide Moisturizer
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-cards-grid">
          {filtered.map((rev) => (
            <div key={rev.id} className="review-item-card">
              <div className="review-card-top">
                <div className="rev-stars-cluster">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span className="rev-date">{rev.date}</span>
              </div>

              <div className="rev-product-badge">
                <Sparkles size={12} />
                <span>{rev.product}</span>
              </div>

              <p className="rev-text">"{rev.comment}"</p>

              <div className="rev-author-row">
                <div className="rev-avatar">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <strong>{rev.name}</strong>
                  <span className="rev-location">{rev.city} • Verified Buyer <ShieldCheck size={13} className="verified-icon" /></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Share Feedback CTA */}
        <div className="feedback-whatsapp-cta">
          <MessageCircle size={32} color="#25D366" />
          <div>
            <h3>Have you tried Dionara Suncare or Moisturizer?</h3>
            <p>Send your feedback and selfie glow directly to our WhatsApp concierge team!</p>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Dionara Team! I would like to share my review/experience with your skincare products.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-feedback-wa"
          >
            Share on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
