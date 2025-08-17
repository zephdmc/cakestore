import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/productServic';
import { useEffect } from 'react';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data);
            } catch (err) {
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return <div>Product not found</div>;

    // Calculate expected price if discount exists
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    const expectedPrice = hasDiscount 
        ? product.price + (product.price * (product.discountPercentage / 100))
        : product.price;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
                <div className="bg-white p-4 rounded-lg shadow relative">
                    {/* Discount Badge - Top Left */}
                    {hasDiscount && (
                        <div className="absolute top-4 left-4 bg-white text-purpleDark1 text-sm font-bold px-3 py-1 rounded-full z-10 transform -rotate-12 shadow-md">
                            {product.discountPercentage}% OFF
                        </div>
                    )}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-96 object-contain"
                    />
                </div>
                <div className="bg-purpleLight p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            {/* Expected Price with strikethrough if there's a discount */}
                            <span className={`text-purpleDark1 text-xl font-bold ${hasDiscount ? 'line-through text-gray-400' : ''}`}>
                                ₦{expectedPrice.toLocaleString()}
                            </span>
                            {/* Current Price (only shown if there's a discount) */}
                            {hasDiscount && (
                                <span className="text-purpleDark1 text-xl font-bold">
                                    ₦{product.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                        {product.countInStock > 0 ? (
                            <span className="text-white">In Stock</span>
                        ) : (
                            <span className="text-purpleDark1">Out of Stock</span>
                        )}
                    </div>
                    <p className="text-white mb-6">{product.description}</p>

                    {product.countInStock > 0 && (
                        <div className="mb-6">
                            <label className="block text-purpleDark mb-2">Quantity</label>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="border rounded p-2"
                            >
                                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        disabled={product.countInStock === 0}
                        className={`w-full py-3 px-4 rounded ${product.countInStock === 0
                            ? 'bg-purpleLight cursor-not-allowed'
                            : 'bg-purpleDark1 text-purpleLight hover:bg-white'
                            } transition`}
                    >
                        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
