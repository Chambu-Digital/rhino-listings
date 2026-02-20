import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaVolumeMute, FaVolumeUp, FaPhone, FaArrowRight } from "react-icons/fa";

const Home = () => {
  const [muted, setMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const toggleMute = () => {
    setMuted(!muted);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const services = [
    {
      title: "Truck Linings",
      image: "/images/vehicle-before-after.jpg",
      description: "Advanced polyurethane coatings that shield your truck beds from impact, corrosion, and abrasion.",
      features: [
        "Prevents rust & scratches",
        "UV & chemical resistant",
        "Custom textures & colors",
        "Lifetime warranty available"
      ]
    },
    {
      title: "Industrial Coatings",
      image: "/images/industrial-coating.jpg",
      description: "High-performance coatings for industrial floors, machinery, and heavy equipment to resist wear and harsh conditions.",
      features: [
        "Factory floors & pipelines",
        "Machinery & construction gear",
        "Long-lasting performance",
        "Sound proofing solutions"
      ]
    },
    {
      title: "Custom Spray-Ons",
      image: "/images/custom-sprayon.jpg",
      description: "Aesthetic and functional coatings tailored for marine, agricultural, architectural, and specialty applications.",
      features: [
        "Marine & agricultural surfaces",
        "Architectural finishes",
        "Custom protective solutions",
        "Specialty applications"
      ]
    }
  ];

  const whyChooseUs = [
    { title: "Premium Quality", desc: "Industry-leading products from a globally trusted brand" },
    { title: "Expert Team", desc: "Certified professionals with years of experience" },
    { title: "Proven Results", desc: "Thousands of satisfied customers across Kenya" },
    { title: "Fast Service", desc: "Quick turnaround without compromising quality" }
  ];

  return (
    <div className="text-gray-900 bg-white">
      {/* Hero Section */}
      <section id="home" className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Video Background */}
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

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Rhino Linings Kenya
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Premium spray-on protective coatings for vehicles, industrial, and commercial
            surfaces built for durability, performance, and style.
          </p>
          
          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/services"
              className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Our Services</span>
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-transparent border-2 border-yellow-500 text-yellow-500 font-semibold rounded-lg hover:bg-yellow-500 hover:text-black transition-all"
            >
              Get Free Quote
            </Link>
          </div>
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-8 right-8 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </button>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Our Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional protective coatings engineered for durability, performance, and style
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Image with Overlay */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Service Number Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-yellow-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features as Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 text-yellow-600 font-semibold hover:text-yellow-700 transition-colors group/link"
                  >
                    <span>View More</span>
                    <FaArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              About Us
            </h2>
          </div>

          {/* About Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-4">
              <p className="text-lg text-gray-300">
                At <span className="text-yellow-500 font-semibold">Rhino Linings Kenya</span>,
                we are dedicated to delivering world-class protective coatings and surface
                solutions for vehicles, machinery, and equipment.
              </p>
              <p className="text-gray-400">
                As part of the globally renowned Rhino Linings brand, we uphold the highest 
                standards of innovation, precision, and reliability. Our advanced polyurethane 
                and polyurea spray-on technologies provide superior resistance against abrasion, 
                corrosion, and impact.
              </p>
              <p className="text-gray-400">
                We extend lifespan while maintaining performance and style. Trusted by industries 
                worldwide, we bring that same proven quality to Kenya and beyond.
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  <span>Our Story</span>
                  <FaArrowRight />
                </Link>
              </div>
            </div>

            {/* Why Choose Us Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-3">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
              Contact Us
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Have questions or need a quote? We're here to help
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Email Card */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900">Email Us</h3>
              <p className="text-gray-500 mb-4 text-sm">
                Response within 24 hours
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
              >
                <span>Send Message</span>
              </Link>
            </div>

            {/* Phone Card */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaPhone className="text-yellow-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900">Call Us</h3>
              <p className="text-gray-500 mb-4 text-sm">
                Speak with our experts
              </p>
              <a
                href="tel:+254727877651"
                className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors text-sm"
              >
                <span>+254 727 877 651</span>
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-green-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900">WhatsApp</h3>
              <p className="text-gray-500 mb-4 text-sm">
                Chat with us instantly
              </p>
              <a
                href="https://wa.me/254727877651?text=Hi%2C%20I%27m%20interested%20in%20Rhino%20Linings%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Chat Now</span>
              </a>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Get a free consultation and quote tailored to your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="px-6 py-2.5 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Get Free Quote</span>
              </Link>
              <Link
                to="/services"
                className="px-6 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 inline-flex items-center justify-center gap-2"
              >
                <span>View Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
