import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiMinus, 
  FiTrash2, 
  FiShoppingBag,
  FiHeart
} from 'react-icons/fi';

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity === 0) {
            handleRemove();
        } else {
            updateQuantity(item.id, newQuantity);
        }
    };

    const handleIncrement = () => {
        handleQuantityChange(item.quantity + 1);
    };

    const handleDecrement = () => {
        handleQuantityChange(item.quantity - 1);
    };

    const handleRemove = () => {
        // Animation for removal
        removeFromCart(item.id);
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            x: -50,
            scale: 0.9 
        },
        visible: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        },
        exit: { 
            opacity: 0, 
            x: 100,
            scale: 0.8,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.1 },
        tap: { scale: 0.9 }
    };

    const imageVariants = {
        hover: { scale: 1.05, rotate: 1 },
        tap: { scale: 0.95 }
    };

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
            <div className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <motion.div
                        variants={imageVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="relative flex-shrink-0"
                    >
                        <img
                            src={item.images}
                            alt={item.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl border-2 border-gray-200 group-hover:border-purple-200 transition-colors duration-300"
                        />
                        {/* Favorite Badge */}
                        <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                        >
                            <FiHeart className="w-3 h-3 text-gray-400 hover:text-red-500" />
                        </motion.button>
                    </motion.div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-tight group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                                    {item.name}
                                </h3>
                                <p className="text-lg font-bold text-purple-600 mt-1 md:mt-2">
                                    ₦{item.price.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Subtotal: <span className="font-semibold text-gray-700">₦{(item.price * item.quantity).toLocaleString()}</span>
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                                {/* Quantity Selector */}
                                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
                                    <motion.button
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={handleDecrement}
                                        disabled={item.quantity <= 1}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                                            item.quantity <= 1 
                                                ? 'text-gray-300 cursor-not-allowed' 
                                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                        }`}
                                    >
                                        <FiMinus className="w-4 h-4" />
                                    </motion.button>

                                    <motion.span 
                                        key={item.quantity}
                                        initial={{ scale: 1.2 }}
                                        animate={{ scale: 1 }}
                                        className="w-8 text-center font-semibold text-gray-800 text-sm"
                                    >
                                        {item.quantity}
                                    </motion.span>

                                    <motion.button
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={handleIncrement}
                                        disabled={item.quantity >= 10}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                                            item.quantity >= 10 
                                                ? 'text-gray-300 cursor-not-allowed' 
                                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                        }`}
                                    >
                                        <FiPlus className="w-4 h-4" />
                                    </motion.button>
                                </div>

                                {/* Remove Button */}
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={handleRemove}
                                    className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors duration-200 border border-red-200 group/remove"
                                    title="Remove item"
                                >
                                    <FiTrash2 className="w-4 h-4 group-hover/remove:scale-110 transition-transform duration-200" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                            <button className="text-xs text-gray-500 hover:text-purple-600 transition-colors duration-200 flex items-center gap-1">
                                <FiShoppingBag className="w-3 h-3" />
                                Save for later
                            </button>
                            <span className="text-gray-300">•</span>
                            <button className="text-xs text-gray-500 hover:text-purple-600 transition-colors duration-200">
                                Share product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Indicator */}
            <div className="px-4 md:px-6 pb-3">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                            item.quantity < 3 ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        <span className={`font-medium ${
                            item.quantity < 3 ? 'text-red-600' : 'text-green-600'
                        }`}>
                            {item.quantity < 3 ? 'Low stock' : 'In stock'}
                        </span>
                    </div>
                    <span className="text-gray-500">
                        Max: 10 units
                    </span>
                </div>
            </div>

            {/* Progress Bar for Quantity */}
            <div className="px-4 md:px-6 pb-4">
                <div className="w-full bg-gray-200 rounded-full h-1">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.quantity / 10) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-1 rounded-full ${
                            item.quantity >= 8 ? 'bg-red-500' : 
                            item.quantity >= 5 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                    />
                </div>
            </div>
        </motion.div>
    );
}
