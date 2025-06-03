"use client";
import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { MdCompareArrows, MdAdd, MdRemove, MdEmail, MdFileDownload } from "react-icons/md";
import { Material, useMaterials } from "./materials";

type Mov = {
  projeto: string;
  tipoMov: string;
  material: string;
  texto: string;
  quantidade: number;
  origem: string;
  destino: string;
  usuario: string;
  tipoMovSAP: string;
  unidade: string;
};

export default function MovimentacoesPage() {
  const { language } = useLanguage();
  const { materials, newMaterial, l: materialLabels, handleMaterialChange, handleSaveMaterial, getMaterialByNome } = useMaterials();
  const [movs, setMovs] = useState<Mov[]>([
    { projeto: "Obra Alpha", tipoMov: "entrada", material: "Cabo 10mm", texto: "Cabo flexível azul", quantidade: 100, origem: "NF 12345", destino: "Estoque Central", usuario: "João", tipoMovSAP: "", unidade: "m" },
    { projeto: "Obra Alpha", tipoMov: "saida", material: "Cabo 10mm", texto: "Cabo flexível azul", quantidade: 20, origem: "Estoque Central", destino: "Obra Alpha", usuario: "Maria", tipoMovSAP: "", unidade: "m" },
  ]);
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
  });
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [email, setEmail] = useState("");

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
    <section>
      <h1 className="text-2xl font-bold mb-4">{l.title}</h1>
      <section>
        <h1 className="text-2xl font-bold mb-4">{l.title}</h1>
        <div className="bg-white rounded shadow p-4 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">{materialLabels.cadastrar}</h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1">{materialLabels.nome}</label>
                <input name="nome" value={newMaterial.nome} onChange={handleMaterialChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1">{materialLabels.descricao}</label>
                <input name="descricao" value={newMaterial.descricao} onChange={handleMaterialChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1">{materialLabels.unidade}</label>
                <input name="unidade" value={newMaterial.unidade} onChange={handleMaterialChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1">{materialLabels.saldo}</label>
                <input name="saldo" type="number" value={newMaterial.saldo} onChange={handleMaterialChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
              </div>
              <button onClick={handleSaveMaterial} className="bg-blue-900 text-white px-4 py-2 rounded font-bold flex items-center gap-1 hover:bg-blue-800">
                <MdAdd /> {materialLabels.salvar}
              </button>
            </div>
          </div>
          <form className="flex flex-wrap gap-4 items-end" onSubmit={handleAdd}>
            <div>
              <label className="block text-xs font-semibold text-blue-900 mb-1">{l.projeto}</label>
              <input name="projeto" value={form.projeto} onChange={handleChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-900 mb-1">{l.tipoMov}</label>
              <select name="tipoMov" value={form.tipoMov} onChange={handleChange} className="border rounded px-2 py-1 text-blue-900 bg-white">
                <option value="entrada">{l.entrada}</option>
                <option value="saida">{l.saida}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-900 mb-1">{l.material}</label>
              <select 
                name="material" 
                value={form.material} 
                onChange={handleChange} 
                className="border rounded px-2 py-1 text-blue-900 bg-white" 
                required
              >
                <option value="">Selecione um material...</option>
                {materials.map(mat => (
                  <option 
                    key={mat.id} 
                    value={mat.nome}
                    title={`${mat.descricao} - ${mat.saldo} ${mat.unidade}`}
                  >
                    {mat.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-900 mb-1">{l.texto}</label>
              <input name="texto" value={form.texto} onChange={handleChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-900 mb-1">{l.quantidade}</label>
              <input name="quantidade" type="number" value={form.quantidade} onChange={handleChange} className="border rounded px-2 py-1 text-blue-900 bg-white" required min="1" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-900 mb-1">{l.origem}</label>
              <input name="origem" value={form.origem} onChange={handleChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-900 mb-1">{l.destino}</label>
              <input name="destino" value={form.destino} onChange={handleChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-900 mb-1">{l.usuario}</label>
              <input name="usuario" value={form.usuario} onChange={handleChange} className="border rounded px-2 py-1 text-blue-900 bg-white" />
            </div>
            <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded font-bold flex items-center gap-1 hover:bg-blue-800"><MdAdd /> {l.salvar}</button>
            <button type="button" onClick={handleClear} className="bg-gray-200 text-blue-900 px-4 py-2 rounded font-bold flex items-center gap-1 hover:bg-gray-300"><MdRemove /> {l.limpar}</button>
          </form>
        </div>
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <button onClick={exportarExcel} className="bg-green-700 text-white px-4 py-2 rounded font-bold flex items-center gap-1 hover:bg-green-800"><MdFileDownload /> {l.exportar}</button>
          <input type="email" placeholder={l.email} value={email} onChange={e => setEmail(e.target.value)} className="border rounded px-2 py-1 text-blue-900 bg-white" />
          <button onClick={solicitarReserva} className="bg-blue-900 text-white px-4 py-2 rounded font-bold flex items-center gap-1 hover:bg-blue-800"><MdEmail /> {l.solicitar}</button>
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded shadow text-sm md:text-base">
            <thead className="bg-blue-900 text-white text-base font-semibold">
              <tr>
                <th></th>
                <th className="px-6 py-3">{l.projeto}</th>
                <th className="px-6 py-3">{l.tipoMov}</th>
                <th className="px-6 py-3">{l.material}</th>
                <th className="px-6 py-3">{l.texto}</th>
                <th className="px-6 py-3">{l.quantidade}</th>
                <th className="px-6 py-3">{l.origem}</th>
                <th className="px-6 py-3">{l.destino}</th>
                <th className="px-6 py-3">{l.usuario}</th>
                <th className="px-6 py-3">{l.acao}</th>
              </tr>
            </thead>
            <tbody>
              {movs.map((m, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-blue-50 text-blue-900" : "bg-white text-blue-900"}>
                  <td className="px-2 py-2 text-center"><input type="checkbox" checked={selecionadas.includes(i)} onChange={() => handleSelect(i)} /></td>
                  <td className="px-6 py-3">{m.projeto}</td>
                  <td className="px-6 py-3">{m.tipoMovSAP === "221" ? "221" : m.tipoMov}</td>
                  <td className="px-6 py-3">{m.material}</td>
                  <td className="px-6 py-3">{m.texto}</td>
                  <td className="px-6 py-3">{m.quantidade}</td>
                  <td className="px-6 py-3">{m.origem}</td>
                  <td className="px-6 py-3">{m.destino}</td>
                  <td className="px-6 py-3">{m.usuario}</td>
                  <td className="px-6 py-3">{m.tipoMovSAP}</td>
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
  );
}
