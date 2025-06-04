import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa';
import useDarkMode from '../hooks/useDarkMode';
import Axios from '../utils/axios';
import SummaryApi from '../common/summaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/axiosToastError';
import Logo from '../assets/Logo.jpg'

import {
  User, Mail, Star, Code, Trophy,
  ShieldCheck, LogOut
} from 'lucide-react';
import { useUser } from '../context/userContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const { user, setUser } = useUser();
  const [potdDropdownOpen, setPotdDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Axios({ ...SummaryApi.userDetails });
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (error) {
        // AxiosToastError(error)
      }
    };
    fetchUser();
  }, []);

  const navLinks = [
    { name: 'About', path: '/about' },
    //{ name: 'Contests', path: '/contests' },
    { name: 'Resources', path: '/resources' },
    { name: 'Events', path: '/events' },
    { name: 'Roadmap', path: '/roadmap' }
  ];

  const handleLogout = async () => {
    try {
      const res = await Axios({ ...SummaryApi.logout });
      if (res.data.success) {
        toast.success("Logout successful");
        setUser(null);
        setSidebarOpen(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // const CpComplexLogo = () => (
  //   <svg width="50" height="50" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-cyan-400">
  //     <polygon points="40 4 67 18 67 47 40 63 13 47 13 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" opacity="0.25" />
  //     <line x1="40" y1="10" x2="40" y2="58" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  //     <line x1="25" y1="20" x2="55" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  //     <line x1="25" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  //     <line x1="25" y1="40" x2="55" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  //     <line x1="25" y1="50" x2="55" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  //     <path d="M22 18 C14 28, 14 42, 22 52" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
  //     <path d="M22 52 C14 62, 14 66, 22 66" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
  //     <path d="M58 18 C66 28, 66 42, 58 52" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
  //     <path d="M58 52 C66 62, 66 66, 58 66" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
  //     <circle cx="40" cy="40" r="16" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.9" />
  //     {[...Array(12)].map((_, i) => {
  //       const angle = (i * 30) * (Math.PI / 180);
  //       const innerRadius = 12;
  //       const outerRadius = 16;
  //       const x1 = 40 + innerRadius * Math.cos(angle);
  //       const y1 = 40 + innerRadius * Math.sin(angle);
  //       const x2 = 40 + outerRadius * Math.cos(angle);
  //       const y2 = 40 + outerRadius * Math.sin(angle);
  //       return (
  //         <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  //       );
  //     })}
  //     <path d="M40 40 L60 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
  //     <path d="M40 32 L54 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
  //   </svg>
  // );

  const renderLinks = (isMobile = false) => (
  <>
    {user?.role === 'ADMIN' ? (
      <div className="relative">
        <button
          onClick={() => setPotdDropdownOpen(!potdDropdownOpen)}
          className={`text-gray-700 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400 font-medium transition duration-200 ${
            isMobile ? 'block w-full text-center py-2' : ''
          }`}
        >
          POTD
        </button>
        {potdDropdownOpen && (
          <div className={`absolute mt-2 ${isMobile ? 'relative' : 'absolute'} bg-white dark:bg-neutral-800 rounded-md shadow-lg z-40 w-40`}>
            <NavLink
              to="/"
              onClick={() => {
                setPotdDropdownOpen(false);
                isMobile && setMenuOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              POTD
            </NavLink>
            <NavLink
              to="/potd-admin"
              onClick={() => {
                setPotdDropdownOpen(false);
                isMobile && setMenuOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              POTD (Admin)
            </NavLink>
          </div>
        )}
      </div>
    ) : (
      <NavLink
        to="/"
        onClick={() => isMobile && setMenuOpen(false)}
        className={({ isActive }) =>
          `${isMobile ? 'block w-full text-center py-2' : ''}
          text-gray-700 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400 
          font-medium transition duration-200 ${isActive ? 'text-yellow-400 font-semibold' : ''}`
        }
      >
        POTD
      </NavLink>
    )}

    {navLinks.map((link) => (
      <NavLink
        key={link.name}
        to={link.path}
        onClick={() => isMobile && setMenuOpen(false)}
        className={({ isActive }) =>
          `${isMobile ? 'block w-full text-center py-2' : ''}
          text-gray-700 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400 
          font-medium transition duration-200 ${isActive ? 'text-yellow-400 font-semibold' : ''}`
        }
      >
        {link.name}
      </NavLink>
    ))}
  </>
);


  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-md dark:shadow-black/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            <Logo />
            <span>Ingenuity</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {renderLinks()}

            {user ? (
              <button
                onClick={() => setSidebarOpen(true)}
                className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                aria-label="User menu"
              >
                <FaUserCircle className="text-gray-800 dark:text-white" size={24} />
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-400 text-gray-900 font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition"
              >
                Login
              </Link>
            )}

            <button
              onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-800" size={20} />}
            </button>
          </nav>

          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-800" size={20} />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden bg-gray-100 dark:bg-neutral-800 px-6 py-4 space-y-4 border-t border-gray-300 dark:border-gray-700 transition-colors duration-300">
            {renderLinks(true)}

            {user ? (
              <button
                onClick={() => {
                  setSidebarOpen(true);
                  setMenuOpen(false);
                }}
                className="block w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                <FaUserCircle className="inline-block mr-2" />
                Profile
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition"
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Sidebar for user details */}
      {sidebarOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 p-6 shadow-xl rounded-xl z-50 border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center border-b border-gray-300 dark:border-neutral-700 pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5" /> Profile
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {user ? (
            <div className="space-y-4 text-gray-800 dark:text-gray-100">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <span><strong>Name:</strong> {user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500" />
                <span><strong>Email:</strong> {user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span><strong>Points:</strong> {user.points}</span>
              </div>
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-orange-500" />
                <span><strong>LeetCode:</strong> {user.leetcode}</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-purple-500" />
                <span><strong>Codeforces:</strong> {user.codeforces}</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                <span><strong>Admin:</strong> {user.role === "ADMIN" ? 'Yes' : 'No'}</span>
              </div>

              <hr className="border-t border-gray-300 dark:border-neutral-700" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-sm px-4 py-2 mt-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Not logged in.</p>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
