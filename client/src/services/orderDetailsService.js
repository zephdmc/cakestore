// services/orderDetailsService.js
import { getOrderById } from './orderService';
import { getCustomOrderById } from './customOrderService';
import API from './api';
import { auth } from '../firebase/config';

export const getEnhancedOrderDetails = async (orderId) => {
    try {
        if (!auth || !auth.currentUser) throw new Error('User not authenticated');
        const token = await auth.currentUser.getIdToken(true);

        // Fetch the main order
        const orderResponse = await API.get(`/api/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const order = orderResponse.data;

        // If it's a custom order, fetch the custom order details
        let customOrderDetails = null;
        if (order.isCustomOrder && order.customOrderId) {
            const customOrderResponse = await API.get(`/api/custom-orders/${order.customOrderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            customOrderDetails = customOrderResponse.data;
        }

        return {
            ...order,
            customOrderDetails
        };

    } catch (error) {
        console.error('Error fetching enhanced order details:', error);
        throw error;
    }
};
