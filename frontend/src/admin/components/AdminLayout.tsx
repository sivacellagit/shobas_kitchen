import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AdminLayout = () => {
  const { user } = useAuth();

  const navItems = [
    { path: "/admin/pos", label: "POS Menu" },
    { path: "/admin/menu", label: "Menu Management" },
    { path: "/admin/staff", label: "Staff Management" },
    { path: "/admin/orders", label: "Order Reports" },
    { path: "/admin/loyalty", label: "Loyalty Program" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b text-lg font-bold text-center">
          Shoba’s Kitchen Admin
        </div>
        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded mb-2 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t text-sm text-gray-500">
          Logged in as: <strong>{user?.username || "Admin"}</strong>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


