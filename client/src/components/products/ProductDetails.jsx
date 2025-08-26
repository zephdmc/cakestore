import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/productService'; // Fixed typo: productServic -> productService
import { useEffect } from 'react';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purpleDark"></div>
        </div>
    );
    
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
    if (!product) return <div className="text-center py-8">Product not found</div>;

    // Calculate discounted price (price after discount)
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    const discountedPrice = hasDiscount 
        ? product.price - (product.price * (product.discountPercentage / 100))
        : product.price;

    // Get current display image
    const displayImage = product.images && product.images.length > 0 
        ? product.images[selectedImageIndex] 
        : '/placeholder-product.png';

    // Check if product can be added to cart (in stock or custom)
    const canAddToCart = product.isCustom || product.countInStock > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-purpleDark hover:text-purpleDark1 flex items-center"
                >
                    ← Back to Products
                </button>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="absolute top-6 left-6 bg-white text-purpleDark1 text-sm font-bold px-3 py-1 rounded-full z-10 transform -rotate-12 shadow-md">
                            {product.discountPercentage}% OFF
                        </div>
                    )}
                    
                    {/* Custom Product Badge */}
                    {product.isCustom && (
                        <div className="absolute top-6 right-6 bg-purpleDark text-white text-sm font-bold px-3 py-1 rounded-full z-10 shadow-md">
                            Custom Order
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="mb-4">
                        <img
                            src={displayImage}
                            alt={product.name}
                            className="w-full h-96 object-contain rounded-lg"
                            onError={(e) => {
                                e.target.src = '/placeholder-product.png';
                            }}
                        />
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto py-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden ${
                                        selectedImageIndex === index 
                                            ? 'border-purpleDark' 
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="bg-purpleLight p-6 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4 text-white">{product.name}</h1>

                    {/* Size */}
                    {product.size && (
                        <p className="text-white mb-3">
                            <span className="font-semibold">Size: </span>
                            {product.size}
                        </p>
                    )}

                    {/* Price Section */}
                    <div className="mb-6 p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            {hasDiscount ? (
                                <>
                                    <span className="text-2xl font-bold text-purpleDark1">
                                        ₦{discountedPrice.toLocaleString()}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                        ₦{product.price.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-purpleDark1">
                                    ₦{product.price.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Stock Status - Only show for non-custom products */}
                        {!product.isCustom && (
                            <p className={product.countInStock > 0 ? "text-green-600" : "text-red-600"}>
                                {product.countInStock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-white">Description</h3>
                        <p className="text-white leading-relaxed">{product.description}</p>
                    </div>

                    {/* Ingredients */}
                    {product.ingredients && product.ingredients.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-white">Ingredients</h3>
                            <ul className="list-disc list-inside text-white">
                                {product.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Dietary Information */}
                    {product.dietaryTags && product.dietaryTags.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-white">Dietary Information</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.dietaryTags.map((tag, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-white text-purpleDark px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Flavor Profile */}
                    {product.flavorTags && product.flavorTags.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-white">Flavor Profile</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.flavorTags.map((tag, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-purpleDark text-white px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Section */}
                    {canAddToCart && (
                        <div className="mb-6">
                            {!product.isCustom && (
                                <div className="mb-4">
                                    <label className="block text-white mb-2 font-semibold">Quantity</label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        className="border rounded p-2 w-20 bg-white"
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
                                className="w-full bg-purpleDark text-white py-3 px-6 rounded-lg hover:bg-purpleDark1 transition-colors font-semibold text-lg"
                            >
                                {product.isCustom ? 'Start Custom Order' : 'Add to Cart'}
                            </button>
                        </div>
                    )}

                    {/* Out of Stock Message */}
                    {!canAddToCart && (
                        <div className="text-center py-4">
                            <p className="text-red-600 font-semibold mb-4">This product is currently unavailable</p>
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-purpleDark text-white py-2 px-6 rounded hover:bg-purpleDark1 transition"
                            >
                                Browse Other Products
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
