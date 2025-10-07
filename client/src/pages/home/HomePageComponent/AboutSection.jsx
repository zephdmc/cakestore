import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiUsers, FiHeart, FiCoffee, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AboutSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);

  const aboutContent = {
    title: "Our Sweet Story",
    description: "Founded with passion and a love for exceptional baking, our cake shop has been creating unforgettable moments since 2015. Every cake tells a story, and we're honored to be part of yours.",
    features: [
      { icon: FiAward, text: "Award Winning Recipes", count: "50+" },
      { icon: FiUsers, text: "Happy Customers", count: "10,000+" },
      { icon: FiHeart, text: "Custom Creations", count: "5,000+" },
      { icon: FiCoffee, text: "Years of Excellence", count: "8+" }
    ]
  };

  const imageSlides = [
    {
      id: 1,
      rows: [
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80",
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        "https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=986&q=80"
      ]
    },
    {
      id: 2,
      rows: [
        "https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80",
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
      ]
    },
    {
      id: 3,
      rows: [
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1065&q=80",
        "https://images.unsplash.com/photo-1542826438-bd32f43d626f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1092&q=80",
        "https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=986&q=80"
      ]
    }
  ];

  useEffect(() => {
    startSlideShow();
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, []);

  const startSlideShow = () => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageSlides.length);
    }, 5000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % imageSlides.length);
    resetInterval();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + imageSlides.length) % imageSlides.length);
    resetInterval();
  };

  const resetInterval = () => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    startSlideShow();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetInterval();
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
      {/* Static Background Image with Overlay - Contained within section */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* About Us Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/20"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {aboutContent.title}
              </h2>
              
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                {aboutContent.description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-8">
                {aboutContent.features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="text-white text-xl" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base mb-1">
                        {feature.text}
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {feature.count}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center lg:justify-start mx-auto lg:mx-0"
              >
                <FiStar className="mr-3" />
                Discover Our Story
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image Gallery Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 overflow-hidden">
              
              {/* Slideshow Container */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    {/* Three Row Layout */}
                    <div className="grid grid-rows-3 gap-4 h-full">
                      {imageSlides[currentSlide].rows.map((image, rowIndex) => (
                        <motion.div
                          key={rowIndex}
                          initial={{ opacity: 0, x: 50 * (rowIndex + 1) }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: rowIndex * 0.2, duration: 0.6 }}
                          className="relative rounded-xl overflow-hidden group"
                        >
                          <img
                            src={image}
                            alt={`Gallery image ${rowIndex + 1}`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 z-20"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 z-20"
                >
                  <FiChevronRight size={20} />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {imageSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Gallery Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mt-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Our Sweet Creations
                </h3>
                <p className="text-gray-600">
                  A glimpse into our delicious world of cakes and pastries
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements for Decoration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="flex justify-center space-x-4">
            {[FiStar, FiHeart, FiCoffee].map((Icon, index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
                className="text-white/80 text-2xl"
              >
                <Icon />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
