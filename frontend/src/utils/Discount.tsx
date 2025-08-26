// src/utils/Discount.tsx
import api from "./Api";




export type CartItem = {
id: number;
name: string;
price: number;
quantity: number;
};




export type EnrichedItem = CartItem & {
 isFirstTimePurchase: boolean;
 discountAmount: number;
 discountedPrice: number;
 appliedOffer: "first_order" | "item_level" | null;
};

/*
type OfferData = {
 purchased_item_ids: number[];
 has_prior_orders: boolean;
};
*/

export async function applyDiscounts(
 cartItems: CartItem[],
 purchasedItemIds: number[],
 hasPriorOrders: boolean,
 isGuest: boolean
): Promise<{ enrichedItems: EnrichedItem[]; discountSummary: { first_order: number; item_level: number } }> {
 // Guests get no discount — return items as-is
 if (isGuest) {
   const enrichedItems = cartItems.map((item) => ({
     ...item,
     isFirstTimePurchase: false,
     discountAmount: 0,
     discountedPrice: item.price * item.quantity,
     appliedOffer: null,
   }));


   return {
     enrichedItems,
     discountSummary: {
       first_order: 0,
       item_level: 0,
     },
   };
 }


 // Default discount values
 let firstOrderDiscount = 10;
 let itemLevelDiscount = 10;


 try {
   const res = await api.get("/config/discounts/");
   firstOrderDiscount = parseFloat(res.data.first_order_discount_percent || "10");
   itemLevelDiscount = parseFloat(res.data.first_time_discount_percent || "10");
 } catch (err) {
   console.warn("Discount config fetch failed. Using defaults.");
 }


 let enrichedItems: EnrichedItem[] = [];


 if (!hasPriorOrders) {
   // First order — apply discount to all items
   enrichedItems = cartItems.map((item) => {
     const discountAmount = (item.price * item.quantity * firstOrderDiscount) / 100;
     return {
       ...item,
       isFirstTimePurchase: true,
       discountAmount,
       discountedPrice: item.price * item.quantity - discountAmount,
       appliedOffer: "first_order",
     };
   });
 } else {
   // Not first order — apply item-level discount where eligible
   enrichedItems = cartItems.map((item) => {
     const isFirstTime = !purchasedItemIds.includes(item.id);
     const discountAmount = isFirstTime
       ? (item.price * item.quantity * itemLevelDiscount) / 100
       : 0;


     return {
       ...item,
       isFirstTimePurchase: isFirstTime,
       discountAmount,
       discountedPrice: item.price * item.quantity - discountAmount,
       appliedOffer: isFirstTime ? "item_level" : null,
     };
   });
 }


 return {
   enrichedItems,
   discountSummary: {
     first_order: firstOrderDiscount,
     item_level: itemLevelDiscount,
   },
 };
}
