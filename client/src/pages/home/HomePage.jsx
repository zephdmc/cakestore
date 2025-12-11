import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../../context/ProductContext'; // Added this
import TestimonialSlider from '../../pages/home/HomePageComponent/TestimonialSlider';
import AboutSection from '../../pages/home/HomePageComponent/AboutSection';
import { 
  FiHeart, 
  FiAward, 
  FiLoader, 
  FiAlertTriangle, 
  FiShoppingBag, 
  FiArrowRight, 
  FiStar,
  FiCoffee,
  FiDroplet,
  FiGrid
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CustomCakeForm from '../../components/orders/CustomCakeForm';
import { PRODUCT_TYPES, PRODUCT_TYPE_LABELS } from '../../utils/productTypes';

// Enhanced ImageSlideShow Component with all product types
const ImageSlideShow = ({ isMobile = false }) => {
  const images = [
   
 
  {
    src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    type: PRODUCT_TYPES.CAKE,
    label: "Custom Cakes"
  },
  {
    src: "https://images.unsplash.com/photo-1545243421-89e5c9b6d12a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    type: PRODUCT_TYPES.CANDLE,
    label: "Scented Candles"
  },
  {
    src: "/images/hero-collection.png",
    type: PRODUCT_TYPES.MUG,
    label: "Personalized Mugs"
  }
,
    { src: "/images/hero-collection.png", type: "all", label: "Our Collection" }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ 
            opacity: 0, 
            scale: 1.1,
            y: -20,
            zIndex: images.length - index
          }}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.1,
            y: index === currentIndex ? 0 : -30,
            zIndex: index === currentIndex ? images.length : images.length - index
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            opacity: { duration: 0.5 }
          }}
          style={{
            transformOrigin: "center center",
          }}
        >
          <img 
            src={image.src} 
            alt={image.label}
            className={`w-full h-full object-cover ${isMobile ? '' : 'rounded-3xl'}`}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl"></div>
          
          {/* Image label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              y: index === currentIndex ? 0 : 20
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl"
          >
            <p className="text-sm font-medium">{image.label}</p>
          </motion.div>
        </motion.div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Product Type Card Component
const ProductTypeCard = ({ type, icon: Icon, title, description, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ 
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 }
    }}
    className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 h-full"
  >
    <div className="relative z-10 h-full flex flex-col">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-white text-xl" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed flex-grow">{description}</p>
      <motion.div
        whileHover={{ x: 5 }}
        className="mt-4 inline-flex items-center text-white/70 group-hover:text-white text-sm font-medium"
      >
        Explore {title}
        <FiArrowRight className="ml-2" />
      </motion.div>
    </div>
    {/* Background glow effect */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace('to-br', 'to')}/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
  </motion.div>
);

// Product Card Component for Homepage
const HomeProductCard = ({ product }) => {
  const getProductTypeColor = (type) => {
    switch (type) {
      case PRODUCT_TYPES.CAKE:
        return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case PRODUCT_TYPES.CANDLE:
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case PRODUCT_TYPES.MUG:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 h-full flex flex-col">
        {/* Product Type Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getProductTypeColor(product.productType)}`}>
            {PRODUCT_TYPE_LABELS[product.productType] || 'Product'}
          </div>
        </div>
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 transform -rotate-6 shadow-lg">
            {product.discountPercentage}% OFF
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative pt-[100%] bg-gradient-to-br from-purple-400/10 to-pink-400/10 overflow-hidden">
          <img 
            src={product.images?.[0] || product.images || '/placeholder-product.png'} 
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '/placeholder-product.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        {/* Product Info */}
        <div className="p-4 md:p-5 flex-grow flex flex-col">
          {/* Category Tag */}
          <div className="mb-2">
            <span className="inline-block bg-white/20 text-white/80 text-xs px-2 py-1 rounded-full">
              {product.category || 'Uncategorized'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-white text-sm md:text-base mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-auto">
            {product.discountPercentage > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/60 text-xs line-through">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="text-white font-bold text-base md:text-lg bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  ₦{Math.round(product.price * (1 - product.discountPercentage/100)).toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-white font-bold text-base md:text-lg">
                ₦{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Quick Shop Section Component
const QuickShopSection = () => {
  const productTypes = [
    {
      type: PRODUCT_TYPES.CAKE,
      icon: FiCoffee,
      title: 'Crafted Cakes',
      description: 'Custom themed cakes for every celebration',
      gradient: 'from-pink-500 to-rose-500',
      link: '/products?type=cake'
    },
    {
      type: PRODUCT_TYPES.CANDLE,
      icon: FiDroplet,
      title: 'Scented Candles',
      description: 'Luxury candles for relaxation and ambiance',
      gradient: 'from-amber-500 to-orange-500',
      link: '/products?type=candle'
    },
    {
      type: PRODUCT_TYPES.MUG,
      icon: FiGrid,
      title: 'Personalized Mugs',
      description: 'Custom glass mugs for special moments',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/products?type=mug'
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop By Category
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover our handcrafted collection of cakes, candles, and mugs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productTypes.map((item, index) => (
            <Link key={item.type} to={item.link}>
              <ProductTypeCard
                type={item.type}
                icon={item.icon}
                title={item.title}
                description={item.description}
                gradient={item.gradient}
                delay={index * 0.1}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section Component

export default function HomePage() {
    const { 
        products, 
        loading, 
        error, 
        getFeaturedProducts,
        stats 
    } = useProducts(); // Using ProductContext instead
    
    const [showCustomOrderForm, setShowCustomOrderForm] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.isAdmin;

    // Get featured products
    const featuredProducts = getFeaturedProducts(8);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const handleCustomOrderSubmit = async (orderData) => {
        if (!currentUser) {
            console.error("User is not authenticated. Cannot create order.");
            alert("Your session has expired. Please log in again.");
            navigate('/login');
            return;
        }

        try {
            navigate('/checkout', {
                state: {
                    customOrderData: orderData,
                    isCustomOrder: true
                }
            });
            setShowCustomOrderForm(false);
        } catch (error) {
            console.error("Error preparing custom order: ", error);
            alert("There was an error preparing your order. Please try again.");
        }
    };

    const handleCustomOrderClick = (e) => {
        e.preventDefault();
        if (!currentUser) {
            navigate('/login', { state: { from: '/', message: 'Please login to place a custom order' } });
        } else {
            setShowCustomOrderForm(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
            {/* Admin Button */}
            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed top-6 right-6 z-50"
                >
                    <Link
                        to="/admin"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-300 shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-white/20"
                    >
                        Admin Panel
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            )}

            {/* Enhanced Hero Section */}
            <section className="relative overflow-hidden min-h-[90vh] flex items-center px-4">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center lg:text-left"
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 lg:mb-6 leading-tight"
                            >
                                Crafting Moments{' '}
                                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                    You Can Taste,
                                </span>{' '}
                                Scent & Hold
                            </motion.h1>
                            
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="text-lg text-white/80 mb-8 max-w-2xl"
                            >
                                Discover our handcrafted collection of themed cakes, luxury scented candles, and personalized glass mugs for every occasion.
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/products"
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-2xl text-center backdrop-blur-sm border border-white/20 block text-sm sm:text-base"
                                    >
                                        Shop Collection
                                    </Link>
                                </motion.div>
                                
                                <motion.button
                                    onClick={handleCustomOrderClick}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white/10 hover:bg-white/20 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 shadow-2xl text-center backdrop-blur-sm border border-white/20 text-sm sm:text-base"
                                >
                                    Custom Cake Order
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Image Slideshow */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative"
                        >
                            <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                                <ImageSlideShow />
                            </div>
                            
                            {/* Floating elements */}
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
                                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl"
                            >
                                <FiStar className="text-yellow-300 text-xl sm:text-2xl" />
                            </motion.div>
                            
                            <motion.div
                                animate={{ 
                                    y: [0, 20, 0],
                                    rotate: [0, -5, 0]
                                }}
                                transition={{ 
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                }}
                                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl"
                            >
                                <FiHeart className="text-pink-300 text-xl sm:text-2xl" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quick Shop Section */}
            <QuickShopSection />

            {/* Stats Section */}
      

            {/* Enhanced Featured Products Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-purple-900/50 to-purple-800/30">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div
                            variants={itemVariants}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                                Featured Products
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-block ml-4"
                                >
                                    <FiStar className="inline text-yellow-400" />
                                </motion.div>
                            </h2>
                            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                                Handpicked selection of our best cakes, candles, and mugs
                                <FiAward className="inline text-yellow-400 ml-2" />
                            </p>
                        </motion.div>

                        {loading ? (
                            <motion.div variants={itemVariants} className="text-center py-20">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="inline-block mb-4"
                                >
                                    <FiLoader className="text-4xl text-purple-300" />
                                </motion.div>
                                <p className="text-white/80 text-lg">Loading featured products...</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div variants={itemVariants} className="text-center py-12">
                                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 max-w-md mx-auto">
                                    <FiAlertTriangle className="text-3xl text-red-400 mx-auto mb-3" />
                                    <p className="text-white">{error}</p>
                                </div>
                            </motion.div>
                        ) : featuredProducts.length > 0 ? (
                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                            >
                                {featuredProducts.map((product, index) => (
                                    <motion.div
                                        key={product?.id || index}
                                        variants={itemVariants}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                        whileHover={{ 
                                            y: -8,
                                            scale: 1.02,
                                            transition: { duration: 0.3 }
                                        }}
                                        className="group"
                                    >
                                        <HomeProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div variants={itemVariants} className="text-center py-12">
                                <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-8 max-w-md mx-auto">
                                    <FiShoppingBag className="text-4xl text-purple-300 mx-auto mb-3" />
                                    <h3 className="text-xl font-semibold text-white mb-2">No Featured Products Yet</h3>
                                    <p className="text-white/80">Check back soon for our featured collection!</p>
                                </div>
                            </motion.div>
                        )}

                        {/* View All Products Button */}
                        <motion.div 
                            variants={itemVariants} 
                            className="text-center mt-12 md:mt-16"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/products"
                                className="group inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 md:px-10 rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-sm border border-white/20"
                            >
                                View All Products
                                <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* About Section - Updated to include all product types */}
            <AboutSection />

            {/* Enhanced Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="container mx-auto max-w-7xl px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-purple-900 mb-6">What Our Customers Say</h2>
                        <p className="text-xl text-purple-700 max-w-2xl mx-auto">
                            Hear from customers who love our cakes, candles, and mugs
                        </p>
                    </motion.div>

                    <TestimonialSlider />
                </div>
            </section>

            {/* Enhanced WhatsApp Button */}
            <motion.div
                drag
                dragConstraints={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 z-50 cursor-grab active:cursor-grabbing"
            >
                <motion.a
                    href="https://wa.me/+2349014727839"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
                    whileHover={{ 
                        boxShadow: "0 20px 40px rgba(72, 187, 120, 0.4)"
                    }}
                >
                    <FaWhatsapp size={28} />
                </motion.a>
            </motion.div>

            {/* Modals */}
            {showCustomOrderForm && (
                <CustomCakeForm 
                    onClose={() => setShowCustomOrderForm(false)} 
                    onSubmit={handleCustomOrderSubmit}
                />
            )}
        </div>
    );
}
