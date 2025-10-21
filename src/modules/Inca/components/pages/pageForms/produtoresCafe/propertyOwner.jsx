import React from "react";
import Input from "../../../form/input/index";
import MapaLeaflet from "../../shared/mapLeaflet";
import FileUpload from "../../../form/upload/fileUpload";
import { Home, MapPin, Phone, Mail, Database } from "lucide-react";

export default function IdentificacaoPropriedade({
  formData,
  setFormData,
  errors,
}) {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      propriedade: {
        ...prev.propriedade,
        [field]: value,
      },
    }));
  };

  const propriedade = formData.propriedade || {};

  const handleMapClick = (lat, lng) => {
    handleInputChange("latitude", lat);
    handleInputChange("longitude", lng);
  };

  return (
    <>
      {/* 🔹 Identificação da Propriedade */}
      <div className="border border-gray-300 p-5 rounded-xl mb-6">
        <h3 className="text-amber-800 font-semibold mb-4 flex items-center gap-2">
          <Home size={18} /> Identificação da Propriedade
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <Input
            type="text"
            label="Nome da propriedade"
            value={propriedade.nomePropriedade || ""}
            onChange={(value) => handleInputChange("nomePropriedade", value)}
            placeholder="Insira o nome da propriedade"
            iconStart={<Home size={18} />}
          />

          <Input
            type="text"
            label="Localidade"
            value={propriedade.localidade || ""}
            onChange={(value) => handleInputChange("localidade", value)}
            placeholder="Ex: Camama, Kilamba"
            iconStart={<MapPin size={18} />}
          />

          <Input
            type="text"
            label="Província"
            value={propriedade.provincia || ""}
            onChange={(value) => handleInputChange("provincia", value)}
            placeholder="Ex: Luanda"
            iconStart={<Database size={18} />}
          />

          <Input
            type="text"
            label="Município"
            value={propriedade.municipio || ""}
            onChange={(value) => handleInputChange("municipio", value)}
            placeholder="Ex: Viana"
          />

          <Input
            type="text"
            label="Comuna"
            value={propriedade.comuna || ""}
            onChange={(value) => handleInputChange("comuna", value)}
            placeholder="Ex: Zango"
          />

          <Input
            type="text"
            label="Moradia"
            value={propriedade.moradia || ""}
            onChange={(value) => handleInputChange("moradia", value)}
            placeholder="Endereço da moradia"
            iconStart={<Home size={18} />}
          />

          <Input
            type="text"
            label="Telefone"
            value={propriedade.telefone || ""}
            onChange={(value) => handleInputChange("telefone", value)}
            placeholder="+244 923 000 000"
            iconStart={<Phone size={18} />}
          />

          <Input
            type="text"
            label="Email"
            value={propriedade.email || ""}
            onChange={(value) => handleInputChange("email", value)}
            placeholder="exemplo@email.com"
            iconStart={<Mail size={18} />}
          />
        </div>
      </div>

      {/* 🔹 Localização Geográfica */}
      <div className="border border-gray-300 p-5 rounded-xl mb-6">
        <h3 className="text-amber-800 font-semibold mb-4 flex items-center gap-2">
          <MapPin size={18} /> Localização Geográfica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
          <Input
            type="text"
            label="Latitude (°)"
            value={propriedade.latitude || ""}
            onChange={(value) => handleInputChange("latitude", value)}
            placeholder="Ex: -8.838333"
          />

          <Input
            type="text"
            label="Longitude (°)"
            value={propriedade.longitude || ""}
            onChange={(value) => handleInputChange("longitude", value)}
            placeholder="Ex: 13.234444"
          />

          <Input
            type="text"
            label="Altitude (m)"
            value={propriedade.altitude || ""}
            onChange={(value) => handleInputChange("altitude", value)}
            placeholder="Ex: 100"
          />

          <Input
            type="text"
            label="Acurácia (m)"
            value={propriedade.accuracy || ""}
            onChange={(value) => handleInputChange("accuracy", value)}
            placeholder="Ex: 5"
          />
        </div>

        {/* 🗺️ Mapa Interativo */}
        <div className="mt-6">
          <MapaLeaflet
            latitude={propriedade.latitude}
            longitude={propriedade.longitude}
            onLocationSelect={handleMapClick}
            height="h-96"
            showPopup
            popupTitle="Localização da Propriedade"
            clickInfoText="Clique no mapa para definir a localização da propriedade"
            className="mt-4"
          />
        </div>
      </div>

      {/* 🔹 Upload de Fotos */}
      <div className=" rounded-2xl p-6 border border-gray-300 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-amber-800">
          Fotografar o Espaço da Fazenda
        </h3>

        <FileUpload
          label="Upload da Imagem"
          accept="image/*"
          color="amber"
          variant="dropzone"
          placeholder="Selecione ou arraste uma imagem da propriedade"
          showPreview={true}
          onChange={(file) => handleInputChange("fotoPropriedade", file)}
          helperText="Envie uma foto que represente bem o espaço da fazenda."
        />
      </div>
    </>
  );
}
