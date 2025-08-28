import { useState, useEffect } from 'react';
import ProductCard from '../../components/products/ProductCard';
import ProductFilter from '../../components/products/ProductFilter';
import { useProducts } from '../../context/ProductContext'; // Use the context instead of direct service call
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';


export default function ProductListPage() {
    const { 
        products, 
        categories, 
        dietaryTags, 
        flavorTags, 
        loading, 
        error, 
        fetchProducts,
        refreshProducts 
    } = useProducts();
    
    const [localLoading, setLocalLoading] = useState(false);

    // No need for separate useEffect since context handles initial loading

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
        refreshProducts(); // Reset to all products
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Show loading state from context (initial load) or local loading (filtering)
    if (loading) return (
        <div className="container mx-auto px-4 py-8">
            <motion.div 
                variants={itemVariants} 
                className="text-center py-12"
                initial="hidden"
                animate="show"
            >
                <FiLoader className="inline-block animate-spin text-3xl text-purple-600 mb-3" />
                <p className="text-white">Loading products...</p>
            </motion.div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-red-500 text-center py-8">
                {error}
                <button 
                    onClick={refreshProducts}
                    className="block mt-4 mx-auto bg-purpleDark text-white px-4 py-2 rounded hover:bg-purpleDark1 transition"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl text-white font-bold">Our Delicious Cakes</h1>
                {products.length > 0 && (
                    <span className="text-white bg-purpleDark px-3 py-1 rounded-full text-sm">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </span>
                )}
            </div>

            <ProductFilter 
                categories={categories} 
                onFilter={handleFilter} 
            />

            {/* Filter loading indicator */}
            {localLoading && (
                <motion.div 
                    className="text-center py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <FiLoader className="inline-block animate-spin text-purple-600 mr-2" />
                    <span className="text-white">Applying filters...</span>
                </motion.div>
            )}

            {/* Results summary */}
            {products.length > 0 && !localLoading && (
                <div className="mb-6">
                    <p className="text-white text-sm">
                        Showing {products.length} {products.length === 1 ? 'result' : 'results'}
                    </p>
                </div>
            )}

            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={{
                    show: {
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                initial="hidden"
                animate="show"
            >
                {products.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </motion.div>

            {products.length === 0 && !localLoading && (
                <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p className="text-gray-400 mb-4">No products found matching your criteria.</p>
                    <button
                        onClick={handleClearFilters}
                        className="bg-purpleDark text-white px-4 py-2 rounded hover:bg-purpleDark1 transition"
                    >
                        Clear Filters
                    </button>
                </motion.div>
            )}
        </div>
    );
}
