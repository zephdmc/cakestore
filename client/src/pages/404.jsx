import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <Link
                to="/"
                className="bg-primary text-white py-2 px-6 rounded hover:bg-primary-dark transition"
            >
                Go back home
            </Link>
        </div>
    );
}