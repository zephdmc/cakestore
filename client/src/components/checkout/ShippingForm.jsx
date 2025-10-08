import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTruck, 
  FiMapPin, 
  FiHome, 
  FiMail, 
  FiPhone,
  FiNavigation,
  FiCreditCard,
  FiArrowRight,
  FiShoppingBag,
  FiTag,
  FiUser
} from 'react-icons/fi';

export default function ShippingForm({ onSubmit, isCustomOrder = false }) {
    const { currentUser } = useAuth();
    const { cartTotal } = useCart();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nigeria',
        phone: '',
        promocode: '',
        email: currentUser?.email || '',
        deliveryMethod: 'pickup',
        shippingPrice: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const deliveryOptions = [
        { 
            value: 'pickup', 
            label: 'Store Pickup', 
            price: 0, 
            description: 'Collect your order from our store',
            icon: FiHome,
            color: 'green'
        },
        { 
            value: 'portHarcourt', 
            label: 'Within Port Harcourt', 
            price: 3500, 
            description: 'Fast delivery within the city',
            icon: FiNavigation,
            color: 'blue'
        },
        { 
            value: 'outsidePortHarcourt', 
            label: 'Outside Port Harcourt', 
            price: 6500, 
            description: 'Nationwide delivery service',
            icon: FiTruck,
            color: 'purple'
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDeliveryChange = (method) => {
        const selectedOption = deliveryOptions.find(opt => opt.value === method);
        setFormData(prev => ({
            ...prev,
            deliveryMethod: method,
            shippingPrice: selectedOption.price
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.email) {
            alert('Please enter a valid email address');
            return;
        }
        if (!formData.firstName || !formData.lastName) {
            alert('Please enter your first and last name');
            return;
        }
        if (!formData.phone) {
            alert('Please enter your phone number');
            return;
        }
        if (!formData.address) {
            alert('Please enter your address');
            return;
        }
        
        setIsSubmitting(true);
        // Simulate loading for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        onSubmit(formData);
        setIsSubmitting(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const selectedDelivery = deliveryOptions.find(opt => opt.value === formData.deliveryMethod);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 md:p-8 text-white mb-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                        <FiMapPin className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Shipping Information</h2>
                        <p className="text-purple-100">
                            {isCustomOrder ? 'Enter details for your custom cake delivery' : 'Enter your delivery details to complete your order'}
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <motion.form
                        variants={itemVariants}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100"
                    >
                        {/* Personal Information */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiUser className="text-purple-500" />
                                Personal Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiMail className="text-purple-500" />
                                Contact Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                                        required
                                        disabled={!!currentUser?.email}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="e.g., 08012345678"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiHome className="text-purple-500" />
                                Shipping Address
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="Enter your complete address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="e.g., Port Harcourt"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        required
                                        placeholder="e.g., Rivers"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white"
                                        required
                                    >
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Method */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiTruck className="text-purple-500" />
                                Delivery Method
                            </h3>
                            <div className="grid gap-4">
                                {deliveryOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <motion.div
                                            key={option.value}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                                formData.deliveryMethod === option.value
                                                    ? `border-${option.color}-500 bg-${option.color}-50`
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => handleDeliveryChange(option.value)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 bg-${option.color}-100 rounded-xl flex items-center justify-center`}>
                                                        <Icon className={`text-${option.color}-600 text-lg`} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{option.label}</div>
                                                        <div className="text-sm text-gray-600">{option.description}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-gray-800">
                                                        {option.price === 0 ? 'Free' : `₦${option.price.toLocaleString()}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Promo Code */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiTag className="text-purple-500" />
                                Promo Code
                            </h3>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    name="promocode"
                                    value={formData.promocode}
                                    onChange={handleChange}
                                    className="flex-1 p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter promo code (optional)"
                                />
                                <button
                                    type="button"
                                    className="px-6 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors duration-300"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Continue to Payment
                                    <FiCreditCard className="text-lg" />
                                </>
                            )}
                        </motion.button>
                    </motion.form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky top-8"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <FiShoppingBag className="text-purple-500" />
                            Order Summary
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₦{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{formData.shippingPrice === 0 ? 'Free' : `₦${formData.shippingPrice.toLocaleString()}`}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-lg font-bold text-gray-800">
                                    <span>Total</span>
                                    <span>₦{(cartTotal + formData.shippingPrice).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Selected Delivery Info */}
                        {selectedDelivery && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-8 h-8 bg-${selectedDelivery.color}-100 rounded-lg flex items-center justify-center`}>
                                        <selectedDelivery.icon className={`text-${selectedDelivery.color}-600 text-sm`} />
                                    </div>
                                    <span className="font-medium text-gray-800">{selectedDelivery.label}</span>
                                </div>
                                <p className="text-sm text-gray-600">{selectedDelivery.description}</p>
                            </motion.div>
                        )}

                        <Link
                            to="/products"
                            className="w-full border-2 border-purple-200 text-purple-600 py-3 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-purple-50 transition-all duration-300"
                        >
                            <FiArrowRight className="transform rotate-180" />
                            Continue Shopping
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
