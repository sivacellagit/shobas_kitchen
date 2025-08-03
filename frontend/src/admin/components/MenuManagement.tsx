import { useEffect, useState } from "react";
import axios from "axios";
import MenuItemFormModal from "./MenuItemFormModal";


type MenuItem = {
 id: number;
 name: string;
 price: number;
 image: string | null;
 category: number | { id: number; name: string };
};


const MenuManagement = () => {
 const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<MenuItem | null>(null);


 const fetchMenu = async () => {
   setLoading(true);
   try {
     const res = await axios.get("/api/menu-items/");
     setMenuItems(res.data);
   } catch (err) {
     console.error("Error loading menu items", err);
   } finally {
     setLoading(false);
   }
 };


 const handleDelete = async (itemId: number) => {
   const confirm = window.confirm("Are you sure you want to delete this item?");
   if (!confirm) return;


   try {
     await axios.delete(`/api/menu-items/${itemId}/`);
     fetchMenu();
   } catch (err) {
     console.error("Failed to delete item", err);
     alert("Failed to delete item. Please try again.");
   }
 };


 useEffect(() => {
   fetchMenu();
 }, []);


 return (
   <div>
     <div className="flex justify-between items-center mb-4">
       <h2 className="text-2xl font-bold">Menu Management</h2>
       <button
         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
         onClick={() => {
           setEditItem(null);
           setShowModal(true);
         }}
       >
         + Add Item
       </button>
     </div>


     {loading ? (
       <p>Loading...</p>
     ) : (
       <ul className="space-y-2">
         {menuItems.map((item) => (
           <li
             key={item.id}
             className="p-4 border rounded flex justify-between items-center"
           >
             <div>
               <p className="font-semibold">{item.name}</p>
               <p className="text-sm text-gray-600">₹{item.price}</p>
             </div>
             <div className="flex gap-3">
               <button
                 className="text-blue-600 hover:underline text-sm"
                 onClick={() => {
                   setEditItem(item);
                   setShowModal(true);
                 }}
               >
                 Edit
               </button>
               <button
                 className="text-red-600 hover:underline text-sm"
                 onClick={() => handleDelete(item.id)}
               >
                 Delete
               </button>
             </div>
           </li>
         ))}
       </ul>
     )}


     <MenuItemFormModal
       isOpen={showModal}
       onClose={() => setShowModal(false)}
       onSuccess={fetchMenu}
       initialData={editItem || undefined}
     />
   </div>
 );
};


export default MenuManagement;