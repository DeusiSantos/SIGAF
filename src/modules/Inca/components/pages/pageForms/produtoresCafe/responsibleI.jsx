import React from "react";
import Input from "../../../form/input/index";
import { ClipboardList, User, Briefcase, Mail, Phone } from "lucide-react";

export default function ResponsibleData({ formData, setFormData, errors }) {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      responsavel: {
        ...prev.responsavel,
        [field]: value,
      },
    }));
  };

  const dados = formData.responsavel || {};

  return (
    <div className="border border-gray-300 p-5 rounded-xl mb-6 shadow-sm">
      <h3 className="text-amber-800 font-semibold mb-4 flex items-center gap-2">
        <ClipboardList size={18} /> Dados do Responsável
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <Input
          type="text"
          label="Nome"
          value={dados.nome || ""}
          onChange={(v) => handleInputChange("nome", v)}
          errorMessage={errors?.nome}
          placeholder="Insira o nome"
          iconStart={<User size={18} />}
        />

        <Input
          type="text"
          label="Função"
          value={dados.funcao || ""}
          onChange={(v) => handleInputChange("funcao", v)}
          errorMessage={errors?.funcao}
          placeholder="Insira a função"
          iconStart={<Briefcase size={18} />}
        />

        <Input
          type="email"
          label="Email"
          value={dados.email || ""}
          onChange={(v) => handleInputChange("email", v)}
          errorMessage={errors?.email}
          placeholder="Insira o email"
          iconStart={<Mail size={18} />}
        />

        <Input
          type="number"
          label="Telefone"
          value={dados.telefone || ""}
          onChange={(v) => handleInputChange("telefone", v)}
          errorMessage={errors?.telefone}
          placeholder="Insira o telefone"
          iconStart={<Phone size={18} />}
        />
      </div>
    </div>
  );
}
