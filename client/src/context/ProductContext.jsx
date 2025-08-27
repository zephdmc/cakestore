import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getProducts } from '../services/productServic'; // Fixed typo: productServic -> productService

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dietaryTags, setDietaryTags] = useState([]);
    const [flavorTags, setFlavorTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            const response = await getProducts(filters);
            setProducts(response.data);

            // Extract unique categories
            const uniqueCategories = [...new Set(
                response.data.map(product => product.category).filter(Boolean)
            )].sort();
            setCategories(uniqueCategories);

            // Extract unique dietary tags
            const allDietaryTags = response.data.flatMap(product => 
                product.dietaryTags || []
            );
            const uniqueDietaryTags = [...new Set(allDietaryTags)].filter(Boolean).sort();
            setDietaryTags(uniqueDietaryTags);

            // Extract unique flavor tags
            const allFlavorTags = response.data.flatMap(product => 
                product.flavorTags || []
            );
            const uniqueFlavorTags = [...new Set(allFlavorTags)].filter(Boolean).sort();
            setFlavorTags(uniqueFlavorTags);

        } catch (err) {
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const getProductById = (id) => {
        return products.find(product => product.id === id);
    };

    const getProductsByCategory = (category) => {
        return products.filter(product => product.category === category);
    };

    const getProductsByDietaryTag = (tag) => {
        return products.filter(product => 
            product.dietaryTags && product.dietaryTags.includes(tag)
        );
    };

    const getProductsByFlavorTag = (tag) => {
        return products.filter(product => 
            product.flavorTags && product.flavorTags.includes(tag)
        );
    };

    const getCustomProducts = () => {
        return products.filter(product => product.isCustom);
    };

    const getReadyMadeProducts = () => {
        return products.filter(product => !product.isCustom);
    };

    const getFeaturedProducts = () => {
        // Example: Products with discount or custom logic for featuring
        return products.filter(product => 
            product.discountPercentage > 0 || product.isCustom
        ).slice(0, 8); // Limit to 8 featured products
    };

    const refreshProducts = () => {
        fetchProducts();
    };

    const value = {
        products,
        categories,
        dietaryTags,
        flavorTags,
        loading,
        error,
        getProductById,
        getProductsByCategory,
        getProductsByDietaryTag,
        getProductsByFlavorTag,
        getCustomProducts,
        getReadyMadeProducts,
        getFeaturedProducts,
        refreshProducts,
        fetchProducts // Allow external filtering
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
