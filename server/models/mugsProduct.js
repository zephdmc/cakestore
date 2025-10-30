const { v4: uuidv4 } = require('uuid');

class Product {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.description = data.description || '';
        this.images = data.images || []; // Array of mug images
        this.category = data.category || ''; // e.g., "Ceramic Mugs", "Travel Mugs", "Custom Mugs"
        this.countInStock = data.countInStock || 0;
        this.materials = data.materials || []; // e.g., ["Ceramic", "Porcelain", "Stainless Steel"]
        this.features = data.features || []; // e.g., ["Microwave Safe", "Dishwasher Safe", "Insulated"]
        this.capacity = data.capacity || ''; // e.g., "11oz", "15oz", "20oz"
        this.designTags = data.designTags || []; // e.g., ["Funny", "Minimalist", "Vintage", "Custom"]
        this.isCustom = data.isCustom || false; // For custom printed mugs
        this.discountPercentage = data.discountPercentage || 0;
        this.handleType = data.handleType || ''; // e.g., "Standard", "No Handle", "Travel Lid"
        this.isDishwasherSafe = data.isDishwasherSafe || false;
        this.isMicrowaveSafe = data.isMicrowaveSafe || false;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toFirestore() {
        return {
            name: this.name,
            price: this.price,
            description: this.description,
            images: this.images,
            category: this.category,
            countInStock: this.countInStock,
            materials: this.materials,
            features: this.features,
            capacity: this.capacity,
            designTags: this.designTags,
            isCustom: this.isCustom,
            discountPercentage: this.discountPercentage,
            handleType: this.handleType,
            isDishwasherSafe: this.isDishwasherSafe,
            isMicrowaveSafe: this.isMicrowaveSafe,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromFirestore(id, data) {
        return new Product({
            id,
            name: data.name,
            price: data.price,
            description: data.description,
            images: data.images,
            category: data.category,
            countInStock: data.countInStock,
            materials: data.materials,
            features: data.features,
            capacity: data.capacity,
            designTags: data.designTags,
            isCustom: data.isCustom,
            discountPercentage: data.discountPercentage,
            handleType: data.handleType,
            isDishwasherSafe: data.isDishwasherSafe,
            isMicrowaveSafe: data.isMicrowaveSafe,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        });
    }
}

module.exports = Product;
