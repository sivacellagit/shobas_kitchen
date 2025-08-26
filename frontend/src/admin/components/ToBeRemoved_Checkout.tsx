// src/pages/Checkout.tsx
import { useCart } from "../../contexts/CartContext";
import { useCustomer } from "../../contexts/CustomerContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewCustomerForm from "../../components/NewCustomerForm";
import { applyDiscounts } from "../../utils/Discount";
import api from "../../utils/Api";
import type { EnrichedItem } from "../../utils/Discount";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { customer, clearCustomer } = useCustomer();
  const isGuest = customer?.username === "guest";
  const navigate = useNavigate();

  const [wantsToRegister, setWantsToRegister] = useState(false);
  const [guestPhone] = useState("");
  const [name] = useState(customer?.name || "");
  const [phone] = useState(customer?.phone_number || "");
  const [email] = useState(customer?.email || "");
  const [address] = useState(customer?.address || "");
  const [enrichedItems, setEnrichedItems] = useState<EnrichedItem[]>([]);
  const [total, setTotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(10);

  useEffect(() => {
    const enrich = async () => {
      if (!customer || isGuest) {
        const { enrichedItems, discountSummary } = await applyDiscounts(cart, [], true, true);
        setEnrichedItems(enrichedItems);
        setDiscountPercent(discountSummary.first_order);
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
      } catch (error) {
        console.error("Failed to fetch purchased item IDs:", error);
      }
    };
    enrich();
  }, [cart, customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      customer_id: customer?.id || null,
      customer_name: customer?.name || name,
      customer_phone: customer?.phone_number || phone,
      customer_email: customer?.email || email,
      customer_address: customer?.address || address,
      status: "pending",
      total_amount: total,
      is_online: true,
      is_first_order_discount_applied: enrichedItems.some(i => i.appliedOffer === "first_order"),
      items: enrichedItems.map((item) => ({
        item: item.id,
        quantity: item.quantity,
        price: item.discountedPrice / item.quantity,
      })),
    };

    try {
      const response = await api.post("/orders/", orderData);
      const order = response.data;
      navigate("/order-confirmation", { state: { order } });
      clearCart();
      clearCustomer();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleRegistrationSuccess = () => {
    setWantsToRegister(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        
          {/* Left Column - Order Summary */}
          <div className="w-full max-w-none p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            <ul className="mb-4 divide-y text-sm">
              {enrichedItems.map((item) => (
                <li key={item.id} className="flex justify-between py-2">
                  <div>
                    <p>{item.name} × {item.quantity}</p>
                    {item.isFirstTimePurchase && (
                      <p className="text-xs text-green-600">
                        {discountPercent}% First-Time Discount Applied
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-800">₹{item.discountedPrice.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Original Total</span>
                <span>
                  ₹{enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Total Discount</span>
                <span>
                  -₹{enrichedItems.reduce((sum, item) => sum + item.discountAmount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Final Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Customer / Actions */}
          <div className="space-y-6">
            {/* Registered Customer Info */}
            {customer && !isGuest && (
              <div className="p-6 border border-green-300 rounded-lg bg-green-50 text-green-900 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Customer Details</h3>
                <p><strong>Name:</strong> {customer.name}</p>
                <p><strong>Phone:</strong> {customer.phone_number}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Address:</strong> {customer.address}</p>
              </div>
            )}

            {/* Guest Registration Prompt */}
            {isGuest && !wantsToRegister && (
              <div className="p-6 border rounded-lg bg-yellow-50 text-yellow-900 shadow-sm">
                <p className="mb-2">
                  You're continuing as a guest. Would you like to register before placing your order?
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setWantsToRegister(true)}
                  >
                    Yes, Register
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                    onClick={handleSubmit}
                  >
                    No, Continue as Guest
                  </button>
                </div>
              </div>
            )}

            {/* Registration Form for Guest */}
            {(!customer || wantsToRegister) && (
              <NewCustomerForm phone={guestPhone} onRegistered={handleRegistrationSuccess} />
            )}

            {/* Place Order Button */}
            {customer && !wantsToRegister && !(!customer || wantsToRegister) && (
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-3 rounded text-lg hover:bg-green-700 transition"
              >
                Place Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

/*import { useCart } from "../contexts/CartContext";
import { useCustomer } from "../contexts/CustomerContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewCustomerForm from "../components/NewCustomerForm";
import { applyDiscounts } from "../utils/Discount";
import api from "../utils/Api";
import type { EnrichedItem } from "../utils/Discount";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { customer, clearCustomer } = useCustomer();
  const isGuest = customer?.username === "guest";
  const navigate = useNavigate();
  const [wantsToRegister, setWantsToRegister] = useState(false);
  const [guestPhone, setGuestPhone] = useState("");
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone_number || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [enrichedItems, setEnrichedItems] = useState<EnrichedItem[]>([])
  const [total, setTotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(10);

  useEffect(() => {
    const enrich = async () => {
      if (!customer || isGuest) {
        const { enrichedItems, discountSummary } = await applyDiscounts(cart, [], true, true);
        setEnrichedItems(enrichedItems);
        setDiscountPercent(discountSummary.first_order);
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
      } catch (error) {
        console.error("Failed to fetch purchased item IDs:", error);
      }
    };
    enrich();
  }, [cart, customer]);

  const handleRegistrationSuccess = () => {
    setWantsToRegister(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      customer_id: customer?.id || null,
      customer_name: customer?.name || name,
      customer_phone: customer?.phone_number || phone,
      customer_email: customer?.email || email,
      customer_address: customer?.address || address,
      status: "pending",
      total_amount: total,
      is_online: true,
      is_first_order_discount_applied: enrichedItems.some(i => i.appliedOffer === "first_order"),
      items: enrichedItems.map((item) => ({
        item: item.id,
        quantity: item.quantity,
        price: item.discountedPrice / item.quantity,
      })),
    };
    try {
      console.log("Order Details", orderData);
      const response = await api.post("/orders/", orderData);
      const order = response.data;
      console.log("Order ", order);
      console.log("Before calling order-confirmation ");
      navigate("/order-confirmation", { state: { order } });
      console.log("After calling order-confirmation ");
      clearCart();
      clearCustomer();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {/* 🧾 Order Summary 
          {/*<div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
            <ul className="mb-4 divide-y">
              {enrichedItems.map((item) => (
                <li key={item.id} className="flex justify-between py-2">
                  <div>
                    <p>{item.name} × {item.quantity}</p>
                    {item.isFirstTimePurchase && (
                      <p className="text-sm text-green-600">
                        {discountPercent}% First-Time Discount Applied
                      </p>
                    )}
                  </div>
                  <span className="font-medium">₹{item.discountedPrice.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {/*  Price Breakdown *
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Original Total</span>
                <span>
                  ₹
                  {enrichedItems
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-green-700 font-medium">
                <span>Total Discount</span>
                <span>
                  -₹
                  {enrichedItems
                    .reduce((sum, item) => sum + item.discountAmount, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Final Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          </div>
          {/* 👤 Registered Customer Info *
          <div className="space-y-4">
            {customer && !isGuest && (
              <div className="mb-6 p-4 border border-green-300 rounded-lg bg-green-50 text-green-900">
                <h3 className="font-semibold text-lg mb-2">Customer Details</h3>
                <p><strong>Name:</strong> {customer.name}</p>
                <p><strong>Phone:</strong> {customer.phone_number}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Address:</strong> {customer.address}</p>
              </div>
            )}
          
          {/* 🧍 Guest Registration Prompt 
          {isGuest && !wantsToRegister && (
            <div className="mb-6 p-4 border rounded-lg bg-yellow-50 text-yellow-900">
              <p className="mb-2">
                You're continuing as a guest. Would you like to register before placing your order?
              </p>
              <div className="flex gap-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => setWantsToRegister(true)}
                >
                  Yes, Register
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={handleSubmit}
                >
                  No, Continue as Guest
                </button>
              </div>
            </div>
          )}
          {/* ✍️ Registration Form 
          {(!customer || wantsToRegister) && (
            <NewCustomerForm phone={guestPhone} onRegistered={handleRegistrationSuccess} />
          )}
          {/* ✅ Place Order 
          {customer && !wantsToRegister && !(!customer || wantsToRegister) && (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Place Order
            </button>
          )}
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
*/