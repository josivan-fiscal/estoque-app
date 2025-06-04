// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirecionamento

// Lista de usuários e senha inicial (para simulação)
// Em um sistema real, isso viria de um backend seguro.
const predefinedUsers = [
  { username: 'Josivan', password: 'setup@123' },
  { username: 'Giovanna', password: 'setup@123' },
  { username: 'Victor', password: 'setup@123' },
  { username: 'Rubens', password: 'setup@123' },
  { username: 'Luciano', password: 'setup@123' },
  { username: 'Eduardo', password: 'setup@123' },
  { username: 'Israel', password: 'setup@123' },
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = predefinedUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      localStorage.setItem('loggedInUser', user.username);
      router.push('/');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  const handleForgotPassword = () => {
    // Em um app real, aqui você implementaria a lógica de recuperação de senha
    alert('Em breve será implementado o sistema de recuperação de senha.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Login do Sistema
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-green-700"
            >
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-green-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-green-600 hover:text-green-800"
            >
              Esqueceu a senha?
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Entrar
            </button>
          </div>
        </form>
        <p className="mt-8 text-xs text-center text-gray-500">
          Esqueceu a senha? A funcionalidade de alteração de senha será implementada futuramente.
        </p>
      </div>
    </div>
  );
}
