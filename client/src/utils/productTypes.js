// productTypes.js
export const PRODUCT_TYPES = {
    CAKE: 'cake',
    CANDLE: 'candle',
    MUG: 'mug'
};

export const PRODUCT_TYPE_LABELS = {
    [PRODUCT_TYPES.CAKE]: 'Crafted Themed Cakes',
    [PRODUCT_TYPES.CANDLE]: 'Luxury Scented Candles',
    [PRODUCT_TYPES.MUG]: 'Personalized Glass Mugs'
};

// Common categories for each product type
export const PRODUCT_CATEGORIES = {
    [PRODUCT_TYPES.CAKE]: [
        'Birthday Cakes',
        'Wedding Cakes',
        'Anniversary Cakes',
        'Custom Theme Cakes',
        'Cupcakes'
    ],
    [PRODUCT_TYPES.CANDLE]: [
        'Soy Wax Candles',
        'Beeswax Candles',
        'Scented Candles',
        'Decorative Candles',
        'Gift Set Candles'
    ],
    [PRODUCT_TYPES.MUG]: [
        'Personalized Mugs',
        'Photo Mugs',
        'Glass Mugs',
        'Travel Mugs',
        'Gift Mugs'
    ]
};

// Field configurations for product forms
export const PRODUCT_FIELD_CONFIGS = {
    [PRODUCT_TYPES.CAKE]: {
        required: ['name', 'price', 'description', 'ingredients', 'size'],
        arrayFields: ['ingredients', 'dietaryTags', 'flavorTags', 'images'],
        booleanFields: ['isCustom']
    },
    [PRODUCT_TYPES.CANDLE]: {
        required: ['name', 'price', 'description', 'scent', 'burnTime', 'waxType'],
        arrayFields: ['images'],
        booleanFields: []
    },
    [PRODUCT_TYPES.MUG]: {
        required: ['name', 'price', 'description', 'capacity', 'material', 'designType'],
        arrayFields: ['images'],
        booleanFields: ['isDishwasherSafe']
    }
};

// Validation messages
export const VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    PRICE_POSITIVE: 'Price must be greater than 0',
    STOCK_POSITIVE: 'Stock must be 0 or greater',
    DISCOUNT_RANGE: 'Discount must be between 0 and 100',
    IMAGES_MIN: 'At least one image is required'
};
