"use client";

import { useLanguage } from "../LanguageContext";

export default function IAResourcePage() {
  const { language } = useLanguage();
  const labels = {
    pt: {
      title: "Alocação de Recursos com IA",
      desc: "Ferramenta de IA para sugerir alocação ótima de recursos e equipes.",
    },
    en: {
      title: "AI Resource Allocation",
      desc: "AI tool to suggest optimal allocation of resources and teams.",
    },
  };
  const l = labels[language];
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">{l.title}</h1>
      <p>{l.desc}</p>
    </section>
  );
}
