import { useState, useEffect } from 'react';
import MugsCard from '../../components/products/MugsCard';
import MugsFilter from '../../components/products/mugsFilter';
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
    FiCoffee
} from 'react-icons/fi';

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
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
        >
            <FiGrid className="text-lg" />
        </button>
        <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all duration-300 ${
                viewMode === 'list' 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
        >
            <FiList className="text-lg" />
        </button>
    </div>
);

export default function ProductListPage() {
    const { 
        products, 
        categories, 
        materials, 
        features, 
        designTags, 
        loading, 
        error, 
        fetchProducts,
        refreshProducts 
    } = useProducts();
    
    const [localLoading, setLocalLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.materials?.some(material => 
            material.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

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

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <FiLoader className="text-4xl text-blue-300" />
                    </motion.div>
                    <p className="text-white/80 text-lg">Loading our mug collection...</p>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 py-8">
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
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                    >
                        <FiRefreshCw className="text-sm" />
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                            Our Mug Collection
                        </h1>
                        <p className="text-white/70">
                            Discover handcrafted mugs for every occasion and style
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
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'mug' : 'mugs'}
                                </span>
                            </motion.div>
                        </div>
                    )}
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
                            placeholder="Search mugs by name, material, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></span>
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
                            <MugsFilter 
                                categories={categories} 
                                materials={materials}
                                features={features}
                                designTags={designTags}
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
                                <FiLoader className="text-blue-300 text-lg" />
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
                        <p className="text-white/70">
                            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'mug' : 'mugs'}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                        {(searchQuery || products.length !== filteredProducts.length) && (
                            <button
                                onClick={handleClearFilters}
                                className="text-blue-300 hover:text-blue-200 text-sm font-medium flex items-center gap-1"
                            >
                                <FiRefreshCw className="text-xs" />
                                Clear all
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Products Grid/List */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode + filteredProducts.length}
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
                                <MugsCard 
                                    product={product} 
                                    viewMode={viewMode}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {filteredProducts.length === 0 && !localLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <FiCoffee className="text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {searchQuery ? 'No mugs found' : 'No mugs available'}
                            </h3>
                            <p className="text-white/70 mb-8 max-w-md mx-auto">
                                {searchQuery 
                                    ? `We couldn't find any mugs matching "${searchQuery}". Try adjusting your search or filters.`
                                    : 'No mugs match your current filter criteria. Try clearing filters to see all available mugs.'
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    onClick={handleClearFilters}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
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
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Loading Skeleton for Filtering */}
                {localLoading && <ProductSkeleton />}
            </div>
        </div>
    );
}
