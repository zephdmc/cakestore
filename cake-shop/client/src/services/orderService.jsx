import API from './api';
import { auth } from '../firebase/config';

// export const createOrder = async (orderData) => {
//     try {
//         const response = await API.post('api/orders', orderData);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

// export const getOrderById = async (id) => {
//     try {
//         const response = await API.get(`api/orders/${id}`);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

export const createOrder = async (orderData) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.post(
            '/api/orders',
            orderData, // ✅ this is the body
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return response;

    } catch (error) {
        console.error('Order creation error:', error.response?.data || error.message);
        throw error;
    }
};


export const getOrderById = async (id) => {
    try {

        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get(`/api/orders/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;




    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

export const getOrdersByUser = async () => {
    try {

        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get(`api/orders/myorders`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        throw error;
    }
};

export const getAllOrders = async () => {
    try {


        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.get('api/orders', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;


    } catch (error) {
        throw error;
    }
};

export const updateOrderToDelivered = async (orderId) => {
    try {

        if (!auth || !auth.currentUser) throw new Error('User not authenticated');

        const token = await auth.currentUser.getIdToken(true);

        const response = await API.put(`api/orders/${orderId}/deliver`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response;


    } catch (error) {
        throw error;
    }
};
