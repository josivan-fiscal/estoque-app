"use client";

import { useLanguage } from "../LanguageContext";
import { useRef, useState } from "react";
import Papa from "papaparse";

export default function EstoquePage() {
  const { language } = useLanguage();
  const [dados, setDados] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const labels = {
    pt: {
      title: "Gestão de Estoque",
      desc: "Controle o estoque de materiais e acompanhe o uso por projeto.",
      importar: "Importar Planilha",
      csv: "(CSV ou Excel)",
      material: "Material",
      texto: "Texto breve material",
      cen: "Cen.",
      dep: "Dep.",
      dps: "Dps",
      umb: "UMB",
      utilizacao: "Utilização livre",
      valUtil: "Val.utiliz.livre",
      emQualidade: "Em contr.qualidade",
      transito: "Estoque trânsito",
      grupo: "GRUPO",
    },
    en: {
      title: "Inventory Management",
      desc: "Manage material inventory and track usage by project.",
      importar: "Import Spreadsheet",
      csv: "(CSV or Excel)",
      material: "Material",
      texto: "Material short text",
      cen: "Scenario",
      dep: "Warehouse",
      dps: "Dps",
      umb: "UOM",
      utilizacao: "Free usage",
      valUtil: "Free usable value",
      emQualidade: "In quality control",
      transito: "Stock in transit",
      grupo: "GROUP",
    },
  };
  const l = labels[language];

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, " ")
      .replace(/\./g, "")
      .trim();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Normaliza os campos de cada linha
        const dadosNormalizados = (results.data as any[]).map((row) => {
          const novo: any = {};
          Object.keys(row).forEach((k) => {
            novo[normalize(k)] = row[k];
          });
          return novo;
        });
        setDados(dadosNormalizados);
      },
    });
  }

  // Soma total da coluna Val.utiliz.livre
  const totalValUtilLivre = dados.reduce((acc, row) => {
    const val = row[normalize("Val.utiliz.livre")];
    // Remove R$, pontos e vírgulas para converter para número
    const num =
      typeof val === "string"
        ? Number(
            val
              .replace(/[^\d,.-]/g, "")
              .replace(".", "")
              .replace(",", ".")
          )
        : 0;
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  // Filtro de pesquisa
  const dadosFiltrados = dados.filter((row) => {
    const mat = (row[normalize("Material")] || "").toString().toLowerCase();
    const texto = (row[normalize("Texto breve material")] || "")
      .toString()
      .toLowerCase();
    return (
      mat.includes(search.toLowerCase()) ||
      texto.includes(search.toLowerCase())
    );
  });

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">{l.title}</h1>
      <p className="mb-4">{l.desc}</p>
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors font-semibold"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          {l.importar}
        </button>
        <span className="text-xs text-blue-900">{l.csv}</span>
        {/* Campo de pesquisa */}
        <input
          type="text"
          placeholder="Pesquisar Material ou Texto breve material"
          className="border border-blue-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-blue-900 w-full md:w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Valor total suspenso */}
      {dados.length > 0 && (
        <div className="mb-2 flex justify-end">
          <div className="bg-blue-900 text-white px-4 py-2 rounded shadow font-bold text-lg">
            Valor do Estoque SAP: R${" "}
            {totalValUtilLivre.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
      )}
      {dadosFiltrados.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-xs md:text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-2 py-2">{l.material}</th>
                <th className="px-2 py-2">{l.texto}</th>
                <th className="px-2 py-2">{l.cen}</th>
                <th className="px-2 py-2">{l.dep}</th>
                <th className="px-2 py-2">{l.dps}</th>
                <th className="px-2 py-2">{l.umb}</th>
                <th className="px-2 py-2">{l.utilizacao}</th>
                <th className="px-2 py-2">{l.valUtil}</th>
                <th className="px-2 py-2">{l.emQualidade}</th>
                <th className="px-2 py-2">{l.transito}</th>
                <th className="px-2 py-2">{l.grupo}</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((row, i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0
                      ? "bg-blue-50 text-blue-900"
                      : "bg-white text-blue-900"
                  }
                >
                  <td className="px-2 py-2">{row[normalize("Material")]}</td>
                  <td className="px-2 py-2">
                    {row[normalize("Texto breve material")]}
                  </td>
                  <td className="px-2 py-2">{row[normalize("Cen.")]}</td>
                  <td className="px-2 py-2">{row[normalize("Dep.")]}</td>
                  <td className="px-2 py-2">{row[normalize("Dps")]}</td>
                  <td className="px-2 py-2">{row[normalize("UMB")]}</td>
                  <td className="px-2 py-2">{row[normalize("Utilização livre")]}</td>
                  <td className="px-2 py-2">{row[normalize("Val.utiliz.livre")]}</td>
                  <td className="px-2 py-2">{row[normalize("Em contr.qualidade")]}</td>
                  <td className="px-2 py-2">{row[normalize("Estoque trânsito")]}</td>
                  <td className="px-2 py-2">{row[normalize("GRUPO")]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
