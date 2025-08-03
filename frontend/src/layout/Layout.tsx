import React from "react";
import Header from "./Header";
import CartSidebar from "../pages/CartSidebar";
import { useCart } from "../contexts/CartContext";
import Footer from "./Footer";




const Layout = ({ children }: { children: React.ReactNode }) => {
 const { cart } = useCart();
 const hasItems = cart.length > 0;


 return (
   <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
     <Header />


     <div className="flex flex-1">
       {/* Main content */}
       <main className="flex-grow p-6">{children}</main>


       {/* Cart Sidebar - show only on desktop and only if cart has items */}
       {hasItems && (
         <aside className="hidden lg:block w-80 border-l bg-white shadow-sm">
           <CartSidebar />
         </aside>
       )}
     </div>
     <Footer/>
   </div>
 );
};


export default Layout;