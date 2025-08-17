import { motion } from 'framer-motion';
import { FaLeaf, FaFlask, FaHandsHelping, FaWhatsapp, FaTiktok, FaPhone, FaEnvelope } from 'react-icons/fa';

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
            question: "How long does delivery take?",
            answer: "Delivery typically takes 2-5 business days within Port Harcout and 3-7 business days for other states. We partner with reliable logistics providers to ensure timely delivery."
        },
        {
            question: "Do your products work for oily skin?",
            answer: "Absolutely! Our formulations are designed for all skin types, including oily skin. We recommend our Oil-Control Bundle which includes a balancing cleanser, niacinamide serum, and mattifying moisturizer."
        },
        {
            question: "Can I return a product?",
            answer: "Yes, we offer a 30-day satisfaction guarantee. Unused products in their original packaging can be returned for a full refund."
        },
        {
            question: "Do you ship nationwide?",
            answer: "Yes, we deliver to all 36 states in Nigeria. Shipping rates vary by location and are calculated at checkout."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="container mx-auto px-4 py-20 md:py-28 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                            Our <span className="text-pink-600">Story</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Where science meets nature to reveal your healthiest, most radiant skin
                        </p>
                    </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-pink-200 opacity-30 animate-float"></div>
                    <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-purple-200 opacity-30 animate-float animation-delay-2000"></div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-5xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold text-center mb-12">
                            At Bellebeau Aesthetics, we believe beauty starts with healthy skin.
                        </motion.h2>

                        <motion.div variants={container} className="grid md:grid-cols-3 gap-8 mb-16">
                            <motion.div variants={item} className="bg-pink-50 p-8 rounded-xl text-center">
                                <div className="flex justify-center text-pink-600 mb-4">
                                    <FaLeaf className="text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Natural Ingredients</h3>
                                <p className="text-gray-600">
                                    Rooted in nature, powered by science. We use clinically-proven botanicals from sustainable sources.
                                </p>
                            </motion.div>

                            <motion.div variants={item} className="bg-pink-50 p-8 rounded-xl text-center">
                                <div className="flex justify-center text-pink-600 mb-4">
                                    <FaFlask className="text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Science-Backed Formulas</h3>
                                <p className="text-gray-600">
                                    Each product is dermatologist-tested and formulated for Nigerian skin types and climates.
                                </p>
                            </motion.div>

                            <motion.div variants={item} className="bg-pink-50 p-8 rounded-xl text-center">
                                <div className="flex justify-center text-pink-600 mb-4">
                                    <FaHandsHelping className="text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Customer-Centric</h3>
                                <p className="text-gray-600">
                                    Founded on strong customer principles, we're committed to your skincare journey.
                                </p>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={item} className="bg-gray-900 text-white p-8 md:p-12 rounded-xl">
                            <h3 className="text-2xl font-serif font-bold mb-4 text-center">
                                Our Mission
                            </h3>
                            <p className="text-center text-gray-300 text-lg">
                                To provide affordable, effective skincare that delivers real results.
                                Every product is carefully curated for all skin types and climates,
                                because everyone deserves to feel confident in their skin.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Team/Values Section */}
            <section className="py-16 bg-pink-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold mb-6">
                            Our Core Values
                        </motion.h2>
                        <motion.p variants={item} className="text-gray-600 mb-12 max-w-2xl mx-auto">
                            The principles that guide every formulation and customer interaction
                        </motion.p>

                        <motion.div variants={container} className="grid md:grid-cols-2 gap-8 text-left">
                            {[
                                "Transparency in ingredients and pricing",
                                "Education through skincare consultations",
                                "Sustainable and ethical sourcing",
                                "Continuous product innovation",
                                "Inclusivity for all skin types and tones",
                                "Results you can see and feel"
                            ].map((value, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-white p-6 rounded-lg shadow-sm flex items-start"
                                >
                                    <div className="bg-pink-100 text-pink-600 p-2 rounded-full mr-4">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-gray-800">{value}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold text-center mb-6">
                            Frequently Asked Questions
                        </motion.h2>
                        <motion.p variants={item} className="text-gray-600 text-center mb-12">
                            Everything you need to know about Bellebeau Aesthetics
                        </motion.p>

                        <motion.div variants={container} className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    className="border border-gray-200 rounded-xl overflow-hidden"
                                >
                                    <details className="group">
                                        <summary className="list-none p-6 flex justify-between items-center cursor-pointer hover:bg-pink-50 transition">
                                            <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                            <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <section className="py-16 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={container}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.h2 variants={item} className="text-3xl font-serif font-bold mb-6">
                            Get In Touch
                        </motion.h2>
                        <motion.p variants={item} className="text-gray-300 mb-12 max-w-2xl mx-auto">
                            We'd love to hear from you! Reach out for product recommendations, skincare advice, or just to say hello.
                        </motion.p>

                        <motion.div variants={container} className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="https://wa.me/2349014727839"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 p-4 rounded-lg flex flex-col items-center transition"
                            >
                                <FaWhatsapp className="text-3xl mb-2" />
                                <span>WhatsApp</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="mailto:bellebeauesthetics001@gmail.com"
                                className="bg-pink-600 hover:bg-pink-700 p-4 rounded-lg flex flex-col items-center transition"
                            >
                                <FaEnvelope className="text-3xl mb-2" />
                                <span>Email Us</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="https://tiktok.com/@bellebeauaesthetics"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black hover:bg-gray-800 p-4 rounded-lg flex flex-col items-center transition"
                            >
                                <FaTiktok className="text-3xl mb-2" />
                                <span>TikTok</span>
                            </motion.a>

                            <motion.a
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                href="tel:+2349014727839"
                                className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg flex flex-col items-center transition"
                            >
                                <FaPhone className="text-3xl mb-2" />
                                <span>Call Us</span>
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
