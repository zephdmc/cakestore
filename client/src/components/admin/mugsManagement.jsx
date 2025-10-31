import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiPackage, 
    FiPlus, 
    FiEdit, 
    FiTrash2, 
    FiDollarSign, 
    FiTag, 
    FiShoppingCart,
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiAlertCircle,
    FiCheckCircle,
    FiLayers,
    FiRuler,
    FiDroplet,
    FiThermometer,
    FiHome,
    FiCoffee
} from 'react-icons/fi';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [customFilter, setCustomFilter] = useState('all');
    const [materialFilter, setMaterialFilter] = useState('all');
    const [deletingProduct, setDeletingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, categoryFilter, stockFilter, customFilter, materialFilter]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts();
            setProducts(Array.isArray(response?.data) ? response.data : []);
        } catch (err) {
            setError(err.message || 'Failed to load mugs');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let result = [...products];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product => 
                product.name?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query) ||
                product.capacity?.toLowerCase().includes(query) ||
                product.materials?.some(material => material.toLowerCase().includes(query))
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            result = result.filter(product => product.category === categoryFilter);
        }

        // Apply stock filter
        if (stockFilter !== 'all') {
            result = result.filter(product => {
                if (stockFilter === 'in-stock') return product.countInStock > 0;
                if (stockFilter === 'out-of-stock') return product.countInStock === 0;
                return true;
            });
        }

        // Apply custom filter
        if (customFilter !== 'all') {
            result = result.filter(product => {
                if (customFilter === 'custom') return product.isCustom;
                if (customFilter === 'regular') return !product.isCustom;
                return true;
            });
        }

        // Apply material filter
        if (materialFilter !== 'all') {
            result = result.filter(product => 
                product.materials?.includes(materialFilter)
            );
        }

        setFilteredProducts(result);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this mug? This action cannot be undone.')) {
            setDeletingProduct(productId);
            try {
                await deleteProduct(productId);
                setProducts(prevProducts =>
                    prevProducts.filter((product) => product.id !== productId)
                );
                setSuccess('Mug deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.message || 'Failed to delete mug');
            } finally {
                setDeletingProduct(null);
            }
        }
    };

    const refreshProducts = () => {
        setLoading(true);
        getProducts()
            .then(response => {
                setProducts(Array.isArray(response?.data) ? response.data : []);
            })
            .catch(err => {
                setError(err.message || 'Failed to refresh mugs');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Get unique categories for filter
    const categories = ['all', ...new Set(products.map(product => product.category).filter(Boolean))];
    
    // Get unique materials for filter
    const allMaterials = products.flatMap(product => product.materials || []);
    const materials = ['all', ...new Set(allMaterials)].filter(Boolean);

    // Get product statistics
    const getProductStats = () => {
        const totalProducts = products.length;
        const inStockProducts = products.filter(p => p.countInStock > 0).length;
        const outOfStockProducts = products.filter(p => p.countInStock === 0).length;
        const customProducts = products.filter(p => p.isCustom).length;
        const categoriesCount = new Set(products.map(p => p.category)).size;
        const materialsCount = new Set(allMaterials).size;

        return { totalProducts, inStockProducts, outOfStockProducts, customProducts, categoriesCount, materialsCount };
    };

    const stats = getProductStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading mugs...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mug Management</h1>
                            <p className="text-gray-600">Manage your mug catalog and inventory</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
                            <button
                                onClick={refreshProducts}
                                className="flex items-center bg-white text-gray-700 py-3 px-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <FiRefreshCw className="mr-2" />
                                Refresh
                            </button>
                            <Link
                                to="/admin/products/new"
                                className="flex items-center bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <FiPlus className="mr-2" />
                                Add New Mug
                            </Link>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                        {[
                            { label: 'Total Mugs', value: stats.totalProducts, color: 'bg-gradient-to-r from-blue-500 to-teal-500', icon: FiPackage },
                            { label: 'In Stock', value: stats.inStockProducts, color: 'bg-gradient-to-r from-green-500 to-green-600', icon: FiShoppingCart },
                            { label: 'Out of Stock', value: stats.outOfStockProducts, color: 'bg-gradient-to-r from-red-500 to-red-600', icon: FiAlertCircle },
                            { label: 'Custom Mugs', value: stats.customProducts, color: 'bg-gradient-to-r from-orange-500 to-orange-600', icon: FiLayers },
                            { label: 'Categories', value: stats.categoriesCount, color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: FiTag },
                            { label: 'Materials', value: stats.materialsCount, color: 'bg-gradient-to-r from-indigo-500 to-indigo-600', icon: FiCoffee }
                        ].map(({ label, value, color, icon: Icon }) => (
                            <motion.div
                                key={label}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl shadow-lg p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{value}</p>
                                        <p className="text-xs text-gray-600 mt-1">{label}</p>
                                    </div>
                                    <div className={`${color} rounded-lg p-2`}>
                                        <Icon className="text-white text-lg" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center">
                                <FiFilter className="text-blue-600 mr-3 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-900">Filter Mugs</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1 lg:ml-8">
                                {/* Search */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search mugs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div className="relative">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.filter(cat => cat !== 'all').map(category => (
                                            <option key={category} value={category}>
                                                {category?.charAt(0)?.toUpperCase() + category?.slice(1) || 'Uncategorized'}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiTag className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Material Filter */}
                                <div className="relative">
                                    <select
                                        value={materialFilter}
                                        onChange={(e) => setMaterialFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Materials</option>
                                        {materials.filter(mat => mat !== 'all').map(material => (
                                            <option key={material} value={material}>
                                                {material}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiCoffee className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Stock Filter */}
                                <div className="relative">
                                    <select
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Stock</option>
                                        <option value="in-stock">In Stock</option>
                                        <option value="out-of-stock">Out of Stock</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiShoppingCart className="text-gray-400" />
                                    </div>
                                </div>

                                {/* Custom Filter */}
                                <div className="relative">
                                    <select
                                        value={customFilter}
                                        onChange={(e) => setCustomFilter(e.target.value)}
                                        className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="custom">Custom Only</option>
                                        <option value="regular">Regular Only</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <FiLayers className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status Messages */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-4 mb-6 shadow-sm"
                        >
                            <div className="flex items-center">
                                <FiCheckCircle className="text-green-500 text-xl mr-3" />
                                <p className="text-green-700 font-medium">{success}</p>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 shadow-sm"
                        >
                            <div className="flex items-center">
                                <FiAlertCircle className="text-red-500 text-xl mr-3" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Products Content */}
                <AnimatePresence mode="wait">
                    {filteredProducts.length > 0 ? (
                        <motion.div
                            key="products-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Desktop Table */}
                            <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-blue-600 to-teal-600">
                                            <tr>
                                                {['Mug', 'Category', 'Capacity', 'Material', 'Price', 'Stock', 'Custom', 'Safety', 'Actions'].map((header) => (
                                                    <th
                                                        key={header}
                                                        className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredProducts.map((product, index) => (
                                                <motion.tr
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={product.images && product.images[0] ? product.images[0] : '/placeholder-mug.png'}
                                                                alt={product.name}
                                                                className="h-12 w-12 object-cover rounded-xl border border-gray-200 mr-4"
                                                                onError={(e) => {
                                                                    e.target.src = '/placeholder-mug.png';
                                                                }}
                                                            />
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {product.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                                    {product.description || 'No description'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FiTag className="text-gray-400 mr-2" />
                                                            <span className="text-sm text-gray-900 capitalize">
                                                                {product.category || 'Uncategorized'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FiDroplet className="text-gray-400 mr-2" />
                                                            <span className="text-sm text-gray-900">
                                                                {product.capacity || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FiCoffee className="text-gray-400 mr-2" />
                                                            <span className="text-sm text-gray-900">
                                                                {product.materials?.[0] || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <FiDollarSign className="text-gray-400 mr-2" />
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                ₦{product.price?.toLocaleString() || '0'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                                            product.countInStock > 0 
                                                                ? 'bg-green-100 text-green-800 border-green-200' 
                                                                : 'bg-red-100 text-red-800 border-red-200'
                                                        }`}>
                                                            <FiShoppingCart className="mr-1" size={12} />
                                                            {product.countInStock || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                                            product.isCustom
                                                                ? 'bg-orange-100 text-orange-800 border-orange-200' 
                                                                : 'bg-gray-100 text-gray-800 border-gray-200'
                                                        }`}>
                                                            <FiLayers className="mr-1" size={12} />
                                                            {product.isCustom ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-1">
                                                            {product.isMicrowaveSafe && (
                                                                <FiThermometer className="text-green-500" size={16} title="Microwave Safe" />
                                                            )}
                                                            {product.isDishwasherSafe && (
                                                                <FiHome className="text-blue-500" size={16} title="Dishwasher Safe" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-3">
                                                            <Link
                                                                to={`/admin/products/${product.id}/edit`}
                                                                className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                                                            >
                                                                <FiEdit className="mr-1" />
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                disabled={deletingProduct === product.id}
                                                                className="flex items-center text-red-600 hover:text-red-700 font-semibold disabled:opacity-50 transition-colors duration-200"
                                                            >
                                                                {deletingProduct === product.id ? (
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                                                ) : (
                                                                    <FiTrash2 className="mr-1" />
                                                                )}
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-4">
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={product.images && product.images[0] ? product.images[0] : '/placeholder-mug.png'}
                                                alt={product.name}
                                                className="h-16 w-16 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-mug.png';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {product.description || 'No description'}
                                                </p>
                                                <div className="grid grid-cols-2 gap-2 mt-3">
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <FiTag className="mr-1" />
                                                        <span className="capitalize">{product.category}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <FiDroplet className="mr-1" />
                                                        <span>{product.capacity || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <FiCoffee className="mr-1" />
                                                        <span>{product.materials?.[0] || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs">
                                                        <span className={`px-2 py-1 rounded-full ${
                                                            product.isCustom ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {product.isCustom ? 'Custom' : 'Regular'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Safety Features */}
                                                <div className="flex items-center space-x-2 mt-2">
                                                    {product.isMicrowaveSafe && (
                                                        <div className="flex items-center text-xs text-green-600">
                                                            <FiThermometer size={12} />
                                                            <span>Microwave</span>
                                                        </div>
                                                    )}
                                                    {product.isDishwasherSafe && (
                                                        <div className="flex items-center text-xs text-blue-600">
                                                            <FiHome size={12} />
                                                            <span>Dishwasher</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                                    product.countInStock > 0 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    Stock: {product.countInStock || 0}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ₦{product.price?.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex space-x-3">
                                                <Link
                                                    to={`/admin/products/${product.id}/edit`}
                                                    className="flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
                                                >
                                                    <FiEdit className="mr-1" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deletingProduct === product.id}
                                                    className="flex items-center text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50 transition-colors duration-200"
                                                >
                                                    {deletingProduct === product.id ? (
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2"></div>
                                                    ) : (
                                                        <FiTrash2 className="mr-1" />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center bg-white rounded-2xl shadow-lg p-12"
                        >
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiCoffee className="text-white text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Mugs Found</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                {products.length === 0 
                                    ? "Get started by adding your first mug to the catalog" 
                                    : "No mugs match your current filters"
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {(searchQuery || categoryFilter !== 'all' || stockFilter !== 'all' || customFilter !== 'all' || materialFilter !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setCategoryFilter('all');
                                            setStockFilter('all');
                                            setCustomFilter('all');
                                            setMaterialFilter('all');
                                        }}
                                        className="bg-white text-gray-700 py-3 px-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 font-semibold"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                                <Link
                                    to="/admin/products/new"
                                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                                >
                                    <FiPlus className="mr-2 inline" />
                                    Add New Mug
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
