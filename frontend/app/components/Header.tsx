'use client';
import Link from "next/link";
import {useEffect, useState} from "react";

export default function Header(){
  const [username, setUsername] = useState<string | null>(null);

  useEffect(()=>{
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUsername(parsed.username);
    }
  },[]);

  const handleLogout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUsername(null);
    window.location.href = '/signin';
  };

  return (
    <div className="w-full h-20 bg-[#290d49] flex justify-between items-center px-12 text-white">
      <p className="text-2xl font-semibold">SubTrackr</p>

      <div className="flex gap-8 text-xl">
        <Link href='/dashboard'>Dashboard</Link>
        <Link href='/reminders'>Reminder</Link>
        <Link href='/documents'>Documents</Link>
      </div>

      {username?(
        <div className="flex items-center gap-4">
          <span className="text-lg">Hi, {username}</span>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/signin">
          <button className="py-2 px-4 bg-amber-200 rounded-xl text-[#290d49] text-lg">
            Login
          </button>
        </Link>
      )}
    </div>
  );
}
