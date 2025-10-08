import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Calculate totals whenever cartItems changes with safety checks
        const newTotal = cartItems.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            
            // Debug logging for large amounts
            if (price * quantity > 1000000) { // If any item is over 1 million
                console.warn('Large cart item detected:', {
                    item: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: price * quantity
                });
            }
            
            return sum + (price * quantity);
        }, 0);
        
        const newCount = cartItems.reduce((count, item) => {
            return count + (Number(item.quantity) || 0);
        }, 0);
        
        setCartTotal(newTotal);
        setCartCount(newCount);

        // Log for debugging
        console.log('Cart updated:', {
            items: cartItems.length,
            total: newTotal,
            count: newCount,
            itemsDetail: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                itemTotal: item.price * item.quantity
            }))
        });
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        // Validate product data
        if (!product || !product.id) {
            console.error('Invalid product added to cart:', product);
            return;
        }

        const safeQuantity = Math.max(1, Math.min(100, Number(quantity) || 1)); // Limit quantity to 1-100
        const safePrice = Number(product.price) || 0;

        // Log for debugging
        console.log('Adding to cart:', {
            product: product.name,
            price: safePrice,
            quantity: safeQuantity,
            calculatedTotal: safePrice * safeQuantity
        });

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                const newQuantity = existingItem.quantity + safeQuantity;
                if (newQuantity > 100) {
                    alert('Maximum quantity per product is 100');
                    return prevItems;
                }
                
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }

            return [...prevItems, { 
                ...product, 
                quantity: safeQuantity,
                price: safePrice // Ensure price is a number
            }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== productId)
        );
    };

    const updateQuantity = (productId, newQuantity) => {
        const safeQuantity = Math.max(0, Math.min(100, Number(newQuantity) || 0));
        
        if (safeQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity: safeQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Get cart item by ID for debugging
    const getCartItem = (productId) => {
        return cartItems.find(item => item.id === productId);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartTotal,
                cartCount,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartItem, // For debugging
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
