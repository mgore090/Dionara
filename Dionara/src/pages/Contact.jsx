import { useState } from "react";
import { MessageCircle, Mail, MapPin, Clock, Send } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Contact() {
  const { whatsappNumber, showToast } = useShop();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    subject: "Product Question",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      showToast("Please enter your name and message", "error");
      return;
    }

    let msg = `✨ *DIONARA - CUSTOMER INQUIRY* ✨\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 Name: ${form.name}\n`;
    if (form.mobile) msg += `📱 Mobile: ${form.mobile}\n`;
    msg += `📌 Subject: ${form.subject}\n\n`;
    msg += `💬 Message:\n${form.message}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    showToast("Opening WhatsApp chat with your inquiry...", "success");
  };

  return (
    <div className="contact-page">
      <div className="page-header-banner">
        <div className="section-container">
          <span className="page-subtitle">WE'RE HERE FOR YOU</span>
          <h1 className="page-title">Contact Dionara</h1>
          <p className="page-lead">
            Have questions about our Sunscreen, Moisturizer, or your order? Connect directly with our skincare specialists.
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="contact-grid">
          {/* Info cards */}
          <div className="contact-info-col">
            <div className="contact-method-card highlight">
              <div className="method-icon-wrap wa">
                <MessageCircle size={28} />
              </div>
              <div>
                <h3>WhatsApp Concierge</h3>
                <p>Fastest way to connect for instant orders, tracking, and advice.</p>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-action-link"
                >
                  +{whatsappNumber} (Chat Now) →
                </a>
              </div>
            </div>

            <div className="contact-method-card">
              <div className="method-icon-wrap mail">
                <Mail size={24} />
              </div>
              <div>
                <h3>Email Concierge</h3>
                <p>Send detailed inquiries, partnership requests, or feedback.</p>
                <span className="contact-static-text">concierge@dionara.com</span>
              </div>
            </div>

            <div className="contact-method-card">
              <div className="method-icon-wrap clock">
                <Clock size={24} />
              </div>
              <div>
                <h3>Operating Hours</h3>
                <p>Monday to Saturday: 9:00 AM – 9:00 PM IST</p>
                <span className="contact-sub-text">WhatsApp messages answered 7 days a week</span>
              </div>
            </div>

            <div className="contact-method-card">
              <div className="method-icon-wrap pin">
                <MapPin size={24} />
              </div>
              <div>
                <h3>Studio & Fulfillment Hub</h3>
                <p>Dionara Skincare Laboratories, Mumbai & Jaipur, India</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <h2>Send Us a Message</h2>
              <p className="form-sub-lead">
                Fill the details below to start a direct message on WhatsApp with our team.
              </p>

              <form onSubmit={handleSubmit} className="styled-contact-form">
                <div className="form-field">
                  <label>Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Ananya Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>WhatsApp Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="e.g. 9876543210"
                    value={form.mobile}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label>Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="styled-select"
                  >
                    <option value="Product Question">Question about Sunscreen or Moisturizer</option>
                    <option value="Order Status">Order Tracking / Status</option>
                    <option value="Skincare Consultation">Personal Skincare Routine Advice</option>
                    <option value="Bulk or Corporate Order">Bulk / Corporate Inquiry</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Your Message / Question *</label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="Type your question or query here..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-contact-submit">
                  <Send size={18} />
                  <span>Send via WhatsApp (+{whatsappNumber})</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
