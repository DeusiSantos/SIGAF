import React from "react";
import Input from "../../../form/input/index";
import { Database, Calendar, ClipboardList, UserCheck } from "lucide-react";

export default function InformacoesGerais({ formData, setFormData, errors }) {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      dadosGerais: {
        ...prev.dadosGerais,
        [field]: value,
      },
    }));
  };

  const dados = formData.dadosGerais || {};

  return (
    <>
      {/* 🔹 Bloco principal: Informações Gerais */}
      <div className="border border-gray-300 p-5 rounded-xl mb-6 shadow-sm">
        <h3 className="text-amber-800 font-semibold mb-4 flex items-center gap-2">
          <ClipboardList size={18} /> Informações Gerais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          {/* Data de registo */}
          <Input
            type="date"
            label="Data de registo"
            value={dados.dataRegisto || ""}
            onChange={(value) => handleInputChange("dataRegisto", value)}
            errorMessage={errors?.dataRegisto}
            placeholder="Insira a data de registo"
            iconStart={<Calendar size={18} />}
          />

          {/* Referência */}
          <Input
            type="text"
            label="Referência do registo"
            value={dados.referenciaRegisto || ""}
            onChange={(value) => handleInputChange("referenciaRegisto", value)}
            errorMessage={errors?.referenciaRegisto}
            disabled
            iconStart={<Database size={18} />}
          />

          {/* Tipo de registo */}
          <Input
            type="select"
            label="Tipo de registo"
            value={dados.tipoRegisto || ""}
            onChange={(value) => handleInputChange("tipoRegisto", value)}
            errorMessage={errors?.tipoRegisto}
            placeholder="Selecione o tipo de registo"
            iconStart={<Database size={18} />}
            options={[
              { label: "Exploração familiar", value: "familiar" },
              { label: "Exploração empresarial", value: "empresarial" },
              { label: "Cooperativa", value: "cooperativa" },
            ]}
          />
        </div>
      </div>

      {/* 🔸 Bloco secundário: Tipos e relação produtor-proprietário */}
      <div className="border border-gray-300  p-5 rounded-xl mb-6 shadow-sm">
        <h3 className="text-amber-700 font-semibold mb-4 flex items-center gap-2">
          <UserCheck size={18} /> Tipo de Investimento e Relação
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Tipo de investimento */}
          <Input
            type="select"
            label="Tipo de investimento"
            value={dados.tipoInvestimento || ""}
            onChange={(value) => handleInputChange("tipoInvestimento", value)}
            errorMessage={errors?.tipoInvestimento}
            placeholder="Selecione o tipo de investimento"
            iconStart={<Database size={18} />}
            options={[
              { label: "Comerciante", value: "comerciante" },
              { label: "Investidor", value: "investidor" },
              { label: "Processador", value: "processador" },
              { label: "Produtor", value: "produtor" },
              { label: "Parceiro", value: "parceiro" },
            ]}
          />

          {/* Produtor é o proprietário */}
          <Input
            type="select"
            label="O produtor é o proprietário?"
            value={dados.produtorProprietario || ""}
            onChange={(value) =>
              handleInputChange("produtorProprietario", value)
            }
            errorMessage={errors?.produtorProprietario}
            placeholder="Selecione uma opção"
            iconStart={<UserCheck size={18} />}
            options={[
              { label: "Sim", value: "sim" },
              { label: "Não", value: "nao" },
            ]}
          />
        </div>
      </div>
    </>
  );
}
