import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import {
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Menu,
  Package,
  RefreshCw,
  User,
  X,
  AlertCircle,
  FileText,
  Camera,
  Upload,
  Play,
  Pause,
  Coffee
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "../../services/authService";
import API from "../../services/api";

const formatDate = (d) => (d ? dayjs(d).format("DD MMM YYYY HH:mm") : "-");
const formatShortDate = (d) => (d ? dayjs(d).format("MMM DD, YYYY") : "-");

const STATUS_COLORS = {
  Paid: "success",
  Completed: "success",
  "In Progress": "info",
  Pending: "warning",
  Cancelled: "destructive",
};

export default function EmployeeDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [taskStats, setTaskStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  
  // Time tracking state
  const [timeStatus, setTimeStatus] = useState({ status: "clocked-out", entry: null, elapsedHours: 0 });
  const [timeEntries, setTimeEntries] = useState([]);
  
  // Photos state
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoForm, setPhotoForm] = useState({
    bookingId: "",
    type: "before",
    description: "",
    tags: ""
  });
  
  // Update cost modal
  const [showCostModal, setShowCostModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [costForm, setCostForm] = useState({
    materials: 0,
    labor: 0,
    additional: 0
  });

  // View details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setEmployeeInfo(user);
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchBookings(),
      fetchStats(),
      fetchTasks(),
      fetchTaskStats(),
      fetchTimeStatus()
    ]);
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/employee/my/requests");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load bookings");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/employee/my/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      toast.error("Failed to load tasks");
    }
  };

  const fetchTaskStats = async () => {
    try {
      const res = await API.get("/tasks/stats");
      setTaskStats(res.data);
    } catch (err) {
      console.error("Error fetching task stats:", err);
    }
  };

  const fetchTimeStatus = async () => {
    try {
      const res = await API.get("/time/status");
      setTimeStatus(res.data);
    } catch (err) {
      console.error("Error fetching time status:", err);
    }
  };

  const fetchTimeEntries = async () => {
    try {
      const res = await API.get("/time/my-entries");
      setTimeEntries(res.data.entries || []);
    } catch (err) {
      console.error("Error fetching time entries:", err);
      toast.error("Failed to load time entries");
    }
  };

  const fetchPhotos = async (bookingId) => {
    try {
      const res = await API.get(`/photos/booking/${bookingId}`);
      setPhotos(res.data);
    } catch (err) {
      console.error("Error fetching photos:", err);
      toast.error("Failed to load photos");
    }
  };

  const handleClockIn = async () => {
    try {
      await API.post("/time/clock-in", {
        location: "Office", // You can add geolocation here
      });
      toast.success("Clocked in successfully!");
      fetchTimeStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clock in");
    }
  };

  const handleClockOut = async () => {
    try {
      await API.post("/time/clock-out", {
        location: "Office",
      });
      toast.success("Clocked out successfully!");
      fetchTimeStatus();
      fetchTimeEntries();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clock out");
    }
  };

  const handleStartBreak = async () => {
    try {
      await API.post("/time/break/start");
      toast.success("Break started!");
      fetchTimeStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start break");
    }
  };

  const handleEndBreak = async () => {
    try {
      await API.post("/time/break/end");
      toast.success("Break ended!");
      fetchTimeStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end break");
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a photo");
      return;
    }
    if (!photoForm.bookingId) {
      toast.error("Please select a booking");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("bookingId", photoForm.bookingId);
      formData.append("type", photoForm.type);
      formData.append("description", photoForm.description);
      formData.append("tags", photoForm.tags);

      await API.post("/photos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Photo uploaded successfully!");
      setSelectedFile(null);
      setPhotoForm({
        bookingId: "",
        type: "before",
        description: "",
        tags: ""
      });
      fetchPhotos(photoForm.bookingId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await API.delete(`/photos/${photoId}`);
      toast.success("Photo deleted!");
      setPhotos(photos.filter(p => p._id !== photoId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete photo");
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await API.put(`/employee/requests/${bookingId}/status`, { status });
      toast.success(`Status updated to ${status}!`);
      fetchBookings();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status });
      toast.success(`Task status updated to ${status}!`);
      fetchTasks();
      fetchTaskStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task status");
    }
  };

  const handleUpdateCost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/employee/requests/${selectedBooking._id}/status`, {
        costBreakdown: costForm
      });
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

  const menuItems = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "bookings", label: "My Bookings", icon: <Package className="w-5 h-5" />, badge: bookings.filter(b => b.status === "Pending" || b.status === "In Progress").length },
    { id: "tasks", label: "My Tasks", icon: <CheckCircle className="w-5 h-5" />, badge: tasks.filter(t => t.status === "Pending" || t.status === "In Progress").length },
    { id: "timeTracking", label: "Time Clock", icon: <Clock className="w-5 h-5" /> },
    { id: "photos", label: "Photos", icon: <Camera className="w-5 h-5" /> },
  ];

  const getStatusActions = (booking) => {
    const actions = [];
    
    if (booking.status === "Pending") {
      actions.push({
        label: "Start Work",
        onClick: () => handleUpdateStatus(booking._id, "In Progress"),
        className: "bg-blue-600 hover:bg-blue-700",
        icon: <Play className="w-4 h-4" />
      });
    }
    
    if (booking.status === "In Progress") {
      actions.push({
        label: "Update Cost",
        onClick: () => {
          setSelectedBooking(booking);
          setCostForm({
            materials: booking.costBreakdown?.materials || 0,
            labor: booking.costBreakdown?.labor || 0,
            additional: booking.costBreakdown?.additional || 0
          });
          setShowCostModal(true);
        },
        className: "bg-purple-600 hover:bg-purple-700",
      });
      
      actions.push({
        label: "Mark as Paid",
        onClick: () => {
          if (window.confirm("Confirm that payment has been received?")) {
            handleUpdateStatus(booking._id, "Paid");
          }
        },
        className: "bg-green-600 hover:bg-green-700",
      });
    }
    
    if (booking.status === "Paid") {
      actions.push({
        label: "Mark as Completed",
        onClick: () => {
          if (window.confirm("Mark this booking as completed?")) {
            handleUpdateStatus(booking._id, "Completed");
          }
        },
        className: "bg-green-600 hover:bg-green-700",
      });
    }
    
    if (booking.status !== "Completed" && booking.status !== "Cancelled") {
      actions.push({
        label: "Cancel",
        onClick: () => {
          if (window.confirm("Are you sure you want to cancel this booking?")) {
            handleUpdateStatus(booking._id, "Cancelled");
          }
        },
        className: "bg-red-600 hover:bg-red-700",
      });
    }
    
    return actions;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 flex pt-20">
      {/* Desktop Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r shadow-lg transition-all duration-300 fixed h-full z-20 top-20 hidden md:block`}>
        <div className="p-4 border-b flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              
              <div>
                <h2 className="font-bold text-gray-900">Employee</h2>
                <p className="text-xs text-gray-500">{employeeInfo?.name || 'Dashboard'}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  ? "bg-purple-600 text-gray-900 shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {isSidebarOpen && (
                <>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <Badge className="bg-red-500 text-gray-900 text-xs px-2 py-0.5">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
              {!isSidebarOpen && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <nav className="flex justify-around items-center py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                activeView === item.id
                  ? "text-purple-600"
                  : "text-gray-400"
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 p-4 sm:p-6 pb-20 md:pb-6`}>
        {/* Overview */}
        {activeView === "overview" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">Welcome back, {employeeInfo?.name || 'Employee'}!</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => window.open('/', '_blank')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 !text-gray-900 hover:!text-gray-900 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Site
                </Button>
                <Button onClick={fetchData} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="border-l-4 border-purple-500">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Total Bookings</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalAssigned || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">In Progress</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.inProgress || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-green-500">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Completed</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.completed || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-yellow-500">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Pending Tasks</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{taskStats.pendingTasks || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    onClick={() => setActiveView("bookings")}
                    className="bg-purple-600 hover:bg-purple-700 justify-start"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    View Bookings
                  </Button>
                  <Button
                    onClick={() => setActiveView("tasks")}
                    className="bg-blue-600 hover:bg-blue-700 justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    View Tasks
                  </Button>
                  <Button
                    onClick={fetchData}
                    variant="outline"
                    className="justify-start"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 cursor-pointer"
                      onClick={() => setActiveView("bookings")}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base text-gray-900 truncate">
                            {booking.customerId?.name || booking.customerId?.email || "Unknown"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">{formatShortDate(booking.date)}</p>
                        </div>
                      </div>
                      <Badge variant={STATUS_COLORS[booking.status] || "default"} className="self-start sm:self-center">
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                      <p className="text-sm">No bookings assigned yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Admin Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks from Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 cursor-pointer"
                      onClick={() => setActiveView("tasks")}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base text-gray-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {task.dueDate ? `Due: ${formatShortDate(task.dueDate)}` : "No deadline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant={
                          task.priority === "High" ? "destructive" :
                          task.priority === "Medium" ? "warning" : "default"
                        } className="text-xs">
                          {task.priority}
                        </Badge>
                        <Badge variant={
                          task.status === "Completed" ? "success" :
                          task.status === "In Progress" ? "info" : "warning"
                        }>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                      <p className="text-sm">No tasks assigned yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tasks View */}
        {activeView === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bookings</h1>
              <Button onClick={fetchBookings} variant="outline" size="sm">
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                         
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                                {booking.customerId?.name || booking.customerId?.email || "Unknown Customer"}
                              </h3>
                              <Badge variant={STATUS_COLORS[booking.status] || "default"}>
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-3">
                              {booking.serviceType === "vehicle" ? "Vehicle Service" : "Custom Service"}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                              <div>
                                <p className="text-gray-400">Scheduled Date</p>
                                <p className="font-medium">{formatShortDate(booking.date)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Customer Email</p>
                                <p className="font-medium truncate">{booking.customerId?.email || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Current Cost</p>
                                <p className="font-medium text-green-600">
                                  KES {(booking.costBreakdown?.total || 0).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400">Assigned</p>
                                <p className="font-medium">{formatShortDate(booking.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                        {getStatusActions(booking).map((action, idx) => (
                          <Button
                            key={idx}
                            onClick={action.onClick}
                            size="sm"
                            className={action.className}
                          >
                            {action.icon}
                            <span className="ml-1">{action.label}</span>
                          </Button>
                        ))}

                        <Button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {bookings.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No tasks assigned yet</p>
                    <p className="text-sm text-gray-400">Tasks will appear here when assigned by admin</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Tasks View - Admin Assigned Tasks */}
        {activeView === "tasks" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-sm text-gray-400 mt-1">Tasks assigned by admin</p>
              </div>
              <Button onClick={fetchTasks} variant="outline" size="sm">
                Refresh
              </Button>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="border-l-4 border-yellow-500">
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.pendingTasks || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-blue-500">
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.inProgressTasks || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-green-500">
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.completedTasks || 0}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-purple-500">
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.totalTasks || 0}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
                            <Badge variant={
                              task.status === "Completed" ? "success" :
                              task.status === "In Progress" ? "info" :
                              task.status === "Pending" ? "warning" : "default"
                            }>
                              {task.status}
                            </Badge>
                            <Badge variant={
                              task.priority === "High" ? "destructive" :
                              task.priority === "Medium" ? "warning" : "default"
                            } className="text-xs">
                              {task.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{task.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-400">Created By</p>
                              <p className="font-medium">{task.createdBy?.name || "Admin"}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Due Date</p>
                              <p className="font-medium">{task.dueDate ? formatShortDate(task.dueDate) : "No deadline"}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Created</p>
                              <p className="font-medium">{formatShortDate(task.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Last Updated</p>
                              <p className="font-medium">{formatShortDate(task.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Task Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                        {task.status === "Pending" && (
                          <Button
                            onClick={() => handleUpdateTaskStatus(task._id, "In Progress")}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start Task
                          </Button>
                        )}
                        
                        {task.status === "In Progress" && (
                          <Button
                            onClick={() => {
                              if (window.confirm("Mark this task as completed?")) {
                                handleUpdateTaskStatus(task._id, "Completed");
                              }
                            }}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Complete Task
                          </Button>
                        )}

                        {task.status !== "Completed" && task.status !== "Cancelled" && (
                          <Button
                            onClick={() => {
                              if (window.confirm("Cancel this task?")) {
                                handleUpdateTaskStatus(task._id, "Cancelled");
                              }
                            }}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {tasks.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No tasks assigned yet</p>
                    <p className="text-sm text-gray-400">Tasks assigned by admin will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Time Tracking View */}
        {activeView === "timeTracking" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Time Clock</h1>
              <Button onClick={fetchTimeEntries} variant="outline" size="sm">
                Refresh
              </Button>
            </div>

            {/* Current Status Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {timeStatus.status === "clocked-in" ? "Currently Working" : 
                       timeStatus.status === "on-break" ? "On Break" : "Not Clocked In"}
                    </h2>
                    {timeStatus.status !== "clocked-out" && (
                      <p className="text-lg text-purple-600 mt-2">
                        {timeStatus.elapsedHours} hours elapsed
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {timeStatus.status === "clocked-out" && (
                      <Button
                        onClick={handleClockIn}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        Clock In
                      </Button>
                    )}

                    {timeStatus.status === "clocked-in" && (
                      <>
                        <Button
                          onClick={handleStartBreak}
                          className="bg-yellow-600 hover:bg-yellow-700"
                          size="lg"
                        >
                          <Coffee className="w-5 h-5 mr-2" />
                          Start Break
                        </Button>
                        <Button
                          onClick={handleClockOut}
                          className="bg-red-600 hover:bg-red-700"
                          size="lg"
                        >
                          <Pause className="w-5 h-5 mr-2" />
                          Clock Out
                        </Button>
                      </>
                    )}

                    {timeStatus.status === "on-break" && (
                      <Button
                        onClick={handleEndBreak}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        End Break
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Time Entries</CardTitle>
              </CardHeader>
              <CardContent>
                {timeEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                    <p className="text-sm">No time entries yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {timeEntries.slice(0, 10).map((entry) => (
                      <div
                        key={entry._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatShortDate(entry.date)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {dayjs(entry.clockIn).format("HH:mm")} - {entry.clockOut ? dayjs(entry.clockOut).format("HH:mm") : "In Progress"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">
                            {entry.totalHours ? `${entry.totalHours.toFixed(2)} hrs` : "Ongoing"}
                          </p>
                          <Badge variant={entry.status === "completed" ? "success" : "info"} className="text-xs">
                            {entry.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Photos View */}
        {activeView === "photos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Photo Documentation</h1>
            </div>

            {/* Upload Photo Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Upload Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePhotoUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Booking *
                    </label>
                    <select
                      value={photoForm.bookingId}
                      onChange={(e) => {
                        setPhotoForm({ ...photoForm, bookingId: e.target.value });
                        if (e.target.value) fetchPhotos(e.target.value);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Choose a booking...</option>
                      {bookings.map((booking) => (
                        <option key={booking._id} value={booking._id}>
                          {booking.customerId?.name || booking.customerId?.email} - {formatShortDate(booking.date)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo Type *
                      </label>
                      <select
                        value={photoForm.type}
                        onChange={(e) => setPhotoForm({ ...photoForm, type: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="before">Before</option>
                        <option value="during">During</option>
                        <option value="after">After</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo File *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={photoForm.description}
                      onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows="2"
                      placeholder="Add notes about this photo..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={photoForm.tags}
                      onChange={(e) => setPhotoForm({ ...photoForm, tags: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., bed liner, coating, inspection"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? "Uploading..." : "Upload Photo"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Photos Gallery */}
            {photoForm.bookingId && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos for Selected Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  {photos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Camera className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                      <p className="text-sm">No photos uploaded yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photos.map((photo) => (
                        <div key={photo._id} className="relative group">
                          <img
                            src={`${import.meta.env.VITE_API_URL}${photo.url}`}
                            alt={photo.description}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                            <Button
                              onClick={() => handleDeletePhoto(photo._id)}
                              size="sm"
                              variant="destructive"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Delete
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {photo.type}
                            </Badge>
                            {photo.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {photo.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Update Cost Modal */}
      {showCostModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-md">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-gray-900">
                <div className="flex items-center justify-between">
                  <CardTitle>Update Cost Breakdown</CardTitle>
                  <button
                    onClick={() => setShowCostModal(false)}
                    className="text-gray-900 hover:bg-white/20 p-1 rounded"
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

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-lg">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900">
                <div className="flex items-center justify-between">
                  <CardTitle>Booking Details</CardTitle>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-900 hover:bg-white/20 p-1 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400">Customer</p>
                      <p className="font-medium text-lg truncate">
                        {selectedBooking.customerId?.name || selectedBooking.customerId?.email}
                      </p>
                      {selectedBooking.customerId?.email && selectedBooking.customerId?.name && (
                        <p className="text-sm text-gray-500 truncate">{selectedBooking.customerId.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Service Type</p>
                      <p className="font-medium">
                        {selectedBooking.serviceType === "vehicle" ? "Vehicle Service" : "Custom Service"}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Status</p>
                      <Badge variant={STATUS_COLORS[selectedBooking.status] || "default"}>
                        {selectedBooking.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-400">Scheduled Date</p>
                    </div>
                    <p className="font-medium">{formatDate(selectedBooking.date)}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-sm font-semibold text-gray-700">Cost Breakdown</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-400">Materials</span>
                        <span className="font-medium">
                          KES {(selectedBooking.costBreakdown?.materials || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-400">Labor</span>
                        <span className="font-medium">
                          KES {(selectedBooking.costBreakdown?.labor || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-400">Additional</span>
                        <span className="font-medium">
                          KES {(selectedBooking.costBreakdown?.additional || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t-2 border-gray-200 p-2 bg-purple-50 rounded">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-purple-600 text-lg">
                          KES {(selectedBooking.costBreakdown?.total || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-400">Additional Information</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-400">Created:</span> <span className="font-medium">{formatDate(selectedBooking.createdAt)}</span></p>
                      <p><span className="text-gray-400">Last Updated:</span> <span className="font-medium">{formatDate(selectedBooking.updatedAt)}</span></p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowDetailsModal(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
