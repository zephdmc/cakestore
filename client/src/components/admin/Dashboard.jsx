import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllOrders } from '../../services/orderService';
import { getProducts } from '../../services/productServic';
import { getAllCustomOrders } from '../../services/customOrderService';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiPackage, 
    FiShoppingCart, 
    FiDollarSign, 
    FiUsers, 
    FiTrendingUp, 
    FiTrendingDown,
    FiRefreshCw,
    FiAlertCircle,
    FiBarChart2,
    FiCalendar
} from 'react-icons/fi';

const Dashboard = () => {
    const { currentUser, isAdmin } = useAuth();
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        customOrders: 0,
        revenue: 0,
        users: 0,
        monthlyGrowth: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            setRefreshing(true);
            const [productsRes, ordersRes, customOrdersRes] = await Promise.all([
                getProducts().catch(err => {
                    console.error('Products fetch error:', err);
                    return { data: [] };
                }),
                getAllOrders().catch(err => {
                    console.error('Orders fetch error:', err);
                    return { data: [] };
                }),
                getAllCustomOrders().catch(err => {
                    console.error('Custom orders fetch error:', err);
                    return [];
                })
            ]);

            const revenue = ordersRes.data?.reduce(
                (acc, order) => acc + (order.totalPrice || 0),
                0
            ) || 0;

            const customOrdersRevenue = customOrdersRes?.reduce(
                (acc, order) => acc + (order.price || 0),
                0
            ) || 0;

            const totalRevenue = revenue + customOrdersRevenue;
            const totalOrders = (ordersRes.data?.length || 0) + (customOrdersRes?.length || 0);

            // Calculate monthly growth (mock data for demo)
            const monthlyGrowth = 15; // This would come from your analytics

            setStats({
                products: productsRes.data?.length || 0,
                orders: totalOrders,
                customOrders: customOrdersRes?.length || 0,
                revenue: totalRevenue,
                users: 0, // Would need a users API endpoint
                monthlyGrowth
            });
            setError(null);
        } catch (error) {
            console.error('Dashboard error:', error);
            setError('Failed to load dashboard data. Showing cached statistics.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleRefresh = () => {
        fetchStats();
    };

    if (!isAdmin) return null;

    const statsCards = [
        {
            title: "Total Products",
            value: stats.products,
            icon: FiPackage,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
            trend: { value: 12, label: "vs last month", positive: true },
            isError: error && stats.products === 0
        },
        {
            title: "Total Orders",
            value: stats.orders,
            icon: FiShoppingCart,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
            trend: { value: 8, label: "vs last month", positive: true },
            isError: error && stats.orders === 0,
            subtitle: `${stats.customOrders} custom orders`
        },
        {
            title: "Total Revenue",
            value: `₦${stats.revenue.toLocaleString()}`,
            icon: FiDollarSign,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-gradient-to-r from-green-500 to-emerald-500",
            trend: { value: 15, label: "vs last month", positive: true },
            isError: error && stats.revenue === 0
        },
        {
            title: "Monthly Growth",
            value: `${stats.monthlyGrowth}%`,
            icon: FiBarChart2,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
            trend: { value: 2, label: "vs last month", positive: stats.monthlyGrowth > 0 },
            isError: false
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                    <p className="text-gray-600">
                        Welcome back, {currentUser?.email?.split('@')[0] || 'Admin'}! Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-2" />
                        <span>{new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center bg-white text-gray-700 py-2 px-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                        <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm"
                    >
                        <div className="flex items-center">
                            <FiAlertCircle className="text-red-500 text-xl mr-3" />
                            <div>
                                <p className="text-red-700 font-medium">{error}</p>
                                <p className="text-red-600 text-sm mt-1">
                                    Some data may not be up to date. Try refreshing the page.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-2xl shadow-lg p-6 h-32 animate-pulse"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        statsCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1">
                                                    {card.title}
                                                </p>
                                                <p className={`text-2xl font-bold ${
                                                    card.isError ? 'text-red-500' : 'text-gray-900'
                                                }`}>
                                                    {card.value}
                                                </p>
                                                {card.subtitle && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {card.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={`${card.bgColor} rounded-xl p-3 text-white`}>
                                                <Icon className="text-xl" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {card.trend.positive ? (
                                                    <FiTrendingUp className="text-green-500 mr-1" />
                                                ) : (
                                                    <FiTrendingDown className="text-red-500 mr-1" />
                                                )}
                                                <span className={`text-sm font-medium ${
                                                    card.trend.positive ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {card.trend.positive ? '+' : ''}{card.trend.value}%
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {card.trend.label}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Progress bar */}
                                    <div className="w-full bg-gray-200 h-1">
                                        <div 
                                            className={`h-1 transition-all duration-1000 ${
                                                card.trend.positive ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${Math.min(card.trend.value, 100)}%` }}
                                        ></div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Additional Dashboard Sections */}
            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Add Product', icon: FiPackage, path: '/admin/products/new' },
                                { label: 'View Orders', icon: FiShoppingCart, path: '/admin/orders' },
                                { label: 'Custom Orders', icon: FiUsers, path: '/admin/custom-orders' },
                                { label: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' }
                            ].map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                                >
                                    <action.icon className="text-2xl mb-2 text-gray-600 group-hover:text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                                        {action.label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {[
                                { action: 'New order received', time: '2 min ago', type: 'order' },
                                { action: 'Product stock updated', time: '1 hour ago', type: 'product' },
                                { action: 'Custom cake order completed', time: '3 hours ago', type: 'custom' },
                                { action: 'Revenue target reached', time: '1 day ago', type: 'revenue' }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <div className={`w-2 h-2 rounded-full ${
                                        activity.type === 'order' ? 'bg-blue-500' :
                                        activity.type === 'product' ? 'bg-purple-500' :
                                        activity.type === 'custom' ? 'bg-pink-500' : 'bg-green-500'
                                    }`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
