import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getProducts } from '../services/mugsservice';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [features, setFeatures] = useState([]);
    const [designTags, setDesignTags] = useState([]);
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

            // Extract unique materials
            const allMaterials = response.data.flatMap(product => 
                product.materials || []
            );
            const uniqueMaterials = [...new Set(allMaterials)].filter(Boolean).sort();
            setMaterials(uniqueMaterials);

            // Extract unique features
            const allFeatures = response.data.flatMap(product => 
                product.features || []
            );
            const uniqueFeatures = [...new Set(allFeatures)].filter(Boolean).sort();
            setFeatures(uniqueFeatures);

            // Extract unique design tags
            const allDesignTags = response.data.flatMap(product => 
                product.designTags || []
            );
            const uniqueDesignTags = [...new Set(allDesignTags)].filter(Boolean).sort();
            setDesignTags(uniqueDesignTags);

        } catch (err) {
            setError(err.message || 'Failed to load mugs');
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

    const getProductsByMaterial = (material) => {
        return products.filter(product => 
            product.materials && product.materials.includes(material)
        );
    };

    const getProductsByFeature = (feature) => {
        return products.filter(product => 
            product.features && product.features.includes(feature)
        );
    };

    const getProductsByDesignTag = (tag) => {
        return products.filter(product => 
            product.designTags && product.designTags.includes(tag)
        );
    };

    const getCustomProducts = () => {
        return products.filter(product => product.isCustom);
    };

    const getReadyMadeProducts = () => {
        return products.filter(product => !product.isCustom);
    };

    const getFeaturedProducts = () => {
        // Featured mugs: Products with discount, custom designs, or best sellers
        return products.filter(product => 
            product.discountPercentage > 0 || 
            product.isCustom ||
            product.rating >= 4.5 // High-rated mugs
        ).slice(0, 8); // Limit to 8 featured mugs
    };

    const getMicrowaveSafeProducts = () => {
        return products.filter(product => product.isMicrowaveSafe);
    };

    const getDishwasherSafeProducts = () => {
        return products.filter(product => product.isDishwasherSafe);
    };

    const getProductsByCapacity = (capacity) => {
        return products.filter(product => product.capacity === capacity);
    };

    const getProductsByHandleType = (handleType) => {
        return products.filter(product => product.handleType === handleType);
    };

    const getBestSellingProducts = () => {
        // Mock best-selling logic - in real app, this would come from order data
        return products
            .filter(product => product.countInStock > 0)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 6);
    };

    const getNewArrivals = () => {
        // Mock new arrivals - in real app, this would be based on createdAt date
        return products
            .filter(product => product.countInStock > 0)
            .slice(-6)
            .reverse();
    };

    const refreshProducts = () => {
        fetchProducts();
    };

    const value = {
        products,
        categories,
        materials,
        features,
        designTags,
        loading,
        error,
        getProductById,
        getProductsByCategory,
        getProductsByMaterial,
        getProductsByFeature,
        getProductsByDesignTag,
        getCustomProducts,
        getReadyMadeProducts,
        getFeaturedProducts,
        getMicrowaveSafeProducts,
        getDishwasherSafeProducts,
        getProductsByCapacity,
        getProductsByHandleType,
        getBestSellingProducts,
        getNewArrivals,
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
