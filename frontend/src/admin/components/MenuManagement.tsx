import { useEffect, useState } from "react";
import api from "../../utils/Api";

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = () => {
    api.get("/menu-categories/")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = () => {
    if (editingId) {
      api.put(`/menu-categories/${editingId}/`, { name })
        .then(() => {
          setEditingId(null);
          setName("");
          fetchCategories();
        });
    } else {
      api.post("/menu-categories/", { name })
        .then(() => {
          setName("");
          fetchCategories();
        });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this category?")) {
      api.delete(`/menu-categories/${id}/`)
        .then(fetchCategories);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>

      {/* Form */}
      <div className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category name"
          className="border px-2 py-1"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            onClick={() => { setEditingId(null); setName(""); }}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* List */}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat: any) => (
            <tr key={cat.id}>
              <td className="border px-2 py-1">{cat.name}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => { setEditingId(cat.id); setName(cat.name); }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuManagement;

/*
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
*/