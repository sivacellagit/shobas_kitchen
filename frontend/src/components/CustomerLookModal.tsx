// src/components/CustomerLookupModal.tsx
import React, { useState } from "react";
import axios from "axios";
import { useCustomer } from "../contexts/CustomerContext";


interface CustomerLookupModalProps {
 isOpen: boolean;
 onClose: () => void;
}


const CustomerLookupModal: React.FC<CustomerLookupModalProps> = ({ isOpen, onClose }) => {
 const [phone, setPhone] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [newCustomer, setNewCustomer] = useState(false);
 const [details, setDetails] = useState({ name: "", address: "" });
 const { setCustomer } = useCustomer();


 const handleSearch = async () => {
   setLoading(true);
   setError("");
   try {
     const res = await axios.get(`/api/customers/?phone=${phone}`);
     if (res.data) {
       setCustomer(res.data);
       onClose();
     } else {
       setNewCustomer(true);
     }
   } catch (err) {
     setNewCustomer(true);
   } finally {
     setLoading(false);
   }
 };


 const handleRegister = async () => {
   setLoading(true);
   try {
     const res = await axios.post("/api/customers/", {
       phone_number: phone,
       name: details.name,
       address: details.address,
     });
     setCustomer(res.data);
     onClose();
   } catch (err) {
     setError("Registration failed. Please try again.");
   } finally {
     setLoading(false);
   }
 };


 if (!isOpen) return null;


 return (
   <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
     <div className="bg-white p-6 rounded-xl w-full max-w-md">
       <h2 className="text-xl font-bold mb-4">Customer Lookup</h2>


       <input
         type="text"
         placeholder="Enter Phone Number"
         className="w-full p-2 border rounded mb-4"
         value={phone}
         onChange={(e) => setPhone(e.target.value)}
       />


       {newCustomer && (
         <>
           <input
             type="text"
             placeholder="Name"
             className="w-full p-2 border rounded mb-2"
             value={details.name}
             onChange={(e) => setDetails({ ...details, name: e.target.value })}
           />
           <textarea
             placeholder="Address"
             className="w-full p-2 border rounded mb-2"
             value={details.address}
             onChange={(e) => setDetails({ ...details, address: e.target.value })}
           ></textarea>
         </>
       )}


       {error && <p className="text-red-500 text-sm mb-2">{error}</p>}


       <div className="flex justify-end gap-2">
         <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
           Cancel
         </button>
         {!newCustomer ? (
           <button
             onClick={handleSearch}
             className="px-4 py-2 bg-green-600 text-white rounded"
             disabled={loading}
           >
             {loading ? "Searching..." : "Search"}
           </button>
         ) : (
           <button
             onClick={handleRegister}
             className="px-4 py-2 bg-blue-600 text-white rounded"
             disabled={loading}
           >
             {loading ? "Registering..." : "Register"}
           </button>
         )}
       </div>
     </div>
   </div>
 );
};


export default CustomerLookupModal;