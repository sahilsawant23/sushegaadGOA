import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ChatbotProvider } from './context/ChatbotContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { CompareProvider } from './context/CompareContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ChatbotWidget from './components/chatbot/ChatbotWidget';
import CompareTray from './components/common/CompareTray';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Destinations from './pages/Destinations';
import BeachDetails from './pages/BeachDetails';
import TempleDetails from './pages/TempleDetails';
import ChurchDetails from './pages/ChurchDetails';
import WaterfallDetails from './pages/WaterfallDetails';
import CultureDetails from './pages/CultureDetails';
import AuthenticDetails from './pages/AuthenticDetails';
import Nightlife from './pages/Nightlife';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import RealtimeExplorer from './pages/RealtimeExplorer';

import AdminDashboard from './pages/AdminDashboard';
import GuideDashboard from './pages/GuideDashboard';
import GuideRegister from './pages/GuideRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import MapExplorer from './pages/MapExplorer';
import ComparisonPage from './pages/ComparisonPage';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import HiddenGems from './pages/HiddenGems';
import HiddenGemDetails from './pages/HiddenGemDetails';
import PlaceDetails from './pages/PlaceDetails';
import RegionDetails from './pages/RegionDetails';
import AITripPlanner from './pages/AITripPlanner';

const AppContent = () => {
  const location = useLocation();

  // Routes where Navbar and Footer should be hidden
  const hideLayout = ['/admin/dashboard', '/guide/dashboard'].some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:regionName" element={<RegionDetails />} />
          <Route path="/destination/beach/:id" element={<BeachDetails />} />
          <Route path="/destination/temple/:id" element={<TempleDetails />} />
          <Route path="/destination/church/:id" element={<ChurchDetails />} />
          <Route path="/destination/waterfall/:id" element={<WaterfallDetails />} />
          <Route path="/destination/culture/:id" element={<CultureDetails />} />
          <Route path="/destination/authentic/:id" element={<AuthenticDetails />} />
          <Route path="/destination/:category/:id" element={<PlaceDetails />} />
          <Route path="/nightlife" element={<RealtimeExplorer />} />
          <Route path="/nightlife/:id" element={<PlaceDetails />} />
          <Route path="/places" element={<RealtimeExplorer />} />
          <Route path="/ai-planner" element={<AITripPlanner />} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/hidden-gems" element={<HiddenGems />} />
          <Route path="/hidden-gems/:id" element={<HiddenGemDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/guide/dashboard" element={<GuideDashboard />} />
          <Route path="/guide/register" element={<GuideRegister />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking/:tourId" element={<Booking />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/my-bookings" element={<Bookings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/map-explorer" element={<MapExplorer />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <ChatbotWidget />}
      {!hideLayout && <CompareTray />}
    </div>
  );
};

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CompareProvider>
            <ChatbotProvider>
              <Router>
                <ScrollToTop />
                <AppContent />
              </Router>
            </ChatbotProvider>
          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;