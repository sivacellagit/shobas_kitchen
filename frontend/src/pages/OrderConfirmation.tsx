// src/pages/OrderConfirmation.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../utils/Api";
//import { useCustomer } from "../contexts/CustomerContext";


const OrderConfirmation = () => {
 const location = useLocation();
 const navigate = useNavigate();
 const order = location.state?.order;
 //const { customer } = useCustomer();
 const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);
 const customer = order.customer || {};


 useEffect(() => {
   if (!order) navigate("/");
 }, [order, navigate]);


 useEffect(() => {
   const fetchPoints = async () => {
     if (customer?.id) {
       try {
         console.log("Fetching loyalty points for customer:", customer.id);
         const res = await api.get(`/customers/loyalty/total/${customer.id}/`);
         console.log("Loyalty points response:", res.data);
         setLoyaltyPoints(res.data.total_points);
       } catch (err) {
         console.error("Failed to fetch loyalty points", err);
       }
     }
   };


   fetchPoints();
 }, [customer]);


 if (!order) return null;


 //const customer = order.customer || {};
 const items = order.items || [];


 const totalAmount = parseFloat(order.total_amount || "0");


 const calculateOriginalTotal = () => {
   return items.reduce((sum : any, item : any) => {
     const originalPricePerUnit = item.item_detail.price || 0;
     return sum + originalPricePerUnit * item.quantity;
   }, 0);
 };


 const handleSendWhatsApp = async () => {
   try {
     const response = await api.post("/orders/send_whatsapp_message/", {
       order_id: order.id,
     });


     const data = response.data;
     if (data.success) {
       alert("Receipt prepared successfully (to be sent via WhatsApp)");
       console.log("WhatsApp Message:\n", data.message); // For preview
     } else {
       alert("Failed to generate receipt.");
     }
   } catch (error) {
     console.error("Error sending WhatsApp receipt:", error);
     alert("Failed to send receipt. Please try again.");
   }
 };


 const handleSendSMS = () => {
   // TODO: Integrate SMS API (e.g., Twilio SMS or AWS SNS)
 };


 const originalTotal = calculateOriginalTotal();
 const discountAmount = originalTotal - totalAmount;


 const printInvoice = async () => {
   const input = document.getElementById("invoice-section");
   if (!input) return;


   const canvas = await html2canvas(input);
   const imgData = canvas.toDataURL("image/png");


   const pdf = new jsPDF();
   const imgProps = pdf.getImageProperties(imgData);
   const pdfWidth = pdf.internal.pageSize.getWidth();
   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;


   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
   pdf.save(`invoice_order_${order.id}.pdf`);
 };


 return (
  <div className="max-w-3xl mx-auto px-4 py-8 bg-white rounded shadow">
  <div id="invoice-section" className="max-w-3xl mx-auto px-4 py-8 bg-white rounded shadow">
     <h1 className="text-3xl font-bold mb-6 text-green-700">Thank You For The Order!</h1>
     <div className="mb-4 text-gray-800">
       <p><strong>Order ID:</strong> #{order.id}</p>
       <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>       
       {/*<h2 className="text-xl font-semibold">Customer Details</h2>*/}
       <p><strong>Customer Name:</strong> {customer.name}</p>
       <p><strong>Phone:</strong> {customer.phone_number}</p>
       {customer.email && <p><strong>Email:</strong> {customer.email}</p>}
       {customer.address && <p><strong>Address:</strong> {customer.address}</p>}
     </div>

     <div className="mb-6">
       <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
       <table className="w-full mt-2 text-sm border-t border-b">
         <thead>
           <tr className="text-left text-gray-600">
             <th className="py-2">Item</th>
             <th>Qty</th>
             <th>Unit Price</th>
             <th>Total</th>
           </tr>
         </thead>
         <tbody>
           {items.map((item: any, idx: number) => (
             <tr key={idx} className="border-t text-gray-700">
               <td className="py-2">{item.item_detail?.name || "Unnamed Item"}</td>
               <td>{item.quantity}</td>
               <td>₹{parseFloat(item.item_detail.price).toFixed(2)}</td>
               <td>₹{(parseFloat(item.item_detail.price) * parseInt(item.quantity)).toFixed(2)}</td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     <div className="text-right text-lg font-semibold text-gray-700">
       <p>Subtotal: ₹{originalTotal.toFixed(2)}</p>
       {discountAmount > 0 && (
         <p className="text-green-600">Discount: -₹{discountAmount.toFixed(2)}</p>
       )}
       <p className="text-black text-xl mt-2">Total Paid: ₹{totalAmount.toFixed(2)}</p>
     </div>
     <h1 className="text-3xl font-bold mb-6 text-green-700">Visit Us Again!</h1>
   </div>   
   <div className="max-w-3xl p-4 bg-white rounded-lg shadow mt-4 text-center">
     {loyaltyPoints !== null && (
       <p className="text-green-700 text-lg font-medium">
         🎉 You have <strong>{loyaltyPoints}</strong> loyalty points!
       </p>
     )}
   </div>
   <div id="invoice-section" className="max-w-3xl mx-auto px-4 py-4 bg-white rounded shadow">
     <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
       <button
         onClick={printInvoice}
         //className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
         className="btn-outline">
         Download Invoice (PDF)
       </button>
       <button onClick={handleSendWhatsApp} className="btn-outline">
         📲 Send via WhatsApp
       </button>
       <button onClick={handleSendSMS} className="btn-outline">
         📩 Send as SMS
       </button>
     </div>
   </div>   
   </div>   
 );
};


export default OrderConfirmation;