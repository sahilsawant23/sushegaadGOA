import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertCircle, User, Image as ImageIcon, Calendar, Clock, 
  DollarSign, Menu, X, Power, MapPin, Shield, ChevronRight, Briefcase, Languages, 
  Phone, MessageSquare, ExternalLink, HelpCircle, Star, Sparkles, Plus, Award, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:5000/api';

const GuideDashboard: React.FC = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'documents' | 'portfolio' | 'profile'>('overview');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'assigned' | 'completed' | 'cancelled'>('all');

    // Upload & Form States
    const [uploading, setUploading] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: '',
        contact: '',
        bio: '',
        languages: '',
        experience_years: '',
        specialty: '',
        whatsapp_number: ''
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/guide/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const dashboardData = await res.json();
                setData(dashboardData);
                // Init profile form
                const p = dashboardData.profile;
                setProfileForm({
                    name: p.name || '',
                    contact: p.contact || '',
                    bio: p.bio || '',
                    languages: p.languages || '',
                    experience_years: p.experience_years || '',
                    specialty: p.specialty || '',
                    whatsapp_number: p.whatsapp_number || ''
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async () => {
        if (!data) return;
        const currentStatus = data.profile.status.toLowerCase();
        const newStatus = currentStatus === 'available' ? 'busy' : 'available';
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API_BASE_URL}/guide/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setData({ ...data, profile: { ...data.profile, status: newStatus } });
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    // State for saving feedback
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            const res = await fetch(`${API_BASE_URL}/guide/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profileForm)
            });
            const data = await res.json();
            if (res.ok) {
                setSaveSuccess(true);
                fetchDashboardData();
                setTimeout(() => {
                    setSaveSuccess(false);
                    setIsEditing(false); // Disable editing after save
                }, 1500);
            } else {
                console.error('Update failed response:', data);
                alert(`Failed to update profile: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error updating profile: Network or Server Error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'portfolio', docType?: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        let caption = undefined;
        if (type === 'portfolio') {
            caption = prompt('Enter a short caption for this portfolio image (optional):') || '';
        }

        setUploading(true);
        try {
            const token = localStorage.getItem('token');

            // 1. Upload File
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!uploadRes.ok) {
                const errData = await uploadRes.json();
                throw new Error(errData.message || 'Upload failed');
            }
            const { url } = await uploadRes.json();

            // 2. Save Record
            const endpoint = type === 'document' ? '/guide/documents' : '/guide/portfolio';
            const body = type === 'document' ? { documentType: docType, fileUrl: url } : { imageUrl: url, caption };

            const saveRes = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!saveRes.ok) {
                const errData = await saveRes.json();
                throw new Error(errData.message || 'Saving record failed');
            }

            fetchDashboardData();
            alert('Upload successful!');

        } catch (error: any) {
            console.error(error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePortfolio = async (id: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/guide/portfolio/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                // Remove locally
                const newPortfolio = data.portfolio.filter((img: any) => img.id !== id);
                setData({ ...data, portfolio: newPortfolio });
            } else {
                alert('Failed to delete image');
            }
        } catch (e) {
            console.error(e);
            alert('Error deleting image');
        }
    };

    const calculateProfileCompletion = () => {
        if (!data || !data.profile) return 0;
        const p = data.profile;
        let score = 0;
        const total = 6;
        if (p.name) score++;
        if (p.contact) score++;
        if (p.bio && p.bio.trim().length > 10) score++;
        if (p.languages && p.languages.trim().length > 0) score++;
        if (p.specialty && p.specialty.trim().length > 0) score++;
        if (p.experience_years && Number(p.experience_years) > 0) score++;
        return Math.round((score / total) * 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading Guide Portal...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800">
                    <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Error loading your dashboard. Please ensure you are logged in with a valid Local Guide account.</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/20">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const { profile, documents, portfolio, bookings } = data;
    const profileCompletion = calculateProfileCompletion();

    const menuItems = [
        { id: 'overview' as const, icon: Clock, label: 'Overview' },
        { id: 'bookings' as const, icon: Calendar, label: 'Bookings & Calendar' },
        { id: 'documents' as const, icon: FileText, label: 'Verification Docs' },
        { id: 'portfolio' as const, icon: ImageIcon, label: 'Portfolio Gallery' },
        { id: 'profile' as const, icon: User, label: 'Edit Profile' }
    ];

    const SidebarItem = ({ id, icon: Icon, label }: any) => {
        const isSelected = activeTab === id;
        return (
            <button
                onClick={() => { setActiveTab(id); setMenuOpen(false); }}
                className={`relative w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all group duration-200
                ${isSelected 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/75 dark:bg-indigo-950/40 shadow-sm font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
                <Icon size={20} className={`${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors'}`} />
                <span>{label}</span>
                {isSelected && (
                    <motion.div 
                        layoutId="activeTabGlow"
                        className="absolute right-0 top-3 bottom-3 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                )}
            </button>
        );
    };

    const getFilteredBookings = () => {
        if (bookingFilter === 'all') return bookings;
        return bookings.filter((b: any) => b.status.toLowerCase() === bookingFilter);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 fixed h-full z-10">
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-3">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
                        <div className="relative h-12 w-12 bg-indigo-600 dark:bg-indigo-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-inner border border-white/20">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'G'}
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-slate-950 dark:text-white truncate max-w-[160px] leading-tight" title={profile.name}>{profile.name || 'Local Guide'}</h2>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">Guide Account</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item) => (
                        <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-333 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-[0.98]"
                    >
                        <MapPin size={16} className="text-indigo-500" />
                        <span>View Live Website</span>
                    </button>
                    <button 
                        onClick={async () => { await signOut(); navigate('/login'); }} 
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl border border-transparent text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all active:scale-[0.98]"
                    >
                        <Power size={16} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Pane */}
            <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
                
                {/* Mobile Header Bar */}
                <header className="md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center sticky top-0 z-20 transition-all">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <h1 className="font-bold text-slate-900 dark:text-white leading-tight">Guide Portal</h1>
                    </div>
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Mobile Dropdown Nav Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden sticky top-[65px] z-20 shadow-lg"
                        >
                            <nav className="p-4 space-y-1">
                                {menuItems.map((item) => (
                                    <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} />
                                ))}
                                <hr className="my-3 border-slate-200 dark:border-slate-800" />
                                <button 
                                    onClick={() => navigate('/')} 
                                    className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-850"
                                >
                                    <MapPin size={20} className="text-indigo-500" />
                                    <span>Live Website</span>
                                </button>
                                <button 
                                    onClick={async () => { await signOut(); navigate('/login'); }} 
                                    className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                >
                                    <Power size={20} />
                                    <span>Log Out</span>
                                </button>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Top Desktop Bar */}
                <header className="bg-white/50 dark:bg-slate-900/30 px-8 py-5 hidden md:flex justify-between items-center border-b border-slate-200/30 dark:border-slate-800/10">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                            <span>{activeTab === 'bookings' ? 'Bookings & Calendar' : activeTab === 'documents' ? 'Verification Documents' : activeTab === 'portfolio' ? 'Portfolio Gallery' : activeTab}</span>
                            <Sparkles size={16} className="text-indigo-500 animate-pulse" />
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Welcome back, customize and manage your workspace.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Interactive Status Switcher */}
                        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm hover:shadow transition">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status:</span>
                            <button
                                onClick={handleStatusToggle}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none 
                                ${profile.status.toLowerCase() === 'available' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out
                                    ${profile.status.toLowerCase() === 'available' ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                            <span className={`text-sm font-bold tracking-wide capitalize ${profile.status.toLowerCase() === 'available' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                                {profile.status}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Body */}
                <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl w-full mx-auto">
                    
                    {/* Verification & Dashboard Banner */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className={`lg:col-span-2 relative overflow-hidden rounded-3xl p-6 shadow-sm border flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-300
                            ${profile.is_verified 
                                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10 border-emerald-200 dark:border-emerald-900/40' 
                                : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200 dark:border-amber-900/40'}`}>
                            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
                                <Shield size={180} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            
                            <div className="flex items-start space-x-4 relative z-10">
                                <div className={`p-3 rounded-2xl flex-shrink-0 ${profile.is_verified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'}`}>
                                    {profile.is_verified ? <Shield size={28} className="animate-bounce" /> : <AlertCircle size={28} />}
                                </div>
                                <div>
                                    <h3 className={`text-base font-bold flex items-center gap-1.5 ${profile.is_verified ? 'text-emerald-950 dark:text-emerald-300' : 'text-amber-950 dark:text-amber-300'}`}>
                                        {profile.is_verified ? 'Government Verified Guide' : 'Profile Pending Verification'}
                                        {profile.is_verified && <CheckCircle size={16} className="text-emerald-500 fill-emerald-100 dark:fill-transparent" />}
                                    </h3>
                                    <p className={`text-sm mt-1 leading-relaxed max-w-xl ${profile.is_verified ? 'text-emerald-800 dark:text-emerald-400/90' : 'text-amber-800 dark:text-amber-400/90'}`}>
                                        {profile.is_verified
                                            ? 'Verified badge is active! Your profile is highlighted to customers in the tour listings with priority recommendations.'
                                            : 'Upload your Aadhar Card and Tourism License in the Documents tab to verify your profile and unlock listings bookings.'}
                                    </p>
                                    {profile.rejection_reason && !profile.is_verified && (
                                        <div className="mt-3 p-3 bg-rose-100/80 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/50 rounded-xl text-xs font-semibold text-rose-900 dark:text-rose-300">
                                            <strong>Required Fix:</strong> {profile.rejection_reason}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {!profile.is_verified && (
                                <button 
                                    onClick={() => setActiveTab('documents')} 
                                    className="mt-4 md:mt-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.98]"
                                >
                                    Get Verified
                                </button>
                            )}
                        </div>

                        {/* Profile Completion Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Profile Completion</span>
                                    <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full">{profileCompletion}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${profileCompletion}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {profileCompletion < 100 
                                        ? '💡 Fill in your bio, languages, experience, and specialties to build trust with travelers.' 
                                        : '🎉 Your guide profile is 100% complete! Ready to capture bookings.'}
                                </p>
                                {profileCompletion < 100 && (
                                    <button onClick={() => setActiveTab('profile')} className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                        <span>Update details</span>
                                        <ChevronRight size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div 
                                key="overview"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* Stat Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl p-6 text-white shadow-lg shadow-indigo-600/10 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-y-3 translate-x-3">
                                            <DollarSign size={140} />
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Estimated Earnings</p>
                                                <h3 className="text-4xl font-extrabold mt-2 tracking-tight">
                                                    ₹{(bookings.reduce((acc: number, b: any) => acc + (Number(b.total_price) || 0), 0) * 0.6).toLocaleString()}
                                                </h3>
                                            </div>
                                            <div className="p-3 bg-white/20 rounded-2xl shadow-inner border border-white/10">
                                                <DollarSign size={24} />
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-center text-xs text-indigo-100 bg-white/10 px-3 py-1.5 rounded-xl w-fit">
                                            <span>Guide's 60% revenue share of bookings</span>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between">
                                        <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none translate-y-3 translate-x-3 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle size={140} />
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Completed Tours</p>
                                                <h3 className="text-4xl font-extrabold text-slate-950 dark:text-white mt-2 tracking-tight">
                                                    {bookings.filter((b: any) => new Date(b.booking_date) < new Date()).length}
                                                </h3>
                                            </div>
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                                                <CheckCircle size={24} />
                                            </div>
                                        </div>
                                        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">Historical records of tours completed.</p>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between">
                                        <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none translate-y-3 translate-x-3 text-indigo-500">
                                            <Calendar size={140} />
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Upcoming Bookings</p>
                                                <h3 className="text-4xl font-extrabold text-slate-950 dark:text-white mt-2 tracking-tight">
                                                    {bookings.filter((b: any) => new Date(b.booking_date) >= new Date()).length}
                                                </h3>
                                            </div>
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                                                <Calendar size={24} />
                                            </div>
                                        </div>
                                        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">Click Bookings tab to review dates.</p>
                                    </div>
                                </div>

                                {/* Overview Body Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Upcoming Schedule */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                                                <Calendar size={18} className="text-indigo-500" />
                                                <span>Upcoming Schedule</span>
                                            </h3>
                                            <button onClick={() => setActiveTab('bookings')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All Schedule</button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {bookings
                                                .filter((b: any) => new Date(b.booking_date) >= new Date())
                                                .slice(0, 3)
                                                .map((booking: any) => {
                                                    const date = new Date(booking.booking_date);
                                                    const day = date.getDate();
                                                    const month = date.toLocaleString('default', { month: 'short' });
                                                    return (
                                                        <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/55 dark:border-slate-800/50 shadow-sm flex items-center justify-between hover:shadow transition duration-200">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 h-14 w-12 rounded-xl flex flex-col justify-center items-center font-bold">
                                                                    <span className="text-xs leading-none uppercase tracking-wider">{month}</span>
                                                                    <span className="text-lg leading-tight mt-0.5">{day}</span>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm max-w-[280px] truncate">{booking.tour_title}</h4>
                                                                    <div className="flex items-center space-x-2.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                        <span>{booking.guests} Guests</span>
                                                                        <span>•</span>
                                                                        <span>Traveler: {booking.user_name}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => setSelectedBooking(booking)} 
                                                                className="text-xs font-semibold py-1.5 px-3 bg-slate-105 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-xl transition duration-200"
                                                            >
                                                                Ticket
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            {bookings.filter((b: any) => new Date(b.booking_date) >= new Date()).length === 0 && (
                                                <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                                    <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs">No upcoming tours booked. Turn status to Available to attract bookings.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Actions Panel */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                                            <Sparkles size={18} className="text-indigo-500" />
                                            <span>Quick Portal Tasks</span>
                                        </h3>
                                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-3.5">
                                            <button 
                                                onClick={() => setActiveTab('portfolio')} 
                                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all text-left"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg"><ImageIcon size={18} /></div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-900 dark:text-white">Add Portfolio Photo</div>
                                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Showcase your excursions</div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-slate-400" />
                                            </button>

                                            <button 
                                                onClick={() => setActiveTab('profile')} 
                                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 hover:border-emerald-100 dark:hover:border-emerald-900 transition-all text-left"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg"><User size={18} /></div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-900 dark:text-white">Update Bio & Specialty</div>
                                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Edit traveler profile info</div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-slate-400" />
                                            </button>

                                            <button 
                                                onClick={() => setActiveTab('documents')} 
                                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/10 hover:border-amber-100 dark:hover:border-amber-900 transition-all text-left"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-lg"><FileText size={18} /></div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-900 dark:text-white">Upload Tourism License</div>
                                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Submit verification certificates</div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'bookings' && (
                            <motion.div 
                                key="bookings"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Filter Controls */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
                                    <div className="flex flex-wrap gap-1.5">
                                        {(['all', 'pending', 'assigned', 'completed', 'cancelled'] as const).map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setBookingFilter(filter)}
                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-200
                                                ${bookingFilter === filter 
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-105' 
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750'}`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-2">
                                        Showing {getFilteredBookings().length} Bookings
                                    </span>
                                </div>

                                {/* Table Panel */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                                            <thead className="bg-slate-50 dark:bg-slate-900/60">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tour Details</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scheduled Date</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price / Status</th>
                                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-850">
                                                {getFilteredBookings().map((booking: any) => (
                                                    <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{booking.tour_title}</div>
                                                            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{booking.guests} Guests booked</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="h-6 w-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center font-bold text-[10px]">
                                                                    {booking.user_name ? booking.user_name.charAt(0).toUpperCase() : 'C'}
                                                                </div>
                                                                <div className="text-sm text-slate-900 dark:text-slate-200">{booking.user_name}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-slate-900 dark:text-slate-200 font-medium">{new Date(booking.booking_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white">₹{booking.total_price}</div>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 tracking-wider
                                                                ${booking.status === 'completed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' : 
                                                                  booking.status === 'assigned' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400' :
                                                                  booking.status === 'cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'}`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-sm font-semibold">
                                                            <button
                                                                onClick={() => setSelectedBooking(booking)}
                                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                                                            >
                                                                View ticket
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {getFilteredBookings().length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                                            <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-650 mx-auto mb-2" />
                                                            <div className="text-sm font-semibold">No bookings found</div>
                                                            <p className="text-xs text-slate-400 mt-1">There are no records matching the selected tab filter.</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'documents' && (
                            <motion.div 
                                key="documents"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-4xl mx-auto space-y-6"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
                                    <h3 className="font-bold text-slate-950 dark:text-white text-lg">Verification Checklist</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Goa Tourism Guidelines require local host verification to activate tour slots.</p>
                                    
                                    {/* Step Tracker UI */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                        {['Aadhar Card', 'Guide License', 'Police Clearance'].map((step, idx) => {
                                            const key = step.toLowerCase().replace(' ', '_');
                                            const doc = documents.find((d: any) => d.document_type === key);
                                            const isDone = doc && doc.status === 'verified';
                                            const isPending = doc && doc.status === 'pending';
                                            return (
                                                <div key={idx} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm
                                                        ${isDone ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10' :
                                                          isPending ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                                        {isDone ? <Check size={16} /> : idx + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step}</h4>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                                                            {doc ? doc.status : 'Missing'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {['Aadhar Card', 'Guide License', 'Police Clearance'].map((docName) => {
                                        const docKey = docName.toLowerCase().replace(' ', '_');
                                        const existingDoc = documents.find((d: any) => d.document_type === docKey);
                                        return (
                                            <div key={docKey} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 hover:shadow-md transition flex flex-col justify-between h-[230px]">
                                                <div>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                                                            <FileText size={16} className="text-indigo-500" />
                                                            <span>{docName}</span>
                                                        </h3>
                                                        {existingDoc && (
                                                            <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase font-bold tracking-wider 
                                                                ${existingDoc.status === 'verified' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                                                                  existingDoc.status === 'rejected' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'}`}>
                                                                {existingDoc.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                                        {docName === 'Aadhar Card' && 'Submit scanned Aadhar details. Ensure the photo and DOB details are clearly legible.'}
                                                        {docName === 'Guide License' && 'Upload government license issued by Goa Tourism Dept showing certified license ID.'}
                                                        {docName === 'Police Clearance' && 'Attach standard police clearance verification certificate issued within recent 1 year.'}
                                                    </p>
                                                </div>

                                                {existingDoc ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200/20 dark:border-slate-800/10">
                                                            <CheckCircle size={15} className="text-emerald-500 mr-2 flex-shrink-0" />
                                                            <span className="truncate max-w-[280px]">File attached: {existingDoc.file_url.split('/').pop()}</span>
                                                        </div>
                                                        <div className="flex space-x-3">
                                                            <a href={existingDoc.file_url} target="_blank" rel="noopener noreferrer"
                                                                className="flex-1 text-center py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/45 transition">
                                                                View Image
                                                            </a>
                                                            <label className="flex-1 text-center py-2 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                                                {uploading ? '...' : 'Replace'}
                                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'document', docKey)} accept="image/*,application/pdf" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="block w-full border-2 border-dashed border-slate-200 dark:border-slate-850 hover:border-indigo-400 dark:hover:border-indigo-700/80 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/10 transition group">
                                                        <Upload className="mx-auto h-8 w-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                        <span className="mt-2 block text-xs font-bold text-slate-600 dark:text-slate-350 group-hover:text-indigo-650 dark:group-hover:text-indigo-400">
                                                            {uploading ? 'Uploading...' : 'Click to Upload Document'}
                                                        </span>
                                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'document', docKey)} accept="image/*,application/pdf" />
                                                    </label>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'portfolio' && (
                            <motion.div 
                                key="portfolio"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">My Excursion Gallery</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Upload photos of historical landmarks, beaches, or activities from your tours.</p>
                                    </div>
                                    <label className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl cursor-pointer hover:shadow-lg transition duration-200 shadow-md shadow-indigo-600/10 active:scale-[0.98]">
                                        <Plus size={16} />
                                        <span className="text-xs font-bold">Add Photo</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'portfolio')} accept="image/*" />
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {portfolio.map((img: any) => (
                                        <div key={img.id} className="relative group aspect-square bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/30 dark:border-slate-800/30 hover:shadow-md transition duration-300">
                                            <img src={img.image_url} alt={img.caption || 'Portfolio'} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                                                <div className="space-y-1 text-white mb-2">
                                                    <p className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wide">{new Date(img.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                                                    {img.caption && <p className="text-xs font-bold leading-snug line-clamp-2">{img.caption}</p>}
                                                </div>
                                                <div className="flex justify-end w-full">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeletePortfolio(img.id); }}
                                                        className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-xl transition-all shadow-md active:scale-95"
                                                        title="Delete Image"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {portfolio.length === 0 && (
                                        <div className="col-span-4 text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                            <ImageIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                                            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">No pictures uploaded yet</p>
                                            <p className="text-slate-400 dark:text-slate-550 text-xs mt-1 max-w-xs mx-auto">Add photos of your historical treks or beach sports to highlight your dashboard listings.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div 
                                key="profile"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 md:p-8"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-bold text-slate-950 dark:text-white text-lg">Edit Guide Profile</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">This details is shown to users on public listings and verification receipts.</p>
                                    </div>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/70 font-semibold text-xs rounded-xl transition duration-200 active:scale-95"
                                        >
                                            Modify Profile
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Display Name</label>
                                            <input 
                                                type="text" 
                                                disabled={!isEditing} 
                                                required 
                                                value={profileForm.name} 
                                                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                                className={`mt-1.5 block w-full rounded-xl border-slate-200 dark:border-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border bg-transparent
                                                ${!isEditing ? 'bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-850 cursor-not-allowed' : 'focus:scale-[1.01]'}`} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Number</label>
                                            <input 
                                                type="text" 
                                                disabled={!isEditing} 
                                                required 
                                                value={profileForm.contact} 
                                                onChange={e => setProfileForm({ ...profileForm, contact: e.target.value })}
                                                className={`mt-1.5 block w-full rounded-xl border-slate-200 dark:border-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border bg-transparent
                                                ${!isEditing ? 'bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-850 cursor-not-allowed' : 'focus:scale-[1.01]'}`} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WhatsApp Contact</label>
                                            <input 
                                                type="text" 
                                                disabled={!isEditing} 
                                                placeholder="+91..." 
                                                value={profileForm.whatsapp_number} 
                                                onChange={e => setProfileForm({ ...profileForm, whatsapp_number: e.target.value })}
                                                className={`mt-1.5 block w-full rounded-xl border-slate-200 dark:border-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border bg-transparent
                                                ${!isEditing ? 'bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-850 cursor-not-allowed' : 'focus:scale-[1.01]'}`} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience (Years)</label>
                                            <input 
                                                type="number" 
                                                disabled={!isEditing} 
                                                value={profileForm.experience_years} 
                                                onChange={e => setProfileForm({ ...profileForm, experience_years: e.target.value })}
                                                className={`mt-1.5 block w-full rounded-xl border-slate-200 dark:border-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border bg-transparent
                                                ${!isEditing ? 'bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-850 cursor-not-allowed' : 'focus:scale-[1.01]'}`} 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <Briefcase size={14} className="text-indigo-500" />
                                            <span>Guide Specialties</span>
                                        </label>
                                        <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/40">
                                            {['History', 'Culture', 'Nature', 'Food', 'Adventure', 'Art', 'Nightlife', 'Spiritual'].map(spec => {
                                                const current = profileForm.specialty ? profileForm.specialty.split(', ').filter(s => s) : [];
                                                const isSelected = current.includes(spec);
                                                return (
                                                    <button
                                                        key={spec}
                                                        type="button"
                                                        disabled={!isEditing}
                                                        onClick={() => {
                                                            const updated = isSelected
                                                                ? current.filter(s => s !== spec)
                                                                : [...current, spec];
                                                            setProfileForm({ ...profileForm, specialty: updated.join(', ') });
                                                        }}
                                                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all duration-250 
                                                            ${isSelected 
                                                                ? 'bg-indigo-650 text-white border-indigo-600 dark:bg-indigo-600 shadow-md shadow-indigo-600/10' 
                                                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}
                                                            ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                                                    >
                                                        {spec}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <Languages size={14} className="text-indigo-500" />
                                            <span>Languages Spoken</span>
                                        </label>
                                        <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/40">
                                            {['English', 'Hindi', 'Konkani', 'Marathi', 'Russian', 'French', 'German', 'Spanish'].map(lang => {
                                                const current = profileForm.languages ? profileForm.languages.split(', ').filter(l => l) : [];
                                                const isSelected = current.includes(lang);
                                                return (
                                                    <button
                                                        key={lang}
                                                        type="button"
                                                        disabled={!isEditing}
                                                        onClick={() => {
                                                            const updated = isSelected
                                                                ? current.filter(l => l !== lang)
                                                                : [...current, lang];
                                                            setProfileForm({ ...profileForm, languages: updated.join(', ') });
                                                        }}
                                                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all duration-250 
                                                            ${isSelected 
                                                                ? 'bg-teal-600 text-white border-teal-600 dark:bg-teal-650 shadow-md shadow-teal-600/10' 
                                                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}
                                                            ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                                                    >
                                                        {lang}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bio / About Me</label>
                                        <textarea 
                                            rows={4} 
                                            disabled={!isEditing} 
                                            value={profileForm.bio} 
                                            onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                                            className={`mt-1.5 block w-full rounded-xl border-slate-200 dark:border-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5 border bg-transparent
                                            ${!isEditing ? 'bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-850 cursor-not-allowed' : 'focus:scale-[1.01]'}`} 
                                        />
                                        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 leading-normal">Briefly describe yourself, your local knowledge, and what makes your excursions unique to stand out.</p>
                                    </div>

                                    {isEditing && (
                                        <div className="flex justify-end space-x-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSaving || saveSuccess}
                                                className={`px-5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center space-x-2
                                                    ${saveSuccess 
                                                        ? 'bg-emerald-600 text-white shadow-emerald-600/10' 
                                                        : isSaving 
                                                            ? 'bg-slate-400 text-slate-100 cursor-not-allowed' 
                                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10 active:scale-95'}`}
                                            >
                                                {isSaving && <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full mr-1"></div>}
                                                <span>
                                                    {saveSuccess ? 'Changes Saved!' : isSaving ? 'Saving...' : 'Save Changes'}
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </main>
            </div >

            {/* Booking Ticket Details Modal Overlay */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full relative border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-2xl"
                        >
                            {/* Decorative Perforated ticket design top */}
                            <div className="bg-indigo-600 px-6 py-6 text-white relative">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="absolute top-4 right-4 text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition"
                                >
                                    <X size={20} />
                                </button>
                                
                                <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">Excursion Ticket</span>
                                <h2 className="text-xl font-bold leading-tight mt-2.5 max-w-[280px]" title={selectedBooking.tour_title}>{selectedBooking.tour_title}</h2>
                                <div className="flex items-center space-x-2 mt-4 text-indigo-100 text-xs">
                                    <MapPin size={12} />
                                    <span className="font-medium">Booking ID: #{selectedBooking.id}</span>
                                </div>
                            </div>
                            
                            {/* Ticket Details Body */}
                            <div className="p-6 space-y-5 relative">
                                {/* Ticket details list */}
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Date</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{new Date(selectedBooking.booking_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Traveler Name</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{selectedBooking.user_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Guests</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{selectedBooking.guests} Persons</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking Status</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 tracking-wider
                                            ${selectedBooking.status === 'completed' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' : 
                                              selectedBooking.status === 'assigned' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' :
                                              selectedBooking.status === 'cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'}`}>
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Booking Price:</span>
                                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{Number(selectedBooking.total_price).toLocaleString()}</span>
                                </div>

                                {selectedBooking.special_requests && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <Info size={12} className="text-indigo-500" />
                                            <span>Traveler Special Requests</span>
                                        </p>
                                        <div className="bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-2xl text-xs text-amber-900 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30 leading-relaxed font-medium">
                                            {selectedBooking.special_requests}
                                        </div>
                                    </div>
                                )}

                                {/* Call / Contact Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <a
                                        href={selectedBooking.user_contact ? `tel:${selectedBooking.user_contact}` : '#'}
                                        className={`flex-1 py-2.5 rounded-xl text-center text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md
                                            ${selectedBooking.user_contact
                                                ? 'bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-600 text-white shadow-indigo-600/10 active:scale-98'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                        onClick={(e) => !selectedBooking.user_contact && e.preventDefault()}
                                    >
                                        <Phone size={14} />
                                        <span>Call Client</span>
                                    </a>
                                    <a
                                        href={selectedBooking.user_contact ? `https://wa.me/${selectedBooking.user_contact.replace(/\D/g, '')}` : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex-1 border py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2
                                            ${selectedBooking.user_contact
                                                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:scale-98'
                                                : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'}`}
                                        onClick={(e) => !selectedBooking.user_contact && e.preventDefault()}
                                    >
                                        <MessageSquare size={14} className="text-emerald-500" />
                                        <span>WhatsApp Chat</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GuideDashboard;
