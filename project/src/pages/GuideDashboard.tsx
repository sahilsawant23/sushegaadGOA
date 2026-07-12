import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, User, Image, Calendar, Clock, DollarSign, Menu, X, Power, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const GuideDashboard: React.FC = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'portfolio' | 'bookings' | 'profile'>('overview');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'portfolio', docType?: string, caption?: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

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
                alert('Image deleted');
            } else {
                alert('Failed to delete image');
            }
        } catch (e) {
            console.error(e);
            alert('Error deleting image');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center">Error loading dashboard. Are you logged in as a Guide?</div>;

    const { profile, documents, portfolio, bookings } = data;

    const SidebarItem = ({ id, icon: Icon, label }: any) => (
        <button
            onClick={() => { setActiveTab(id); setMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-colors
            ${activeTab === id ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans">

            {/* Sidebar (Desktop) */}
            <div className="hidden md:flex flex-col w-64 bg-white shadow-lg fixed h-full z-10">
                <div className="p-6 border-b flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                        {profile.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 truncate w-32">{profile.name}</h2>
                        <span className="text-xs text-gray-500">Guide Portal</span>
                    </div>
                </div>
                <nav className="flex-1 mt-6">
                    <SidebarItem id="overview" icon={Clock} label="Overview" />
                    <SidebarItem id="bookings" icon={Calendar} label="Bookings" />
                    <SidebarItem id="documents" icon={FileText} label="Documents" />
                    <SidebarItem id="portfolio" icon={Image} label="Portfolio" />
                    <SidebarItem id="profile" icon={User} label="Edit Profile" />
                </nav>
                <div className="p-4 border-t space-y-2">
                    <button onClick={() => navigate('/')} className="w-full flex items-center justify-center space-x-2 p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <MapPin size={18} />
                        <span>Back to Website</span>
                    </button>
                    <button onClick={() => { signOut(); navigate('/login'); }} className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded">
                        <Power size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

                {/* Mobile Header */}
                <div className="md:hidden bg-white p-4 shadow flex justify-between items-center sticky top-0 z-20">
                    <h1 className="font-bold text-lg">Guide Dashboard</h1>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white fixed inset-0 z-30 pt-16">
                        <nav className="flex flex-col">
                            <SidebarItem id="overview" icon={Clock} label="Overview" />
                            <SidebarItem id="bookings" icon={Calendar} label="Bookings" />
                            <SidebarItem id="documents" icon={FileText} label="Documents" />
                            <SidebarItem id="portfolio" icon={Image} label="Portfolio" />
                            <SidebarItem id="profile" icon={User} label="Edit Profile" />
                            <SidebarItem id="profile" icon={User} label="Edit Profile" />
                            <hr className="my-2" />
                            <div className="px-6 py-2">
                                <button onClick={() => navigate('/')} className="flex items-center space-x-3 text-sm font-medium text-blue-600">
                                    <MapPin size={20} />
                                    <span>Back to Website</span>
                                </button>
                            </div>
                            <div className="px-6 py-2">
                                <button onClick={() => { signOut(); navigate('/login'); }} className="flex items-center space-x-3 text-sm font-medium text-red-600">
                                    <Power size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                )}

                {/* Header Bar */}
                <header className="bg-white shadow-sm p-6 hidden md:flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-white border px-4 py-2 rounded-lg shadow-sm">
                            <span className="text-sm font-medium text-gray-700">Availability:</span>
                            <button
                                onClick={handleStatusToggle}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${profile.status.toLowerCase() === 'available' ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <span className="sr-only">Use setting</span>
                                <span
                                    aria-hidden="true"
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${profile.status.toLowerCase() === 'available' ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                            <span className={`text-sm font-bold capitalize ${profile.status.toLowerCase() === 'available' ? 'text-green-600' : 'text-gray-500'}`}>
                                {profile.status}
                            </span>
                        </div>
                    </div>
                </header>

                <main className="p-6 overflow-y-auto">

                    {/* Verification Status Banner */}
                    <div className={`mb-6 border-l-4 p-4 rounded-r shadow-sm flex items-start ${profile.is_verified ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-400'}`}>
                        {profile.is_verified ? (
                            <Shield className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
                        )}
                        <div>
                            <h3 className={`text-sm font-bold ${profile.is_verified ? 'text-green-800' : 'text-yellow-800'}`}>
                                {profile.is_verified ? 'Government Verified Guide' : 'Account Pending Verification'}
                            </h3>
                            <p className={`text-sm mt-1 ${profile.is_verified ? 'text-green-700' : 'text-yellow-700'}`}>
                                {profile.is_verified
                                    ? 'Your profile is fully verified by the Goa Tourism Department. You have the official badge.'
                                    : 'Please go to the Documents tab and upload your Aadhar and Guide License to get verified.'}
                            </p>
                            {profile.rejection_reason && !profile.is_verified && (
                                <div className="mt-2.5 p-3 bg-red-100/60 border border-red-200/50 rounded-lg text-xs font-semibold text-red-900">
                                    <strong>Requested Changes:</strong> {profile.rejection_reason}
                                </div>
                            )}
                        </div>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Total Earnings</p>
                                        <h3 className="text-3xl font-bold mt-1">
                                            ₹{bookings.reduce((acc: number, b: any) => acc + (Number(b.total_price) || 0), 0) * 0.6}
                                        </h3>
                                    </div>
                                    <div className="p-2 bg-blue-400 bg-opacity-30 rounded-lg">
                                        <DollarSign size={24} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm text-blue-100">
                                    <span>From {bookings.length} bookings</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Completed Tours</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{bookings.filter((b: any) => new Date(b.booking_date) < new Date()).length}</h3>
                                    </div>
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <CheckCircle size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Upcoming Bookings</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{bookings.filter((b: any) => new Date(b.booking_date) >= new Date()).length}</h3>
                                    </div>
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <Calendar size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Verification Documents</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['Aadhar Card', 'Guide License', 'Police Clearance'].map((docName) => {
                                    const docKey = docName.toLowerCase().replace(' ', '_');
                                    const existingDoc = documents.find((d: any) => d.document_type === docKey);
                                    return (
                                        <div key={docKey} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-700">{docName}</h3>
                                                {existingDoc && (
                                                    <span className={`px-2 py-1 text-xs rounded-full uppercase font-bold 
                                                        ${existingDoc.status === 'verified' ? 'bg-green-100 text-green-700' :
                                                            existingDoc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {existingDoc.status}
                                                    </span>
                                                )}
                                            </div>

                                            {existingDoc ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                                        <CheckCircle size={16} className="text-green-500 mr-2" />
                                                        File Uploaded
                                                    </div>
                                                    <div className="flex space-x-3">
                                                        <a href={existingDoc.file_url} target="_blank" rel="noopener noreferrer"
                                                            className="flex-1 text-center py-2 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition">
                                                            View
                                                        </a>
                                                        <label className="flex-1 text-center py-2 text-sm text-gray-700 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition">
                                                            {uploading ? '...' : 'Replace'}
                                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'document', docKey)} accept="image/*,application/pdf" />
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition group">
                                                    <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500" />
                                                    <span className="mt-2 block text-sm font-medium text-gray-600 group-hover:text-blue-600">
                                                        {uploading ? 'Uploading...' : 'Click to Upload'}
                                                    </span>
                                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'document', docKey)} accept="image/*,application/pdf" />
                                                </label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">My Portfolio</h2>
                                <label className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition shadow">
                                    <Upload size={18} />
                                    <span>Add Photo</span>
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'portfolio')} accept="image/*" />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {portfolio.map((img: any) => (
                                    <div key={img.id} className="relative group aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <img src={img.image_url} alt="Portfolio" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                                            <div className="flex justify-between items-end w-full">
                                                <p className="text-white text-xs">{new Date(img.created_at).toLocaleDateString()}</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeletePortfolio(img.id); }}
                                                    className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                                                    title="Delete Image"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {portfolio.length === 0 && (
                                    <div className="col-span-4 text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                        <Image className="mx-auto h-12 w-12 text-gray-300" />
                                        <p className="mt-2 text-gray-500">Showcase your tours. Upload your first photo!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bookings.map((booking: any) => (
                                            <tr key={booking.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{booking.tour_title}</div>
                                                    <div className="text-sm text-gray-500">{booking.guests} Guests</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{booking.user_name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{new Date(booking.booking_date).toLocaleDateString()}</div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                                                        ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {bookings.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                    No upcoming bookings found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Booking Details Modal */}
                            {selectedBooking && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                    <div className="bg-white rounded-lg max-w-lg w-full p-6 relative animate-fade-in-up">
                                        <button
                                            onClick={() => setSelectedBooking(null)}
                                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                        >
                                            <X size={24} />
                                        </button>

                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Booking Details</h2>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Tour Name</p>
                                                    <p className="font-semibold text-gray-900">{selectedBooking.tour_title}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Booking ID</p>
                                                    <p className="font-mono text-gray-900">#{selectedBooking.id}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Customer Name</p>
                                                    <p className="font-semibold text-gray-900">{selectedBooking.user_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Scheduled Date</p>
                                                    <p className="font-semibold text-gray-900">{new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-600">Total Guests</span>
                                                    <span className="font-bold text-gray-900">{selectedBooking.guests}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-600">Total Price</span>
                                                    <span className="font-bold text-gray-900">₹{selectedBooking.total_price}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Status</span>
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                                        ${selectedBooking.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        {selectedBooking.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {selectedBooking.special_requests && (
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                                                    <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-100">
                                                        {selectedBooking.special_requests}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex space-x-3 pt-2">
                                                <a
                                                    href={selectedBooking.user_contact ? `tel:${selectedBooking.user_contact}` : '#'}
                                                    className={`flex-1 py-2 rounded-lg text-center font-medium transition flex items-center justify-center space-x-2
                                                        ${selectedBooking.user_contact
                                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                    onClick={(e) => !selectedBooking.user_contact && e.preventDefault()}
                                                >
                                                    <span>Call Customer</span>
                                                </a>
                                                <a
                                                    href={selectedBooking.user_contact ? `https://wa.me/${selectedBooking.user_contact.replace(/\D/g, '')}` : '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex-1 border py-2 rounded-lg font-medium transition flex items-center justify-center space-x-2
                                                        ${selectedBooking.user_contact
                                                            ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                    onClick={(e) => !selectedBooking.user_contact && e.preventDefault()}
                                                >
                                                    Message
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Guide Profile</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Display Name</label>
                                        <input type="text" disabled={!isEditing} required value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${!isEditing ? 'bg-gray-100 text-gray-500' : ''}`} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                        <input type="text" disabled={!isEditing} required value={profileForm.contact} onChange={e => setProfileForm({ ...profileForm, contact: e.target.value })}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${!isEditing ? 'bg-gray-100 text-gray-500' : ''}`} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                                        <input type="text" disabled={!isEditing} placeholder="+91..." value={profileForm.whatsapp_number} onChange={e => setProfileForm({ ...profileForm, whatsapp_number: e.target.value })}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${!isEditing ? 'bg-gray-100 text-gray-500' : ''}`} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                                        <div className="flex flex-wrap gap-2">
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
                                                        className={`px-3 py-1 rounded-full text-xs border transition-colors 
                                                            ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}
                                                            ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {spec}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                                        <input type="number" disabled={!isEditing} value={profileForm.experience_years} onChange={e => setProfileForm({ ...profileForm, experience_years: e.target.value })}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${!isEditing ? 'bg-gray-100 text-gray-500' : ''}`} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                                    <div className="flex flex-wrap gap-2">
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
                                                    className={`px-3 py-1 rounded-full text-xs border transition-colors 
                                                        ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}
                                                        ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {lang}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bio / About Me</label>
                                    <textarea rows={4} disabled={!isEditing} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${!isEditing ? 'bg-gray-100 text-gray-500' : ''}`} />
                                    <p className="mt-2 text-sm text-gray-500">Briefly describe yourself and why tourists should book you.</p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving || saveSuccess || !isEditing}
                                        className={`px-6 py-2 rounded-lg font-medium shadow-sm transition flex items-center space-x-2
                                            ${saveSuccess ? 'bg-green-600 hover:bg-green-700 text-white' :
                                                !isEditing ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' :
                                                    isSaving ? 'bg-gray-400 cursor-not-allowed text-white' :
                                                        'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                    >
                                        {isSaving && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
                                        <span>
                                            {saveSuccess ? 'Saved Successfully!' : isSaving ? 'Saving...' : 'Save Changes'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </main>
            </div >
        </div >
    );
};

export default GuideDashboard;
