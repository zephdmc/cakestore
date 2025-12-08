const { v4: uuidv4 } = require('uuid');

class Product {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.description = data.description || '';
        this.images = data.images || [];
        this.category = data.category || ''; // Main category: "Cakes", "Candles", "Mugs"
        this.productType = data.productType || 'cake'; // "cake", "candle", "mug"
        this.countInStock = data.countInStock || 0;
        this.discountPercentage = data.discountPercentage || 0;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
        
        // Type-specific attributes (only used when applicable)
        this.specifications = data.specifications || {};
        
        // OR use polymorphic fields with defaults
        // For cakes:
        this.ingredients = data.ingredients || [];
        this.dietaryTags = data.dietaryTags || [];
        this.flavorTags = data.flavorTags || [];
        this.size = data.size || '';
        this.isCustom = data.isCustom || false;
        
        // For candles (store in specifications if you prefer):
        this.scent = data.scent || '';
        this.burnTime = data.burnTime || '';
        this.waxType = data.waxType || '';
        this.dimensions = data.dimensions || '';
        
        // For mugs:
        this.capacity = data.capacity || '';
        this.material = data.material || '';
        this.designType = data.designType || '';
        this.isDishwasherSafe = data.isDishwasherSafe || false;
    }

    toFirestore() {
        const baseFields = {
            name: this.name,
            price: this.price,
            description: this.description,
            images: this.images,
            category: this.category,
            productType: this.productType,
            countInStock: this.countInStock,
            discountPercentage: this.discountPercentage,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            specifications: this.specifications
        };

        // Add type-specific fields conditionally
        if (this.productType === 'cake') {
            Object.assign(baseFields, {
                ingredients: this.ingredients,
                dietaryTags: this.dietaryTags,
                flavorTags: this.flavorTags,
                size: this.size,
                isCustom: this.isCustom
            });
        } else if (this.productType === 'candle') {
            Object.assign(baseFields, {
                scent: this.scent,
                burnTime: this.burnTime,
                waxType: this.waxType,
                dimensions: this.dimensions
            });
        } else if (this.productType === 'mug') {
            Object.assign(baseFields, {
                capacity: this.capacity,
                material: this.material,
                designType: this.designType,
                isDishwasherSafe: this.isDishwasherSafe
            });
        }

        return baseFields;
    }

    static fromFirestore(id, data) {
        return new Product({ id, ...data });
    }
}

module.exports = Product;
