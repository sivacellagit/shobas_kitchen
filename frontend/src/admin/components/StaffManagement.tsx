import { useEffect, useState } from "react";
import api from "../../utils/Api";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", contact: "" });

  const fetchStaff = () => {
    api.get("/employees/")
      .then(res => setStaff(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = () => {
    api.post("/employees/", form)
      .then(() => {
        setForm({ name: "", role: "", contact: "" });
        fetchStaff();
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this staff member?")) {
      api.delete(`/employees/${id}/`).then(fetchStaff);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>

      {/* Form */}
      <div className="mb-4 flex gap-2">
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          placeholder="Contact"
          value={form.contact}
          onChange={e => setForm({ ...form, contact: e.target.value })}
          className="border px-2 py-1"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add Staff
        </button>
      </div>

      {/* List */}
      <ul>
        {staff.map((s: any) => (
          <li key={s.id} className="mb-2 flex justify-between">
            {s.name} ({s.role}) - {s.contact}
            <button
              onClick={() => handleDelete(s.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffManagement;

/*import { useEffect, useState } from "react";
import axios from "axios";


type Branch = {
 id: number;
 name: string;
};


type Staff = {
 id: number;
 name: string;
 username: string;
 phone: string;
 role: string;
 is_active: boolean;
 branches: Branch[];
 joining_date: string;
 experience_years: number;
 skills: string[];
 emergency_contact: {
   name: string;
   phone: string;
 };
 address: string;
};


const StaffManagement = () => {
 const [staffList, setStaffList] = useState<Staff[]>([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingStaff, setEditingStaff] = useState<StaffForm | null>(null);
 const [branches, setBranches] = useState<Branch[]>([]); // Fetch this from backend




 const fetchStaff = async () => {
   try {
     const res = await axios.get("/api/staff/");
     setStaffList(res.data);
   } catch (err) {
     console.error("Failed to fetch staff", err);
   } finally {
     setLoading(false);
   }
 };


const handleAddStaff = () => {
 setEditingStaff(null); // Clear existing data
 setIsModalOpen(true);
};


const handleEditStaff = (staff: StaffForm) => {
 setEditingStaff(staff);
 setIsModalOpen(true);
};


const handleSaveStaff = async (staff: StaffForm) => {
 try {
   if (staff.id) {
     await axios.put(`/api/staff/${staff.id}/`, staff);
   } else {
     await axios.post("/api/staff/", staff);
   }
   fetchStaffs(); // Refresh list after save
   setIsModalOpen(false);
   setEditingStaff(null);
 } catch (error) {
   console.error("Failed to save staff:", error);
 }
};


 useEffect(() => {
   fetchStaff();
 }, []);


 return (
   <div className="max-w-7xl mx-auto p-6">
     <div className="flex justify-between items-center mb-6">
       <h2 className="text-2xl font-bold">Staff Management</h2>
       {/*<button
         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
         onClick={() => alert("TODO: Add staff modal")}
       >
         + Add Staff
       </button> 
       <button
         onClick={handleAddStaff}
         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
       >
         + Add Staff
       </button>
     </div>


     {loading ? (
       <p>Loading staff...</p>
     ) : staffList.length === 0 ? (
       <p>No staff found.</p>
     ) : (
       <div className="overflow-x-auto">
         <table className="min-w-full text-sm border border-gray-300 bg-white rounded-md overflow-hidden">
           <thead className="bg-gray-100">
             <tr>
               <th className="px-3 py-2 border">Name</th>
               <th className="px-3 py-2 border">Username</th>
               <th className="px-3 py-2 border">Role</th>
               <th className="px-3 py-2 border">Phone</th>
               <th className="px-3 py-2 border">Branches</th>
               <th className="px-3 py-2 border">Joining Date</th>
               <th className="px-3 py-2 border">Experience</th>
               <th className="px-3 py-2 border">Skills</th>
               <th className="px-3 py-2 border">Emergency Contact</th>
               <th className="px-3 py-2 border">Address</th>
               <th className="px-3 py-2 border">Status</th>
               <th className="px-3 py-2 border">Actions</th>
             </tr>
           </thead>
           <tbody>
             {staffList.map((staff) => (
               <tr key={staff.id} className="border-t hover:bg-gray-50">
                 <td className="px-3 py-2">{staff.name}</td>
                 <td className="px-3 py-2">{staff.username}</td>
                 <td className="px-3 py-2 capitalize">{staff.role}</td>
                 <td className="px-3 py-2">{staff.phone}</td>
                 <td className="px-3 py-2">
                   {staff.branches.map((b) => b.name).join(", ")}
                 </td>
                 <td className="px-3 py-2">{staff.joining_date}</td>
                 <td className="px-3 py-2">{staff.experience_years} yrs</td>
                 <td className="px-3 py-2">
                   <ul className="flex flex-wrap gap-1">
                     {staff.skills.map((skill, idx) => (
                       <li
                         key={idx}
                         className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                       >
                         {skill}
                       </li>
                     ))}
                   </ul>
                 </td>
                 <td className="px-3 py-2">
                   <div className="text-sm">
                     <p>{staff.emergency_contact.name}</p>
                     <p className="text-gray-600">{staff.emergency_contact.phone}</p>
                   </div>
                 </td>
                 <td className="px-3 py-2">{staff.address}</td>
                 <td className="px-3 py-2">
                   <span
                     className={`text-xs font-semibold px-2 py-1 rounded-full ${
                       staff.is_active
                         ? "bg-green-100 text-green-800"
                         : "bg-red-100 text-red-800"
                     }`}
                   >
                     {staff.is_active ? "Active" : "Inactive"}
                   </span>
                 </td>
                 <td className="px-3 py-2">
                 {/*  <button
                     onClick={() => alert("TODO: Edit Staff")}
                     className="text-blue-600 hover:underline mr-3"
                   >
                     Edit
                   </button> 
                   <button
                     onClick={() => handleEditStaff(staff)}
                     className="text-blue-600 hover:underline"
                   >
                     Edit
                   </button>
                   <button
                     onClick={() => alert("TODO: Delete Staff")}
                     className="text-red-600 hover:underline"
                   >
                     Delete
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )}
     <StaffModal
       isOpen={isModalOpen}
       onClose={() => {
         setIsModalOpen(false);
         setEditingStaff(null);
       }}
       initialData={editingStaff || undefined}
       onSubmit={handleSaveStaff}
       branches={branches}
     />
   </div>
  
 );
};


export default StaffManagement;
*/