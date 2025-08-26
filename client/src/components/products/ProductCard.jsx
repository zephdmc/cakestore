import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    
    // Calculate discounted price (price after discount)
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    const discountedPrice = hasDiscount 
        ? product.price - (product.price * (product.discountPercentage / 100))
        : product.price;

    // Get the first image for the card display
    const displayImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : '/placeholder-product.png';

    return (
        <div className="bg-purpleLight rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
            {/* Discount Badge - Top Left */}
            {hasDiscount && (
                <div className="absolute top-2 left-2 bg-white text-purpleDark1 text-xs font-bold px-2 py-1 rounded-full z-10 transform -rotate-12 shadow-md">
                    {product.discountPercentage}% OFF
                </div>
            )}

            {/* Custom Product Badge - Top Right */}
            {product.isCustom && (
                <div className="absolute top-2 right-2 bg-purpleDark text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
                    Custom Order
                </div>
            )}

            <Link to={`/products/${product.id}`}>
                <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                    }}
                />
            </Link>
            
            <div className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-purpleDark transition line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Display size if available */}
                {product.size && (
                    <p className="text-sm text-gray-600 mb-2">{product.size}</p>
                )}

                {/* Display flavor tags if available */}
                {product.flavorTags && product.flavorTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.flavorTags.slice(0, 3).map((tag, index) => (
                            <span 
                                key={index} 
                                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                        {product.flavorTags.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{product.flavorTags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-2">
                        <div className="mt-auto">
                            {/* Price Display */}
                            {hasDiscount ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] md:text-md text-gray-500 line-through">
                                            ₦{product.price.toLocaleString()}
                                        </span>
                                        <span className="text-[14px] md:text-md text-purpleDark1 font-bold">
                                            ₦{discountedPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-[14px] md:text-md text-purpleDark1 font-bold">
                                    ₦{product.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    {/* Stock Status - Don't show for custom products */}
                    {!product.isCustom && (
                        <div className="mt-1">
                            {product.countInStock > 0 ? (
                                <span className="text-green-600 text-sm">✓ In Stock</span>
                            ) : (
                                <span className="text-red-600 text-sm">✗ Out of Stock</span>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => addToCart(product)}
                    disabled={!product.isCustom && product.countInStock === 0}
                    className={`w-full py-2 px-4 rounded font-medium transition ${
                        (!product.isCustom && product.countInStock === 0) 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                            : 'bg-purpleDark text-white hover:bg-purpleDark1 hover:scale-105 transform transition-transform'
                    }`}
                >
                    {product.isCustom ? 'Custom Order' : 
                     product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
