import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/admin/AdminRoute';
import Loader from './components/common/Loader';
import ForgotPassword from './components/auth/ForgotPassword';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/home/HomePage'));
const ProductListPage = lazy(() => import('./pages/products/ProductListPage'));
const ProductDetailPage = lazy(() => import('./components/products/ProductDetails'));
const CartPage = lazy(() => import('./pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const OrderHistory = lazy(() => import('./pages/orders/OrderHistory'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProduct'));
const SearchResultsPage = lazy(() => import('./pages/search/serachPage'));
const OrderDetails = lazy(() => import('./pages/orders/OrderDetails'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetails = lazy(() => import('./pages/admin/OrderDetails'));
const BlogListPage = lazy(() => import('./pages/blog/BlogListPage'));  // ✅ Correct
const BlogDetailPage = lazy(() => import('./pages/blog/BlogDetailPage'));  // ✅ Correct
const NotFound = lazy(() => import('./pages/404'));
const Privacy = lazy(() => import('./components/common/privacy'));
const Returns = lazy(() => import('./components/common/returns'));
const Shipping = lazy(() => import('./components/common/shipping'));
const Terms = lazy(() => import('./components/common/terms'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AddProductPage = lazy(() => import('./components/products/AddProductPage'));
const EditProductPage = lazy(() => import('./components/products/EditProductPage'));
const AboutPage = lazy(() => import('./pages/About/About'));
const AdminCustomOrder = lazy(() => import('./pages/admin/AdminCustomOrders'));
const AppRoutes = () => {

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* ... other public routes */}

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
                    {/* <Route path="/orders" element={<OrderHistory />} /> */}

                </Route>

                {/* Admin Routes - Corrected Structure */}
                <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route path="/admin">
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AddProductPage />} />
                        <Route path="products/:id/edit" element={<EditProductPage />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<UserManagement />} />
                       <Route path="custom-orders" element={<AdminCustomOrder />} />
                        <Route path="orders/:id" element={<AdminOrderDetails />} />
                    </Route>
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />

                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
