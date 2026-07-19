import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  MapPin,
  ArrowLeft,
  Compass,
  ShieldCheck,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Star,
  CheckCircle2,
  Palmtree
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

type RoleOption = 'traveler' | 'guide';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, adminSignIn, signInWithGoogle, signInWithFacebook, state } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleOption>('traveler');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const returnTo = location.state?.returnTo || '/dashboard';

  // Curated Goa Showcase Slides
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
      tag: "Coastal Beaches",
      title: "Discover Untouched Coastal Paradises",
      subtitle: "From serene South Goa palm beaches to electric North Goa coastal sunsets.",
      badge: "⭐ 4.9/5 (10,000+ Traveler Reviews)",
      location: "Palolem Beach, South Goa"
    },
    {
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb02b8?w=1200&q=80",
      tag: "Heritage & Culture",
      title: "Immerse in Portuguese Colonial Charm",
      subtitle: "Stroll colorful Latin quarters, historic basilicas, and spice plantations.",
      badge: "🌴 150+ Verified Local Guides",
      location: "Fontainhas, Panaji"
    },
    {
      image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=1200&q=80",
      tag: "Adventures",
      title: "Experience Thrilling Water Sports & Treks",
      subtitle: "Dudhsagar jeep safaris, scuba diving, kayaking, and luxury boat cruises.",
      badge: "🛡️ 100% Verified Bookings",
      location: "Dudhsagar Waterfalls"
    }
  ];

  // Role Configurations (Public options only)
  const roleConfigs = {
    traveler: {
      label: "Traveler",
      icon: Compass,
      subtitle: "Book tours & plan trips",
      email: "user@example.com"
    },
    guide: {
      label: "Local Guide",
      icon: UserCheck,
      subtitle: "Host tours & experiences",
      email: "guide@example.com"
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role);
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: roleConfigs[selectedRole].email,
      password: 'password123'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let profile;
      try {
        profile = await signIn(formData.email, formData.password);
      } catch (err) {
        // Fallback: Check if credentials belong to admin endpoint
        try {
          await adminSignIn(formData.email, formData.password);
          navigate('/admin/dashboard', { replace: true });
          return;
        } catch (adminErr) {
          throw err;
        }
      }

      if (profile && (profile.role === 'admin' || profile.isAdmin)) {
        navigate('/admin/dashboard', { replace: true });
      } else if (profile && profile.role === 'guide') {
        navigate('/guide/dashboard', { replace: true });
      } else {
        navigate(returnTo, { replace: true });
      }
    } catch (error) {
      // Toast message handled in Auth Context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/50 to-teal-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">

      {/* Left Side: Login Form */}
      <div className="flex-1 flex flex-col justify-between py-8 px-6 sm:px-12 lg:flex-none lg:w-[500px] xl:w-[540px] z-10">

        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
                सुशेगादGoa
                <Palmtree className="h-4 w-4 text-emerald-500" />
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
                Official Tourism Portal
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700 shadow-sm transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Center Card */}
        <div className="my-auto py-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/80 dark:border-gray-700/80 shadow-2xl shadow-blue-900/5"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome Back to Goa
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Sign in to your account
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Access bookings, custom AI trip plans & saved places.
            </p>

            {/* Role Switcher */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Select Account Type
                </label>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Autofill Demo Login
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(roleConfigs) as RoleOption[]).map((role) => {
                  const Icon = roleConfigs[role].icon;
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={`relative p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-gray-50/80 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-bold leading-tight">{roleConfigs[role].label}</div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {roleConfigs[role].subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Remember me
                  </span>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={state.isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {state.isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Social Divider */}
            <div className="mt-6">
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                <span className="px-3 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Or login with
                </span>
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.7 7.3 9.1 5 12 5z" />
                    <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3l3.6 2.8c2.1-1.9 3.3-4.7 3.3-8.1z" />
                    <path fill="#FBBC05" d="M5.9 14.1c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.7-2.8z" />
                    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5L2.2 16.9C4 20.5 7.7 23 12 23z" />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => signInWithFacebook()}
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2 text-blue-600 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Links */}
        <div className="pt-3 text-center space-y-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Create free traveler account
            </Link>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Are you a local tour guide?{' '}
            <Link to="/guide/register" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              Register as verified guide
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Photo Showcase Carousel */}
      <div className="hidden lg:block relative flex-1 bg-gray-950 overflow-hidden m-4 rounded-3xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                <MapPin className="h-3.5 w-3.5 text-teal-400" />
                <span>{slides[currentSlide].location}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>{slides[currentSlide].badge}</span>
              </div>
            </div>

            {/* Bottom Caption Container */}
            <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl"
              >
                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-teal-500/80 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                  {slides[currentSlide].tag}
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2 tracking-tight">
                  {slides[currentSlide].title}
                </h2>

                <p className="text-sm text-gray-200 mb-6 font-medium leading-relaxed">
                  {slides[currentSlide].subtitle}
                </p>

                {/* Navigation Dots & Controls */}
                <div className="flex items-center justify-between border-t border-white/20 pt-5">
                  <div className="flex items-center space-x-2">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-gradient-to-r from-blue-400 to-teal-400' : 'w-2 bg-white/40 hover:bg-white/70'
                          }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Login;