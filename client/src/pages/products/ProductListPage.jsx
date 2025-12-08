import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import ProductFilter from '../../components/products/ProductFilter';
import { useProducts } from '../../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiLoader, 
    FiFilter, 
    FiGrid, 
    FiList, 
    FiSearch,
    FiRefreshCw,
    FiX,
    FiShoppingBag,
    FiCoffee,
    FiDroplet,
    FiGrid as FiMug
} from 'react-icons/fi';
import { PRODUCT_TYPES, PRODUCT_TYPE_LABELS } from '../../utils/productTypes';

// Loading Skeleton Component
const ProductSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 animate-pulse">
                <div className="relative pt-[100%] bg-white/20 rounded-xl mb-4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    <div className="h-6 bg-white/20 rounded w-1/3 mt-4"></div>
                </div>
            </div>
        ))}
    </div>
);

// View Toggle Component
const ViewToggle = ({ viewMode, setViewMode }) => (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
        <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all duration-300 ${
                viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
        >
            <FiGrid className="text-lg" />
        </button>
        <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all duration-300 ${
                viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
        >
            <FiList className="text-lg" />
        </button>
    </div>
);

// Product Type Tabs Component
const ProductTypeTabs = ({ activeType, setActiveType }) => {
    const productTypes = [
        { 
            type: 'all', 
            label: 'All Products', 
            icon: FiShoppingBag,
            gradient: 'from-purple-500 to-pink-500'
        },
        { 
            type: PRODUCT_TYPES.CAKE, 
            label: 'Crafted Cakes', 
            icon: FiCoffee,
            gradient: 'from-pink-500 to-rose-500'
        },
        { 
            type: PRODUCT_TYPES.CANDLE, 
            label: 'Scented Candles', 
            icon: FiDroplet,
            gradient: 'from-amber-500 to-orange-500'
        },
        { 
            type: PRODUCT_TYPES.MUG, 
            label: 'Glass Mugs', 
            icon: FiMug,
            gradient: 'from-blue-500 to-cyan-500'
        }
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {productTypes.map(({ type, label, icon: Icon, gradient }) => (
                <motion.button
                    key={type}
                    onClick={() => setActiveType(type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                        activeType === type
                            ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                            : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm border border-white/20'
                    }`}
                >
                    <Icon className="text-sm" />
                    {label}
                </motion.button>
            ))}
        </div>
    );
};

export default function ProductListPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { 
        products, 
        loading, 
        error, 
        fetchProducts,
        refreshProducts,
        getProductsByProductType,
        stats 
    } = useProducts();
    
    const [localLoading, setLocalLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [activeProductType, setActiveProductType] = useState('all');
    
    // Get product type from URL query params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const typeParam = params.get('type');
        if (typeParam && Object.values(PRODUCT_TYPES).includes(typeParam)) {
            setActiveProductType(typeParam);
        }
    }, [location.search]);

    // Update URL when product type changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (activeProductType === 'all') {
            params.delete('type');
        } else {
            params.set('type', activeProductType);
        }
        navigate({ search: params.toString() }, { replace: true });
    }, [activeProductType, navigate, location.search]);

    // Filter products based on search query and product type
    const filteredProducts = products.filter(product => {
        const matchesSearch = searchQuery === '' || 
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = activeProductType === 'all' || product.productType === activeProductType;
        
        return matchesSearch && matchesType;
    });

    const handleFilter = async (filters) => {
        try {
            setLocalLoading(true);
            await fetchProducts(filters);
        } catch (err) {
            console.error('Filter error:', err);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleClearFilters = () => {
        refreshProducts();
        setSearchQuery('');
        setActiveProductType('all');
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    // Get page title based on product type
    const getPageTitle = () => {
        switch(activeProductType) {
            case PRODUCT_TYPES.CAKE:
                return 'Crafted Themed Cakes';
            case PRODUCT_TYPES.CANDLE:
                return 'Luxury Scented Candles';
            case PRODUCT_TYPES.MUG:
                return 'Personalized Glass Mugs';
            default:
                return 'Our Products Collection';
        }
    };

    // Get page description based on product type
    const getPageDescription = () => {
        switch(activeProductType) {
            case PRODUCT_TYPES.CAKE:
                return 'Discover our handcrafted collection of beautiful and delicious themed cakes';
            case PRODUCT_TYPES.CANDLE:
                return 'Experience luxury and relaxation with our premium scented candles';
            case PRODUCT_TYPES.MUG:
                return 'Personalized glass mugs perfect for every occasion and memory';
            default:
                return 'Browse our complete collection of cakes, candles, and mugs';
        }
    };

    // Get stats for current product type
    const getCurrentTypeStats = () => {
        switch(activeProductType) {
            case PRODUCT_TYPES.CAKE:
                return stats?.cakes || getProductsByProductType(PRODUCT_TYPES.CAKE).length;
            case PRODUCT_TYPES.CANDLE:
                return stats?.candles || getProductsByProductType(PRODUCT_TYPES.CANDLE).length;
            case PRODUCT_TYPES.MUG:
                return stats?.mugs || getProductsByProductType(PRODUCT_TYPES.MUG).length;
            default:
                return stats?.total || products.length;
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <FiLoader className="text-4xl text-purple-300" />
                    </motion.div>
                    <p className="text-white/80 text-lg">Loading products...</p>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center max-w-2xl mx-auto"
                >
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FiX className="text-2xl text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Error Loading Products</h3>
                    <p className="text-white/80 mb-6">{error}</p>
                    <motion.button
                        onClick={refreshProducts}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                    >
                        <FiRefreshCw className="text-sm" />
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                            {getPageTitle()}
                        </h1>
                        <p className="text-white/70">
                            {getPageDescription()}
                        </p>
                    </div>
                    
                    {filteredProducts.length > 0 && (
                        <div className="flex items-center gap-4">
                            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20"
                            >
                                <span className="text-white font-semibold">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                                </span>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* Product Type Tabs */}
                <ProductTypeTabs 
                    activeType={activeProductType} 
                    setActiveType={setActiveProductType} 
                />

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { 
                            label: 'Total Products', 
                            value: stats?.total || products.length, 
                            gradient: 'from-purple-500 to-pink-500',
                            icon: FiShoppingBag 
                        },
                        { 
                            label: 'Crafted Cakes', 
                            value: stats?.cakes || getProductsByProductType(PRODUCT_TYPES.CAKE).length, 
                            gradient: 'from-pink-500 to-rose-500',
                            icon: FiCoffee
                        },
                        { 
                            label: 'Scented Candles', 
                            value: stats?.candles || getProductsByProductType(PRODUCT_TYPES.CANDLE).length, 
                            gradient: 'from-amber-500 to-orange-500',
                            icon: FiDroplet
                        },
                        { 
                            label: 'Glass Mugs', 
                            value: stats?.mugs || getProductsByProductType(PRODUCT_TYPES.MUG).length, 
                            gradient: 'from-blue-500 to-cyan-500',
                            icon: FiMug
                        }
                    ].map(({ label, value, gradient, icon: Icon }) => (
                        <div 
                            key={label}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xl font-bold text-white">{value}</p>
                                    <p className="text-xs text-white/70 mt-1">{label}</p>
                                </div>
                                <div className={`bg-gradient-to-r ${gradient} rounded-lg p-2`}>
                                    <Icon className="text-white text-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col lg:flex-row gap-4 mb-8"
                >
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-lg" />
                        <input
                            type="text"
                            placeholder={`Search ${PRODUCT_TYPE_LABELS[activeProductType] || 'products'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                            >
                                <FiX className="text-lg" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <motion.button
                        onClick={() => setShowFilters(!showFilters)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20"
                    >
                        <FiFilter className="text-sm" />
                        Filters
                        {showFilters ? (
                            <FiX className="text-sm transition-transform" />
                        ) : (
                            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                        )}
                    </motion.button>
                </motion.div>

                {/* Filter Section */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-8"
                        >
                            <ProductFilter 
                                key={activeProductType}
                                initialProductType={activeProductType === 'all' ? '' : activeProductType}
                                onFilter={handleFilter} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filter Loading Indicator */}
                <AnimatePresence>
                    {localLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <FiLoader className="text-purple-300 text-lg" />
                            </motion.div>
                            <span className="text-white font-medium">Applying filters...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Summary */}
                {filteredProducts.length > 0 && !localLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <div>
                            <p className="text-white/70">
                                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} 
                                {activeProductType !== 'all' && ` in ${PRODUCT_TYPE_LABELS[activeProductType]}`}
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                            {getCurrentTypeStats() > filteredProducts.length && (
                                <p className="text-white/50 text-sm mt-1">
                                    {getCurrentTypeStats() - filteredProducts.length} more available with different filters
                                </p>
                            )}
                        </div>
                        {(searchQuery || activeProductType !== 'all' || products.length !== filteredProducts.length) && (
                            <button
                                onClick={handleClearFilters}
                                className="text-purple-300 hover:text-purple-200 text-sm font-medium flex items-center gap-1"
                            >
                                <FiRefreshCw className="text-xs" />
                                Clear all
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Products Grid/List */}
                <AnimatePresence mode="wait">
                    {filteredProducts.length > 0 ? (
                        <motion.div
                            key={viewMode + activeProductType + filteredProducts.length}
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className={
                                viewMode === 'grid' 
                                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                    : "grid grid-cols-1 gap-6"
                            }
                        >
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    variants={itemVariants}
                                    layout
                                    whileHover={{ 
                                        y: -8,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <ProductCard 
                                        product={product} 
                                        viewMode={viewMode}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-2xl mx-auto">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <FiShoppingBag className="text-3xl text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    {searchQuery ? 'No products found' : `No ${PRODUCT_TYPE_LABELS[activeProductType] || 'products'} available`}
                                </h3>
                                <p className="text-white/70 mb-8 max-w-md mx-auto">
                                    {searchQuery 
                                        ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search or filters.`
                                        : `No ${PRODUCT_TYPE_LABELS[activeProductType] || 'products'} match your current filter criteria. Try clearing filters to see all available products.`
                                    }
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.button
                                        onClick={handleClearFilters}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                                    >
                                        <FiRefreshCw className="text-sm" />
                                        Clear Filters
                                    </motion.button>
                                    {searchQuery && (
                                        <motion.button
                                            onClick={() => setSearchQuery('')}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20"
                                        >
                                            <FiSearch className="text-sm" />
                                            Clear Search
                                        </motion.button>
                                    )}
                                    {activeProductType !== 'all' && (
                                        <motion.button
                                            onClick={() => setActiveProductType('all')}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20"
                                        >
                                            View All Products
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading Skeleton for Filtering */}
                {localLoading && <ProductSkeleton />}

                {/* Type Summary Footer */}
                {filteredProducts.length > 0 && !localLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                            <div>
                                <p className="text-white/70">
                                    Viewing <span className="font-semibold text-white">{filteredProducts.length}</span> of{' '}
                                    <span className="font-semibold text-white">{getCurrentTypeStats()}</span> {' '}
                                    {activeProductType === 'all' ? 'products' : PRODUCT_TYPE_LABELS[activeProductType]}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-2"></div>
                                        <span className="text-sm text-white/70">Total Products</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mr-2"></div>
                                        <span className="text-sm text-white/70">Cakes</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mr-2"></div>
                                        <span className="text-sm text-white/70">Candles</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-2"></div>
                                        <span className="text-sm text-white/70">Mugs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <p className="text-sm text-white/70">
                                    Last updated: {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
