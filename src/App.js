import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BasketProvider } from './context/BasketContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import BasketPage from './pages/BasketPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import WishlistPage from './pages/WishlistPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AdminOrderDetailsPage from './pages/AdminOrderDetailsPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminSalesPage from './pages/AdminSalesPage';

function App() {
    return (
        <AuthProvider>
            <WishlistProvider>
                <BasketProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/products/:id" element={<ProductDetailsPage />} />
                            <Route path="/basket" element={
                                <ProtectedRoute><BasketPage /></ProtectedRoute>
                            } />
                            <Route path="/checkout" element={
                                <ProtectedRoute><CheckoutPage /></ProtectedRoute>
                            } />
                            <Route path="/order-confirmation" element={
                                <ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>
                            } />
                            <Route path="/wishlist" element={
                                <ProtectedRoute><WishlistPage /></ProtectedRoute>
                            } />
                            <Route path="/orders" element={
                                <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
                            } />
                            <Route path="/orders/:id" element={
                                <ProtectedRoute><OrderDetailsPage /></ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute><ProfilePage /></ProtectedRoute>
                            } />
                            <Route path="/admin" element={
                                <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
                            }>
                                <Route path="orders" element={<AdminOrdersPage />} />
                                <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
                                <Route index element={<AdminDashboardPage />} />
                                <Route path="orders" element={<AdminOrdersPage />} />
                                <Route path="customers" element={<AdminCustomersPage />} />
                                <Route path="sales" element={<AdminSalesPage />} />
                            </Route>
                        </Routes>
                    </Router>
                </BasketProvider>
            </WishlistProvider>
        </AuthProvider>
    );
}

export default App;