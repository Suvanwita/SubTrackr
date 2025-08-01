'use client';
import { useEffect, useState } from 'react';

interface Reminder {
  _id: string;
  subscriptionName: string;
  reminderDate: string;
  note: string;
  notified: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [form, setForm] = useState<Partial<Reminder>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchReminders = async () => {
    const res = await fetch('http://localhost:5000/api/reminders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    setReminders(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.subscriptionName || !form.reminderDate) {
      alert('Subscription Name and Reminder Date are required');
      return;
    }

    const formattedDate = new Date(form.reminderDate).toISOString();

    const url = editingId
      ? `http://localhost:5000/api/reminders/${editingId}`
      : 'http://localhost:5000/api/reminders';

    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...form,
        reminderDate: formattedDate,
      }),
    });

    if (res.ok) {
      setForm({});
      setEditingId(null);
      fetchReminders();
      setMessage(`Reminder ${editingId ? 'updated' : 'added'}!`);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const deleteReminder = async (id: string) => {
    if (!confirm('Delete this reminder?')) return;
    const res = await fetch(`http://localhost:5000/api/reminders/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (res.ok) {
      fetchReminders();
      setMessage('Reminder deleted');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleNotified = async (rem: Reminder) => {
    const res = await fetch(`http://localhost:5000/api/reminders/${rem._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ ...rem, notified: !rem.notified }),
    });
    if (res.ok) fetchReminders();
  };

  const editReminder = (rem: Reminder) => {
    setForm({
      subscriptionName: rem.subscriptionName,
      reminderDate: rem.reminderDate.split('T')[0],
      note: rem.note,
    });
    setEditingId(rem._id);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10 space-y-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-purple-400 text-center">
          🔔 SubTrackr Reminders
        </h1>

        {message && (
          <div className="bg-green-700 text-white p-3 rounded shadow text-center">
            {message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-xl shadow flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6"
        >
          <h2 className="text-2xl font-semibold col-span-2 text-purple-300">
            {editingId ? 'Edit Reminder' : 'Add New Reminder'}
          </h2>
          <input
            type="text"
            required
            placeholder="Subscription Name *"
            value={form.subscriptionName || ''}
            onChange={(e) => setForm({ ...form, subscriptionName: e.target.value })}
            className="p-3 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
          />
          <input
            type="date"
            required
            value={form.reminderDate || ''}
            onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
            className="p-3 rounded bg-gray-700 border border-gray-600 text-white"
          />
          <textarea
            placeholder="Note (optional)"
            value={form.note || ''}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="p-3 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 resize-none min-h-[100px] col-span-2"
          />
          <button className="bg-purple-600 hover:bg-purple-500 text-white py-2 rounded col-span-2">
            {editingId ? 'Update Reminder' : 'Add Reminder'}
          </button>
        </form>

        {/* Reminders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((rem) => (
            <div
              key={rem._id}
              className={`p-5 rounded-xl shadow-lg border ${
                rem.notified ? 'border-green-500' : 'border-yellow-400'
              } bg-gray-800 flex flex-col justify-between`}
            >
              <div>
                <h3 className="text-xl font-semibold text-blue-300">
                  {rem.subscriptionName}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  📅 {new Date(rem.reminderDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {rem.note && (
                  <p className="text-sm text-gray-400 mt-1 italic">📝 {rem.note}</p>
                )}
                <p
                  className={`text-sm mt-2 font-medium ${
                    rem.notified ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  Status: {rem.notified ? '✅ Notified' : '🕒 Pending'}
                </p>
              </div>
              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={() => toggleNotified(rem)}
                  className={`px-3 py-1 rounded text-sm ${
                    rem.notified
                      ? 'bg-yellow-600 hover:bg-yellow-500'
                      : 'bg-green-600 hover:bg-green-500'
                  } text-white`}
                >
                  {rem.notified ? 'Mark Pending' : 'Mark Notified'}
                </button>
                <button
                  onClick={() => editReminder(rem)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500"
                >
                  ✏ Edit
                </button>
                <button
                  onClick={() => deleteReminder(rem._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
          {reminders.length === 0 && (
            <p className="text-gray-400 col-span-full text-center">
              No reminders added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
