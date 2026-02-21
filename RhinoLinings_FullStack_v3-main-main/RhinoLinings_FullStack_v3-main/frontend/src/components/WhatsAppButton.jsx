import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // WhatsApp Configuration
  const WHATSAPP_NUMBER = "254700000000"; // Replace with your actual WhatsApp number
  const DEFAULT_MESSAGE = "Hi! I'm interested in Rhino Linings services.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Popup Message */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 w-72 bg-white rounded-lg shadow-2xl p-4 mb-2 animate-fade-in border border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-gray-900" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Chat with us!</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Have questions? We're here to help via WhatsApp.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 text-gray-900 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group relative"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-8 h-8" />
          
          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
          
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-gray-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            1
          </span>
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;
