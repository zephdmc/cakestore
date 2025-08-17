import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                />
                <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-purpleDark">₦{item.price.toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="border rounded p-1"
                >
                    {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                            {x + 1}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
