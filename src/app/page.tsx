"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageContext";
import { useState } from "react";
import { MdAttachMoney } from "react-icons/md";

export default function Home() {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const labels = {
    pt: {
      dashboard: "Dashboard de Projetos",
      ativos: "Projetos Ativos",
      faturamentoMes: "Faturamento Mês",
      notas: "Notas Fiscais",
      resumo: "Resumo dos Projetos",
      alpha: "Projeto Alpha — Em andamento",
      beta: "Projeto Beta — Concluído",
      gamma: "Projeto Gamma — Em planejamento",
      faturamento: "Acompanhamento de Receita",
      mesCorte: "Mês do corte",
      statusMedicao: "Status Medição",
      qtdStatus: "Qntd Por Status",
      previsto: "Previsto",
      medido: "Medido",
      faturado: "Faturado",
      faltaFaturar: "Falta faturar",
      diverg: "Diverg(med-faturado)",
      fechar: "Fechar",
    },
    en: {
      dashboard: "Project Dashboard",
      ativos: "Active Projects",
      faturamentoMes: "Monthly Revenue",
      notas: "Invoices",
      resumo: "Project Summary",
      alpha: "Project Alpha — In progress",
      beta: "Project Beta — Completed",
      gamma: "Project Gamma — Planning",
      faturamento: "Revenue Tracking",
      mesCorte: "Cut-off Month",
      statusMedicao: "Measurement Status",
      qtdStatus: "Qty by Status",
      previsto: "Expected",
      medido: "Measured",
      faturado: "Billed",
      faltaFaturar: "To Bill",
      diverg: "Diverg(med-billed)",
      fechar: "Close",
    },
  };
  const l = labels[language];

  // Mock de dados para a tabela
  const data = [
    {
      mes: "Janeiro",
      status: "ACEITO",
      qtd: 9,
      previsto: "R$ 474.720,60",
      medido: "R$ 494.655,34",
      faturado: "R$ 499.097,10",
      falta: "R$ 4.441,76",
      diverg: "-R$ 4.441,76",
    },
    {
      mes: "Janeiro",
      status: "Em análise",
      qtd: 1,
      previsto: "R$ 2.285,85",
      medido: "R$ 2.285,85",
      faturado: "R$ 523,50",
      falta: "R$ 1.762,35",
      diverg: "-R$ 1.762,35",
    },
    {
      mes: "Janeiro Total",
      total: true,
      qtd: 10,
      previsto: "R$ 477.006,45",
      medido: "R$ 496.941,19",
      faturado: "R$ 499.620,60",
      falta: "-R$ 2.679,41",
      diverg: "-R$ 2.679,41",
    },
    {
      mes: "Fevereiro",
      status: "ACEITO",
      qtd: 19,
      previsto: "R$ 420.310,88",
      medido: "R$ 452.622,41",
      faturado: "R$ 414.521,43",
      falta: "R$ 38.100,98",
      diverg: "-R$ 38.100,98",
    },
    {
      mes: "Fevereiro Total",
      total: true,
      qtd: 19,
      previsto: "R$ 420.310,88",
      medido: "R$ 452.622,41",
      faturado: "R$ 414.521,43",
      falta: "R$ 38.100,98",
      diverg: "-R$ 38.100,98",
    },
    {
      mes: "Março",
      status: "ACEITO",
      qtd: 21,
      previsto: "R$ 353.243,00",
      medido: "R$ 395.011,61",
      faturado: "R$ 377.090,62",
      falta: "R$ 17.920,99",
      diverg: "-R$ 17.920,99",
    },
    {
      mes: "Março Total",
      total: true,
      qtd: 21,
      previsto: "R$ 353.243,00",
      medido: "R$ 395.011,61",
      faturado: "R$ 377.090,62",
      falta: "R$ 17.920,99",
      diverg: "-R$ 17.920,99",
    },
    {
      mes: "Abril",
      status: "ACEITO",
      qtd: 10,
      previsto: "R$ 326.656,87",
      medido: "R$ 476.805,12",
      faturado: "R$ 176.398,76",
      falta: "R$ 300.406,36",
      diverg: "R$ 300.406,36",
    },
    {
      mes: "Abril Total",
      total: true,
      qtd: 10,
      previsto: "R$ 326.656,87",
      medido: "R$ 476.805,12",
      faturado: "R$ 176.398,76",
      falta: "R$ 300.406,36",
      diverg: "R$ 300.406,36",
    },
    {
      mes: "Maio",
      status: "Disponibilidade",
      qtd: 1,
      previsto: "R$ 169.041,24",
      medido: "R$ 0,00",
      faturado: "R$ 0,00",
      falta: "R$ 169.041,24",
      diverg: "R$ 0,00",
    },
    {
      mes: "Maio Total",
      total: true,
      qtd: 1,
      previsto: "R$ 169.041,24",
      medido: "R$ 0,00",
      faturado: "R$ 0,00",
      falta: "R$ 169.041,24",
      diverg: "R$ 0,00",
    },
    {
      mes: "Dezembro",
      status: "ACEITO",
      qtd: 1,
      previsto: "R$ 32.505,22",
      medido: "R$ 32.505,22",
      faturado: "R$ 32.505,22",
      falta: "R$ 0,00",
      diverg: "R$ 0,00",
    },
    {
      mes: "Dezembro Total",
      total: true,
      qtd: 1,
      previsto: "R$ 32.505,22",
      medido: "R$ 32.505,22",
      faturado: "R$ 32.505,22",
      falta: "R$ 0,00",
      diverg: "R$ 0,00",
    },
    {
      mes: "Junho",
      status: "Em execução",
      qtd: 1,
      previsto: "R$ 53.175,00",
      medido: "R$ 0,00",
      faturado: "R$ 0,00",
      falta: "R$ 53.175,00",
      diverg: "R$ 0,00",
    },
    {
      mes: "Junho Total",
      total: true,
      qtd: 1,
      previsto: "R$ 53.175,00",
      medido: "R$ 0,00",
      faturado: "R$ 0,00",
      falta: "R$ 53.175,00",
      diverg: "R$ 0,00",
    },
    {
      mes: "Total Geral",
      total: true,
      destaque: true,
      qtd: 54,
      previsto: "R$ 2.252.687,27",
      medido: "R$ 2.422.844,18",
      faturado: "R$ 1.500.136,63",
      falta: "R$ 922.707,55",
      diverg: "-R$ 922.707,55",
    },
  ];

  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <section>
        <h1 className="text-2xl font-bold mb-4">{l.dashboard}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-700">5</span>
            <span className="text-gray-600">{l.ativos}</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <span className="text-3xl font-bold text-green-600">R$ 120.000</span>
            <span className="text-gray-600">{l.faturamentoMes}</span>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <span className="text-3xl font-bold text-orange-500">12</span>
            <span className="text-gray-600">{l.notas}</span>
          </div>
        </div>
        {/* Card/Ícone de Faturamento */}
        <div className="flex justify-end mb-6">
          <button
            className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition-colors font-semibold"
            onClick={() => setShowModal(true)}
            title={l.faturamento}
          >
            <MdAttachMoney size={24} />
            {l.faturamento}
          </button>
        </div>
        {/* Modal de Tabela Dinâmica */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl relative animate-fade-in">
              <button
                className="absolute top-2 right-2 text-blue-900 font-bold text-lg hover:text-red-600"
                onClick={() => setShowModal(false)}
                aria-label={l.fechar}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
                <MdAttachMoney size={22} /> {l.faturamento}
              </h2>
              <div className="overflow-x-auto max-h-[70vh]">
                <table className="min-w-full border rounded text-xs md:text-sm">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-2 py-2">{l.mesCorte}</th>
                      <th className="px-2 py-2">{l.statusMedicao}</th>
                      <th className="px-2 py-2">{l.qtdStatus}</th>
                      <th className="px-2 py-2">{l.previsto}</th>
                      <th className="px-2 py-2">{l.medido}</th>
                      <th className="px-2 py-2">{l.faturado}</th>
                      <th className="px-2 py-2">{l.faltaFaturar}</th>
                      <th className="px-2 py-2">{l.diverg}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      row.total ? (
                        <tr key={i} className={row.destaque ? "bg-green-200 font-bold text-blue-900" : "bg-green-100 font-bold text-blue-900"}>
                          <td className="px-2 py-2">{row.mes}</td>
                          <td className="px-2 py-2"></td>
                          <td className="px-2 py-2">{row.qtd}</td>
                          <td className="px-2 py-2">{row.previsto}</td>
                          <td className="px-2 py-2">{row.medido}</td>
                          <td className="px-2 py-2">{row.faturado}</td>
                          <td className="px-2 py-2">{row.falta}</td>
                          <td className="px-2 py-2">{row.diverg}</td>
                        </tr>
                      ) : (
                        <tr key={i} className={i % 2 === 0 ? "bg-blue-50 text-blue-900" : "bg-white text-blue-900"}>
                          <td className="px-2 py-2 font-semibold">{row.mes}</td>
                          <td className="px-2 py-2">{row.status}</td>
                          <td className="px-2 py-2">{row.qtd}</td>
                          <td className="px-2 py-2">{row.previsto}</td>
                          <td className="px-2 py-2">{row.medido}</td>
                          <td className="px-2 py-2">{row.faturado}</td>
                          <td className="px-2 py-2">{row.falta}</td>
                          <td className="px-2 py-2">{row.diverg}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-2">{l.resumo}</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>{l.alpha}</li>
            <li>{l.beta}</li>
            <li>{l.gamma}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
