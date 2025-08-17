import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

// Embedded Google SVG logo component
const GoogleLogo = () => (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const location = useLocation();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setGoogleLoading(true);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError(err.message);
            setGoogleLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            const from = location.state?.from || (currentUser.isAdmin ? '/admin' : '/');
            navigate(from, { replace: true });
        }
    }, [currentUser, navigate, location.state?.from]);

    return (
        <div className="max-w-md mx-4 sm:mx-auto my-2 md:my-8 sm:my-2 p-2 sm:p-8 bg-white rounded-xl shadow-sm">
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-sm sm:text-base text-purpleLight">Sign in to access your account</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs sm:text-sm rounded-lg border border-red-100 flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm purpleDark2">
                            Remember me
                        </label>
                    </div>

                    <Link
                        to="/forgotpassword"
                        className="text-xs sm:text-sm font-medium text-purpleDark hover:text-primary-500"
                    >
                        Forgot password?
                    </Link>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <button
                        type="submit"
                        className="w-full py-2.5 sm:py-3 px-4 bg-purplegradient hover:bg-purpleLight text-white text-sm sm:text-base font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : 'Sign in'}
                    </button>

                    <Link
                        to="/forgotpassword"
                        className="w-full py-2 px-4 border border-purpLight rounded-lg shadow-sm text-xs sm:text-sm font-medium text-purpleDark2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex justify-center items-center"
                    >
                        Reset Password
                    </Link>
                </div>
            </form>

            <div className="mt-6 text-center text-xs sm:text-sm text-purpleDark2">
                <p>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-purpleDark2 hover:text-purpleDark2">
                        Sign up
                    </Link>
                </p>
            </div>

            <div className="mt-6 sm:mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-purpleLight"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                        <span className="px-2 bg-white text-purpleDark2">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full inline-flex justify-center py-2 px-4 border border-purpleDark2 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-purpleDark2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {googleLoading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-purpleDark2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <GoogleLogo />
                                Sign in with Google
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
