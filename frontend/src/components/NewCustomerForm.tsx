// src/components/NewCustomerForm.tsx
import { useState, useEffect, useRef } from "react";
import { useCustomer } from "../contexts/CustomerContext";
import toast from "react-hot-toast";
import api from "../utils/Api";


type Props = {
 phone?: string;
 onRegistered?: () => void;
};


const NewCustomerForm = ({ phone = "", onRegistered }: Props) => {
 const [form, setForm] = useState({
   name: "",
   phone: phone,
   email: "",
   address: "",
   dateOfBirth: "",
   weddingDate: "",
 });


 const { saveNewCustomer } = useCustomer();
 const [loading, setLoading] = useState(false);
 const [phoneError, setPhoneError] = useState("");
 const phoneRef = useRef<HTMLInputElement | null>(null);


 useEffect(() => {
   setForm((prev) => ({ ...prev, phone }));
 }, [phone]);


 const handleChange = (
   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
   setForm({ ...form, [e.target.name]: e.target.value });
 };


 const handlePhoneBlur = async () => {
   if (!form.phone) return;

   try {
     const res = await api.get("/customers/check-phone/", {
       params: { phone: form.phone },
     });

     if (res.data.exists) {
       setPhoneError("Phone number already exists.");
       phoneRef.current?.focus();
     } else {
       setPhoneError("");
     }
   } catch (err) {
     console.error("Phone number check failed", err);
   }
 };


 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();


   if (phoneError) {
     toast.error("Please fix the phone number before submitting.");
     phoneRef.current?.focus();
     return;
   }


   setLoading(true);
   try {
     await saveNewCustomer(form);
     toast.success("Customer registered successfully!");
     if (onRegistered) onRegistered();
   } catch {
     toast.error("Failed to register. Please try again.");
   } finally {
     setLoading(false);
   }
 };


 return (
   <form
     onSubmit={handleSubmit}
     className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow space-y-5"
   >
     <h2 className="text-2xl font-semibold text-center text-gray-800">
       New Customer Details
     </h2>


     {/* Name */}
     <div className="relative w-full">
       <input
         name="name"
         id="name"
         value={form.name}
         onChange={handleChange}
         required
         className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
         placeholder=" "
       />
       <label
         htmlFor="name"
         className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
       >
         Name <span className="text-red-500">*</span>
       </label>
     </div>


     {/* Phone */}
     <div className="relative w-full">
       <input
         name="phone"
         id="phone"
         type="tel"
         value={form.phone}
         onChange={handleChange}
         onBlur={handlePhoneBlur}
         required
         ref={phoneRef}
         placeholder=""
         className={`peer w-full px-4 pt-6 pb-2 text-sm border ${
           phoneError ? "border-red-500" : "border-gray-300"
         } rounded-md focus:outline-none focus:ring-2 ${
           phoneError ? "focus:ring-red-500" : "focus:ring-green-500"
         }`}
       />
       <label
         htmlFor="phone"
         className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
       >
         Phone Number <span className="text-red-500">*</span>
       </label>
       {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
     </div>


     {/* Email */}
     <div className="relative w-full">
       <input
         name="email"
         id="email"
         value={form.email}
         onChange={handleChange}
         placeholder=""
         className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
       />
       <label
         htmlFor="email"
         className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
       >
         Email
       </label>
     </div>


     {/* Address */}
     <div className="relative w-full">
       <textarea
         name="address"
         id="address"
         value={form.address}
         onChange={handleChange}
         rows={3}
         placeholder=""
         className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
       />
       <label
         htmlFor="address"
         className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
       >
         Address
       </label>
     </div>


     {/* DOB & Wedding Date */}
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       <div className="relative w-full">
         <input
           name="dateOfBirth"
           id="dateOfBirth"
           type="date"
           value={form.dateOfBirth}
           onChange={handleChange}
           className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
         />
         <label
           htmlFor="dateOfBirth"
           className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
         >
           Date of Birth
         </label>
       </div>


       <div className="relative w-full">
         <input
           name="weddingDate"
           id="weddingDate"
           type="date"
           value={form.weddingDate}
           onChange={handleChange}
           className="peer w-full px-4 pt-6 pb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
         />
         <label
           htmlFor="weddingDate"
           className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
         >
           Wedding Date
         </label>
       </div>
     </div>


     {/* Submit */}
     <button
       type="submit"
       className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
       disabled={loading}
     >
       {loading ? "Registering..." : "Register & Continue"}
     </button>
   </form>
 );
};


export default NewCustomerForm;