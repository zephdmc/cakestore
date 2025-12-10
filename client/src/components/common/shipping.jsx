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
  FiHeart,
  FiCoffee,
  FiDroplet,
  FiGrid
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
const FeatureCard = ({ icon: Icon, title, items, color = "purple", productIcon }) => (
  <motion.div
    variants={itemVariants}
    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:shadow-md"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-lg flex items-center justify-center`}>
        <Icon className="text-white text-sm" />
      </div>
      {productIcon && (
        <div className="flex space-x-1">
          {productIcon}
        </div>
      )}
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

// Product Type Indicator
const ProductTypeIndicator = () => (
  <div className="flex flex-col items-center gap-4 mb-8">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
        <span className="text-sm text-gray-600">Crafted Cakes</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
        <span className="text-sm text-gray-600">Scented Candles</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-sm text-gray-600">Personalized Mugs</span>
      </div>
    </div>
  </div>
);

export default function ShippingPolicy() {
  const domesticFeatures = [
    { 
      icon: FiClock, 
      title: "Processing Time", 
      items: ["1-2 business days", "Cakes: Same-day processing", "Weekends excluded"], 
      color: "purple",
      productIcon: (
        <>
          <FiCoffee className="text-pink-500 text-xs" />
          <FiDroplet className="text-amber-500 text-xs" />
          <FiGrid className="text-blue-500 text-xs" />
        </>
      )
    },
    { 
      icon: FiTruck, 
      title: "Delivery Partners", 
      items: ["GIG Logistics", "DHL Express", "Local dispatch riders", "Special cake delivery"], 
      color: "blue",
      productIcon: (
        <>
          <span className="text-xs text-pink-500">🎂</span>
          <span className="text-xs text-amber-500">🕯️</span>
          <span className="text-xs text-blue-500">☕</span>
        </>
      )
    },
    { 
      icon: FiMapPin, 
      title: "Coverage Area", 
      items: ["All 36 states + FCT", "Priority areas: Lagos, PH, Abuja", "Nationwide service"], 
      color: "green",
      productIcon: (
        <>
          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        </>
      )
    }
  ];

  const deliveryTimes = [
    { area: "Port Harcourt", duration: "1-2 days", cakes: "Same/Next Day", color: "green" },
    { area: "Lagos, Abuja", duration: "2-3 days", cakes: "Next Day", color: "blue" },
    { area: "Major Cities", duration: "3-4 days", cakes: "2-3 Days", color: "purple" },
    { area: "Other Locations", duration: "4-7 days", cakes: "3-5 Days", color: "amber" }
  ];

  const productHandling = [
    { product: "Crafted Cakes", icon: "🎂", color: "pink", details: ["Special temperature control", "Handle with care", "Perishable - priority delivery"] },
    { product: "Scented Candles", icon: "🕯️", color: "amber", details: ["Fragile - bubble wrapped", "Upright position", "Avoid direct heat"] },
    { product: "Personalized Mugs", icon: "☕", color: "blue", details: ["Double boxed", "Shock-absorbent packaging", "Handle with care"] }
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
              Safe, fast delivery of your handcrafted cakes, candles, and mugs across Nigeria
            </p>
            
            {/* Product Type Indicator */}
            <div className="mt-6">
              <ProductTypeIndicator />
            </div>
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
            Welcome to <span className="font-semibold text-purple-600">Stefanos Bakeshop</span>! 
            We're committed to delivering your handcrafted cakes, luxury candles, and personalized mugs 
            with the utmost care, speed, and reliability. Please review our comprehensive shipping policy below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {domesticFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Product Handling Guidelines */}
        <PolicySection icon={FiPackage} title="Product Handling Guidelines">
          <p>
            Each product type requires special care during shipping to ensure it arrives in perfect condition:
          </p>
          
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {productHandling.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-b from-${item.color}-50 to-white rounded-xl p-5 border border-${item.color}-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{item.icon}</div>
                  <h4 className="font-semibold text-gray-800">{item.product}</h4>
                </div>
                <ul className="space-y-2">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 bg-${item.color}-400 rounded-full mr-3`}></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </PolicySection>

        {/* Domestic Shipping */}
        <PolicySection icon={FiMapPin} title="Shipping Within Nigeria">
          <p>
            We ship to all 36 states and the FCT via trusted courier partners including 
            <strong> GIG Logistics, DHL,</strong> and specialized delivery services for temperature-sensitive items.
          </p>
          
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-4">Delivery Time Estimates:</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Area</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Standard Delivery</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Cake Delivery*</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Service Level</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryTimes.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">{item.area}</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FiClock className={`text-${item.color}-500`} />
                          <span className={`text-${item.color}-700 font-medium`}>{item.duration}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FiCoffee className="text-pink-500" />
                          <span className="text-pink-700 font-medium">{item.cakes}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${item.color}-100 text-${item.color}-700`}>
                          {index === 0 ? 'Priority' : index === 1 ? 'Express' : 'Standard'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-3">*Cake delivery requires special handling and temperature control</p>
          </div>

          <div className="mt-6 space-y-3">
            <p><strong>Delivery Fee:</strong> Calculated at checkout based on location, product type, and selected service.</p>
            <p><strong>Order Tracking:</strong> Tracking number sent via email/WhatsApp. Monitor your package on our partner platforms.</p>
          </div>
        </PolicySection>

        {/* International Shipping */}
        <PolicySection icon={FiGlobe} title="International Shipping" delay={0.1}>
          <p>
            Currently, we focus on providing exceptional service within Nigeria to ensure product quality and freshness.
            We're actively working to expand our reach to other countries. Follow us for updates on international shipping!
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-sm">
              🌍 <strong>Coming Soon:</strong> International shipping for candles and mugs! (Cakes excluded due to perishable nature)
            </p>
          </div>
        </PolicySection>

        {/* Cash on Delivery */}
        <PolicySection icon={FaHandHoldingUsd} title="Payment & Cash on Delivery" delay={0.2}>
          <p>
            We offer multiple payment options for your convenience:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Online Payment</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bank transfer</li>
                <li>• Card payments</li>
                <li>• Instant order processing</li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Cash on Delivery</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Available for select locations</li>
                <li>• ₦2,000 minimum order</li>
                <li>• Exact change required</li>
              </ul>
            </div>
          </div>
        </PolicySection>

        {/* Store Pickup */}
        <PolicySection icon={FiHome} title="Store Pickup" delay={0.3}>
          <p>
            Located in Port Harcourt? Skip the delivery wait with our convenient store pickup option. 
            Perfect for cakes that need immediate pickup!
          </p>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiHome className="text-purple-600" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-1">Pickup Location</h5>
                <p className="text-sm text-gray-600">330 PH/Aba Express way, Rumukwurushi, Port Harcourt</p>
                <p className="text-xs text-gray-500 mt-1">Hours: 9 AM - 6 PM, Monday - Saturday</p>
              </div>
            </div>
          </div>
        </PolicySection>

        {/* Delivery Delays */}
        <PolicySection icon={FiAlertTriangle} title="Delivery Delays & Special Handling" delay={0.4}>
          <p>
            Certain circumstances may cause delays, especially for temperature-sensitive and fragile items:
          </p>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCoffee className="text-pink-600 text-sm" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-1">Cake Deliveries</h5>
                <p className="text-sm text-gray-600">Require temperature control and special handling. May be rescheduled during extreme weather.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiGrid className="text-blue-600 text-sm" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-1">Fragile Items</h5>
                <p className="text-sm text-gray-600">Additional care needed for candles and mugs. Delivery may be delayed for proper packaging.</p>
              </div>
            </div>
          </div>
        </PolicySection>

        {/* Order Support */}
        <PolicySection icon={FiPackage} title="Order Support & Inquiries" delay={0.5}>
          <p>
            Your satisfaction is our priority. For any delivery concerns, please contact us within 24 hours of receiving your order:
          </p>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FiMail className="text-white text-sm" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Email Support</div>
                  <div className="text-sm text-gray-600">support@stefanosbakeshop.com</div>
                  <div className="text-xs text-gray-500">Response within 2 hours</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <FiPhone className="text-white text-sm" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Phone/WhatsApp</div>
                  <div className="text-sm text-gray-600">+234 901 472 7839</div>
                  <div className="text-xs text-gray-500">Immediate assistance</div>
                </div>
              </div>
            </motion.div>
          </div>
        </PolicySection>

        {/* Closing Section */}
        <motion.section
          variants={itemVariants}
          className="text-center mt-16 py-12 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-3xl text-white"
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
            Thank You for Choosing Stefanos Bakeshop!
          </h3>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto leading-relaxed">
            We're dedicated to not just delivering products, but ensuring your crafted cakes, 
            luxury candles, and personalized mugs arrive perfectly, creating moments worth savoring.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <span className="text-xl">🎂</span>
            <span className="text-xl">🕯️</span>
            <span className="text-xl">☕</span>
          </div>
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
