import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type CartItem = {
 id: number;
 name: string;
 price: number;
 image: string | null;
 quantity: number;
};


type CartContextType = {
 cart: CartItem[];
 addToCart: (item: Omit<CartItem, "quantity">) => void;
 removeFromCart: (id: number) => void;
 updateQuantity: (id: number, quantity: number) => void;
 clearCart: () => void;
};


const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider = ({ children }: { children: ReactNode }) => {
 const [cart, setCart] = useState<CartItem[]>([]);


 const addToCart = (item: Omit<CartItem, "quantity">) => {
  console.log("Adding item to cart:", item);
   setCart(prev => {
     const existing = prev.find(i => i.id === item.id);
     if (existing) {
       return prev.map(i =>
         i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
       );
     }
     console.log("Item not in cart, adding new item");
     return [...prev, { ...item, quantity: 1 }];
   });
    console.log("Cart after adding item:", cart);
 };


 const removeFromCart = (id: number) => {
   setCart((prev) => prev.filter((item) => item.id !== id));
 };


 const updateQuantity = (id: number, quantity: number) => {
   if (quantity <= 0) {
     removeFromCart(id);
   } else {
     setCart((prev) =>
       prev.map((item) =>
         item.id === id ? { ...item, quantity } : item
       )
     );
   }
 };


 const clearCart = () => setCart([]);


 return (
   <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
     {children}
   </CartContext.Provider>
 );
};


export const useCart = (): CartContextType => {
 const context = useContext(CartContext);
 if (!context) throw new Error("useCart must be used within a CartProvider");
 return context;
};
