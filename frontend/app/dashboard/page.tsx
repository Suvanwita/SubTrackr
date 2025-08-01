'use client';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

interface Subscription {
  _id: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  paymentMethod: string;
  notes: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

export default function DashboardPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [form, setForm] = useState<Partial<Subscription>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSubs = async () => {
    const res = await fetch('http://localhost:5000/api/subscriptions', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    setSubs(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.amount) {
      alert('Name and Amount are required');
      return;
    }

    const url = editId
      ? `http://localhost:5000/api/subscriptions/${editId}`
      : 'http://localhost:5000/api/subscriptions';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({});
      setEditId(null);
      fetchSubs();
      setMessage(editId ? 'Subscription updated!' : 'Subscription added!');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEdit = (sub: Subscription) => {
    setForm(sub);
    setEditId(sub._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscription?')) return;
    const res = await fetch(`http://localhost:5000/api/subscriptions/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (res.ok) {
      fetchSubs();
      setMessage('Deleted.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const totalSpent = subs.reduce((acc, s) => acc + s.amount, 0);
  const totalSubs = subs.length;

  const categoryStats = Object.entries(
    subs.reduce((acc: Record<string, number>, s) => {
      acc[s.category] = (acc[s.category] || 0) + s.amount;
      return acc;
    }, {})
  ).map(([category, value]) => ({ name: category, value }));

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('SubTrackr Analytics', 10, 10);
    doc.text(`Subscriptions: ${totalSubs}`, 10, 20);
    doc.text(`Total Spent: ₹${totalSpent}`, 10, 30);
    doc.save('analytics.pdf');
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 space-y-10">
      <h1 className="text-3xl font-bold text-blue-400">📊 SubTrackr Dashboard</h1>

      {message && (
        <div className="bg-green-700 text-white p-3 rounded shadow-md text-center">
          {message}
        </div>
      )}

      {/* 🔲 Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch min-h-[520px]">
        {/* 🔹 Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded shadow flex flex-col h-full"
        >
          <div className="space-y-3 flex-grow flex flex-col">
            <h2 className="text-xl font-semibold">Add Subscription</h2>
            <input
              type="text"
              required
              placeholder="Name *"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
            />
            <input
              type="number"
              required
              placeholder="Amount *"
              value={form.amount || ''}
              onChange={(e) => setForm({ ...form, amount: +e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category || ''}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Billing Cycle"
              value={form.billingCycle || ''}
              onChange={(e) => setForm({ ...form, billingCycle: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
            />
            <input
              type="date"
              value={form.nextBillingDate?.split('T')[0] || ''}
              onChange={(e) => setForm({ ...form, nextBillingDate: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
            <input
              type="text"
              placeholder="Payment Method"
              value={form.paymentMethod || ''}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
            />
            <textarea
              placeholder="Notes"
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 flex-grow resize-none"
            />
          </div>
          <button className="mt-4 bg-green-600 hover:bg-green-500 text-white py-2 rounded">
            {editId ? 'Update' : 'Create'}
          </button>
        </form>

        {/* 🔹 Analytics & Charts */}
        <div className="bg-gray-800 p-6 rounded shadow h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">📈 Analytics</h2>
            <p>Total Subscriptions: <strong>{totalSubs}</strong></p>
            <p>Total Monthly Spend: ₹{totalSpent}</p>
            <button
              onClick={downloadPDF}
              className="mt-3 bg-blue-700 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Download PDF
            </button>
          </div>

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label={{ fill: '#fff' }}
                >
                  {categoryStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <XAxis dataKey="name" tick={{ fill: '#fff' }} />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', color: '#fff' }} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🔻 Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {subs.map((sub) => (
          <div
            key={sub._id}
            className="bg-gray-800 p-5 rounded-xl shadow border border-gray-700 hover:shadow-md"
          >
            <h3 className="text-lg font-bold text-blue-300">{sub.name}</h3>
            <p className="text-sm text-gray-300">Category: {sub.category}</p>
            <p className="text-sm text-gray-300">Amount: ₹{sub.amount}</p>
            <p className="text-sm text-gray-300">Billing: {sub.billingCycle}</p>
            <p className="text-sm text-gray-300">
              Next: {new Date(sub.nextBillingDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-300">Payment: {sub.paymentMethod}</p>
            <p className="text-sm text-gray-400 italic">Notes: {sub.notes}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(sub)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(sub._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
        {subs.length === 0 && (
          <p className="text-gray-400 col-span-full text-center">No subscriptions yet.</p>
        )}
      </div>
    </div>
  );
}
