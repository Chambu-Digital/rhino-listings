import { MessageCircle, Mail, X, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import API from "../services/api";

/**
 * ContactClientModal
 * Props:
 *   client: { name, email, phone }
 *   onClose: () => void
 */
export default function ContactClientModal({ client, onClose }) {
  const [mode, setMode] = useState("email"); // "email" | "whatsapp"
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendEmail = async () => {
    if (!client.email) return toast.error("This client has no email address.");
    if (!subject.trim() || !message.trim()) return toast.error("Subject and message are required.");
    setSending(true);
    try {
      await API.post("/contact/send-to-client", {
        toEmail: client.email,
        toName: client.name,
        subject,
        message,
      });
      toast.success(`Email sent to ${client.name}`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  const handleWhatsApp = () => {
    if (!client.phone) return toast.error("This client has no phone number.");
    // Normalize phone: strip spaces/dashes, ensure it starts with country code
    const raw = client.phone.replace(/[\s\-()]/g, "");
    const normalized = raw.startsWith("+") ? raw.slice(1) : raw.startsWith("0") ? "254" + raw.slice(1) : raw;
    const url = `https://wa.me/${normalized}?text=${encodeURIComponent(message || `Hello ${client.name}, `)}`;
    window.open(url, "_blank");
    onClose();
  };

  const overlay = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: "16px",
  };

  const modal = {
    background: "#1a2235", border: "1px solid #2d3748",
    width: "100%", maxWidth: "480px", borderRadius: "4px",
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "#0f172a", border: "1px solid #2d3748",
    color: "#e5e7eb", fontSize: "0.875rem", outline: "none",
    borderRadius: "2px",
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #2d3748", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Contact Client
            </p>
            <p style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{client.name} {client.email ? `· ${client.email}` : ""}</p>
          </div>
          <button onClick={onClose} style={{ color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", borderBottom: "1px solid #2d3748" }}>
          {["email", "whatsapp"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "12px", fontSize: "0.8rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer",
                background: mode === m ? (m === "whatsapp" ? "#052e16" : "#1e3a5f") : "transparent",
                color: mode === m ? (m === "whatsapp" ? "#4ade80" : "#60a5fa") : "#6b7280",
                borderBottom: mode === m ? `2px solid ${m === "whatsapp" ? "#16a34a" : "#3b82f6"}` : "2px solid transparent",
                border: "none", borderBottom: mode === m ? `2px solid ${m === "whatsapp" ? "#16a34a" : "#3b82f6"}` : "2px solid transparent",
              }}
            >
              {m === "email" ? <><Mail size={13} style={{ display: "inline", marginRight: 6 }} />Email</> : <><MessageCircle size={13} style={{ display: "inline", marginRight: 6 }} />WhatsApp</>}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "email" && (
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Your Quotation from Rhino Linings"
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder={mode === "whatsapp" ? `Hello ${client.name}, ` : "Type your message here..."}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <button
            onClick={mode === "email" ? handleSendEmail : handleWhatsApp}
            disabled={sending}
            style={{
              padding: "11px", fontWeight: 700, fontSize: "0.8rem",
              textTransform: "uppercase", letterSpacing: "0.08em",
              background: mode === "whatsapp" ? "#16a34a" : "#F97316",
              color: mode === "whatsapp" ? "#fff" : "#000",
              border: "none", cursor: sending ? "not-allowed" : "pointer",
              opacity: sending ? 0.6 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {mode === "whatsapp" ? <MessageCircle size={15} /> : <Send size={15} />}
            {sending ? "Sending..." : mode === "whatsapp" ? "Open WhatsApp" : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
