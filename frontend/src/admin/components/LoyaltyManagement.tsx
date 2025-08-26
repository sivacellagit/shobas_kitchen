import { useEffect, useState } from "react";
import api from "../../utils/Api";

const LoyaltyManagement = () => {
  const [loyalty, setLoyalty] = useState([]);
  const [form, setForm] = useState({ customer: "", points: 0 });

  const fetchLoyalty = () => {
    api.get("/loyalty-points/")
      .then(res => setLoyalty(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLoyalty();
  }, []);

  const handleAdd = () => {
    api.post("/loyalty-points/", form)
      .then(() => {
        setForm({ customer: "", points: 0 });
        fetchLoyalty();
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete loyalty record?")) {
      api.delete(`/loyalty-points/${id}/`).then(fetchLoyalty);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Loyalty Management</h1>

      {/* Add Points */}
      <div className="mb-4 flex gap-2">
        <input
          placeholder="Customer ID"
          value={form.customer}
          onChange={e => setForm({ ...form, customer: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          type="number"
          placeholder="Points"
          value={form.points}
          onChange={e => setForm({ ...form, points: Number(e.target.value) })}
          className="border px-2 py-1"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Add Points
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Customer</th>
            <th className="border px-2 py-1">Points</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loyalty.map((l: any) => (
            <tr key={l.id}>
              <td className="border px-2 py-1">{l.customer}</td>
              <td className="border px-2 py-1">{l.points}</td>
              <td className="border px-2 py-1">{new Date(l.date).toLocaleDateString()}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleDelete(l.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoyaltyManagement;
