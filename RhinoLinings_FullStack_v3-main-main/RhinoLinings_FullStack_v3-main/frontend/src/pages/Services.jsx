import { CheckCircle, Truck, Factory, Shield, Anchor, Tractor, Building2, Waves, ArrowRight, DollarSign, Calendar } from "lucide-react";
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
      // User is logged in, go to dashboard with service
      localStorage.setItem('selectedServiceForQuote', JSON.stringify(service));
      navigate('/user');
      toast.success(`Getting quote for ${serviceName}`);
    } else {
      // User not logged in, save service and redirect to register
      localStorage.setItem('selectedServiceForQuote', JSON.stringify(service));
      localStorage.setItem('returnPath', '/user');
      navigate('/register');
      toast.info('Please create an account to get a quote');
    }
  };

  const handleBookNow = (service) => {
    const serviceName = service.name || service.title;
    if (user) {
      // User is logged in, go to dashboard with service
      localStorage.setItem('selectedServiceForBooking', JSON.stringify(service));
      navigate('/user');
      toast.success(`Booking ${serviceName}`);
    } else {
      // User not logged in, save service and redirect to register
      localStorage.setItem('selectedServiceForBooking', JSON.stringify(service));
      localStorage.setItem('returnPath', '/user');
      navigate('/register');
      toast.info('Please create an account to book this service');
    }
  };

  // Fallback hardcoded services if API fails or returns empty
  const fallbackServices = [
    {
      _id: 'fallback-1',
      name: "Truck Bed Liners",
      title: "Truck Bed Liners",
      category: "Vehicle Coating",
      image: "/images/vehicle-before-after.jpg",
      description: "Industry-leading spray-on bedliners for ultimate truck bed protection.",
      basePrice: 25000,
      estimatedDuration: "2-3 hours"
    },
    {
      _id: 'fallback-2',
      name: "Industrial Coatings",
      title: "Industrial Coatings",
      category: "Industrial",
      image: "/images/industrial-coating.jpg",
      description: "Heavy-duty coatings for harsh industrial environments.",
      basePrice: 50000,
      estimatedDuration: "1-2 days"
    },
    {
      _id: 'fallback-3',
      name: "Vehicle Protection",
      title: "Vehicle Protection",
      icon: <Shield className="w-6 h-6" />,
      category: "Vehicle Coating",
      image: "/images/custom-sprayon.jpg",
      description: "Complete vehicle protection beyond bed liners.",
      basePrice: 35000,
      estimatedDuration: "3-4 hours"
    }
  ];

  // Use API services if available, otherwise use fallback
  const displayServices = services.length > 0 ? services : fallbackServices;

  // Icon mapping for categories
  const getIconForCategory = (category) => {
    const iconMap = {
      'vehicle': <Truck className="w-6 h-6" />,
      'Vehicle Coating': <Truck className="w-6 h-6" />,
      'industrial': <Factory className="w-6 h-6" />,
      'Industrial': <Factory className="w-6 h-6" />,
      'protection': <Shield className="w-6 h-6" />,
      'marine': <Anchor className="w-6 h-6" />,
      'agricultural': <Tractor className="w-6 h-6" />,
      'commercial': <Building2 className="w-6 h-6" />,
      'Commercial': <Building2 className="w-6 h-6" />,
      'waterproofing': <Waves className="w-6 h-6" />
    };
    return iconMap[category] || <Shield className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      
      {/* Page Breadcrumb Navigation */}
      <PageBreadcrumb />
      
      {/* Hero Section - Simplified */}
      <section className="px-6 py-12 text-center bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Premium protective coatings for every need
          </p>
       
        </div>
      </section>

      {/* Services Grid - Cleaner Cards */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service, index) => (
              <div
                key={service._id || index}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.imageUrl || service.image || "/images/vehicle-before-after.jpg"}
                    alt={service.name || service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/images/vehicle-before-after.jpg";
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    {service.category || 'Premium'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">
                      {service.name || service.title}
                    </h3>
                    {/* <div className="text-yellow-600">
                      {service.icon || getIconForCategory(service.category)}
                    </div> */}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Price & Duration */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-gray-900">
                        KES {(service.basePrice || 25000).toLocaleString()}
                      </p>
                    </div>
                    {service.estimatedDuration && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium text-gray-700">{service.estimatedDuration}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGetQuote(service)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Get Quote
                    </button>
                    <button
                      onClick={() => handleBookNow(service)}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
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

      {/* Specialty Services */}
      {/* <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Specialty Applications</h2>
            <p className="text-gray-600">Custom protective coating solutions for unique needs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialtyServices.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-yellow-500 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-black">{service.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {service.description}
                </p>
                <div className="space-y-1">
                  {service.examples.map((example, idx) => (
                    <div key={idx} className="text-xs text-gray-500">
                      • {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section - Simplified */}
      <section className="px-6 py-16 bg-gradient-to-r from-yellow-200 to-orange-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Ready to Get Started?
          </h2>
          <p className="text-gray-800 mb-8 text-lg">
            {user ? 'Select a service above to get your quote' : 'Create an account to get instant quotes and book services'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 text-lg"
                >
                  <span>Create Account</span>
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <Link
                to="/user"
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 text-lg"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}