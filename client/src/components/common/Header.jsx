import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useEffect, useState, useRef } from 'react';
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
    FiArrowRight
} from 'react-icons/fi';
import debounce from 'lodash.debounce';
import axios from 'axios';
import {
    getSearchSuggestions,
    searchProducts
} from '../../services/searchService';
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from '../../services/notificationService';

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
        // Update the handleClickOutside function in your useEffect
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
};

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen, showUserDropdown, showNotifications]);


    // Add this useEffect in your component
    useEffect(() => {
        if (!currentUser) return;

        const fetchNotifications = async () => {
            try {
                const response = await getNotifications();
                setNotifications(response);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        // Request permission on first load
        requestNotificationPermission(currentUser.uid)
            .catch(error => console.error('Notification permission error:', error));

        // Handle incoming messages
        const unsubscribe = setupMessageHandler((payload) => {
            // Show toast notification
            toast.info(payload.notification?.body || 'New notification');

            // Refresh notifications
            fetchNotifications();

            // Optional: Play sound
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(e => console.error('Audio play failed:', e));
        });

        return () => {
            unsubscribe(); // Clean up the message handler
        };
    }, [currentUser]);

    // Search suggestions
    useEffect(() => {
        if (searchQuery.trim().length > 2) {
            const fetchSuggestions = async () => {
                try {
                    const data = await getSearchSuggestions(searchQuery);
                    setSearchSuggestions(data);
                    setShowSuggestions(true);
                } catch (error) {
                    setSearchSuggestions([]);
                }
            };

            const debounceTimer = setTimeout(fetchSuggestions, 300);
            return () => clearTimeout(debounceTimer);
        } else {
            setSearchSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);


    // In your Header component, update the logout handler
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
    const handleSearch = debounce(() => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowSuggestions(false);
            if (searchRef.current) searchRef.current.blur();
        }
    }, 500);




    // Mark as read functions
    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
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


      if (isAdmin) {
        return (
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-end">
                    <Link
                        to="https://bellebeauaesthetics.ng/admin"
                        className="bg-purplegradient hover:bg-purplegradientv text-white py-2 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        Admin Dashboard
                        <FiUser className="ml-1" />
                    </Link>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Session Timeout Warning */}
            {showTimeoutWarning && (
                <div className="bg-yellow-100 text-yellow-800 p-2 text-sm flex items-center justify-center gap-2">
                    <FiUser className="shrink-0" />
                    <span>Session expires in {formatTime(timeLeft)}. Move your mouse to extend.</span>
                </div>
            )}

            <div className="container mx-auto px-4 py-4">
                {/* Top Bar */}
                <div className="flex justify-between items-center">
                    {/* Logo and Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-purpleDark hover:text-purpleLight transition"
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                     <Link 
  to="/" 
  className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
>
  {/* Logo Image - Optimized Sizing */}
  <div className="
    w-[50px] h-[50px]       // Base size
    sm:w-[60px] sm:h-[60px]  // Small tablets
    md:w-[70px] md:h-[70px]  // Tablets
    lg:w-[80px] lg:h-[80px]  // Desktops
  ">
    <img 
      src="/images/logo.png" 
      alt="Bellebeau Aesthetics"
      className="w-full h-full object-contain" 
    />
  </div>

  {/* Text Container - Perfect Vertical Rhythm */}
  <div className="flex flex-col leading-none">
    <span className="
      text-[28px]           // Mobile
      sm:text-[32px]        // Small tablets
      md:text-[36px]        // Tablets
      lg:text-[40px]        // Desktops
      font-bold 
      text-purpleDark1
      tracking-tight        // Slightly condensed
      -mb-1                 // Tighten spacing
    ">
      Bellebeau
    </span>
    <span className="
      text-[15px]           // Mobile
      sm:text-[16px]        // Small tablets
      md:text-[18px]        // Tablets
      lg:text-[20px]        // Desktops
      font-medium           // Slightly emphasized (not bold)
      text-purpleDark1/80   // Subtle transparency
      tracking-wider        // Letter spacing for elegance
      mt-0.5                // Perfect vertical spacing
    ">
      Aesthetics
    </span>
  </div>
</Link>
                    </div>

                    {/* Desktop Search Bar with Suggestions */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-4 pr-10 py-2 border border-purpleLight rounded-lg focus:outline-none focus:ring-2 focus:ring-purpleLight focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
                                ref={searchRef}
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-3 top-2.5 text-purpleDark1 hover:text-primary transition"
                            >
                                <FiSearch size={18} />
                            </button>

                            {/* Search Suggestions */}
                            {showSuggestions && searchSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-purpleLight rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                    {searchSuggestions.map(item => (
                                        <div
                                            key={item.id}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                                            onClick={() => {
                                                navigate(`/products/${item.id}`);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-purpleDark1">{item.category}</div>
                                            </div>
                                            <FiChevronDown className="text-purpleDark transform rotate-90" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right-side Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Search Button */}
                        <button
                            className="md:hidden text-gray-purpleDark1 hover:text-primary transition"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                searchRef.current?.focus();
                            }}
                        >
                            <FiSearch size={20} />
                        </button>

                        {/* Notifications */}
                        {currentUser && (
                            <div className="relative notifications-container">
                                <button
                                    className="text-purpleDark hover:text-primary transition relative"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <FiBell size={20} />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-purpleDark1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {unreadNotifications}
                                        </span>
                                    )}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                                        <div className="p-3 font-medium border-b flex justify-between items-center">
                                            <span>Notifications</span>
                                            {unreadNotifications > 0 && (
                                                <button
                                                    onClick={handleMarkAllAsRead}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 border-b flex justify-between items-start ${!notification.read ? 'bg-purpleLight' : ''
                                                            }`}
                                                    >
                                                        <div>
                                                            <div className="text-sm">{notification.text}</div>
                                                            <div className="text-xs text-purpleDark1 mt-1">{notification.date}</div>
                                                        </div>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMarkAsRead(notification.id);
                                                                }}
                                                                className="text-green-500 hover:text-green-700 ml-2"
                                                                title="Mark as read"
                                                            >
                                                                <FiCheck size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-purpleDark1 text-center">No notifications</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="relative group">
                            <FiShoppingCart className="h-6 w-6 text-purpleDark group-hover:text-primary transition" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-purpleLight text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth Section */}
                        {currentUser ? (
                            <div className="hidden md:block relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="flex items-center space-x-1 text-purpleDark1 hover:text-primary transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {currentUser.photoURL ? (
                                            <img
                                                src={currentUser.photoURL}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="text-gray-500" />
                                        )}
                                    </div>
                                    <FiChevronDown className={`transition-transform ${showUserDropdown ? 'transform rotate-180' : ''}`} />
                                </button>

                                {/* User Dropdown */}
                                {showUserDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                                        <div className="p-4 border-b">
                                            <div className="font-medium">{currentUser.displayName || currentUser.email.split('@')[0]}</div>
                                            <div className="text-xs text-gray-500">{currentUser.email}</div>
                                        </div>
                                        {/* <NavLink
                                            to="/profile"
                                            onClick={() => setShowUserDropdown(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            My Profile
                                        </NavLink> */}
                                        {/* Add this new NavLink for Admin Dashboard */}
                                        {currentUser.isAdmin && (
                                            <NavLink
                                                to="/admin"
                                                onClick={() => setShowUserDropdown(false)}
                                                className="block px-4 py-2 hover:bg-gray-50 text-sm"
                                            >
                                                Dashboard
                                            </NavLink>
                                        )}
                                        <NavLink
                                            to="/about"
                                            onClick={() => setShowUserDropdown(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            About
                                        </NavLink> <NavLink
                                            to="/products"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) =>
                                                `py-2 ${isActive ? 'text-primary text-sm' : 'block px-4 py-2 hover:bg-gray-50 text-sm'}`
                                            }
                                        >
                                            Products
                                        </NavLink>
                                        {currentUser && (
                                            <>
                                                <NavLink
                                                    to="/orders"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={({ isActive }) =>
                                                        `py-2 ${isActive ? 'text-primary text-sm' : 'block px-4 py-2 hover:bg-gray-50 text-sm'}`
                                                    }
                                                >
                                                    Orders
                                                </NavLink>
                                                {/* <NavLink
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                                    }
                                >
                                    Profile
                                </NavLink> */}
                                                {currentUser.isAdmin && (
                                                    <NavLink
                                                        to="/admin"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={({ isActive }) =>
                                                            `py-2 ${isActive ? 'text-purpleDark1 font-medium' : 'text-purpleDark'}`
                                                        }
                                                    >
                                                        Dashboard
                                                    </NavLink>
                                                )}

                                            </>
                                        )}
                                        {/* <NavLink
                                            to="/settings"
                                            onClick={() => setShowUserDropdown(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            Settings
                                        </NavLink> */}
                                        <button
                                            onClick={handleLogout}
                                            disabled={logoutLoading}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${logoutLoading ? 'opacity-50 cursor-wait' : ''
                                                }`}
                                        >
                                            {logoutLoading ? 'Signing out...' : 'Sign out'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex space-x-3">
                                <Link
                                    to="/about"
                                    className="text-purpleDark1 hover:text-purpleLight transition"
                                >
                                    About
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-purpleDark1 hover:text-purpleLight transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-purpleDark1 hover:text-purpleLight transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar (only visible when activated) */}
                {mobileMenuOpen && (
                    <div className="mt-3 md:hidden">
                        <div className="relative">
 <input
                                type="text"
                                placeholder="Search products..."
                                className="mobile-search-input w-full pl-4 pr-10 py-2 border border-purpleLight rounded-lg focus:outline-none focus:ring-2 focus:ring-purpleDark1 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                ref={searchRef}
                            />
                            <button
                                onClick={handleSearch()}
                                className="mobile-search-input absolute right-3 top-2.5 text-purpleLight hover:text-purpleLight transition"
                            >
                                <FiSearch size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu-container md:hidden bg-white border-t">
                    <nav className="container mx-auto px-4 py-3 flex flex-col space-y-3">
                        <NavLink
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `py-2 ${isActive ? 'text-purpleDark1 font-medium' : 'text-purpleDark1'}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `py-2 ${isActive ? 'text-purpleDark1 font-medium' : 'text-purpleDark1'}`
                            }
                        >
                            Products
                        </NavLink>
                        {currentUser && (
                            <>
                                <NavLink
                                    to="/orders"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `py-2 ${isActive ? 'text-purpleDark1 font-medium' : 'text-purpleDark1'}`
                                    }
                                >
                                    Orders
                                </NavLink>
                                {/* <NavLink
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `py-2 ${isActive ? 'text-primary font-medium' : 'text-gray-600'}`
                                    }
                                >
                                    Profile
                                </NavLink> */}
                                {currentUser.isAdmin && (
                                    <NavLink
                                        to="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `py-2 ${isActive ? 'text-purpleLight font-medium' : 'text-purpleDark1'}`
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                )}

                            </>
                        )}
                        {currentUser ? (
                            <>
                                <div className="pt-2 border-t">
                                    <button
                                        onClick={handleLogout}
                                        disabled={logoutLoading}
                                        className={`w-full text-left py-2 flex items-center space-x-2 ${logoutLoading ? 'opacity-50 cursor-wait' : 'text-purpleDark hover:text-purpleLight'
                                            }`}
                                    >
                                        <FiLogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-2 border-t flex flex-col space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 text-purpleDark hover:text-purpleLight transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className=" text-purpleDark1 py-2 hover:text-purpleLight  transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
