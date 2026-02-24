import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function EmployeeLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { ...formData, role: 'employee' });
      const { token, user } = res.data;

      if (user.role !== "employee") {
        if (user.role === "admin") {
          toast.error("Wrong portal! Redirecting to Admin Login...", { duration: 3000 });
          setTimeout(() => navigate("/admin/login"), 1500);
        } else if (user.role === "user") {
          toast.error("Wrong portal! Redirecting to Customer Login...", { duration: 3000 });
          setTimeout(() => navigate("/account/login"), 1500);
        } else {
          toast.error("Access denied. Employee credentials required.");
        }
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Set token in API headers
      const { setAuthToken } = await import("../../services/api");
      setAuthToken(token);
      
      // Trigger global user change event
      window.dispatchEvent(new Event("userChanged"));
      
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/employee/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 pt-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Employee Portal</h1>
          <p className="text-gray-400">Rhino Linings Team Access</p>
        </div>

        {/* Login Card */}
        <Card className="border border-gray-800 shadow-2xl bg-gray-900">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <br></br>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Employee Access Only</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Team Login</h2>
              <p className="text-gray-400">Access your tasks and assignments</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="employee@rhinolinings.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-700 rounded focus:ring-orange-500" />
                  <span className="ml-2 text-sm text-gray-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-400 font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  "Sign In Securely"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">Need different access?</span>
              </div>
            </div>

            {/* Alternative Logins */}
            {/* <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center mb-2">Not an employee?</p>
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-800 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors font-medium"
              >
                <span>Admin Login</span>
              </Link>
              <Link
                to="/account/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-800 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors font-medium"
              >
                <span>Customer Login</span>
              </Link>
            </div> */}

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Need help?{" "}
                <Link to="/contact" className="text-orange-500 hover:text-orange-400 font-medium">
                  Contact Admin
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-semibold text-orange-500">Employee Portal:</span> Access your work assignments
            </p>
            <p className="text-xs text-gray-400">
              View tasks, update job progress, and manage customer requests
            </p>
          </div>
          <p className="text-sm text-gray-500">© 2024 Rhino Linings. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
