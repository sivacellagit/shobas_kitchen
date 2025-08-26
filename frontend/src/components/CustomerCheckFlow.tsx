// src/components/CustomerCheckFlow.tsx
import { useEffect, useState } from "react";
import { useCustomer } from "../contexts/CustomerContext";
import NewCustomerForm from "./NewCustomerForm";
import toast from "react-hot-toast";
import api from "../utils/Api";

const CustomerCheckFlow = () => {
 const [phone, setPhone] = useState("");
 const [loading, setLoading] = useState(false);
 const { customer, isCustomerLoaded, customerNotFound, fetchCustomerByPhone, setCustomer } = useCustomer();


 useEffect(() => {
   if (isCustomerLoaded && customer) {
     toast.success(`Welcome back, ${customer.name}!`);
   }
 }, [isCustomerLoaded, customer]);


 const handleGuestContinue = async () => {
   try {
     const res = await api("/customers/guest/");
     setCustomer(res.data);
     console.log("Guest customer loaded:", res.data);
     toast.success("Continuing as Guest");
     //onCustomerVerified();
   } catch (err) {
     toast.error("Failed to load guest profile");
   }
 };


 const handlePhoneSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
  
   if (!/^\d{10}$/.test(phone)) {
     toast.error("Please enter a valid 10-digit phone number");
     return;
   }
   setLoading(true);


   try {
    console.log("Checking customer with phone: before fetchCustomerByPhone", phone);
     await fetchCustomerByPhone(phone);
     console.log("Checking customer with phone: after fetchCustomerByPhone", phone);
   } catch (err) {
     toast.error("Something went wrong while checking the customer. Please try again.");
   } finally {
     setLoading(false);
   }


 };


 if (isCustomerLoaded && customer) {
   return (
     <div className="text-center p-4 bg-green-50 border border-green-300 rounded shadow">
       <h2 className="text-lg font-bold text-green-700">Customer Found</h2>
       <p className="text-gray-700">Welcome, {customer.name}!</p>
     </div>
   );
 }


 return (
   <div className="max-w-md mx-auto p-4">
     {!customerNotFound ? (
       <form onSubmit={handlePhoneSubmit} className="space-y-3">
         <h2 className="text-xl font-semibold">Enter Phone Number</h2>
         <input
           type="tel"
           name="phone"
           value={phone}
           onChange={(e) => setPhone(e.target.value)}
           required
           className="input"
           placeholder="e.g. 9876543210"
         />
         <div className="flex flex-col sm:flex-row justify-between gap-3">
         {/*<button
           type="submit"
           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
           disabled={loading}
         >
           {loading ? "Checking..." : "Check Customer"}
         </button> */}
                 <button
         onClick={handlePhoneSubmit}
         className="flex-1 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
       >
         {loading ? "Checking..." : "Check Customer"}
       </button>
         <button
         onClick={handleGuestContinue}
         className="flex-1 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
       >
         Continue as Guest
       </button>
       </div>
       </form>
     ) : (
       <NewCustomerForm phone={phone} />
     )}
   </div>
 );
};


export default CustomerCheckFlow;