import { useState, useEffect } from 'react';
import ProductCard from '../../components/products/ProductCard';
import ProductFilter from '../../components/products/ProductFilter';
import { getProducts } from '../../services/productServic';
import { motion } from 'framer-motion';
import {  FiLoader } from 'react-icons/fi';
export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data);

                // Extract unique categories
                const uniqueCategories = [...new Set(
                    response.data.map(product => product.category)
                )];
                setCategories(uniqueCategories);
            } catch (err) {
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleFilter = async (filters) => {
        try {
            setLoading(true);
            const response = await getProducts(filters);
            setProducts(response.data);
        } catch (err) {
            setError(err.message || 'Failed to filter products');
        } finally {
            setLoading(false);
        }
    };
      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) return <div> <motion.div variants={itemVariants} className="text-center py-12">
                <FiLoader className="inline-block animate-spin text-3xl text-purple-600 mb-3" />
                <p className="text-white">Loading featured products...</p>
            </motion.div>
</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl text-white font-bold mb-6">All Products</h1>

            <ProductFilter categories={categories} onFilter={handleFilter} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
