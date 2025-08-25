// server/models/CustomOrder.js
const { v4: uuidv4 } = require('uuid');

class CustomOrder {
    constructor(data) {
        this.id = data.id || `custom_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
        this.userId = data.userId;
        this.userEmail = data.userEmail;
        this.occasion = data.occasion;
        this.size = data.size;
        this.flavor = data.flavor;
        this.frosting = data.frosting;
        this.filling = data.filling || 'none';
        this.decorations = data.decorations;
        this.message = data.message || '';
        this.deliveryDate = data.deliveryDate;
        this.deliveryTime = data.deliveryTime || '';
        this.allergies = data.allergies || '';
        this.specialInstructions = data.specialInstructions || '';
        this.imageUrl = data.imageUrl || null;
        this.price = data.price || 0;
        this.status = data.status || 'pending'; // pending, confirmed, in-progress, ready, delivered, cancelled
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toFirestore() {
        return {
            userId: this.userId,
            userEmail: this.userEmail,
            occasion: this.occasion,
            size: this.size,
            flavor: this.flavor,
            frosting: this.frosting,
            filling: this.filling,
            decorations: this.decorations,
            message: this.message,
            deliveryDate: this.deliveryDate,
            deliveryTime: this.deliveryTime,
            allergies: this.allergies,
            specialInstructions: this.specialInstructions,
            imageUrl: this.imageUrl,
            price: this.price,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromFirestore(id, data) {
        return new CustomOrder({ id, ...data });
    }
}

module.exports = CustomOrder;
