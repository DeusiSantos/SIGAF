import React from "react";
import Input from "../../../form/input/index";
import { Database, User } from "lucide-react";

export default function InformacoesGerais({ formData, setFormData, errors }) {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Input
          type="date"
          label="Data de registo"
          value={formData.dataRegisto || ""}
          onChange={(value) => handleInputChange("dataRegisto", value)}
          errorMessage={errors.dataRegisto}
          placeholder="Insira a data de registo"
        />
      </div>

      <div>
        <Input
          type="select"
          label="Tipo de registo"
          value={formData.tipoRegisto || ""}
          onChange={(value) => handleInputChange("tipoRegisto", value)}
          errorMessage={errors.tipoRegisto}
          placeholder="Insira o tipo registo"
          iconStart={<Database size={18} />}
          options={[
            { label: "Exploração familiar", value: "PUBLICA" },
            { label: "Exploração empresárial", value: "PUBLICA" },
            { label: "Cooperariva", value: "PUBLICA" },
          ]}
        />
      </div>
      <div>
        <div>
          <Input
            type="select"
            label="Tipo de envestimento"
            value={formData.tipoInvestimento || ""}
            onChange={(value) => handleInputChange("tipoInvestimento", value)}
            errorMessage={errors.tipoInvestimento}
            placeholder="Insira o tipo de envestimento"
            iconStart={<Database size={18} />}
            options={[
              { label: "Comerciante", value: "Comerciante" },
              { label: "Investidor", value: "Investidor" },
              { label: "Processador", value: "Processador" },
              { label: "Produtor", value: "Produtor" },
              { label: "Parceiros", value: "Parceiros" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
