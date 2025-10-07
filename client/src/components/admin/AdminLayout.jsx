import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    FiMenu, 
    FiX, 
    FiHome, 
    FiShoppingBag, 
    FiUsers, 
    FiSettings, 
    FiDollarSign, 
    FiLogOut,
    FiPackage,
    FiTrendingUp,
    FiUser,
    FiShield
} from 'react-icons/fi';

const AdminLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { signOut, currentUser } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <FiHome className="text-xl" /> },
        { name: 'Products', path: '/admin/products', icon: <FiShoppingBag className="text-xl" /> },
        { name: 'Orders', path: '/admin/orders', icon: <FiDollarSign className="text-xl" /> },
        { name: 'Custom Orders', path: '/admin/custom-orders', icon: <FiPackage className="text-xl" /> },
        // { name: 'Users', path: '/admin/users', icon: <FiUsers className="text-xl" /> },
        // { name: 'Settings', path: '/admin/settings', icon: <FiSettings className="text-xl" /> },
    ];

    // Close mobile menu when location changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const isActivePath = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col bg-white shadow-xl transition-all duration-300 ${
                sidebarCollapsed ? 'w-20' : 'w-64'
            }`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Admin Panel
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Management Dashboard</p>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FiMenu className="text-gray-600 text-lg" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-3">
                        {navItems.map((item) => {
                            const isActive = isActivePath(item.path);
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                                            isActive
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                                        } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                    >
                                        <span className={`transition-transform duration-200 ${
                                            isActive ? 'scale-110' : 'group-hover:scale-110'
                                        }`}>
                                            {item.icon}
                                        </span>
                                        {!sidebarCollapsed && (
                                            <span className="ml-3 font-medium text-sm">{item.name}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-200">
                    {!sidebarCollapsed && currentUser && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <FiUser className="text-white text-sm" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {currentUser.email}
                                    </p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleSignOut}
                        className={`flex items-center w-full p-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
                            sidebarCollapsed ? 'justify-center' : ''
                        }`}
                    >
                        <FiLogOut className="text-lg" />
                        {!sidebarCollapsed && (
                            <span className="ml-3 font-medium text-sm">Logout</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                        {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <FiShield className="text-white" />
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
                <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    {/* Mobile Sidebar Header */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Admin Panel</h2>
                                <p className="text-purple-100 text-sm mt-1">Management Dashboard</p>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-purple-500 transition-colors duration-200"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        {currentUser && (
                            <div className="mt-4 p-3 bg-purple-500 rounded-xl">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <FiUser className="text-white" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white truncate">
                                            {currentUser.email}
                                        </p>
                                        <p className="text-xs text-purple-100">Administrator</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6">
                        <ul className="space-y-2 px-4">
                            {navItems.map((item) => {
                                const isActive = isActivePath(item.path);
                                return (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <span className={`transition-transform duration-200 ${
                                                isActive ? 'scale-110' : ''
                                            }`}>
                                                {item.icon}
                                            </span>
                                            <span className="ml-4 font-medium">{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Mobile Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center w-full p-4 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                            <FiLogOut className="text-lg" />
                            <span className="ml-4 font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${
                sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
            } ${mobileMenuOpen ? 'lg:ml-0' : ''}`}>
                <div className="pt-16 lg:pt-0">
                    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
