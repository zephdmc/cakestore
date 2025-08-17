import { createContext, useContext, useEffect, useState } from 'react';
import { getProducts } from '../services/productServic';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data);

                // Extract unique categories
                const uniqueCategories = [...new Set(
                    response.data.map(product => product.category)
                )];
                setCategories(uniqueCategories);
            } catch (err) {
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getProductById = (id) => {
        return products.find(product => product.id === id);
    };

    const value = {
        products,
        categories,
        loading,
        error,
        getProductById
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductContext);
}