import axios from 'axios';

export const makeAdmin = async (email) => {
    try {
        const response = await axios.post('/api/admin/make-admin', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const removeAdmin = async (email) => {
    try {
        const response = await axios.post('/api/admin/remove-admin', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAdminUsers = async () => {
    try {
        const response = await axios.get('/api/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};