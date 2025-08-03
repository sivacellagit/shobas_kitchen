// src/components/PhoneNumberPrompt.tsx
import { useState } from "react";
import { useCustomer } from "../contexts/CustomerContext";


const PhoneNumberPrompt = () => {
 const [phone, setPhone] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const { fetchCustomerByPhone, isCustomerLoaded } = useCustomer();


 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);
   setError("");


   const found = await fetchCustomerByPhone(phone);
   if (!found) setError("Customer not found. Please register.");
   setLoading(false);
 };


 if (isCustomerLoaded) return null;


 return (
   <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
     <h2 className="text-xl font-semibold mb-2">Enter Phone Number</h2>
     <input
       type="tel"
       className="w-full border px-3 py-2 rounded mb-2"
       value={phone}
       onChange={(e) => setPhone(e.target.value)}
       placeholder="e.g. 9876543210"
       required
     />
     {error && <p className="text-sm text-red-500">{error}</p>}
     <button
       type="submit"
       className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
       disabled={loading}
     >
       {loading ? "Checking..." : "Check Customer"}
     </button>
   </form>
 );
};


export default PhoneNumberPrompt;