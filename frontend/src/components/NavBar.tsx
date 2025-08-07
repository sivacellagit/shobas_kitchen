// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow fixed top-0 w-full z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <span className="text-xl font-bold text-green-700 tracking-wide">
            🍛 Shoba’s Kitchen
          </span>
          <div className="hidden md:flex space-x-6 font-medium text-gray-700 text-sm">
            {["Home", "Menu", "Order", "Login", "Loyalty Program", "About", "Contact"].map((item) => (
              <Link key={item} to={`/${item.toLowerCase().replace(/\s+/g, "")}`} className="hover:text-green-600">
                {item}
              </Link>
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-2 pb-4 space-y-2 bg-white">
            {["Home", "Menu", "Order", "Login", "Loyalty Program", "About", "Contact"].map((item) => (
              <Link key={item} to={`/${item.toLowerCase().replace(/\s+/g, "")}`} className="block hover:text-green-600">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

{/*// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";


const Navbar = () => {
 const [isOpen, setIsOpen] = useState(false);


 return (
   <nav className="bg-white shadow fixed w-full z-50 top-0 left-0 border-b border-gray-100">
     <div className="max-w-6xl mx-auto px-4">
       <div className="flex justify-between items-center h-16">
         <div className="flex items-center space-x-4">
           <span className="text-xl font-bold text-green-700 tracking-wide">🍛 Shoba’s Kitchen</span>
         </div>


         <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
           <Link to="/" className="hover:text-green-600">Home</Link>
           <Link to="/menu" className="hover:text-green-600">Menu</Link>
           <Link to="/login" className="hover:text-green-600">Login</Link>
           <Link to="/order" className="hover:text-green-600">Order</Link>
           <Link to="/loyalty" className="hover:text-green-600">Loyalty Program</Link>
           <Link to="/about" className="hover:text-green-600">About</Link>
           <Link to="/contact" className="hover:text-green-600">Contact</Link>
         </div>


         <div className="md:hidden flex items-center">
           <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
         </div>
       </div>
     </div>


     {isOpen && (
       <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
         <Link to="/" className="block hover:text-green-600">Home</Link>
         <Link to="/menu" className="block hover:text-green-600">Menu</Link>
         <Link to="/order" className="block hover:text-green-600">Order</Link>
         <Link to="/loyalty" className="block hover:text-green-600">Loyalty Program</Link>
         <Link to="/about" className="block hover:text-green-600">About</Link>
         <Link to="/contact" className="block hover:text-green-600">Contact</Link>
       </div>
     )}
   </nav>
 );
};


export default Navbar;

*/}