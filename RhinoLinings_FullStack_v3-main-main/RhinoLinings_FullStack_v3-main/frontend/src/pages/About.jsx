import { Award, Shield, Target, Users, TrendingUp, Zap, Globe, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageBreadcrumb from "../components/PageBreadcrumb";

export default function About() {
  const coreValues = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Quality First",
      description: "Authentic Rhino Linings products with zero compromise on performance or application standards.",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Precision",
      description: "Meticulous attention to surface preparation and application in every project we undertake.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Customer Focus",
      description: "Your investment is our responsibility — from first enquiry through to warranty support.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Innovation",
      description: "Continuous R&D keeps our applicators equipped with the latest formulations and techniques.",
    },
  ];

  const stats = [
    { number: "1983", label: "Trusted Since" },
    { number: "40+", label: "Years of R&D" },
    { number: "ISO", label: "9001:2015 Certified" },
    { number: "OEM", label: "Approved Globally" },
  ];

  const whyChoose = [
    {
      title: "Certified Professionals",
      description: "Professionally trained Rhino Linings applicators following global best-practice standards on every job.",
    },
    {
      title: "Authentic Products",
      description: "Genuine Rhino Linings polyurethane and polyurea — the same formulations trusted by mining, military and navy operations worldwide.",
    },
    {
      title: "Proven Track Record",
      description: "Thousands of satisfied customers across Kenya and a nationally represented dealer network backing your warranty.",
    },
    {
      title: "Comprehensive Solutions",
      description: "From truck beds to industrial floors, marine vessels to containment tanks — one brand, endless applications.",
    },
    {
      title: "Transferable Warranty",
      description: "Our 3-year warranty is registered against your vehicle and transfers to new owners — not a 'limited lifetime' that expires on sale.",
    },
    {
      title: "Fast Turnaround",
      description: "Sets in seconds, ready for light traffic in minutes. Automotive applications completed in as little as 2–4 hours.",
    },
  ];

  const rhinoDifference = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Built for Kenya's Conditions",
      description:
        "Tested globally from arctic Canada to the Atacama Desert — our coatings are proven for Kenya's dust, heat, heavy loads and demanding terrain.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Superior Technology",
      description:
        "Advanced polyurethane and polyurea chemistry delivering unmatched resistance to abrasion, corrosion, chemical attack and impact damage.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Local Expertise, Global Standards",
      description:
        "Our Kenyan team is trained to international Rhino Linings standards — understanding both local application needs and ISO 9001:2015 quality requirements.",
    },
  ];

  const featureBenefits = [
    { feature: "Fast Application Process", benefit: "Reduced Downtime" },
    { feature: "Hardwearing & Long-Lasting Products", benefit: "Lower Maintenance Costs" },
    { feature: "Acts as Sacrificial Layer", benefit: "Saving in Total Cost of Ownership" },
    { feature: "NVH Reduction & Impact Protection", benefit: "Improved Health & Safety" },
    { feature: "Guards Assets from Abrasion & Impact", benefit: "Extends Asset Lifespan" },
    { feature: "Air- & Watertight Bond", benefit: "Protects Assets from Corrosion" },
  ];

  return (
    <div
      className="pt-20 min-h-screen bg-gray-50 text-gray-900"
      style={{ fontFamily: "'Barlow Condensed', 'Oswald', sans-serif" }}
    >
      <PageBreadcrumb />

      {/* ── HERO ── */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        {/* Background decorative text */}
        <div
          className="absolute inset-0 flex items-center justify-center text-9xl font-black uppercase opacity-5 select-none pointer-events-none"
          style={{ color: "#F97316", letterSpacing: "-0.05em" }}
        >
          RHINO
        </div>
        {/* Orange top accent */}
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
              Trusted Since 1983 · ISO 9001:2015 Certified
            </span>
            <span className="w-8 h-px" style={{ background: "#F97316" }} />
          </div>

          <h1
            className="text-6xl md:text-8xl font-black uppercase leading-none mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            About
          </h1>
          <h1
            className="text-6xl md:text-8xl font-black uppercase leading-none mb-8"
            style={{
              letterSpacing: "-0.02em",
              WebkitTextStroke: "2px #F97316",
              color: "transparent",
            }}
          >
            Rhino Linings
          </h1>
          <p
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Kenya's premier provider of world-class protective coating solutions —
            part of a globally trusted brand that pioneered spray-on polyurethane protection.
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ background: "#F97316" }} className="py-5">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-black">{s.number}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-black/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#F97316" }}>
              Our Story
            </p>
            <h2 className="text-5xl font-black uppercase leading-none mb-8">
              Pioneers &<br />
              <span style={{ color: "#F97316" }}>Leaders</span>
            </h2>
            <div
              className="space-y-5 text-gray-700 leading-relaxed"
              style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem" }}
            >
              <p>
                <strong className="text-gray-900">Rhino Linings Kenya</strong> is your trusted
                partner for premium protective coatings across East Africa. Operating from
                Nairobi, we bring the expertise of a brand that pioneered spray-on bed
                liners in 1983 — and has led the industry for over 40 years since.
              </p>
              <p>
                As an authorised Rhino Linings dealer, we represent a globally trusted name
                with master distributors and dealerships across North America, Europe, the
                Middle East, Africa and Australasia. What began as a revolutionary truck bed
                liner concept has grown into comprehensive protective coating solutions for
                industrial, mining, marine, military and construction applications.
              </p>
              <p>
                We understand the challenges Kenyan vehicle owners and businesses face —
                harsh terrain, extreme weather, heavy loads and demanding work conditions.
                Our coatings are designed to make your assets survive conditions tougher
                than what they were originally built for.
              </p>
              <p>
                From matatus and pickups to cement trucks, mining equipment and industrial
                facilities — we protect the vehicles and machinery that keep Kenya moving.
              </p>
            </div>
          </div>

          {/* Feature–Benefit table */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#F97316" }}>
              Features & Benefits
            </p>
            <h2 className="text-3xl font-black uppercase mb-6">
              Why Our Coatings <span style={{ color: "#F97316" }}>Work</span>
            </h2>
            <div style={{ border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <div
                className="grid grid-cols-2 py-3 px-5 text-xs font-bold uppercase tracking-wider"
                style={{ background: "#F97316", color: "#000" }}
              >
                <span>Feature</span>
                <span>Benefit</span>
              </div>
              {featureBenefits.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 py-3 px-5 text-sm items-center"
                  style={{
                    background: i % 2 === 0 ? "#ffffff" : "#ffffff",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <span className="text-gray-700 pr-4" style={{ fontFamily: "Georgia, serif", fontSize: "0.85rem" }}>
                    {row.feature}
                  </span>
                  <span className="font-bold text-xs uppercase tracking-wide" style={{ color: "#F97316" }}>
                    {row.benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F97316" }}>
              What Drives Us
            </p>
            <h2 className="text-5xl font-black uppercase">
              Core <span style={{ color: "#F97316" }}>Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreValues.map((v, i) => (
              <div
                key={i}
                className="p-8 transition-all hover:translate-y-[-4px]"
                style={{ background: "#ffffff", borderTop: "3px solid #F97316" }}
              >
                <div className="mb-4 text-orange-500">{v.icon}</div>
                <h3 className="font-black uppercase tracking-wider text-sm mb-3">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4">
          <div
            className="p-10"
            style={{ background: "#ffffff", borderLeft: "4px solid #F97316" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#F97316" }}>
              Mission
            </p>
            <h2 className="text-3xl font-black uppercase mb-5">Our Mission</h2>
            <p
              className="text-gray-700 leading-relaxed"
              style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem" }}
            >
              To provide Kenya and East Africa with the highest-quality protective coating
              solutions through expert application, superior products, and exceptional customer
              service — protecting the vehicles, equipment, and investments that drive Kenya's
              economy and development.
            </p>
          </div>

          <div
            className="p-10"
            style={{ background: "#ffffff", borderLeft: "4px solid #6b7280" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">
              Vision
            </p>
            <h2 className="text-3xl font-black uppercase mb-5">Our Vision</h2>
            <p
              className="text-gray-700 leading-relaxed"
              style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem" }}
            >
              To be East Africa's most trusted name in protective coatings — recognised across
              Kenya and beyond for expertise, quality, and innovation. We envision every Kenyan
              vehicle and piece of equipment protected by world-class Rhino Linings technology,
              from Nairobi's construction sites to the agricultural heartlands.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F97316" }}>
              The Rhino Advantage
            </p>
            <h2 className="text-5xl font-black uppercase">
              Why Choose <span style={{ color: "#F97316" }}>Us?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChoose.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 transition-all hover:translate-y-[-2px]"
                style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
              >
                <div className="flex-shrink-0 mt-1" style={{ color: "#F97316" }}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black uppercase text-sm tracking-wider mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE RHINO DIFFERENCE ── */}
      <section className="px-6 py-20 bg-white relative overflow-hidden">
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 text-9xl font-black uppercase opacity-5 select-none pointer-events-none"
          style={{ color: "#F97316" }}
        >
          1983
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#F97316" }}>
              What Sets Us Apart
            </p>
            <h2 className="text-5xl font-black uppercase">
              The Rhino <span style={{ color: "#F97316" }}>Difference</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {rhinoDifference.map((item, i) => (
              <div
                key={i}
                className="p-8 transition-all hover:translate-y-[-4px]"
                style={{ background: "#ffffff", borderTop: "3px solid #F97316" }}
              >
                <div className="mb-4 text-orange-500">{item.icon}</div>
                <h3 className="font-black uppercase tracking-wider text-sm mb-3">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FRANCHISE QUALITY BADGES ── */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { top: "TRUSTED", bottom: "SINCE 1983" },
              { top: "3 YEAR", bottom: "WARRANTY" },
              { top: "OEM", bottom: "APPROVED" },
              { top: "ISO 9001", bottom: "CERTIFIED" },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-6 px-4 text-center"
                style={{ border: "2px solid #e5e7eb" }}
              >
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
                  {badge.top}
                </div>
                <div
                  className="text-sm font-black uppercase tracking-wider"
                  style={{ color: "#F97316" }}
                >
                  {badge.bottom}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20" style={{ background: "#ffffff" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#F97316" }}>
            Ready to Get Started?
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
            Protect Your <span style={{ color: "#F97316" }}>Investment</span>
          </h2>
          <p
            className="text-gray-400 mb-10 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Join thousands of Kenyan businesses and vehicle owners who trust Rhino Linings
            for superior, long-lasting protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-10 py-4 font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
              style={{ background: "#F97316", color: "#000" }}
            >
              Get Free Quote
            </Link>
            <Link
              to="/services"
              className="px-10 py-4 font-black uppercase tracking-widest text-sm border-2 transition-all hover:scale-105"
              style={{ borderColor: "#F97316", color: "#F97316" }}
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}