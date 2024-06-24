// pages/login.tsx
"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation";


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        
        router.push("/login/crud");
      } else {
        // Login failed
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error logging in', error);
      setError('Invalid username or password');
    }
  };

  return (
    <main className="bg-gray-100  flex items-center justify-center">
      <div></div>
      <div>
        <form className="px-8 pt-6 py-4 space-y-4 max-w-[900px]" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center">
            <img
              src="/images/rabbit.png"
              alt="rr"
              style={{ width: "100%", maxWidth: "180px", height: "auto" }}
            />
          </div>
          <div className="flex items-center justify-center">
            <div></div>
            <div>
              <h1 className="text-[20px]">Merchant App Referral Tracking</h1>
            </div>
            <div></div>
          </div>
          <div>

            <input type="text" value={username}
              className="shadow-md focus:ring-indigo-500 focus:border-indigo-500 block border-gray-300 rounded-lg h-[50px] w-full max-w-[300px]"
              placeholder="  User Name"
              onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <input type="password" value={password}
              className="shadow-md focus:ring-indigo-500 focus:border-indigo-500 block border-gray-300 rounded-lg h-[50px] w-full max-w-[300px]"
              placeholder="  Password"
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit"
            className="flex items-center min-w-full justify-center text-lg w-full rounded-xl shadow py-4 px-2 text-white bg-orange-500" >Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
