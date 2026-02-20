import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import rhinoLogo from "../assets/images/rhino-logo.jpeg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Company Info - Spans 4 columns */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center space-x-2">
              <img src={rhinoLogo} alt="Rhino Linings Kenya" className="h-10 w-auto" />
              <h3 className="text-lg font-bold text-yellow-500">Rhino Linings</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kenya's premier protective coating specialists delivering quality spray-on solutions.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-black transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-black transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-500 hover:text-black transition">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-yellow-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-gray-400 hover:text-yellow-500 transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-yellow-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-yellow-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services - Spans 3 columns */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold mb-3 text-white">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400">Truck Linings</li>
              <li className="text-sm text-gray-400">Industrial Coatings</li>
              <li className="text-sm text-gray-400">Custom Spray-Ons</li>
              <li className="text-sm text-gray-400">Fleet Services</li>
            </ul>
          </div>

          {/* Contact Info - Spans 3 columns */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold mb-3 text-white">Get In Touch</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <a href="tel:+254727877651" className="hover:text-yellow-500 transition">
                  +254 727 877 651
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <a href="mailto:info@rhinoliningskenya.com" className="hover:text-yellow-500 transition">
                  info@rhinoliningskenya.com
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>Karen, Nairobi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p>© {currentYear} Rhino Linings Kenya. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-yellow-500 transition">Sign In</Link>
              <span>•</span>
              <a href="#" className="hover:text-yellow-500 transition">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-yellow-500 transition">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
