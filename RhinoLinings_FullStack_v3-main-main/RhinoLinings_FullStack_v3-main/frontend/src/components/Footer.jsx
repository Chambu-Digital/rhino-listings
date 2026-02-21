import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import rhinoLogo from "../assets/images/rhino-logo.jpeg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#030712",
        fontFamily: "'Barlow Condensed', 'Oswald', sans-serif",
        borderTop: "3px solid #F97316",
      }}
    >
      {/* ── TOP STRIP ── */}
      <div style={{ background: "#F97316" }} className="py-3">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-widest text-black">
            Trusted Since 1983 · ISO 9001:2015 Certified · OEM Approved
          </p>
          <a
            href="https://wa.me/254727877651?text=Hi%2C%20I%27m%20interested%20in%20Rhino%20Linings%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black uppercase tracking-widest text-black hover:opacity-80 transition-opacity"
          >
            💬 Chat on WhatsApp →
          </a>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Brand — 4 cols */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={rhinoLogo}
                alt="Rhino Linings Kenya"
                className="h-10 w-auto"
              />
              <div>
                <div
                  className="text-lg font-black uppercase leading-none"
                  style={{ color: "#F97316" }}
                >
                  Rhino Linings
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Kenya
                </div>
              </div>
            </div>

            <p
              className="text-gray-400 text-sm leading-relaxed"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Kenya's premier protective coating specialists — delivering world-class
              polyurethane and polyurea solutions for automotive, industrial, mining,
              marine, waterproofing and containment applications.
            </p>

            {/* Social icons */}
            <div className="flex gap-2 pt-1">
              {[
                { icon: <Facebook className="w-4 h-4" />, href: "#" },
                { icon: <Twitter className="w-4 h-4" />, href: "#" },
                { icon: <Instagram className="w-4 h-4" />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 flex items-center justify-center text-gray-500 transition-all hover:scale-110"
                  style={{ background: "#111827", border: "1px solid #1f2937" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F97316";
                    e.currentTarget.style.color = "#000";
                    e.currentTarget.style.borderColor = "#F97316";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#111827";
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.borderColor = "#1f2937";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — 2 cols */}
          <div className="lg:col-span-2">
            <h4
              className="text-xs font-black uppercase tracking-widest mb-5"
              style={{ color: "#F97316" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 font-bold uppercase tracking-wider transition-colors hover:text-orange-400 flex items-center gap-2 group"
                  >
                    <span
                      className="w-3 h-px inline-block transition-all group-hover:w-5"
                      style={{ background: "#F97316" }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — 3 cols */}
          <div className="lg:col-span-3">
            <h4
              className="text-xs font-black uppercase tracking-widest mb-5"
              style={{ color: "#F97316" }}
            >
              Our Services
            </h4>
            <ul className="space-y-3">
              {[
                "Automotive Bed Liners",
                "Industrial Coatings",
                "Mining Applications",
                "Marine Protection",
                "Waterproofing",
                "Containment Solutions",
              ].map((s, i) => (
                <li key={i}>
                  <Link
                    to="/services"
                    className="text-sm text-gray-400 font-bold uppercase tracking-wider transition-colors hover:text-orange-400 flex items-center gap-2 group"
                  >
                    <span
                      className="w-3 h-px inline-block transition-all group-hover:w-5"
                      style={{ background: "#F97316" }}
                    />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — 3 cols */}
          <div className="lg:col-span-3">
            <h4
              className="text-xs font-black uppercase tracking-widest mb-5"
              style={{ color: "#F97316" }}
            >
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+254727877651"
                  className="flex items-start gap-3 group"
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "#F97316" }}
                  >
                    <Phone className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-0.5">
                      Phone
                    </p>
                    <span className="text-sm text-gray-300 group-hover:text-orange-400 transition-colors font-bold">
                      +254 727 877 651
                    </span>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="mailto:info@rhinoliningskenya.com"
                  className="flex items-start gap-3 group"
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "#F97316" }}
                  >
                    <Mail className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-0.5">
                      Email
                    </p>
                    <span className="text-sm text-gray-300 group-hover:text-orange-400 transition-colors font-bold break-all">
                      info@rhinoliningskenya.com
                    </span>
                  </div>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <div
                  className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "#F97316" }}
                >
                  <MapPin className="w-3.5 h-3.5 text-black" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-0.5">
                    Location
                  </p>
                  <span
                    className="text-sm text-gray-300"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Next to Insignia Motors,<br />
                    Off Karen Road, Nairobi
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ borderTop: "1px solid #111827" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
            © {currentYear} Rhino Linings Kenya. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-600 font-bold uppercase tracking-wider">
            <Link
              to="/login"
              className="hover:text-orange-400 transition-colors"
            >
              Sign In
            </Link>
            <span style={{ color: "#1f2937" }}>|</span>
            <a href="#" className="hover:text-orange-400 transition-colors">
              Privacy
            </a>
            <span style={{ color: "#1f2937" }}>|</span>
            <a href="#" className="hover:text-orange-400 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;