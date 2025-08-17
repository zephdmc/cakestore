// frontend/src/components/Navbar.js
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const { currentUser, logout } = useAuth();

    return (
        <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between">
            <div className="flex gap-4 items-center">
                <Link to="/" className="font-bold text-lg">ZephStore</Link>
                <Link to="/store">Store</Link>
                <Link to="/cart">Cart</Link>
                {currentUser && <Link to="/orders">My Orders</Link>}
                {currentUser?.email === import.meta.env.VITE_ADMIN_EMAIL && (
                    <>
                        <Link to="/admin">Admin</Link>
                        <Link to="/admin/orders">Orders</Link>
                    </>
                )}
            </div>
            <div>
                {!currentUser ? (
                    <Link to="/login">Login</Link>
                ) : (
                    <button onClick={logout} className="text-sm">Logout</button>
                )}
            </div>
        </nav>
    );
}
