"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../LanguageContext"
import { MdCompareArrows, MdAdd, MdRemove, MdEmail, MdFileDownload } from "react-icons/md"
import { Material, useMaterials } from "./materials"

type Mov = {
  projeto: string
  tipoMov: string
  material: string
  texto: string
  quantidade: number
  origem: string
  destino: string
  usuario: string
  tipoMovSAP: string
  unidade: string
}

export default function MovimentacoesPage() {
  // Adicionado container principal e melhorias de layout
  const { language } = useLanguage()
  const { materials, newMaterial, l: materialLabels, handleMaterialChange, handleSaveMaterial, getMaterialByNome } = useMaterials()
  const [movs, setMovs] = useState<Mov[]>([
    { projeto: "Obra Alpha", tipoMov: "entrada", material: "Cabo 10mm", texto: "Cabo flexível azul", quantidade: 100, origem: "NF 12345", destino: "Estoque Central", usuario: "João", tipoMovSAP: "", unidade: "m" },
    { projeto: "Obra Alpha", tipoMov: "saida", material: "Cabo 10mm", texto: "Cabo flexível azul", quantidade: 20, origem: "Estoque Central", destino: "Obra Alpha", usuario: "Maria", tipoMovSAP: "", unidade: "m" },
  ])
  const [form, setForm] = useState<Omit<Mov, "quantidade"> & { quantidade: string }>({
    projeto: "",
    tipoMov: "entrada",
    material: "",
    texto: "",
    quantidade: "",
    origem: "",
    destino: "",
    usuario: "",
    tipoMovSAP: "",
    unidade: ""
  })
  const [selecionadas, setSelecionadas] = useState<number[]>([])
  const [email, setEmail] = useState("")

  // Verifica se estamos no cliente (navegador)
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Se estivermos no cliente, podemos usar as funções do navegador
  }, [])

  const labels = {
    pt: {
      title: "Movimentações de Estoque",
      add: "Registrar Movimentação",
      projeto: "Projeto",
      tipoMov: "Tipo de movimento",
      entrada: "Entrada",
      saida: "Saída",
      material: "Material",
      texto: "Texto descritivo",
      quantidade: "Quantidade",
      origem: "Origem",
      destino: "Destino",
      usuario: "Usuário",
      acao: "Ação",
      salvar: "Salvar",
      limpar: "Limpar",
      saldo: "Saldo Atual por Material",
      exportar: "Exportar para Excel",
      solicitar: "Solicitar Reserva (221)",
      email: "E-mail para reserva",
      naoEncontrado: "Material não encontrado no estoque",
      cadastrarMaterial: "Cadastrar novo material",
      unidade: "Unidade"
    },
    en: {
      title: "Stock Movements",
      add: "Register Movement",
      projeto: "Project",
      tipoMov: "Movement type",
      entrada: "Entry",
      saida: "Exit",
      material: "Material",
      texto: "Description",
      quantidade: "Quantity",
      origem: "Origin",
      destino: "Destination",
      usuario: "User",
      acao: "Action",
      salvar: "Save",
      limpar: "Clear",
      saldo: "Current Stock by Material",
      exportar: "Export to Excel",
      solicitar: "Request Reservation (221)",
      email: "Reservation e-mail",
      naoEncontrado: "Material not found in stock",
      cadastrarMaterial: "Register new material",
      unidade: "Unit"
    }
  };
  const l = labels[language];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === 'material') {
      const material = getMaterialByNome(value);
      if (material) {
        setForm(prev => ({ ...prev, [name]: value, unidade: material.unidade }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }
  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!form.material || !form.quantidade) return;

    // Verifica se o material existe no estoque
    const material = getMaterialByNome(form.material);
    if (!material) {
      alert(l.naoEncontrado);
      setForm({ ...form, material: "" });
      return;
    }

    // Verifica se há saldo suficiente para saída
    if (form.tipoMov === "saida" && Number(form.quantidade) > material.saldo) {
      alert(`Saldo insuficiente. Saldo atual: ${material.saldo} ${material.unidade}`);
      return;
    }

    setMovs([
      ...movs,
      { ...form, quantidade: Number(form.quantidade), tipoMovSAP: form.tipoMovSAP || "", unidade: material.unidade }
    ]);
    setForm({ ...form, quantidade: "", material: "" });
  }
  function handleClear() {
    setForm({ projeto: "", tipoMov: "entrada", material: "", texto: "", quantidade: "", origem: "", destino: "", usuario: "", tipoMovSAP: "", unidade: "" });
  }
  function handleSelect(i: number) {
    setSelecionadas(sel => sel.includes(i) ? sel.filter(x => x !== i) : [...sel, i]);
  }
  // Exportar selecionadas para Excel (CSV) e enviar por e-mail
  async function solicitarReserva() {
    setMovs(movs.map((m, i) => selecionadas.includes(i) ? { ...m, tipoMovSAP: "221" } : m));
    const titulos = [l.projeto, l.tipoMov, l.material, l.texto];
    const rows = selecionadas.map(i => movs[i]);
    const csv = [titulos.join(",")].concat(
      rows.map(m => [m.projeto, "221", m.material, m.texto].join(","))
    ).join("\n");
    // Envia para API
    const resp = await fetch("/api/send-reserva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email || "reservas@seudominio.com.br",
        subject: "Solicitação de Reserva 221",
        text: "Segue em anexo a solicitação de reserva 221.",
        csvBase64: btoa(unescape(encodeURIComponent(csv))),
        filename: `reserva221_${new Date().toISOString().slice(0,10)}.csv`
      })
    });
    if (resp.ok) {
      alert("Reserva enviada por e-mail com sucesso!");
      setSelecionadas([]);
    } else {
      alert("Erro ao enviar e-mail. Verifique as credenciais do servidor.");
    }
  }
  // Exportar selecionadas para Excel (CSV)
  function exportarExcel() {
    // Definir os campos que serão exportados
    const campos = [
      { nome: l.projeto, campo: 'projeto' },
      { nome: l.tipoMov, campo: 'tipoMov' },
      { nome: l.material, campo: 'material' },
      { nome: l.texto, campo: 'texto' },
      { nome: l.quantidade, campo: 'quantidade' },
      { nome: l.unidade, campo: 'unidade' }
    ];

    // Criar a primeira linha com os cabeçalhos
    const titulos = campos.map(campo => campo.nome).join(',');
    
    // Criar as linhas de dados
    const dados = selecionadas.map(i => {
      const mov = movs[i];
      return campos.map(campo => {
        const valor = mov[campo.campo];
        // Se for tipoMovSAP 221, usar 221 no tipo de movimento
        if (campo.campo === 'tipoMov' && mov.tipoMovSAP === '221') return '221';
        // Se for número, formatar com 2 casas decimais
        if (typeof valor === 'number') return valor.toFixed(2);
        // Se for string, escapar aspas
        if (typeof valor === 'string') return '"' + valor.replace(/"/g, '""') + '"';
        return valor;
      }).join(',');
    });

    // Criar o CSV completo
    const csv = [titulos].concat(dados).join('\n');
    
    // Criar e salvar o arquivo
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "movimentacoes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  // Saldo atual por material
  const saldo: Record<string, number> = movs.reduce((acc, m) => {
    const key = m.material;
    if (!acc[key]) acc[key] = 0;
    acc[key] += m.tipoMov === "entrada" ? m.quantidade : -m.quantidade;
    return acc;
  }, {} as Record<string, number>);

return (
  <div className="min-h-screen bg-slate-100 py-8"> {/* Fundo da página e padding vertical */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Container centralizado */}
      <section>
        <h1 className="text-2xl font-bold mb-4">{l.title}</h1>
        <section>
          <h1 className="text-2xl font-bold mb-4">{l.title}</h1>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">{materialLabels.title}</h2>
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <label htmlFor="mat-nome" className="block text-sm font-medium text-slate-700">{materialLabels.nome}</label>
                    <input type="text" name="nome" id="mat-nome" value={newMaterial.nome} onChange={handleMaterialChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="mat-descricao" className="block text-sm font-medium text-slate-700">{materialLabels.descricao}</label>
                    <input type="text" name="descricao" id="mat-descricao" value={newMaterial.descricao} onChange={handleMaterialChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="mat-unidade" className="block text-sm font-medium text-slate-700">{materialLabels.unidade}</label>
                    <input type="text" name="unidade" id="mat-unidade" value={newMaterial.unidade} onChange={handleMaterialChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label htmlFor="mat-saldo" className="block text-sm font-medium text-slate-700">{materialLabels.saldo}</label>
                    <input type="number" name="saldo" id="mat-saldo" value={newMaterial.saldo} onChange={handleMaterialChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
                  </div>
                  <button onClick={handleSaveMaterial} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    {l.cadastrarMaterial}
                  </button>
                </div>
              </div>
            </div>
            <form className="flex flex-wrap gap-4 items-end" onSubmit={handleAdd}>
              <div>
                <label htmlFor="projeto" className="block text-sm font-medium text-slate-700">{l.projeto}</label>
                <input type="text" name="projeto" id="projeto" value={form.projeto} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
              </div>
              <div>
                <label htmlFor="tipoMov" className="block text-sm font-medium text-slate-700">{l.tipoMov}</label>
                <select name="tipoMov" id="tipoMov" value={form.tipoMov} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                  <option value="entrada">{l.entrada}</option>
                  <option value="saida">{l.saida}</option>
                </select>
              </div>
              <div>
                <label htmlFor="material" className="block text-sm font-medium text-slate-700">{l.material}</label>
                <input type="text" name="material" id="material" value={form.material} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" list="materiais" />
                <datalist id="materiais">
                  {materials.map(m => <option key={m.id} value={m.nome} />)}
                </datalist>
              </div>
              <div>
                <label htmlFor="texto" className="block text-sm font-medium text-slate-700">{l.texto}</label>
                <input type="text" name="texto" id="texto" value={form.texto} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
              </div>
              <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-slate-700">{l.quantidade}</label>
                <input type="number" name="quantidade" id="quantidade" value={form.quantidade} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" required min="1" />
              </div>
              <div>
                <label htmlFor="origem" className="block text-sm font-medium text-slate-700">{l.origem}</label>
                <input type="text" name="origem" id="origem" value={form.origem} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
              </div>
              <div>
                <label htmlFor="destino" className="block text-sm font-medium text-slate-700">{l.destino}</label>
                <input type="text" name="destino" id="destino" value={form.destino} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
              </div>
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-slate-700">{l.usuario}</label>
                <input type="text" name="usuario" id="usuario" value={form.usuario} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={handleClear} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                  {l.limpar}
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {l.salvar}
                </button>
              </div>
            </form>
          </div>
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <button onClick={exportarExcel} className="w-full sm:w-auto mb-2 sm:mb-0 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              <MdFileDownload className="mr-2" /> {l.exportar}
            </button>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={l.email} className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2 mt-1 block px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
            <button onClick={solicitarReserva} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400">
              <MdEmail className="mr-2" /> {l.solicitar}
            </button>
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th></th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.projeto}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.tipoMov}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.material}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.texto}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.quantidade}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.origem}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.destino}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.usuario}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{l.acao}</th>
                </tr>
              </thead>
              <tbody>
                {movs.map((m, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-blue-50 text-blue-900" : "bg-white text-blue-900"}>
                    <td className="px-6 py-4 whitespace-nowrap"><input type="checkbox" checked={selecionadas.includes(i)} onChange={() => handleSelect(i)} className="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50" /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.projeto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m.tipoMov === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {m.tipoMov === "entrada" ? <MdAdd className="mr-1" /> : <MdRemove className="mr-1" />} {m.tipoMov}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.material}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.texto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.quantidade.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.origem}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.destino}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{m.usuario}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {m.tipoMovSAP && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">{m.tipoMovSAP}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-green-100 rounded shadow p-4">
            <h2 className="font-bold text-blue-900 mb-2">{l.saldo}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.entries(saldo).map(([mat, qtd]) => (
                <li key={mat} className="flex justify-between border-b border-blue-100 pb-1"><span className="font-semibold">{mat}</span> <span className="font-mono">{qtd as number}</span></li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </div>
  </div>
);
}
