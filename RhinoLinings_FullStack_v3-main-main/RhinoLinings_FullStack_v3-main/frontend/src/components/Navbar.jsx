import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { getCurrentUser, logout } from "../services/authService";
import rhinoLogo from "../assets/images/rhino-logo.jpeg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateUser = () => setUser(getCurrentUser());
    updateUser();
    window.addEventListener("userChanged", updateUser);
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  // Handle scroll for peeking navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at top
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
    window.dispatchEvent(new Event("userChanged"));
  };

  const scrollProps = {
    smooth: true,
    duration: 600,
    offset: -80,
    className: "cursor-pointer hover:text-rhinoYellow transition",
    onClick: () => setMenuOpen(false),
  };

  const handleNavClick = (section) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(section);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 600);
    } else {
      const el = document.getElementById(section);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getDashboardRoute = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "employee":
        return "/employee";
      case "user":
        return "/user";
      default:
        return "/";
    }
  };

  const getRoleInfo = (role) => {
    const roles = {
      admin: {
        label: "Admin",
        color: "bg-red-500",
        textColor: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-500"
      },
      employee: {
        label: "Employee",
        color: "bg-blue-500",
        textColor: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-500"
      },
      user: {
        label: "Customer",
        color: "bg-yellow-500",
        textColor: "text-yellow-500",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-500"
      }
    };
    return roles[role] || roles.user;
  };

  return (
    <nav className={`fixed top-0 left-0 w-full bg-rhinoBlack/95 backdrop-blur-sm text-rhinoWhite shadow-lg z-50 border-b border-gray-800 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <style>
        {`
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 8px #facc15, 0 0 16px #facc15 inset;
          }
          50% {
            box-shadow: 0 0 18px #facc15, 0 0 24px #facc15 inset;
          }
        }
        .animate-glow {
          animation: glowPulse 2s ease-in-out infinite;
        }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <RouterLink
          to={getDashboardRoute()}
          onClick={() => setMenuOpen(false)}
          className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-500"
        >
          <div
            className={`flex items-center space-x-2 sm:space-x-3 rounded-xl px-1 sm:px-2 py-1 transition-all duration-500 ${
              user
                ? "shadow-[0_0_8px_#facc15] group-hover:animate-glow"
                : ""
            }`}
          >
            <img
              src={rhinoLogo}
              alt="Rhino Linings Kenya Logo"
              className={`w-12 h-11 sm:w-15 sm:h-14 transition-transform duration-500 ${
                user ? "group-hover:scale-105" : ""
              }`}
            />
            <h1
              className={`text-lg sm:text-2xl font-bold text-rhinoYellow transition-all duration-500 hidden xs:block ${
                user ? "group-hover:drop-shadow-[0_0_10px_#facc15]" : ""
              }`}
            >
              Rhino Linings Kenya
            </h1>
          </div>
        </RouterLink>

        {/* 💻 Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {!user && ["home", "services", "about"].map((section) =>
            location.pathname === "/" ? (
              <ScrollLink key={section} to={section} {...scrollProps}>
                {section === "about"
                  ? "About Us"
                  : section.charAt(0).toUpperCase() + section.slice(1)}
              </ScrollLink>
            ) : (
              <button
                key={section}
                onClick={() => handleNavClick(section)}
                className={scrollProps.className}
              >
                {section === "about"
                  ? "About Us"
                  : section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            )
          )}
          
          {/* Contact Us Link - Always goes to /contact page */}
          {!user && (
            <RouterLink
              to="/contact"
              className="cursor-pointer hover:text-rhinoYellow transition"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </RouterLink>
          )}

          {/* 🔐 Auth Buttons */}
          {!user ? (
            <div className="flex items-center gap-3">
              {/* <RouterLink
                to="/login"
                className="text-rhinoWhite hover:text-rhinoYellow transition-all font-medium px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Sign In
              </RouterLink> */}
              <RouterLink
                to="/register"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-rhinoBlack px-6 py-2.5 rounded-md font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </RouterLink>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-rhinoGrey px-3 sm:px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-rhinoWhite hidden sm:inline truncate max-w-[120px]">
                    {user.name || user.email}
                  </span>
                </div>
                <svg className="w-4 h-4 text-rhinoWhite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
                  {/* User Info Section */}
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {/* Role Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${getRoleInfo(user.role).borderColor} ${getRoleInfo(user.role).bgColor} w-fit`}>
                      <div className={getRoleInfo(user.role).textColor}>
                        {getRoleInfo(user.role).icon}
                      </div>
                      <span className={`text-xs font-semibold ${getRoleInfo(user.role).textColor}`}>
                        {getRoleInfo(user.role).label}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <RouterLink
                      to={getDashboardRoute()}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-sm font-medium">My Dashboard</span>
                    </RouterLink>
                    
                    <div className="border-t border-gray-100"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 📱 Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-rhinoWhite focus:outline-none text-2xl"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 📋 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-rhinoBlack px-6 py-4 flex flex-col space-y-3">
          {!user && ["home", "services", "about"].map((section) => (
            <button
              key={section}
              onClick={() => handleNavClick(section)}
              className={scrollProps.className}
            >
              {section === "about"
                ? "About Us"
                : section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
          
          {/* Contact Us Link - Mobile */}
          {!user && (
            <RouterLink
              to="/contact"
              className="hover:text-rhinoYellow transition"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </RouterLink>
          )}

          {!user ? (
            <>
              <RouterLink
                to="/login"
                className="hover:text-rhinoYellow transition-all font-medium px-3 py-2 rounded-md hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </RouterLink>
              <RouterLink
                to="/register"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-rhinoBlack px-5 py-2.5 rounded-md font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </RouterLink>
            </>
          ) : (
            <>
              {/* Mobile User Info Card */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                {/* Mobile Role Badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${getRoleInfo(user.role).borderColor} ${getRoleInfo(user.role).bgColor} w-fit`}>
                  <div className={getRoleInfo(user.role).textColor}>
                    {getRoleInfo(user.role).icon}
                  </div>
                  <span className={`text-xs font-semibold ${getRoleInfo(user.role).textColor}`}>
                    {getRoleInfo(user.role).label}
                  </span>
                </div>
              </div>
              
              <RouterLink
                to={getDashboardRoute()}
                className="flex items-center gap-2 hover:text-rhinoYellow transition"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                My Dashboard
              </RouterLink>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-left hover:text-rhinoYellow transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;