import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from 'react-icons/fa';
import LogoImage from '../../Assets/Images/Logo.png'
import { useSelector } from 'react-redux';

const Footer = () => {
  const user = useSelector(state => state.user?.data);
  return (
    <footer className="footer  w-full text-black py-12">
      <div className={`max-w-7xl mx-auto px-6 grid grid-cols-1 ${user ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'} gap-10 items-start`}>
        {/* Left Section */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-32 h-14 rounded-full flex items-center justify-center">
              <img src={LogoImage} className='rounded-full object-cover w-full h-full' alt="Main Icon" />
            </div>
          </div>
          <p className="text-base text-gray-700 leading-relaxed mb-5">
            Your Journey, Our Priority – Book with confidence and travel with ease.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-black hover:text-secoundColor text-xl">
              <FaFacebookF />
            </a>
            <a href="#" className="text-black hover:text-secoundColor text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-black hover:text-secoundColor text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-black hover:text-secoundColor text-xl">
              <FaYoutube />
            </a>
          </div>
          <p className="text-sm mt-6 text-gray-600">© 2023 All rights reserved</p>
        </div>

        {/* Center Section - Quick Links */}
        {
          user && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
              <ul className="text-base text-gray-800 space-y-3 pl-2">
                <li className="flex items-center gap-2">
                  <span className="text-black text-sm">➤</span>
                  <NavLink to="/" className="hover:underline">Home</NavLink>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-black text-sm">➤</span>
                  <NavLink to="/my_trips" className="hover:underline">My Trips</NavLink>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-black text-sm">➤</span>
                  <NavLink to="/points" className="hover:underline">Points</NavLink>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-black text-sm">➤</span>
                  <NavLink to="/profile" className="hover:underline">Profile</NavLink>
                </li>
              </ul>
            </div>
          )
        }

        {/* Right Section - Newsletter */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Stay Updated – Subscribe Now!</h2>
          <form className="flex border border-gray-400 rounded-md overflow-hidden w-full max-w-md shadow-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-4 text-sm outline-none text-white bg-mainColor"
            />
            <button
              type="submit"
              className="bg-black text-white px-5 text-lg hover:bg-gray-800 transition"
            >
              ➤
            </button>
          </form>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed mt-2">
            Join our newsletter and be the first to know about special discounts, new destinations, and exciting travel tips. Get insider access to exclusive promotions and plan your trips smarter!
          </p>
          <p className="text-sm font-medium mt-2">
            Start your <span className="text-black font-semibold">journey with us!</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
