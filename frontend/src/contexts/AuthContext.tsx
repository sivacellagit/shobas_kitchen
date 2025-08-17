import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// --- Types ---
type Role = "customer" | "staff" | "admin" | null;


type AuthContextType = {
 isAuthenticated: boolean;
 role: Role;
 user: any;
 login: (access: string, refresh: string) => void;
 logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);


// --- Helper to decode JWT ---
const decodeToken = (token: string): any => {
 try {
   return jwtDecode(token);
 } catch {
   return null;
 }
};


// --- Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
 const [user, setUser] = useState<any>(null);
 const [role, setRole] = useState<Role>(null);
 const [isAuthenticated, setIsAuthenticated] = useState(false);


 useEffect(() => {
   const token = localStorage.getItem("accessToken");
   if (token) {
     const decoded = decodeToken(token);
     if (decoded && decoded.exp * 1000 > Date.now()) {
       setUser(decoded);
       setRole(decoded.role || null);
       setIsAuthenticated(true);
     } else {
       logout(); // expired
     }
   }
 }, []);


 const login = (access: string, refresh: string) => {
   localStorage.setItem("accessToken", access);
   localStorage.setItem("refreshToken", refresh);
   const decoded = decodeToken(access);
   setUser(decoded);
   setRole(decoded?.role || null);
   setIsAuthenticated(true);
 };


 const logout = () => {
   localStorage.removeItem("accessToken");
   localStorage.removeItem("refreshToken");
   setUser(null);
   setRole(null);
   setIsAuthenticated(false);
 };


 return (
   <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout }}>
     {children}
   </AuthContext.Provider>
 );
};


// --- Hook for access ---
export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
   throw new Error("useAuth must be used within AuthProvider");
 }
 return context;
};
