"use client";
import Link from "next/link";
import { MdDashboard, MdAttachMoney, MdInventory, MdPsychology, MdLanguage, MdCompareArrows } from "react-icons/md";
import { useLanguage } from "./LanguageContext";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const labels = {
    pt: {
      dashboard: "Dashboard",
      faturamento: "Faturamento",
      estoque: "Estoque",
      ia: "Alocação IA",
      idioma: "Idioma",
      portugues: "Português",
      ingles: "Inglês"
    },
    en: {
      dashboard: "Dashboard",
      faturamento: "Billing",
      estoque: "Inventory",
      ia: "AI Allocation",
      idioma: "Language",
      portugues: "Portuguese",
      ingles: "English"
    }
  };
  const l = labels[language];

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col gap-2 py-8 px-4 border-r border-blue-100">
      <span className="font-bold text-2xl text-blue-900 mb-8 tracking-tight">GrupoSetup_DF</span>
      <nav className="flex flex-col gap-2">
        <Link href="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-semibold hover:bg-blue-50 hover:text-blue-900 ${pathname === '/' ? 'bg-blue-50 text-blue-900' : 'text-blue-800'}`}><MdDashboard size={20}/>{l.dashboard}</Link>
        <Link href="/faturamento" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-semibold hover:bg-blue-50 hover:text-blue-900 ${pathname === '/faturamento' ? 'bg-blue-50 text-blue-900' : 'text-blue-800'}`}><MdAttachMoney size={20}/>{l.faturamento}</Link>
        <Link href="/estoque" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-semibold hover:bg-blue-50 hover:text-blue-900 ${pathname === '/estoque' ? 'bg-blue-50 text-blue-900' : 'text-blue-800'}`}><MdInventory size={20}/>{l.estoque}</Link>
        <Link href="/movimentacoes" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-semibold hover:bg-blue-50 hover:text-blue-900 ${pathname === '/movimentacoes' ? 'bg-blue-50 text-blue-900' : 'text-blue-800'}`}><MdCompareArrows size={20}/>Movimentações</Link>
        <Link href="/ia" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-semibold hover:bg-blue-50 hover:text-blue-900 ${pathname === '/ia' ? 'bg-blue-50 text-blue-900' : 'text-blue-800'}`}><MdPsychology size={20}/>{l.ia}</Link>
      </nav>
      {/* Botão de idioma */}
      <div className="mt-8 flex items-center gap-2">
        <MdLanguage size={20} className="text-blue-700" />
        <span className="font-semibold text-blue-800">{l.idioma}:</span>
        <button
          className={`px-2 py-1 rounded text-xs font-bold ${language === 'pt' ? 'bg-blue-100 text-blue-900' : 'bg-white text-blue-700 border border-blue-200'} transition-colors`}
          onClick={() => setLanguage('pt')}
        >{l.portugues}</button>
        <button
          className={`px-2 py-1 rounded text-xs font-bold ${language === 'en' ? 'bg-blue-100 text-blue-900' : 'bg-white text-blue-700 border border-blue-200'} transition-colors`}
          onClick={() => setLanguage('en')}
        >{l.ingles}</button>
      </div>
      <div className="mt-12 text-xs text-blue-300">App Blueprint<br/>• Dashboard de Projetos<br/>• Faturamento<br/>• Estoque<br/>• Alocação IA</div>
    </aside>
  );
}
