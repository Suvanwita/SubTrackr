'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-black">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-2xl font-bold">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-black p-2 rounded">Login</button>
      </form>
    </div>
  );
}
