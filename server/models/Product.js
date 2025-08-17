const { v4: uuidv4 } = require('uuid');

class Product {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.description = data.description || '';
        this.image = data.image || '';
        this.category = data.category || '';
        this.countInStock = data.countInStock || 0;
        this.ingredients = data.ingredients || '';
        this.skinType = data.skinType || '';
        this.size = data.size || '';
        this.benefits = data.benefits || '';
       this.discountPercentage = data.discountPercentage || 0;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toFirestore() {
        return {
            name: this.name,
            price: this.price,
            description: this.description,
            image: this.image,
            category: this.category,
            countInStock: this.countInStock,
            ingredients: this.ingredients,
            skinType: this.skinType,
            size: this.size,
            benefits: this.benefits,
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
            image: data.image,
            category: data.category,
            countInStock: data.countInStock,
            ingredients: data.ingredients,
            skinType: data.skinType,
            size: data.size,
            benefits: data.benefits,
            discountPercentage: data.discountPercentage,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        });
    }
}

module.exports = Product;
