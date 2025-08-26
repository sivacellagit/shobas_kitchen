import { useEffect, useState } from "react";


type Branch = {
 id: number;
 name: string;
};

type StaffForm = {
 id?: number;
 name: string;
 username: string;
 phone: string;
 role: string;
 branches: number[];
 joining_date: string;
 experience_years: number;
 skills: string;
 emergency_contact_name: string;
 emergency_contact_phone: string;
 address: string;
 is_active: boolean;
};


type StaffModalProps = {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (data: StaffForm) => void;
 initialData?: StaffForm;
 branches: Branch[];
};


const StaffModal = ({ isOpen, onClose, onSubmit, initialData, branches }: StaffModalProps) => {
 const [formData, setFormData] = useState<StaffForm>({
   name: "",
   username: "",
   phone: "",
   role: "",
   branches: [],
   joining_date: "",
   experience_years: 0,
   skills: "",
   emergency_contact_name: "",
   emergency_contact_phone: "",
   address: "",
   is_active: true,
 });


 useEffect(() => {
   if (initialData) {
     setFormData(initialData);
   }
 }, [initialData]);

/*
 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
   const { name, value, type, checked } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: type === "checkbox" ? checked : value,
   }));
 };
*/

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;
  const newValue =
    type === "checkbox" && e.target instanceof HTMLInputElement
      ? e.target.checked
      : value;

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};

 const handleBranchChange = (id: number) => {
   setFormData(prev => {
     const updated = prev.branches.includes(id)
       ? prev.branches.filter(b => b !== id)
       : [...prev.branches, id];
     return { ...prev, branches: updated };
   });
 };


 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   onSubmit(formData);
 };


 if (!isOpen) return null;


 return (
   <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-start pt-16 px-4">
     <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh] relative">
       <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl">
         &times;
       </button>


       <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Staff" : "Add Staff"}</h2>


       <form onSubmit={handleSubmit} className="space-y-4 text-sm">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <input name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" className="input" />
           <input name="username" value={formData.username} onChange={handleChange} required placeholder="Username" className="input" />
           <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone" className="input" />
           <input name="role" value={formData.role} onChange={handleChange} required placeholder="Role (e.g. chef, manager)" className="input" />
           <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} required className="input" />
           <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} required placeholder="Experience (years)" className="input" />
           <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (comma-separated)" className="input" />
           <input name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} placeholder="Emergency Contact Name" className="input" />
           <input name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} placeholder="Emergency Contact Phone" className="input" />
         </div>


         <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" rows={3} />


         <div>
           <label className="block mb-1 font-medium">Branches</label>
           <div className="flex flex-wrap gap-2">
             {branches.map(branch => (
               <label key={branch.id} className="flex items-center gap-1 text-sm">
                 <input
                   type="checkbox"
                   checked={formData.branches.includes(branch.id)}
                   onChange={() => handleBranchChange(branch.id)}
                 />
                 {branch.name}
               </label>
             ))}
           </div>
         </div>


         <label className="flex items-center gap-2 mt-2">
           <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
           Active
         </label>


         <div className="flex justify-end mt-4">
           <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
             {initialData ? "Update Staff" : "Add Staff"}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};


export default StaffModal;