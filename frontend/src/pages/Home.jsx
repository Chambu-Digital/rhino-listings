import { useRef, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

// Import local images for service icons
import automotiveIcon from "../assets/images/truckliners.jpeg";
import industrialIcon from "../assets/images/image3.jpeg";
import miningIcon from "../assets/images/images.jpeg";
import marineIcon from "../assets/images/end-product.jpeg";
import waterproofingIcon from "../assets/images/image3.jpeg";
import containmentIcon from "../assets/images/images.jpeg";

const Home = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [banner, setBanner] = useState(null);
  const videoRef = useRef(null);

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        // Add cache-busting timestamp to force fresh data
        const timestamp = new Date().getTime();
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/banner/active?t=${timestamp}`, {
          cache: 'no-store', // Disable caching
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await response.json();
        setBanner(data);
        console.log('Banner fetched:', data); // Debug log
      } catch (error) {
        console.error('Error fetching banner:', error);
      }
    };
    fetchBanner();
  }, []);

  // Video URL - use banner data or fallback (recompute when banner changes)
  const videoUrl = useMemo(() => {
    if (banner?.videoUrl) {
      console.log('Using banner video:', banner.videoUrl.substring(0, 50) + '...'); // Debug log
      return banner.videoUrl;
    }
    if (import.meta.env.VITE_HERO_VIDEO_URL) {
      return import.meta.env.VITE_HERO_VIDEO_URL;
    }
    try {
      return new URL('../assets/images/hero-bg-video-compressed.mp4', import.meta.url).href;
    } catch {
      return '/videos/hero-bg-video.mp4';
    }
  }, [banner]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset video when URL changes
  useEffect(() => {
    if (videoRef.current) {
      setVideoLoaded(false);
      setVideoError(false);
      videoRef.current.load(); // Force reload
    }
  }, [videoUrl]);

  // Set video to play middle section only (avoiding watermarks)
  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      const video = videoRef.current;
      
      // Wait for metadata to load
      const handleLoadedMetadata = () => {
        const duration = video.duration;
        const startTime = duration * 0.15; // Start at 15% of video
        const endTime = duration * 0.85;   // End at 85% of video
        
        // Set initial start time
        video.currentTime = startTime;
        
        // Loop only the middle section
        const handleTimeUpdate = () => {
          if (video.currentTime >= endTime) {
            video.currentTime = startTime;
          }
        };
        
        video.addEventListener('timeupdate', handleTimeUpdate);
        
        return () => {
          video.removeEventListener('timeupdate', handleTimeUpdate);
        };
      };

      if (video.readyState >= 1) {
        // Metadata already loaded
        handleLoadedMetadata();
      } else {
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        return () => {
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
      }
    }
  }, [videoLoaded]);

  const services = [
    {
      id: "automotive",
      label: "Automotive",
      iconImage: automotiveIcon,
      headline: "Protect Your Vehicle Investment",
      image: "/images/vehicle-before-after.jpeg",
      description:
        "Our spray-on bed liners are custom-sprayed to fit each vehicle's unique contours. Applied in 2–4 hours, your vehicle is ready the same day — backed by a 3-year transferable warranty.",
      features: [
        "100% polyurethane protection",
        "Slip-resistant textured finish",
        "Air- & watertight bond prevents rust",
        "Increases resale value",
      ],
      accent: "#F97316",
    },
    {
      id: "industrial",
      label: "Industrial",
      iconImage: industrialIcon,
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
    // {
    //   id: "mining",
    //   label: "Mining",
    //   iconImage: miningIcon,
    //   headline: "Proven in the Harshest Environments",
    //   image: "/images/mining.jpg",
    //   description:
    //     "From arctic Canada to the Atacama Desert, Rhino Linings has proven itself in mining's most demanding conditions — reducing unplanned downtime and extending asset lifespan.",
    //   features: [
    //     "Chutes, hoppers & pulleys",
    //     "Conveyor belts & hoods",
    //     "Chemical containment",
    //     "Tailings storage facilities",
    //     "Reduces carry back",
    //     "Proven abrasive & impact protection",
    //   ],
    //   accent: "#F97316",
    // },
    // {
    //   id: "marine",
    //   label: "Marine",
    //   iconImage: marineIcon,
    //   headline: "From Dinghies to Commercial Ships",
    //   image: "/images/custom-sprayon.jpg",
    //   description:
    //     "Marine vessels endure sun, wind, water, and constant impact. Our seamless, hygienic linings replace rotten carpets and resist fuel, blood, and salt — protecting everything from ski boats to navy ships.",
    //   features: [
    //     "Ski boats & fishing boats",
    //     "Sailing & motor yachts",
    //     "Commercial & navy ships",
    //     "Houseboats & boat trailers",
    //     "Resists corrosive elements",
    //     "Easy to clean seamless finish",
    //   ],
    //   accent: "#F97316",
    // },
    {
      id: "waterproofing",
      label: "Waterproofing",
      iconImage: waterproofingIcon,
      headline: "Seamless Protection Against Water Ingress",
      image: "/images/end-product.jpeg",
      description:
        "Our elastomer coatings spray into every nook and cranny, forming a seamless air-and-watertight bond — ideal for rooftops, parking lots, balconies and retaining walls where sheet membranes fall short.",
      features: [
        "Exposed rooftops & parking lots",
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
      iconImage: containmentIcon,
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
    { feature: "Air- & watertight bond", rhino: true, plastic: false, diy: "partial" },
    { feature: "Won't warp, crack or peel", rhino: true, plastic: false, diy: "partial" },
    { feature: "Adds resale value", rhino: true, plastic: false, diy: false },
    { feature: "Environmentally friendly", rhino: true, plastic: false, diy: false },
    { feature: "Up to 5mm thick protection", rhino: true, plastic: false, diy: false },
  ];

  const businessOptions = [
    {
      title: "Stand-Alone Opportunity",
      desc: "Starting fresh, post-retirement, or seeking a career change? Rhino Linings provides comprehensive training, equipment and an almost unlimited range of coating applications.",
    },
    {
      title: "Add-On to Existing Business",
      desc: "Already in automotive, construction, mining or oil & gas? Add Rhino Linings as an additional profit stream and cross-sell to your existing customer base.",
    },
    {
      title: "Master Distributor",
      desc: "Want to develop a country or regional market? Rhino Linings is always open to expanding internationally with local partners who know their market.",
    },
    {
      title: "OEM Partner",
      desc: "Manufacturing vehicles, trailers or boats? We've supplied international top-level OEMs at factory level for nearly 15 years with low, high pressure and robotic systems.",
    },
  ];

  return (
    <div
      className="text-white bg-gray-950"
      style={{ fontFamily: "'Barlow Condensed', 'Oswald', sans-serif" }}
    >
      {/* ── HERO ── */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Fallback background if video doesn't load */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80')",
            opacity: videoError || !videoLoaded ? 1 : 0,
            transition: 'opacity 1s'
          }}
        />
        
        {/* Loading indicator */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <div
                className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: "#F97316", borderTopColor: "transparent" }}
              />
              <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">
                Loading video...
              </p>
            </div>
          </div>
        )}
        
        <video
          key={videoUrl}
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !videoError ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedData={() => {
            console.log('Video loaded successfully');
            setVideoLoaded(true);
            setVideoError(false);
          }}
          onError={(e) => {
            console.error('Video failed to load:', e);
            setVideoError(true);
            setVideoLoaded(false);
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
              className="text-3xl font-bold tracking-widest uppercase"
              style={{ color: "#F97316" }}
            >
              RHINO LININGS 
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
            style={{ letterSpacing: "-0.02em", color: "#F97316" }}
          >
            Bed Liners
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.01em" }}>
            World class spray-on polyurethane and polyurea coatings for automotive, industrial,
            mining, marine, waterproofing and containment engineered to outlast the conditions
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

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, #F97316, transparent)" }}
          />
        </div> */}
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ background: "#F97316" }} className="py-4">
        {/* <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-black">{s.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-black/70">{s.label}</div>
            </div>
          ))}
        </div> */}
      </div>

      {/* ── SERVICES CAROUSEL ── */}
      <section id="services" className="py-16 bg-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F97316" }}>
              Our Services
            </p>
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-none">
              Endless<br />
              <span style={{ color: "#F97316" }}>Possibilities</span>
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Main Carousel */}
            <div className="overflow-hidden rounded-lg" style={{ border: "2px solid #1f2937" }}>
              <div className="relative h-[400px]">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === activeService
                        ? "opacity-100 translate-x-0"
                        : index < activeService
                        ? "opacity-0 -translate-x-full"
                        : "opacity-0 translate-x-full"
                    }`}
                  >
                    {/* Full Image Background */}
                    <div className="relative h-full group cursor-pointer" onClick={() => window.location.href = '/services'}>
                      <img
                        src={service.iconImage}
                        alt={service.label}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Subtle Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Minimal Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-between p-6">
                        {/* Top: Service Badge */}
                        <div className="flex justify-between items-start">
                          <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-black backdrop-blur-sm"
                            style={{ background: "#F97316" }}
                          >
                            {service.label}
                          </div>
                          
                          {/* Service Number */}
                          <div className="text-6xl md:text-7xl font-black opacity-10" style={{ color: "#F97316" }}>
                            0{index + 1}
                          </div>
                        </div>

                        {/* Bottom: Title & CTA */}
                        <div className="transform transition-all duration-300 group-hover:translate-y-[-10px]">
                          <h3 className="text-2xl md:text-3xl font-black uppercase mb-3 leading-tight">
                            {service.headline}
                          </h3>

                          <Link
                            to="/services"
                            className="inline-flex items-center gap-2 px-6 py-2.5 font-bold uppercase tracking-wider text-xs transition-all hover:scale-105"
                            style={{ background: "#F97316", color: "#000" }}
                          >
                            Learn More →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setActiveService((prev) => (prev === 0 ? services.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 z-20 text-xl font-bold backdrop-blur-sm"
              style={{ background: "rgba(249, 115, 22, 0.9)", color: "#000" }}
            >
              ‹
            </button>
            <button
              onClick={() => setActiveService((prev) => (prev === services.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 z-20 text-xl font-bold backdrop-blur-sm"
              style={{ background: "rgba(249, 115, 22, 0.9)", color: "#000" }}
            >
              ›
            </button>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveService(index)}
                  className="transition-all"
                  style={{
                    width: activeService === index ? "32px" : "10px",
                    height: "10px",
                    borderRadius: "5px",
                    background: activeService === index ? "#F97316" : "#374151",
                  }}
                />
              ))}
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
      <section id="about" className="py-24 bg-gray-900 relative overflow-hidden">
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
              Our Story
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