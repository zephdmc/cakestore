import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';

export default function CartPage() {
    const { cartItems, cartCount } = useCart();

    if (cartCount === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    to="/products"
                    className="bg-primary text-gray-600 py-2 px-6 rounded hover:bg-primary-dark transition"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl text-white font-bold mb-6">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    {cartItems.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>

                <div>
                    <CartSummary />
                </div>
            </div>
        </div>
    );
}
