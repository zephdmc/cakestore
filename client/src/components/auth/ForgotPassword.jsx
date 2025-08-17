import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Check your inbox!');
            toast.success('Password reset email sent');
        } catch (error) {
            toast.error(error.message);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 p-8 bg-white rounded-xl shadow-sm transition-all hover:shadow-md sm:my-12 sm:p-10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 sm:text-4xl">Reset Password</h2>
                <p className="text-purpleDark1">Enter your email to receive a reset link</p>
            </div>

            {message && (
                <div className={`mb-6 p-3 text-sm rounded-lg border flex items-center ${message.includes('sent') ?
                    'bg-purpleLighter1 text-purpleDark border-purpleLight' :
                    'bg-red-50 text-red-600 border-red-100'
                    }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 text-base border border-purpleDark rounded-lg focus:ring-2 focus:ring-purpleLighter focus:border-primary-500 transition"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-purpleDark hover:bg-purpleLight text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending....
                        </>
                    ) : 'Send Reset Link'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                    Remember your password?{' '}
                    <Link to="/login" className="font-medium text-purpleDark hover:text-primary-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
