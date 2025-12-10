import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getProducts, 
  deleteProduct, 
  getProductStats,
  getFilterOptions 
} from '../../services/productServic'; // Fixed typo in import path
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
  FiCoffee,
  FiDroplet,
  FiGrid,
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { PRODUCT_TYPES, PRODUCT_TYPE_LABELS } from '../../utils/productTypes';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [stats, setStats] = useState({
    cakes: 0,
    candles: 0,
    mugs: 0,
    total: 0,
    inStock: 0,
    outOfStock: 0
  });
  const [filterOptions, setFilterOptions] = useState({});
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  // Product type icons
  const productTypeIcons = {
    [PRODUCT_TYPES.CAKE]: FiCoffee,
    [PRODUCT_TYPES.CANDLE]: FiDroplet,
    [PRODUCT_TYPES.MUG]: FiGrid
  };

  // Product type colors
  const productTypeColors = {
    [PRODUCT_TYPES.CAKE]: 'from-pink-500 to-rose-500',
    [PRODUCT_TYPES.CANDLE]: 'from-amber-500 to-orange-500',
    [PRODUCT_TYPES.MUG]: 'from-blue-500 to-cyan-500'
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter, stockFilter, productTypeFilter, sortBy]);

  useEffect(() => {
    if (productTypeFilter !== 'all') {
      fetchFilterOptions(productTypeFilter);
    }
  }, [productTypeFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProducts();
      
      // Handle both response formats
      let productsData = [];
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response && response.products) {
        productsData = response.products;
      }
      
      setProducts(productsData);
      filterProducts(); // Call filter after setting products
    } catch (err) {
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getProductStats();
      
      // Handle different response formats
      if (response && response.success && response.data) {
        setStats(response.data);
      } else if (response && typeof response === 'object') {
        // If response is already the stats object
        setStats(response);
      } else {
        // Calculate stats from products
        calculateStatsFromProducts();
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
      // Calculate stats from products as fallback
      calculateStatsFromProducts();
    }
  };

  const calculateStatsFromProducts = () => {
    const total = products.length;
    const cakes = products.filter(p => p.productType === PRODUCT_TYPES.CAKE).length;
    const candles = products.filter(p => p.productType === PRODUCT_TYPES.CANDLE).length;
    const mugs = products.filter(p => p.productType === PRODUCT_TYPES.MUG).length;
    const inStock = products.filter(p => (p.countInStock || 0) > 0).length;
    const outOfStock = products.filter(p => (p.countInStock || 0) === 0).length;
    
    setStats({
      cakes,
      candles,
      mugs,
      total,
      inStock,
      outOfStock
    });
  };

  const fetchFilterOptions = async (productType) => {
    try {
      const response = await getFilterOptions(productType);
      if (response && response.success) {
        setFilterOptions(response.data);
      } else if (response && response.categories) {
        setFilterOptions(response);
      }
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const filterProducts = () => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        (product.name || '').toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query) ||
        (product.category || '').toLowerCase().includes(query)
      );
    }

    // Apply product type filter
    if (productTypeFilter !== 'all') {
      result = result.filter(product => product.productType === productTypeFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }

    // Apply stock filter
    if (stockFilter !== 'all') {
      result = result.filter(product => {
        const stock = product.countInStock || 0;
        if (stockFilter === 'in-stock') return stock > 0;
        if (stockFilter === 'out-of-stock') return stock === 0;
        return true;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'stock-asc':
          return (a.countInStock || 0) - (b.countInStock || 0);
        case 'stock-desc':
          return (b.countInStock || 0) - (a.countInStock || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setDeletingProduct(productId);
      try {
        await deleteProduct(productId);
        setProducts(prevProducts =>
          prevProducts.filter((product) => product.id !== productId)
        );
        setSuccess('Product deleted successfully');
        setError(''); // Clear any existing errors
        setTimeout(() => setSuccess(''), 3000);
        fetchStats(); // Refresh stats
      } catch (err) {
        setError(err.message || 'Failed to delete product');
      } finally {
        setDeletingProduct(null);
      }
    }
  };

  const refreshProducts = () => {
    setLoading(true);
    setError('');
    getProducts()
      .then(response => {
        let productsData = [];
        if (Array.isArray(response)) {
          productsData = response;
        } else if (response && Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response && response.products) {
          productsData = response.products;
        }
        
        setProducts(productsData);
        fetchStats();
      })
      .catch(err => {
        setError(err.message || 'Failed to refresh products');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getProductTypeIcon = (productType) => {
    const Icon = productTypeIcons[productType] || FiPackage;
    return <Icon className="text-lg" />;
  };

  const getProductTypeColor = (productType) => {
    return productTypeColors[productType] || 'from-gray-500 to-gray-600';
  };

  const getProductDetails = (product) => {
    switch (product.productType) {
      case PRODUCT_TYPES.CAKE:
        return {
          details: [
            { label: 'Size', value: product.size || 'N/A', icon: FiRuler },
            { label: 'Ingredients', value: product.ingredients?.length || 0, icon: FiLayers },
            { label: 'Dietary', value: product.dietaryTags?.join(', ') || 'None' },
            { label: 'Flavors', value: product.flavorTags?.join(', ') || 'None' },
            { label: 'Custom', value: product.isCustom ? 'Yes' : 'No' }
          ]
        };
      case PRODUCT_TYPES.CANDLE:
        return {
          details: [
            { label: 'Scent', value: product.scent || 'N/A' },
            { label: 'Burn Time', value: product.burnTime || 'N/A' },
            { label: 'Wax Type', value: product.waxType || 'N/A' },
            { label: 'Dimensions', value: product.dimensions || 'N/A' }
          ]
        };
      case PRODUCT_TYPES.MUG:
        return {
          details: [
            { label: 'Capacity', value: product.capacity || 'N/A' },
            { label: 'Material', value: product.material || 'N/A' },
            { label: 'Design Type', value: product.designType || 'N/A' },
            { label: 'Dishwasher Safe', value: product.isDishwasherSafe ? 'Yes' : 'No' }
          ]
        };
      default:
        return { details: [] };
    }
  };

  // Get unique categories for filter
  const getCategories = () => {
    const filtered = productTypeFilter === 'all' 
      ? products 
      : products.filter(p => p.productType === productTypeFilter);
    
    const categories = ['all'];
    filtered.forEach(product => {
      if (product.category && !categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
    
    return categories;
  };

  // Handle product image error
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150';
    e.target.onerror = null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product o Management</h1>
              <p className="text-gray-600">Manage your product catalog across all categoriess</p>
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
                className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
              >
                <FiPlus className="mr-2" />
                Add New Product
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {[
              { 
                label: 'Total Products', 
                value: stats.total || products.length, 
                color: 'bg-gradient-to-r from-purple-500 to-pink-500',
                icon: FiPackage 
              },
              { 
                label: 'Cakes', 
                value: stats.cakes || products.filter(p => p.productType === PRODUCT_TYPES.CAKE).length, 
                color: 'bg-gradient-to-r from-pink-500 to-rose-500',
                icon: productTypeIcons[PRODUCT_TYPES.CAKE]
              },
              { 
                label: 'Candles', 
                value: stats.candles || products.filter(p => p.productType === PRODUCT_TYPES.CANDLE).length, 
                color: 'bg-gradient-to-r from-amber-500 to-orange-500',
                icon: productTypeIcons[PRODUCT_TYPES.CANDLE]
              },
              { 
                label: 'Mugs', 
                value: stats.mugs || products.filter(p => p.productType === PRODUCT_TYPES.MUG).length, 
                color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                icon: productTypeIcons[PRODUCT_TYPES.MUG]
              },
              { 
                label: 'In Stock', 
                value: stats.inStock || products.filter(p => (p.countInStock || 0) > 0).length, 
                color: 'bg-gradient-to-r from-green-500 to-green-600',
                icon: FiShoppingCart 
              },
              { 
                label: 'Out of Stock', 
                value: stats.outOfStock || products.filter(p => (p.countInStock || 0) === 0).length, 
                color: 'bg-gradient-to-r from-red-500 to-red-600',
                icon: FiAlertCircle 
              }
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
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center">
                <FiFilter className="text-purple-600 mr-3 text-xl" />
                <h3 className="text-lg font-semibold text-gray-900">Filter & Sort Products</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1 lg:ml-8">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  />
                </div>

                {/* Product Type Filter */}
                <div className="relative">
                  <select
                    value={productTypeFilter}
                    onChange={(e) => setProductTypeFilter(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="all">All Product Types</option>
                    <option value={PRODUCT_TYPES.CAKE}>Crafted Themed Cakes</option>
                    <option value={PRODUCT_TYPES.CANDLE}>Luxury Scented Candles</option>
                    <option value={PRODUCT_TYPES.MUG}>Personalized Glass Mugs</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiGrid className="text-gray-400" />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="all">All Categories</option>
                    {getCategories()
                      .filter(cat => cat !== 'all')
                      .map(category => (
                        <option key={category} value={category}>
                          {category?.charAt(0)?.toUpperCase() + category?.slice(1) || 'Uncategorized'}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiTag className="text-gray-400" />
                  </div>
                </div>

                {/* Stock Filter */}
                <div className="relative">
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="all">All Stock</option>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiShoppingCart className="text-gray-400" />
                  </div>
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="stock-asc">Stock (Low to High)</option>
                    <option value="stock-desc">Stock (High to Low)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiTrendingUp className="text-gray-400" />
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
              <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <tr>
                        {['Product', 'Type', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((header) => (
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
                        <>
                          <motion.tr
                            key={product.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                            onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/150'}
                                  alt={product.name}
                                  className="h-12 w-12 object-cover rounded-xl border border-gray-200 mr-4"
                                  onError={handleImageError}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {product.name || 'Unnamed Product'}
                                  </p>
                                  <p className="text-xs text-gray-500 line-clamp-1">
                                    {product.description || 'No description'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`${getProductTypeColor(product.productType)} rounded-lg p-2 mr-3`}>
                                  {getProductTypeIcon(product.productType)}
                                </div>
                                <span className="text-sm text-gray-900 capitalize">
                                  {PRODUCT_TYPE_LABELS[product.productType] || product.productType || 'Unknown'}
                                </span>
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
                                <FiDollarSign className="text-gray-400 mr-2" />
                                <span className="text-sm font-semibold text-gray-900">
                                  ₦{product.price?.toLocaleString() || '0'}
                                  {product.discountPercentage > 0 && (
                                    <span className="ml-2 text-xs text-green-600">
                                      ({product.discountPercentage}% off)
                                    </span>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                (product.countInStock || 0) > 0 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}>
                                <FiShoppingCart className="mr-1" size={12} />
                                {product.countInStock || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                (product.countInStock || 0) > 0
                                  ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                  : 'bg-gray-100 text-gray-800 border-gray-200'
                              }`}>
                                {(product.countInStock || 0) > 0 ? 'Active' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-3">
                                <Link
                                  to={`/admin/products/${product.id}/edit`}
                                  className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FiEdit className="mr-1" />
                                  Edit
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(product.id);
                                  }}
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
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedProduct(expandedProduct === product.id ? null : product.id);
                                  }}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  {expandedProduct === product.id ? (
                                    <FiChevronUp className="text-lg" />
                                  ) : (
                                    <FiChevronDown className="text-lg" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                          
                          {/* Expanded Details Row */}
                          {expandedProduct === product.id && (
                            <tr className="bg-gray-50">
                              <td colSpan="7" className="px-6 py-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                  {getProductDetails(product).details.map((detail, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                                      <p className="text-xs text-gray-500 font-medium mb-1">{detail.label}</p>
                                      <p className="text-sm font-semibold text-gray-900">
                                        {detail.value}
                                      </p>
                                    </div>
                                  ))}
                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Created</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/150'}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                          onError={handleImageError}
                        />
                        <div className={`absolute -top-2 -right-2 ${getProductTypeColor(product.productType)} rounded-full p-1`}>
                          {getProductTypeIcon(product.productType)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {product.name || 'Unnamed Product'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 capitalize">
                              {PRODUCT_TYPE_LABELS[product.productType] || product.productType || 'Unknown'}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            (product.countInStock || 0) > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.countInStock || 0} in stock
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {product.description || 'No description'}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="flex items-center text-xs text-gray-600">
                            <FiTag className="mr-1" />
                            <span className="capitalize">{product.category || 'Uncategorized'}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <FiDollarSign className="mr-1" />
                            <span className="font-semibold">₦{product.price?.toLocaleString() || '0'}</span>
                          </div>
                          {(product.discountPercentage || 0) > 0 && (
                            <div className="col-span-2">
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                {product.discountPercentage}% discount
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Expanded Details */}
                        {expandedProduct === product.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-200"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {getProductDetails(product).details.map((detail, idx) => (
                                <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                                  <p className="text-xs text-gray-500 font-medium">{detail.label}</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {detail.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                      >
                        {expandedProduct === product.id ? 'Show Less' : 'Show Details'}
                      </button>
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
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {products.length === 0 
                  ? "Get started by adding your first product to the catalog" 
                  : "No products match your current filters"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchQuery || categoryFilter !== 'all' || stockFilter !== 'all' || productTypeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setStockFilter('all');
                      setProductTypeFilter('all');
                    }}
                    className="bg-white text-gray-700 py-3 px-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 font-semibold"
                  >
                    Clear Filters
                  </button>
                )}
                <Link
                  to="/admin/products/new"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  <FiPlus className="mr-2 inline" />
                  Add New Product
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Footer */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{' '}
                  <span className="font-semibold text-gray-900">{products.length}</span> products
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
                  <span className="text-sm text-gray-600">Cakes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <span className="text-sm text-gray-600">Candles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <span className="text-sm text-gray-600">Mugs</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
