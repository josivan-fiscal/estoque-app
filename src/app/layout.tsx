import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext";
import Sidebar from "./Sidebar";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const ptSans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "GrupoSetup_DF",
  description: "Dashboard de Projetos, Faturamento, Estoque e IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Verifica se o usuário está autenticado
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('loggedInUser');

  // Se não está logado, mostra apenas a tela de login
  if (!isLoggedIn) {
    return (
      <html lang="pt-BR">
        <body className={`${poppins.className} ${ptSans.className} min-h-screen`}>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-white">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl w-full max-w-md">
              {children}
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} ${ptSans.className} bg-gray-100 min-h-screen`}>
        <LanguageProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-auto">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
