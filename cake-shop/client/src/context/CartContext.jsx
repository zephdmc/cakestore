import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Calculate totals whenever cartItems changes
        const newTotal = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const newCount = cartItems.reduce(
            (count, item) => count + item.quantity,
            0
        );
        setCartTotal(newTotal);
        setCartCount(newCount);
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== productId)
        );
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
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
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}