import { useState } from 'react';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            search: '',
            dietary: '',
            flavor: '',
            custom: '',
        });
        onFilter({});
    };

    return (
        <form onSubmit={handleSubmit} className="bg-purplegradient p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="block text-white mb-1 text-sm font-medium">Search</label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Search products..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purpleDark focus:border-transparent"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-white mb-1 text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purpleDark focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Dietary Tags */}
                <div>
                    <label className="block text-white mb-1 text-sm font-medium">Dietary</label>
                    <select
                        name="dietary"
                        value={filters.dietary}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purpleDark focus:border-transparent"
                    >
                        <option value="">All Dietary</option>
                        {DIETARY_TAGS.map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Flavor Tags */}
                <div>
                    <label className="block text-white mb-1 text-sm font-medium">Flavor</label>
                    <select
                        name="flavor"
                        value={filters.flavor}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purpleDark focus:border-transparent"
                    >
                        <option value="">All Flavors</option>
                        {FLAVOR_TAGS.map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Custom Products Filter */}
                <div>
                    <label className="block text-white mb-1 text-sm font-medium">Product Type</label>
                    <select
                        name="custom"
                        value={filters.custom}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purpleDark focus:border-transparent"
                    >
                        <option value="">All Types</option>
                        <option value="false">Ready-made</option>
                        <option value="true">Custom Orders</option>
                    </select>
                </div>

                {/* Price Range - Min */}
                <div>
                    <label className="block text-white mb-1 text-sm font-medium">Min Price (₦)</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="Min"
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purpleDark focus:border-transparent"
                    />
                </div>

                {/* Price Range - Max */}
                <div>
                    <label className="block text-white mb-1 text-sm font-medium">Max Price (₦)</label>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="Max"
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purpleDark focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
                <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
                >
                    Clear Filters
                </button>
                <button
                    type="submit"
                    className="bg-purpleDark text-white py-2 px-4 rounded-md hover:bg-purpleDark1 transition-colors font-medium"
                >
                    Apply Filters
                </button>
            </div>
        </form>
    );
}
