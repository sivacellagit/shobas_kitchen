// src/admin/components/MenuItemFormModal.tsx
import { useEffect, useState } from "react";
import axios from "axios";


type Props = {
 isOpen: boolean;
 onClose: () => void;
 onSuccess: () => void;
 initialData?: {
   id?: number;
   name: string;
   price: number;
   image: string | null;
   category: number;
 };
};


type Category = {
 id: number;
 name: string;
};


const MenuItemFormModal = ({ isOpen, onClose, onSuccess, initialData }: Props) => {
 const [name, setName] = useState(initialData?.name || "");
 const [price, setPrice] = useState(initialData?.price || 0);
 const [image, setImage] = useState(initialData?.image || "");
 const [category, setCategory] = useState(initialData?.category || 0);
 const [categories, setCategories] = useState<Category[]>([]);


 useEffect(() => {
   if (!isOpen) return;


   setName(initialData?.name || "");
   setPrice(initialData?.price || 0);
   setImage(initialData?.image || "");
   setCategory(initialData?.category || 0);


   axios.get("/api/menu-categories/").then((res) => setCategories(res.data));
 }, [isOpen, initialData]);


 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   const payload = { name, price, image, category };


   try {
     if (initialData?.id) {
       await axios.put(`/api/menu-items/${initialData.id}/`, payload);
     } else {
       await axios.post("/api/menu-items/", payload);
     }
     onSuccess();
     onClose();
   } catch (error) {
     console.error("Error saving item", error);
     alert("Failed to save item.");
   }
 };


 if (!isOpen) return null;


 return (
   <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
     <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
       <h2 className="text-xl font-semibold mb-4">
         {initialData ? "Edit Item" : "Add New Item"}
       </h2>
       <form onSubmit={handleSubmit} className="space-y-4">
         <input
           type="text"
           placeholder="Item Name"
           className="w-full border p-2 rounded"
           value={name}
           onChange={(e) => setName(e.target.value)}
           required
         />
         <input
           type="number"
           placeholder="Price"
           className="w-full border p-2 rounded"
           value={price}
           onChange={(e) => setPrice(parseFloat(e.target.value))}
           required
         />
         <input
           type="text"
           placeholder="Image URL"
           className="w-full border p-2 rounded"
           value={image || ""}
           onChange={(e) => setImage(e.target.value)}
         />
         <select
           className="w-full border p-2 rounded"
           value={category}
           onChange={(e) => setCategory(parseInt(e.target.value))}
           required
         >
           <option value="">Select Category</option>
           {categories.map((cat) => (
             <option key={cat.id} value={cat.id}>
               {cat.name}
             </option>
           ))}
         </select>


         <div className="flex justify-end gap-2">
           <button
             type="button"
             onClick={onClose}
             className="bg-gray-400 text-white px-4 py-2 rounded"
           >
             Cancel
           </button>
           <button
             type="submit"
             className="bg-green-600 text-white px-4 py-2 rounded"
           >
             Save
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};


export default MenuItemFormModal;