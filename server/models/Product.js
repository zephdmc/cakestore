const { v4: uuidv4 } = require('uuid');

class Product {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.description = data.description || '';
        this.images = data.images || []; // Changed from 'image' to 'images' (array)
        this.category = data.category || ''; // e.g., "Birthday Cakes", "Cupcakes"
        this.countInStock = data.countInStock || 0;
        this.ingredients = data.ingredients || []; // Now an array
        this.dietaryTags = data.dietaryTags || []; // Replaced 'skinType'. e.g., ["Gluten-Free", "Vegetarian"]
        this.size = data.size || ''; // e.g., "6-inch", "Dozen", "Single"
        this.flavorTags = data.flavorTags || []; // Replaced 'benefits'. e.g., ["Chocolate", "Vanilla", "Fruity"]
        this.isCustom = data.isCustom || false; // New field for made-to-order items
        this.discountPercentage = data.discountPercentage || 0;
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
            ingredients: this.ingredients,
            dietaryTags: this.dietaryTags,
            size: this.size,
            flavorTags: this.flavorTags,
            isCustom: this.isCustom,
            discountPercentage: this.discountPercentage,
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
            ingredients: data.ingredients,
            dietaryTags: data.dietaryTags,
            size: data.size,
            flavorTags: data.flavorTags,
            isCustom: data.isCustom,
            discountPercentage: data.discountPercentage,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        });
    }
}

module.exports = Product;
