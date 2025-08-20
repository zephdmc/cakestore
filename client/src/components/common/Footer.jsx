import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaTiktok, FaPinterestP } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-10 text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">
                            <span className="text-purpleDark1 pr-2">Stefanos </span> Bakeshop
                        </h3>
                        <p className="text-purpleDark1  text-sm leading-relaxed">
                            Elevating beauty through premium aesthetic solutions. 
                            We deliver exceptional quality products with professional 
                            results you can trust.
                        </p>
                        
                        {/* Social Media */}
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-purpleDark1  hover:text-purpleLight transition-colors duration-300">
                                <FiFacebook size={20} />
                            </a>
                            <a href="#" className="text-purpleDark1  hover:text-purpleLight transition-colors duration-300">
                                <FiInstagram size={20} />
                            </a>
                            
                            <a href="#" className="text-purpleDark1  hover:text-purpleLight transition-colors duration-300">
                                <FaTiktok size={20} />
                            </a>
                           
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-purpleDark1 mb-6 pb-2 border-b border-purpleDark1 ">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><a href="/" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purpleLighter mr-2 rounded-full"></span> Home</a></li>
                            <li><a href="/products" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purpleLighter mr-2 rounded-full"></span> Products</a></li>
                            <li><a href="/about" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purpleLighter mr-2 rounded-full"></span> About Us</a></li>
                            <li><a href="/blog" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purpleLighter mr-2 rounded-full"></span> Blog</a></li>
                            <li><a href="/about" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purpleLighter mr-2 rounded-full"></span> FAQs</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg text-purpleDark1 font-semibold mb-6 pb-2 border-b border-purpleDark1">Customer Service</h4>
                        <ul className="space-y-3">
                            <li><a href="/contact" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purple-400 mr-2 rounded-full"></span> Contact Us</a></li>
                            <li><a href="/shipping" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purple-400 mr-2 rounded-full"></span> Shipping Policy</a></li>
                            <li><a href="/returns" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purple-400 mr-2 rounded-full"></span> Returns & Exchanges</a></li>
                            <li><a href="/privacy" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purple-400 mr-2 rounded-full"></span> Privacy Policy</a></li>
                            <li><a href="/terms" className="text-purpleDark1 hover:text-purple-400 transition-colors flex items-center">
                                <span className="w-1 h-1 bg-purple-400 mr-2 rounded-full"></span> Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-purpleDark1 mb-6 pb-2 border-b border-purpleDark1"> Contact Us </h4>
                        <ul className="space-y-4 text-purpleDark1" >
                            <li className="flex items-start">
                                <FiMapPin className="mt-1 mr-3 flex-shrink-0 text-white" />
                                <span>330 PH/Aba Express way Rumukwurushi Port Harcourt</span>
                            </li>
                            <li className="flex items-center">
                                <FiMail className="mr-3 text-white" />
                                <a href="mailto:bellebeauaesthetics001@gmail.com" className="hover:text-purple-400 transition-colors">
                                    stefanosbakeshop6@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center">
                                <FiPhone className="mr-3 text-white" />
                                <a href="tel:+2349014727839" className="hover:text-purple-400 transition-colors">
                                    +234 901 4727 839
                                </a>
                            </li>
                        </ul>

                        {/* Newsletter Subscription */}
                        <div className="mt-6">
                            <h5 className="text-sm font-medium mb-3">Subscribe to our newsletter</h5>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    className="px-4 py-2 w-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-l"
                                />
                                <button className="bg-purpleLighter hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium rounded-r transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="bg-gray-800 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-Dark text-sm mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} Bellebeau Aesthetics. All rights reserved.
                        </div>
                        
                        <div className="flex space-x-6">
{/*                             <img src="/images/payment/visa.svg" alt="Visa" className="h-6" />
                            <img src="/images/payment-methods/mastercard.svg" alt="Mastercard" className="h-6" />
                            <img src="/images/payment-methods/verve.svg" alt="Verve" className="h-6" />
                            <img src="/images/payment-methods/paypal.svg" alt="PayPal" className="h-6" /> */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
