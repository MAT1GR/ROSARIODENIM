import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthContext, useAuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart.tsx";
import { usePageFocus } from "./hooks/usePageFocus";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import SizeGuidePage from "./pages/SizeGuidePage";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutInfoPage from "./pages/CheckoutInfoPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ScrollToTop from "./components/ScrollToTop";
import AnnouncementBar from "./components/AnnouncementBar";
import WhatsAppButton from "./components/WhatsAppButton";
import ReturnsPolicyPage from "./pages/ReturnsPolicyPage";
import TransferPendingPage from "./pages/TransferPendingPage";
import FAQPage from "./pages/FAQPage";
import NuestraMisionPage from "./pages/NuestraMisionPage";
import ShippingPage from "./pages/ShippingPage.tsx";
import CartSidebar from "./components/CartSidebar";

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <main key={location.pathname} className="flex-1 fade-in-up">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<ShopPage />} />
        <Route path="/producto/:id" element={<ProductPage />} />
        <Route path="/checkout/info" element={<CheckoutInfoPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/tallas" element={<SizeGuidePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/pedido-pendiente/:id" element={<TransferPendingPage />} />
        <Route path="/cambios-y-devoluciones" element={<ReturnsPolicyPage />} />
        <Route path="/preguntas-frecuentes" element={<FAQPage />} />
        <Route path="/nuestra-mision" element={<NuestraMisionPage />} />
      </Routes>
    </main>
  );
};

function App() {
  const auth = useAuthProvider();
  const [isCartOpen, setIsCartOpen] = useState(false);

  usePageFocus("Rosario Denim", "¡No te vayas! Vuelve a Rosario Denim");

  return (
    <AuthContext.Provider value={auth}>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header onCartClick={() => setIsCartOpen(true)} />
            <AnimatedRoutes />
            <Footer />
            <WhatsAppButton />
            <CartSidebar
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthContext.Provider>
  );
}

export default App;
