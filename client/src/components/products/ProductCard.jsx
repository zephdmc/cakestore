export default function ProductCard({ product }) {
const { addToCart } = useCart();

    // Calculate council price (actual price + percentage markup)
    const hasCouncilMarkup = product.councilMarkupPercentage && product.councilMarkupPercentage > 0;
    const councilPrice = hasCouncilMarkup 
        ? product.price + (product.price * (product.councilMarkupPercentage / 100))
        : product.price;

    // Calculate discounted price (if any discount applies to council price)
    // Calculate prices using the same logic as featured products section
const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
    const finalPrice = hasDiscount 
        ? councilPrice - (councilPrice * (product.discountPercentage / 100))
        : councilPrice;
    
    // Original price calculation (same as featured section)
    const originalPrice = hasDiscount 
        ? product.price + (product.price * (product.discountPercentage / 100))
        : product.price;
    
    // Final price is just product.price when there's a discount
    const displayPrice = product.price;

// Get the first image for the card display
const displayImage = product.images && product.images.length > 0 
@@ -60,23 +59,11 @@ export default function ProductCard({ product }) {

{/* Badges Container */}
<div className="absolute top-3 left-3 space-y-2">
                    {/* Council Markup Badge */}
                    {hasCouncilMarkup && (
                        <motion.span
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: -12 }}
                            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg block"
                        >
                            +{product.councilMarkupPercentage}% Council
                        </motion.span>
                    )}

{/* Discount Badge */}
{hasDiscount && (
<motion.span
initial={{ scale: 0, rotate: -45 }}
animate={{ scale: 1, rotate: -12 }}
                            transition={{ delay: 0.05 }}
className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg block"
>
{product.discountPercentage}% OFF
@@ -187,33 +174,13 @@ export default function ProductCard({ product }) {
<div className="flex items-center justify-between mt-auto">
{/* Price Display */}
<div className="flex flex-col">
                        {/* Show base price and council price if markup exists */}
                        {hasCouncilMarkup ? (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-purple-600">
                                        ₦{finalPrice.toLocaleString()}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ₦{councilPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Base: ₦{product.price.toLocaleString()}
                                    <span className="text-blue-600 ml-1">
                                        (+{product.councilMarkupPercentage}% council)
                                    </span>
                                </div>
                            </div>
                        ) : hasDiscount ? (
                        {hasDiscount ? (
<div className="flex items-center gap-2">
<span className="text-lg font-bold text-purple-600">
                                    ₦{finalPrice.toLocaleString()}
                                    ₦{displayPrice.toLocaleString()}
</span>
<span className="text-sm text-gray-500 line-through">
                                    ₦{product.price.toLocaleString()}
                                    ₦{originalPrice.toLocaleString()}
</span>
</div>
) : (
