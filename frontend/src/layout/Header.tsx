import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";


const Header = () => {
 const location = useLocation();
 const { cart } = useCart();
 const [ isMenuOpen, setIsMenuOpen ] = useState(false);
 const isActive = (path: string) =>
   location.pathname === path ? "text-green-600 font-semibold" : "text-gray-700";


 return (
  <nav className="bg-white shadow fixed top-0 w-full z-50 border-b border-gray-100">
   <header className="bg-white shadow-md sticky top-0 z-10">
     <div className="container mx-auto px-4 py-3 flex justify-between items-center">
       <h1 className="text-xl font-bold text-green-700">Shoba’s Kitchen</h1>
      
       <nav className="flex gap-6 items-center text-sm sm:text-base">
         <Link to="/" className={isActive("/")}>
           Home
         </Link>
         <Link to="/login" className={isActive("/login")}>
           Login
         </Link>
         <Link to="/menu" className={isActive("/menu")}>
           Menu
         </Link>
         <Link to="/cart" className="relative">
           <ShoppingCart className="w-5 h-5 text-gray-700" />
           {cart.length > 0 && (
             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
               {cart.length}
             </span>
           )}
         </Link>
       </nav>


       {/* Mobile Toggle */}
       <button
         className="lg:hidden"
         onClick={() => setIsMenuOpen(!isMenuOpen)}
         aria-label="Toggle Menu"
       >
         {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
       </button>
     {/*</div> */}


     {/* Mobile Icons */}
<div className="flex items-center space-x-4 lg:hidden">
 {/* Cart Icon 
 <Link to="/cart" className="relative">
   <ShoppingCart className="w-5 h-5" />
   {cart.length > 0 && (
     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
       {cart.length}
     </span>
   )}
 </Link> */}


 {/* Hamburger Toggle 
 <button
   onClick={() => setIsMenuOpen(!isMenuOpen)}
   aria-label="Toggle Menu"
 >
   {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
 </button>*/}
</div>
</div>


{/* Mobile Dropdown */}
<div className="flex items-center space-x-4 lg:hidden"> 
{isMenuOpen && (
<div className="lg:hidden px-4 pb-4 space-y-2 shadow-md">
   <Link to="/" onClick={() => setIsMenuOpen(false)} className="block hover:text-green-600">Home</Link>
   <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="block hover:text-green-600">Menu</Link>
   <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block relative hover:text-green-600">
   Cart
   {cart.length > 0 && (
       <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
       {cart.length}
       </span>
   )}
   </Link>
</div>
)}
</div>
   </header>
   </nav>
 );
};


export default Header;