import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Heart, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WeatherWidget from './WeatherWidget';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, signOut } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Tours', path: '/tours' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Nightlife', path: '/nightlife' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="clean-header shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-18">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                सुशेगाद<span className="text-blue-600 dark:text-blue-400">Goa</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            <WeatherWidget compact={true} />
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${isActive(item.path)
                  ? 'text-blue-600 bg-blue-50 dark:bg-slate-800 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Section & Toggles */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 border-r pr-3 border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>

            {state.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {!state.isAdmin && (
                  <Link
                    to="/wishlist"
                    className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="text-sm max-w-[100px] truncate">{state.profile?.full_name || state.user?.email?.split('@')[0] || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100 dark:border-gray-700">
                    {state.profile?.role === 'guide' ? (
                      <>
                        <Link to="/guide/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Guide Dashboard
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to={state.isAdmin ? "/admin/dashboard" : "/dashboard"}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {state.isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Profile
                        </Link>
                        {!state.isAdmin && (
                          <Link
                            to="/bookings"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            My Bookings
                          </Link>
                        )}
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pt-2 pb-4 space-y-1">
          <div className="py-2 border-b border-gray-100 dark:border-gray-700 mb-2 flex justify-between items-center">
            <WeatherWidget compact={true} />
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setIsMenuOpen(false); setShowTelemetry(true); }}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs"
              >
                Telemetry
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); setShowSOS(true); }}
                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold text-xs"
              >
                SOS Radar
              </button>
            </div>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.path)
                ? 'text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-blue-400 font-semibold'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {state.isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to={state.isAdmin ? "/admin/dashboard" : "/dashboard"}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;