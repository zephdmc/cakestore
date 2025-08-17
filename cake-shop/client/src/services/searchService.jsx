import api from './api';

// export const getSearchSuggestions = async (query) => {
//     try {
//         const response = await api.get(`/search/suggestions?q=${query}`);
//         return response.data;
//     } catch (error) {
//         console.error('Search suggestions error:', error);
//         throw error;
//     }
// };

// export const searchProducts = async (query) => {
//     try {
//         const response = await api.get(`/search?q=${query}`);
//         return response.data;
//     } catch (error) {
//         console.error('Search error:', error);
//         throw error;
//     }
// };

// services/searchService.js
import axios from 'axios';

export const getSearchSuggestions = async (query) => {
    try {
        const response = await api.get(`/api/search/suggestions?q=${query}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to get suggestions');
    }
};

export const searchProducts = async (query) => {
    try {
        const response = await api.get(`/api/search/search?q=${query}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to search products');
    }
};