// src/components/CartSidebar.tsx
import { useCart } from "../contexts/CartContext";
import { useCustomer } from "../contexts/CustomerContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { applyDiscounts } from "../utils/Discount";
import type { EnrichedItem } from "../utils/Discount";
import api from "../utils/Api";

type Props = {
isOpen: boolean;
onClose: () => void;
isMobile: boolean;
};


const CartSidebar = ({ isOpen, onClose, isMobile }: Props) => {
const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
const { customer } = useCustomer();
const isGuest = customer?.username === "guest";
const navigate = useNavigate();




//const [enrichedCart, setEnrichedCart] = useState([]);
const [enrichedItems, setEnrichedItems] = useState<EnrichedItem[]>([]);
const [discountPercent, setDiscountPercent] = useState(0);
const [total, setTotal] = useState(0);


useEffect(() => {
 const enrichCart = async () => {
   if (!customer || isGuest) {
     const { enrichedItems,discountSummary } = await applyDiscounts(cart, [], true, true);
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
  <div
    className={`${
      isMobile
        ? `fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`
        : "w-80 h-full bg-white border-l"
    }`}
  >
    {isMobile && (
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-600 text-2xl font-bold">&times;</button>
      </div>
    )}




    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100%-120px)]">
      {enrichedItems.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-10">Your cart is empty</p>
      ) : (
        enrichedItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                ₹{item.price} × {item.quantity}
              </p>
              {item.isFirstTimePurchase && (
                <p className="text-sm text-green-600">{discountPercent}% discount: -₹{item.discountAmount.toFixed(2)}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="ml-auto text-sm text-red-500"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>




    {enrichedItems.length > 0 && (
      <div className="p-4 border-t">
        <div className="flex justify-between font-semibold mb-3">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Checkout
        </button>
        <button
          onClick={clearCart}
          className="w-full text-sm text-gray-500 mt-2 hover:text-red-600"
        >
          Clear Cart
        </button>
      </div>
    )}
  </div>
);
};




export default CartSidebar;