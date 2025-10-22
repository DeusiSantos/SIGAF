import React from "react";
import Input from "../../../form/input/index"; // ajuste o caminho conforme teu projeto
import {
  Route,
  Building2,
  Clock,
  Home,
  MapPin,
  House,
  Navigation,
  Locate,
  RotateCwSquare,
} from "lucide-react";

const AccessInformationForm = ({ formData, setFormData, errors }) => {
  const acessos = formData.acessos || {};

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      acessos: {
        ...prev.acessos,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-8">
      {/* 🏙️ Informações de Acesso */}
      <div className=" border border-gray-300 rounded-2xl p-6">
        <div className="flex items-center mb-4 space-x-2">
          <Route className="text-amber-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-800">
            Acessos e Localização
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="Sede municipal próxima"
            placeholder="Informe a sede municipal mais próxima"
            iconStart={<Building2 size={18} className="text-amber-600" />}
            value={acessos.sedeMunicipalProxima}
            onChange={(value) => handleChange("sedeMunicipalProxima", value)}
            error={errors?.acessos?.sedeMunicipalProxima}
          />

          <Input
            type="text"
            label="Distância à sede comunal (km)"
            placeholder="Informe a distância"
            iconStart={<Navigation size={18} className="text-amber-600" />}
            value={acessos.distanciaSedeComunal}
            onChange={(value) => handleChange("distanciaSedeComunal", value)}
            error={errors?.acessos?.distanciaSedeComunal}
          />

          <Input
            type="select"
            label="As moradias são na unidade de produção?"
            iconStart={<House size={18} className="text-amber-600" />}
            options={[
              { label: "Sim", value: "sim" },
              { label: "Não", value: "nao" },
            ]}
            value={acessos.moradiasNaUnidade}
            onChange={(value) => handleChange("moradiasNaUnidade", value)}
            error={errors?.acessos?.moradiasNaUnidade}
          />

          {acessos.moradiasNaUnidade?.value === "sim" && (
            <Input
              type="text"
              label="Tempo de percurso (horas)"
              placeholder="Informe o tempo de percurso"
              iconStart={<Clock size={18} className="text-amber-600" />}
              value={acessos.tempoPercurso}
              onChange={(value) => handleChange("tempoPercurso", value)}
              error={errors?.acessos?.tempoPercurso}
            />
          )}
        </div>
      </div>

      {/* 🚜 Estado das vias */}
      <div className=" border border-gray-300 rounded-2xl p-6">
        <div className="flex items-center mb-4 space-x-2">
          <MapPin className="text-amber-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-800">
            Estado das vias e localidades
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="select"
            label="Estado da via da sede comunal à localidade próxima"
            iconStart={<RotateCwSquare size={18} className="text-amber-600" />}
            options={[
              { label: "Boa", value: "boa" },
              { label: "Regular", value: "regular" },
              { label: "Má", value: "ma" },
              { label: "Intransitável", value: "intransitavel" },
            ]}
            value={acessos.estadoViaSedeComunalLocalidade}
            onChange={(value) =>
              handleChange("estadoViaSedeComunalLocalidade", value)
            }
            error={errors?.acessos?.estadoViaSedeComunalLocalidade}
          />

          <Input
            type="text"
            label="Localidade mais próxima"
            placeholder="Informe a localidade mais próxima"
            iconStart={<Locate size={18} className="text-amber-600" />}
            value={acessos.localidadeProxima}
            onChange={(value) => handleChange("localidadeProxima", value)}
            error={errors?.acessos?.localidadeProxima}
          />

          <Input
            type="select"
            label="Estado da via da localidade à unidade de produção"
            iconStart={<RotateCwSquare size={18} className="text-amber-600" />}
            options={[
              { label: "Boa", value: "boa" },
              { label: "Regular", value: "regular" },
              { label: "Má", value: "ma" },
              { label: "Intransitável", value: "intransitavel" },
            ]}
            value={acessos.estadoViaLocalidadeUnidade}
            onChange={(value) =>
              handleChange("estadoViaLocalidadeUnidade", value)
            }
            error={errors?.acessos?.estadoViaLocalidadeUnidade}
          />
        </div>
      </div>
    </div>
  );
};

export default AccessInformationForm;
