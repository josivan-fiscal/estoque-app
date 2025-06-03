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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">{l.title}</h1>

        {/* Card para Cadastrar Novo Material */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-200 pb-2">{materialLabels.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label htmlFor="mat-nome" className="block text-sm font-medium text-gray-700">{materialLabels.nome}</label>
              <input type="text" name="nome" id="mat-nome" value={newMaterial.nome} onChange={handleMaterialChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="mat-descricao" className="block text-sm font-medium text-gray-700">{materialLabels.descricao}</label>
              <input type="text" name="descricao" id="mat-descricao" value={newMaterial.descricao} onChange={handleMaterialChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="mat-unidade" className="block text-sm font-medium text-gray-700">{materialLabels.unidade}</label>
              <input type="text" name="unidade" id="mat-unidade" value={newMaterial.unidade} onChange={handleMaterialChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="mat-saldo" className="block text-sm font-medium text-gray-700">{materialLabels.saldo}</label>
              <input type="number" name="saldo" id="mat-saldo" value={newMaterial.saldo} onChange={handleMaterialChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <button onClick={handleSaveMaterial} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              {l.cadastrarMaterial}
            </button>
          </div>
        </div>

        {/* Card para Registrar Movimentação */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-6 border-b border-green-200 pb-2">{l.add}</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 items-end" onSubmit={handleAdd}>
            <div>
              <label htmlFor="projeto" className="block text-sm font-medium text-gray-700">{l.projeto}</label>
              <input type="text" name="projeto" id="projeto" value={form.projeto} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="tipoMov" className="block text-sm font-medium text-gray-700">{l.tipoMov}</label>
              <select name="tipoMov" id="tipoMov" value={form.tipoMov} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500">
                <option value="entrada">{l.entrada}</option>
                <option value="saida">{l.saida}</option>
              </select>
            </div>
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700">{l.material}</label>
              <input type="text" name="material" id="material" value={form.material} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" list="materiais" />
              <datalist id="materiais">
                {materials.map(m => <option key={m.id} value={m.nome} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="texto" className="block text-sm font-medium text-gray-700">{l.texto}</label>
              <input type="text" name="texto" id="texto" value={form.texto} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">{l.quantidade}</label>
              <input type="number" name="quantidade" id="quantidade" value={form.quantidade} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" required min="1" />
            </div>
            <div>
              <label htmlFor="origem" className="block text-sm font-medium text-gray-700">{l.origem}</label>
              <input type="text" name="origem" id="origem" value={form.origem} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="destino" className="block text-sm font-medium text-gray-700">{l.destino}</label>
              <input type="text" name="destino" id="destino" value={form.destino} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">{l.usuario}</label>
              <input type="text" name="usuario" id="usuario" value={form.usuario} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>
            <div className="lg:col-span-3 flex justify-end space-x-3 mt-4">
              <button type="button" onClick={handleClear} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400">
                {l.limpar}
              </button>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500">
                {l.salvar}
              </button>
            </div>
          </form>
        </div>

        {/* Card para Ações (Exportar / Solicitar Reserva) */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-6 border-b border-green-200 pb-2">Ações</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <button onClick={exportarExcel} className="w-full bg-white hover:bg-gray-100 text-green-600 font-semibold py-2 px-4 border border-green-500 rounded-md shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400">
              <MdFileDownload className="mr-2 h-5 w-5" /> {l.exportar}
            </button>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-2">
                <label htmlFor="emailReserva" className="block text-sm font-medium text-gray-700">{l.email}</label>
                <input type="email" id="emailReserva" placeholder="seuemail@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              </div>
              <button onClick={solicitarReserva} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500">
                <MdEmail className="mr-2 h-5 w-5" /> {l.solicitar}
              </button>
            </div>
          </div>
        </div>

        {/* Card para Tabela de Movimentações */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          {/* <h2 className="text-xl font-semibold text-green-700 mb-4 p-6 border-b border-green-200">Histórico de Movimentações</h2> */}
          {/* O título acima pode ser adicionado se desejado, mas a tabela já é auto-explicativa */}
          <table className="min-w-full">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-offset-green-700" onChange={e => setSelecionadas(e.target.checked ? movs.map((_, i) => i) : [])} checked={selecionadas.length === movs.length && movs.length > 0} /></th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{l.projeto}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{l.tipoMov}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{l.material}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{l.texto}</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">{l.quantidade}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{l.origem}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{l.destino}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{l.usuario}</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">SAP</th>
              </tr>
            </thead>
            <tbody>
              {movs.map((m, i) => (
                <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-green-50"} hover:bg-green-100 transition-colors duration-150`}>
                  <td className="px-4 py-3 text-center"><input type="checkbox" className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500" checked={selecionadas.includes(i)} onChange={() => handleSelect(i)} /></td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{m.projeto}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      {m.tipoMovSAP === "221" ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">221</span> 
                                              : m.tipoMov === "entrada" ? <MdAdd className="text-green-600 h-5 w-5" /> 
                                                                        : <MdRemove className="text-red-600 h-5 w-5" />}
                      <span className="ml-2">{m.tipoMovSAP === "221" ? l.solicitar.substring(0, l.solicitar.indexOf("(")).trim() : l[m.tipoMov]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{m.material}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{m.texto}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{m.quantidade.toFixed(2)} {m.unidade}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{m.origem}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{m.destino}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{m.usuario}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 text-center">
                    {m.tipoMovSAP && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">{m.tipoMovSAP}</span>}
                  </td>
                </tr>
              ))}
              {movs.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-500">Nenhuma movimentação registrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card para Saldo Atual por Material */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-200 pb-2">{l.saldo}</h2>
          {Object.keys(saldo).length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(saldo).map(([mat, qtd]) => (
                <li key={mat} className="bg-gray-50 p-3 rounded-md shadow-sm">
                  <span className="font-semibold text-gray-700 block">{mat}</span> 
                  <span className="font-mono text-lg text-green-600">{qtd.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum saldo a ser exibido.</p>
          )}
        </div>

      </div>
    </div>
  );
}
