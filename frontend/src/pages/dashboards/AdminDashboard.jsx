import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  ClipboardList,
  DollarSign,
  Eye,
  EyeOff,
  Menu,
  Package,
  Plus,
  RefreshCw,
  TrendingUp,
  User,
  UserPlus,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../services/api";

const formatDate = (d) => (d ? dayjs(d).format("DD MMM YYYY HH:mm") : "-");

const STATUS_COLORS = {
  Paid: "success",
  Completed: "success",
  "In Progress": "info",
  Pending: "warning",
  Cancelled: "destructive",
};

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState({
    revenue: [],
    bookingTrends: [],
    employeePerformance: [],
    taskCompletion: []
  });
  const [loading, setLoading] = useState(false);
  
  // Employee creation modal
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    roleTitle: "Service Technician"
  });
  
  // Booking assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  
  // Cost update modal
  const [showCostModal, setShowCostModal] = useState(false);
  const [costForm, setCostForm] = useState({
    materials: 0,
    labor: 0,
    additional: 0
  });

  // Task creation modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    status: "Pending"
  });

  // Service creation modal
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    category: "Vehicle Coating",
    basePrice: 0,
    priceUnit: "fixed",
    features: "",
    estimatedDuration: "",
    imageUrl: ""
  });
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [serviceImagePreview, setServiceImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bookings.length > 0 || employees.length > 0 || tasks.length > 0) {
      generateReports();
    }
  }, [bookings, employees, tasks]);

  const fetchData = async () => {
    await Promise.all([
      fetchBookings(),
      fetchEmployees(),
      fetchTasks(),
      fetchServices(),
      fetchCustomers(),
      fetchQuotations(),
      fetchStats()
    ]);
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/services/all");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employee");
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await API.get("/service-management");
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomers([]);
    }
  };

  const fetchQuotations = async () => {
    try {
      const res = await API.get("/quotations");
      setQuotations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setQuotations([]);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/services/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const generateReports = () => {
    // Revenue by month
    const revenueByMonth = bookings
      .filter(b => b.status === "Paid" || b.status === "Completed")
      .reduce((acc, booking) => {
        const month = dayjs(booking.createdAt).format("MMM YYYY");
        const revenue = booking.costBreakdown?.total || 0;
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.revenue += revenue;
          existing.count += 1;
        } else {
          acc.push({ month, revenue, count: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => dayjs(a.month, "MMM YYYY").valueOf() - dayjs(b.month, "MMM YYYY").valueOf());

    // Booking trends by status
    const bookingTrends = [
      { status: "Pending", count: bookings.filter(b => b.status === "Pending").length, color: "bg-yellow-500" },
      { status: "In Progress", count: bookings.filter(b => b.status === "In Progress").length, color: "bg-blue-500" },
      { status: "Completed", count: bookings.filter(b => b.status === "Completed").length, color: "bg-green-500" },
      { status: "Paid", count: bookings.filter(b => b.status === "Paid").length, color: "bg-purple-500" },
      { status: "Cancelled", count: bookings.filter(b => b.status === "Cancelled").length, color: "bg-red-500" },
    ];

    // Employee performance
    const employeePerformance = employees.map(emp => {
      const assignedBookings = bookings.filter(b => String(b.assignedTo?._id) === String(emp._id));
      const completedBookings = assignedBookings.filter(b => b.status === "Completed" || b.status === "Paid");
      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.costBreakdown?.total || 0), 0);
      
      return {
        name: emp.name,
        assigned: assignedBookings.length,
        completed: completedBookings.length,
        revenue: totalRevenue,
        completionRate: assignedBookings.length > 0 ? ((completedBookings.length / assignedBookings.length) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => b.completed - a.completed);

    // Task completion rate
    const taskCompletion = [
      { status: "Pending", count: tasks.filter(t => t.status === "Pending").length, color: "bg-yellow-500" },
      { status: "In Progress", count: tasks.filter(t => t.status === "In Progress").length, color: "bg-blue-500" },
      { status: "Completed", count: tasks.filter(t => t.status === "Completed").length, color: "bg-green-500" },
    ];

    setReports({
      revenue: revenueByMonth,
      bookingTrends,
      employeePerformance,
      taskCompletion
    });
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/employee", employeeForm);
      toast.success("Employee account created successfully!");
      setShowEmployeeModal(false);
      setEmployeeForm({
        name: "",
        email: "",
        password: "",
        contact: "",
        roleTitle: "Service Technician"
      });
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }
    setLoading(true);
    try {
      // Assign employee to booking
      await API.post("/services/assign", {
        serviceId: selectedBooking._id,
        employeeId: selectedEmployee
      });

      // Get employee details
      const assignedEmployee = employees.find(emp => emp._id === selectedEmployee);
      
      // Automatically create a task for this booking
      const taskData = {
        title: `Service: ${selectedBooking.serviceType} - Booking #${selectedBooking._id.slice(-6)}`,
        description: `Complete ${selectedBooking.serviceType} service for customer. ${selectedBooking.notes ? 'Notes: ' + selectedBooking.notes : ''}`,
        assignedTo: selectedEmployee,
        priority: "High",
        dueDate: selectedBooking.date,
        status: "Pending",
        relatedBooking: selectedBooking._id
      };

      await API.post("/tasks", taskData);

      toast.success(`Employee assigned and task created for ${assignedEmployee?.name}!`);
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedEmployee("");
      
      // Refresh both bookings and tasks
      fetchBookings();
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign employee");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.patch(`/services/${selectedBooking._id}/cost`, costForm);
      toast.success("Cost updated successfully!");
      setShowCostModal(false);
      setSelectedBooking(null);
      setCostForm({ materials: 0, labor: 0, additional: 0 });
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cost");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (bookingId) => {
    try {
      await API.patch(`/services/${bookingId}/paid`);
      toast.success("Marked as paid!");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark as paid");
    }
  };

  const handleMarkCompleted = async (bookingId) => {
    try {
      await API.patch(`/services/${bookingId}/completed`);
      toast.success("Marked as completed!");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark as completed");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await API.delete(`/employee/${employeeId}`);
      toast.success("Employee deleted successfully!");
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete employee");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.assignedTo) {
      toast.error("Please select an employee to assign the task");
      return;
    }
    setLoading(true);
    try {
      await API.post("/tasks", taskForm);
      toast.success("Task created and assigned successfully!");
      setShowTaskModal(false);
      setTaskForm({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
        status: "Pending"
      });
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success("Task status updated!");
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = serviceForm.imageUrl;

      // Upload image if file is selected
      if (serviceImageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("image", serviceImageFile);

        const uploadRes = await API.post("/service-images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageUrl = uploadRes.data.imageUrl;
        setUploadingImage(false);
      }

      const featuresArray = serviceForm.features
        .split(",")
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const serviceData = {
        ...serviceForm,
        imageUrl,
        features: featuresArray,
        basePrice: Number(serviceForm.basePrice),
      };

      if (editingService) {
        await API.put(`/service-management/${editingService._id}`, serviceData);
        toast.success("Service updated successfully!");
      } else {
        await API.post("/service-management", serviceData);
        toast.success("Service created successfully!");
      }

      setShowServiceModal(false);
      setEditingService(null);
      setServiceForm({
        name: "",
        description: "",
        category: "Vehicle Coating",
        basePrice: 0,
        priceUnit: "fixed",
        features: "",
        estimatedDuration: "",
        imageUrl: ""
      });
      setServiceImageFile(null);
      setServiceImagePreview(null);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save service");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice,
      priceUnit: service.priceUnit,
      features: service.features?.join(", ") || "",
      estimatedDuration: service.estimatedDuration || "",
      imageUrl: service.imageUrl || ""
    });
    // Set preview with full URL if it's a relative path
    if (service.imageUrl) {
      const fullUrl = service.imageUrl.startsWith('/') 
        ? `http://localhost:5002${service.imageUrl}` 
        : service.imageUrl;
      setServiceImagePreview(fullUrl);
    } else {
      setServiceImagePreview(null);
    }
    setServiceImageFile(null);
    setShowServiceModal(true);
  };

  const handleServiceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setServiceImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setServiceImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveServiceImage = () => {
    setServiceImageFile(null);
    setServiceImagePreview(null);
    setServiceForm({ ...serviceForm, imageUrl: "" });
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await API.delete(`/service-management/${serviceId}`);
      toast.success("Service deleted successfully!");
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete service");
    }
  };

  const handleToggleServiceStatus = async (serviceId) => {
    try {
      await API.patch(`/service-management/${serviceId}/toggle`);
      toast.success("Service status updated!");
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update service");
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "bookings", label: "Bookings", icon: <Package className="w-5 h-5" /> },
    { id: "quotations", label: "Quotations", icon: <DollarSign className="w-5 h-5" /> },
    { id: "customers", label: "Customers", icon: <User className="w-5 h-5" /> },
    { id: "tasks", label: "Tasks", icon: <ClipboardList className="w-5 h-5" /> },
    { id: "employees", label: "Employees", icon: <Users className="w-5 h-5" /> },
    { id: "services", label: "Services", icon: <Package className="w-5 h-5" /> },
    { id: "reports", label: "Reports", icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex pt-20" style={{ fontFamily: "'Barlow Condensed', 'Oswald', sans-serif" }}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 border-r border-gray-800 shadow-lg transition-all duration-300 fixed h-full z-20 top-20`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <br></br>
              <div>
                <h2 className="font-bold text-white">Admin Panel</h2>
                <p className="text-xs" style={{ color: "#F97316" }}>Management</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                activeView === item.id
                  ? "text-black shadow-lg"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              style={activeView === item.id ? { background: "#F97316" } : {}}
            >
              {item.icon}
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              {/* Task count badge */}
              {item.id === 'tasks' && tasks.filter(t => t.status === "Pending").length > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {tasks.filter(t => t.status === "Pending").length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 p-6`}>
        {/* Overview */}
        {activeView === "overview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Dashboard Overview</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your operations</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => window.open('/', '_blank')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 !text-gray-300 hover:!text-white border-gray-700 hover:bg-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Site
                </Button>
                <Button onClick={fetchData} variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow" style={{ borderLeft: "3px solid #F97316" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Total Bookings</p>
                      <p className="text-3xl font-black text-white">{stats.totalBookings || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">All time bookings</p>
                    </div>
                   
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow" style={{ borderLeft: "3px solid #F97316" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Pending</p>
                      <p className="text-3xl font-black text-white">{stats.pendingBookings || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
                    </div>
                   
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow" style={{ borderLeft: "3px solid #10b981" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Completed</p>
                      <p className="text-3xl font-black text-white">{stats.completedBookings || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Successfully done</p>
                    </div>
                  
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow" style={{ borderLeft: "3px solid #F97316" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Revenue</p>
                      <p className="text-2xl font-black" style={{ color: "#F97316" }}>
                        KES {(stats.totalRevenue || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Total earnings</p>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wider text-sm">
                    Team Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Employees</span>
                      <span className="font-bold text-lg text-white">{employees.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Customers</span>
                      <span className="font-bold text-lg text-white">{customers.length || 0}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Active Rate</span>
                        <span className="text-sm font-medium" style={{ color: "#10b981" }}>
                          {employees.length > 0 ? '100%' : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wider text-sm">
                    Services Catalog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Services</span>
                      <span className="font-bold text-lg text-white">{services.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Active Services</span>
                      <span className="font-bold text-lg" style={{ color: "#10b981" }}>
                        {services.filter(s => s.isActive).length}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Categories</span>
                        <span className="text-sm font-medium" style={{ color: "#F97316" }}>
                          {new Set(services.map(s => s.category)).size}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wider text-sm">
                    Active Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">In Progress</span>
                      <span className="font-bold text-lg" style={{ color: "#3b82f6" }}>{stats.inProgressBookings || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Paid</span>
                      <span className="font-bold text-lg" style={{ color: "#10b981" }}>{stats.paidBookings || 0}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Pending Tasks</span>
                        <span className="text-sm font-medium text-yellow-500">
                          {tasks.filter(t => t.status === "Pending").length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Services Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white uppercase tracking-wider text-sm">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => setActiveView("bookings")}
                    className="w-full justify-start text-black hover:opacity-90"
                    style={{ background: "#F97316" }}
                  >
                    View All Bookings
                  </Button>
                  <Button
                    onClick={() => {
                      setShowEmployeeModal(true);
                    }}
                    className="w-full justify-start"
                    style={{ background: "#10b981", color: "white" }}
                  >
                    Add Employee
                  </Button>
                  <Button
                    onClick={() => {
                      setShowServiceModal(true);
                    }}
                    className="w-full justify-start"
                    style={{ background: "#8b5cf6", color: "white" }}
                  >
                    Create Service
                  </Button>
                  <Button
                    onClick={() => setActiveView("reports")}
                    variant="outline"
                    className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      Popular Services
                    </span>
                    <Button
                      onClick={() => setActiveView("services")}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No services created yet</p>
                      <Button
                        onClick={() => {
                          setShowServiceModal(true);
                        }}
                        size="sm"
                        className="mt-3 bg-green-600 hover:bg-green-700"
                      >
                        Create First Service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {services.filter(s => s.isActive).slice(0, 3).map((service) => (
                        <div
                          key={service._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.category}</p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="font-bold text-green-600">
                              KES {service.basePrice.toLocaleString()}
                            </p>
                            <Badge variant="success" className="text-xs">Active</Badge>
                          </div>
                        </div>
                      ))}
                      {services.filter(s => s.isActive).length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No active services available
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white uppercase tracking-wider text-sm">Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors border border-gray-700"
                    >
                      <div className="flex items-center gap-4">
                       
                        <div>
                          <p className="font-medium text-white">
                            {booking.customerId?.name || booking.customerId?.email || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-400">{formatDate(booking.date)}</p>
                        </div>
                      </div>
                      <Badge variant={STATUS_COLORS[booking.status] || "default"}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings View */}
        {activeView === "bookings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">All Bookings</h1>
                <p className="text-sm text-gray-400 mt-1">Manage customer bookings</p>
              </div>
              <Button onClick={fetchBookings} variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking._id} className="bg-gray-900 border-gray-800 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          
                          <div>
                            <h3 className="font-semibold text-white">
                              {booking.customerId?.name || booking.customerId?.email || "Unknown Customer"}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {booking.serviceType === "vehicle" ? "Vehicle Service" : "Custom Service"}
                            </p>
                          </div>
                          <Badge variant={STATUS_COLORS[booking.status] || "default"}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider">Date</p>
                            <p className="font-medium text-gray-300">{formatDate(booking.date)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider">Assigned To</p>
                            <p className="font-medium text-gray-300">
                              {booking.assignedTo?.name || booking.assignedTo?.email || "Unassigned"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider">Total Cost</p>
                            <p className="font-medium" style={{ color: "#10b981" }}>
                              KES {(booking.costBreakdown?.total || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider">Created</p>
                            <p className="font-medium text-gray-300">{formatDate(booking.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {!booking.assignedTo && (
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignModal(true);
                            }}
                            size="sm"
                            style={{ background: "#3b82f6", color: "white" }}
                          >
                            Assign
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setCostForm({
                              materials: booking.costBreakdown?.materials || 0,
                              labor: booking.costBreakdown?.labor || 0,
                              additional: booking.costBreakdown?.additional || 0
                            });
                            setShowCostModal(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          Cost
                        </Button>

                        {booking.status === "Pending" && booking.costBreakdown?.total > 0 && (
                          <Button
                            onClick={() => handleMarkPaid(booking._id)}
                            size="sm"
                            style={{ background: "#10b981", color: "white" }}
                          >
                            Mark Paid
                          </Button>
                        )}

                        {booking.status === "Paid" && (
                          <Button
                            onClick={() => handleMarkCompleted(booking._id)}
                            size="sm"
                            style={{ background: "#10b981", color: "white" }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}

                        <Button
                          onClick={() => {
                            setSelectedBooking(booking);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {bookings.length === 0 && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="py-12 text-center">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No bookings found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Customers View */}
        {activeView === "customers" && (
          <div className="space-y-6">
            <br></br>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Customer Management</h1>
                <p className="text-sm text-gray-400 mt-1">View and manage customers</p>
              </div>
              <Button onClick={fetchCustomers} variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                Refresh
              </Button>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-800" style={{ borderLeft: "3px solid #F97316" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Total Customers</p>
                      <p className="text-2xl font-bold text-white">{customers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800" style={{ borderLeft: "3px solid #10b981" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Active</p>
                      <p className="text-2xl font-bold" style={{ color: "#10b981" }}>
                        {customers.filter(c => c.status === "active").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800" style={{ borderLeft: "3px solid #8b5cf6" }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Total Bookings</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {customers.reduce((sum, c) => sum + (c.totalBookings || 0), 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        KES {customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customers List */}
            <div className="space-y-4">
              {customers.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No customers found</p>
                  </CardContent>
                </Card>
              ) : (
                customers.map((customer) => (
                  <Card key={customer._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 p-3 rounded-full">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                            <Badge variant={customer.status === "active" ? "success" : "default"}>
                              {customer.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Phone</p>
                              <p className="font-medium">{customer.phone || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Bookings</p>
                              <p className="font-medium text-purple-600">{customer.totalBookings || 0}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Spent</p>
                              <p className="font-medium text-green-600">
                                KES {(customer.totalSpent || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Last Booking</p>
                              <p className="font-medium">
                                {customer.lastBooking ? formatDate(customer.lastBooking) : "Never"}
                              </p>
                            </div>
                          </div>

                          {customer.address && (
                            <div className="mt-3 text-sm">
                              <p className="text-gray-600">Address</p>
                              <p className="font-medium">{customer.address}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => {
                              // View customer details
                              const customerBookings = bookings.filter(
                                b => String(b.customerId?._id) === String(customer.userId)
                              );
                              toast.success(`${customer.name} has ${customerBookings.length} bookings`);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Employees View */}
        {activeView === "employees" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
              <Button
                onClick={() => setShowEmployeeModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Add Employee
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((emp) => (
                <Card key={emp._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                          <p className="text-sm text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role</span>
                        <span className="font-medium">
                          {emp.employeeId?.roleTitle || "Service Technician"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact</span>
                        <span className="font-medium">
                          {emp.employeeId?.contact || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joined</span>
                        <span className="font-medium">
                          {dayjs(emp.createdAt).format("MMM DD, YYYY")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDeleteEmployee(emp._id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {employees.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No employees found</p>
                    <Button
                      onClick={() => setShowEmployeeModal(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First Employee
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Quotations View */}
        {activeView === "quotations" && (
          <div className="space-y-6">
            <br></br>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Customer Quotations</h1>
              <Button onClick={fetchQuotations} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Quotation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Quotes</p>
                    <p className="text-2xl font-bold text-gray-900">{quotations.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {quotations.filter(q => q.status === "Pending").length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {quotations.filter(q => q.status === "Approved").length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-blue-600">
                      KES {quotations.reduce((sum, q) => sum + (q.estimatedCost || q.totalAmount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quotations List */}
            <div className="space-y-4">
              {quotations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No quotations found</p>
                  </CardContent>
                </Card>
              ) : (
                quotations.map((quote) => (
                  <Card key={quote._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-yellow-100 p-3 rounded-full">
                              <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{quote.vehicleInfo}</h3>
                              <p className="text-sm text-gray-500">
                                Customer: {quote.customerName}
                                {quote.customerId?.email && ` (${quote.customerId.email})`}
                              </p>
                              <p className="text-xs text-gray-400">{formatDate(quote.createdAt)}</p>
                            </div>
                            <Badge variant={quote.status === "Pending" ? "warning" : "success"}>
                              {quote.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500">Vehicle Type</p>
                              <p className="text-sm font-medium text-gray-900">{quote.type}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Formula</p>
                              <p className="text-sm font-medium text-gray-900">{quote.formula}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Area</p>
                              <p className="text-sm font-medium text-gray-900">
                                {quote.area ? `${(quote.area / 10000).toFixed(2)} m²` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Estimated Cost</p>
                              <p className="text-lg font-bold text-yellow-600">
                                KES {(quote.estimatedCost || quote.totalAmount || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {quote.services && quote.services.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs text-gray-500 mb-2">Selected Services:</p>
                              <div className="flex flex-wrap gap-2">
                                {quote.services.map((service, idx) => (
                                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {service.name || service}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => {
                              // Navigate to bookings with this quote
                              setActiveView("bookings");
                              toast.info("Create booking from this quote");
                            }}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Create Booking
                          </Button>
                          <Button
                            onClick={() => {
                              // Send message to customer
                              toast.info("Message feature coming soon");
                            }}
                            size="sm"
                            variant="outline"
                          >
                            Contact Customer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tasks View */}
        {activeView === "tasks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
                <p className="text-gray-600 mt-1">Create and assign tasks to employees</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={fetchTasks}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button
                  onClick={() => setShowTaskModal(true)}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg"
                >
                  Create Task
                </Button>
              </div>
            </div>

            {/* Tasks Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {tasks.filter(t => t.status === "Pending").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {tasks.filter(t => t.status === "In Progress").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {tasks.filter(t => t.status === "Completed").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tasks List */}
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No tasks created yet</p>
                    <p className="text-gray-400 text-sm mt-2">Create your first task to get started</p>
                    <Button
                      onClick={() => setShowTaskModal(true)}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
                              <Badge
                                variant={
                                  task.priority === "High"
                                    ? "destructive"
                                    : task.priority === "Medium"
                                    ? "warning"
                                    : "default"
                                }
                              >
                                {task.priority}
                              </Badge>
                              <Badge
                                variant={
                                  task.status === "Completed"
                                    ? "success"
                                    : task.status === "In Progress"
                                    ? "info"
                                    : "warning"
                                }
                              >
                                {task.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{task.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{task.assignedTo?.name || "Unassigned"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {task.dueDate ? dayjs(task.dueDate).format("MMM DD, YYYY") : "No deadline"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            {task.status !== "Completed" && (
                              <select
                                value={task.status}
                                onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            )}
                            <Button
                              onClick={() => handleDeleteTask(task._id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Services View */}
        {activeView === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <br></br>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
                <p className="text-gray-600 mt-1">Manage available services and pricing</p>
              </div>
              <Button
                onClick={() => {
                  setEditingService(null);
                  setServiceForm({
                    name: "",
                    description: "",
                    category: "Vehicle Coating",
                    basePrice: 0,
                    priceUnit: "fixed",
                    features: "",
                    estimatedDuration: "",
                    imageUrl: ""
                  });
                  setShowServiceModal(true);
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
              >
                Add Service
              </Button>
            </div>

            {/* Services Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Services</p>
                      <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-green-600">
                        {services.filter(s => s.isActive).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Inactive</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {services.filter(s => !s.isActive).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {new Set(services.map(s => s.category)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No services created yet</p>
                    <p className="text-gray-400 text-sm mt-2">Create your first service to get started</p>
                    <Button
                      onClick={() => setShowServiceModal(true)}
                      className="mt-4 bg-green-600 hover:bg-green-700"
                    >
                      Create First Service
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                services.map((service) => (
                  <Card key={service._id} className={`hover:shadow-lg transition-shadow ${!service.isActive ? 'opacity-60' : ''}`}>
                    <CardContent className="pt-6 space-y-4">
                      {/* Header with Status Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{service.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={service.isActive ? "success" : "default"} className="text-xs">
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {service.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-3 min-h-[3.75rem]">{service.description}</p>

                      {/* Pricing Information */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm text-gray-600">Base Price</span>
                          <span className="text-2xl font-bold text-green-600">
                            KES {service.basePrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Pricing Model</span>
                          <span className="text-xs font-medium text-gray-700 capitalize">
                            {service.priceUnit.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="space-y-2 text-sm">
                        {service.estimatedDuration && (
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Duration</span>
                            </div>
                            <span className="font-medium text-gray-900">{service.estimatedDuration}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Package className="w-4 h-4" />
                            <span>Features</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {service.features?.length || 0} included
                          </span>
                        </div>
                      </div>

                      {/* Features List */}
                      {service.features && service.features.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-2">Key Features:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {service.features.slice(0, 4).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                                {feature}
                              </span>
                            ))}
                            {service.features.length > 4 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{service.features.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons - Fixed Layout */}
                      <div className="pt-2 space-y-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditService(service)}
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleToggleServiceStatus(service._id)}
                            size="sm"
                            variant="outline"
                            className={`flex-1 text-xs ${service.isActive ? "text-orange-600 hover:bg-orange-50 border-orange-200" : "text-green-600 hover:bg-green-50 border-green-200"}`}
                          >
                            {service.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                        <Button
                          onClick={() => handleDeleteService(service._id)}
                          size="sm"
                          variant="outline"
                          className="w-full text-xs text-red-600 hover:bg-red-50 border-red-200"
                        >
                          Delete Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reports View */}
        {activeView === "reports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">Performance metrics and business insights</p>
              </div>
              <Button
                onClick={() => {
                  fetchData();
                  generateReports();
                }}
                variant="outline"
                size="sm"
              >
                Refresh Data
              </Button>
            </div>

            {/* Key Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        KES {stats.totalRevenue?.toLocaleString() || 0}
                      </p>
                    </div>
                  
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalBookings || 0}</p>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Employees</p>
                      <p className="text-2xl font-bold text-purple-600">{employees.length || 0}</p>
                    </div>
                  
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Services</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {services.filter(s => s.isActive).length}
                      </p>
                    </div>
                   
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Revenue by Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports.revenue.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No revenue data available yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.revenue.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.month}</p>
                            <p className="text-sm text-gray-500">{item.count} bookings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            KES {item.revenue.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Avg: KES {(item.revenue / item.count).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Booking Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.bookingTrends.map((item, index) => {
                    const total = bookings.length || 1;
                    const percentage = ((item.count / total) * 100).toFixed(1);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{item.status}</span>
                          <span className="text-sm text-gray-600">{item.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${item.color} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Employee Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Employee Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports.employeePerformance.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No employee data available yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Assigned</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Completed</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Completion Rate</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.employeePerformance.map((emp, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="font-medium text-gray-900">{emp.name}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4 text-gray-600">{emp.assigned}</td>
                            <td className="text-center py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {emp.completed}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${emp.completionRate}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">{emp.completionRate}%</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4 font-semibold text-green-600">
                              KES {emp.revenue.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Task Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                  Task Completion Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reports.taskCompletion.map((item, index) => {
                    const total = tasks.length || 1;
                    const percentage = ((item.count / total) * 100).toFixed(1);
                    return (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.status}</span>
                          <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{percentage}% of total tasks</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Services Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Services Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No services available yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Services by Category */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Services by Category</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from(new Set(services.map(s => s.category))).map((category, index) => {
                          const categoryServices = services.filter(s => s.category === category);
                          const activeCount = categoryServices.filter(s => s.isActive).length;
                          const totalRevenue = categoryServices.reduce((sum, s) => sum + s.basePrice, 0);
                          
                          return (
                            <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{category}</h4>
                                <Badge variant="info" className="text-xs">
                                  {categoryServices.length} services
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Active</span>
                                  <span className="font-medium text-green-600">{activeCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Inactive</span>
                                  <span className="font-medium text-gray-600">
                                    {categoryServices.length - activeCount}
                                  </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-blue-200">
                                  <span className="text-gray-600">Avg. Price</span>
                                  <span className="font-bold text-blue-600">
                                    KES {(totalRevenue / categoryServices.length).toFixed(0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top Services by Price */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Top Services by Price</h3>
                      <div className="space-y-2">
                        {services
                          .sort((a, b) => b.basePrice - a.basePrice)
                          .slice(0, 5)
                          .map((service, index) => (
                            <div
                              key={service._id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{service.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {service.category}
                                    </Badge>
                                    <Badge variant={service.isActive ? "success" : "default"} className="text-xs">
                                      {service.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">
                                  KES {service.basePrice.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                  {service.priceUnit.replace("_", " ")}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Service Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                        <p className="text-sm text-gray-600 mb-1">Total Services</p>
                        <p className="text-3xl font-bold text-gray-900">{services.length}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {services.filter(s => s.isActive).length} active
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-600 mb-1">Avg. Service Price</p>
                        <p className="text-3xl font-bold text-gray-900">
                          KES {services.length > 0 ? (services.reduce((sum, s) => sum + s.basePrice, 0) / services.length).toFixed(0) : 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Across all services</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                        <p className="text-sm text-gray-600 mb-1">Total Features</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {services.reduce((sum, s) => sum + (s.features?.length || 0), 0)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Avg. {services.length > 0 ? (services.reduce((sum, s) => sum + (s.features?.length || 0), 0) / services.length).toFixed(1) : 0} per service
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Booking Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending Bookings</span>
                        <span className="font-semibold text-yellow-600">{stats.pendingBookings || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">In Progress</span>
                        <span className="font-semibold text-blue-600">{stats.inProgressBookings || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="font-semibold text-green-600">{stats.completedBookings || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Paid</span>
                        <span className="font-semibold text-purple-600">{stats.paidBookings || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Quick Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Revenue per Booking</span>
                        <span className="font-semibold text-green-600">
                          KES {stats.totalBookings > 0 ? ((stats.totalRevenue || 0) / stats.totalBookings).toFixed(0) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Tasks</span>
                        <span className="font-semibold text-indigo-600">{tasks.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed Tasks</span>
                        <span className="font-semibold text-green-600">
                          {tasks.filter(t => t.status === "Completed").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Task Completion Rate</span>
                        <span className="font-semibold text-green-600">
                          {tasks.length > 0 ? ((tasks.filter(t => t.status === "Completed").length / tasks.length) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle>Create New Task</CardTitle>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Install bed liner on Toyota Hilux"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="4"
                    placeholder="Provide detailed instructions for this task..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To *
                    </label>
                    <select
                      value={taskForm.assignedTo}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select employee...</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} - {emp.employeeId?.roleTitle || "Technician"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min={dayjs().format("YYYY-MM-DD")}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {loading ? "Creating..." : "Create Task"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create/Edit Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle>{editingService ? "Edit Service" : "Create New Service"}</CardTitle>
                <button
                  onClick={() => {
                    setShowServiceModal(false);
                    setEditingService(null);
                  }}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Premium Bed Liner Coating"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe the service..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="Vehicle Coating">Vehicle Coating</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Unit *
                    </label>
                    <select
                      value={serviceForm.priceUnit}
                      onChange={(e) => setServiceForm({ ...serviceForm, priceUnit: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="per_vehicle">Per Vehicle</option>
                      <option value="per_sqm">Per Square Meter</option>
                      <option value="per_hour">Per Hour</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price (KES) *
                    </label>
                    <input
                      type="number"
                      value={serviceForm.basePrice}
                      onChange={(e) => setServiceForm({ ...serviceForm, basePrice: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={serviceForm.estimatedDuration}
                      onChange={(e) => setServiceForm({ ...serviceForm, estimatedDuration: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 2-3 hours"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={serviceForm.features}
                    onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., UV Protection, Waterproof, Non-slip"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate features with commas</p>
                </div>

                {/* Service Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Image
                  </label>
                  
                  {/* Image Preview */}
                  {serviceImagePreview && (
                    <div className="mb-3 relative">
                      <img
                        src={serviceImagePreview}
                        alt="Service preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveServiceImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* File Input */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          {serviceImageFile ? serviceImageFile.name : "Click to upload image"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleServiceImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or use URL */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Or enter image URL:</p>
                    <input
                      type="url"
                      value={serviceForm.imageUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setServiceForm({ ...serviceForm, imageUrl: url });
                        // Update preview when URL is entered
                        if (url && !serviceImageFile) {
                          setServiceImagePreview(url);
                        } else if (!url) {
                          setServiceImagePreview(null);
                        }
                      }}
                      onBlur={(e) => {
                        // Update preview on blur as well
                        const url = e.target.value;
                        if (url && !serviceImageFile) {
                          // Check if it's a relative URL (from our uploads)
                          const fullUrl = url.startsWith('/') ? `http://localhost:5002${url}` : url;
                          setServiceImagePreview(fullUrl);
                        }
                      }}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg or /uploads/services/image.jpg"
                      disabled={!!serviceImageFile}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {uploadingImage ? "Uploading image..." : loading ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowServiceModal(false);
                      setEditingService(null);
                      setServiceImageFile(null);
                      setServiceImagePreview(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle>Create Employee Account</CardTitle>
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={employeeForm.password}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Employee will use this password to login
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={employeeForm.contact}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, contact: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={employeeForm.roleTitle}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, roleTitle: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "Creating..." : "Create Employee"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowEmployeeModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assign Employee Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle>Assign Employee</CardTitle>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Booking Details</p>
                  <p className="font-medium">
                    {selectedBooking.customerId?.name || selectedBooking.customerId?.email}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(selectedBooking.date)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Employee
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose an employee...</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.employeeId?.roleTitle || "Technician"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAssignEmployee}
                    disabled={loading || !selectedEmployee}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Assigning..." : "Assign"}
                  </Button>
                  <Button
                    onClick={() => setShowAssignModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Update Cost Modal */}
      {showCostModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle>Update Cost Breakdown</CardTitle>
                <button
                  onClick={() => setShowCostModal(false)}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleUpdateCost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materials Cost (KES)
                  </label>
                  <input
                    type="number"
                    value={costForm.materials}
                    onChange={(e) => setCostForm({ ...costForm, materials: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Labor Cost (KES)
                  </label>
                  <input
                    type="number"
                    value={costForm.labor}
                    onChange={(e) => setCostForm({ ...costForm, labor: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Charges (KES)
                  </label>
                  <input
                    type="number"
                    value={costForm.additional}
                    onChange={(e) => setCostForm({ ...costForm, additional: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-purple-600">
                      KES {(costForm.materials + costForm.labor + costForm.additional).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? "Updating..." : "Update Cost"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCostModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
