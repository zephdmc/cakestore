import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';
import { FiCoffee, FiDroplet, FiGrid, FiHeart, FiAward, FiUsers, FiStar, FiCheck } from 'react-icons/fi';

const AboutPage = () => {
    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const faqs = [
        {
            question: "How far in advance should I order a custom cake?",
            answer: "We recommend ordering custom cakes at least 3-7 days in advance. For elaborate designs or large orders, please contact us 2 weeks ahead to ensure availability."
        },
        {
            question: "Do you offer delivery for all products?",
            answer: "Yes! We deliver cakes, candles, and mugs nationwide. Cakes require special temperature-controlled delivery within Port Harcourt and major cities. Delivery times vary by location."
        },
        {
            question: "Can I personalize my mug order?",
            answer: "Absolutely! Our mugs are fully customizable. You can add names, dates, photos, or special messages. Contact us via WhatsApp to discuss your personalization ideas."
        },
        {
            question: "What makes your candles special?",
            answer: "Our candles are hand-poured using premium soy wax, high-quality fragrance oils, and lead-free cotton wicks. Each candle is crafted to provide 40+ hours of clean, long-lasting burn."
        },
        {
            question: "Do you offer wedding cake services?",
            answer: "Yes! We specialize in custom wedding cakes. We offer consultations, tastings, and delivery services for weddings and special events."
        }
    ];

    const productTypes = [
        {
            icon: FiCoffee,
            title: "Crafted Cakes",
            description: "Custom themed cakes for every celebration, made with premium ingredients and artistic flair",
            color: "pink",
            features: ["Custom designs", "Fresh ingredients", "Delivery available", "Tastings available"]
        },
        {
            icon: FiDroplet,
            title: "Scented Candles",
            description: "Luxury candles with premium fragrances, perfect for relaxation and creating ambiance",
            color: "amber",
            features: ["40+ hour burn", "Soy wax", "Lead-free wicks", "Reusable jars"]
        },
        {
            icon: FiGrid,
            title: "Personalized Mugs",
            description: "Custom glass mugs for special moments, with high-quality personalization",
            color: "blue",
            features: ["Photo printing", "Text personalization", "Gift ready", "Microwave safe"]
        }
    ];

    const achievements = [
        { number: "500+", label: "Cakes Created", icon: "🎂" },
        { number: "1K+", label: "Happy Customers", icon: "😊" },
        { number: "100+", label: "Candle Scents", icon: "🕯️" },
        { number: "24/7", label: "Customer Support", icon: "💬" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                
                <div className="container mx-auto px-4 py-20 md:py-28 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Crafting Moments <span className="text-yellow-300">You Can Taste,</span> <br />Scent & Hold
                        </h1>
                        <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                            Where culinary artistry meets creative craftsmanship to create unforgettable experiences
                        </p>
                    </motion.div>

                    {/* Product Type Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-6 mt-8"
                    >
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <FiCoffee className="text-pink-300" />
                            <span className="text-white text-sm">Crafted Cakes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <FiDroplet className="text-amber-300" />
                            <span className="text-white text-sm">Scented Candles</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <FiGrid className="text-blue-300" />
                            <span className="text-white text-sm">Personalized Mugs</span>
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
            </section>

            {/* Our Story Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-5xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Story</span>
                        </motion.h2>

                        <motion.div variants={item} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mb-16 border-l-4 border-purple-500">
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                                At <span className="font-bold text-purple-600">Stefanos Bakeshop</span>, we believe that life's most precious moments 
                                deserve to be celebrated with exceptional creations. What began as a passion for baking has blossomed 
                                into a multi-faceted studio dedicated to crafting not just cakes, but complete sensory experiences.
                            </p>
                        </motion.div>

                        {/* Product Types */}
                        <motion.div variants={container} className="grid md:grid-cols-3 gap-8 mb-16">
                            {productTypes.map((product, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    whileHover={{ y: -10 }}
                                    className={`bg-gradient-to-br from-${product.color}-50 to-white p-8 rounded-2xl border border-${product.color}-100 text-center hover:shadow-xl transition-all duration-300`}
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-r from-${product.color}-500 to-${product.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                                        <product.icon className="text-white text-2xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{product.title}</h3>
                                    <p className="text-gray-600 mb-6">{product.description}</p>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center justify-center text-sm text-gray-600">
                                                <FiCheck className={`text-${product.color}-500 mr-2`} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Mission Statement */}
                        <motion.div variants={item} className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white p-8 md:p-12 rounded-2xl">
                            <div className="flex items-center justify-center mb-6">
                                <FiHeart className="text-2xl text-pink-200 mr-3" />
                                <h3 className="text-2xl font-bold">Our Mission</h3>
                            </div>
                            <p className="text-center text-purple-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                                To transform ordinary moments into extraordinary memories through handcrafted cakes, 
                                luxury candles, and personalized mugs that engage all your senses.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-6xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold text-center mb-12">
                            What <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Drives Us</span>
                        </motion.h2>

                        <motion.div variants={container} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <motion.div 
                                variants={item}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                                    <FiStar className="text-white text-lg" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Quality First</h3>
                                <p className="text-gray-600 text-sm">Premium ingredients and materials in every product</p>
                            </motion.div>

                            <motion.div 
                                variants={item}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                                    <FiAward className="text-white text-lg" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Artistic Excellence</h3>
                                <p className="text-gray-600 text-sm">Every product is a masterpiece of craftsmanship</p>
                            </motion.div>

                            <motion.div 
                                variants={item}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                                    <FiUsers className="text-white text-lg" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Customer Joy</h3>
                                <p className="text-gray-600 text-sm">Creating smiles and unforgettable experiences</p>
                            </motion.div>

                            <motion.div 
                                variants={item}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                                    <FiHeart className="text-white text-lg" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">Passion Driven</h3>
                                <p className="text-gray-600 text-sm">Made with love and attention to detail</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Achievements Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl text-center border border-purple-100"
                                >
                                    <div className="text-4xl mb-2">{achievement.icon}</div>
                                    <div className="text-3xl font-bold text-gray-800 mb-1">{achievement.number}</div>
                                    <div className="text-gray-600 text-sm">{achievement.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold text-center mb-6">
                            Frequently Asked Questions
                        </motion.h2>
                        <motion.p variants={item} className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                            Everything you need to know about Stefanos Bakeshop
                        </motion.p>

                        <motion.div variants={container} className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <details className="group">
                                        <summary className="list-none p-6 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition">
                                            <h3 className="font-semibold text-gray-900 text-left">{faq.question}</h3>
                                            <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="px-6 pb-6 pt-0 text-gray-600">
                                            {faq.answer}
                                        </div>
                                    </details>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold mb-6">
                            Let's Create Something Beautiful Together
                        </motion.h2>
                        <motion.p variants={item} className="text-purple-100 mb-12 max-w-2xl mx-auto text-lg">
                            Whether it's a custom cake, a relaxing candle, or a personalized mug, we're here to bring your vision to life.
                        </motion.p>

                        <motion.div variants={container} className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="https://wa.me/2349014727839"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 hover:bg-green-600 p-6 rounded-2xl flex flex-col items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <FaWhatsapp className="text-3xl mb-3" />
                                <span className="font-semibold">WhatsApp</span>
                                <span className="text-sm opacity-90 mt-1">Quick Response</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="mailto:support@stefanosbakeshop.com"
                                className="bg-pink-500 hover:bg-pink-600 p-6 rounded-2xl flex flex-col items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <FaEnvelope className="text-3xl mb-3" />
                                <span className="font-semibold">Email</span>
                                <span className="text-sm opacity-90 mt-1">support@stefanosbakeshop.com</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="tel:+2349014727839"
                                className="bg-blue-500 hover:bg-blue-600 p-6 rounded-2xl flex flex-col items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <FaPhone className="text-3xl mb-3" />
                                <span className="font-semibold">Call Us</span>
                                <span className="text-sm opacity-90 mt-1">+234 901 472 7839</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="https://instagram.com/stefanosbakeshop"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 p-6 rounded-2xl flex flex-col items-center transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <FaInstagram className="text-3xl mb-3" />
                                <span className="font-semibold">Instagram</span>
                                <span className="text-sm opacity-90 mt-1">@stefanosbakeshop</span>
                            </motion.a>
                        </motion.div>

                        {/* Location */}
                        <motion.div variants={item} className="mt-12">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                                <span>📍</span>
                                <span className="font-medium">Port Harcourt, Nigeria</span>
                            </div>
                            <p className="text-purple-100 mt-4 text-sm">
                                330 PH/Aba Express way, Rumukwurushi, Port Harcourt
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Decorative elements */}
            <div className="fixed top-1/4 left-5 w-3 h-3 bg-purple-300 rounded-full opacity-30 animate-bounce"></div>
            <div className="fixed bottom-1/3 right-10 w-2 h-2 bg-pink-300 rounded-full opacity-40 animate-pulse"></div>
        </div>
    );
};

export default AboutPage;
