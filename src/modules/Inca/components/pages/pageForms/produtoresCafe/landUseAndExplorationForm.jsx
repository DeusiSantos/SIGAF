import React, { useState } from "react";
import Input from "../../../form/input/index";
import { LandPlot, TreePine } from "lucide-react";

const LandUseAndExplorationForm = ({ formData, setFormData, errors }) => {
  const [showOtherAcquisition, setShowOtherAcquisition] = useState(false);
  const [showAssociatedCrops, setShowAssociatedCrops] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      usoExploracaoTerra: {
        ...prev.usoExploracaoTerra,
        [field]: value,
      },
    }));
  };

  const data = formData?.usoExploracaoTerra || {};

  return (
    <div className="space-y-8">
      {/* 🏡 Acquisition Method */}
      <div className=" border border-gray-300 rounded-2xl p-6">
        <div className="flex items-center mb-4 space-x-2">
          <LandPlot className="text-amber-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-800">
            Formas de Aquisição
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="select"
            label="Forma de Aquisição"
            options={[
              { label: "Herança", value: "heranca" },
              { label: "Comprada", value: "comprada" },
              { label: "Outras formas de aquisição", value: "outras" },
            ]}
            value={data.formaAquisicao}
            onChange={(value) => {
              handleChange("formaAquisicao", value);
              setShowOtherAcquisition(value?.value === "outras");
            }}
            error={errors?.usoExploracaoTerra?.formaAquisicao}
          />

          <Input
            type="number"
            label="Área total (ha)"
            value={data.areaTotal}
            onChange={(value) => handleChange("areaTotal", value)}
            error={errors?.usoExploracaoTerra?.areaTotal}
          />
        </div>

        {showOtherAcquisition && (
          <div className="mt-4 animate-fadeIn">
            <Input
              type="textarea"
              label="Descreva como obteve a propriedade"
              value={data.descricaoOutraAquisicao}
              onChange={(value) =>
                handleChange("descricaoOutraAquisicao", value)
              }
              error={errors?.usoExploracaoTerra?.descricaoOutraAquisicao}
            />
          </div>
        )}
      </div>

      {/* 🌿 Exploration Mode */}
      <div className=" border border-gray-300 rounded-2xl p-6">
        <div className="flex items-center mb-4 space-x-2">
          <TreePine className="text-amber-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-800">
            Modo de Exploração
          </h3>
        </div>

        <Input
          type="select"
          label="Modo de Exploração"
          options={[
            { label: "Com sombra", value: "com_sombra" },
            { label: "Sem sombra", value: "sem_sombra" },
          ]}
          value={data.modoExploracao}
          onChange={(value) => handleChange("modoExploracao", value)}
          error={errors?.usoExploracaoTerra?.modoExploracao}
        />
      </div>

      {/* 📏 Área em Hectares */}
      <div className="border border-gray-300 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Área em Hectares
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {["2020", "2021", "2022", "2023", "2024", "2025"].map((year) => (
            <Input
              key={year}
              type="number"
              label={`Área ${year}`}
              value={data[`area_${year}`]}
              onChange={(value) => handleChange(`area_${year}`, value)}
              error={errors?.usoExploracaoTerra?.[`area_${year}`]}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          <Input
            type="number"
            label="Área com café (total)"
            value={data.areaCafe}
            onChange={(value) => handleChange("areaCafe", value)}
            error={errors?.usoExploracaoTerra?.areaCafe}
          />

          {["2020", "2021", "2022", "2023", "2024", "2025"].map((year) => (
            <Input
              key={`areaCafe_${year}`}
              type="number"
              label={`Área com café ${year}`}
              value={data[`areaCafe_${year}`]}
              onChange={(value) => handleChange(`areaCafe_${year}`, value)}
              error={errors?.usoExploracaoTerra?.[`areaCafe_${year}`]}
            />
          ))}
        </div>

        <div className="mt-6">
          <Input
            type="select"
            label="Existe outra cultura cultivada com o café?"
            options={[
              { label: "Não", value: "nao" },
              { label: "Sim", value: "sim" },
            ]}
            value={data.existeOutraCultura}
            onChange={(value) => {
              handleChange("existeOutraCultura", value);
              setShowAssociatedCrops(value?.value === "sim");
            }}
            error={errors?.usoExploracaoTerra?.existeOutraCultura}
          />
        </div>

        {showAssociatedCrops && (
          <div className="mt-4 animate-fadeIn space-y-4">
            <Input
              type="multiselect"
              label="Culturas associadas com o café"
              options={[
                { label: "Banana", value: "banana" },
                { label: "Mandioca", value: "mandioca" },
                { label: "Milho", value: "milho" },
                { label: "Feijão", value: "feijao" },
                { label: "Outra", value: "outra" },
              ]}
              value={data.culturasAssociadas}
              onChange={(value) => handleChange("culturasAssociadas", value)}
              error={errors?.usoExploracaoTerra?.culturasAssociadas}
            />

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {["total", "2020", "2021", "2022", "2023", "2024", "2025"].map(
                (year) => (
                  <Input
                    key={`areaOutras_${year}`}
                    type="number"
                    label={`Área outras culturas ${year}`}
                    value={data[`areaOutras_${year}`]}
                    onChange={(value) =>
                      handleChange(`areaOutras_${year}`, value)
                    }
                    error={errors?.usoExploracaoTerra?.[`areaOutras_${year}`]}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandUseAndExplorationForm;
