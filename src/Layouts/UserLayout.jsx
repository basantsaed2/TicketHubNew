import { Footer, Navbar } from './Components/Components';
import './index.css';
import { Outlet, useLocation } from 'react-router-dom';

const UserLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="w-full bg-[#f8fafc] flex flex-col min-h-screen relative">
      <div className={`w-full z-[100] ${isHome ? 'fixed top-0 left-0 right-0 transition-colors duration-300' : 'sticky top-0 bg-white shadow-sm'}`}>
        <Navbar />
      </div>
      
      {/* Main Content Area */}
      <div className={`w-full flex-grow mb-5 ${isHome ? 'p-0' : 'px-5 mt-6 max-w-7xl mx-auto'}`}>
        <Outlet />
      </div>
      
      <div className="mt-auto">
         <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
