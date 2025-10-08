import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

// Maximum allowed price for a single product (₦100,000)
const MAX_ALLOWED_PRICE = 100000;
// Maximum allowed quantity per product
const MAX_QUANTITY = 100;

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Filter out any items with unreasonable prices before calculating totals
        const validCartItems = cartItems.filter(item => {
            const price = Number(item.price) || 0;
            return price <= MAX_ALLOWED_PRICE;
        });

        // If we filtered out items, update the cart
        if (validCartItems.length !== cartItems.length) {
            console.warn('Removed items with unreasonable prices from cart');
            setCartItems(validCartItems);
            return; // Exit early, this effect will run again with filtered items
        }

        // Calculate totals with safety checks
        const newTotal = validCartItems.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            
            // Safety check - skip if price is unreasonable
            if (price > MAX_ALLOWED_PRICE) {
                console.error('Invalid price detected in cart calculation:', {
                    item: item.name,
                    price: price
                });
                return sum;
            }
            
            return sum + (price * quantity);
        }, 0);
        
        const newCount = validCartItems.reduce((count, item) => {
            return count + (Number(item.quantity) || 0);
        }, 0);
        
        setCartTotal(newTotal);
        setCartCount(newCount);

        // Debug logging
        if (cartItems.length > 0) {
            console.log('Cart updated:', {
                items: validCartItems.length,
                total: newTotal,
                count: newCount,
                itemsDetail: validCartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    itemTotal: item.price * item.quantity
                }))
            });
        }
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        // Validate product data
        if (!product || !product.id) {
            console.error('Invalid product added to cart:', product);
            return;
        }

        const safeQuantity = Math.max(1, Math.min(MAX_QUANTITY, Number(quantity) || 1));
        const safePrice = Number(product.price) || 0;

        // **CRITICAL FIX: Validate price before adding to cart**
        if (safePrice > MAX_ALLOWED_PRICE) {
            console.error('Product price rejected - too high:', {
                product: product.name,
                price: safePrice,
                maxAllowed: MAX_ALLOWED_PRICE
            });
            alert(`Sorry, the price for "${product.name}" (₦${safePrice.toLocaleString()}) appears to be incorrect. Please contact support.`);
            return; // Don't add to cart
        }

        // Validate that price is reasonable (not zero or negative for paid products)
        if (safePrice <= 0) {
            console.error('Product price rejected - zero or negative:', {
                product: product.name,
                price: safePrice
            });
            alert(`Sorry, "${product.name}" cannot be added to cart due to pricing issues.`);
            return;
        }

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
                if (newQuantity > MAX_QUANTITY) {
                    alert(`Maximum quantity per product is ${MAX_QUANTITY}`);
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
        const safeQuantity = Math.max(0, Math.min(MAX_QUANTITY, Number(newQuantity) || 0));
        
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

    // Remove items with unreasonable prices
    const removeProblematicItems = () => {
        setCartItems(prevItems => 
            prevItems.filter(item => {
                const price = Number(item.price) || 0;
                const isValid = price <= MAX_ALLOWED_PRICE && price > 0;
                if (!isValid) {
                    console.warn('Removing problematic item:', {
                        name: item.name,
                        price: item.price
                    });
                }
                return isValid;
            })
        );
    };

    // Get cart item by ID
    const getCartItem = (productId) => {
        return cartItems.find(item => item.id === productId);
    };

    // Check if cart has any problematic items
    const hasProblematicItems = () => {
        return cartItems.some(item => {
            const price = Number(item.price) || 0;
            return price > MAX_ALLOWED_PRICE || price <= 0;
        });
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
                getCartItem,
                removeProblematicItems,
                hasProblematicItems,
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
