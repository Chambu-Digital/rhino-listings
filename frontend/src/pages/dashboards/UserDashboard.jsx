import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { 
  Calendar, Car, CheckCircle, Clock, DollarSign, 
  MessageSquare, Package, XCircle, ArrowRight, 
  TrendingUp, Search, Sparkles, Send
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../services/api";
import { getCurrentUser } from "../../services/authService";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [vehicles, setVehicles] = useState({ types: [], brands: [], models: [], years: [] });
  const [selectedVehicle, setSelectedVehicle] = useState({ type: "", brand: "", model: "", year: "" });
  const [quotation, setQuotation] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [serviceType, setServiceType] = useState("vehicle");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedQuoteForBooking, setSelectedQuoteForBooking] = useState(null);
  const [bookingNotes, setBookingNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quoteStep, setQuoteStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user info
    const user = getCurrentUser();
    setCurrentUser(user);
    
    fetchVehicles();
    fetchBookings();
    fetchQuotations();
    fetchMessages();
    fetchServices();

    // Check for pre-selected service from Services page
    const selectedForQuote = localStorage.getItem('selectedServiceForQuote');
    const selectedForBooking = localStorage.getItem('selectedServiceForBooking');
    
    if (selectedForQuote) {
      const service = JSON.parse(selectedForQuote);
      const serviceName = service.name || service.title;
      setSelectedServices([service._id]);
      setActiveTab('quotation');
      localStorage.removeItem('selectedServiceForQuote');
      toast.success(`Getting quote for ${serviceName}`);
    } else if (selectedForBooking) {
      const service = JSON.parse(selectedForBooking);
      const serviceName = service.name || service.title;
      setSelectedServiceForBooking(service);
      setServiceType('custom');
      setBookingDate(dayjs().add(1, 'day').format("YYYY-MM-DD"));
      setActiveTab('book');
      localStorage.removeItem('selectedServiceForBooking');
      toast.success(`Booking ${serviceName}`);
    }
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await API.get("/vehicles/types");
      setVehicles((prev) => ({ ...prev, types: res.data }));
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const fetchBrands = async (type) => {
    try {
      const res = await API.get(`/vehicles/brands/${type}`);
      setVehicles((prev) => ({ ...prev, brands: res.data, models: [], years: [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModels = async (brand) => {
    try {
      const res = await API.get(`/vehicles/models/${brand}`);
      setVehicles((prev) => ({ ...prev, models: res.data, years: [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchYears = async (model) => {
    try {
      const res = await API.get(`/vehicles/years/${model}`);
      setVehicles((prev) => ({ ...prev, years: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/services");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchQuotations = async () => {
    try {
      const res = await API.get("/quotations");
      setQuotations(res.data);
    } catch (err) {
      console.error("Error fetching quotations:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages");
      const data = Array.isArray(res.data) ? res.data : res.data?.messages || [];
      setMessages(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Error loading messages:", err);
      setMessages([]);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await API.get("/service-management");
      setServices(res.data.filter(s => s.isActive));
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const handleQuotation = async () => {
    if (!selectedVehicle.type || !selectedVehicle.brand || !selectedVehicle.model || !selectedVehicle.year) {
      toast.error("Please select all vehicle details");
      return;
    }

    try {
      const res = await API.post("/quotations", {
        ...selectedVehicle,
        services: selectedServices
      });
      const quoteData = res.data.quotation || res.data;
      setQuotation(quoteData);
      setPriceBreakdown(res.data.breakdown);
      setShowQuotationModal(true);
      toast.success("Quotation generated and saved!");
      fetchQuotations();
      setSelectedServices([]); // Reset selected services
      setEstimatedPrice(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate quotation");
    }
  };

  // Send quote to admin for follow-up
  const handleSendQuoteToAdmin = async (quote) => {
    try {
      await API.post("/messages", {
        text: `Quote Request: ${quote.vehicleInfo} - KES ${(quote.estimatedCost || quote.totalAmount).toLocaleString()}. Please contact me for booking.`,
        sender: "user",
        requestId: quote._id,
        quotationId: quote._id
      });
      toast.success("Quote sent to admin for follow-up!");
    } catch (err) {
      toast.error("Failed to send quote to admin");
    }
  };

  // Calculate estimated price in real-time
  const calculateEstimatedPrice = async () => {
    if (!selectedVehicle.year) return;

    try {
      const res = await API.post("/quotations", {
        ...selectedVehicle,
        services: selectedServices
      });
      setEstimatedPrice(res.data.quotation.totalAmount || res.data.quotation.estimatedCost);
      setPriceBreakdown(res.data.breakdown);
    } catch (err) {
      console.error("Price estimation error:", err);
    }
  };

  // Update estimated price when selections change
  useEffect(() => {
    if (selectedVehicle.year) {
      const timer = setTimeout(() => {
        calculateEstimatedPrice();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedVehicle, selectedServices]);

  const handleBookFromQuotation = async (quote) => {
    try {
      await API.post("/services", {
        date: dayjs().add(1, 'day').format("YYYY-MM-DD"),
        serviceType: "vehicle",
        quotation: quote._id,
      });
      toast.success("Service booked successfully!");
      setShowQuotationModal(false);
      setQuotation(null);
      fetchBookings();
      setTimeout(() => setActiveTab("bookings"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  const handleBookWithQuote = (quote) => {
    setSelectedQuoteForBooking(quote);
    setServiceType("vehicle");
    setBookingDate(dayjs().add(1, 'day').format("YYYY-MM-DD"));
    setActiveTab("book");
    toast.info("Quote selected! Choose your preferred date");
  };

  const handlePayment = async (bookingId) => {
    try {
      await API.post(`/services/${bookingId}/pay`, { bookingId });
      toast.success("Payment initiated!");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await API.put(`/services/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  const handleDirectBooking = async () => {
    if (!bookingDate) {
      toast.error("Please select a date!");
      return;
    }
    try {
      const bookingData = {
        date: bookingDate,
        serviceType,
        quotation: selectedQuoteForBooking?._id || null,
      };
      
      if (bookingNotes.trim()) {
        bookingData.notes = bookingNotes;
      }
      
      await API.post("/services", bookingData);
      toast.success(`Service booked successfully!`);
      fetchBookings();
      setBookingDate("");
      setBookingNotes("");
      setSelectedQuoteForBooking(null);
      setTimeout(() => setActiveTab("bookings"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      await API.post("/messages", {
        text: messageText,
        sender: "user",
        requestId: selectedBooking?._id || null,
      });
      setMessageText("");
      fetchMessages();
      toast.success("Message sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-amber-50 text-amber-700 border-amber-200",
      "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
      Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Completed: "bg-green-50 text-green-700 border-green-200",
      Cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <Clock className="w-3.5 h-3.5" />,
      "In Progress": <Package className="w-3.5 h-3.5" />,
      Paid: <DollarSign className="w-3.5 h-3.5" />,
      Completed: <CheckCircle className="w-3.5 h-3.5" />,
      Cancelled: <XCircle className="w-3.5 h-3.5" />,
    };
    return icons[status] || <Clock className="w-3.5 h-3.5" />;
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      booking.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dayjs(booking.date).format("MMMM DD, YYYY").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats calculations
  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === "In Progress").length,
    completed: bookings.filter(b => b.status === "Completed").length,
    pending: bookings.filter(b => b.status === "Pending").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Welcome back, {currentUser?.name || currentUser?.email || 'User'}!
              </p>
            </div>
            <Button 
              onClick={() => setActiveTab("quotation")}
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              <span className="hidden sm:inline">Get Quote</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {[
              { id: "overview", label: "Overview" },
              { id: "services", label: "Services" },
              { id: "quotation", label: "Get Quote" },
              { id: "book", label: "Book" },
              { id: "bookings", label: "My Bookings" },
              { id: "messages", label: "Messages" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-yellow-600 border-yellow-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl pb-12">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Total", value: stats.total, color: "blue", icon: Package },
                { label: "Active", value: stats.active, color: "yellow", icon: TrendingUp },
                { label: "Completed", value: stats.completed, color: "green", icon: CheckCircle },
                { label: "Pending", value: stats.pending, color: "amber", icon: Clock },
              ].map((stat) => (
                <Card key={stat.label} className="border-0 shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      {/* <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                        <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}-600`} />
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => setActiveTab("quotation")}
                    className="p-2.5 sm:p-3 text-left rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
                  >
                    <p className="text-xs sm:text-sm font-medium text-gray-900">New Quote</p>
                    <p className="text-xs text-gray-500">Get pricing</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("book")}
                    className="p-2.5 sm:p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-1" />
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Book Service</p>
                    <p className="text-xs text-gray-500">Schedule now</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className="p-2.5 sm:p-3 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-1" />
                    <p className="text-xs sm:text-sm font-medium text-gray-900">Support</p>
                    <p className="text-xs text-gray-500">Get help</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity - Compact */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                  {bookings.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveTab("bookings")}
                      className="text-yellow-600 hover:text-yellow-700 text-xs sm:text-sm"
                    >
                      View all
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 mx-auto mb-3" />
                    <p className="text-xs sm:text-sm text-gray-500 mb-3">No bookings yet</p>
                    <Button
                      onClick={() => setActiveTab("quotation")}
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    >
                      Get Started
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setActiveTab("bookings");
                        }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            {getStatusIcon(booking.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {booking.serviceType === "vehicle" ? "Vehicle Service" : "Custom Service"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dayjs(booking.date).format("MMM DD, YYYY")}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium border flex-shrink-0 ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Services Tab - Browse & Book */}
        {activeTab === "services" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 sm:p-8 text-gray-900">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Our Services</h2>
              <p className="text-blue-50 text-sm sm:text-base">Browse our premium protective coating services</p>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={serviceSearchQuery}
                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="Vehicle Coating">Vehicle Coating</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Marine">Marine</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Services Grid */}
            {services.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <p className="text-sm text-gray-500">No services available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services
                  .filter(service => {
                    const matchesSearch = serviceSearchQuery === "" || 
                      service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                      service.description?.toLowerCase().includes(serviceSearchQuery.toLowerCase());
                    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                  })
                  .map((service) => (
                    <Card key={service._id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-5">
                        {/* Service Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {service.category}
                            </span>
                          </div>
                          {service.imageUrl && (
                            <img 
                              src={service.imageUrl} 
                              alt={service.name}
                              className="w-16 h-16 rounded-lg object-cover ml-3"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>

                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Key Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {service.features.slice(0, 3).map((feature, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                              {service.features.length > 3 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                  +{service.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Pricing */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b">
                          <div>
                            <p className="text-xs text-gray-500">Starting from</p>
                            <p className="text-xl font-bold text-blue-600">
                              KES {service.basePrice.toLocaleString()}
                              {service.priceUnit === "per_sqm" && <span className="text-sm">/m²</span>}
                              {service.priceUnit === "per_vehicle" && <span className="text-sm">/vehicle</span>}
                            </p>
                          </div>
                          {service.estimatedDuration && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Duration</p>
                              <p className="text-sm font-medium text-gray-900">{service.estimatedDuration}</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedServiceForBooking(service);
                              setServiceType("custom");
                              setBookingDate(dayjs().add(1, 'day').format("YYYY-MM-DD"));
                              setActiveTab("book");
                              toast.info(`Selected: ${service.name}`);
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 text-sm"
                          >
                            Book Now
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedServices([service._id]);
                              setActiveTab("quotation");
                              toast.info("Get a quote for this service");
                            }}
                            variant="outline"
                            className="flex-1 text-sm border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            Get Quote
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            {/* Call to Action */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Can't find what you're looking for?</h3>
                <p className="text-sm text-gray-400 mb-4">Contact us for custom solutions tailored to your needs</p>
                <Button
                  onClick={() => setActiveTab("messages")}
                  className="bg-blue-500 hover:bg-blue-600 text-gray-900"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quotation Tab - Enhanced with Steps */}
        {activeTab === "quotation" && (
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 sm:p-8 text-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Get Your Free Quote</h2>
                  <p className="text-yellow-50 text-sm sm:text-base">Instant pricing in 4 easy steps</p>
                </div>
              </div>
            </div>

            {/* Service Type Selection - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setQuoteStep(1);
                  document.getElementById("vehicle-selector")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative overflow-hidden p-5 sm:p-6 text-left rounded-xl border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all bg-white"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform" />
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 relative z-10">Vehicle Bed Liners</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 relative z-10">Trucks, Pickups & SUVs</p>
                <div className="flex items-baseline gap-2 relative z-10">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">From KES 25K</p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 relative z-10">
                  <span>Lifetime warranty</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setServiceType("custom");
                  setActiveTab("book");
                }}
                className="group relative overflow-hidden p-5 sm:p-6 text-left rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform" />
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 relative z-10">Industrial Coatings</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 relative z-10">Floors, Tanks & Equipment</p>
                <div className="flex items-baseline gap-2 relative z-10">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">Custom Quote</p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 relative z-10">
                  <span>Fast turnaround</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setServiceType("custom");
                  setActiveTab("book");
                }}
                className="group relative overflow-hidden p-5 sm:p-6 text-left rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all bg-white"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform" />
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 relative z-10">Commercial Fleet</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 relative z-10">Volume Pricing Available</p>
                <div className="flex items-baseline gap-2 relative z-10">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">Bulk Discount</p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 relative z-10">
                  <span>Save up to 20%</span>
                </div>
              </button>
            </div>

            {/* Vehicle Quote Calculator - Enhanced with Steps */}
            <Card className="border-0 shadow-lg" id="vehicle-selector">
              <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Vehicle Quote Calculator</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Get instant pricing for your vehicle</p>
                  </div>
                  <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                    Step {quoteStep} of 5
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex-1">
                      <div className={`h-2 rounded-full transition-all ${
                        step <= quoteStep ? 'bg-yellow-500' : 'bg-gray-200'
                      }`} />
                    </div>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-5 sm:space-y-6">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    1. Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {vehicles.types.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedVehicle({ type, brand: "", model: "", year: "" });
                          fetchBrands(type);
                          setQuoteStep(2);
                          setEstimatedPrice(null);
                        }}
                        className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all ${
                          selectedVehicle.type === type
                            ? "border-yellow-500 bg-yellow-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Car className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
                        <p className="text-xs font-medium">{type}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                {selectedVehicle.type && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      2. Brand
                    </label>
                    <select
                      className="w-full p-2.5 sm:p-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                      value={selectedVehicle.brand}
                      onChange={(e) => {
                        setSelectedVehicle((prev) => ({ ...prev, brand: e.target.value, model: "", year: "" }));
                        fetchModels(e.target.value);
                        setQuoteStep(3);
                        setEstimatedPrice(null);
                      }}
                    >
                      <option value="">Select brand...</option>
                      {vehicles.brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Model */}
                {selectedVehicle.brand && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      3. Model
                    </label>
                    <select
                      className="w-full p-2.5 sm:p-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                      value={selectedVehicle.model}
                      onChange={(e) => {
                        setSelectedVehicle((prev) => ({ ...prev, model: e.target.value, year: "" }));
                        fetchYears(e.target.value);
                        setQuoteStep(4);
                        setEstimatedPrice(null);
                      }}
                    >
                      <option value="">Select model...</option>
                      {vehicles.models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Year */}
                {selectedVehicle.model && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      4. Year
                    </label>
                    <select
                      className="w-full p-2.5 sm:p-3 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                      value={selectedVehicle.year}
                      onChange={(e) => {
                        setSelectedVehicle((prev) => ({ ...prev, year: e.target.value }));
                        setQuoteStep(5);
                      }}
                    >
                      <option value="">Select year...</option>
                      {vehicles.years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Service Selection */}
                {selectedVehicle.year && services.length > 0 && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      5. Select Services (Optional)
                    </label>
                    <div className="space-y-2">
                      {services.filter(s => s.category === "Vehicle Coating").map((service) => (
                        <label
                          key={service._id}
                          className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedServices.includes(service._id)
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices([...selectedServices, service._id]);
                              } else {
                                setSelectedServices(selectedServices.filter(id => id !== service._id));
                              }
                            }}
                            className="mt-0.5 w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs sm:text-sm font-medium text-gray-900">{service.name}</p>
                              <p className="text-xs sm:text-sm font-bold text-yellow-600">
                                +KES {service.basePrice.toLocaleString()}
                                {service.priceUnit === "per_sqm" && "/m²"}
                                {service.priceUnit === "per_vehicle" && "/vehicle"}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                            {service.features && service.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {service.features.slice(0, 3).map((feature, idx) => (
                                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* What's Included - Compact */}
                {selectedVehicle.type && (
                  <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm">
                    <p className="font-medium text-blue-900 mb-2">Included:</p>
                    <div className="grid grid-cols-2 gap-1 text-blue-800">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Prep work</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Premium coating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Installation</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Warranty</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Real-time Price Estimate */}
                {estimatedPrice && priceBreakdown && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">Estimated Cost</h4>
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                    </div>
                    
                    {/* Price Breakdown */}
                    <div className="space-y-2 mb-3 text-xs">
                      <div className="flex justify-between text-gray-700">
                        <span>Base Cost</span>
                        <span>KES {priceBreakdown.baseCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Labour</span>
                        <span>KES {priceBreakdown.labourCost.toLocaleString()}</span>
                      </div>
                      {priceBreakdown.surfaceCost > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Surface Coating</span>
                          <span>KES {priceBreakdown.surfaceCost.toLocaleString()}</span>
                        </div>
                      )}
                      {priceBreakdown.servicesCost > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Additional Services</span>
                          <span>KES {priceBreakdown.servicesCost.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-yellow-300 pt-2 flex justify-between font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-yellow-600">KES {estimatedPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center">
                      Final quote will be generated after confirmation
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleQuotation}
                  disabled={!selectedVehicle.year}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 disabled:bg-gray-300 text-sm sm:text-base py-6 font-semibold"
                >
                  {estimatedPrice ? 'Confirm & Generate Quote' : 'Calculate Quote'}
                </Button>

                {/* Recent Quotes - Compact */}
                {quotations.length > 0 && (
                  <div className="pt-3 sm:pt-4 border-t">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Recent Quotes</h4>
                    <div className="space-y-2">
                      {quotations.slice(0, 3).map((q) => (
                        <div key={q._id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{q.vehicleInfo}</p>
                            <p className="text-xs text-gray-500">{dayjs(q.createdAt).format("MMM DD")}</p>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <p className="text-xs sm:text-sm font-bold text-yellow-600">
                              KES {(q.estimatedCost || q.totalAmount || 0).toLocaleString()}
                            </p>
                            <Button
                              onClick={() => handleSendQuoteToAdmin(q)}
                              size="sm"
                              variant="outline"
                              className="text-xs border-blue-500 text-blue-600 hover:bg-blue-50"
                              title="Send to Admin"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => handleBookFromQuotation(q)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-gray-900 text-xs"
                            >
                              Book
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Book Service Tab - Simplified */}
        {activeTab === "book" && (
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Selected Service Banner */}
            {selectedServiceForBooking && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 mb-1">Selected Service</p>
                    <h3 className="text-lg font-bold text-gray-900">{selectedServiceForBooking.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{selectedServiceForBooking.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-xl font-bold text-blue-600">
                          KES {selectedServiceForBooking.basePrice.toLocaleString()}
                          {selectedServiceForBooking.priceUnit === "per_sqm" && <span className="text-sm">/m²</span>}
                        </p>
                      </div>
                      {selectedServiceForBooking.estimatedDuration && (
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-sm font-medium text-gray-900">{selectedServiceForBooking.estimatedDuration}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedServiceForBooking(null)}
                    className="text-gray-400 hover:text-gray-400"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Book from Quotes */}
            {quotations.length > 0 && !selectedQuoteForBooking && !selectedServiceForBooking && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg">Book from Recent Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                    {quotations.slice(0, 4).map((q) => (
                      <button
                        key={q._id}
                        onClick={() => handleBookWithQuote(q)}
                        className="p-2.5 sm:p-3 text-left border border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
                      >
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{q.vehicleInfo}</p>
                        <p className="text-base sm:text-lg font-bold text-yellow-600 mt-1">
                          KES {(q.estimatedCost || q.totalAmount || 0).toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Browse Services CTA */}
            {!selectedServiceForBooking && !selectedQuoteForBooking && (
              <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-4 text-center">
                  <br></br>
                  <p className="text-sm text-gray-700 mb-3">Browse our services to select what you need</p>
                  <Button
                    onClick={() => setActiveTab("services")}
                    className="bg-blue-500 hover:bg-blue-600 text-gray-900"
                  >
                    Browse Services
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Selected Quote Banner */}
            {selectedQuoteForBooking && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 mb-1">Selected Quote</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedQuoteForBooking.vehicleInfo}</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600 mt-1">
                      KES {(selectedQuoteForBooking.estimatedCost || selectedQuoteForBooking.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedQuoteForBooking(null)}
                    className="text-gray-400 hover:text-gray-400"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Booking Form - Compact */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Schedule Service</CardTitle>
                <p className="text-xs sm:text-sm text-gray-500">Choose your preferred date and time</p>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {!selectedQuoteForBooking && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button
                        onClick={() => setServiceType("vehicle")}
                        className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all ${
                          serviceType === "vehicle"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Car className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                        <p className="text-xs sm:text-sm font-medium">Vehicle</p>
                      </button>
                      <button
                        onClick={() => setServiceType("custom")}
                        className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all ${
                          serviceType === "custom"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1" />
                        <p className="text-xs sm:text-sm font-medium">Custom</p>
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    min={dayjs().add(1, 'day').format("YYYY-MM-DD")}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Any special requirements..."
                    rows="3"
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <Button
                  onClick={handleDirectBooking}
                  disabled={!bookingDate}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-gray-900 disabled:bg-gray-300 text-sm sm:text-base"
                >
                  Confirm Booking
                </Button>

                {!selectedQuoteForBooking && (
                  <div className="text-center pt-2">
                    <Button
                      onClick={() => setActiveTab("quotation")}
                      variant="link"
                      className="text-xs sm:text-sm text-yellow-600"
                    >
                      Need a quote first?
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Bookings Tab - Enhanced with Filters */}
        {activeTab === "bookings" && (
          <div className="space-y-3 sm:space-y-4">
            {/* Filters and Search */}
            {bookings.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Paid">Paid</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    {bookings.length === 0 ? "No bookings yet" : "No bookings match your filters"}
                  </p>
                  <Button
                    onClick={() => setActiveTab("book")}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-gray-900"
                  >
                    Book a Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredBookings.map((booking) => (
                  <Card key={booking._id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                              {booking.serviceType === "vehicle" ? "Vehicle Service" : "Custom Service"}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {dayjs(booking.date).format("MMM DD, YYYY")}
                            </span>
                            {booking.costBreakdown?.total > 0 && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                KES {booking.costBreakdown.total.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {booking.status === "Pending" && booking.costBreakdown?.total > 0 && (
                            <Button
                              onClick={() => handlePayment(booking._id)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-gray-900 text-xs"
                            >
                              Pay Now
                            </Button>
                          )}
                          {booking.status !== "Cancelled" && booking.status !== "Completed" &&
                            dayjs().diff(dayjs(booking.createdAt), "hour") <= 24 && (
                              <Button
                                onClick={() => handleCancelBooking(booking._id)}
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 text-xs"
                              >
                                Cancel
                              </Button>
                            )}
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setActiveTab("messages");
                            }}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Mini Progress Bar */}
                      {booking.status !== "Cancelled" && (
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
                          {["Pending", "In Progress", "Paid", "Completed"].map((step, idx) => {
                            const statusOrder = ["Pending", "In Progress", "Paid", "Completed"];
                            const currentIdx = statusOrder.indexOf(booking.status);
                            const isPassed = idx <= currentIdx;
                            return (
                              <div key={step} className="flex items-center flex-1">
                                <div
                                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    isPassed ? "bg-yellow-500 text-gray-900" : "bg-gray-200 text-gray-500"
                                  }`}
                                >
                                  {isPassed ? "✓" : idx + 1}
                                </div>
                                {idx < 3 && (
                                  <div className={`flex-1 h-0.5 sm:h-1 ${isPassed ? "bg-yellow-500" : "bg-gray-200"}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab - Streamlined */}
        {activeTab === "messages" && (
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  Support Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] sm:h-[500px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 mx-auto mb-3" />
                        <p className="text-xs sm:text-sm text-gray-500">Start a conversation</p>
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isUser = m.sender === "user";
                        return (
                          <div key={m._id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-xs lg:max-w-md px-2.5 sm:px-3 py-2 rounded-lg ${
                                isUser
                                  ? "bg-yellow-500 text-gray-900"
                                  : "bg-white text-gray-900 border border-gray-200"
                              }`}
                            >
                              <p className="text-xs sm:text-sm">{m.text}</p>
                              <p className={`text-xs mt-1 ${isUser ? "text-yellow-100" : "text-gray-500"}`}>
                                {dayjs(m.createdAt).format("HH:mm")}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="p-3 sm:p-4 bg-white border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-gray-900"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quotation Modal - Enhanced */}
      {showQuotationModal && quotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-3 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">Quote Generated</CardTitle>
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Valid for 30 days</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Vehicle Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                <p className="text-base font-bold text-gray-900">{quotation.vehicleInfo}</p>
                <p className="text-xs text-gray-400 mt-1">{quotation.formula}</p>
              </div>

              {/* Cost Breakdown */}
              {priceBreakdown && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Cost Breakdown</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Base Cost</span>
                      <span className="font-medium">KES {priceBreakdown.baseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Labour</span>
                      <span className="font-medium">KES {priceBreakdown.labourCost.toLocaleString()}</span>
                    </div>
                    {priceBreakdown.surfaceCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Surface Coating</span>
                        <span className="font-medium">KES {priceBreakdown.surfaceCost.toLocaleString()}</span>
                      </div>
                    )}
                    {priceBreakdown.servicesCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Additional Services</span>
                        <span className="font-medium">KES {priceBreakdown.servicesCost.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Selected Services */}
              {quotation.services && quotation.services.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Selected Services</h4>
                  <div className="space-y-2">
                    {quotation.services.map((service) => (
                      <div key={service._id} className="flex items-center justify-between bg-blue-50 rounded-lg p-2 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900 font-medium">{service.name}</span>
                        </div>
                        <span className="font-bold text-blue-600">
                          +KES {service.basePrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-gray-900">
                <p className="text-sm opacity-90 mb-1">Total Estimated Cost</p>
                <p className="text-3xl font-bold">
                  KES {(quotation.estimatedCost || quotation.totalAmount || 0).toLocaleString()}
                </p>
                <p className="text-xs opacity-75 mt-2">Includes all materials, labour & warranty</p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBookFromQuotation(quotation)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-gray-900 text-sm py-6 font-semibold"
                  >
                    Book Now
                  </Button>
                  <Button
                    onClick={() => {
                      handleSendQuoteToAdmin(quotation);
                      setShowQuotationModal(false);
                      setQuotation(null);
                      setPriceBreakdown(null);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-gray-900 text-sm py-6 font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send to Admin
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    setShowQuotationModal(false);
                    setQuotation(null);
                    setPriceBreakdown(null);
                  }}
                  variant="outline"
                  className="w-full text-sm py-3"
                >
                  Close
                </Button>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-gray-400">
                  <li>• Quote saved to your account</li>
                  <li>• Book service at your convenience</li>
                  <li>• Our team will confirm your appointment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;