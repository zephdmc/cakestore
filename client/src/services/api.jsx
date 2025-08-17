import axios from 'axios';
import { auth } from '../firebase/config'; // 

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // baseURL: 'http://localhost:5000',
    withCredentials: true,
});

// Request interceptor to add Firebase ID token
API.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



//dd token refresh before your existing response interceptor
API.interceptors.response.use(null, async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors and avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
        try {
            originalRequest._retry = true; // Mark request to prevent loops

            // Force refresh token
            await auth.currentUser?.getIdToken(true);
            const newToken = await auth.currentUser?.getIdToken();

            // Update headers and retry
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return API(originalRequest);

        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Redirect to login or handle failed refresh
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    // Pass through other errors to your existing interceptor
    return Promise.reject(error);
});

// Add this error formatter BEFORE your interceptors
const formatError = (error) => {
    if (error.response) {
        // Server responded with non-2xx status
        return {
            message: error.response.data?.message || error.message,
            status: error.response.status,
            data: error.response.data,
            isNetworkError: false
        };
    } else if (error.request) {
        // Request made but no response
        return {
            message: 'Network error - no response from server',
            status: null,
            isNetworkError: true
        };
    } else {
        // Something else happened
        return {
            message: error.message || 'Unknown API error',
            status: null,
            isNetworkError: false
        };
    }
};

//Response interceptor
API.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Handle different HTTP error statuses
            const { status, data } = error.response;

            if (status === 401) {
                // Handle unauthorized access
                console.error('Unauthorized access');
            } else if (status === 404) {
                console.error('Resource not found');
            } else if (status >= 500) {
                console.error('Server error');
            }

            return Promise.reject(data?.message || 'An error occurred');
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject('Network error. Please check your connection.');
        } else {
            // Something happened in setting up the request
            return Promise.reject(error.message);
        }
    }
);
// Update your response interceptor
API.isNetworkError = (error) => {
    return !error.response && error.message && (
        error.message.includes('Network Error') ||
        error.message.includes('timeout') ||
        error.message.includes('Failed to fetch')
    );
};



export default API;
