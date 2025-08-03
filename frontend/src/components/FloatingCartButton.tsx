import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";


type Props = {
 onClick: () => void;
 isVisible: boolean;
};


const FloatingCartButton: React.FC<Props> = ({ onClick, isVisible }) => {
 const { cart } = useCart();
 const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);


 return (
   <button
     onClick={onClick}
     className={`fixed bottom-6 right-6 z-50 bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-green-700 ${
       isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
     } sm:hidden`}
   >
     <ShoppingCart className="w-6 h-6" />
     {itemCount > 0 && (
       <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
         {itemCount}
       </span>
     )}
   </button>
 );
};


export default FloatingCartButton;