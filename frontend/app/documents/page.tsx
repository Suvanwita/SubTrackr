'use client';
import { useEffect, useState } from 'react';
import {motion} from "motion/react"

interface DocumentItem {
  _id: string;
  title: string;
  fileUrl: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/documents', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setDocs(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return alert('Title and file are required');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Upload failed');
        return;
      }

      setMessage('✅ Uploaded');
      setTitle('');
      setFile(null);
      fetchDocs();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const deleteDoc = async (id: string) => {
    if (!confirm('Delete this document?')) return;

    const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (res.ok) {
      setMessage('🗑️ Deleted');
      fetchDocs();
      setTimeout(() => setMessage(null), 3000);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-purple-500">📂 Your Documents</h1>

        {message && (
          <div className="text-center p-3 bg-green-700 text-white rounded">{message}</div>
        )}

        <form
          onSubmit={handleUpload}
          className="flex flex-col gap-4 bg-gray-800 p-6 rounded-xl shadow"
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="Enter document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
            required
          />
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="p-2 bg-gray-700 border border-gray-600 rounded"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white py-2 rounded"
          >
            Upload Document
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <div
              key={doc._id}
              className="p-4 bg-gray-800 rounded-lg shadow border border-purple-400 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-300">📄 {doc.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500"
                >
                  View
                </a>
                <button
                  onClick={() => deleteDoc(doc._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {docs.length === 0 && (
            <p className="col-span-full text-center text-gray-400">
              No documents uploaded yet.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
