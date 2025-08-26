import { useEffect, useState } from "react";
import api from "../../utils/Api";

// Define types for clarity
interface TopItem {
  name: string;
  quantity: number;
}

interface TopCustomer {
  name: string;
  points: number;
}

interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  topItems: TopItem[];
  topCustomers: TopCustomer[];
}

const AdminHome = () => {
  const [stats, setStats] = useState<DashboardStats>({
    ordersToday: 0,
    revenueToday: 0,
    topItems: [],
    topCustomers: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching dashboard stats...");
        const res = await api("/admin/dashboard-stats/");
        setStats(res.data);
        console.log("After Fetching dashboard stats...", res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Orders Today</p>
          <h3 className="text-3xl font-bold">{stats.ordersToday}</h3>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Revenue Today</p>
          <h3 className="text-3xl font-bold">₹{stats.revenueToday}</h3>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
        {stats.topItems.length > 0 ? (
          <ul>
            {stats.topItems.map((item, idx) => (
              <li key={idx} className="py-1 border-b last:border-none">
                {item.name} — {item.quantity} sold
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No data available</p>
        )}
      </div>

      {/* Top Loyalty Customers */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Top Loyalty Customers</h3>
        {stats.topCustomers.length > 0 ? (
          <ul>
            {stats.topCustomers.map((cust, idx) => (
              <li key={idx} className="py-1 border-b last:border-none">
                {cust.name} — {cust.points} points
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No data available</p>
        )}
      </div>
    </div>
  );
};

export default AdminHome;

