import API from './api';

export const login = async (email, password) => {
    try {
        const response = await API.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await API.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await API.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};