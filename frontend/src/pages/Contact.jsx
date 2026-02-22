import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import API from "../services/api";
import PageBreadcrumb from "../components/PageBreadcrumb";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const WHATSAPP_NUMBER = "254727877651";
  const WHATSAPP_MESSAGE = "Hi! I'm interested in Rhino Linings services.";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/contact", formData);
      toast.success(response.data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank");
  };

  const inputBase = {
    width: "100%",
    padding: "12px 16px",
    background: "#0f172a",
    border: "1px solid #1f2937",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "Georgia, serif",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#6b7280",
    marginBottom: "6px",
  };

  return (
    <div
      className="min-h-screen pt-20 pb-16"
      style={{
        background: "#030712",
        fontFamily: "'Barlow Condensed', 'Oswald', sans-serif",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageBreadcrumb />

        {/* ── HERO ── */}
        <section className="relative text-center py-12 overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-8 h-px" style={{ background: "#F97316" }} />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#F97316" }}
              >
                We're Here to Help
              </span>
              <span className="w-8 h-px" style={{ background: "#F97316" }} />
            </div>
            <h1
              className="text-5xl md:text-6xl font-black uppercase leading-none mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              Get In <span style={{ color: "#F97316" }}>Touch</span>
            </h1>
            <p
              className="text-base text-gray-400 max-w-xl mx-auto"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Questions about our coatings? Ready for a quote? Our team typically
              responds within 24 hours — or reach us instantly on WhatsApp.
            </p>
          </div>
        </section>

        {/* ── QUICK CONTACT CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Phone */}
          <a
            href="tel:+254727877651"
            className="flex items-center gap-4 p-6 transition-all hover:translate-y-[-2px] group"
            style={{ background: "#111827", borderLeft: "3px solid #F97316" }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center flex-shrink-0"
              style={{ background: "#F97316" }}
            >
              <Phone className="w-5 h-5 text-black" />
            </div>
            <div className="text-left">
              <h3 className="font-black uppercase tracking-wider text-xs mb-1 text-gray-400">Call Us</h3>
              <span className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors">
                +254 727 877 651
              </span>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@rhinoliningskenya.com"
            className="flex items-center gap-4 p-6 transition-all hover:translate-y-[-2px] group"
            style={{ background: "#111827", borderLeft: "3px solid #F97316" }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center flex-shrink-0"
              style={{ background: "#F97316" }}
            >
              <Mail className="w-5 h-5 text-black" />
            </div>
            <div className="text-left">
              <h3 className="font-black uppercase tracking-wider text-xs mb-1 text-gray-400">Email Us</h3>
              <span className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors break-all">
                info@rhinoliningskenya.com
              </span>
            </div>
          </a>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center gap-4 p-6 transition-all hover:translate-y-[-2px] group w-full"
            style={{ background: "#052e16", borderLeft: "3px solid #16a34a" }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center flex-shrink-0"
              style={{ background: "#16a34a" }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-black uppercase tracking-wider text-xs mb-1 text-green-700">WhatsApp</h3>
              <span className="font-bold text-green-400 text-sm group-hover:text-green-300 transition-colors">
                Chat Now →
              </span>
            </div>
          </button>
        </div>

        {/* ── FORM + SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Contact Form */}
          <div className="lg:col-span-2" style={{ background: "#111827", border: "1px solid #1f2937" }}>
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ borderBottom: "1px solid #1f2937" }}
            >
              <div className="w-1 h-5" style={{ background: "#F97316" }} />
              <h2 className="font-black uppercase tracking-wider text-sm">Send Us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    style={inputBase}
                    onFocus={(e) => (e.target.style.borderColor = "#F97316")}
                    onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    style={inputBase}
                    onFocus={(e) => (e.target.style.borderColor = "#F97316")}
                    onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  style={inputBase}
                  onFocus={(e) => (e.target.style.borderColor = "#F97316")}
                  onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
                />
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us about your project or enquiry..."
                  style={{ ...inputBase, resize: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "#F97316")}
                  onBlur={(e) => (e.target.style.borderColor = "#1f2937")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "#F97316", color: "#000" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Location */}
            <div
              className="p-5"
              style={{ background: "#111827", borderLeft: "3px solid #F97316" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F97316" }}
                >
                  <MapPin className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-black uppercase tracking-wider text-xs">Find Us</h3>
              </div>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Next to Insignia Motors,<br />
                Off Karen Road, Karen,<br />
                Lang'ata, Nairobi, Kenya
              </p>
            </div>

            {/* Business Hours */}
            <div
              className="p-5"
              style={{ background: "#111827", borderLeft: "3px solid #F97316" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F97316" }}
                >
                  <Clock className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-black uppercase tracking-wider text-xs">Business Hours</h3>
              </div>

              <div className="space-y-2">
                {[
                  { day: "Mon – Fri", hours: "8:00 AM – 6:00 PM", active: true },
                  { day: "Saturday", hours: "9:00 AM – 5:00 PM", active: true },
                  { day: "Sunday", hours: "10:00 AM – 4:00 PM", active: false },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm py-2"
                    style={{ borderBottom: i < 2 ? "1px solid #1f2937" : "none" }}
                  >
                    <span className="text-gray-400 uppercase tracking-wider text-xs font-bold">
                      {row.day}
                    </span>
                    <span
                      className="font-bold text-xs"
                      style={{ color: row.active ? "#F97316" : "#6b7280" }}
                    >
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { top: "Trusted", bottom: "Since 1983" },
                { top: "ISO 9001", bottom: "Certified" },
                { top: "3 Year", bottom: "Warranty" },
                { top: "OEM", bottom: "Approved" },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center py-3 text-center"
                  style={{ background: "#111827", border: "1px solid #1f2937" }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    {b.top}
                  </div>
                  <div
                    className="text-xs font-black uppercase tracking-wider"
                    style={{ color: "#F97316" }}
                  >
                    {b.bottom}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}