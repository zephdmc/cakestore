import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productServic';
import Loader from '../../components/common/Loader';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(Array.isArray(response?.data) ? response.data : []);
            } catch (err) {
                setError(err.message || 'Failed to load products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await deleteProduct(productId);
                setProducts(prevProducts =>
                    prevProducts.filter(product => product.id !== productId)
                );
                setSuccess('Product deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.message || 'Failed to delete product');
            }
        }
    };

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Manage Products</h2>
                <Link
                    to="/admin/products/new"
                    className="bg-primary text-gray-600 py-2 px-4 rounded hover:bg-primary-dark transition flex items-center gap-2 text-sm sm:text-base"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Product
                </Link>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-green-700 text-sm sm:text-base">{success}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-red-700 text-sm sm:text-base">{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {products.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={product.image || '/placeholder-product.png'}
                                                    alt={product.name}
                                                    className="h-10 w-10 object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-product.png';
                                                    }}
                                                />
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[120px] sm:max-w-none truncate">
                                                {product.name || 'Untitled Product'}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₦{product.price?.toLocaleString() || '0'}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize hidden sm:table-cell">
                                                {product.category || 'Uncategorized'}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                                <span className={`px-2 py-1 rounded-full text-xs ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.countInStock || '0'} in stock
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-1 sm:space-x-2">
                                                <Link
                                                    to={`/admin/products/${product.id}/edit`}
                                                    className="text-primary hover:text-primary-dark inline-flex items-center text-xs sm:text-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">Edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-500 hover:text-red-700 inline-flex items-center text-xs sm:text-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 sm:py-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">No products found</h3>
                            <p className="mt-1 text-xs sm:text-sm text-gray-500">Get started by creating a new product</p>
                            <div className="mt-4 sm:mt-6">
                                <Link
                                    to="/admin/products/new"
                                    className="bg-primary text-gray-600 py-2 px-4 rounded hover:bg-primary-dark transition inline-flex items-center text-sm sm:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add New Product
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
