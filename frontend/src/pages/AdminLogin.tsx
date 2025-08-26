import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/Api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [loginId, setLoginId] = useState("");   // ✅ renamed
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();   // ✅ this is the context function

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting login with:", { loginId, password }); // Debugging line

    try {
      const res = await api.post("/auth/login/", {
        username: loginId,   // ✅ use loginId here
        password,
      });

      // Pass tokens + user object
      login(res.data.access, res.data.refresh, res.data.user);

      console.log("Login response:", res.data);  // Debugging line
      if (res.data.user.role !== "admin") {
        toast.error("Access denied. Only admins can log in here.");
        return;
      }

      toast.success("Login successful");
      navigate("/admin/home");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email / Phone"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}   // ✅ fixed
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 font-semibold text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
