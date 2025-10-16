import PageHeader from "../components/pages/pageHeader";
import StatCard from "../components/pages/statCard";
import { Users, DollarSign, Package } from "lucide-react";
export default function Test() {
  const handleExport = () => {
    console.log("Exportar dados dos produtores");
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold">Test Page for Inca Module</h1>
      <p>This is a placeholder page for the Inca module.</p>
      <PageHeader
        title="Gestão de Produtores"
        gradientFrom="blue-700"
        gradientTo="blue-500"
      />
      <PageHeader
        title="Gestão de Produtores"
        gradientFrom="blue-700"
        gradientTo="blue-500"
        onExport={handleExport}
      />

      <div className="w-full flex justify-center bg-transparent pb-[30px] pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full"></div>

        <StatCard
          icon={Users}
          iconBgColor="green-100"
          iconColor="green-600"
          label="Ativos"
          value={1}
        />

        <StatCard
          icon={DollarSign}
          iconBgColor="red-100"
          iconColor="red-600"
          label="Receita"
          value={1}
        />

        <StatCard
          icon={Package}
          iconBgColor="purple-100"
          iconColor="purple-600"
          label="Produtos"
          value={1}
        />
      </div>
    </div>
  );
}
