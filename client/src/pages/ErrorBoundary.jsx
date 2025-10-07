// ErrorBoundary.jsx
import { Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiAlertTriangle, FiHome, FiMessageCircle } from 'react-icons/fi';

class ErrorBoundary extends Component {
    state = { 
        hasError: false,
        error: null,
        errorInfo: null
    };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // You can also log to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleRefresh = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleReportIssue = () => {
        const subject = encodeURIComponent('Error Report - Cake Shop');
        const body = encodeURIComponent(
            `Error Details:\n\n${this.state.error?.toString()}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`
        );
        window.open(`mailto:support@cakeshop.com?subject=${subject}&body=${body}`, '_blank');
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
                    >
                        {/* Error Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <FiAlertTriangle className="text-white text-3xl" />
                        </motion.div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
                        </p>

                        {/* Error Details (Collapsible for developers) */}
                        <details className="mb-6 text-left">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium mb-2">
                                Technical Details
                            </summary>
                            <div className="bg-gray-50 rounded-lg p-3 mt-2 text-xs font-mono text-gray-600 overflow-x-auto">
                                <div className="mb-2">
                                    <strong>Error:</strong> {this.state.error?.toString()}
                                </div>
                                {this.state.errorInfo?.componentStack && (
                                    <div>
                                        <strong>Component Stack:</strong>
                                        <pre className="mt-1 whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </details>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={this.handleRefresh}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center"
                            >
                                <FiRefreshCw className="mr-3" />
                                Refresh Page
                            </motion.button>

                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={this.handleGoHome}
                                    className="bg-white text-gray-700 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center justify-center"
                                >
                                    <FiHome className="mr-2" />
                                    Go Home
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={this.handleReportIssue}
                                    className="bg-white text-gray-700 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center justify-center"
                                >
                                    <FiMessageCircle className="mr-2" />
                                    Report Issue
                                </motion.button>
                            </div>
                        </div>

                        {/* Support Information */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                Need immediate assistance?{' '}
                                <a 
                                    href="mailto:support@cakeshop.com"
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    Contact Support
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
