import { Award, Shield, Target, Users, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import PageBreadcrumb from "../components/PageBreadcrumb";

export default function About() {
  const values = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality First",
      description: "Premium Rhino Linings products with no compromises"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision",
      description: "Meticulous attention to detail in every application"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Focus",
      description: "Your satisfaction is our top priority"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Innovation",
      description: "Latest coating technologies and methods"
    }
  ];

  const stats = [
    { number: "30+", label: "Years Experience" },
    { number: "5000+", label: "Projects Done" },
    { number: "98%", label: "Satisfaction" },
    { number: "100%", label: "Quality" }
  ];

  const whyChoose = [
    {
      title: "Certified Professionals",
      description: "Certified Rhino Linings technicians with extensive training and experience."
    },
    {
      title: "Premium Products",
      description: "Authentic Rhino Linings products, trusted worldwide for superior quality."
    },
    {
      title: "Proven Track Record",
      description: "Thousands of satisfied customers across Kenya trust us."
    },
    {
      title: "Comprehensive Solutions",
      description: "Complete protective coating solutions for any application."
    },
    {
      title: "Warranty Protection",
      description: "All work backed by comprehensive warranties for peace of mind."
    },
    {
      title: "Fast Turnaround",
      description: "Efficient service without compromising quality."
    }
  ];

  const difference = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Built for Kenya's Conditions",
      description: "Solutions tested globally but tailored for Kenya's unique terrain, climate, and demanding work environments."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Superior Technology",
      description: "Advanced polyurethane chemistry providing unmatched protection against Kenya's dust, heat, and heavy-duty use."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Local Expertise, Global Standards",
      description: "Kenyan team trained to international Rhino Linings standards, understanding both local needs and global quality."
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      
      <PageBreadcrumb />
      
      {/* Hero Section */}
      <section className="px-6 py-16 text-center bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-4">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Rhino Linings Kenya
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kenya's premier provider of world-class protective coating solutions
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <span className="font-semibold text-gray-900">Rhino Linings Kenya</span> is your trusted partner for premium protective coatings across East Africa. Operating from our facility in Karen, Nairobi, we bring over three decades of global Rhino Linings expertise to serve Kenya's unique needs—from the dusty roads of the Rift Valley to the humid coastal climate of Mombasa.
            </p>
            <p>
              As an authorized dealer of Rhino Linings products, we represent a brand that has been the global industry leader in spray-on polyurethane and polyurea coatings since 1988. What started as a revolutionary truck bed liner solution has evolved into comprehensive protective coating applications used worldwide.
            </p>
            <p>
              We understand the challenges Kenyan vehicle owners and businesses face—harsh terrain, extreme weather, heavy loads, and demanding work conditions. That's why we're committed to providing solutions specifically designed to withstand Kenya's toughest environments while delivering exceptional value and performance.
            </p>
            <p>
              From matatus and pickups to construction equipment and industrial facilities, we protect the vehicles and machinery that keep Kenya moving forward.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Our Core Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200"
              >
                
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-8 border border-yellow-200">
           
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To provide Kenya and East Africa with the highest quality protective coating solutions through expert application, superior products, and exceptional customer service. We're committed to protecting what matters most—the vehicles, equipment, and investments that drive Kenya's economy and development.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
           
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To be East Africa's most trusted name in protective coatings, recognized across Kenya and beyond for our expertise, quality, and innovation. We envision every Kenyan vehicle and piece of equipment protected by world-class Rhino Linings technology—from Nairobi's construction sites to the agricultural heartlands.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Why Choose Us?</h2>
            <p className="text-gray-600">What sets us apart from the competition</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, index) => (
              <div key={index} className="flex gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-yellow-500 flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Rhino Linings Difference */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">The Rhino Linings Difference</h2>
            <p className="text-gray-600">What makes our solutions stand out</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {difference.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200"
              >
                
                <h3 className="text-lg font-bold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-gray-400 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Protect Your Investment?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of Kenyan businesses and vehicle owners who trust Rhino Linings for superior protection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center justify-center gap-2"
            >
              Get Free Quote
            </Link>
            <Link
              to="/services"
              className="px-8 py-3 bg-white/10 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}