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
        const response = await API.get(`api/products/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
// productService.js
export const createProduct = async (productData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.post('/api/products', productData, {
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

        const response = await API.put(`api/products/${id}`, productData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Debug log to see actual response structure
    

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
        const response = await API.delete(`api/products/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};
