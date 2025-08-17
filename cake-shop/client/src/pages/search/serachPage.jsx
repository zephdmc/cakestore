import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import { searchProducts } from '../../services/searchService';

export default function SearchResultsPage() {
    const [results, setResults] = useState({
        products: [],
        loading: true,
        error: null,
        count: 0
    });

    const location = useLocation();
    const navigate = useNavigate();

    // Get search query from URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                navigate('/products');
                return;
            }

            try {
                setResults(prev => ({ ...prev, loading: true, error: null }));

                const response = await searchProducts(query);
                console.log('Search response:', response);

                setResults({
                    products: response.data || response, // Handle both formats
                    loading: false,
                    error: null,
                    count: response.count || response.length || 0
                });
            } catch (err) {
                console.error('Search error:', err);
                setResults({
                    products: [],
                    loading: false,
                    error: err.message,
                    count: 0
                });
            }
        };

        fetchSearchResults();
    }, [query, navigate]);

    if (results.loading) return <div className="container mx-auto px-4 py-8">Searching products...</div>;
    if (results.error) return <div className="container mx-auto px-4 py-8 text-red-500">{results.error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-2">
                Search Results for "{query}"
            </h1>
            <p className="text-gray-600 mb-6">{results.count} products found</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.products.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                ))}
            </div>

            {results.count === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No products found matching "{query}"</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 bg-primary text-gray-500 px-4 py-2 rounded hover:bg-primary-dark transition"
                    >
                        Browse All Products
                    </button>
                </div>
            )}
        </div>
    );
}