import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllOrders } from '../../services/orderService';
import { getProducts } from '../../services/productServic';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';

const Dashboard = () => {
    const { currentUser, isAdmin } = useAuth();
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        revenue: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    getProducts().catch(err => {
                        console.error('Products fetch error:', err);
                        return { data: [] }; // Fallback empty array
                    }),
                    getAllOrders().catch(err => {
                        console.error('Orders fetch error:', err);
                        return { data: [] }; // Fallback empty array
                    })
                ]);

                const revenue = ordersRes.data?.reduce(
                    (acc, order) => acc + (order.totalPrice || 0),
                    0
                ) || 0;

                setStats({
                    products: productsRes.data?.length || 0,
                    orders: ordersRes.data?.length || 0,
                    revenue,
                    users: 0 // Would need a users API endpoint
                });
            } catch (error) {
                console.error('Dashboard error:', error);
                setError('Failed to load dashboard data. Showing cached statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (!isAdmin) return null;

    return (
        <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            {/* Error Message */}
            {
                error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-red-500">⚠️</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Loading State */}
            {
                loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-28 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatsCard
                            title="Total Products"
                            value={stats.products}
                            icon="📦"
                            trend={{ value: 12, label: "vs last month" }}
                            isError={error && stats.products === 0}
                        />
                        <StatsCard
                            title="Total Orders"
                            value={stats.orders}
                            icon="🛒"
                            trend={{ value: 8, label: "vs last month" }}
                            isError={error && stats.orders === 0}
                        />
                        <StatsCard
                            title="Total Revenue"
                            value={`₦${stats.revenue.toLocaleString()}`}
                            icon="💰"
                            trend={{ value: 15, label: "vs last month" }}
                            isError={error && stats.revenue === 0}
                        />
                        <StatsCard
                            title="Total Users"
                            value={stats.users}
                            icon="👥"
                            trend={{ value: 5, label: "vs last month" }}
                            isError={error && stats.users === 0}
                        />
                    </div>
                )
            }
        </>
    );
};

export default Dashboard;