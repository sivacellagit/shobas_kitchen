// src/contexts/CustomerContext.tsx

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
//import axios from "axios";
import api from "../utils/Api";
//import toast from "react-hot-toast";


export type Customer = {
 username?: string; // Optional username or user id
 id?: string;
 name: string;
 phone_number: string;
 email?: string;
 address: string;
 date_of_birth?: string;      // ISO string format (YYYY-MM-DD)
 wedding_date?: string;
 joining_date?: string;
 loyalty_points?: number;
};

export type CustomerForm = {
  phone: string;
  name: string;
  email?: string;
  address: string;
  dateOfBirth?: string;
  weddingDate?: string;
};

type CustomerContextType = {
  customer: Customer | null;
  isCustomerLoaded: boolean;
  customerNotFound: boolean;
  fetchCustomerByPhone: (phone: string) => Promise<boolean>;
  saveNewCustomer: (form: CustomerForm) => Promise<void>;
  setCustomer: (customer: Customer | null) => void;
  clearCustomer: () => void;
};

/*
type CustomerContextType = {
 customer: Customer | null;
 setCustomer: (customer: Customer) => void;
 clearCustomer: () => void;
};




type CustomerContextType = {
 customer: Customer | null;
 isCustomerLoaded: boolean;
 customerNotFound: boolean;
 fetchCustomerByPhone: (phone: string) => Promise<boolean>;
 saveNewCustomer: (form: any) => Promise<void>;
 setCustomer: (customer: Customer) => void; // ✅ expose this
 clearCustomer: () => void;
};
*/
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);
//const CustomerContext = createContext<any>(null);


export const CustomerProvider = ({ children }: { children: ReactNode }) => {
// const [customer, setCustomerState] = useState(null);
 const [customer, setCustomerState] = useState<Customer | null>(null);
 const [customerNotFound, setCustomerNotFound] = useState(false);


 const fetchCustomerByPhone = async (phone: string) => {
   try {
     console.log("Checking customer with phone: from fetchCustomerByPhone", phone);
     const res = await api.get(`/customers/lookup?phone=${phone}`);
     setCustomerState(res.data);
     setCustomerNotFound(false);
     console.log("Customer found:", res.data);
     return true;
   } catch {
     setCustomerState(null);
     setCustomerNotFound(true);
     return false;
   }
 };

/*
const checkPhoneExists = async (phone: string) => {
 //const res = await axios.get(`/api/customers/lookup/?phone=${phone}`);
 const res = await api.get(`/customers/lookup?phone=${phone}`);
 return res.data.exists; // You must implement this backend if needed
};


const saveNewCustomer = async (form: any) => {
 try {
   const payload = {
     phone_number: form.phone,
     name: form.name,
     email: form.email,
     address: form.address,
     date_of_birth: form.dateOfBirth || null,
     wedding_date: form.weddingDate || null,
   };
   console.log("Payload",payload)
   if (!checkPhoneExists(payload.phone_number))
   {
     const res = await axios.post("/api/customers/", payload);
     setCustomerState(res.data);
     setCustomerNotFound(false);
   }
   else
   {
     toast.error("Customer already exists with the Phone number");
   }
 }
 catch (error) {
       console.error("Failed to register customer:", error);
   }
};
*/


const saveNewCustomer = async (form: CustomerForm) => {
try {
  const payload = {
    phone_number: form.phone,
    name: form.name,
    email: form.email,
    address: form.address,
    date_of_birth: form.dateOfBirth || null,
    wedding_date: form.weddingDate || null,
  };
  console.log("Payload",payload)
  const res = await api.post("/customers/", payload);
  setCustomerState(res.data);
  setCustomerNotFound(false);
} catch (error: any) {
   console.error("Failed to register customer:", error);
   console.error("Server response:", error?.response?.data);
   throw error;
}
};


const clearCustomer = () => {
 setCustomerState(null);         // clear selected customer
 setCustomerNotFound(false);     // reset lookup flag
};


return (
   <CustomerContext.Provider value={{
     customer,
     isCustomerLoaded: !!customer,
     customerNotFound,
     fetchCustomerByPhone,
     setCustomer: setCustomerState, 
     saveNewCustomer,
     clearCustomer,
   }}>
     {children}
   </CustomerContext.Provider>
 );
};


export const useCustomer = () => {
 const context = useContext(CustomerContext);
 if (!context) {
   throw new Error("useCustomer must be used within a CustomerProvider");
 }
 return context;
};
