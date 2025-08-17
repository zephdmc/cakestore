import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartSummary() {
    const { cartTotal, cartCount, clearCart } = useCart();

    return (
        <div className="bg-purpleLighter1 p-6 rounded-lg">
            <h3 className="text-lg text-purpleDark1 font-medium mb-4">Order Summary</h3>
            <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                    <span>Items ({cartCount})</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₦0</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₦0</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span classname="text-purpleDark1">Total</span>
                    <span>₦{cartTotal.toLocaleString()}</span>
                </div>
            </div>
            <button
                onClick={clearCart}
                className="w-full mb-4 bg-purpleLighter text-purpleDark py-2 px-4 rounded hover:bg-purpleLighter1 transition"
            >
                Clear Cart
            </button>
            <Link
                to="/checkout"
                className="block w-full bg-purpleDark text-purpleLighter py-2 px-4 rounded text-center hover:bg-purpleLighter1 transition"
            >
                Proceed to Checkout
            </Link>
        </div>
    );
}
