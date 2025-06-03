import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

export interface Material {
  id: string;
  nome: string;
  descricao: string;
  unidade: string;
  saldo: number;
}

export function useMaterials() {
  const { language } = useLanguage();
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      nome: 'Cabo 10mm',
      descricao: 'Cabo flexível azul',
      unidade: 'm',
      saldo: 100
    },
    {
      id: '2',
      nome: 'Fio 2,5mm',
      descricao: 'Fio elétrico vermelho',
      unidade: 'm',
      saldo: 50
    },
    {
      id: '3',
      nome: 'Conector',
      descricao: 'Conector duplo',
      unidade: 'un',
      saldo: 200
    }
  ]);

  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    nome: '',
    descricao: '',
    unidade: '',
    saldo: 0
  });

  const labels = {
    pt: {
      nome: 'Nome',
      descricao: 'Descrição',
      unidade: 'Unidade',
      saldo: 'Saldo',
      cadastrar: 'Cadastrar Material',
      salvar: 'Salvar',
      cancelar: 'Cancelar'
    },
    en: {
      nome: 'Name',
      descricao: 'Description',
      unidade: 'Unit',
      saldo: 'Balance',
      cadastrar: 'Register Material',
      salvar: 'Save',
      cancelar: 'Cancel'
    }
  };

  const materialLabels = labels[language];

  function handleMaterialChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewMaterial(prev => ({ ...prev, [name]: value }));
  }

  function handleSaveMaterial() {
    if (!newMaterial.nome || !newMaterial.unidade) return;
    
    const newId = Date.now().toString();
    const material = {
      id: newId,
      nome: newMaterial.nome,
      descricao: newMaterial.descricao || '',
      unidade: newMaterial.unidade,
      saldo: Number(newMaterial.saldo) || 0
    };

    setMaterials(prev => {
      const updatedMaterials = [...prev, material];
      return updatedMaterials;
    });
    setNewMaterial({ nome: '', descricao: '', unidade: '', saldo: 0 });
  }

  function getMaterialByNome(nome: string): Material | undefined {
    return materials.find((m: Material) => m.nome.toLowerCase() === nome.toLowerCase());
  }

  return {
    materials,
    newMaterial,
    l: materialLabels,
    handleMaterialChange,
    handleSaveMaterial,
    getMaterialByNome
  };

  return {
    materials,
    newMaterial,
    l: materialLabels,
    handleMaterialChange,
    handleSaveMaterial,
    getMaterialByNome
  };
}