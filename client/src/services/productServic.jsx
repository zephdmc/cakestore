import API from './api';
import { auth } from '../firebase/config';

// =========== PRODUCT LISTING & FILTERING ===========
export const getProducts = async (params = {}) => {
    try {
        const response = await API.get('api/products', { params });
        return response.data;
    } catch (error) {
        console.error('Get Products Error:', error.response?.data || error.message);
        throw error;
    }
};

// Get products by specific type (cake, candle, mug)
export const getProductsByType = async (productType, params = {}) => {
    try {
        const response = await API.get('api/products', { 
            params: { ...params, productType } 
        });
        return response.data;
    } catch (error) {
        console.error(`Get ${productType} Products Error:`, error.response?.data || error.message);
        throw error;
    }
};

// Get product statistics (counts by type)
export const getProductStats = async () => {
    try {
        const response = await API.get('api/products/stats/counts');
        return response.data;
    } catch (error) {
        console.error('Get Product Stats Error:', error.response?.data || error.message);
        throw error;
    }
};

// Get filter options for a specific product type
export const getFilterOptions = async (productType) => {
    try {
        const response = await API.get('api/products/filters/options', {
            params: { productType }
        });
        return response.data;
    } catch (error) {
        console.error('Get Filter Options Error:', error.response?.data || error.message);
        throw error;
    }
};

// =========== SINGLE PRODUCT OPERATIONS ===========
export const getProductById = async (id) => {
    try {
        const response = await API.get(`api/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get Product by ID Error:', error.response?.data || error.message);
        throw error;
    }
};

// =========== PRODUCT CREATION ===========
export const createProduct = async (productData) => {
    try {
        if (!auth || !auth.currentUser) {
            throw new Error('User not authenticated');
        }

        const token = await auth.currentUser.getIdToken(true);
        
        // Format product data based on type
        const formattedData = formatProductForAPI(productData);

        const response = await API.post('/api/products', formattedData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Create Product Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.message || error.message);
    }
};

// =========== PRODUCT UPDATES ===========
export const updateProduct = async (id, productData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();
        
        // Format product data for update
        const formattedData = formatProductForAPI(productData, true);

        const response = await API.put(`api/products/${id}`, formattedData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Update Product Error:', {
            config: error.config,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

// =========== PRODUCT DELETION ===========
export const deleteProduct = async (id) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();

        const response = await API.delete(`api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Delete Product Error:', error.response?.data || error.message);
        throw error;
    }
};

// =========== HELPER FUNCTIONS ===========
// Format product data for API submission
const formatProductForAPI = (productData, isUpdate = false) => {
    const formatted = { ...productData };
    
    // Convert string arrays to arrays if needed
    const arrayFields = ['images', 'ingredients', 'dietaryTags', 'flavorTags'];
    
    arrayFields.forEach(field => {
        if (formatted[field] && typeof formatted[field] === 'string') {
            formatted[field] = formatted[field]
                .split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);
        }
    });
    
    // Ensure countInStock is a number
    if (formatted.countInStock) {
        formatted.countInStock = parseInt(formatted.countInStock);
    }
    
    // Ensure price is a number
    if (formatted.price) {
        formatted.price = parseFloat(formatted.price);
    }
    
    // Ensure discountPercentage is a number
    if (formatted.discountPercentage) {
        formatted.discountPercentage = parseFloat(formatted.discountPercentage);
    }
    
    // Ensure boolean fields are proper booleans
    if (formatted.isCustom !== undefined) {
        formatted.isCustom = Boolean(formatted.isCustom);
    }
    
    if (formatted.isDishwasherSafe !== undefined) {
        formatted.isDishwasherSafe = Boolean(formatted.isDishwasherSafe);
    }
    
    return formatted;
};

// Get product type-specific default values
export const getProductDefaults = (productType) => {
    const defaults = {
        name: '',
        price: 0,
        description: '',
        images: [],
        category: '',
        productType,
        countInStock: 0,
        discountPercentage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    switch (productType) {
        case 'cake':
            return {
                ...defaults,
                ingredients: [],
                dietaryTags: [],
                flavorTags: [],
                size: '',
                isCustom: false
            };
            
        case 'candle':
            return {
                ...defaults,
                scent: '',
                burnTime: '',
                waxType: '',
                dimensions: ''
            };
            
        case 'mug':
            return {
                ...defaults,
                capacity: '',
                material: '',
                designType: '',
                isDishwasherSafe: false
            };
            
        default:
            return defaults;
    }
};

// Format product for display based on type
export const formatProductForDisplay = (product) => {
    if (!product) return null;
    
    const baseProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images || [],
        category: product.category,
        productType: product.productType || 'cake',
        countInStock: product.countInStock || 0,
        discountPercentage: product.discountPercentage || 0,
        displayPrice: calculateDisplayPrice(product),
        inStock: (product.countInStock || 0) > 0
    };
    
    // Add type-specific fields
    switch (product.productType) {
        case 'cake':
            return {
                ...baseProduct,
                ingredients: product.ingredients || [],
                dietaryTags: product.dietaryTags || [],
                flavorTags: product.flavorTags || [],
                size: product.size || '',
                isCustom: product.isCustom || false
            };
            
        case 'candle':
            return {
                ...baseProduct,
                scent: product.scent || '',
                burnTime: product.burnTime || '',
                waxType: product.waxType || '',
                dimensions: product.dimensions || ''
            };
            
        case 'mug':
            return {
                ...baseProduct,
                capacity: product.capacity || '',
                material: product.material || '',
                designType: product.designType || '',
                isDishwasherSafe: product.isDishwasherSafe || false
            };
            
        default:
            return baseProduct;
    }
};

// Calculate display price with discount
const calculateDisplayPrice = (product) => {
    const price = parseFloat(product.price) || 0;
    const discount = parseFloat(product.discountPercentage) || 0;
    
    if (discount > 0) {
        const discountAmount = price * (discount / 100);
        return {
            original: price.toFixed(2),
            discounted: (price - discountAmount).toFixed(2),
            discountPercentage: discount
        };
    }
    
    return {
        original: price.toFixed(2),
        discounted: price.toFixed(2),
        discountPercentage: 0
    };
};

// Search products by name
export const searchProducts = async (searchTerm, productType = null) => {
    try {
        const params = { search: searchTerm };
        if (productType) {
            params.productType = productType;
        }
        
        const response = await API.get('api/products', { params });
        return response.data;
    } catch (error) {
        console.error('Search Products Error:', error.response?.data || error.message);
        throw error;
    }
};

// Get featured products (custom logic - you might want to add a 'featured' field to your model)
export const getFeaturedProducts = async () => {
    try {
        // This is a simple implementation - you might want to add a 'featured' field
        // to your Product model and query for featured products
        const response = await API.get('api/products', {
            params: { limit: 8 }
        });
        return response.data;
    } catch (error) {
        console.error('Get Featured Products Error:', error.response?.data || error.message);
        throw error;
    }
};

// Get related products (by category)
export const getRelatedProducts = async (productId, productType, category, limit = 4) => {
    try {
        const response = await API.get('api/products', {
            params: {
                productType,
                category,
                limit,
                exclude: productId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get Related Products Error:', error.response?.data || error.message);
        throw error;
    }
};
