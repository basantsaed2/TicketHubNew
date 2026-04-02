import React, { useState, useEffect } from 'react';
import { Links } from '../Component';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdFavoriteBorder, MdRestaurantMenu, MdMenuOpen, MdClose } from 'react-icons/md';
import { LuUserRound } from 'react-icons/lu';
import { TbLogout } from "react-icons/tb";
import { ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../Context/Auth';
import LogoImage from '../../Assets/Images/Logo.png';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const user = useSelector(state => state.user?.data);
  const [pages] = useState(['/auth/login', '/auth/sign_up']);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    auth.logout();
    navigate('/', { replace: true });
  };

  if (pages.some(page => location.pathname === page)) return null;

  const isTransparent = isHome && !scrolled;
  const navBgClass = isTransparent 
    ? 'bg-transparent py-5' 
    : 'bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_-10px_rgba(0,0,0,0.1)] py-3';
    
  const textClass = isTransparent ? 'text-white' : 'text-slate-800';
  const linkHoverClass = isTransparent ? 'hover:text-white/80' : 'hover:text-orange-500';

  return (
    <nav className={`w-full flex items-center justify-between px-6 lg:px-12 transition-all duration-500 ease-in-out ${navBgClass}`}>
      
      {/* Brand Logo */}
      <div className='flex items-center justify-start z-10'>
        <Link to={'/'} className="flex items-center justify-start">
          <div className={`h-16 sm:h-[80px] md:h-[100px] lg:h-[120px] flex items-center justify-start transition-all duration-300 opacity-100`}>
            <img src={LogoImage} className='object-contain w-auto h-full drop-shadow-sm' alt="TicketHub Logo" />
          </div> 
        </Link>
      </div>

      {/* Desktop Links */}
      {user && (
        <div className='hidden lg:flex items-center justify-center flex-1 px-8 gap-8'>
           <Link to={'/'} className={`font-black uppercase tracking-wider text-[13px] ${textClass} ${linkHoverClass} transition-colors`}>Home</Link>
           <Link to={'/my_trips'} className={`font-black uppercase tracking-wider text-[13px] ${textClass} ${linkHoverClass} transition-colors`}>My Trips</Link>
           <Link to={'/wallet'} className={`font-black uppercase tracking-wider text-[13px] ${textClass} ${linkHoverClass} transition-colors`}>Wallet</Link>
           <Link to={'/points'} className={`font-black uppercase tracking-wider text-[13px] ${textClass} ${linkHoverClass} transition-colors`}>Points</Link>
        </div>
      )}

      {/* Desktop Auth */}
      <div className='hidden lg:flex items-center justify-end gap-x-5 flex-1'>
        {user ? (
          <>
            <Link to={'/profile'} className={`p-2 rounded-full transition-colors ${textClass} hover:bg-black/10`}>
              <LuUserRound className='text-2xl' />
            </Link>
            <Link onClick={handleLogout} className={`p-2 rounded-full transition-colors ${textClass} hover:bg-black/10`}>
              <TbLogout className='text-2xl' />
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
             <Link
               to={'/auth/login'}
               className={`font-black px-6 py-2.5 rounded-full transition-all duration-300 text-[13px] uppercase tracking-wider ${
                 isTransparent 
                   ? 'text-white border-2 border-white/40 hover:bg-white hover:text-slate-900 shadow-sm' 
                   : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
               }`}
             >
               Log in
             </Link>
             <Link
               to={'/auth/sign_up'}
               className={`font-black px-6 py-2.5 rounded-full transition-all duration-300 text-[13px] uppercase tracking-wider ${
                 isTransparent 
                   ? 'text-slate-900 bg-white hover:scale-105 shadow-xl hover:shadow-white/20' 
                   : 'text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg'
               }`}
             >
               Sign Up
             </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className='lg:hidden flex items-center z-[110] relative'>
        {toggleOpen ? (
          <MdClose
            onClick={() => setToggleOpen(false)}
            className="text-[38px] cursor-pointer text-slate-800 transition-transform duration-300 hover:rotate-90 hover:scale-110 active:scale-95"
          />
        ) : (
          <MdMenuOpen
            onClick={() => setToggleOpen(true)}
            className={`text-4xl cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 ${textClass}`}
          />
        )}
      </div>

      {/* Mobile Menu Dim Backdrop */}
      {toggleOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-[40] lg:hidden backdrop-blur-[2px] transition-opacity duration-300" 
          onClick={() => setToggleOpen(false)} 
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 w-[85%] max-w-[380px] h-[100dvh] bg-gradient-to-b from-white to-slate-50 shadow-[-30px_0_60px_rgba(0,0,0,0.15)] flex flex-col items-center pt-4 px-6 pb-10 transition-transform duration-[500ms] ease-[cubic-bezier(0.25,1,0.5,1)] z-[100] ${
          toggleOpen ? 'translate-x-0' : 'translate-x-[110%]'
        } lg:hidden overflow-y-auto border-l border-slate-100/50`}
      >
        {/* Drawer Header Logo */}
        <div className="w-full flex justify-center pb-8 mb-8 border-b border-slate-100">
          <img src={LogoImage} className="h-20 w-auto object-contain drop-shadow-md" alt="TicketHub Brand" />
        </div>

        {user && (
          <div className='w-full flex flex-col gap-2 mb-6 flex-grow'>
            <Link to={'/'} onClick={() => setToggleOpen(false)} className='group flex justify-between items-center w-full text-[16px] font-black text-slate-700 hover:text-orange-500 bg-transparent hover:bg-orange-50/80 rounded-2xl py-4 px-5 active:scale-[0.98] transition-all'>
              <span>Home</span>
              <ChevronRight className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" size={20} />
            </Link>
            <Link to={'/my_trips'} onClick={() => setToggleOpen(false)} className='group flex justify-between items-center w-full text-[16px] font-black text-slate-700 hover:text-orange-500 bg-transparent hover:bg-orange-50/80 rounded-2xl py-4 px-5 active:scale-[0.98] transition-all'>
              <span>My Trips</span>
              <ChevronRight className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" size={20} />
            </Link>
            <Link to={'/wallet'} onClick={() => setToggleOpen(false)} className='group flex justify-between items-center w-full text-[16px] font-black text-slate-700 hover:text-orange-500 bg-transparent hover:bg-orange-50/80 rounded-2xl py-4 px-5 active:scale-[0.98] transition-all'>
              <span>Wallet</span>
              <ChevronRight className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" size={20} />
            </Link>
            <Link to={'/points'} onClick={() => setToggleOpen(false)} className='group flex justify-between items-center w-full text-[16px] font-black text-slate-700 hover:text-orange-500 bg-transparent hover:bg-orange-50/80 rounded-2xl py-4 px-5 active:scale-[0.98] transition-all'>
              <span>Points</span>
              <ChevronRight className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" size={20} />
            </Link>
          </div>
        )}
        
        <div className='w-full flex flex-col gap-4 mt-auto border-t border-slate-100 pt-8'>
          {user ? (
            <div className="flex flex-col gap-3 w-full pb-2">
              <Link to={'/profile'} onClick={() => setToggleOpen(false)} className='w-full flex items-center justify-center gap-3 text-[15px] font-black text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl py-4 active:scale-95 transition-all shadow-sm uppercase tracking-[2px]'>
                <LuUserRound className='text-2xl' /> Profile
              </Link>
              <button 
                onClick={() => { setToggleOpen(false); handleLogout(); }} 
                className='w-full flex items-center justify-center gap-3 text-[15px] font-black text-white bg-red-500 hover:bg-red-600 rounded-xl py-4 active:scale-[0.98] transition-all shadow-md shadow-red-500/20 uppercase tracking-[2px]'
              >
                <TbLogout className='text-2xl' /> Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <Link to={'/auth/login'} onClick={() => setToggleOpen(false)} className='w-full text-center text-[14px] text-slate-700 font-black bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-orange-400 hover:text-orange-500 uppercase tracking-[2px] py-4 rounded-xl active:scale-[0.98] transition-all shadow-sm'>
                Log In
              </Link>
              <Link to={'/auth/sign_up'} onClick={() => setToggleOpen(false)} className='w-full text-center text-[14px] text-white font-black bg-gradient-to-r from-orange-500 to-orange-400 uppercase tracking-[2px] py-4 rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-orange-500/30'>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
