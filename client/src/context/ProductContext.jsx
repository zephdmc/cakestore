import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  getProducts, 
  getProductStats,
  getFilterOptions,
  getProductsByType 
} from '../services/productServic';
import { PRODUCT_TYPES } from '../utils/productTypes';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    cakes: 0,
    candles: 0,
    mugs: 0,
    inStock: 0,
    outOfStock: 0
  });

  // Type-specific filter options
  const [filterOptions, setFilterOptions] = useState({
    [PRODUCT_TYPES.CAKE]: {
      categories: [],
      dietaryTags: [],
      flavorTags: [],
      sizes: []
    },
    [PRODUCT_TYPES.CANDLE]: {
      categories: [],
      scents: [],
      waxTypes: [],
      burnTimes: []
    },
    [PRODUCT_TYPES.MUG]: {
      categories: [],
      materials: [],
      designTypes: [],
      capacities: []
    }
  });

  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const response = await getProducts(filters);
      
      // Handle both response formats
      const productsData = response.data || response;
      setProducts(Array.isArray(productsData) ? productsData : [productsData]);

      // Extract unique categories across all product types
      const allCategories = [...new Set(
        productsData
          .map(product => product.category)
          .filter(Boolean)
      )].sort();
      setCategories(allCategories);

      // Update type-specific categories
      updateTypeSpecificCategories(productsData);

    } catch (err) {
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTypeSpecificCategories = (productsData) => {
    const newFilterOptions = { ...filterOptions };
    
    Object.values(PRODUCT_TYPES).forEach(productType => {
      const typeProducts = productsData.filter(p => p.productType === productType);
      
      if (typeProducts.length > 0) {
        // Update categories for this product type
        const typeCategories = [...new Set(
          typeProducts.map(p => p.category).filter(Boolean)
        )].sort();
        
        newFilterOptions[productType] = {
          ...newFilterOptions[productType],
          categories: typeCategories
        };

        // For cakes, extract dietary and flavor tags
        if (productType === PRODUCT_TYPES.CAKE) {
          const dietaryTags = [...new Set(
            typeProducts.flatMap(p => p.dietaryTags || [])
          )].sort();
          
          const flavorTags = [...new Set(
            typeProducts.flatMap(p => p.flavorTags || [])
          )].sort();
          
          const sizes = [...new Set(
            typeProducts.map(p => p.size).filter(Boolean)
          )].sort();
          
          newFilterOptions[productType] = {
            ...newFilterOptions[productType],
            dietaryTags,
            flavorTags,
            sizes
          };
        }

        // For candles, extract scents and wax types
        if (productType === PRODUCT_TYPES.CANDLE) {
          const scents = [...new Set(
            typeProducts.map(p => p.scent).filter(Boolean)
          )].sort();
          
          const waxTypes = [...new Set(
            typeProducts.map(p => p.waxType).filter(Boolean)
          )].sort();
          
          const burnTimes = [...new Set(
            typeProducts.map(p => p.burnTime).filter(Boolean)
          )].sort();
          
          newFilterOptions[productType] = {
            ...newFilterOptions[productType],
            scents,
            waxTypes,
            burnTimes
          };
        }

        // For mugs, extract materials and design types
        if (productType === PRODUCT_TYPES.MUG) {
          const materials = [...new Set(
            typeProducts.map(p => p.material).filter(Boolean)
          )].sort();
          
          const designTypes = [...new Set(
            typeProducts.map(p => p.designType).filter(Boolean)
          )].sort();
          
          const capacities = [...new Set(
            typeProducts.map(p => p.capacity).filter(Boolean)
          )].sort();
          
          newFilterOptions[productType] = {
            ...newFilterOptions[productType],
            materials,
            designTypes,
            capacities
          };
        }
      }
    });

    setFilterOptions(newFilterOptions);
  };

  const fetchStats = useCallback(async () => {
    try {
      const response = await getProductStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  const fetchFilterOptions = useCallback(async (productType) => {
    try {
      const response = await getFilterOptions(productType);
      if (response.success) {
        setFilterOptions(prev => ({
          ...prev,
          [productType]: {
            ...prev[productType],
            ...response.data
          }
        }));
      }
    } catch (err) {
      console.error(`Failed to load filter options for ${productType}:`, err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, [fetchProducts, fetchStats]);

  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  const getProductsByProductType = (productType) => {
    return products.filter(product => product.productType === productType);
  };

  const getProductsByTypeAndCategory = (productType, category) => {
    return products.filter(product => 
      product.productType === productType && product.category === category
    );
  };

  // Cake-specific methods
  const getCakesByDietaryTag = (tag) => {
    return products.filter(product => 
      product.productType === PRODUCT_TYPES.CAKE &&
      product.dietaryTags && 
      product.dietaryTags.includes(tag)
    );
  };

  const getCakesByFlavorTag = (tag) => {
    return products.filter(product => 
      product.productType === PRODUCT_TYPES.CAKE &&
      product.flavorTags && 
      product.flavorTags.includes(tag)
    );
  };

  // Candle-specific methods
  const getCandlesByScent = (scent) => {
    return products.filter(product => 
      product.productType === PRODUCT_TYPES.CANDLE &&
      product.scent === scent
    );
  };

  const getCandlesByWaxType = (waxType) => {
    return products.filter(product => 
      product.productType === PRODUCT_TYPES.CANDLE &&
      product.waxType === waxType
    );
  };

  // Mug-specific methods
  const getMugsByMaterial = (material) => {
    return products.filter(product => 
      product.productType === PRODUCT_TYPES.MUG &&
      product.material === material
    );
  };

  const getMugsByDesignType = (designType) => {
    return products.filter(product => 
      product.productType === PRODUCT_TYPES.MUG &&
      product.designType === designType
    );
  };

  const getCustomProducts = () => {
    return products.filter(product => product.isCustom);
  };

  const getReadyMadeProducts = () => {
    return products.filter(product => !product.isCustom);
  };

  const getInStockProducts = () => {
    return products.filter(product => product.countInStock > 0);
  };

  const getOutOfStockProducts = () => {
    return products.filter(product => product.countInStock === 0);
  };

  const getFeaturedProducts = (limit = 8) => {
    // Featured logic: products with discount OR custom products OR best sellers
    return products
      .filter(product => 
        product.discountPercentage > 0 || 
        product.isCustom ||
        product.countInStock < 5 // Low stock items as featured
      )
      .slice(0, limit);
  };

  const getRelatedProducts = (productId, productType, category, limit = 4) => {
    return products
      .filter(product => 
        product.id !== productId &&
        product.productType === productType &&
        product.category === category
      )
      .slice(0, limit);
  };

  const getNewArrivals = (limit = 6) => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const getBestSellers = (limit = 6) => {
    // This would ideally come from order data
    // For now, we'll use a placeholder: products with highest discount or most reviews
    return [...products]
      .sort((a, b) => {
        // Sort by discount percentage first, then by stock (lower stock = more popular)
        const aScore = (a.discountPercentage || 0) + (a.countInStock === 0 ? -100 : 0);
        const bScore = (b.discountPercentage || 0) + (b.countInStock === 0 ? -100 : 0);
        return bScore - aScore;
      })
      .slice(0, limit);
  };

  const refreshProducts = () => {
    fetchProducts();
    fetchStats();
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    // State
    products,
    categories,
    filterOptions,
    loading,
    error,
    stats,
    
    // General methods
    getProductById,
    getProductsByCategory,
    getProductsByProductType,
    getProductsByTypeAndCategory,
    getCustomProducts,
    getReadyMadeProducts,
    getInStockProducts,
    getOutOfStockProducts,
    getFeaturedProducts,
    getRelatedProducts,
    getNewArrivals,
    getBestSellers,
    
    // Type-specific methods
    getCakesByDietaryTag,
    getCakesByFlavorTag,
    getCandlesByScent,
    getCandlesByWaxType,
    getMugsByMaterial,
    getMugsByDesignType,
    
    // Actions
    refreshProducts,
    fetchProducts,
    fetchFilterOptions,
    clearError
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
