import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./layout/Layout";

// Customer pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CartSidebar from "./pages/CartSidebar";
import OrderConfirmation from './pages/OrderConfirmation';

// Admin-specific components
import AdminLogin from "./pages/AdminLogin";
//import Dashobard from "./dashboards/admin/AdminDashboard"
import AdminRoute from "./admin/components/AdminRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminHome from "./admin/components/AdminHome";
import MenuManagement from "./admin/components/MenuManagement";
import StaffManagement from "./admin/components/StaffManagement";
import OrderReports from "./admin/components/OrderReports";
import LoyaltyManagement from "./admin/components/LoyaltyManagement";

import FloatingCartButton from "./components/FloatingCartButton";
import { useState, useEffect } from "react";
import { useCart } from "./contexts/CartContext";
import { CustomerProvider } from "./contexts/CustomerContext";
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

        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="home" element={<AdminHome />} />
            <Route path="pos" element={<Menu /> } />
            <Route path="cart" element={<Cart />} />
            <Route path="cart-sidebar" element={<CartSidebar isOpen={true} onClose={() => {}} isMobile={false} />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />

            {/* Admin-only features */}
            <Route path="menu" element={<div>Menu Management Page <MenuManagement /></div> } />
            <Route path="staff" element={<div>Staff Management Page <StaffManagement /></div>} />
            <Route path="orders" element={<div>Order Reports Page <OrderReports /></div>} />
            <Route path="loyalty" element={<div>Loyalty Program Page <LoyaltyManagement /></div>} />
            <Route path="menu" element={<Menu isPublicView={false} />} />
          </Route>
        </Route>

            {/* Admin Routes                      
         <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} /> {/* Default dashboard
            <Route path="menu" element={<MenuManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="orders" element={<OrderReports />} />
            <Route path="loyalty" element={<LoyaltyManagement />} />
        </Route>
              */}
            {/* Catch-all route */}
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