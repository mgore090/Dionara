import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useShop } from "../context/ShopContext";

function FAQ() {
  const { whatsappNumber } = useShop();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Does Dionara Sunscreen leave any white cast on deeper skin tones?",
      a: "Absolutely not! Dionara Invisible Water-Glow Sunscreen SPF 50+ is formulated with microscopic new-generation organic filters suspended in a fluid water-gel base. It blends completely transparent in less than 15 seconds on all Indian skin tones with zero ghosting or ashy residue."
    },
    {
      q: "In what order should I use the Sunscreen and Moisturizer?",
      a: "Always apply your Dionara Deep Ceramide Moisturizer first onto cleansed, slightly damp skin to lock in deep hydration and seal your barrier. Wait 1-2 minutes for absorption, then apply two finger-lengths of Dionara SPF 50+ Sunscreen as the final step of your morning skincare routine."
    },
    {
      q: "Is the Ceramide Moisturizer suitable for oily or acne-prone skin?",
      a: "Yes. While it delivers rich barrier-restoring nourishment, it is formulated with a non-comedogenic, lightweight soufflé texture. It contains Centella Asiatica and Colloidal Oat to soothe active blemishes without clogging pores or feeling greasy."
    },
    {
      q: "How does the WhatsApp Ordering checkout work?",
      a: "When you add products to your cart and fill your delivery address in Checkout, clicking 'Submit Order to WhatsApp' automatically prepares an itemized order message. It directly opens WhatsApp on your phone or computer connected with our official store (+${whatsappNumber}). Our concierge team immediately confirms stock and provides your UPI QR code or COD confirmation."
    },
    {
      q: "What payment methods are supported?",
      a: "We support instant UPI (Google Pay, PhonePe, Paytm, BHIM), WhatsApp Pay, Direct Bank Transfer, and Cash on Delivery (COD) across serviceable pin codes in India."
    },
    {
      q: "How long does shipping take?",
      a: "Orders are dispatched within 24 hours from our fulfillment hub. Metro cities typically receive deliveries within 2-3 business days; all other locations across India take 4-5 business days. Real-time courier tracking is provided directly via WhatsApp."
    },
    {
      q: "Can I use Dionara Sunscreen around my eye area?",
      a: "Yes, our sunscreen is ophthalmologically and dermatologically tested to be gentle and non-stinging. You can comfortably apply it around the orbital bone and eyelids."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faq-page">
      <div className="page-header-banner">
        <div className="section-container">
          <span className="page-subtitle">HELP CENTER & ANSWERS</span>
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-lead">
            Everything you need to know about Dionara Sunscreen, Ceramide Moisturizer, and our seamless WhatsApp ordering.
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="faq-layout-grid">
          {/* FAQ Accordion List */}
          <div className="faq-accordion-col">
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`faq-item-card ${isOpen ? "open" : ""}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="faq-question-row">
                      <span className="faq-q-text">{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`faq-chevron ${isOpen ? "rotate" : ""}`}
                      />
                    </div>
                    {isOpen && (
                      <div className="faq-answer-block">
                        <p>{faq.a.replace("${whatsappNumber}", whatsappNumber)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="faq-support-sidebar">
            <div className="support-card-box">
              <div className="support-badge-icon">
                <MessageCircle size={32} color="#25D366" />
              </div>
              <h3>Need Instant Assistance?</h3>
              <p>
                Our skincare concierge and order support team is available on WhatsApp daily from 9:00 AM to 9:00 PM IST.
              </p>
              <div className="support-action-wrap">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Dionara Support Team! I have a question about my order/products.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-support-whatsapp"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp (+{whatsappNumber})</span>
                </a>
              </div>
              <div className="support-hours-note">
                <span>Average response time: <strong>under 5 minutes</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
