import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiHome, FiShoppingBag, FiUsers, FiSettings, FiDollarSign, FiLogOut } from 'react-icons/fi';

const AdminLayout = () => {  // Removed children prop
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { signOut } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
        { name: 'Products', path: '/admin/products', icon: <FiShoppingBag /> },
        { name: 'Orders', path: '/admin/orders', icon: <FiDollarSign /> },
        { name: 'Custorm Orders', path: '/admin/orders', icon: <FiDollarSign /> },

        // { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
        // { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
    ];

    // Close mobile menu when location changes
    useState(() => {
        setMobileMenuOpen(false);
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Mobile Header */}
            <header className="lg:hidden bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                    <div className="w-6"></div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-md">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                    </div>
                    <nav className="flex-1 overflow-y-auto">
                        <ul className="p-2 space-y-1">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={signOut}
                            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <FiLogOut className="mr-3" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile Sidebar */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75"
                            onClick={() => setMobileMenuOpen(false)}
                        ></div>
                        <div className="relative flex flex-col w-4/5 max-w-xs h-full bg-white">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                            </div>
                            <nav className="flex-1 overflow-y-auto">
                                <ul className="p-2 space-y-1">
                                    {navItems.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.path}
                                                className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <span className="mr-3">{item.icon}</span>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="p-4 border-t border-gray-200">
                                <button
                                    onClick={signOut}
                                    className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <FiLogOut className="mr-3" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content - Only Outlet here */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="p-4 md:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
