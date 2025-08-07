import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CartSidebar from "./pages/CartSidebar";
import FloatingCartButton from "./components/FloatingCartButton";
import { useState, useEffect } from "react";
import { useCart } from "./contexts/CartContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import OrderConfirmation from './pages/OrderConfirmation';
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
//import AppContent from "./AppContent";
//import Header from "./layout/Header";


// 🔁 Create an inner component so we can use `useLocation` safely
function AppContent() {
 const [cartOpen, setCartOpen] = useState(false);
 const location = useLocation();
 const { cart } = useCart();
 const hasItems = cart.length > 0;

  useEffect(() => {
      if (cartOpen) {
        document.body.style.overflow = 'hidden';  // disable scroll
      } else {
        document.body.style.overflow = 'auto';    // re-enable scroll
      }

      return () => {
        document.body.style.overflow = 'auto';    // cleanup
      };
    }, [cartOpen]);
  
    // Close cart on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);
    
  // Auto-close sidebar on route change
  useEffect(() => {
      setCartOpen(false); // close cart on route change
    }, [location.pathname]);

 return (
   <div className="flex min-h-screen bg-gray-100">
     {/*<main className="flex-grow p-6 overflow-auto">*/}
       <Layout>
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/menu" element={<Menu />} />
           <Route path="/login" element={<Login />} />
           <Route path="/menu-public" element={<Menu isPublicView={true} />} />
           <Route path="/cart" element={<Cart />} />
           <Route path="/checkout" element={<Checkout />} />
           <Route path="/order-confirmation" element={<OrderConfirmation />} />
           <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
         {/*<FloatingCartButton onClick={() => setCartOpen(true)} isVisible={!cartOpen && hasItems} />*/}
       </Layout>
   {/*  </main> */}
   
     {/* Floating button for mobile/tablet */}
     <FloatingCartButton onClick={() => setCartOpen(true)} isVisible={!cartOpen && hasItems} />
    
    {/*  Slide-out Cart Sidebar for mobile */}
     {cartOpen && (
       <div className="fixed inset-0 z-40 bg-black bg-opacity-40 lg:hidden" onClick={() => setCartOpen(false)}>
         <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
           <CartSidebar
             isOpen={cartOpen}
             onClose={() => setCartOpen(false)}
             isMobile={true}
           />
         </div>
       </div>
     )} 
   </div>
 );
}


// ⬅️ BrowserRouter wraps the inner component
function App() {
 return (
   <BrowserRouter>
     <AuthProvider>
       <CustomerProvider>
         <AppContent />
       </CustomerProvider>
     </AuthProvider>
   </BrowserRouter>
 );
}
/*
function App() {
 return (
   <CustomerProvider>
     <BrowserRouter>
       <AppContent />
     </BrowserRouter>
   </CustomerProvider>
 );
}
*/


export default App;