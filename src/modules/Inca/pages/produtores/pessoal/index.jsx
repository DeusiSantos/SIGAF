import { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  X,
  Phone,
  MapPin,
  Eye,
  EllipsisVertical,
  Edit,
  FileText,
  CircleUserRound,
  Sprout,
  ClipboardCheck,
  Route,
} from "lucide-react";
import { TreePine, Shield, UserCheck, Activity } from "lucide-react";
import { Users, UserPlus } from "lucide-react";
import FilterBar from "../../../components/pages/shared/filterBar";
import StatCard from "../../../components/pages/shared/statCard";
import PageHeader from "../../../components/pages/shared/pageHeader";
import TabNavigation from "../../../components/pages/shared/tabNavigation";
import GenericTable from "../../../components/pages/shared/genericTable";
import { getInitials } from "../../../utils/getInitials";
import MultiStepForm from "../../../components/pages/shared/multiStepForm";
import InformacoesGerais from "../../../components/pages/pageForms/produtoresCafe/generalInformation";
import InfoSection from "../../../components/pages/shared/infoSection";
import Owner from "../../../components/pages/pageForms/produtoresCafe/owner";
import Producer from "@/modules/Inca/components/pages/pageForms/produtoresCafe/producer";
import PropertyOwner from "@/modules/Inca/components/pages/pageForms/produtoresCafe/propertyOwner";
import Responsible from "@/modules/Inca/components/pages/pageForms/produtoresCafe/responsibleI";
import LandUseAndExplorationForm from "@/modules/Inca/components/pages/pageForms/produtoresCafe/landUseAndExplorationForm";
import AccessInformationForm from "@/modules/Inca/components/pages/pageForms/produtoresCafe/accessInformationForm";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gestao");
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedStatus: "",
    selectedProvince: "",
    selectedActivity: "",
  });

  const [formData, setFormData] = useState({
    dadosGerais: {
      dataRegisto: new Date().toISOString().split("T")[0],
      referenciaRegisto: "2025",
      tipoRegisto: { label: "Produtor", value: "produtor" },
      tipoInvestimento: { label: "", value: "" },
      produtorProprietario: { label: "Não", value: "nao" },
    },
    produtor: {
      nome: "",
      idade: "",
      genero: { label: "", value: "" },
      temConjuge: { label: "Não", value: "nao" },
      idadeConjuge: "",
      generoConjuge: { label: "", value: "" },
      conjugeApoia: { label: "Não", value: "nao" },
      agregadoTotal: "",
      quantosFeminino: "",
      adultos: "",
      adultosMasculino: "",
      email: "",
      telefone: "",
      moradia: "",
    },

    proprietario: {
      nome: "",
      genero: { label: "", value: "" },
      idade: "",
      profissao: "",
      telefone: "",
      email: "",
      quantasPropriedades: "",
    },

    propriedade: {
      nome: "",
      localidade: "",
      moradia: "",
      telefone: "",
      email: "",
      provincia: "",
      municipio: "",
      comuna: "",
      latitude: "",
      longitude: "",
      altitude: "",
      accuracy: "",
      fotoEspaco: null,
    },
    usoExploracaoTerra: {
      // 🏡 Forma de Aquisição
      formaAquisicao: null, // herança, comprada, outras
      areaTotal: "",
      descricaoOutraAquisicao: "",

      // 🌿 Modo de Exploração
      modoExploracao: null, // com sombra / sem sombra

      // 📏 Área Total (ha)
      area_2020: "",
      area_2021: "",
      area_2022: "",
      area_2023: "",
      area_2024: "",
      area_2025: "",

      // ☕ Área com Café
      areaCafe: "",
      areaCafe_2020: "",
      areaCafe_2021: "",
      areaCafe_2022: "",
      areaCafe_2023: "",
      areaCafe_2024: "",
      areaCafe_2025: "",

      // 🌾 Outras Culturas
      outrasCulturas: null, // sim / nao
      culturasAssociadas: [], // multiselect
      outraArea_Total: "",
      outraArea_2020: "",
      outraArea_2021: "",
      outraArea_2022: "",
      outraArea_2023: "",
      outraArea_2024: "",
      outraArea_2025: "",

      tipoAnimaisFazenda: null,
    },
    acessos: {
      // 🚗 Informações de Acesso
      sedeMunicipalProxima: "",
      distanciaSedeComunal: "",
      tempoPercurso: "",
      moradiasNaUnidade: null, // sim / nao
      estadoViaSedeComunalLocalidade: null, // boa / regular / má / intransitável
      localidadeProxima: "",
      estadoViaLocalidadeUnidade: null, // boa / regular / má / intransitável
    },

    responsavel: {
      nome: "",
      funcao: "",
      telefone: "",
      email: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // depois de 1.5 segundos, o loading termina
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      icon: User,
      iconBgColor: "blue-100",
      iconColor: "blue-600",
      label: "Total",
      value: 1,
    },
    {
      icon: Clock,
      iconBgColor: "blue-100",
      iconColor: "blue-600",
      label: "Processos",
      value: 1,
    },
    {
      icon: AlertTriangle,
      iconBgColor: "yellow-100",
      iconColor: "yellow-600",
      label: "Pendentes",
      value: 1,
    },
    {
      icon: CheckCircle,
      iconBgColor: "blue-100",
      iconColor: "blue-600",
      label: "Aprovados",
      value: 1,
    },
    {
      icon: X,
      iconBgColor: "red-100",
      iconColor: "red-600",
      label: "Rejeitados",
      value: 1,
    },
  ];

  const tabs = [
    {
      id: "gestao",
      title: "Gestão",
      icon: Users,
      description: "Visualizar todos",
      color: "green",
    },
    {
      id: "cadastro",
      title: "Registrar",
      icon: UserPlus,
      description: "Novo Produtor",
      color: "blue",
    },
  ];

  const produtores = [
    {
      id: 1,
      nome: "Maria João",
      numeroBI: "002345678LA045",
      telefone: "+244 923 456 789",
      provincia: "Luanda",
      municipio: "Viana",
      statusProcesso: "APROVADO",
    },
    {
      id: 2,
      nome: "Carlos Domingos",
      numeroBI: "007654321LA032",
      telefone: "+244 928 123 456",
      provincia: "Huíla",
      municipio: "Lubango",
      statusProcesso: "PENDENTE",
    },
    {
      id: 3,
      nome: "Ana Manuel",
      numeroBI: "003211456LA019",
      telefone: "+244 922 987 654",
      provincia: "Benguela",
      municipio: "Lobito",
      statusProcesso: "REJEITADO",
    },
    {
      id: 4,
      nome: "José António",
      numeroBI: "009876543LA028",
      telefone: "+244 923 555 222",
      provincia: "Huambo",
      municipio: "Caála",
      statusProcesso: "APROVADO",
    },
    {
      id: 5,
      nome: "Isabel Mateus",
      numeroBI: "004567890LA013",
      telefone: "+244 924 333 111",
      provincia: "Cuanza Sul",
      municipio: "Sumbe",
      statusProcesso: "PENDENTE",
    },
    {
      id: 6,
      nome: "Fernando dos Santos",
      numeroBI: "006789012LA056",
      telefone: "+244 934 777 555",
      provincia: "Malanje",
      municipio: "Malanje",
      statusProcesso: "APROVADO",
    },
    {
      id: 7,
      nome: "Helena Chilala",
      numeroBI: "009001122LA033",
      telefone: "+244 922 888 666",
      provincia: "Namibe",
      municipio: "Tômbwa",
      statusProcesso: "REJEITADO",
    },
    {
      id: 8,
      nome: "Pedro Kassoma",
      numeroBI: "001234567LA010",
      telefone: "+244 929 444 999",
      provincia: "Cabinda",
      municipio: "Cabinda",
      statusProcesso: "APROVADO",
    },
    {
      id: 9,
      nome: "Lúcia Fernandes",
      numeroBI: "001122334LA011",
      telefone: "+244 923 112 223",
      provincia: "Cunene",
      municipio: "Ondjiva",
      statusProcesso: "PENDENTE",
    },
    {
      id: 10,
      nome: "Miguel Paulo",
      numeroBI: "001233445LA041",
      telefone: "+244 933 765 432",
      provincia: "Zaire",
      municipio: "M'Banza Congo",
      statusProcesso: "REJEITADO",
    },
  ];

  const columns = [
    {
      key: "nome",
      label: "Nome",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-800 to-amber-900 flex items-center justify-center text-white text-lg font-bold mr-3">
            {getInitials(value)}
          </div>
          <div>
            <div className="font-semibold">{value}</div>
            <div className="text-xs text-gray-500">{row.numeroBI}</div>
          </div>
        </div>
      ),
    },
    {
      key: "telefone",
      label: "Telefone",
      render: (value) => (
        <div className="flex items-center">
          <Phone className="w-5 h-5 mr-2 text-amber-800" />
          {value}
        </div>
      ),
    },
    {
      key: "provincia",
      label: "Localização",
      render: (value, row) => (
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-amber-800" />
          {row.municipio}, {value}
        </div>
      ),
    },
    {
      key: "statusProcesso",
      label: "Status",
      className: "text-center",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === "APROVADO"
              ? "bg-green-100 text-green-800"
              : value === "PENDENTE"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      className: "text-center",
      headerClassName: "text-center",
      render: (_, row) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita trigger do onRowClick
              alert(`Visualizar produtor ID: ${row.id}`);
            }}
            className="p-2 hover:bg-amber-100 text-amber-800 rounded-full"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Editar produtor ID: ${row.id}`);
            }}
            className="p-2 hover:bg-green-100 text-green-600 rounded-full"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Tem certeza que deseja eliminar este produtor?")) {
                alert(`Eliminar produtor ID: ${row.id}`);
              }
            }}
            className="p-2 hover:bg-red-100 text-red-600 rounded-full"
          >
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const steps = [
    {
      label: "Informações gerais",
      icon: FileText,
      content: (
        <div>
          <InfoSection
            title="Informações Gerais"
            description="Dados básicos sobre o registro da fonte de água para irrigação."
            color="amber"
          />
          <InformacoesGerais
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },
    {
      label: "Identificação do produtor",
      icon: UserCheck,
      content: (
        <div>
          <InfoSection
            title="Informações do produtor"
            description="Dados para identificação do produtor."
            color="amber"
          />
          <Producer
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },
    ...(formData?.dadosGerais?.produtorProprietario?.value === "nao"
      ? [
          {
            label: "Proprietário",
            icon: CircleUserRound,
            content: (
              <div>
                <InfoSection
                  title="Informações do Proprietário"
                  description="Dados básicos sobre o proprietário."
                  color="amber"
                />
                <Owner
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              </div>
            ),
          },
        ]
      : []),

    {
      label: "Dados da propriedade",
      icon: Activity,
      content: (
        <div>
          <InfoSection
            title="Dados da propriedade"
            description="Dados básicos sobre a sua propriedade."
            color="amber"
          />

          <PropertyOwner
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },
    {
      label: "Uso e Exploração da Terra",
      icon: Sprout,
      content: (
        <div>
          <InfoSection
            title="Uso e Exploração da Terra"
            description="Dados sobre aquisição das terras, usso e exploração."
            color="amber"
          />
          <LandUseAndExplorationForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },
    {
      label: "Acessos",
      icon: Route,
      content: (
        <div>
          <InfoSection
            title="Uso e Exploração da Terra"
            description="Dados sobre aquisição das terras, usso e exploração."
            color="amber"
          />
          <AccessInformationForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },

    {
      label: "Registador",
      icon: ClipboardCheck,
      content: (
        <div>
          <InfoSection
            title="Dados do resgistador"
            description="Dados básicos sobre o responsavel pelo registro."
            color="amber"
          />

          <Responsible
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },
    {
      label: "Registador",
      icon: ClipboardCheck,
      content: (
        <div>
          <InfoSection
            title="Dados do resgistador"
            description="Dados básicos sobre o responsavel pelo registro."
            color="amber"
          />

          <Responsible
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },
    {
      label: "Registador",
      icon: ClipboardCheck,
      content: (
        <div>
          <InfoSection
            title="Dados do resgistador"
            description="Dados básicos sobre o responsavel pelo registro."
            color="amber"
          />

          <Responsible
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },
    {
      label: "Registador",
      icon: ClipboardCheck,
      content: (
        <div>
          <InfoSection
            title="Dados do resgistador"
            description="Dados básicos sobre o responsavel pelo registro."
            color="amber"
          />

          <Responsible
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        </div>
      ),
    },
  ];

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  /*const validateStep = (stepIndex, data) => {
    const newErrors = {};

    switch (stepIndex) {
      case 0:
        if (!data.nomeProdutor) newErrors.nomeProdutor = "Campo obrigatório";
        if (!data.numeroDocumento)
          newErrors.numeroDocumento = "Campo obrigatório";
        break;
      case 1:
        if (!data.tipoLicenca) newErrors.tipoLicenca = "Campo obrigatório";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };*/

  const validateStep = () => true;

  const handleSubmit = async () => {
    setLoading(true);
  };

  return (
    <div>
      <div>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div>
        {activeTab === "gestao" && (
          <div className="bg-white rounded-lg shadow-sm ">
            <div className="mt-6">
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>

              <PageHeader
                title="Gestão de Produtores "
                gradient="from-amber-800 to-amber-900"
                onExport={() => alert("Exportar dados")}
              />
            </div>
            <div>
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div>
              <GenericTable
                columns={columns}
                data={produtores}
                itemsPerPage={5}
                onRowClick={(row) => console.log("Clicou em:", row)}
                loading={isLoading}
              />
            </div>
          </div>
        )}

        {activeTab === "cadastro" && (
          <div className="bg-white rounded-lg shadow-sm">
            <MultiStepForm
              steps={steps}
              title="Cadastro de Produtor de café"
              subtitle="Sistema de Registro Nacional de produtores de café"
              formData={formData}
              loading={loading}
              validateStep={validateStep}
              onSubmit={handleSubmit}
              onStepChange={(index) => console.log("Mudou para etapa:", index)}
              submitButtonText="Cadastrar Produtor"
            />
          </div>
        )}
      </div>
    </div>
  );
}
