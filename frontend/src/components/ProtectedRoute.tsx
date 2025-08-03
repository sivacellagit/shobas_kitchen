import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";


type ProtectedRouteProps = {
 requiredRole: "customer" | "staff" | "admin";
};


const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
 const { user, isAuthenticated } = useAuth();


 // Not logged in — redirect to login
 if (!isAuthenticated) {
   switch (requiredRole) {
     case "staff":
       return <Navigate to="/staff/login" replace />;
     case "admin":
       return <Navigate to="/admin/login" replace />;
     default:
       return <Navigate to="/customer/login" replace />;
   }
 }


 // Logged in but wrong role
 if (user?.role !== requiredRole) {
   return <Navigate to="/" replace />;
 }


 // Authorized
 return <Outlet />;
};


export default ProtectedRoute;