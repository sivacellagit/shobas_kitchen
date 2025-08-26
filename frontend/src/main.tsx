import React from "react";
import ReactDOM from "react-dom/client";
/*import {
 createBrowserRouter,
 RouterProvider,
} from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
*/
import axios from "axios";
import App from "./App";
import "./index.css";
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'react-hot-toast'


ReactDOM.createRoot(document.getElementById("root")!).render(
 <React.StrictMode>
     <CartProvider>
       <App />
       <Toaster position="bottom-center" reverseOrder={false} />
     </CartProvider>
 </React.StrictMode>
);


axios.interceptors.request.use((config) => {
 const token = localStorage.getItem("token");
 if (token) {
   config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});
