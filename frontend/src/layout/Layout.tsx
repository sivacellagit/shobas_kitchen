// src/layout/Layout.tsx
//import Navbar from "../components/NavBar";
import Footer from "./Footer";
import Header from "./Header";
import { useCart } from "../contexts/CartContext";
import CartSidebar from "../pages/CartSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { cart } = useCart();
  const hasItems = cart.length > 0;

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Fixed Header */}
      <Header />

      {/* Content with optional CartSidebar on right for desktop 
      <div className="flex flex-grow">
        <main className="flex-grow px-4 sm:px-6 py-4 pt-16">{children}</main>

        {hasItems && (
          <aside className="hidden lg:block w-80">
            <CartSidebar isOpen={true} onClose={() => {}} isMobile={false} />
          </aside>
        )}
      </div>
       */}
    <main className="flex-grow pt-20 flex">
      <div className="flex-grow">{children}</div>
      {hasItems && (
        <aside className="hidden lg:block w-80">
          {location.pathname !== "/checkout" && <CartSidebar isOpen={true} onClose={() => {}} isMobile={false} />}

         {/* <CartSidebar isOpen={true} onClose={() => {}} isMobile={false} /> */}
        </aside>
      )}
    </main>
 
      <Footer />
    </div>
  );
};

/*
const Layout = ({ children }: { children: React.ReactNode }) => {
 const { cart } = useCart();
 const hasItems = cart.length > 0;
  return (
    <div className="bg-white shadow top-0 w-full z-50 border-b border-gray-100">
      <Header />
      <main className="flex-grow">{children}</main>
      {/* Cart Sidebar - show only on desktop and only if cart has items 
       {hasItems && (
         <aside className="hidden lg:block w-80 border-l bg-white shadow-sm">
           <CartSidebar isOpen={true} onClose={() => {}} isMobile={false} />
         </aside>
       )}
      <Footer />
    </div>
  );
};
*/
export default Layout;

{/*// src/layout/Layout.tsx
import Navbar from "../components/NavBar";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-4 pt-24 pb-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

*/}
/*
import React from "react";
import Header from "./Header";
import Navbar from "../components/NavBar";
import CartSidebar from "../pages/CartSidebar";
import { useCart } from "../contexts/CartContext";
import Footer from "./Footer";




const Layout = ({ children }: { children: React.ReactNode }) => {
 const { cart } = useCart();
 const hasItems = cart.length > 0;


 return (
   <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
     <Header /> 
     {/* <Navbar /> 

     <div className="flex flex-1">
       {/* Main content 
       <main className="flex-grow p-6">{children}</main>


       {/* Cart Sidebar - show only on desktop and only if cart has items 
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
*/
