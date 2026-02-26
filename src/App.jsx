import { useEffect, useRef } from 'react';
import { Footer,Navbar } from './Components/Component';
import './index.css';
import { Outlet, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const scrollContainerRef = useRef(null); // Ref for the scrollable container

  /* Scroll to Top when page changes */
  useEffect(() => {
    if (location.pathname && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [location.pathname]);;

  return (
    <div
      ref={scrollContainerRef}
      className='relative w-full bg-white flex flex-col items-center justify-between h-screen custom-scrollbar overflow-y-auto overflow-x-hidden'>
      <div className="sticky top-0 w-full z-30">
        <Navbar />
      </div>
      {/* Main Content Area */}
      <div className="w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;
