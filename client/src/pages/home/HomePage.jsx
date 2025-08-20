import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProducts } from "../../services/productServic";
import { FiLoader, FiAlertTriangle } from "react-icons/fi";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data?.slice(0, 4) || []);
      } catch (err) {
        setError(err.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Crafting Moments You Can Taste, Scent & Hold
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link className="px-6 py-3 bg-black text-white rounded-lg font-semibold">
            Order Custom
          </Link>
          <Link className="px-6 py-3 border border-black rounded-lg font-semibold">
            Shop Ready-Made
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="border rounded-xl p-6 shadow-sm">
          <span className="block text-2xl mb-2">🎂</span>
          <p className="font-medium">Themed Cakes</p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm">
          <span className="block text-2xl mb-2">🕯️</span>
          <p className="font-medium">Scented Candles</p>
        </div>
        <div className="border rounded-xl p-6 shadow-sm">
          <span className="block text-2xl mb-2">☕</span>
          <p className="font-medium">Personalized Mug</p>
        </div>
      </section>

      {/* Occasion Buttons */}
      <section className="flex flex-wrap justify-center gap-3 px-4">
        {["Birthdays", "Weddings", "Anniversaries", "Corporate"].map((item) => (
          <button
            key={item}
            className="px-4 py-2 border rounded-full text-sm font-medium hover:bg-gray-100"
          >
            {item}
          </button>
        ))}
      </section>

      {/* Customer Favorites */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Customer Favorites
        </h2>

        {loading ? (
          <div className="text-center">
            <FiLoader className="animate-spin inline-block text-2xl" />
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 flex items-center justify-center gap-2">
            <FiAlertTriangle /> {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-xl overflow-hidden shadow-sm"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-gray-600 text-sm">₦{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Us */}
      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600 leading-relaxed">
            We specialize in crafting memorable experiences with themed cakes,
            scented candles, and personalized mugs. Perfect for birthdays,
            weddings, anniversaries, and corporate events.
          </p>
        </div>
        <div className="aspect-video bg-gray-200 rounded-xl"></div>
      </section>

      {/* Contact & Assistance */}
      <section className="bg-gray-100 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Contact & Assistance</h2>
        <p className="text-gray-700">
          Need help? Reach us at{" "}
          <a href="mailto:support@example.com" className="underline">
            support@example.com
          </a>
        </p>
      </section>
    </div>
  );
}
