import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiSearch, 
    FiFilter, 
    FiX, 
    FiDollarSign, 
    FiTag, 
    FiHeart,
    FiCoffee,
    FiStar,
    FiRefreshCw
} from 'react-icons/fi';

// Define the dietary and flavor tags for the filter
const DIETARY_TAGS = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Contains Nuts',
    'Egg-Free',
    'Sugar-Free'
];

const FLAVOR_TAGS = [
    'Chocolate',
    'Vanilla',
    'Red Velvet',
    'Fruit',
    'Carrot',
    'Lemon',
    'Coffee',
    'Cheesecake'
];

export default function ProductFilter({ categories, onFilter }) {
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        dietary: '',
        flavor: '',
        custom: '',
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeFilters, setActiveFilters] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = {
            ...filters,
            [name]: value,
        };
        setFilters(newFilters);
        
        // Count active filters
        const activeCount = Object.values(newFilters).filter(val => val !== '').length;
        setActiveFilters(activeCount);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            category: '',
            minPrice: '',
            maxPrice: '',
            search: '',
            dietary: '',
            flavor: '',
            custom: '',
        };
        setFilters(resetFilters);
        setActiveFilters(0);
        onFilter({});
        setIsExpanded(false);
    };

    const handleQuickApply = () => {
        onFilter(filters);
        setIsExpanded(false);
    };

    const FilterSection = ({ title, icon: Icon, children, className = '' }) => (
        <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${className}`}>
            <div className="flex items-center mb-3">
                <Icon className="text-white mr-2 text-lg" />
                <label className="text-white font-semibold text-sm">{title}</label>
            </div>
            {children}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl mb-6 overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FiFilter className="text-white text-2xl mr-3" />
                        <div>
                            <h3 className="text-xl font-bold text-white">Filter Products</h3>
                            <p className="text-purple-100 text-sm">
                                {activeFilters > 0 
                                    ? `${activeFilters} active filter${activeFilters > 1 ? 's' : ''}`
                                    : 'Refine your product search'
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {activeFilters > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-white text-purple-600 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center"
                            >
                                {activeFilters}
                            </motion.span>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-white hover:text-purple-100 transition-colors duration-200"
                        >
                            {isExpanded ? <FiX size={24} /> : <FiFilter size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="p-6 space-y-6"
                    >
                        {/* Search & Main Filters */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Search */}
                            <FilterSection title="Search Products" icon={FiSearch}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="search"
                                        value={filters.search}
                                        onChange={handleChange}
                                        placeholder="What are you looking for?"
                                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                                    />
                                    <FiSearch className="absolute right-3 top-3 text-white/70" />
                                </div>
                            </FilterSection>

                            {/* Category */}
                            <FilterSection title="Category" icon={FiTag}>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-800">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category} className="text-gray-800">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </FilterSection>

                            {/* Product Type */}
                            <FilterSection title="Product Type" icon={FiStar}>
                                <select
                                    name="custom"
                                    value={filters.custom}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-800">All Types</option>
                                    <option value="false" className="text-gray-800">Ready-made</option>
                                    <option value="true" className="text-gray-800">Custom Orders</option>
                                </select>
                            </FilterSection>
                        </div>

                        {/* Dietary & Flavor Tags */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Dietary Tags */}
                            <FilterSection title="Dietary Preferences" icon={FiHeart}>
                                <select
                                    name="dietary"
                                    value={filters.dietary}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-800">All Dietary</option>
                                    {DIETARY_TAGS.map((tag) => (
                                        <option key={tag} value={tag} className="text-gray-800">
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </FilterSection>

                            {/* Flavor Tags */}
                            <FilterSection title="Flavor Profile" icon={FiCoffee}>
                                <select
                                    name="flavor"
                                    value={filters.flavor}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                >
                                    <option value="" className="text-gray-800">All Flavors</option>
                                    {FLAVOR_TAGS.map((tag) => (
                                        <option key={tag} value={tag} className="text-gray-800">
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </FilterSection>
                        </div>

                        {/* Price Range */}
                        <FilterSection title="Price Range" icon={FiDollarSign} className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-purple-100 text-sm font-medium mb-2 block">Minimum Price (₦)</label>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-purple-100 text-sm font-medium mb-2 block">Maximum Price (₦)</label>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleChange}
                                        placeholder="10000"
                                        min="0"
                                        className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </FilterSection>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-white/20"
                        >
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex items-center justify-center bg-white/20 text-white py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold border border-white/30"
                            >
                                <FiRefreshCw className="mr-2" />
                                Clear All Filters
                            </button>
                            <button
                                type="submit"
                                onClick={handleQuickApply}
                                className="flex items-center justify-center bg-white text-purple-600 py-3 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold"
                            >
                                Apply Filters
                            </button>
                        </motion.div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Quick Filter Bar (when collapsed) */}
            {!isExpanded && activeFilters > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 py-4 bg-white/10 border-t border-white/20"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-purple-100 text-sm">
                                {activeFilters} filter{activeFilters > 1 ? 's' : ''} active
                            </span>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleReset}
                                className="text-purple-100 hover:text-white text-sm font-medium transition-colors duration-200"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="text-white hover:text-purple-100 text-sm font-medium transition-colors duration-200"
                            >
                                Edit Filters
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
