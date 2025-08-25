// server/models/Order.js
const { v4: uuidv4 } = require('uuid');

class Order {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.userId = data.userId;
        this.items = data.items || [];
        this.shippingAddress = data.shippingAddress || {};
        this.paymentMethod = data.paymentMethod || '';
        this.paymentResult = data.paymentResult || {};
        this.itemsPrice = data.itemsPrice || 0;
        this.taxPrice = data.taxPrice || 0;
        this.shippingPrice = data.shippingPrice || 0;
        this.totalPrice = data.totalPrice || 0;
        this.isPaid = data.isPaid || false;
        this.paidAt = data.paidAt || null;
        this.isDelivered = data.isDelivered || false;
        this.deliveredAt = data.deliveredAt || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        
        // Add custom order fields
        this.isCustomOrder = data.isCustomOrder || false;
        this.customOrderId = data.customOrderId || null;
        this.customDetails = data.customDetails || null;
    }

    toFirestore() {
        return {
            userId: this.userId,
            items: this.items,
            shippingAddress: this.shippingAddress,
            paymentMethod: this.paymentMethod,
            paymentResult: this.paymentResult,
            itemsPrice: this.itemsPrice,
            taxPrice: this.taxPrice,
            shippingPrice: this.shippingPrice,
            totalPrice: this.totalPrice,
            isPaid: this.isPaid,
            paidAt: this.paidAt,
            isDelivered: this.isDelivered,
            deliveredAt: this.deliveredAt,
            createdAt: this.createdAt,
            // Add custom order fields
            isCustomOrder: this.isCustomOrder,
            customOrderId: this.customOrderId,
            customDetails: this.customDetails
        };
    }

    static fromFirestore(id, data) {
        return new Order({ id, ...data });
    }
}

module.exports = Order;
