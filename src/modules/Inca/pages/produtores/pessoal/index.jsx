import StatCard from "../../../components/pages/statCard";
import { AlertTriangle, CheckCircle, Clock, User, X } from "lucide-react";
import PageHeader from "../../../components/pages/pageHeader";
import TabNavigation from "../../../components/pages/tabNavigation";
import { Users, UserPlus } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [activeTab, setActiveTab] = useState("gestao");
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

  return (
    <div>
      <div>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-6">
        <PageHeader
          title="Gestão de Produtores "
          gradientFrom="amber-800"
          gradientTo="amber-900"
        />
      </div>

      <div>
        {activeTab === "gestao" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2>Conteúdo da Gestão</h2>
          </div>
        )}

        {activeTab === "cadastro" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2>Conteúdo do Cadastro</h2>
          </div>
        )}
      </div>
    </div>
  );
}
