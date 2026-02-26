// import { Footer,Navbar } from './Components/Components';
// import './index.css';
// import { Outlet } from 'react-router-dom';
// const UserLayout = () => {
//   return (
//     <div className='relative w-full bg-white flex flex-col items-center justify-between h-screen overflow-y-scroll overflow-x-hidden'>
//         <div className="sticky top-0 w-full z-30">
//             <Navbar />
//         </div>
//         {/* Main Content Area */}
//         <div className="w-full mb-5">
//             <Outlet />
//         </div>
//         <Footer />
//     </div>
//   );
// };

// export default UserLayout;


import { Footer, Navbar } from './Components/Components';
import './index.css';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      <div className="sticky top-0 w-full z-30">
        <Navbar />
      </div>
      {/* Main Content Area */}
      <div className="w-full flex-grow px-5 mb-5">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
