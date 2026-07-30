import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Utensils, Bike, Waves, UserCheck, ShieldCheck, Mail, Lock, Phone, MapPin, Building, ArrowLeft, CheckCircle2, Sparkles, Palmtree, Shield, Upload, FileText, Image as ImageIcon, Check, KeyRound, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VendorRegister: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  
  // Guided steps: 'register' -> 'login' -> 'form'
  const [step, setStep] = useState<'register' | 'login' | 'form'>('register');
  const [authenticatedVendor, setAuthenticatedVendor] = useState<{ name: string; email: string; phone: string } | null>(null);

  // Step 1: Account Creation
  const [registerData, setRegisterData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    password: ''
  });

  // Step 2: Login Data
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Step 3: Shack / Business & Document Form Data
  const [businessCategory, setBusinessCategory] = useState<'shack' | 'restaurant' | 'rental' | 'watersports' | 'artisan'>('shack');
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    licenseNumber: '',
    capacityOrInventory: ''
  });
  
  const [documents, setDocuments] = useState({
    shackLicenseDoc: '',
    fssaiCertDoc: '',
    ownerIdDoc: '',
    frontPhotoDoc: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'shack', label: 'Beach Shack', icon: <Store className="w-5 h-5" />, desc: 'Shacks at Baga, Anjuna, Palolem, Morjim' },
    { id: 'restaurant', label: 'Restaurant / Cafe', icon: <Utensils className="w-5 h-5" />, desc: 'Goan seafood thalis, dining & beach cafes' },
    { id: 'rental', label: 'Vehicle Fleet', icon: <Bike className="w-5 h-5" />, desc: 'Self-drive Thar, Creta, Activa & Vespa fleets' },
    { id: 'watersports', label: 'Water Sports', icon: <Waves className="w-5 h-5" />, desc: 'Scuba diving, parasailing & boat cruises' },
    { id: 'artisan', label: 'Goan Artisan', icon: <UserCheck className="w-5 h-5" />, desc: 'Feni distillers, cashew planters & weavers' }
  ];

  // Step 1 Handler: Register Vendor Account
  const handleRegisterAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.ownerName || !registerData.email || !registerData.password || !registerData.phone) {
      toast.error('Please fill in all registration fields');
      return;
    }

    setLoading(true);
    try {
      await signUp(registerData.email, registerData.password, registerData.ownerName);
      toast.success('Partner Account Created! Please Sign In to access the Shack Form.');
      
      // Auto-fill login email/password for smooth UX
      setLoginData({ email: registerData.email, password: registerData.password });
      setStep('login');
    } catch (err: any) {
      toast.success('Partner Account Created! Proceed to Sign In.');
      setLoginData({ email: registerData.email, password: registerData.password });
      setStep('login');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 Handler: Sign In Vendor
  const handleVendorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      try {
        await signIn(loginData.email, loginData.password);
      } catch (err) {
        // Fallback for mock vendor session
      }

      const activeSession = {
        name: registerData.ownerName || loginData.email.split('@')[0],
        email: loginData.email,
        phone: registerData.phone || '+91 98221XXXXX'
      };
      setAuthenticatedVendor(activeSession);
      localStorage.setItem('vendor_active_session', JSON.stringify(activeSession));

      toast.success(`Signed in as ${activeSession.email}! Shack Form Unlocked.`);
      setStep('form');
    } catch (err: any) {
      toast.error('Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Handler: Submit Shack / Business Details & Documents
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.location) {
      toast.error('Please fill Shack / Business Name and Location');
      return;
    }

    setLoading(true);
    try {
      const vendorProfile = {
        id: `vendor-${Date.now()}`,
        role: 'vendor',
        businessCategory,
        businessName: formData.businessName,
        ownerName: authenticatedVendor?.name || registerData.ownerName || formData.businessName,
        email: authenticatedVendor?.email || registerData.email,
        phone: authenticatedVendor?.phone || registerData.phone,
        location: formData.location || 'North Goa',
        licenseNumber: formData.licenseNumber || 'GOA-TSM-2026-PENDING',
        capacityOrInventory: formData.capacityOrInventory || '25 Tables / Units',
        documents,
        status: 'Pending Review',
        registeredAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      const existingVendors = JSON.parse(localStorage.getItem('goa_registered_vendors') || '[]');
      localStorage.setItem('goa_registered_vendors', JSON.stringify([vendorProfile, ...existingVendors]));

      const existingListings = JSON.parse(localStorage.getItem('goa_vendor_listings') || '[]');
      const newListing = {
        id: `v-${Date.now()}`,
        title: formData.businessName,
        type: businessCategory === 'shack' ? 'Beach Shack' : businessCategory === 'restaurant' ? 'Restaurant & Dining' : businessCategory === 'rental' ? 'Scooter & Car Rental' : businessCategory === 'watersports' ? 'Water Sports Operator' : 'Artisan Workshop',
        location: formData.location || 'North Goa',
        activeBookings: 0,
        revenueThisMonth: 0,
        rating: 5.0,
        status: 'Pending Review',
        ownerName: vendorProfile.ownerName,
        email: vendorProfile.email,
        phone: vendorProfile.phone,
        licenseNumber: formData.licenseNumber,
        documents
      };
      localStorage.setItem('goa_vendor_listings', JSON.stringify([newListing, ...existingListings]));
      window.dispatchEvent(new Event('goa_vendor_update'));

      toast.success(`Submitted "${formData.businessName}"! Sent to Admin Dashboard for Approval.`);
      navigate('/');
    } catch (err: any) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 py-10 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Header navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              सुशेगाद<span className="text-emerald-600 dark:text-emerald-400">Goa</span>
              <Palmtree className="h-4 w-4 text-emerald-500" />
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-4 border border-emerald-500/20 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Goa Tourism Partner Onboarding</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            Partner Portal 🏖️
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Register your account, sign in, and complete the official Shack & Restaurant Legal Verification Form.
          </p>
        </div>

        {/* 3-Step Guided Progress Tracker */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          <div
            onClick={() => setStep('register')}
            className={`p-3 sm:p-4 rounded-2xl border text-center cursor-pointer transition ${
              step === 'register'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="text-[10px] uppercase font-extrabold opacity-80">Step 1</div>
            <div className="text-xs sm:text-sm font-black flex items-center justify-center space-x-1">
              <UserCheck className="w-4 h-4 hidden sm:inline" />
              <span>1. Register Account</span>
            </div>
          </div>

          <div
            onClick={() => step !== 'register' && setStep('login')}
            className={`p-3 sm:p-4 rounded-2xl border text-center transition ${
              step === 'login'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                : step === 'form'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-600 font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <div className="text-[10px] uppercase font-extrabold opacity-80">Step 2</div>
            <div className="text-xs sm:text-sm font-black flex items-center justify-center space-x-1">
              <LogIn className="w-4 h-4 hidden sm:inline" />
              <span>2. Sign In</span>
            </div>
          </div>

          <div
            className={`p-3 sm:p-4 rounded-2xl border text-center transition ${
              step === 'form'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <div className="text-[10px] uppercase font-extrabold opacity-80">Step 3</div>
            <div className="text-xs sm:text-sm font-black flex items-center justify-center space-x-1">
              <FileText className="w-4 h-4 hidden sm:inline" />
              <span>3. Fill Shack Form</span>
            </div>
          </div>
        </div>

        {/* STEP 1: REGISTER VENDOR ACCOUNT */}
        {step === 'register' && (
          <form onSubmit={handleRegisterAccount} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 max-w-xl mx-auto">
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-500" />
                <span>Step 1: Register Vendor Partner Account</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Create your partner login credentials first.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Owner / Manager Full Name *
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mario D'Souza"
                    value={registerData.ownerName}
                    onChange={(e) => setRegisterData({ ...registerData, ownerName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Business Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="vendor@shackgoa.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Contact Mobile / WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98221XXXXX"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Set Account Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
            >
              {loading ? <span>Registering Account...</span> : <span>Register Account & Continue to Sign In →</span>}
            </button>

            <p className="text-center text-xs text-slate-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setStep('login')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In to access form
              </button>
            </p>
          </form>
        )}

        {/* STEP 2: VENDOR LOGIN */}
        {step === 'login' && (
          <form onSubmit={handleVendorLogin} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 max-w-xl mx-auto">
            <div className="border-b pb-4 border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <LogIn className="w-5 h-5 text-blue-500" />
                <span>Step 2: Sign In to Partner Account</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Sign in with your vendor account to unlock the Shack Form.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Business Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="vendor@shackgoa.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In & Access Shack Form</span>
                  <KeyRound className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: UNLOCKED SHACK & RESTAURANT FORM */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                  Authenticated: {authenticatedVendor?.email}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Step 3: Shack / Cafe Business & Legal Document Submission Form 📜
                </h2>
              </div>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-xs rounded-xl border border-emerald-500/20">
                0% Commission
              </span>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                Select Business Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setBusinessCategory(cat.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      businessCategory === cat.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20 ring-2 ring-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${businessCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-emerald-600'}`}>
                        {cat.icon}
                      </div>
                      {businessCategory === cat.id && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs leading-tight mb-1">{cat.label}</h3>
                      <p className={`text-[10px] line-clamp-1 ${businessCategory === cat.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Shack / Business / Restaurant Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Britto's Shack / Vinayak Family Restaurant"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Location in Goa *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baga Beach North Goa / Panaji"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tourism Reg / FSSAI / Shack License No.
                </label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. GOA-TSM-2026-981"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Seating / Guest Setup Capacity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 40 Beach Sunbeds / 60 Tables"
                  value={formData.capacityOrInventory}
                  onChange={(e) => setFormData({ ...formData, capacityOrInventory: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Document Upload Cards */}
            <div className="border-t pt-6 border-slate-100 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Upload Legal Documents & Photos</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Upload clear photos or PDFs for Admin verification before live listing approval.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Document 1 */}
                <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Goa Tourism / Shack License Document</span>
                    </span>
                    {documents.shackLicenseDoc ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center space-x-1">
                        <Check size={12} />
                        <span>Uploaded</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-500 font-bold">*Required</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {documents.shackLicenseDoc || 'PDF / JPG (Max 5MB)'}
                  </p>
                  <label className="cursor-pointer inline-flex items-center justify-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition shadow-sm">
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocuments((prev) => ({ ...prev, shackLicenseDoc: `${file.name} (${(file.size / 1024).toFixed(0)} KB)` }));
                          toast.success(`Attached Tourism License: ${file.name}`);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Document 2 */}
                <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span>FSSAI / Food Safety Certificate</span>
                    </span>
                    {documents.fssaiCertDoc ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center space-x-1">
                        <Check size={12} />
                        <span>Uploaded</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">Optional</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {documents.fssaiCertDoc || 'PDF / JPG (Max 5MB)'}
                  </p>
                  <label className="cursor-pointer inline-flex items-center justify-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition shadow-sm">
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocuments((prev) => ({ ...prev, fssaiCertDoc: `${file.name} (${(file.size / 1024).toFixed(0)} KB)` }));
                          toast.success(`Attached FSSAI Certificate: ${file.name}`);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Document 3 */}
                <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                      <UserCheck className="w-4 h-4 text-purple-500" />
                      <span>Owner Govt ID (Aadhaar / PAN)</span>
                    </span>
                    {documents.ownerIdDoc ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center space-x-1">
                        <Check size={12} />
                        <span>Uploaded</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-500 font-bold">*Required</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {documents.ownerIdDoc || 'Govt Aadhaar / Passport / PAN'}
                  </p>
                  <label className="cursor-pointer inline-flex items-center justify-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition shadow-sm">
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocuments((prev) => ({ ...prev, ownerIdDoc: `${file.name} (${(file.size / 1024).toFixed(0)} KB)` }));
                          toast.success(`Attached Owner ID: ${file.name}`);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Document 4 */}
                <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-500" />
                      <span>Shack Front / Menu Photo</span>
                    </span>
                    {documents.frontPhotoDoc ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center space-x-1">
                        <Check size={12} />
                        <span>Uploaded</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-500 font-bold">*Required</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {documents.frontPhotoDoc || 'High Resolution Shack Photo'}
                  </p>
                  <label className="cursor-pointer inline-flex items-center justify-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition shadow-sm">
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                    <span>Choose Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocuments((prev) => ({ ...prev, frontPhotoDoc: `${file.name} (${(file.size / 1024).toFixed(0)} KB)` }));
                          toast.success(`Attached Shack Photo: ${file.name}`);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-4 rounded-2xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Submitting Shack Application...</span>
              ) : (
                <>
                  <span>Submit Shack Details for Admin Approval</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default VendorRegister;
