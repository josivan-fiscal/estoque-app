// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = predefinedUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      localStorage.setItem('loggedInUser', user.username);
      router.push('/dashboard');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-4 rounded-lg shadow-md w-96">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-green-700 mb-2">
            GrupoSetup
          </h1>
          <p className="text-gray-600">Sistema de Gestão Integrado</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-green-700 mb-1"
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
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Digite seu nome de usuário"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-green-700 mb-1"
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
              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-3 w-3 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Lembrar-me
              </label>
            </div>

            <button
              type="button"
              onClick={() => alert('Em breve será implementado o sistema de recuperação de senha.')}
              className="text-sm text-green-600 hover:text-green-800"
            >
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}