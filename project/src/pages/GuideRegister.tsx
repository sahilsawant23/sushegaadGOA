import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  Star,
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play,
  Palmtree,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:5000/api';

const GuideRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const slides = [
      {
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb02b8?w=1200&q=80",
        tag: "Local Guide Platform",
        title: "Share Goa's Rich Culture with Travelers",
        subtitle: "Host heritage walks, spice plantation tours, and authentic local experiences.",
        badge: "⭐ Earn & Grow with Verified Status",
        location: "Fontainhas, Panaji"
      },
      {
        image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=1200&q=80",
        tag: "Adventure Host",
        title: "Lead Eco Treks & Water Sports",
        subtitle: "Organize Dudhsagar safaris, mangrove kayaking, and island boat trips.",
        badge: "Direct Bookings & Payouts",
        location: "Dudhsagar Waterfalls"
      }
    ];

    useEffect(() => {
      if (!isPlaying) return;
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }, [isPlaying, slides.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/guide/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/40 to-teal-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
            
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-between py-8 px-6 sm:px-12 lg:flex-none lg:w-[500px] xl:w-[540px] z-10">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
                                सुशेगादGoa
                                <Palmtree className="h-4 w-4 text-emerald-500" />
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
                                Local Guide Portal
                            </span>
                        </div>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700 shadow-sm transition-all"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                        Back to Home
                    </Link>
                </div>

                {/* Form Card */}
                <div className="my-auto py-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/80 dark:border-gray-700/80 shadow-2xl shadow-emerald-900/5"
                    >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-3">
                            <Sparkles className="h-3.5 w-3.5" />
                            Become a Certified Goa Guide
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Register as a Local Guide
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Host verified tours, manage bookings & grow your experience business.
                        </p>

                        <form className="mt-6 space-y-3.5" onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <div className="relative rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="e.g. Rahul Naik"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                                <div className="relative rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                <div className="relative rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="+91 9876543210"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                <div className="relative rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
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

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                                <div className="relative rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Re-enter password"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-all mt-2"
                            >
                                {loading ? 'Registering Guide Account...' : 'Register as Local Guide'}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="pt-3 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Already registered as a guide?{' '}
                        <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                            Sign in to Guide Portal
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Photo Carousel */}
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
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />

                        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                            <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                                <span>{slides[currentSlide].location}</span>
                            </div>
                            <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg">
                                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                <span>{slides[currentSlide].badge}</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="max-w-xl"
                            >
                                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-emerald-500/80 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                                    {slides[currentSlide].tag}
                                </span>

                                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2 tracking-tight">
                                    {slides[currentSlide].title}
                                </h2>

                                <p className="text-sm text-gray-200 mb-6 font-medium leading-relaxed">
                                    {slides[currentSlide].subtitle}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/20 pt-5">
                                    <div className="flex items-center space-x-2">
                                        {slides.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentSlide(idx)}
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    idx === currentSlide ? 'w-8 bg-gradient-to-r from-emerald-400 to-teal-400' : 'w-2 bg-white/40 hover:bg-white/70'
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

export default GuideRegister;

