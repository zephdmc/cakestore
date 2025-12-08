import { useState, useEffect } from 'react';
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
  FiRefreshCw,
  FiDroplet,
  FiGrid,
  FiClock,
  FiRuler,
  FiShield,
  FiLayers
} from 'react-icons/fi';

import { 
  PRODUCT_TYPES, 
  PRODUCT_TYPE_LABELS,
  PRODUCT_CATEGORIES 
} from '../../utils/productTypes';

// Filter options for each product type
const DIETARY_TAGS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
  'Nut-Free', 'Egg-Free', 'Sugar-Free', 'Organic'
];

const FLAVOR_TAGS = [
  'Chocolate', 'Vanilla', 'Red Velvet', 'Fruit', 
  'Carrot', 'Lemon', 'Coffee', 'Cheesecake', 'Butterscotch'
];

const SCENT_TAGS = [
  'Lavender', 'Vanilla', 'Cinnamon', 'Citrus',
  'Sandalwood', 'Rose', 'Jasmine', 'Ocean Breeze',
  'Fresh Linen', 'Bergamot', 'Patchouli', 'Eucalyptus'
];

const WAX_TYPES = [
  'Soy Wax', 'Beeswax', 'Paraffin Wax', 'Coconut Wax',
  'Palm Wax', 'Rapeseed Wax', 'Gel Wax', 'Blended Wax'
];

const MATERIAL_OPTIONS = [
  'Ceramic', 'Glass', 'Porcelain', 'Stainless Steel',
  'Stoneware', 'Bamboo', 'Enamel', 'Plastic-Free'
];

const DESIGN_TYPES = [
  'Personalized Text', 'Photo Print', 'Digital Design',
  'Hand Painted', 'Vinyl Decal', 'Engraved', 'Glitter',
  'Color Changing', 'Seasonal Design'
];

export default function ProductFilter({ categories, onFilter }) {
  const [filters, setFilters] = useState({
    productType: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    // Cake filters
    dietary: '',
    flavor: '',
    size: '',
    custom: '',
    // Candle filters
    scent: '',
    waxType: '',
    burnTimeMin: '',
    burnTimeMax: '',
    // Mug filters
    material: '',
    designType: '',
    capacity: '',
    dishwasherSafe: '',
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Update active filters count when filters change
  useEffect(() => {
    const count = Object.entries(filters).filter(([key, value]) => {
      if (key === 'search' && value) return true;
      if (value !== '' && value !== undefined && value !== null) {
        // Don't count empty strings for number inputs
        if (['minPrice', 'maxPrice', 'burnTimeMin', 'burnTimeMax'].includes(key)) {
          return value !== '' && !isNaN(value);
        }
        return true;
      }
      return false;
    }).length;
    
    setActiveFilters(count);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;
    const newFilters = {
      ...filters,
      [name]: newValue,
    };
    
    // Reset dependent filters when product type changes
    if (name === 'productType' && value !== filters.productType) {
      // Reset type-specific filters
      if (value === PRODUCT_TYPES.CAKE) {
        newFilters.scent = '';
        newFilters.waxType = '';
        newFilters.burnTimeMin = '';
        newFilters.burnTimeMax = '';
        newFilters.material = '';
        newFilters.designType = '';
        newFilters.capacity = '';
        newFilters.dishwasherSafe = '';
      } else if (value === PRODUCT_TYPES.CANDLE) {
        newFilters.dietary = '';
        newFilters.flavor = '';
        newFilters.size = '';
        newFilters.custom = '';
        newFilters.material = '';
        newFilters.designType = '';
        newFilters.capacity = '';
        newFilters.dishwasherSafe = '';
      } else if (value === PRODUCT_TYPES.MUG) {
        newFilters.dietary = '';
        newFilters.flavor = '';
        newFilters.size = '';
        newFilters.custom = '';
        newFilters.scent = '';
        newFilters.waxType = '';
        newFilters.burnTimeMin = '';
        newFilters.burnTimeMax = '';
      }
    }
    
    setFilters(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean up empty filters before sending
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (['search', 'productType', 'category', 'custom', 'dishwasherSafe'].includes(key)) {
          return value !== '' && value !== undefined;
        }
        return value !== '' && value !== undefined && value !== null;
      })
    );
    onFilter(cleanedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      productType: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      dietary: '',
      flavor: '',
      size: '',
      custom: '',
      scent: '',
      waxType: '',
      burnTimeMin: '',
      burnTimeMax: '',
      material: '',
      designType: '',
      capacity: '',
      dishwasherSafe: '',
    };
    setFilters(resetFilters);
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

  const renderProductTypeSpecificFilters = () => {
    switch (filters.productType) {
      case PRODUCT_TYPES.CAKE:
        return (
          <>
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

            {/* Size Filter */}
            <FilterSection title="Size" icon={FiRuler}>
              <input
                type="text"
                name="size"
                value={filters.size}
                onChange={handleChange}
                placeholder="e.g., 8-inch, Dozen"
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              />
            </FilterSection>

            {/* Custom Filter */}
            <FilterSection title="Order Type" icon={FiStar}>
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
          </>
        );

      case PRODUCT_TYPES.CANDLE:
        return (
          <>
            {/* Scent Filter */}
            <FilterSection title="Scent" icon={FiDroplet}>
              <select
                name="scent"
                value={filters.scent}
                onChange={handleChange}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-800">All Scents</option>
                {SCENT_TAGS.map((tag) => (
                  <option key={tag} value={tag} className="text-gray-800">
                    {tag}
                  </option>
                ))}
              </select>
            </FilterSection>

            {/* Wax Type Filter */}
            <FilterSection title="Wax Type" icon={FiDroplet}>
              <select
                name="waxType"
                value={filters.waxType}
                onChange={handleChange}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-800">All Wax Types</option>
                {WAX_TYPES.map((tag) => (
                  <option key={tag} value={tag} className="text-gray-800">
                    {tag}
                  </option>
                ))}
              </select>
            </FilterSection>

            {/* Burn Time Range */}
            <FilterSection title="Burn Time (hours)" icon={FiClock} className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-purple-100 text-sm font-medium mb-2 block">Minimum</label>
                  <input
                    type="number"
                    name="burnTimeMin"
                    value={filters.burnTimeMin}
                    onChange={handleChange}
                    placeholder="20"
                    min="0"
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-purple-100 text-sm font-medium mb-2 block">Maximum</label>
                  <input
                    type="number"
                    name="burnTimeMax"
                    value={filters.burnTimeMax}
                    onChange={handleChange}
                    placeholder="80"
                    min="0"
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </FilterSection>
          </>
        );

      case PRODUCT_TYPES.MUG:
        return (
          <>
            {/* Material Filter */}
            <FilterSection title="Material" icon={FiLayers}>
              <select
                name="material"
                value={filters.material}
                onChange={handleChange}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-800">All Materials</option>
                {MATERIAL_OPTIONS.map((tag) => (
                  <option key={tag} value={tag} className="text-gray-800">
                    {tag}
                  </option>
                ))}
              </select>
            </FilterSection>

            {/* Design Type Filter */}
            <FilterSection title="Design Type" icon={FiGrid}>
              <select
                name="designType"
                value={filters.designType}
                onChange={handleChange}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-800">All Design Types</option>
                {DESIGN_TYPES.map((tag) => (
                  <option key={tag} value={tag} className="text-gray-800">
                    {tag}
                  </option>
                ))}
              </select>
            </FilterSection>

            {/* Capacity Filter */}
            <FilterSection title="Capacity" icon={FiRuler}>
              <input
                type="text"
                name="capacity"
                value={filters.capacity}
                onChange={handleChange}
                placeholder="e.g., 350ml, 16oz"
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              />
            </FilterSection>

            {/* Dishwasher Safe Filter */}
            <FilterSection title="Dishwasher Safe" icon={FiShield}>
              <select
                name="dishwasherSafe"
                value={filters.dishwasherSafe}
                onChange={handleChange}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-800">All Options</option>
                <option value="true" className="text-gray-800">Dishwasher Safe</option>
                <option value="false" className="text-gray-800">Hand Wash Only</option>
              </select>
            </FilterSection>
          </>
        );

      default:
        return null;
    }
  };

  // Get categories based on selected product type
  const getCategories = () => {
    if (filters.productType && PRODUCT_CATEGORIES[filters.productType]) {
      return PRODUCT_CATEGORIES[filters.productType];
    }
    // If no product type selected, show all unique categories
    return categories || Object.values(PRODUCT_CATEGORIES).flat();
  };

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
            {/* Product Type Filter */}
            <FilterSection title="Product Type" icon={FiFilter}>
              <select
                name="productType"
                value={filters.productType}
                onChange={handleChange}
                className="w-full p-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="" className="text-gray-800">All Product Types</option>
                <option value={PRODUCT_TYPES.CAKE} className="text-gray-800">
                  {PRODUCT_TYPE_LABELS[PRODUCT_TYPES.CAKE]}
                </option>
                <option value={PRODUCT_TYPES.CANDLE} className="text-gray-800">
                  {PRODUCT_TYPE_LABELS[PRODUCT_TYPES.CANDLE]}
                </option>
                <option value={PRODUCT_TYPES.MUG} className="text-gray-800">
                  {PRODUCT_TYPE_LABELS[PRODUCT_TYPES.MUG]}
                </option>
              </select>
            </FilterSection>

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
                  {getCategories().map((category) => (
                    <option key={category} value={category} className="text-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range" icon={FiDollarSign}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-purple-100 text-xs mb-1 block">Min (₦)</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-purple-100 text-xs mb-1 block">Max (₦)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleChange}
                      placeholder="100000"
                      min="0"
                      className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
              </FilterSection>
            </div>

            {/* Product Type Specific Filters */}
            {filters.productType && (
              <>
                <div className="border-t border-white/20 pt-6">
                  <h4 className="text-white font-semibold mb-4 text-lg">
                    {filters.productType ? PRODUCT_TYPE_LABELS[filters.productType] : 'Product'} Specific Filters
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderProductTypeSpecificFilters()}
                  </div>
                </div>
              </>
            )}

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
            <div className="flex items-center space-x-3">
              <span className="text-purple-100 text-sm">
                {activeFilters} filter{activeFilters > 1 ? 's' : ''} active
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || value === '') return null;
                  
                  let displayValue = value;
                  let label = key;
                  
                  // Format display values
                  switch (key) {
                    case 'productType':
                      label = 'Type';
                      displayValue = PRODUCT_TYPE_LABELS[value] || value;
                      break;
                    case 'custom':
                      label = 'Order Type';
                      displayValue = value === 'true' ? 'Custom' : 'Ready-made';
                      break;
                    case 'dishwasherSafe':
                      label = 'Wash Type';
                      displayValue = value === 'true' ? 'Dishwasher Safe' : 'Hand Wash';
                      break;
                    case 'search':
                      label = 'Search';
                      break;
                    default:
                      label = key.charAt(0).toUpperCase() + key.slice(1);
                  }
                  
                  return (
                    <span
                      key={key}
                      className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/30"
                    >
                      {label}: {typeof displayValue === 'string' ? displayValue.substring(0, 20) : displayValue}
                    </span>
                  );
                })}
              </div>
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
