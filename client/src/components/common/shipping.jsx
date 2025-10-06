import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTruck, 
  FiMapPin, 
  FiClock, 
  FiPackage, 
  FiAlertTriangle,
  FiHome,
  FiGlobe,
  FiMail,
  FiPhone,
  FiHeart
} from 'react-icons/fi';
import { FaShippingFast, FaHandHoldingUsd } from 'react-icons/fa';

// Animation variants
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

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      duration: 0.8
    }
  }
};

// Policy Section Component
const PolicySection = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.section
    variants={itemVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
  >
    <div className="flex items-start gap-4 mb-4">
      <motion.div
        variants={iconVariants}
        className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
      >
        <Icon className="text-white text-lg" />
      </motion.div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
        {title}
      </h2>
    </div>
    <div className="text-gray-600 leading-relaxed space-y-3">
      {children}
    </div>
  </motion.section>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, items, color = "purple" }) => (
  <motion.div
    variants={itemVariants}
    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-200 transition-all duration-300"
  >
    <div className={`w-10 h-10 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-lg flex items-center justify-center mb-4`}>
      <Icon className="text-white text-sm" />
    </div>
    <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center text-sm text-gray-600">
          <div className={`w-1.5 h-1.5 bg-${color}-400 rounded-full mr-3`}></div>
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

export default function ShippingPolicy() {
  const domesticFeatures = [
    { icon: FiClock, title: "Processing Time", items: ["1-2 business days", "Excludes weekends & holidays"] },
    { icon: FiTruck, title: "Delivery Partners", items: ["GIG Logistics", "DHL", "Local dispatch"] },
    { icon: FiMapPin, title: "Coverage", items: ["All 36 states + FCT", "Nationwide service"] }
  ];

  const deliveryTimes = [
    { area: "Port Harcourt", duration: "1-2 business days", color: "green" },
    { area: "Major Cities", duration: "2-4 business days", color: "blue" },
    { area: "Other Locations", duration: "3-7 business days", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
              <FaShippingFast className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Shipping Policy
            </h1>
            <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Fast, reliable delivery of your skincare essentials across Nigeria
            </p>
          </motion.div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
          </svg>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 -mt-8 relative z-10"
      >
        {/* Introduction */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to <span className="font-semibold text-purple-600">Bellebeau Aesthetics</span>! 
            We're committed to delivering your skincare essentials quickly, safely, and reliably. 
            Please review our comprehensive shipping policy below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {domesticFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Domestic Shipping */}
        <PolicySection icon={FiMapPin} title="Shipping Within Nigeria">
          <p>
            We ship to all 36 states and the FCT via trusted courier partners including 
            <strong> GIG Logistics, DHL,</strong> and local dispatch riders for optimal coverage and reliability.
          </p>
          
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Delivery Time Estimates:</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {deliveryTimes.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border border-${item.color}-200 rounded-xl p-4 text-center`}
                >
                  <div className={`text-${item.color}-600 font-bold text-lg mb-1`}>{item.area}</div>
                  <div className={`text-${item.color}-700 font-semibold`}>{item.duration}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p><strong>Delivery Fee:</strong> Calculated at checkout based on your location and selected courier service.</p>
            <p><strong>Order Tracking:</strong> Tracking number sent via email/WhatsApp once shipped. Monitor your package on the courier's platform.</p>
          </div>
        </PolicySection>

        {/* International Shipping */}
        <PolicySection icon={FiGlobe} title="International Shipping" delay={0.1}>
          <p>
            Currently, we focus on providing exceptional service within Nigeria. 
            International shipping is not available at this time, but we're actively working 
            to expand our reach. Follow us for updates on global availability!
          </p>
        </PolicySection>

        {/* Cash on Delivery */}
        <PolicySection icon={FaHandHoldingUsd} title="Cash on Delivery (COD)" delay={0.2}>
          <p>
            COD is available for customers within Port Harcourt on selected items. 
            To ensure smooth delivery:
          </p>
          <ul className="space-y-2 mt-3">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Provide complete and accurate delivery address
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Ensure your phone number is active and reachable
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Have exact payment ready for the delivery agent
            </li>
          </ul>
        </PolicySection>

        {/* Store Pickup */}
        <PolicySection icon={FiHome} title="Store Pickup" delay={0.3}>
          <p>
            Located in Port Harcourt? Skip the delivery wait with our convenient store pickup option. 
            Your order will be ready within 24 hours, and we'll notify you as soon as it's available.
          </p>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-purple-700 text-sm">
              💡 <strong>Pro Tip:</strong> Store pickup is perfect for last-minute needs and lets you consult with our skincare experts!
            </p>
          </div>
        </PolicySection>

        {/* Delivery Delays */}
        <PolicySection icon={FiAlertTriangle} title="Delivery Delays" delay={0.4}>
          <p>
            While we strive for timely delivery, certain circumstances may cause delays beyond our control:
          </p>
          <ul className="space-y-2 mt-3">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
              Adverse weather conditions affecting transportation
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
              Courier service disruptions or logistical challenges
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
              Incorrect or incomplete shipping information provided
            </li>
          </ul>
        </PolicySection>

        {/* Order Support */}
        <PolicySection icon={FiPackage} title="Order Support & Inquiries" delay={0.5}>
          <p>
            Your satisfaction is our priority. For any delivery concerns, please contact us within 24 hours of receiving your order:
          </p>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiMail className="text-white text-sm" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Email Support</div>
                  <div className="text-sm text-gray-600">Quick response</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FiPhone className="text-white text-sm" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Phone/WhatsApp</div>
                  <div className="text-sm text-gray-600">Immediate assistance</div>
                </div>
              </div>
            </motion.div>
          </div>
        </PolicySection>

        {/* Closing Section */}
        <motion.section
          variants={itemVariants}
          className="text-center mt-16 py-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl text-white"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <FiHeart className="text-2xl text-pink-200" />
          </motion.div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Thank You for Choosing Bellebeau Aesthetics!
          </h3>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Your trust means everything to us. We're dedicated to not just delivering products, 
            but ensuring your journey to glowing skin is smooth and exceptional.
          </p>
        </motion.section>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-1/4 left-5 w-3 h-3 bg-purple-300 rounded-full opacity-30"
      />
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="fixed top-1/3 right-10 w-2 h-2 bg-pink-300 rounded-full opacity-40"
      />
    </div>
  );
}
