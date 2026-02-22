import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaVolumeMute, FaVolumeUp, FaPhone, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const Home = () => {
  const [muted, setMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMute = () => {
    setMuted(!muted);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const services = [
    {
      id: "automotive",
      label: "Automotive",
      iconImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=400&fit=crop",
      headline: "Protect Your Vehicle Investment",
      image: "/images/vehicle-before-after.jpg",
      description:
        "Our spray-on bed liners are custom-sprayed to fit each vehicle's unique contours. Applied in 2–4 hours, your vehicle is ready the same day — backed by a 3-year transferable warranty.",
      features: [
        "100% polyurethane protection",
        "Slip-resistant textured finish",
        "Air- & watertight bond prevents rust",
        "3-Year transferable warranty",
        "Increases resale value",
        "Available in virtually any colour",
      ],
      accent: "#F97316",
    },
    {
      id: "industrial",
      label: "Industrial",
      iconImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop",
      headline: "Industrial-Grade Surface Protection",
      image: "/images/industrial-coating.jpg",
      description:
        "From cement trucks to acid bunds, our coatings adhere to steel, wood, fibreglass, concrete and aluminium — delivering corrosion, abrasion and impact resistance with minimal downtime.",
      features: [
        "Cement trucks & dump trucks",
        "Refuse skips & cargo trailers",
        "Acid bunds & steel structures",
        "NVH reduction available",
        "Virtually no maintenance required",
        "Environmentally friendly",
      ],
      accent: "#F97316",
    },
    {
      id: "mining",
      label: "Mining",
      iconImage: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop",
      headline: "Proven in the Harshest Environments",
      image: "/images/mining.jpg",
      description:
        "From arctic Canada to the Atacama Desert, Rhino Linings has proven itself in mining's most demanding conditions — reducing unplanned downtime and extending asset lifespan.",
      features: [
        "Chutes, hoppers & pulleys",
        "Conveyor belts & hoods",
        "Chemical containment",
        "Tailings storage facilities",
        "Reduces carry back",
        "Proven abrasive & impact protection",
      ],
      accent: "#F97316",
    },
    {
      id: "marine",
      label: "Marine",
      iconImage: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&h=400&fit=crop",
      headline: "From Dinghies to Commercial Ships",
      image: "/images/custom-sprayon.jpg",
      description:
        "Marine vessels endure sun, wind, water, and constant impact. Our seamless, hygienic linings replace rotten carpets and resist fuel, blood, and salt — protecting everything from ski boats to navy ships.",
      features: [
        "Ski boats & fishing boats",
        "Sailing & motor yachts",
        "Commercial & navy ships",
        "Houseboats & boat trailers",
        "Resists corrosive elements",
        "Easy to clean seamless finish",
      ],
      accent: "#F97316",
    },
    {
      id: "waterproofing",
      label: "Waterproofing",
      iconImage: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=400&fit=crop",
      headline: "Seamless Protection Against Water Ingress",
      image: "/images/waterproofing.jpg",
      description:
        "Our elastomer coatings spray into every nook and cranny, forming a seamless air-and-watertight bond — ideal for rooftops, parking lots, balconies and retaining walls where sheet membranes fall short.",
      features: [
        "Exposed rooftops & parking lots",
        "Bathrooms, kitchens & laundries",
        "Balconies & retaining walls",
        "Highly flexible & low maintenance",
        "Can be tiled over",
        "Rapid installation",
      ],
      accent: "#F97316",
    },
    {
      id: "containment",
      label: "Containment",
      iconImage: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop",
      headline: "Primary & Secondary Containment Solutions",
      image: "/images/containment.jpg",
      description:
        "Our polyurea elastomers eliminate leaks with zero permeability, resist hydrocarbons, and last 60+ years without maintenance — protecting people, the environment and your assets from dangerous spills.",
      features: [
        "Primary & secondary containment",
        "Above and below ground",
        "60+ year lifespan",
        "Hydrocarbon resistant polyurea",
        "No VOCs, environmentally friendly",
        "Tack-free in 15 seconds",
      ],
      accent: "#F97316",
    },
  ];

  const stats = [
    { value: "40+", label: "Years of Innovation" },
    { value: "1983", label: "Trusted Since" },
    { value: "ISO", label: "9001:2015 Certified" },
    { value: "OEM", label: "Approved" },
  ];

  const comparisonRows = [
    { feature: "Slip resistant surface", rhino: true, plastic: false, diy: "partial" },
    { feature: "Nationwide transferable warranty", rhino: true, plastic: "partial", diy: false },
    { feature: "Air- & watertight bond", rhino: true, plastic: false, diy: "partial" },
    { feature: "Won't warp, crack or peel", rhino: true, plastic: false, diy: "partial" },
    { feature: "Adds resale value", rhino: true, plastic: false, diy: false },
    { feature: "Environmentally friendly", rhino: true, plastic: false, diy: false },
    { feature: "Up to 5mm thick protection", rhino: true, plastic: false, diy: false },
  ];

  const businessOptions = [
    {
      title: "Stand-Alone Opportunity",
      icon: "🚀",
      desc: "Starting fresh, post-retirement, or seeking a career change? Rhino Linings provides comprehensive training, equipment and an almost unlimited range of coating applications.",
    },
    {
      title: "Add-On to Existing Business",
      icon: "➕",
      desc: "Already in automotive, construction, mining or oil & gas? Add Rhino Linings as an additional profit stream and cross-sell to your existing customer base.",
    },
    {
      title: "Master Distributor",
      icon: "🌍",
      desc: "Want to develop a country or regional market? Rhino Linings is always open to expanding internationally with local partners who know their market.",
    },
    {
      title: "OEM Partner",
      icon: "🏗️",
      desc: "Manufacturing vehicles, trailers or boats? We've supplied international top-level OEMs at factory level for nearly 15 years with low, high pressure and robotic systems.",
    },
  ];

  return (
    <div
      className="text-white bg-gray-950"
      style={{ fontFamily: "'Barlow Condensed', 'Oswald', sans-serif" }}
    >
      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          src="/videos/rhino-lining.mp4"
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-950" />

        {/* Diagonal orange accent bar */}
        <div
          className="absolute left-0 bottom-0 w-full h-2"
          style={{ background: "linear-gradient(90deg, #F97316, #C2410C)" }}
        />

        <div className="relative z-10 px-6 max-w-5xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              className="w-8 h-0.5 inline-block"
              style={{ background: "#F97316" }}
            />
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#F97316" }}
            >
              Trusted Since 1983 · ISO 9001:2015 Certified
            </span>
            <span
              className="w-8 h-0.5 inline-block"
              style={{ background: "#F97316" }}
            />
          </div>

          <h1
            className="text-6xl md:text-8xl font-black uppercase leading-none mb-2 tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            More Than
          </h1>
          <h1
            className="text-6xl md:text-8xl font-black uppercase leading-none mb-6 tracking-tight"
            style={{
              letterSpacing: "-0.02em",
              WebkitTextStroke: "2px #F97316",
              color: "transparent",
            }}
          >
            Bed Liners
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.01em" }}>
            World-class spray-on polyurethane and polyurea coatings for automotive, industrial,
            mining, marine, waterproofing and containment — engineered to outlast the conditions
            your assets were built for.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="px-10 py-4 font-bold uppercase tracking-widest text-sm transition-all hover:scale-105"
              style={{ background: "#F97316", color: "#000" }}
            >
              Explore Services
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 font-bold uppercase tracking-widest text-sm border-2 transition-all hover:scale-105"
              style={{ borderColor: "#F97316", color: "#F97316" }}
            >
              Get Free Quote
            </Link>
          </div>
        </div>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-8 right-8 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
        >
          {muted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, #F97316, transparent)" }}
          />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ background: "#F97316" }} className="py-4">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-black">{s.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-black/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES TABS ── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F97316" }}>
              What We Do
            </p>
            <h2 className="text-5xl md:text-6xl font-black uppercase leading-none">
              Endless<br />
              <span style={{ color: "#F97316" }}>Possibilities</span>
            </h2>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-10">
            {services.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveService(i)}
                className="px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                style={
                  activeService === i
                    ? { background: "#F97316", color: "#000" }
                    : { background: "#1f2937", color: "#9ca3af", border: "1px solid #374151" }
                }
              >
                {/* <img 
                  src={s.iconImage} 
                  alt={s.label}
                  className="w-6 h-6 rounded object-cover"
                /> */}
                {s.label}
              </button>
            ))}
          </div>

          {/* Active service panel */}
          <div className="grid md:grid-cols-2 gap-0 overflow-hidden" style={{ border: "1px solid #374151" }}>
            {/* Image side */}
            <div className="relative h-72 md:h-auto min-h-64 bg-gray-800 overflow-hidden">
              <img
                src={services[activeService].image}
                alt={services[activeService].label}
                className="w-full h-full object-cover opacity-80 transition-opacity duration-300"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {/* Fallback gradient with icon image */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #111827, #1f2937)" }}
              >
                <img 
                  src={services[activeService].iconImage} 
                  alt={services[activeService].label}
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900 hidden md:block" />
              <div
                className="absolute top-0 left-0 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black"
                style={{ background: "#F97316" }}
              >
                {services[activeService].label}
              </div>
            </div>

            {/* Content side */}
            <div className="p-8 md:p-10 bg-gray-900">
              <h3 className="text-3xl font-black uppercase mb-4 leading-tight">
                {services[activeService].headline}
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed" style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem" }}>
                {services[activeService].description}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {services[activeService].features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span style={{ color: "#F97316", marginTop: "2px", flexShrink: 0 }}>▸</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3 font-bold uppercase tracking-wider text-sm transition-all hover:scale-105"
                style={{ background: "#F97316", color: "#000" }}
              >
                Learn More <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F97316" }}>
              The Rhino Difference
            </p>
            <h2 className="text-4xl md:text-5xl font-black uppercase">
              How Do Other Liners <span style={{ color: "#F97316" }}>Compare?</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#111827" }}>
                  <th className="text-left py-4 px-6 font-bold uppercase tracking-wider text-gray-400">
                    Feature
                  </th>
                  <th className="py-4 px-4 font-black uppercase tracking-wider text-center" style={{ color: "#F97316" }}>
                    Rhino
                  </th>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider text-center text-gray-500">
                    Plastic
                  </th>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider text-center text-gray-500">
                    DIY
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#0f172a" : "#111827",
                      borderBottom: "1px solid #1f2937",
                    }}
                  >
                    <td className="py-3 px-6 text-gray-300">{row.feature}</td>
                    <td className="py-3 px-4 text-center font-bold" style={{ color: "#F97316" }}>✓</td>
                    <td className="py-3 px-4 text-center text-gray-500">
                      {row.plastic === true ? "✓" : row.plastic === "partial" ? "~" : "✗"}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-500">
                      {row.diy === true ? "✓" : row.diy === "partial" ? "~" : "✗"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Decorative background text */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 text-9xl font-black uppercase opacity-5 select-none pointer-events-none"
          style={{ color: "#F97316", letterSpacing: "-0.05em" }}
        >
          RHINO
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#F97316" }}>
              About Rhino Linings
            </p>
            <h2 className="text-5xl md:text-6xl font-black uppercase leading-none mb-8">
              Pioneers &<br />
              <span style={{ color: "#F97316" }}>Leaders</span>
            </h2>
            <p className="text-gray-300 mb-5 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              Rhino Linings pioneered spray-on bed liners in 1983 and has been leading the
              industry for over 40 years. We launched a worldwide industry with spray-on
              polyurethane protection — and today operate across North America, Europe, the
              Middle East, Africa and Australasia.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              Our advanced polyurethane and polyurea technologies provide superior resistance
              against abrasion, corrosion and impact — extending asset lifespan while maintaining
              performance and style. Trusted in military, navy and mining environments — some of
              the most demanding on Earth.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3 font-bold uppercase tracking-wider text-sm transition-all hover:scale-105"
              style={{ background: "#F97316", color: "#000" }}
            >
              Our Story <FaArrowRight />
            </Link>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {  title: "ISO 9001:2015", desc: "Certified quality management across all operations" },
              {  title: "Continuous R&D", desc: "Constantly improving formulations for new applications" },
              {  title: "Global Network", desc: "Master distributors and dealers on every continent" },
              {  title: "Fast Turnaround", desc: "Sets in seconds, ready for traffic in minutes" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 transition-all hover:translate-y-[-4px]"
                style={{ background: "#111827", borderTop: "3px solid #F97316" }}
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-black uppercase text-sm tracking-wider mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUSINESS OPPORTUNITIES ── */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F97316" }}>
              Let's Talk Business
            </p>
            <h2 className="text-5xl md:text-6xl font-black uppercase">
              Join Our <span style={{ color: "#F97316" }}>Network</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto" style={{ fontFamily: "Georgia, serif" }}>
              Studies show up to 90% of franchised businesses succeed after 10 years vs 20% for
              new start-ups. Build on 40 years of proven brand power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessOptions.map((opt, i) => (
              <div
                key={i}
                className="p-8 transition-all hover:translate-y-[-4px] cursor-pointer group"
                style={{ background: "#111827", border: "1px solid #1f2937" }}
              >
                <h3
                  className="font-black uppercase text-sm tracking-wider mb-3 group-hover:text-orange-400 transition-colors"
                  style={{ color: "#e5e7eb" }}
                >
                  {opt.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-10 p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: "#F97316" }}
          >
            <div>
              <h3 className="text-2xl font-black uppercase text-black">Ready to Get Started?</h3>
              <p className="text-black/70 text-sm mt-1">
                Get a free consultation tailored to your business goals.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-10 py-4 font-black uppercase tracking-wider text-sm whitespace-nowrap transition-all hover:scale-105"
              style={{ background: "#000", color: "#F97316" }}
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F97316" }}>
              Get In Touch
            </p>
            <h2 className="text-4xl md:text-5xl font-black uppercase">Contact Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email */}
            <div
              className="p-8 text-center transition-all hover:translate-y-[-4px]"
              style={{ background: "#111827", borderTop: "3px solid #F97316" }}
            >
              <div className="text-3xl mb-4"></div>
              <h3 className="font-black uppercase tracking-wider text-sm mb-1">Email Us</h3>
              <p className="text-gray-500 text-xs mb-6">Response within 24 hours</p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 font-bold uppercase text-xs tracking-wider"
                style={{ background: "#F97316", color: "#000" }}
              >
                Send Message
              </Link>
            </div>

            {/* Phone */}
            <div
              className="p-8 text-center transition-all hover:translate-y-[-4px]"
              style={{ background: "#111827", borderTop: "3px solid #F97316" }}
            >
              <div className="text-3xl mb-4"></div>
              <h3 className="font-black uppercase tracking-wider text-sm mb-1">Call Us</h3>
              <p className="text-gray-500 text-xs mb-6">Speak with our experts</p>
              <a
                href="tel:+254727877651"
                className="inline-flex items-center gap-2 px-6 py-2.5 font-bold uppercase text-xs tracking-wider"
                style={{ background: "#F97316", color: "#000" }}
              >
                +254 727 877 651
              </a>
            </div>

            {/* WhatsApp */}
            <div
              className="p-8 text-center transition-all hover:translate-y-[-4px]"
              style={{ background: "#052e16", borderTop: "3px solid #16a34a" }}
            >
              <div className="text-3xl mb-4"></div>
              <h3 className="font-black uppercase tracking-wider text-sm mb-1">WhatsApp</h3>
              <p className="text-green-700 text-xs mb-6">Chat with us instantly</p>
              <a
                href="https://wa.me/254727877651?text=Hi%2C%20I%27m%20interested%20in%20Rhino%20Linings%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 font-bold uppercase text-xs tracking-wider"
                style={{ background: "#16a34a", color: "#fff" }}
              >
                Chat Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;