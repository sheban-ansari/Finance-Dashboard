import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 1, date: "2026-04-01", amount: 5000, category: "Salary", type: "income" },
    { id: 2, date: "2026-04-02", amount: 200, category: "Food", type: "expense" },
    { id: 3, date: "2026-04-03", amount: 1000, category: "Shopping", type: "expense" },
  ]);

  // Filter
  const filtered = transactions
    .filter((t) =>
      t.category.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => filter === "all" || t.type === filter);

  // Calculations
  const income = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = income - expenses;

  const highest = transactions
    .filter(t => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)[0];

  // Chart Data
  const chartData = transactions.map((t) => ({
    date: t.date,
    amount: t.type === "expense" ? -t.amount : t.amount,
  }));

  // Add Transaction
  const handleAdd = () => {
    const date = document.getElementById("date").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const type = document.getElementById("type").value;

    if (!date || !amount || !category) {
      alert("Fill all fields");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date,
      amount: Number(amount),
      category,
      type,
    };

    setTransactions([newTransaction, ...transactions]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-white">
        <h1 className="text-3xl font-bold tracking-wide">💰 Finance Dashboard</h1>

        <select
          className="p-2 rounded-lg bg-white text-black"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <p className="text-gray-500">Total Balance</p>
          <h2 className="text-2xl font-bold mt-2 text-indigo-700">₹{balance}</h2>
        </div>

        <div className="bg-green-100 p-5 rounded-2xl shadow-lg">
          <p className="text-green-700">Income</p>
          <h2 className="text-2xl font-bold mt-2 text-green-800">₹{income}</h2>
        </div>

        <div className="bg-red-100 p-5 rounded-2xl shadow-lg">
          <p className="text-red-700">Expenses</p>
          <h2 className="text-2xl font-bold mt-2 text-red-800">₹{expenses}</h2>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-lg mb-6">
        <h2 className="font-semibold mb-2 text-gray-700">📊 Balance Trend</h2>
        <p className="text-sm text-gray-500 mb-3">
          Income (+) and Expenses (-) over time
        </p>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Admin Button */}
      {role === "admin" && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          + Add Transaction
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-2xl shadow mb-4">
          <h2 className="font-semibold mb-3">Add Transaction</h2>

          <input type="date" id="date" className="border p-2 rounded w-full mb-2" />
          <input type="number" id="amount" placeholder="Amount" className="border p-2 rounded w-full mb-2" />
          <input type="text" id="category" placeholder="Category" className="border p-2 rounded w-full mb-2" />

          <select id="type" className="border p-2 rounded w-full mb-2">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter("all")} className="px-3 py-1 bg-white rounded shadow">All</button>
        <button onClick={() => setFilter("income")} className="px-3 py-1 bg-green-200 rounded shadow">Income</button>
        <button onClick={() => setFilter("expense")} className="px-3 py-1 bg-red-200 rounded shadow">Expense</button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search category..."
        className="mb-4 p-2 rounded w-full shadow"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Transactions */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Transactions</h2>

        <div className="grid grid-cols-4 font-semibold border-b pb-2 text-gray-600">
          <span>Date</span>
          <span>Category</span>
          <span>Type</span>
          <span>Amount</span>
        </div>

        {filtered.length === 0 ? (
          <p className="py-3">No data found</p>
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="grid grid-cols-4 py-2 border-b text-sm">
              <span>{t.date}</span>
              <span>{t.category}</span>
              <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>
                {t.type}
              </span>
              <span>₹{t.amount}</span>
            </div>
          ))
        )}
      </div>

      {/* Insights */}
      <div className="mt-6 bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-2">Insights</h2>
        <p>💡 Highest spending: {highest?.category}</p>
        <p>📊 Total transactions: {transactions.length}</p>
      </div>

    </div>
  );
}

export default App;