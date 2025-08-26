// src/pages/Cart.tsx
import { useCart } from "../contexts/CartContext";
import { useCustomer } from "../contexts/CustomerContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { applyDiscounts } from "..//utils/Discount";
import api from "../utils/Api";
import type { EnrichedItem } from "..//utils/Discount"

const Cart = () => {
 const { cart, removeFromCart, clearCart } = useCart();
 const { customer } = useCustomer();
 const isGuest = customer?.username === "guest";
 const navigate = useNavigate();

 const [enrichedItems, setEnrichedItems] = useState<EnrichedItem[]>([]);
 const [ , setDiscountPercent] = useState(10);
 const [total, setTotal] = useState(0);

 useEffect(() => {
 const enrichCart = async () => {
   if (!customer || isGuest) {
    const { enrichedItems, discountSummary } = await applyDiscounts(cart, [], true, true);
    setEnrichedItems(enrichedItems);
    setDiscountPercent(discountSummary.first_order); // or item_level, depending
    setTotal(enrichedItems.reduce((sum, item) => sum + item.discountedPrice, 0));
     return;
   }

   try {
    const res = await api.get(`/orders/purchased-items/?customer_id=${customer.id}`);
    const purchasedIds = res.data.purchased_item_ids || [];
    const hasPriorOrders = res.data.has_prior_orders || false;
    const { enrichedItems, discountSummary } = await applyDiscounts(cart, purchasedIds, hasPriorOrders, false);
    setEnrichedItems(enrichedItems);
    setDiscountPercent(!hasPriorOrders ? discountSummary.first_order : discountSummary.item_level);
    setTotal(enrichedItems.reduce((sum, item) => sum + item.discountedPrice, 0));
   } catch (err) {
     console.error("Error fetching purchase history", err);
   }
 };

 enrichCart();
}, [cart, customer]);

 return (
   <div className="p-6">
     <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
     {enrichedItems.length === 0 ? (
       <p className="text-gray-600">Your cart is empty.</p>
     ) : (
       <>
         <div className="space-y-4">
           {enrichedItems.map((item) => (
             <div
               key={item.id}
               className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
             >
               <div>
                 <h2 className="text-lg font-semibold">{item.name}</h2>
                 <p>
                   ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                 </p>
                 {item.discountAmount > 0 && (
                   <p className="text-sm text-green-600">
                     {item.appliedOffer === "first_order" ? "First Order Discount" : "First Time Discount"}: -₹{item.discountAmount.toFixed(2)}
                   </p>
                 )}
               </div>
               <button
                 className="text-red-500 hover:underline"
                 onClick={() => removeFromCart(item.id)}
               >
                 Remove
               </button>
               
             </div>
           ))}
         </div>
         <div className="mt-6"> 
         {/*<div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">*/}
           <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
           <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
           <button
             onClick={() => navigate("/checkout")}
             className="btn-outline"
           >
             Proceed to Checkout
           </button>

           <button
             onClick={clearCart}
             className="btn-outline"
           >
             Clear Cart
           </button>
           </div>
         </div>
       </>
     )}
   </div>
 );
};

export default Cart;