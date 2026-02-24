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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateUser = () => setUser(getCurrentUser());
    updateUser();
    window.addEventListener("userChanged", updateUser);
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setMenuOpen(false);
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
    duration: 800,
    offset: -80,
    spy: true,
    activeClass: "text-orange-400",
    onClick: () => setMenuOpen(false),
  };

  const handleNavClick = (section) => {
    setMenuOpen(false);
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          const offset = 80; // Account for fixed navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(section);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  const getDashboardRoute = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/admin";
      case "employee": return "/employee";
      case "user": return "/user";
      default: return "/";
    }
  };

  const getRoleInfo = (role) => {
    const roles = {
      admin: { label: "Admin", borderColor: "#ef4444", textColor: "#ef4444", bg: "#450a0a" },
      employee: { label: "Employee", borderColor: "#3b82f6", textColor: "#3b82f6", bg: "#0c1a3a" },
      user: { label: "Customer", borderColor: "#F97316", textColor: "#F97316", bg: "#431407" },
    };
    return roles[role] || roles.user;
  };

  const navLinkClass =
    "text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-400 transition-colors cursor-pointer";

  const navLinks = [
    { section: "home", label: "Home" },
    { section: "services", label: "Services" },
    { section: "about", label: "About Us" },
  ];

  return (
    <>
      <style>{`
        @keyframes orangeGlow {
          0%, 100% { box-shadow: 0 0 8px #F97316, 0 0 16px #F97316 inset; }
          50% { box-shadow: 0 0 18px #F97316, 0 0 28px #F97316 inset; }
        }
        .animate-orange-glow { animation: orangeGlow 2s ease-in-out infinite; }
      `}</style>

      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: scrolled ? "rgba(3,7,18,0.98)" : "rgba(3,7,18,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid #111827" : "1px solid transparent",
          fontFamily: "'Barlow Condensed', 'Oswald', sans-serif",
        }}
      >
        {/* Orange top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, #F97316, #C2410C)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* ── LOGO ── */}
          <RouterLink
            to={getDashboardRoute()}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 group transition-all duration-300 ${
              user ? "hover:animate-orange-glow rounded-lg px-2 py-1" : ""
            }`}
          >
            <img
              src={rhinoLogo}
              alt="Rhino Linings Kenya"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden xs:block">
              <div
                className="text-base font-black uppercase leading-none tracking-wide"
                style={{ color: "#F97316" }}
              >
                Rhino Linings
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Kenya
              </div>
            </div>
          </RouterLink>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden md:flex items-center gap-8">
            {!user && navLinks.map(({ section, label }) =>
              location.pathname === "/" ? (
                <ScrollLink key={section} to={section} {...scrollProps} className={navLinkClass}>
                  {label}
                </ScrollLink>
              ) : (
                <button key={section} onClick={() => handleNavClick(section)} className={navLinkClass}>
                  {label}
                </button>
              )
            )}

            {!user && (
              <RouterLink to="/contact" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Contact Us
              </RouterLink>
            )}

            {/* Auth */}
            {!user ? (
              <RouterLink
                to="/register"
                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black transition-all hover:scale-105 hover:brightness-110"
                style={{ background: "#F97316" }}
              >
                Get Started
              </RouterLink>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 px-3 py-2 transition-all hover:bg-gray-800"
                  style={{ border: "1px solid #1f2937" }}
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 flex items-center justify-center text-xs font-black text-black flex-shrink-0"
                    style={{ background: "#F97316" }}
                  >
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300 hidden sm:inline truncate max-w-[100px]">
                    {user.name || user.email}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-1 w-64 overflow-hidden z-50"
                    style={{ background: "#111827", border: "1px solid #1f2937" }}
                  >
                    {/* User info */}
                    <div className="p-4" style={{ borderBottom: "1px solid #1f2937" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 flex items-center justify-center font-black text-black flex-shrink-0"
                          style={{ background: "#F97316" }}
                        >
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black uppercase tracking-wide text-white truncate">
                            {user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate" style={{ fontFamily: "Georgia, serif" }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {/* Role badge */}
                      <div
                        className="inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-widest"
                        style={{
                          border: `1px solid ${getRoleInfo(user.role).borderColor}`,
                          color: getRoleInfo(user.role).textColor,
                          background: getRoleInfo(user.role).bg,
                        }}
                      >
                        {getRoleInfo(user.role).label}
                      </div>
                    </div>

                    {/* Menu items */}
                    <div>
                      <RouterLink
                        to={getDashboardRoute()}
                        className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-orange-400 hover:bg-gray-900 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        My Dashboard
                      </RouterLink>

                      <div style={{ borderTop: "1px solid #1f2937" }} />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-950 transition-colors text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden flex flex-col gap-1.5 p-2 transition-all"
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: "#F97316",
                transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none",
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: "#F97316",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 transition-all duration-300"
              style={{
                background: "#F97316",
                transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none",
              }}
            />
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div
            className="md:hidden px-6 py-6 flex flex-col gap-1"
            style={{
              background: "#030712",
              borderTop: "1px solid #111827",
            }}
          >
            {!user && navLinks.map(({ section, label }) => (
              <button
                key={section}
                onClick={() => handleNavClick(section)}
                className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-400 hover:bg-gray-900 transition-colors"
              >
                {label}
              </button>
            ))}

            {!user && (
              <RouterLink
                to="/contact"
                className="px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-400 hover:bg-gray-900 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Contact Us
              </RouterLink>
            )}

            <div style={{ borderTop: "1px solid #111827" }} className="my-2" />

            {!user ? (
              <div className="flex flex-col gap-3 pt-2">
                <RouterLink
                  to="/login"
                  className="px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest text-black text-center transition-all hover:brightness-110"
                  style={{ background: "#F97316" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </RouterLink>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {/* Mobile user card */}
                <div className="p-4 mb-2" style={{ background: "#111827", border: "1px solid #1f2937" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center font-black text-black flex-shrink-0"
                      style={{ background: "#F97316" }}
                    >
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black uppercase tracking-wide text-white truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div
                    className="inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-widest"
                    style={{
                      border: `1px solid ${getRoleInfo(user.role).borderColor}`,
                      color: getRoleInfo(user.role).textColor,
                      background: getRoleInfo(user.role).bg,
                    }}
                  >
                    {getRoleInfo(user.role).label}
                  </div>
                </div>

                <RouterLink
                  to={getDashboardRoute()}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-400 hover:bg-gray-900 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  My Dashboard
                </RouterLink>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-950 transition-colors text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;