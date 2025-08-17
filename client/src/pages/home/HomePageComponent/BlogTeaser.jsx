import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BlogTeaser({ title, excerpt, link, image }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
            <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/3">
                    <img
                        className="h-48 w-full object-cover md:h-full"
                        src={image}
                        alt="Blog post teaser"
                    />
                </div>
                <div className="p-8 md:w-2/3">
                    <div className="uppercase tracking-wide text-sm text-pink-600 font-semibold mb-1">Beauty Tips</div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="mt-2 text-gray-600">{excerpt}</p>
                    <div className="mt-4">
                        <Link
                            to={link}
                            className="text-pink-600 hover:text-pink-800 font-medium inline-flex items-center"
                        >
                            Read more
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}