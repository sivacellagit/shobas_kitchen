import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerLogin from "../pages/login/CustomerLogin";
import StaffLogin from "../pages/login/StaffLogin";
import AdminLogin from "../pages/login/AdminLogin";
import CustomerDashboard from "../dashboards/CustomerDashboard";
import StaffDashboard from "../dashboards/StaffDashboard";
import AdminDashboard from "../dashboards/admin/AdminDashboard";


const AppRouter = () => (
 <Router>
   <Routes>
     <Route path="/login/customer" element={<CustomerLogin />} />
     <Route path="/login/staff" element={<StaffLogin />} />
     <Route path="/login/admin" element={<AdminLogin />} />


     <Route path="/customer/dashboard" element={<CustomerDashboard />} />
     <Route path="/staff/dashboard" element={<StaffDashboard />} />
     <Route path="/admin/dashboard" element={<AdminDashboard />} />
   </Routes>
 </Router>
);


export default AppRouter;