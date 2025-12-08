import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, getProductStats, getProductsByType } from '../../services/productServic';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiPackage, 
  FiDollarSign, 
  FiTag, 
  FiShoppingCart,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiCoffee,
  FiDroplet,
  FiGrid,
  FiTrendingUp,
  FiLayers,
  FiRuler,
  FiShield,
  FiClock
} from 'react-icons/fi';

import { 
  PRODUCT_TYPES, 
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_COLORS 
} from '../../utils/productTypes';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    cakes: 0,
    candles: 0,
    mugs: 0,
    inStock: 0,
    outOfStock: 0,
    categories: 0
  });

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(Array.isArray(response?.data) ? response.data : []);
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
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setDeletingProduct(productId);
      try {
        await deleteProduct(productId);
        setProducts(prevProducts =>
          prevProducts.filter(product => product.id !== productId)
        );
        setSuccess('Product deleted successfully');
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
    getProducts()
      .then(response => {
        setProducts(Array.isArray(response?.data) ? response.data : []);
        fetchStats();
      })
      .catch(err => {
        setError(err.message || 'Failed to refresh products');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Get unique categories for filter
  const getCategories = () => {
    const filtered = productTypeFilter === 'all' 
      ? products 
      : products.filter(p => p.productType === productTypeFilter);
    
    return ['all', ...new Set(filtered.map(product => product.category).filter(Boolean))];
  };

  // Get product type icon
  const getProductTypeIcon = (type) => {
    switch (type) {
      case PRODUCT_TYPES.CAKE: return FiCoffee;
      case PRODUCT_TYPES.CANDLE: return FiDroplet;
      case PRODUCT_TYPES.MUG: return FiGrid;
      default: return FiPackage;
    }
  };

  // Get product type color
  const getProductTypeColor = (type) => {
    return PRODUCT_TYPE_COLORS[type] || PRODUCT_TYPE_COLORS[PRODUCT_TYPES.CAKE];
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'in-stock' && product.countInStock > 0) ||
      (stockFilter === 'out-of-stock' && product.countInStock === 0);

    const matchesProductType = productTypeFilter === 'all' || product.productType === productTypeFilter;

    return matchesSearch && matchesCategory && matchesStock && matchesProductType;
  });

  // Get type-specific detail for display
  const getProductDetail = (product) => {
    switch (product.productType) {
      case PRODUCT_TYPES.CAKE:
        return {
          icon: FiRuler,
          label: 'Size',
          value: product.size || 'N/A',
          color: 'text-pink-600'
        };
      case PRODUCT_TYPES.CANDLE:
        return {
          icon: FiClock,
          label: 'Burn Time',
          value: product.burnTime || 'N/A',
          color: 'text-amber-600'
        };
      case PRODUCT_TYPES.MUG:
        return {
          icon: FiLayers,
          label: 'Material',
          value: product.material || 'N/A',
          color: 'text-blue-600'
        };
      default:
        return {
          icon: FiPackage,
          label: 'Type',
          value: PRODUCT_TYPE_LABELS[product.productType] || 'Product',
          color: 'text-gray-600'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader />
              <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">Manage your product catalog and inventory across all product types</p>
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
                icon: FiCoffee
              },
              { 
                label: 'Candles', 
                value: stats.candles || products.filter(p => p.productType === PRODUCT_TYPES.CANDLE).length, 
                color: 'bg-gradient-to-r from-amber-500 to-orange-500',
                icon: FiDroplet
              },
              { 
                label: 'Mugs', 
                value: stats.mugs || products.filter(p => p.productType === PRODUCT_TYPES.MUG).length, 
                color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                icon: FiGrid
              },
              { 
                label: 'In Stock', 
                value: stats.inStock || products.filter(p => p.countInStock > 0).length, 
                color: 'bg-gradient-to-r from-green-500 to-green-600',
                icon: FiShoppingCart 
              },
              { 
                label: 'Out of Stock', 
                value: stats.outOfStock || products.filter(p => p.countInStock === 0).length, 
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
                <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:ml-8">
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
                    <FiTrendingUp className="text-gray-400" />
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
                    <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <tr>
                        {['Product', 'Type', 'Details', 'Price', 'Stock', 'Actions'].map((header) => (
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
                      {filteredProducts.map((product, index) => {
                        const typeColor = getProductTypeColor(product.productType);
                        const TypeIcon = getProductTypeIcon(product.productType);
                        const productDetail = getProductDetail(product);
                        const DetailIcon = productDetail.icon;

                        return (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={product.images && product.images[0] ? product.images[0] : '/placeholder-product.png'}
                                  alt={product.name}
                                  className="h-12 w-12 object-cover rounded-xl border border-gray-200 mr-4"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-product.png';
                                  }}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {product.name || 'Untitled Product'}
                                  </p>
                                  <p className="text-xs text-gray-500 line-clamp-1">
                                    {product.category || 'Uncategorized'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className={`${typeColor.bg} rounded-lg p-2 mr-3`}>
                                  <TypeIcon className="text-white text-sm" />
                                </div>
                                <span className="text-sm text-gray-900">
                                  {PRODUCT_TYPE_LABELS[product.productType] || product.productType}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <DetailIcon className={`mr-2 ${productDetail.color}`} />
                                <div>
                                  <p className="text-xs text-gray-500">{productDetail.label}</p>
                                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                    {productDetail.value}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <FiDollarSign className="text-gray-400 mr-2" />
                                <span className="text-sm font-semibold text-gray-900">
                                  ₦{product.price?.toLocaleString() || '0'}
                                  {product.discountPercentage > 0 && (
                                    <span className="ml-1 text-xs text-green-600">
                                      ({product.discountPercentage}% off)
                                    </span>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                  product.countInStock > 0 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                  <FiShoppingCart className="mr-1" size={12} />
                                  {product.countInStock || 0} in stock
                                </span>
                                {product.isCustom && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                    Custom Order
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredProducts.map((product, index) => {
                  const typeColor = getProductTypeColor(product.productType);
                  const TypeIcon = getProductTypeIcon(product.productType);
                  const productDetail = getProductDetail(product);
                  const DetailIcon = productDetail.icon;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={product.images && product.images[0] ? product.images[0] : '/placeholder-product.png'}
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                          <div className={`absolute -top-2 -right-2 ${typeColor.bg} rounded-full p-1`}>
                            <TypeIcon className="text-white text-xs" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate">
                                {product.name || 'Untitled Product'}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {PRODUCT_TYPE_LABELS[product.productType] || product.productType}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              product.countInStock > 0 
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
                              <span className="capitalize truncate">{product.category || 'Uncategorized'}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <FiDollarSign className="mr-1" />
                              <span className="font-semibold">₦{product.price?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <DetailIcon className={`mr-1 ${productDetail.color}`} />
                              <span>{productDetail.value}</span>
                            </div>
                            {product.discountPercentage > 0 && (
                              <div className="col-span-2">
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                  {product.discountPercentage}% discount
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          {product.isCustom && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              Custom Order
                            </span>
                          )}
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
                  );
                })}
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
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Total Products</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Cakes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Candles</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Mugs</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-gray-600">
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
