import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();


const AdminDashboard = () => {
 const { user } = useAuth();


 return (
   <div className="p-6 max-w-6xl mx-auto">
     <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>


     <div className="mb-4 text-lg">
       Welcome, <strong>{user?.user?.username || "Admin"}</strong>!
     </div>


     {/* Admin Panels */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {/* Menu Management */}
       <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition">
         <h2 className="text-xl font-semibold mb-2">Menu Management</h2>
         <p className="text-gray-600 text-sm mb-2">
           Create, update, or disable menu categories and items.
         </p>
         <button onClick={() => navigate("/admin/menu")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
           Go to Menu Management
         </button>
       </div>


       {/* Staff Management */}
       <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition">
         <h2 className="text-xl font-semibold mb-2">Staff Management</h2>
         <p className="text-gray-600 text-sm mb-2">
           Add or manage staff roles like cashier, chef, delivery.
         </p>
         <button onClick={() => navigate("/admin/staff")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
           Manage Staff
         </button>
       </div>


       {/* Order Reports */}
       <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition">
         <h2 className="text-xl font-semibold mb-2">Order Reports</h2>
         <p className="text-gray-600 text-sm mb-2">
           View daily, weekly, or custom date range reports.
         </p>
         <button onClick={() => navigate("/admin/orders")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
           View Reports
         </button>
       </div>


       {/* Loyalty Points */}
       <div className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition">
         <h2 className="text-xl font-semibold mb-2">Loyalty Program</h2>
         <p className="text-gray-600 text-sm mb-2">
           Manage loyalty point configurations and redemptions.
         </p>
         <button onClick={() => navigate("/admin/loyalty")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
           Loyalty Settings
         </button>
       </div>
     </div>
   </div>
 );
};


export default AdminDashboard;