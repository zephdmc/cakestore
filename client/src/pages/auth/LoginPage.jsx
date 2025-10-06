import { motion } from 'framer-motion';
import Login from '../../components/auth/Login';
import { FiArrowLeft, FiShield, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function LoginPage() {
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
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-pink-700/90"></div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                    animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-10 w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm"
                />
                
                <motion.div
                    animate={{ 
                        y: [0, 30, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-1/3 right-20 w-8 h-8 bg-pink-400/30 rounded-full backdrop-blur-sm"
                />
                
                <motion.div
                    animate={{ 
                        y: [0, -15, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-40 left-1/4 w-4 h-4 bg-purple-300/40 rounded-full backdrop-blur-sm"
                />

                {/* Animated Gradient Orbs */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                />
                
                <motion.div
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.2, 0.4]
                    }}
                    transition={{ 
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
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
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 200, 
                                damping: 15,
                                delay: 0.2 
                            }}
                            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                            <FiHeart className="text-2xl text-white" />
                        </motion.div>
                        
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/70">
                            Sign in to your account to continue
                        </p>
                    </motion.div>

                    {/* Login Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-4 border-b border-white/20">
                            <h2 className="text-xl font-semibold text-white text-center">
                                Sign In to Your Account
                            </h2>
                        </div>

                        {/* Login Form */}
                        <div className="p-6 md:p-8">
                            <Login />
                        </div>

                        {/* Card Footer */}
                        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                                <FiShield className="text-green-400" />
                                <span>Your data is securely encrypted</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Additional Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center mt-6"
                    >
                        <p className="text-white/70">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300 hover:underline"
                            >
                                Create one here
                            </Link>
                        </p>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="grid grid-cols-3 gap-4 mt-8"
                    >
                        {[
                            { text: 'Secure', color: 'from-green-500 to-emerald-500' },
                            { text: 'Fast', color: 'from-blue-500 to-cyan-500' },
                            { text: 'Reliable', color: 'from-purple-500 to-pink-500' }
                        ].map((badge, index) => (
                            <motion.div
                                key={badge.text}
                                whileHover={{ scale: 1.05 }}
                                className={`bg-gradient-to-r ${badge.color} text-white text-center py-2 px-3 rounded-xl text-sm font-medium shadow-lg`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
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
                    className="w-full h-20"
                >
                    <path 
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25" 
                        className="fill-current text-purple-900/50"
                    ></path>
                    <path 
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5" 
                        className="fill-current text-purple-900/30"
                    ></path>
                    <path 
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        className="fill-current text-purple-900/20"
                    ></path>
                </svg>
            </div>
        </div>
    );
}
