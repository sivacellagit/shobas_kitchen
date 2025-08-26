import { useEffect, useState } from "react";
//import axios from "axios";
import { useCart } from "../../contexts/CartContext";
import { useCustomer } from "../../contexts/CustomerContext";
import CustomerCheckFlow from "../../components/CustomerCheckFlow";
import { applyDiscounts } from "../../utils/Discount";
import type { EnrichedItem } from "../../utils/Discount";
import api from "../../utils/Api";
import toast from "react-hot-toast";

type MenuCategory = {
id: number;
name: string;
};

type MenuItem = {
id: number;
name: string;
price: number | string;
image: string | null;
category: number | { id: number; name: string };
};


const Menu = ({ isPublicView = false }: { isPublicView?: boolean }) => {
const [categories, setCategories] = useState<MenuCategory[]>([]);
const [items, setItems] = useState<MenuItem[]>([]);
const [filteredCategory, setFilteredCategory] = useState<number | null>(null);
const [loading, setLoading] = useState(true);
const [, setShowModal] = useState(false);
//const [searchQuery, setSearchQuery] = useState("");
const [discountedItems, setDiscountedItems] = useState<{ [key: number]: EnrichedItem }>({});
const { addToCart } = useCart();
//const { isCustomerLoaded, customerNotFound, customer } = useCustomer();
const { customer } = useCustomer();

// Show modal when no customer is loaded
useEffect(() => {
  if (!customer) setShowModal(true);
}, [customer]);


useEffect(() => {
  const fetchData = async () => {
    try {
      const categoryRes = await api.get("/menu-categories/");
      const itemRes = await api.get("/menu-items/");
      setCategories(categoryRes.data);
      setItems(itemRes.data);
      console.log("Menu categories:", categoryRes.data);
      console.log("Menu items:", itemRes.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setCategories([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

useEffect(() => {
  const fetchDiscounts = async () => {
    const isGuest = customer?.username === "guest";
    console.log("Fetching discounts for customer:", customer?.id, "isGuest:", isGuest);
    if (!customer || isGuest) return;
    console.log("After Fetching discounts for customer:", customer?.id, "isGuest:", isGuest);
    try {
      const res = await api(`/orders/purchased-items/?customer_id=${customer.id}`);
      const purchasedIds = res.data.purchased_item_ids || [];
      const hasPriorOrders = res.data.has_prior_orders || false;

      // Create dummy cart with each item (quantity = 1)
      const dummyCart = Array.isArray(items) && items.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
      }));

      if (dummyCart) {    
          const { enrichedItems } = await applyDiscounts(dummyCart, purchasedIds, hasPriorOrders, false);
          const itemMap: { [key: number]: EnrichedItem } = {};
          enrichedItems.forEach((enriched) => {
            itemMap[enriched.id] = enriched;
          });

          setDiscountedItems(itemMap);
    }
    } catch (error) {
      console.error("Failed to fetch discount info:", error);
    }
  };
  fetchDiscounts();
}, [customer, items]);

const filteredItems = filteredCategory
  ? items.filter((item) =>
      typeof item.category === "number"
        ? item.category === filteredCategory
        : item.category.id === filteredCategory
    )
  : items;

return (
  <div className="overflow-x-auto w-full max-w-[100vw] px-4 sm:px-6">
    <h1 className="text-3xl font-bold mb-4">
       {isPublicView ? "Explore Our Menu" : "POS Menu"}
    </h1>

    {isPublicView && (
      <div className="bg-yellow-50 text-yellow-800 border border-yellow-300 p-4 mb-4 rounded">
        This menu is for viewing only. To place an order, please visit us in person at Shoba’s Kitchen – Curry Club.
      </div>
    )}


    {!isPublicView && !customer ? (
      <div className="text-center py-20 text-gray-600">
        <CustomerCheckFlow />
      </div>
    ) : (
      <>
        {/* Optional Search
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
         */}


        {/* Category filter buttons */}
        <div className="flex flex-nowrap gap-2 mb-6 pb-2 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setFilteredCategory(null)}
            className={`whitespace-nowrap min-w-[80px] px-4 py-2 rounded-full border text-sm font-medium transition ${
              !filteredCategory ? "bg-green-600 text-white" : "bg-white text-black"
            }`}
          >
            All
          </button>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-9 rounded-full bg-gray-200 animate-pulse"
                ></div>
              ))
            : Array.isArray(categories) && categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilteredCategory(category.id)}
                  className={`min-w-[80px] px-4 py-2 rounded-full border text-sm font-medium transition ${
                    filteredCategory === category.id
                      ? "bg-green-600 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {category.name}
                </button>
              ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-4 animate-pulse space-y-3"
                >
                  <div className="h-40 bg-gray-200 rounded-md"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 rounded w-full mt-2"></div>
                </div>
              ))
            : filteredItems.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">
                  No menu items found.
                </p>
              ) : (
                Array.isArray(filteredItems) && filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-md">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold mb-1">
                          {item.name}
                        </h2>
        {!isPublicView ? (
          discountedItems[item.id] && discountedItems[item.id].discountAmount > 0 ? (
            <div className="mb-2 space-y-1">
              <p className="text-sm text-gray-500 line-through">
                ₹{item.price}
              </p>
              <p className="text-sm font-semibold text-green-600">
                ₹{discountedItems[item.id].discountedPrice.toFixed(2)}{" "}
                <span className="ml-1 text-xs text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                  {discountedItems[item.id].appliedOffer === "first_order"
                    ? "First Order Discount"
                    : `${discountedItems[item.id].discountAmount > 0 ? "First-Time Item Discount" : ""}`}
                  {" "}
                  ({(
                    (discountedItems[item.id].discountAmount /
                      (discountedItems[item.id].price * discountedItems[item.id].quantity)) *
                    100
                  ).toFixed(0)}% off)
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mb-2">₹{item.price}</p>
          )
        ) : (
          <p className="text-sm text-gray-600 mb-2">₹{item.price}</p>
        )}
      </div>
        {!isPublicView && (
          <button
            className="mt-auto w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            onClick={() => {
              addToCart({ ...item, price: Number(item.price), image: item.image || "" });
              toast.success(`${item.name} added to the cart`);
            }
            }
          >
            Add to Cart   
          </button>
           )}  
           
        </div>
      </div>
                ))
              )}
        </div>
      </>
    )}
  </div>
);
};




export default Menu;