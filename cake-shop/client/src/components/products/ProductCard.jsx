import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    
    // Calculate expected price if discount exists
    const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    const expectedPrice = hasDiscount 
        ? product.price + (product.price * (product.discountPercentage / 100))
        : product.price;

    return (
        <div className="bg-purpleLight rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
            {/* Discount Badge - Top Left */}
           {product.discountPercentage > 0 && (
                                <div className="absolute top-2 left-2 bg-white text-purpleDark1 text-xs font-bold px-2 py-1 rounded-full z-10 transform -rotate-12 shadow-md">
                                    {product.discountPercentage}% OFF
                                </div>
                            )}
            <Link to={`/products/${product.id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-purpleDark transition">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-2">
                        {/* Original Price with strikethrough if there's a discount */}
                    

<div className="mt-auto">
                                {/* Price Display */}
                                {product.discountPercentage > 0 ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] md:text-md text-white line-through">
                                                ₦{(product.price + (product.price * (product.discountPercentage / 100))).toLocaleString()}
                                            </span>
                                            <span className="text-[14px] md:text-md text-purpleDark1 font-bold">
                                                ₦{product.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-[14px] md:text-md text-white">
                                        ₦{product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>

                        
                    </div>
                    {/* Stock Status */}
                    <div className="mt-1">
                        {product.countInStock > 0 ? (
                            <span className="text-purpleDark text-sm">In Stock</span>
                        ) : (
                            <span className="text-Danger text-sm">Out of Stock</span>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => addToCart(product)}
                    disabled={product.countInStock === 0}
                    className={`w-full py-2 px-4 rounded ${product.countInStock === 0
                        ? 'bg-purpleDark1 cursor-not-allowed'
                        : 'bg-purpleDark text-purpleLight hover:bg-purpleLight'
                        } transition`}
                >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
