import { CheckCircle, Truck, Factory, Shield, Anchor, Tractor, Building2, Waves, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import PageBreadcrumb from "../components/PageBreadcrumb";
import { getCurrentUser } from "../services/authService";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get("/service-management");
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleGetQuote = (service) => {
    const serviceName = service.name || service.title;
    if (user) {
      localStorage.setItem("selectedServiceForQuote", JSON.stringify(service));
      navigate("/user");
      toast.success(`Getting quote for ${serviceName}`);
    } else {
      localStorage.setItem("selectedServiceForQuote", JSON.stringify(service));
      localStorage.setItem("returnPath", "/user");
      navigate("/register");
      toast.info("Please create an account to get a quote");
    }
  };

  const handleBookNow = (service) => {
    const serviceName = service.name || service.title;
    if (user) {
      localStorage.setItem("selectedServiceForBooking", JSON.stringify(service));
      navigate("/user");
      toast.success(`Booking ${serviceName}`);
    } else {
      localStorage.setItem("selectedServiceForBooking", JSON.stringify(service));
      localStorage.setItem("returnPath", "/user");
      navigate("/register");
      toast.info("Please create an account to book this service");
    }
  };

  const fallbackServices = [
    {
      _id: "fallback-1",
      name: "Truck Bed Liners",
      category: "Automotive",
      image: "/images/vehicle-before-after.jpg",
      description:
        "Custom spray-on bed liners fitted to each vehicle's unique contours. 100% polyurethane providing the ultimate protection against rust, corrosion and impact. Ready same day.",
      basePrice: 25000,
      estimatedDuration: "2–4 hours",
    },
    {
      _id: "fallback-2",
      name: "Industrial Coatings",
      category: "Industrial",
      image: "/images/industrial-coating.jpg",
      description:
        "Heavy-duty coatings for cement trucks, acid bunds, dump trucks, refuse skips and steel structures. Adheres to steel, fibreglass, concrete, wood and aluminium.",
      basePrice: 50000,
      estimatedDuration: "1–2 days",
    },
    {
      _id: "fallback-3",
      name: "Mining Applications",
      category: "Mining",
      image: "/images/custom-sprayon.jpg",
      description:
        "Proven in the harshest mining environments worldwide. Protects chutes, hoppers, pulleys, conveyor belts and vehicles — reducing unplanned downtime and extending asset lifespan.",
      basePrice: 80000,
      estimatedDuration: "Custom",
    },
    {
      _id: "fallback-4",
      name: "Marine Protection",
      category: "Marine",
      image: "/images/vehicle-before-after.jpg",
      description:
        "Industrial-grade protection for ski boats, fishing boats, yachts, commercial and navy ships. Seamless hygienic linings resistant to fuel, salt and corrosive elements.",
      basePrice: 40000,
      estimatedDuration: "1–2 days",
    },
    {
      _id: "fallback-5",
      name: "Waterproofing",
      category: "Waterproofing",
      image: "/images/industrial-coating.jpg",
      description:
        "Seamless elastomer coatings for rooftops, parking lots, bathrooms, balconies and retaining walls. Flexible, rapid installation and can be tiled over.",
      basePrice: 30000,
      estimatedDuration: "1 day",
    },
    {
      _id: "fallback-6",
      name: "Containment Solutions",
      category: "Containment",
      image: "/images/custom-sprayon.jpg",
      description:
        "Primary and secondary containment for tanks and bund areas above and below ground. Zero permeability polyurea lasting 60+ years without maintenance.",
      basePrice: 60000,
      estimatedDuration: "Custom",
    },
  ];

  const displayServices = services.length > 0 ? services : fallbackServices;

  const getIconForCategory = (category = "") => {
    const map = {
      Automotive: <Truck className="w-5 h-5" />,
      "Vehicle Coating": <Truck className="w-5 h-5" />,
      Industrial: <Factory className="w-5 h-5" />,
      Mining: <Shield className="w-5 h-5" />,
      Marine: <Anchor className="w-5 h-5" />,
      Agricultural: <Tractor className="w-5 h-5" />,
      Commercial: <Building2 className="w-5 h-5" />,
      Waterproofing: <Waves className="w-5 h-5" />,
      Containment: <Shield className="w-5 h-5" />,
    };
    return map[category] || <Shield className="w-5 h-5" />;
  };

  const applicationAreas = [
    { label: "Automotive", icon: "🚗", desc: "Bed liners, full vehicle wrap, underbody" },
    { label: "Mining", icon: "⛏️", desc: "Chutes, hoppers, conveyor belts, vehicles" },
    { label: "Marine", icon: "⚓", desc: "Boats, yachts, commercial & navy ships" },
    { label: "Waterproofing", icon: "💧", desc: "Rooftops, parking lots, balconies" },
    { label: "Industrial", icon: "🏭", desc: "Floors, tanks, machinery, structures" },
    { label: "Containment", icon: "🛢️", desc: "Primary & secondary, above & below ground" },
  ];

  if (loading) {
    return (
      <div
        className="pt-20 min-h-screen flex items-center justify-center"
        style={{ background: "#f5f5f5" }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
          />
          <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pt-20 min-h-screen text-gray-900"
      style={{
        background: "#f5f5f5",
        fontFamily: "'Barlow Condensed', 'Oswald', sans-serif",
      }}
    >
      <PageBreadcrumb />

      {/* ── HERO ── */}
      <section className="relative px-6 py-24 text-center overflow-hidden bg-gray-50">
        <div
          className="absolute inset-0 flex items-center justify-center text-9xl font-black uppercase opacity-5 select-none pointer-events-none"
          style={{ color: "#F97316" }}
        >
          SERVICES
        </div>
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, #F97316, #C2410C)" }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px" style={{ background: "#F97316" }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#F97316" }}
            >
              Endless Possibilities · More Than Bed Liners
            </span>
            <span className="w-8 h-px" style={{ background: "#F97316" }} />
          </div>
          <h1
            className="text-6xl md:text-8xl font-black uppercase leading-none mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Our
          </h1>
          <h1
            className="text-6xl md:text-8xl font-black uppercase leading-none mb-8"
            style={{
              letterSpacing: "-0.02em",
              WebkitTextStroke: "2px #F97316",
              color: "transparent",
            }}
          >
            Services
          </h1>
          <p
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "Georgia, serif" }}
          >
            From truck bed liners to mining containment — our polyurethane and polyurea
            coatings bond to virtually any substrate, in virtually any environment.
          </p>
        </div>
      </section>

      {/* ── APPLICATION AREAS STRIP ── */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3 md:grid-cols-6 gap-4">
          {applicationAreas.map((area, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">{area.icon}</div>
              <div
                className="text-xs font-black uppercase tracking-wider"
                style={{ color: "#F97316" }}
              >
                {area.label}
              </div>
              <div className="text-xs text-gray-400 hidden md:block mt-0.5">{area.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES GRID ── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#F97316" }}
            >
              What We Offer
            </p>
            <h2 className="text-5xl font-black uppercase">
              Protective Coating <span style={{ color: "#F97316" }}>Solutions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayServices.map((service, index) => (
              <div
                key={service._id || index}
                className="group flex flex-col overflow-hidden transition-all hover:translate-y-[-4px]"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-gray-50">
                  <img
                    src={service.imageUrl || service.image || "/images/vehicle-before-after.jpg"}
                    alt={service.name || service.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "/images/vehicle-before-after.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                  {/* Category badge */}
                  <div
                    className="absolute top-4 left-4 px-3 py-1 text-xs font-black uppercase tracking-wider text-black"
                    style={{ background: "#F97316" }}
                  >
                    {service.category || "Premium"}
                  </div>

                  {/* Icon */}
                  <div
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.6)", color: "#F97316" }}
                  >
                    {getIconForCategory(service.category)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3
                    className="text-xl font-black uppercase tracking-wide mb-3 group-hover:text-orange-400 transition-colors"
                  >
                    {service.name || service.title}
                  </h3>

                  <p
                    className="text-gray-400 text-sm mb-5 leading-relaxed flex-1"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {service.description}
                  </p>

                  {/* Price & Duration */}
                  <div
                    className="flex items-center justify-between mb-5 py-4"
                    style={{ borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}
                  >
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                        Starting from
                      </p>
                      <p
                        className="text-2xl font-black"
                        style={{ color: "#F97316" }}
                      >
                        KES {(service.basePrice || 25000).toLocaleString()}
                      </p>
                    </div>
                    {service.estimatedDuration && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                          Duration
                        </p>
                        <p className="text-sm font-bold text-gray-700">
                          {service.estimatedDuration}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGetQuote(service)}
                      className="flex-1 py-3 font-black uppercase text-xs tracking-wider transition-all hover:scale-105"
                      style={{ background: "#F97316", color: "#000" }}
                    >
                      Get Quote
                    </button>
                    <button
                      onClick={() => handleBookNow(service)}
                      className="flex-1 py-3 font-black uppercase text-xs tracking-wider transition-all hover:scale-105"
                      style={{
                        background: "transparent",
                        border: "2px solid #d1d5db",
                        color: "#9ca3af",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#F97316";
                        e.currentTarget.style.color = "#F97316";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.color = "#9ca3af";
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RHINO ── */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#F97316" }}
            >
              The Rhino Advantage
            </p>
            <h2 className="text-4xl md:text-5xl font-black uppercase">
              Why Our Coatings <span style={{ color: "#F97316" }}>Work</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "⚡",
                title: "Sets in Seconds",
                desc: "Ready for light traffic almost immediately — far faster than any alternative product on the market.",
              },
              {
                icon: "🔒",
                title: "Air- & Watertight Bond",
                desc: "Forms a permanent seamless bond to steel, fibreglass, concrete, wood and aluminium — preventing corrosion at the source.",
              },
              {
                icon: "🛡️",
                title: "Up to 5mm Protection",
                desc: "A thick, slip-resistant layer that acts as sacrificial protection — extending asset lifespan and lowering total cost of ownership.",
              },
              {
                icon: "🌡️",
                title: "Extreme Temperature Range",
                desc: "Withstands temperatures from -40°C to extreme heat without cracking, warping or peeling.",
              },
              {
                icon: "🌿",
                title: "Environmentally Friendly",
                desc: "No VOCs. Forms an inert lining that releases no vapours, fuels or chemicals during or after installation.",
              },
              {
                icon: "🔧",
                title: "Easily Repaired",
                desc: "Unlike plastic drop-in liners, Rhino coatings can be repaired on-site quickly without replacement.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 transition-all hover:translate-y-[-2px]"
                style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
              >
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-black uppercase text-sm tracking-wider mb-2">
                    {item.title}
                  </h3>
                  <p
                    className="text-xs text-gray-500 leading-relaxed"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 bg-white">
        <div
          className="max-w-4xl mx-auto p-12 text-center"
          style={{ border: "2px solid #F97316" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#F97316" }}
          >
            Ready to Get Started?
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
            Protect Your <span style={{ color: "#F97316" }}>Investment</span>
          </h2>
          <p
            className="text-gray-400 mb-10 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {user
              ? "Select a service above to get your personalised quote."
              : "Create an account to get instant quotes and book services online."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="px-10 py-4 font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
                  style={{ background: "#F97316", color: "#000" }}
                >
                  Create Account
                </Link>
                <Link
                  to="/contact"
                  className="px-10 py-4 font-black uppercase tracking-widest text-sm border-2 transition-all hover:scale-105"
                  style={{ borderColor: "#F97316", color: "#F97316" }}
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <Link
                to="/user"
                className="inline-flex items-center gap-2 px-10 py-4 font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
                style={{ background: "#F97316", color: "#000" }}
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}