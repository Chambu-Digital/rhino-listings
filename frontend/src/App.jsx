import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import AdminSetup from "./pages/AdminSetup";
import TrackProgress from "./pages/TrackProgress";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";
import UserDashboard from "./pages/dashboards/UserDashboard";
import AdminLogin from "./pages/auth/AdminLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import { getCurrentUser, initializeAuth } from "./services/authService";

function App() {
  useEffect(() => {
    initializeAuth();
    // Trigger a global "userChanged" event so components can react
    window.dispatchEvent(new Event("userChanged"));
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  
  // Hide footer on dashboard pages
  const isDashboardPage = location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/employee') || 
                          location.pathname.startsWith('/user');

  return (
    <>
      {/* 🔝 Navbar stays visible for all routes */}
      <Navbar />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <ErrorBoundary>

      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Customer Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/account/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Staff Login Portals - Hidden, accessed via direct URL */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/admin-setup" element={<AdminSetup />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/track-progress"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <TrackProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🚀 Smart unified dashboard redirect */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "employee", "user"]}>
              {(() => {
                const user = getCurrentUser();
                if (user?.role === "admin") return <AdminDashboard />;
                if (user?.role === "employee") return <EmployeeDashboard />;
                return <UserDashboard />;
              })()}
            </ProtectedRoute>
          }
        />
      </Routes>
      
      {/* Footer - Show on public pages only */}
      {!isDashboardPage && <Footer />}
      
      </ErrorBoundary>
    </>
  );
}

export default App;