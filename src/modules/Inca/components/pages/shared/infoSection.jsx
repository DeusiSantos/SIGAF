import React from "react";
import { FileText } from "lucide-react";

const InfoSection = ({
  title = "Informações Gerais",
  description = "Dados básicos sobre o registro da fonte de água para irrigação.",
  icon: Icon = FileText,
  color = "blue",
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-${color}-50 to-${color}-100 rounded-2xl p-6 mb-8 border border-${color}-100`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default InfoSection;
