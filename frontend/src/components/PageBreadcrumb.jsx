import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const PageBreadcrumb = () => {
  const location = useLocation();
  
  // Map paths to readable names
  const pathMap = {
    '/': 'Home',
    '/services': 'Services',
    '/about': 'About Us',
    '/contact': 'Contact Us'
  };

  // Get current page name
  const currentPage = pathMap[location.pathname] || 'Page';
<br></br>
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <Link 
            to="/" 
            className="flex items-center gap-1 text-gray-400 hover:text-yellow-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{currentPage}</span>
        </div>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
