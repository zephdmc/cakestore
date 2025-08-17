import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import AppRoutes from './routes';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ErrorBoundary from './pages/ErrorBoundary';
import  ScrollToTop from './ScrollToTop';
function App() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);

                    // Request notification permission when SW is ready
                    if (Notification.permission === 'default') {
                        Notification.requestPermission().then(permission => {
                            console.log('Notification permission:', permission);
                        });
                    }
                })
                .catch(err => {
                    console.error('SW registration failed:', err);
                });
        }
    }, []);

    useEffect(() => {
        // Clear any potential stuck state
        if (window.performance.navigation.type === 1) { // Type 1 = page reload
            localStorage.removeItem('authState');
        }
    }, []);

    return (
        <Router basename="/">
            <ErrorBoundary>
                <AuthProvider>
                    <ProductProvider>
                        <CartProvider>
                             <ScrollToTop />
                            <div className="min-h-screen bg-purplegradient flex flex-col">
                                <Header />
                                <main className="flex-grow container mx-auto px-2">
                                    <AppRoutes />
                                </main>
                                <Footer />
                            </div>
                        </CartProvider>
                    </ProductProvider>
                </AuthProvider>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
