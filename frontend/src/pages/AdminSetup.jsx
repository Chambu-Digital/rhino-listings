import { Shield, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../services/api';

export default function AdminSetup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const res = await API.post('/auth/create-first-admin', form);
      
      toast.success('Admin account created successfully! Redirecting to login...');
      
      // Clear form
      setForm({ name: '', email: '', password: '' });
      
      // Redirect to admin login page
      setTimeout(() => {
        nav('/admin/login', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Admin setup error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create admin account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 pt-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
         
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Administrator Setup</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Admin Setup</h2>
          <p className="text-gray-400">Create the first administrator account</p>
        </div>

        {/* Setup Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
          {/* <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>⚠️ Important:</strong> This page creates the first admin account. 
              After creation, this endpoint will be disabled for security.
            </p>
          </div> */}

          <form onSubmit={submit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Admin Name"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@rhinolinings.com"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Strong password (min 6 characters)"
                  className="block w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-500"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg uppercase tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating admin account...
                </span>
              ) : (
                'Create Admin Account'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-xs text-gray-300">
              <strong className="text-orange-500">Next Steps:</strong> After creating the admin account, you can:
            </p>
            <ul className="text-xs text-gray-400 mt-2 space-y-1 ml-4 list-disc">
              <li>Create employee accounts from the admin dashboard</li>
              <li>Manage all bookings and quotations</li>
              <li>Assign tasks to employees</li>
            </ul>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            🔒 This is a one-time setup. The endpoint will be disabled after first admin creation.
          </p>
        </div>
      </div>
    </div>
  );
}
