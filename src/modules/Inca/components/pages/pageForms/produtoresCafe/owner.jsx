import React from "react";
import Input from "../../../form/input/index";
import { User, Database, Phone, Mail, Home, Briefcase } from "lucide-react";

export default function Owner({ formData, setFormData, errors }) {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      proprietario: { ...prev.proprietario, [field]: value },
    }));
  };

  const proprietario = formData.proprietario || {};

  return (
    <>
      {/* 🔹 Dados do Proprietário */}
      <div className="border border-gray-300 p-5 rounded-xl mb-6 shadow-sm">
        <h3 className="text-amber-800 font-semibold mb-4 flex items-center gap-2">
          <User size={18} /> Dados do Proprietário
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <Input
            type="text"
            label="Nome do proprietário"
            value={proprietario.nomeProprietario || ""}
            onChange={(value) => handleInputChange("nomeProprietario", value)}
            errorMessage={errors?.nomeProprietario}
            placeholder="Insira o nome completo"
          />

          <Input
            type="select"
            label="Género"
            value={proprietario.genero || ""}
            onChange={(value) => handleInputChange("genero", value)}
            errorMessage={errors?.genero}
            iconStart={<User size={18} />}
            options={[
              { label: "Masculino", value: "masculino" },
              { label: "Feminino", value: "feminino" },
            ]}
          />

          <Input
            type="number"
            label="Idade"
            value={proprietario.idade || ""}
            onChange={(value) => handleInputChange("idade", value)}
            errorMessage={errors?.idade}
            placeholder="Ex: 45"
            iconStart={<Database size={18} />}
          />

          <Input
            type="text"
            label="Profissão"
            value={proprietario.profissao || ""}
            onChange={(value) => handleInputChange("profissao", value)}
            errorMessage={errors?.profissao}
            placeholder="Ex: Engenheiro Agrónomo"
            iconStart={<Briefcase size={18} />}
          />

          <Input
            type="number"
            label="Telefone"
            value={proprietario.telefone || ""}
            onChange={(value) => handleInputChange("telefone", value)}
            errorMessage={errors?.telefone}
            placeholder="+244 923 000 000"
            iconStart={<Phone size={18} />}
          />

          <Input
            type="text"
            label="E-mail"
            value={proprietario.email || ""}
            onChange={(value) => handleInputChange("email", value)}
            errorMessage={errors?.email}
            placeholder="exemplo@email.com"
            iconStart={<Mail size={18} />}
          />
        </div>
      </div>

      {/* 🔸 Informações Complementares */}
      <div className="border border-amber-300 bg-amber-50 p-5 rounded-xl mb-6 shadow-sm">
        <h3 className="text-amber-700 font-semibold mb-4 flex items-center gap-2">
          <Database size={18} /> Informações Complementares
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input
            type="number"
            label="Quantas propriedades tem?"
            value={proprietario.qtdPropriedades || ""}
            onChange={(value) => handleInputChange("qtdPropriedades", value)}
            errorMessage={errors?.qtdPropriedades}
            placeholder="Ex: 2"
          />

          <Input
            type="text"
            label="Moradia"
            value={proprietario.moradia || ""}
            onChange={(value) => handleInputChange("moradia", value)}
            errorMessage={errors?.moradia}
            placeholder="Ex: Bairro Central, Viana"
            iconStart={<Home size={18} />}
          />
        </div>
      </div>
    </>
  );
}
