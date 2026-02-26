import React, { useState } from 'react';
import { Links } from '../Component';
import { Link, useLocation } from 'react-router-dom';
import { MdFavoriteBorder, MdRestaurantMenu } from 'react-icons/md';
import { FaCartShopping } from "react-icons/fa6";
import { LuUserRound } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import MainIcon from '../../Assets/Icons/MainIcon';
import { TbLogout } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Auth';
import { MdMenuOpen } from "react-icons/md";
import LogoImage from '../../Assets/Images/Logo.png'
const Navbar = () => {
       const location = useLocation();
       const user = useSelector(state => state.user?.data);
       const [pages] = useState(['/auth/login', '/auth/sign_up']);
       const [toggleOpen, setToggleOpen] = useState(false);
       const auth = useAuth();
       const navigate = useNavigate();

       const handleLogout = () => {
              auth.logout();
              navigate('/', { replace: true })
       }
       return (
              <>
                     {pages.some(page => location.pathname === page) ? (
                            ''
                     ) : (
                            <nav className='relative w-full flex align-center justify-between py-2 px-6 bg-mainColor shadow-md'>
                                   <div className='sm:w-9/12 lg:w-3/12 flex items-center justify-start gap-x-2 z-10'>
                                          <Link to={'/'} className="flex items-center justify-start gap-x-2">
                                                 {/* <MainIcon/> */}
                                                 <div className="w-48 h-14 rounded-full flex items-center justify-center">
                                                        <img src={LogoImage} className='rounded-full object-cover w-full h-full' alt="Main Icon" />
                                                 </div> 
                                                 {/* <span className='text-3xl text-secoundColor font-TextFontRegular'>Ticket Hub</span> */}
                                          </Link>
                                   </div>
                                   {
                                          user && (
                                                 <div className='sm:hidden lg:flex w-5/12 items-center'>
                                                        <Links />
                                                 </div>
                                          )
                                   }

                                   <div className='sm:hidden xl:flex w-3/12 items-center justify-end gap-x-4'>

                                          {user ? (
                                                 <>
                                                        {/* <Link to={'/cart'}>
                                                               <FaCartShopping className='text-white text-3xl'/>
                                                        </Link> */}
                                                        <Link to={'/profile'}>
                                                               <LuUserRound className='text-white text-3xl' />
                                                        </Link>
                                                        <Link onClick={handleLogout}>
                                                               <TbLogout className='text-white text-3xl' />
                                                        </Link>
                                                 </>
                                          ) : (
                                                 <>

                                                        <Link
                                                               to={'/auth/login'}
                                                               className='text-xl text-secoundColor border-2 border-secoundColor hover:bg-secoundColor hover:text-white font-TextFontRegular px-5 py-1 rounded-md'
                                                        >
                                                               Login
                                                        </Link>
                                                        <Link
                                                               to={'/auth/sign_up'}
                                                               className='text-xl text-secoundColor border-2 border-secoundColor hover:bg-secoundColor hover:text-white font-TextFontRegular px-5 py-1 rounded-md'
                                                        >
                                                               SignUp
                                                        </Link>
                                                 </>
                                          )}
                                   </div>
                                   <div className='xl:hidden flex items-center justify-center'>
                                          <MdMenuOpen
                                                 onClick={() => setToggleOpen(!toggleOpen)}
                                                 className='text-white text-4xl cursor-pointer z-10'
                                          />
                                   </div>

                                   {/* Mobile Navbar  */}
                                   <div
                                          className={`w-full absolute ${toggleOpen ? 'top-16' : '-top-[400px]'
                                                 } transition-all duration-300 left-0 bg-white shadow-md sm:flex xl:hidden flex-col items-center justify-center px-4 pb-3 rounded-br-3xl rounded-bl-3xl z-20`}
                                   >
                                          {user && (
                                                 <div className='w-full flex flex-col'>
                                                        <Link
                                                               to={'/'}
                                                               className='w-full text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                                               onClick={() => setToggleOpen(false)}
                                                        >
                                                               Home
                                                        </Link>
                                                        <Link
                                                               to={'/my_trips'}
                                                               className='w-full text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                                               onClick={() => setToggleOpen(false)}
                                                        >
                                                               My Trips
                                                        </Link>
                                                        <Link
                                                               to={'/wallet'}
                                                               className='w-full text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                                               onClick={() => setToggleOpen(false)}
                                                        >
                                                               Wallet
                                                        </Link>
                                                        <Link
                                                               to={'/points'}
                                                               className='w-full text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                                               onClick={() => setToggleOpen(false)}
                                                        >
                                                               Points
                                                        </Link>
                                                 </div>
                                          )}
                                          <div className='flex flex-col w-full items-center justify-center gap-y-2'>
                                                 {user ? (

                                                        <div className='w-full flex flex-col items-center justify-center gap-x-3'>
                                                               {/* <Link
                                                                      to={'/favorites'}
                                                                      className='w-full flex items-center gap-3 text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                                                      onClick={() => setToggleOpen(false)}
                                                               >
                                                                      <MdFavoriteBorder className='text-mainColor text-2xl' /> Favorites
                                                               </Link>
                                                               <Link
                                                                      to={'/cart'}
                                                                      className='w-full flex items-center gap-3 text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                                                      onClick={() => setToggleOpen(false)}
                                                               >
                                                                      <FaCartShopping /> Cart
                                                               </Link> */}
                                                               <Link
                                                                      to={'/profile'}
                                                                      className='w-full flex items-center gap-3 text-xl font-TextFontMedium text-mainColor border-b-2 p-3 pb-1'
                                                                      onClick={() => setToggleOpen(false)}
                                                               >
                                                                      <LuUserRound className='text-mainColor text-2xl' /> Profile
                                                               </Link>
                                                        </div>
                                                 ) : (
                                                        <>

                                                               <Link
                                                                      to={'/auth/login'}
                                                                      onClick={() => setToggleOpen(false)}
                                                                      className='w-full text-center text-xl text-mainColor border-2 border-mainColor font-TextFontRegular px-5 py-1 rounded-full'
                                                               >
                                                                      Login
                                                               </Link>
                                                               <Link
                                                                      to={'/auth/sign_up'}
                                                                      onClick={() => setToggleOpen(false)}
                                                                      className='w-full text-center text-xl text-white bg-mainColor border-2 border-mainColor font-TextFontRegular px-5 py-1 rounded-full'
                                                               >
                                                                      SignUp
                                                               </Link>
                                                        </>
                                                 )}
                                          </div>
                                   </div>
                            </nav>
                     )}
              </>
       );
};

export default Navbar;
