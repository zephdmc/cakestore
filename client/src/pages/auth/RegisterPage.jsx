import { motion } from 'framer-motion';
import Register from '../../components/auth/Register';
import { FiArrowLeft, FiUserPlus, FiShield, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
    const benefits = [
        'Exclusive Offers',
        'Fast Checkout', 
        'Order Tracking',
        'Wishlist Save'
    ];

    const trustBadges = [
        { text: 'Secure', color: 'from-green-500 to-emerald-500' },
        { text: 'Instant', color: 'from-blue-500 to-cyan-500' },
        { text: 'Free', color: 'from-purple-500 to-pink-500' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Main Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                    <img 
                        src="/images/hero1.jpeg"
                        alt="Beautiful Cakes Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/85 to-pink-700/90"></div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                    animate={{ 
                        y: [0, -25, 0],
                        rotate: [0, 8, 0]
                    }}
                    transition={{ 
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-12 w-8 h-8 bg-white/25 rounded-full backdrop-blur-sm"
                />
                
                <motion.div
                    animate={{ 
                        y: [0, 35, 0],
                        rotate: [0, -8, 0]
                    }}
                    transition={{ 
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                    }}
                    className="absolute top-2/3 right-16 w-6 h-6 bg-pink-400/35 rounded-full backdrop-blur-sm"
                />
                
                <motion.div
                    animate={{ 
                        y: [0, -20, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8
                    }}
                    className="absolute bottom-1/3 left-20 w-5 h-5 bg-purple-300/45 rounded-full backdrop-blur-sm"
                />

                {/* Animated Gradient Orbs */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ 
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl"
                />
                
                <motion.div
                    animate={{ 
                        scale: [1.3, 1, 1.3],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                        duration: 11,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-500/25 rounded-full blur-3xl"
                />

                {/* Central Glow Effect */}
                <motion.div
                    animate={{ 
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"
                />
            </div>

            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 left-6 z-20"
            >
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
                >
                    <FiArrowLeft className="text-sm" />
                    Back to Home
                </Link>
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 200, 
                                damping: 15,
                                delay: 0.2 
                            }}
                            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <FiUserPlus className="text-2xl text-white" />
                        </motion.div>
                        
                        <h1 className="text-3xl font-bold text-white mb-3">
                            Join Our Community
                        </h1>
                        <p className="text-white/70 text-lg">
                            Create your account and start your sweet journey
                        </p>
                    </motion.div>

                    {/* Benefits List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-2 gap-3 mb-6"
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="flex items-center gap-2 text-white/80 text-sm"
                            >
                                <FiCheckCircle className="text-green-400 text-sm flex-shrink-0" />
                                <span>{benefit}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Register Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-5 border-b border-white/20">
                            <h2 className="text-xl font-semibold text-white text-center">
                                Create Your Account
                            </h2>
                        </div>

                        {/* Register Form */}
                        <div className="p-6 md:p-8">
                            <Register />
                        </div>

                        {/* Card Footer */}
                        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                                <FiShield className="text-green-400" />
                                <span>Secure registration & data protection</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Additional Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="text-center mt-6"
                    >
                        <p className="text-white/70">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300 hover:underline"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="grid grid-cols-3 gap-4 mt-8"
                    >
                        {trustBadges.map((badge, index) => (
                            <motion.div
                                key={badge.text}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className={`bg-gradient-to-r ${badge.color} text-white text-center py-2 px-3 rounded-xl text-sm font-medium shadow-lg backdrop-blur-sm`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.1 + index * 0.1 }}
                            >
                                {badge.text}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom Wave Decoration */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
                <svg 
                    viewBox="0 0 1200 120" 
                    preserveAspectRatio="none" 
                    className="w-full h-24"
                >
                    <path 
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".3" 
                        className="fill-current text-purple-900/60"
                    />
                    <path 
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".4" 
                        className="fill-current text-purple-800/40"
                    />
                    <path 
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        className="fill-current text-purple-700/30"
                    />
                </svg>
            </div>
        </div>
    );
}
