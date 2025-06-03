import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { MdDashboard, MdAttachMoney, MdInventory, MdPsychology, MdLanguage } from "react-icons/md";
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
