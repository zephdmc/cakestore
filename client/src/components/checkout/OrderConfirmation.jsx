import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiShoppingBag, 
  FiClock, 
  FiDollarSign,
  FiCalendar,
  FiArrowRight,
  FiStar,
  FiShare2
} from 'react-icons/fi';
import { FaWhatsapp, FaRegCopy } from 'react-icons/fa';

// Create motion-wrapped components at the top level
const MotionLink = motion(Link);

const OrderConfirmation = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Track conversion in analytics
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: order.data.id,
        value: order.data.totalPrice,
        currency: 'NGN',
        items: order.data.items.map(item => ({
          item_id: item.productId,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });

    // Trigger celebration animation
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, [order]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.data.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Bellebeau Aesthetics Order',
        text: `I just placed an order with Bellebeau Aesthetics! Order #${order.data.id}`,
        url: window.location.href,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const confettiVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        {/* Celebration Confetti */}
        <AnimatePresence>
          {showAnimation && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={confettiVariants}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                delay: 0.5 
              }}
              className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30"
            >
              <FiCheck className="text-white text-3xl" />
            </motion.div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  Order Confirmed!
                </h1>
                {order.data.isCustomOrder && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30">
                    Custom Order
                  </span>
                )}
              </div>
              
              <p className="text-purple-100 text-lg mb-4">
                Thank you for your purchase! We're preparing your order with care.
              </p>

              {/* Order ID with Copy */}
              <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 max-w-xs mx-auto">
                <code className="text-white font-mono text-sm">
                  #{order.data.id}
                </code>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyOrderNumber}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  {copied ? <FiCheck className="text-green-300" /> : <FaRegCopy />}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            variants={itemVariants}
            className="p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Order Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiShoppingBag className="text-purple-500" />
                  Order Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="text-xl font-bold text-purple-600">
                      ₦{order.data.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-800">Flutterwave</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {new Date(order.data.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiClock className="text-pink-500" />
                  What's Next?
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order Processing</p>
                      <p className="text-sm text-gray-600">We'll prepare your items within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Shipping</p>
                      <p className="text-sm text-gray-600">Track your package with real-time updates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Delivery</p>
                      <p className="text-sm text-gray-600">Receive your skincare essentials</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MotionLink
                to={`/orders/${order.data.id}`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center"
              >
                View Order Details
                <FiArrowRight className="text-lg" />
              </MotionLink>
              
              <MotionLink
                to="/products"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-purple-200 text-purple-600 py-4 px-8 rounded-2xl font-semibold flex items-center gap-3 hover:bg-purple-50 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                Continue Shopping
                <FiStar className="text-lg" />
              </MotionLink>
            </motion.div>

            {/* Share Section */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-gray-200 text-center"
            >
              <p className="text-gray-600 mb-4">Love your purchase? Share the experience!</p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareOrder}
                  className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="text-xl" />
                </motion.button>
                
                {navigator.share && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareOrder}
                    className="bg-purple-500 text-white p-3 rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    <FiShare2 className="text-xl" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Support Card */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to assist you with any questions about your order.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="mailto:support@bellebeauaesthetics.com" 
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Email Support
              </a>
              <a 
                href="https://wa.me/your-number" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
