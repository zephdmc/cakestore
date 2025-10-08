import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { requestNotificationPermission, setupMessageHandler } from '../../firebase/config';
import {
    FiShoppingCart,
    FiUser,
    FiLogOut,
    FiAlertTriangle,
    FiMenu,
    FiX,
    FiSearch,
    FiBell,
    FiChevronDown,
    FiCheck,
    FiArrowRight,
    FiHeart,
    FiPackage,
    FiHome,
    FiShoppingBag
} from 'react-icons/fi';
import debounce from 'lodash.debounce';
import {
    getSearchSuggestions,
    searchProducts
} from '../../services/searchService';
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from '../../services/notificationService';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);
const MotionNavLink = motion(NavLink);

// Notification Item Component
const NotificationItem = ({ notification, onMarkAsRead }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 border-b border-white/10 flex justify-between items-start group hover:bg-white/5 transition-all duration-300 ${
            !notification.read ? 'bg-purple-500/10' : ''
        }`}
    >
        <div className="flex-1 min-w-0">
            <div className="text-white text-sm leading-relaxed">{notification.text}</div>
            <div className="text-white/60 text-xs mt-2">{notification.date}</div>
        </div>
        {!notification.read && (
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id || notification._id);
                }}
                className="text-green-400 hover:text-green-300 ml-3 transition-colors duration-200"
                title="Mark as read"
            >
                <FiCheck size={16} />
            </motion.button>
        )}
    </motion.div>
);

// Search Suggestion Item
const SearchSuggestion = ({ item, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 flex justify-between items-center group transition-all duration-300"
        onClick={onClick}
    >
        <div className="flex-1 min-w-0">
            <div className="text-white font-medium truncate">{item.name}</div>
            <div className="text-white/60 text-xs mt-1">{item.category}</div>
        </div>
        <FiArrowRight className="text-white/40 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300" />
    </motion.div>
);

export default function Header() {
    const {
        currentUser,
        logoutLoading,
        signOut,
        sessionExpiresAt,
        refreshToken
    } = useAuth();

    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    // Hide entire nav if user is admin
    const isAdmin = currentUser?.isAdmin;

    // Session timeout warning
    useEffect(() => {
        if (!sessionExpiresAt) return;

        const updateTimeoutWarning = () => {
            const remainingTime = sessionExpiresAt - Date.now();
            setTimeLeft(Math.max(0, remainingTime));
            setShowTimeoutWarning(remainingTime < 5 * 60 * 1000);
        };

        updateTimeoutWarning();
        const interval = setInterval(updateTimeoutWarning, 30000);
        return () => clearInterval(interval);
    }, [sessionExpiresAt]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && 
                !event.target.closest('.mobile-menu-container') && 
                !event.target.closest('.mobile-search-input')) {
                setMobileMenuOpen(false);
            }
            if (showUserDropdown && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
            if (showNotifications && !event.target.closest('.notifications-container')) {
                setShowNotifications(false);
            }
            if (showSuggestions && searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen, showUserDropdown, showNotifications, showSuggestions]);

    // Notifications setup
    useEffect(() => {
        if (!currentUser) return;

        const fetchNotifications = async () => {
            try {
                const response = await getNotifications();
                setNotifications(response || []);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                setNotifications([]);
            }
        };

        requestNotificationPermission(currentUser.uid)
            .catch(error => console.error('Notification permission error:', error));

        const unsubscribe = setupMessageHandler((payload) => {
            toast.info(payload.notification?.body || 'New notification');
            fetchNotifications();
        });

        fetchNotifications();
        return () => unsubscribe();
    }, [currentUser]);

    // Debounced search function with useCallback
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.trim().length > 2) {
                try {
                    const data = await getSearchSuggestions(query);
                    setSearchSuggestions(data || []);
                    setShowSuggestions(true);
                } catch (error) {
                    setSearchSuggestions([]);
                    setShowSuggestions(false);
                }
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300),
        []
    );

    // Search suggestions
    useEffect(() => {
        debouncedSearch(searchQuery);
        
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    const handleLogout = async () => {
        try {
            await signOut({
                redirectTo: '/login',
                onSuccess: () => {
                    toast.success("Logged out successfully");
                    setMobileMenuOpen(false);
                },
            });
        } catch (error) {
            toast.error(`Logout failed: ${error.message}`);
        }
    };

    // Search function
    const handleSearch = useCallback(debounce(() => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowSuggestions(false);
            if (searchRef.current) searchRef.current.blur();
        }
    }, 500), [searchQuery, navigate]);

    // Mark as read functions
    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n =>
                (n.id === id || n._id === id) ? { ...n, read: true } : n
            ));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    const formatTime = (ms) => {
        if (!ms) return '0:00';
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle Enter key in search
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            e.preventDefault();
        }
    };

    if (isAdmin) {
        return (
            <header className="bg-gradient-to-r from-purple-900 to-pink-800 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-end">
                    <MotionLink
                        to="/admin"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg flex items-center gap-2 backdrop-blur-sm border border-white/20"
                    >
                        Admin Dashboard
                        <FiArrowRight className="text-sm" />
                    </MotionLink>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-gradient-to-r from-purple-900 to-pink-800 shadow-2xl sticky top-0 z-50">
            {/* Session Timeout Warning */}
            <AnimatePresence>
                {showTimeoutWarning && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-yellow-500/20 backdrop-blur-sm text-yellow-200 p-3 text-sm flex items-center justify-center gap-3 border-b border-yellow-500/30"
                    >
                        <FiAlertTriangle className="flex-shrink-0" />
                        <span>Session expires in {formatTime(timeLeft)}. Move your mouse to extend.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 py-3">
                {/* Main Header */}
                <div className="flex justify-between items-center">
                    {/* Logo and Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-white hover:text-purple-200 transition-all duration-300 p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </motion.button>
                        
                        <MotionLink
                            to="/"
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center p-2">
                                <img 
                                    src="/images/logo.png" 
                                    alt="Stefanos Bakeshop"
                                    className="w-full h-full object-contain" 
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight -mb-1">
                                    Stefanos
                                </span>
                                <span className="text-sm sm:text-base font-medium text-white/80 tracking-wider mt-0.5">
                                    Bakeshop
                                </span>
                            </div>
                        </MotionLink>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
                        <div className="relative w-full" ref={searchRef}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search cakes, pastries, and more..."
                                    className="w-full pl-5 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300"
                                >
                                    <FiSearch size={20} />
                                </motion.button>
                            </div>

                            {/* Search Suggestions */}
                            <AnimatePresence>
                                {showSuggestions && searchSuggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto"
                                    >
                                        {searchSuggestions.map((item, index) => (
                                            <SearchSuggestion
                                                key={item.id || `search-${index}`}
                                                item={item}
                                                onClick={() => {
                                                    navigate(`/products/${item.id}`);
                                                    setShowSuggestions(false);
                                                    setSearchQuery('');
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right-side Icons */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Search Button - REMOVED */}
                        {/* Search icon removed from mobile view as requested */}

                        {/* Notifications */}
                        {currentUser && (
                            <div className="relative notifications-container">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative text-white hover:text-purple-200 transition-colors duration-300 p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <FiBell size={20} />
                                    {unreadNotifications > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-purple-900"
                                        >
                                            {unreadNotifications}
                                        </motion.span>
                                    )}
                                </motion.button>
                                
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl z-50"
                                        >
                                            <div className="p-4 font-semibold text-white border-b border-white/10 flex justify-between items-center">
                                                <span>Notifications</span>
                                                {unreadNotifications > 0 && (
                                                    <button
                                                        onClick={handleMarkAllAsRead}
                                                        className="text-sm text-purple-300 hover:text-purple-200 transition-colors duration-300"
                                                    >
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification, index) => (
                                                        <NotificationItem
                                                            key={notification.id || notification._id || `notification-${index}`}
                                                            notification={notification}
                                                            onMarkAsRead={handleMarkAsRead}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="p-6 text-white/60 text-center">
                                                        No notifications
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Cart */}
                        <MotionLink
                            to="/cart"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative group p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            <FiShoppingCart className="h-6 w-6 text-white group-hover:text-purple-200 transition-colors duration-300" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center border-2 border-purple-900 font-semibold"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </MotionLink>

                        {/* Auth Section */}
                        {currentUser ? (
                            <div className="hidden lg:block relative" ref={userMenuRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="flex items-center gap-3 text-white hover:text-purple-200 transition-colors duration-300 p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden border-2 border-white/20">
                                        {currentUser.photoURL ? (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-white text-lg" />
                                        )}
                                    </div>
                                    <FiChevronDown className={`transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : ''}`} />
                                </motion.button>

                                {/* User Dropdown */}
                                <AnimatePresence>
                                    {showUserDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl z-50"
                                        >
                                            <div className="p-4 border-b border-white/10">
                                                <div className="font-semibold text-white text-lg">
                                                    {currentUser.displayName || currentUser.email.split('@')[0]}
                                                </div>
                                                <div className="text-white/60 text-sm mt-1">{currentUser.email}</div>
                                            </div>
                                            
                                            <div className="p-2 space-y-1">
                                                {currentUser.isAdmin && (
                                                    <NavLink
                                                        to="/admin"
                                                        onClick={() => setShowUserDropdown(false)}
                                                        className="flex items-center gap-3 px-3 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium"
                                                    >
                                                        <FiPackage className="text-lg" />
                                                        Dashboard
                                                    </NavLink>
                                                )}
                                                <NavLink
                                                    to="/orders"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center gap-3 px-3 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium"
                                                >
                                                    <FiShoppingBag className="text-lg" />
                                                    My Orders
                                                </NavLink>
                                                <NavLink
                                                    to="/products"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center gap-3 px-3 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium"
                                                >
                                                    <FiHeart className="text-lg" />
                                                    Products
                                                </NavLink>
                                            </div>
                                            
                                            <div className="p-2 border-t border-white/10">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleLogout}
                                                    disabled={logoutLoading}
                                                    className={`w-full flex items-center gap-3 px-3 py-3 text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 text-sm font-medium ${
                                                        logoutLoading ? 'opacity-50 cursor-wait' : ''
                                                    }`}
                                                >
                                                    <FiLogOut className="text-lg" />
                                                    {logoutLoading ? 'Signing out...' : 'Sign out'}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-3">
                                <MotionLink
                                    to="/about"
                                    whileHover={{ scale: 1.05 }}
                                    className="text-white hover:text-purple-200 transition-colors duration-300 font-medium"
                                >
                                    About
                                </MotionLink>
                                <MotionLink
                                    to="/login"
                                    whileHover={{ scale: 1.05 }}
                                    className="text-white hover:text-purple-200 transition-colors duration-300 font-medium"
                                >
                                    Login
                                </MotionLink>
                                <MotionLink
                                    to="/register"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                                >
                                    Register
                                </MotionLink>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 lg:hidden"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search cakes, pastries, and more..."
                                    className="mobile-search-input w-full pl-4 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    ref={searchRef}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSearch}
                                    className="mobile-search-input absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300"
                                >
                                    <FiSearch size={20} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        className="mobile-menu-container lg:hidden bg-gradient-to-b from-purple-900 to-pink-800 border-t border-white/20 fixed inset-0 z-40 pt-20"
                    >
                        {/* Close Button */}
                        <div className="absolute top-4 right-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-purple-200 transition-colors duration-300 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                            >
                                <FiX size={24} />
                            </motion.button>
                        </div>

                        {/* User Profile Section */}
                        {currentUser && (
                            <div className="px-6 py-4 border-b border-white/20 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden border-2 border-white/20">
                                        {currentUser.photoURL ? (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-white text-2xl" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white text-lg truncate">
                                            {currentUser.displayName || currentUser.email.split('@')[0]}
                                        </div>
                                        <div className="text-white/60 text-sm truncate">
                                            {currentUser.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <nav className="container mx-auto px-6 py-4 flex flex-col space-y-2">
                            <NavLink
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-white/20 text-white' 
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <FiHome className="text-xl" />
                                Home
                            </NavLink>
                            
                            <NavLink
                                to="/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-white/20 text-white' 
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <FiShoppingBag className="text-xl" />
                                Products
                            </NavLink>

                            {currentUser && (
                                <>
                                    <NavLink
                                        to="/orders"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                                isActive 
                                                    ? 'bg-white/20 text-white' 
                                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }`
                                        }
                                    >
                                        <FiPackage className="text-xl" />
                                        Orders
                                    </NavLink>
                                    
                                    {currentUser.isAdmin && (
                                        <NavLink
                                            to="/admin"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                                    isActive 
                                                        ? 'bg-white/20 text-white' 
                                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                                }`
                                            }
                                        >
                                            <FiUser className="text-xl" />
                                            Dashboard
                                        </NavLink>
                                    )}
                                </>
                            )}

                            {currentUser ? (
                                <div className="pt-6 border-t border-white/20 mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLogout}
                                        disabled={logoutLoading}
                                        className={`w-full flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                                            logoutLoading 
                                                ? 'opacity-50 cursor-wait bg-white/10 text-white/60' 
                                                : 'bg-red-500/20 text-red-200 hover:bg-red-500/30'
                                        }`}
                                    >
                                        <FiLogOut className="text-xl" />
                                        {logoutLoading ? 'Signing out...' : 'Sign out'}
                                    </motion.button>
                                </div>
                            ) : (
                                <div className="pt-6 border-t border-white/20 mt-4 space-y-2">
                                    <MotionLink
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                                    >
                                        <FiUser className="text-xl" />
                                        Login
                                    </MotionLink>
                                    <MotionLink
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                                    >
                                        <FiUser className="text-xl" />
                                        Register
                                    </MotionLink>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
