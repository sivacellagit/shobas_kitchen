import { useEffect, useState } from "react";
import api from "../../utils/Api";
import { saveAs } from "file-saver";

const OrderReports = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ start: "", end: "" });

  const fetchReports = () => {
    api.get("/daily-sales/")
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilter = () => {
    api.get("/daily-sales/", { params: { start_date: filters.start, end_date: filters.end } })
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  };

  const exportCSV = () => {
    let csv = "Date,Orders,Revenue,Cost,Profit\n";
    reports.forEach((r: any) => {
      csv += `${r.date},${r.total_orders},${r.total_revenue},${r.total_cost},${r.profit}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "order_reports.csv");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Reports</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={filters.start}
          onChange={e => setFilters({ ...filters, start: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          type="date"
          value={filters.end}
          onChange={e => setFilters({ ...filters, end: e.target.value })}
          className="border px-2 py-1"
        />
        <button onClick={handleFilter} className="bg-blue-600 text-white px-3 py-1 rounded">
          Apply
        </button>
        <button onClick={exportCSV} className="bg-green-600 text-white px-3 py-1 rounded">
          Export CSV
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Orders</th>
            <th className="border px-2 py-1">Revenue</th>
            <th className="border px-2 py-1">Cost</th>
            <th className="border px-2 py-1">Profit</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r: any) => (
            <tr key={r.id}>
              <td className="border px-2 py-1">{r.date}</td>
              <td className="border px-2 py-1">{r.total_orders}</td>
              <td className="border px-2 py-1">₹{r.total_revenue}</td>
              <td className="border px-2 py-1">₹{r.total_cost}</td>
              <td className="border px-2 py-1">₹{r.profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderReports;
