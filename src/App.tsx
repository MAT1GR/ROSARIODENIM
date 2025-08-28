import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart.tsx';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import SizeGuidePage from './pages/SizeGuidePage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 fade-in">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tienda" element={<ShopPage />} />
                <Route path="/producto/:id" element={<ProductPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/tallas" element={<SizeGuidePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthContext.Provider>
  );
}

export default App;
