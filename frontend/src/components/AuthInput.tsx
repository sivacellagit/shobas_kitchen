// src/components/AuthInput.tsx
import React from "react";


type Props = {
 label: string;
 type?: string;
 name: string;
 value: string;
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 required?: boolean;
};


const AuthInput: React.FC<Props> = ({
 label,
 type = "text",
 name,
 value,
 onChange,
 required = true,
}) => (
 <div className="mb-4">
   <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
     {label}
   </label>
   <input
     type={type}
     name={name}
     id={name}
     required={required}
     value={value}
     onChange={onChange}
     className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
   />
 </div>
);


export default AuthInput;