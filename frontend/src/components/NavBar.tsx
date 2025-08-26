// src/components/Navbar.tsx
import { useState } from "react";
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
