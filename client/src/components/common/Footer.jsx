import React from 'react';
import { motion } from 'framer-motion';
import { 
    FiFacebook, 
    FiInstagram, 
    FiMail, 
    FiPhone, 
    FiMapPin,
    FiHeart,
    FiArrowUp,
    FiSend
} from 'react-icons/fi';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';

// Social Media Icons with Animation
const SocialIcon = ({ href, icon: Icon, delay = 0 }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        whileHover={{ 
            scale: 1.2, 
            y: -5,
            transition: { duration: 0.3 }
        }}
        transition={{ 
            duration: 0.6, 
            delay,
            type: "spring",
            stiffness: 200
        }}
        className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center text-white hover:text-purple-300 transition-all duration-300 hover:border-purple-400/50 hover:bg-white/20"
    >
        <Icon size={20} />
    </motion.a>
);

// Footer Link Component
const FooterLink = ({ href, children, delay = 0 }) => (
    <motion.li
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
    >
        <a 
            href={href} 
            className="text-white/80 hover:text-purple-300 transition-all duration-300 flex items-center group py-2"
        >
            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
            {children}
        </a>
    </motion.li>
);

// Contact Info Item
const ContactItem = ({ icon: Icon, children, delay = 0 }) => (
    <motion.li 
        className="flex items-start"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
    >
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0">
            <Icon className="text-white text-lg" />
        </div>
        <div className="text-white/80 leading-relaxed">{children}</div>
    </motion.li>
);

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Data arrays for better organization
    const quickLinks = [
        { href: '/', text: 'Home', delay: 0.2 },
        { href: '/products', text: 'Products', delay: 0.3 },
        { href: '/about', text: 'About Us', delay: 0.4 },
        { href: '/blog', text: 'Blog', delay: 0.5 },
        { href: '/faqs', text: 'FAQs', delay: 0.6 }
    ];

    const customerServiceLinks = [
        { href: '/contact', text: 'Contact Us', delay: 0.3 },
        { href: '/shipping', text: 'Shipping Policy', delay: 0.4 },
        { href: '/returns', text: 'Returns & Exchanges', delay: 0.5 },
        { href: '/privacy', text: 'Privacy Policy', delay: 0.6 },
        { href: '/terms', text: 'Terms of Service', delay: 0.7 }
    ];

    const socialLinks = [
        { href: '#', icon: FiFacebook, delay: 0.1 },
        { href: '#', icon: FiInstagram, delay: 0.2 },
        { href: '#', icon: FaTiktok, delay: 0.3 },
        { href: 'https://wa.me/+2349014727839', icon: FaWhatsapp, delay: 0.4 }
    ];

    // Handle newsletter submission
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Add your newsletter logic here
        console.log('Newsletter subscription');
    };

    return (
        <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <FiHeart className="text-white text-xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                Stefanos <span className="text-purple-300">Bakeshop</span>
                            </h3>
                        </div>
                        
                        <p className="text-white/70 text-sm leading-relaxed">
                            Crafting unforgettable moments through exquisite cakes and pastries. 
                            We deliver exceptional quality with the love and care that makes every 
                            celebration special.
                        </p>
                        
                        {/* Social Media */}
                        <motion.div 
                            className="flex gap-3 pt-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            {socialLinks.map((social, index) => (
                                <SocialIcon 
                                    key={`social-${index}`}
                                    href={social.href}
                                    icon={social.icon}
                                    delay={social.delay}
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-white/20">Quick Links</h4>
                        <ul className="space-y-1">
                            {quickLinks.map((link, index) => (
                                <FooterLink 
                                    key={`quick-${index}`}
                                    href={link.href}
                                    delay={link.delay}
                                >
                                    {link.text}
                                </FooterLink>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Customer Service */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-white/20">Customer Service</h4>
                        <ul className="space-y-1">
                            {customerServiceLinks.map((link, index) => (
                                <FooterLink 
                                    key={`service-${index}`}
                                    href={link.href}
                                    delay={link.delay}
                                >
                                    {link.text}
                                </FooterLink>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info & Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-white/20">Contact Us</h4>
                        <ul className="space-y-4 mb-6">
                            <ContactItem icon={FiMapPin} delay={0.4}>
                                330 PH/Aba Express way<br />
                                Rumukwurushi<br />
                                Port Harcourt
                            </ContactItem>
                            <ContactItem icon={FiMail} delay={0.5}>
                                <a 
                                    href="mailto:stefanosbakeshop6@gmail.com" 
                                    className="hover:text-purple-300 transition-colors duration-300"
                                >
                                    stefanosbakeshop6@gmail.com
                                </a>
                            </ContactItem>
                            <ContactItem icon={FiPhone} delay={0.6}>
                                <a 
                                    href="tel:+2349014727839" 
                                    className="hover:text-purple-300 transition-colors duration-300"
                                >
                                    +234 901 4727 839
                                </a>
                            </ContactItem>
                        </ul>

                        {/* Newsletter Subscription */}
                        <div className="mt-6">
                            <h5 className="text-sm font-medium text-white mb-3">Stay Updated</h5>
                            <motion.form 
                                className="flex"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                viewport={{ once: true }}
                                onSubmit={handleNewsletterSubmit}
                            >
                                <input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    className="px-4 py-3 w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-l-2xl text-sm transition-all duration-300"
                                    required
                                />
                                <motion.button 
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 text-sm font-medium rounded-r-2xl transition-all duration-300 flex items-center gap-2"
                                >
                                    <FiSend className="text-sm" />
                                </motion.button>
                            </motion.form>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 py-6 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        <motion.div 
                            className="text-white/70 text-sm text-center lg:text-left"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            &copy; {new Date().getFullYear()} Stefanos Bakeshop. Crafted with{' '}
                            <FiHeart className="inline text-red-400 mx-1" />{' '}
                            for sweet moments.
                        </motion.div>
                        
                        {/* Scroll to Top Button */}
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            aria-label="Scroll to top"
                        >
                            <FiArrowUp className="text-lg" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
                animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-20 left-10 w-4 h-4 bg-purple-300/30 rounded-full"
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
                    delay: 1
                }}
                className="absolute bottom-32 right-20 w-3 h-3 bg-pink-300/40 rounded-full"
            />
        </footer>
    );
}
