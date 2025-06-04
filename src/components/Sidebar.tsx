'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  MdDashboard,
  MdAttachMoney,
  MdInventory,
  MdPsychology,
  MdLanguage,
  MdSettings,
  MdLogout,
} from 'react-icons/md';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex items-center justify-center h-16 bg-green-600">
        <h1 className={`text-white text-xl font-bold transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          GrupoSetup
        </h1>
      </div>

      <nav className="mt-4">
        <ul className="space-y-2">
          <NavItem
            icon={MdDashboard}
            title="Dashboard"
            href="/dashboard"
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={MdAttachMoney}
            title="Faturamento"
            href="/faturamento"
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={MdInventory}
            title="Estoque"
            href="/estoque"
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={MdPsychology}
            title="Projetos"
            href="/projetos"
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={MdLanguage}
            title="IA"
            href="/ia"
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={MdSettings}
            title="Configurações"
            href="/configuracoes"
            isCollapsed={isCollapsed}
          />
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
        >
          <MdLogout className="w-5 h-5 mr-2" />
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
            Sair
          </span>
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, title, href, isCollapsed }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center px-4 py-3 hover:bg-green-50 transition-colors
          ${isCollapsed ? 'justify-center' : 'justify-start'}
        `}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
          {title}
        </span>
      </Link>
    </li>
  );
}
