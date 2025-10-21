import React from "react";
import Input from "../../../form/input/index";
import { User, Users, Heart, Database, Home, Phone, Mail } from "lucide-react";

export default function ProdutorForm({ formData, setFormData, errors }) {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      produtor: { ...prev.produtor, [field]: value },
    }));
  };

  const produtor = formData.produtor || {};

  return (
    <>
      {/* 🔹 Dados Pessoais */}
      <div className="border border-gray-300  p-5 rounded-xl mb-6">
        <h3 className="text-amber-800 font-semibold mb-4 flex items-center gap-2">
          <User size={18} /> Dados Pessoais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <Input
            type="text"
            label="Nome do produtor"
            value={produtor.nomeProdutor || ""}
            onChange={(value) => handleInputChange("nomeProdutor", value)}
            errorMessage={errors?.nomeProdutor}
            placeholder="Insira o nome completo"
          />

          <Input
            type="number"
            label="Idade"
            value={produtor.idade || ""}
            onChange={(value) => handleInputChange("idade", value)}
            errorMessage={errors?.idade}
            placeholder="Ex: 35"
          />

          <Input
            type="select"
            label="Género"
            value={produtor.genero || ""}
            onChange={(value) => handleInputChange("genero", value)}
            errorMessage={errors?.genero}
            options={[
              { label: "Masculino", value: "masculino" },
              { label: "Feminino", value: "feminino" },
            ]}
            iconStart={<User size={18} />}
          />

          <Input
            type="select"
            label="Tem cônjuge?"
            value={produtor.temConjuge || ""}
            onChange={(value) => handleInputChange("temConjuge", value)}
            errorMessage={errors?.temConjuge}
            options={[
              { label: "Sim", value: "sim" },
              { label: "Não", value: "nao" },
            ]}
            iconStart={<Heart size={18} />}
          />

          <Input
            type="text"
            label="Profissão"
            value={produtor.profissao || ""}
            onChange={(value) => handleInputChange("profissao", value)}
            errorMessage={errors?.profissao}
            placeholder="Insira a profissão"
            iconStart={<Database size={18} />}
          />

          <Input
            type="number"
            label="Quantas propriedades tem?"
            value={produtor.qtdPropriedades || ""}
            onChange={(value) => handleInputChange("qtdPropriedades", value)}
            errorMessage={errors?.qtdPropriedades}
            placeholder="Ex: 3"
          />
        </div>
      </div>

      {/* 🔸 Bloco do Cônjuge (só aparece se "Tem cônjuge" === "sim") */}
      {produtor.temConjuge?.value === "sim" && (
        <div className="border border-amber-200 bg-amber-50 p-5 rounded-xl mb-6 shadow-sm">
          <h3 className="text-amber-700 font-semibold mb-4 flex items-center gap-2">
            <Heart size={18} /> Dados do Cônjuge
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <Input
              type="number"
              label="Idade do cônjuge"
              value={produtor.idadeConjuge || ""}
              onChange={(value) => handleInputChange("idadeConjuge", value)}
              errorMessage={errors?.idadeConjuge}
              placeholder="Ex: 32"
            />

            <Input
              type="select"
              label="Género do cônjuge"
              value={produtor.generoConjuge || ""}
              onChange={(value) => handleInputChange("generoConjuge", value)}
              errorMessage={errors?.generoConjuge}
              options={[
                { label: "Masculino", value: "masculino" },
                { label: "Feminino", value: "feminino" },
              ]}
              iconStart={<User size={18} />}
            />

            <Input
              type="select"
              label="O cônjuge apoia nas atividades do campo?"
              value={produtor.conjugeApoia || ""}
              onChange={(value) => handleInputChange("conjugeApoia", value)}
              errorMessage={errors?.conjugeApoia}
              options={[
                { label: "Sim", value: "sim" },
                { label: "Não", value: "nao" },
              ]}
              iconStart={<Users size={18} />}
            />
          </div>
        </div>
      )}

      {/* 🔹 Composição Familiar */}
      <div className="border border-gray-300  p-5 rounded-xl mb-6">
        <h3 className="text-orange-700 font-semibold mb-4 flex items-center gap-2">
          <Users size={18} /> Composição Familiar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
          <Input
            type="number"
            label="Agregado total"
            value={produtor.agregadoTotal || ""}
            onChange={(value) => handleInputChange("agregadoTotal", value)}
            placeholder="Ex: 6"
          />

          <Input
            type="number"
            label="Quantos do sexo feminino"
            value={produtor.qtdFeminino || ""}
            onChange={(value) => handleInputChange("qtdFeminino", value)}
            placeholder="Ex: 3"
          />

          <Input
            type="number"
            label="Adultos"
            value={produtor.qtdAdultos || ""}
            onChange={(value) => handleInputChange("qtdAdultos", value)}
            placeholder="Ex: 4"
          />

          <Input
            type="number"
            label="Adultos do sexo masculino"
            value={produtor.qtdAdultosMasculino || ""}
            onChange={(value) =>
              handleInputChange("qtdAdultosMasculino", value)
            }
            placeholder="Ex: 2"
          />
        </div>
      </div>

      {/* 🔹 Contactos e Moradia */}
      <div className="border border-gray-200  p-5 rounded-xl mb-4">
        <h3 className="text-yellow-700 font-semibold mb-4 flex items-center gap-2">
          <Phone size={18} /> Contactos e Moradia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <Input
            type="text"
            label="Moradia"
            value={produtor.moradia || ""}
            onChange={(value) => handleInputChange("moradia", value)}
            placeholder="Ex: Bairro Central, Viana"
            iconStart={<Home size={18} />}
          />

          <Input
            type="text"
            label="E-mail"
            value={produtor.email || ""}
            onChange={(value) => handleInputChange("email", value)}
            placeholder="exemplo@email.com"
            iconStart={<Mail size={18} />}
          />

          <Input
            type="text"
            label="Telefone"
            value={produtor.telefone || ""}
            onChange={(value) => handleInputChange("telefone", value)}
            placeholder="+244 923 000 000"
            iconStart={<Phone size={18} />}
          />
        </div>
      </div>
    </>
  );
}
