import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ShippingForm({ onSubmit }) {
    const { currentUser } = useAuth();
    const { cartTotal } = useCart();

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria',
        phone: '',
        promocode: '',
        email: currentUser?.email || '',
         deliveryMethod: 'pickup',  // 🆕 default method
    shippingPrice: 0           // 🆕 shipping price
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
const deliveryPrices = {
    pickup: 0,
    portHarcourt: 3500,
    outsidePortHarcourt: 6500
};

const handleDeliveryChange = (e) => {
    const method = e.target.value;
    const price = deliveryPrices[method];
    setFormData((prev) => ({
        ...prev,
        deliveryMethod: method,
        shippingPrice: price
    }));
};

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email) {
            alert('Please enter a valid email address');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg text-purpleDark1 font-medium mb-4">Shipping Information</h3>

            <div className="mb-4">
                <label className="block text-purpleDark mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                    disabled={!!currentUser?.email}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-purpleDark mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-purpleDark mb-1">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-purpleDark mb-1">State</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-purpleDark mb-1">Postal Code</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-purpleDark mb-1">Promo Code</label>
                    <input
                        type="text"
                        name="promocode"
                        value={formData.promocode}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-purpleDark mb-1">Country</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-purpleDark mb-1">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div className="mb-4">
    <label className="block text-purpleDark mb-1">Delivery Method</label>
    <select
        name="deliveryMethod"
        value={formData.deliveryMethod}
        onChange={handleDeliveryChange}
        className="w-full p-2 border rounded"
        required
    >
        <option value="portHarcourt">Within Port Harcourt (₦3,500)</option>
        <option value="outsidePortHarcourt">Outside Port Harcourt (₦6,500)</option>
        <option value="pickup">Pick up at Store (Free)</option>
    </select>
</div>
<div className="mb-4 text-right font-semibold">
  Total Fee: ₦{(cartTotal + formData.shippingPrice).toLocaleString()}
</div>


            <button
                type="submit"
                className="w-full bg-purpleDark text-purpleLighter py-3 px-4 rounded hover:bg-purpleLighter transition font-medium"
            >
                Continue to Payment
            </button>
            <Link
                to="/products"
                className="border border-purpleDark text-purpleDark py-2 px-6 rounded hover:bg-purpleLighter1 transition font-medium"
            >
                Continue Shopping
            </Link>
        </form>

    );
}
