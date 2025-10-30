import API from './api';
import { auth } from '../firebase/config';

export const getProducts = async (params = {}) => {
    try {
        const response = await API.get('api/products', { params });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await API.get(`api/mugs/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// productService.js - Updated for mugs
export const createProduct = async (productData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        // Format array fields for mugs
        const formattedData = {
            ...productData,
            materials: Array.isArray(productData.materials) ? productData.materials : 
                      productData.materials ? productData.materials.split(',').map(item => item.trim()) : [],
            features: Array.isArray(productData.features) ? productData.features : 
                     productData.features ? productData.features.split(',').map(item => item.trim()) : [],
            designTags: Array.isArray(productData.designTags) ? productData.designTags : 
                       productData.designTags ? productData.designTags.split(',').map(item => item.trim()) : [],
            images: Array.isArray(productData.images) ? productData.images : 
                   productData.images ? productData.images.split(',').map(item => item.trim()) : [],
            // Convert boolean fields
            isDishwasherSafe: Boolean(productData.isDishwasherSafe),
            isMicrowaveSafe: Boolean(productData.isMicrowaveSafe),
            isCustom: Boolean(productData.isCustom)
        };

        const response = await API.post('/api/mugs', formattedData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        console.error('🔥 Axios Error:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });

        throw new Error(error.response?.data?.error || error.message);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();

        // Format array fields for mugs update
        const formattedData = {
            ...productData,
            materials: Array.isArray(productData.materials) ? productData.materials : 
                      productData.materials ? productData.materials.split(',').map(item => item.trim()) : [],
            features: Array.isArray(productData.features) ? productData.features : 
                     productData.features ? productData.features.split(',').map(item => item.trim()) : [],
            designTags: Array.isArray(productData.designTags) ? productData.designTags : 
                       productData.designTags ? productData.designTags.split(',').map(item => item.trim()) : [],
            images: Array.isArray(productData.images) ? productData.images : 
                   productData.images ? productData.images.split(',').map(item => item.trim()) : [],
            // Convert boolean fields
            isDishwasherSafe: Boolean(productData.isDishwasherSafe),
            isMicrowaveSafe: Boolean(productData.isMicrowaveSafe),
            isCustom: Boolean(productData.isCustom)
        };

        const response = await API.put(`api/mugs/${id}`, formattedData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response;

    } catch (error) {
        console.error('Update Product Error:', {
            config: error.config,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await API.delete(`api/mugs/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// Additional mug-specific service functions
export const getMugCategories = async () => {
    try {
        const response = await API.get('api/mugs/categories');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getMugMaterials = async () => {
    try {
        // This could be a separate endpoint or filtered from products
        const response = await API.get('api/mugs', {
            params: { distinct: 'materials' }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getFeaturedMugs = async () => {
    try {
        const response = await API.get('api/products', {
            params: { 
                category: 'Featured Mugs',
                limit: 8 
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCustomMugs = async () => {
    try {
        const response = await API.get('api/mugs', {
            params: { 
                isCustom: true,
                category: 'Custom Mugs'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// Filter mugs by specific criteria
export const filterMugs = async (filters = {}) => {
    try {
        const response = await API.get('api/mugs', {
            params: {
                category: 'mugs',
                ...filters
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
