// src/utils/api.tsx
import axios from "axios";


const api = axios.create({
// baseURL: "http://localhost:8000/api",
baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/",
//baseURL: "https://api.shobaskitchen.in/api/",
 headers: {
   "Content-Type": "application/json",
 },
});


export default api;
